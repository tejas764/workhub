import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ingestDocument } from "@/lib/ingestion";

export const dynamic = "force-dynamic";

const STORAGE_BUCKET = "documents";
const STORAGE_FOLDER = "cse/documents";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const safeFileName = (name: string) =>
  name.replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").trim() || "document";

const documentTypeFromName = (name: string, mimeType: string) => {
  const extension = name.includes(".") ? name.split(".").pop()?.trim() : "";
  if (extension) return extension.toUpperCase();
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.startsWith("text/")) return "TXT";
  if (mimeType.startsWith("image/")) return "IMAGE";
  return "Document";
};

const isPdf = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) {
    throw new Error("Server Supabase credentials are not configured.");
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function resolveDepartmentId(
  adminClient: ReturnType<typeof createAdminClient>,
  userId: string,
  email?: string,
  requestedDepartmentId?: string
) {
  const facultyQuery = adminClient
    .from("faculty")
    .select("department_id")
    .or(`user_id.eq.${userId},email.eq.${email ?? ""}`)
    .maybeSingle();

  const { data: faculty, error: facultyError } = await facultyQuery;

  if (facultyError) throw facultyError;
  if (faculty?.department_id && UUID_RE.test(String(faculty.department_id))) {
    return String(faculty.department_id);
  }

  if (requestedDepartmentId && UUID_RE.test(requestedDepartmentId)) {
    return requestedDepartmentId;
  }

  const { data: cseDepartment, error: departmentError } = await adminClient
    .from("departments")
    .select("id")
    .eq("code", "CSE")
    .maybeSingle();

  if (departmentError) throw departmentError;
  if (cseDepartment?.id) return String(cseDepartment.id);

  throw new Error("Could not resolve a valid department for this upload.");
}

export async function POST(request: NextRequest) {
  const authClient = await createServerSupabaseClient();
  const { data: authData, error: authError } = await authClient.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let filePath = "";

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Document file is required." }, { status: 400 });
    }

    const originalFileName = safeFileName(file.name);
    const timestamp = Date.now();
    filePath = `${STORAGE_FOLDER}/${timestamp}-${originalFileName}`;

    const adminClient = createAdminClient();
    const departmentId = await resolveDepartmentId(
      adminClient,
      authData.user.id,
      authData.user.email,
      String(formData.get("department_id") ?? "")
    );

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await adminClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data, error: insertError } = await adminClient
      .from("documents")
      .insert({
        title: file.name,
        document_type: documentTypeFromName(file.name, file.type),
        storage_path: filePath,
        extracted_text: null,
        ai_summary: null,
        department_id: departmentId,
      })
      .select("*, departments(id, name, code)")
      .single();

    if (insertError) {
      const { error: cleanupError } = await adminClient.storage.from(STORAGE_BUCKET).remove([filePath]);
      const cleanupMessage = cleanupError ? ` Uploaded file cleanup also failed: ${cleanupError.message}` : "";
      throw new Error(`${insertError.message}${cleanupMessage}`);
    }

    if (!isPdf(file)) {
      return NextResponse.json({
        data,
        ingestion: {
          status: "skipped",
          reason: "Automatic ingestion is currently available for PDF documents only.",
        },
      });
    }

    try {
      const ingestion = await ingestDocument({
        documentId: data.id,
        filePath,
        title: data.title,
        departmentId,
      });

      return NextResponse.json({
        data,
        ingestion: { status: "completed", ...ingestion },
      });
    } catch (ingestionError) {
      console.error("Document ingestion failed:", ingestionError);
      return NextResponse.json(
        {
          error: "Document was uploaded, but automatic PDF ingestion failed.",
          documentId: data.id,
          storagePath: filePath,
          ingestion: {
            status: "failed",
            message: ingestionError instanceof Error ? ingestionError.message : "Unknown ingestion error.",
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Document upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Document upload failed." },
      { status: 500 }
    );
  }
}
