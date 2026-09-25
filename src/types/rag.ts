export type ChatMessageInput = {
  from?: "user" | "ai";
  role?: "user" | "assistant";
  text?: string;
  content?: string;
};

export type RagChatRequest = {
  messages?: ChatMessageInput[];
  documentId?: string;
};

export type RagSource = {
  knowledgeItemId: string;
  documentId: string;
  title: string;
  pageNumber: number | null;
  chunkIndex: number;
  excerpt: string;
  similarity: number;
};

export type RagRetrieval = {
  found: boolean;
  sourceCount: number;
};

export type RagChatResponse = {
  answer: string;
  sources: RagSource[];
  retrieval: RagRetrieval;
};
