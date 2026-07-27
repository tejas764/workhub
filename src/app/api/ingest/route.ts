import { NextResponse } from "next/server";
import { readPdf } from "@/lib/ingest";
import { chunkText } from "@/lib/chunker";
import { generateEmbedding } from "@/lib/embedding";
import { ingestDocument } from "@/lib/ingestion";

export async function GET() {
  try {
    const result = await ingestDocument(
        "cse/documents/WorkHub_AI_Sample_Department_Guidelines.pdf",
        "Department Operations Handbook",
        "2aa61d07-970f-44ee-be60-de5f87f1c12c"
    );

    return NextResponse.json(result);

  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : null,
      },
      { status: 500 }
    );
  }
}