import { createServiceSupabaseClient, readPdf } from "./ingest";
import { chunkText } from "./chunker";
import { generateEmbedding } from "./embedding";

type IngestDocumentInput = {
  documentId: string;
  filePath: string;
  title: string;
  departmentId: string;
};

export async function ingestDocument({
  documentId,
  filePath,
  title,
  departmentId,
}: IngestDocumentInput) {
  const supabase = createServiceSupabaseClient();
  const text = await readPdf(filePath);
  const chunks = chunkText(text);

  if (!chunks.length) {
    throw new Error("No extractable text was found in this PDF.");
  }

  // Generate every embedding before replacing existing chunks, so a Gemini
  // failure does not remove a previously successful ingestion.
  const rows = [];

  for (const chunk of chunks) {
    rows.push({
      source: "documents",
      source_id: documentId,
      title,
      content: chunk.content,
      ai_summary: null,
      department_id: departmentId,
      embedding: await generateEmbedding(chunk.content),
      chunk_index: chunk.chunkIndex,
      metadata: { filePath },
    });
  }

  // source_id is the documents.id UUID. Reprocessing this document replaces
  // its old chunks rather than appending duplicates.
  const { error: deleteError } = await supabase
    .from("knowledge_items")
    .delete()
    .eq("source", "documents")
    .eq("source_id", documentId);

  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase
    .from("knowledge_items")
    .insert(rows);

  if (insertError) throw insertError;

  const { error: documentUpdateError } = await supabase
    .from("documents")
    .update({ extracted_text: text, updated_at: new Date().toISOString() })
    .eq("id", documentId);

  if (documentUpdateError) throw documentUpdateError;

  return {
    inserted: chunks.length,
    sourceId: documentId,
  };
}
