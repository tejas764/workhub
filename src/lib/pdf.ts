import PDFParser from "pdf2json";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      let text = "";

      if (!pdfData?.Pages) {
        resolve("");
        return;
      }

      for (const page of pdfData.Pages) {
        if (!page.Texts) continue;

        for (const item of page.Texts) {
          if (!item.R) continue;

          for (const run of item.R) {
            let value = run.T;

            try {
                value = decodeURIComponent(value);
            } catch {
                // Already plain text
            }

            text += value + " ";
            }
        }

        text += "\n";
      }

      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}