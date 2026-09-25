import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateEmbedding } from "@/lib/embedding";
import type { RagSource } from "@/types/rag";

export const RAG_MATCH_COUNT = 5;
export const RAG_SIMILARITY_THRESHOLD = 0.70;
const VECTOR_DIMENSION = 3072;
const MAX_CONTEXT_CHARS_PER_SOURCE = 1_400;
const MAX_EXCERPT_CHARS = 360;

type RetrievedRow = {
  knowledge_item_id: unknown;
  document_id: unknown;
  title: unknown;
  content: unknown;
  chunk_index: unknown;
  metadata: unknown;
  similarity: unknown;
};

export type RetrievedRagChunk = {
  source: RagSource;
  content: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const cleanText = (value: unknown) => typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

const bounded = (value: string, length: number) =>
  value.length <= length ? value : `${value.slice(0, Math.max(0, length - 1)).trimEnd()}…`;

function pageNumberFromMetadata(metadata: unknown): number | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const value = (metadata as Record<string, unknown>).pageNumber;
  const pageNumber = typeof value === "number" ? value : Number(value);
  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : null;
}

function normalizeRow(row: RetrievedRow): RetrievedRagChunk | null {
  const knowledgeItemId = cleanText(row.knowledge_item_id);
  const documentId = cleanText(row.document_id);
  const title = cleanText(row.title) || "Untitled document";
  const content = cleanText(row.content);
  const chunkIndex = Number(row.chunk_index);
  const similarity = Number(row.similarity);

  if (!UUID_RE.test(knowledgeItemId) || !UUID_RE.test(documentId) || !content || !Number.isInteger(chunkIndex)
    || !Number.isFinite(similarity) || similarity < 0 || similarity > 1) return null;

  return {
    content: bounded(content, MAX_CONTEXT_CHARS_PER_SOURCE),
    source: {
      knowledgeItemId,
      documentId,
      title,
      pageNumber: pageNumberFromMetadata(row.metadata),
      chunkIndex,
      excerpt: bounded(content, MAX_EXCERPT_CHARS),
      similarity: Number(similarity.toFixed(4)),
    },
  };
}

export async function requireRagUser() {
  const supabase = await createServerSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new RagError("Authentication required.", 401);

  const { data: faculty, error: facultyError } = await supabase
    .from("faculty")
    .select("department_id")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (facultyError) throw new RagError("Unable to verify department access.", 403);
  const departmentId = cleanText(faculty?.department_id);
  if (!UUID_RE.test(departmentId)) throw new RagError("Your account does not have a department assigned.", 403);

  return { supabase, user: authData.user, departmentId };
}

export async function verifyDocumentAccess(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  documentId: string
) {
  if (!UUID_RE.test(documentId)) throw new RagError("Document selection is invalid.", 400);
  const { data, error } = await supabase.from("documents").select("id").eq("id", documentId).maybeSingle();
  if (error || !data) throw new RagError("Document is not available to your account.", 403);
}

export async function retrieveRagChunks(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  question: string,
  documentId?: string
): Promise<RetrievedRagChunk[]> {
  let embedding: number[];
  try {
    embedding = await generateEmbedding(question);
  } catch {
    throw new RagError("Unable to search the department knowledge base right now.", 502);
  }

  if (embedding.length !== VECTOR_DIMENSION || embedding.some(value => !Number.isFinite(value))) {
    throw new RagError("Unable to search the department knowledge base right now.", 502);
  }

  const { data, error } = await supabase.rpc("match_knowledge_items", {
    query_embedding: embedding,
    match_count: RAG_MATCH_COUNT,
    match_threshold: RAG_SIMILARITY_THRESHOLD,
    filter_document_id: documentId ?? null,
  });
  if (error) throw new RagError("Unable to retrieve department knowledge right now.", 502);

  return (Array.isArray(data) ? data : [])
    .map(row => normalizeRow(row as RetrievedRow))
    .filter((row): row is RetrievedRagChunk => row !== null);
}

export function buildGroundedContext(chunks: RetrievedRagChunk[]) {
  return chunks.map((chunk, index) => {
    const location = chunk.source.pageNumber ? `page ${chunk.source.pageNumber}` : `chunk ${chunk.source.chunkIndex}`;
    return `[SOURCE ${index + 1}: ${chunk.source.title}; ${location}]\n${chunk.content}`;
  }).join("\n\n---\n\n");
}

export class RagError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}
