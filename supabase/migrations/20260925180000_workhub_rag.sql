-- WorkHub AI RAG retrieval. This function runs as the calling authenticated
-- user, so existing RLS policies continue to apply.
create or replace function public.match_knowledge_items(
  query_embedding vector(3072),
  match_count integer default 5,
  match_threshold double precision default 0.70,
  filter_document_id uuid default null
)
returns table (
  knowledge_item_id uuid,
  document_id uuid,
  title text,
  content text,
  chunk_index integer,
  metadata jsonb,
  similarity double precision
)
language sql
stable
security invoker
set search_path = ''
as $$
  with limits as (
    select
      least(greatest(coalesce(match_count, 5), 1), 8) as result_count,
      least(greatest(coalesce(match_threshold, 0.70), 0), 1) as threshold,
      public.my_department_id() as department_id
  )
  select
    item.id as knowledge_item_id,
    item.source_id as document_id,
    item.title,
    item.content,
    item.chunk_index,
    item.metadata,
    1 - (item.embedding <=> query_embedding) as similarity
  from public.knowledge_items as item
  cross join limits
  where auth.uid() is not null
    and limits.department_id is not null
    and item.department_id = limits.department_id
    and item.source = 'documents'
    and (filter_document_id is null or item.source_id = filter_document_id)
    and 1 - (item.embedding <=> query_embedding) >= limits.threshold
  order by item.embedding <=> query_embedding asc
  limit (select result_count from limits);
$$;

revoke all on function public.match_knowledge_items(vector, integer, double precision, uuid) from public;
grant execute on function public.match_knowledge_items(vector, integer, double precision, uuid) to authenticated;
