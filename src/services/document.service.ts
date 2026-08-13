import { createClient } from "@/lib/supabase-client";
import { getBackendTable } from "@/services/backend-data.service";

export async function getDocuments() {
  return getBackendTable("documents");
}

export async function uploadDocument(
  file: File,
  metadata: {
    title: string;
    document_type: string;
    department_id: string;
  }
) {
  const supabase = createClient();

  const filePath =
    `${metadata.department_id}/documents/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        title: metadata.title,
        document_type: metadata.document_type,
        storage_path: filePath,
        department_id: metadata.department_id,
      },
    ])
    .select();

  if (error) throw error;

  return data;
}
