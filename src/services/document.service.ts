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
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", metadata.title);
  formData.append("document_type", metadata.document_type);
  formData.append("department_id", metadata.department_id);

  const response = await fetch("/api/documents/upload", {
    method: "POST",
    body: formData,
  });
  const payload = await response.json();

  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? "Document upload failed.");
  }

  return payload.data;
}
