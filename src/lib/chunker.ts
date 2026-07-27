export interface TextChunk {
  chunkIndex: number;
  content: string;
}

export function chunkText(
  text: string,
  maxChunkSize = 900
): TextChunk[] {
  // Normalize whitespace while preserving paragraphs
  const cleaned = text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();

  // Split on blank lines first
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const chunks: TextChunk[] = [];

  let current = "";
  let index = 0;

  for (const paragraph of paragraphs) {
    // If adding this paragraph keeps us under the limit,
    // merge it into the current chunk.
    if ((current + " " + paragraph).length <= maxChunkSize) {
      current += (current ? "\n\n" : "") + paragraph;
      continue;
    }

    // Save previous chunk
    if (current) {
      chunks.push({
        chunkIndex: index++,
        content: current,
      });
    }

    // Handle very large paragraphs
    if (paragraph.length <= maxChunkSize) {
      current = paragraph;
    } else {
      let start = 0;

      while (start < paragraph.length) {
        let end = Math.min(start + maxChunkSize, paragraph.length);

        // Prefer ending at a sentence
        if (end < paragraph.length) {
            // Prefer sentence boundary
            const lastPeriod = paragraph.lastIndexOf(".", end);

            if (lastPeriod > start + 300) {
                end = lastPeriod + 1;
            } else {
                // Otherwise split at the last space so words aren't broken
                const lastSpace = paragraph.lastIndexOf(" ", end);

                if (lastSpace > start + 300) {
                    end = lastSpace;
                }
            }
        }

        chunks.push({
          chunkIndex: index++,
          content: paragraph.slice(start, end).trim(),
        });

        start = end;
      }

      current = "";
    }
  }

  if (current) {
    chunks.push({
      chunkIndex: index,
      content: current,
    });
  }

  return chunks;
}