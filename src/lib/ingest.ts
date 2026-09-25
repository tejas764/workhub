import { createClient } from "@supabase/supabase-js";
import { extractPdfPages, extractPdfText } from "./pdf";

export function createServiceSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase ingestion requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, key);
}

export async function downloadPdf(path: string) {
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .download(path);

  if (error) throw error;

  return Buffer.from(await data.arrayBuffer());
}

export async function readPdf(path: string) {
  const buffer = await downloadPdf(path);

  return extractPdfText(buffer);
}

export async function readPdfPages(path: string) {
  const buffer = await downloadPdf(path);
  return extractPdfPages(buffer);
}
