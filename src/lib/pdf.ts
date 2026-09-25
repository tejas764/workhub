import PDFParser from "pdf2json";

export type ExtractedPdfPage = {
  pageNumber: number;
  text: string;
};

export async function extractPdfPages(buffer: Buffer): Promise<ExtractedPdfPage[]> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData));
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const pages = Array.isArray(pdfData?.Pages) ? pdfData.Pages : [];
      resolve(pages.map((page: any, index: number) => {
        let text = "";
        for (const item of page?.Texts ?? []) {
          for (const run of item?.R ?? []) {
            let value = run?.T ?? "";
            try { value = decodeURIComponent(value); } catch { /* Already plain text. */ }
            text += `${value} `;
          }
        }
        return { pageNumber: index + 1, text: text.trim() };
      }));
    });
    pdfParser.parseBuffer(buffer);
  });
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const pages = await extractPdfPages(buffer);
  return pages.map(page => page.text).filter(Boolean).join("\n\n");
}

export async function getPdfPageCount(buffer: Buffer): Promise<number> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData));
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      resolve(Array.isArray(pdfData?.Pages) ? pdfData.Pages.length : 0);
    });

    pdfParser.parseBuffer(buffer);
  });
}
