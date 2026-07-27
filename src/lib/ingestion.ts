import { readPdf, supabase } from "./ingest";
import { chunkText } from "./chunker";
import { generateEmbedding } from "./embedding";

export async function ingestDocument(
  filePath: string,
  title: string,
  departmentId: string
) {
  const documentId = crypto.randomUUID();

  const text = await readPdf(filePath);

  
  // Delete existing chunks for this document
  const { error: deleteError } = await supabase
    .from("knowledge_items")
    .delete()
    .eq("source", "documents")
    .contains("metadata", { filePath });

    if (deleteError) {
    throw deleteError;
    }
  
  const chunks = chunkText(text);

  for (const chunk of chunks) {
    console.log(
      `Embedding ${chunk.chunkIndex + 1}/${chunks.length}`
    );

    const embedding = await generateEmbedding(chunk.content);

    const { error } = await supabase
      .from("knowledge_items")
      .insert({
        source: "documents",
        source_id: documentId,
        title,
        content: chunk.content,
        ai_summary: null,
        department_id: departmentId,
        embedding,
        chunk_index: chunk.chunkIndex,
        metadata: {
          filePath,
        },
      });

    if (error) {
      throw error;
    }
  }

  return {
    inserted: chunks.length,
    sourceId: documentId,
  };
}