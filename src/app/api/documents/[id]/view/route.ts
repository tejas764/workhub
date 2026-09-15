import { NextRequest, NextResponse } from "next/server";
import { getPdfPageCount } from "@/lib/pdf";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const STORAGE_BUCKET = "documents";

const downloadFileName = (title: string) =>
  title.replace(/[\\/:*?"<>|\r\n]+/g, "-").trim() || "document.pdf";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    if (authError) {
      console.error("Document view failed during authentication", {
        operation: "auth.getUser",
        message: authError.message,
      });
    }
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("id, title, storage_path")
    .eq("id", params.id)
    .maybeSingle();

  if (documentError) {
    console.error("Document view failed during document lookup", {
      operation: "documents.select",
      code: documentError.code,
      message: documentError.message,
    });
    return NextResponse.json({ error: documentError.message }, { status: 500 });
  }

  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const { data: file, error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(document.storage_path);

  if (storageError || !file) {
    if (storageError) {
      console.error("Document view failed during storage download", {
        operation: "storage.download",
        code: storageError.name,
        message: storageError.message,
      });
    }
    return NextResponse.json(
      { error: storageError?.message ?? "Document file could not be retrieved." },
      { status: 404 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (request.nextUrl.searchParams.get("metadata") === "1") {
    try {
      const pageCount = await getPdfPageCount(buffer);
      return NextResponse.json({ id: document.id, pageCount });
    } catch (error) {
      console.error("Document view failed during PDF metadata parsing", {
        operation: "pdf.pageCount",
        message: error instanceof Error ? error.message : "Unknown PDF metadata error.",
      });
      return NextResponse.json({ error: "The PDF metadata could not be read." }, { status: 422 });
    }
  }

  const isDownload = request.nextUrl.searchParams.get("download") === "1";
  const fileName = downloadFileName(document.title).replace(/"/g, "-");
  const contentType = file.type || "application/octet-stream";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buffer.byteLength),
      "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
