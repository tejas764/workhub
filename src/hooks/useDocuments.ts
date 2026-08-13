import { useEffect, useState } from "react";
import {
  getDocuments,
  uploadDocument,
} from "@/services/document.service";
import { documentFromRow } from "@/lib/supabase-records";
import type { DocItem } from "@/types";

export function useDocuments(enabled = true) {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(enabled);

  async function loadDocuments() {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments((data ?? []).map((row, index) => documentFromRow(row, index)));
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
    void loadDocuments();
  }, [enabled]);

  return {
    documents,
    loading,
    refresh: loadDocuments,
    addDocument,
  };
}
