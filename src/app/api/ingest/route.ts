import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      error: "This development-only ingestion endpoint is obsolete. Upload a PDF through /api/documents/upload instead.",
    },
    { status: 410 }
  );
}
