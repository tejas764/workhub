import { createClient } from "@supabase/supabase-js";
import { extractPdfText } from "./pdf";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function downloadPdf(path: string) {
  const { data, error } = await supabase.storage
    .from("documents")
    .download(path);

  if (error) throw error;

  return Buffer.from(await data.arrayBuffer());
}

export async function readPdf(path: string) {
  const buffer = await downloadPdf(path);

  const text = await extractPdfText(buffer);

    console.log(text);

    return text;
}