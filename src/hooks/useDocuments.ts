import { useEffect, useState } from "react";
import {
  getDocuments,
  uploadDocument,
} from "@/services/document.service";

export function useDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDocuments() {
    try {
      const data = await getDocuments();
      setDocuments(data ?? []);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addDocument(
    file: File,
    metadata: any
  ) {
    await uploadDocument(file, metadata);
    await loadDocuments();
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  return {
    documents,
    loading,
    refresh: loadDocuments,
    addDocument,
  };
}