"use client";

import React, { useState } from "react";
import { Bot, Brain, FileText, Plus, RefreshCw, Send } from "lucide-react";
import { Avatar, Btn, ProgressBar } from "@/components/ui";
import { C } from "@/constants";
import { cn } from "@/lib/ui-utils";
import type { RagSource } from "@/types/rag";

type ChatEntry = { from: "user" | "ai"; text: string; sources?: RagSource[] };

const greeting: ChatEntry = {
  from: "ai",
  text: "Hello! I'm your WorkHub AI Knowledge Assistant. Ask about information in your department's uploaded documents.",
};

export function AIKnowledgePage() {
  const [query, setQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>([greeting]);
  const [latestSources, setLatestSources] = useState<RagSource[]>([]);

  const sendMessage = async () => {
    const question = query.trim();
    if (!question || isSending) return;

    const nextMessages = [...messages, { from: "user" as const, text: question }];
    setMessages([...nextMessages, { from: "ai", text: "Searching department knowledge…" }]);
    setQuery("");
    setIsSending(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? "Unable to answer this question.");
      const sources = Array.isArray(payload.sources) ? payload.sources as RagSource[] : [];
      setMessages([...nextMessages, { from: "ai", text: payload.answer, sources }]);
      setLatestSources(sources);
    } catch (error) {
      setMessages([...nextMessages, { from: "ai", text: error instanceof Error ? `AI error: ${error.message}` : "AI error: Unable to answer this question." }]);
      setLatestSources([]);
    } finally {
      setIsSending(false);
    }
  };

  const clearConversation = () => {
    setMessages([greeting]);
    setLatestSources([]);
  };

  return <div className="h-[calc(100vh-64px)] flex">
    <aside className="w-64 border-r bg-white flex flex-col flex-shrink-0" style={{ borderColor: C.border }}>
      <div className="p-4 border-b" style={{ borderColor: C.border }}><Btn variant="primary" size="sm" className="w-full justify-center" icon={Plus} onClick={clearConversation}>New Conversation</Btn></div>
      <div className="p-4">
        <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: C.textDisabled }}>Suggested Questions</p>
        {["What deadlines are mentioned in our documents?", "Summarize the uploaded department policy."].map(question =>
          <button key={question} onClick={() => setQuery(question)} className="w-full text-left text-xs font-medium px-3 py-2.5 mb-2 rounded-xl border" style={{ borderColor: C.border, color: C.textSecondary }}>{question}</button>
        )}
      </div>
    </aside>

    <main className="flex-1 flex flex-col min-w-0" style={{ background: C.bg }}>
      <header className="p-4 bg-white border-b flex items-center gap-3" style={{ borderColor: C.border }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${C.blue600},${C.blue400})` }}><Brain size={17} className="text-white" /></div>
        <div><p className="text-sm font-black" style={{ color: C.blue600 }}>WorkHub AI Knowledge Assistant</p><p className="text-xs" style={{ color: C.textMuted }}>Answers are grounded in retrieved department knowledge sources</p></div>
        <Btn variant="ghost" size="sm" className="ml-auto" icon={RefreshCw} onClick={clearConversation}>Clear</Btn>
      </header>
      <section className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((message, index) => <div key={index} className={cn("flex gap-3", message.from === "user" ? "flex-row-reverse" : "flex-row")}>
          {message.from === "ai" ? <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg,${C.blue600},${C.blue300})` }}><Bot size={14} className="text-white" /></div> : <Avatar name="Current User" size="sm" className="flex-shrink-0" />}
          <div className="max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm" style={message.from === "user" ? { background: C.blue500, color: "#fff" } : { background: "#fff", border: `1px solid ${C.border}`, color: C.textPrimary }}>
            {message.text}
            {message.from === "ai" && message.sources?.length ? <div className="mt-3 border-t pt-3 space-y-2" style={{ borderColor: C.border }}><p className="text-[10px] font-black uppercase tracking-wide" style={{ color: C.textMuted }}>Sources used</p>{message.sources.map(source => <SourceCitation key={source.knowledgeItemId} source={source} />)}</div> : null}
          </div>
        </div>)}
      </section>
      <footer className="p-4 bg-white border-t" style={{ borderColor: C.border }}>
        <div className="flex gap-3 items-end"><textarea value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Ask about your department knowledge..." className="flex-1 text-sm border rounded-2xl px-4 py-3 outline-none resize-none" style={{ borderColor: C.border }} rows={1} /><button onClick={() => void sendMessage()} disabled={isSending} className="w-11 h-11 rounded-2xl flex items-center justify-center disabled:opacity-60" style={{ background: `linear-gradient(135deg,${C.blue600},${C.blue200})` }}><Send size={17} className="text-white" /></button></div>
      </footer>
    </main>

    <aside className="w-72 border-l bg-white flex flex-col flex-shrink-0 overflow-y-auto" style={{ borderColor: C.border }}>
      <div className="p-4 border-b" style={{ borderColor: C.border }}><p className="text-xs font-black" style={{ color: C.textPrimary }}>Knowledge Sources</p><p className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>Actually used for the latest answer</p></div>
      <div className="p-4 space-y-3">{latestSources.length ? latestSources.map(source => <SourceCitation key={source.knowledgeItemId} source={source} />) : <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>Ask a question to see the retrieved department sources.</p>}</div>
    </aside>
  </div>;
}

function SourceCitation({ source }: { source: RagSource }) {
  const location = source.pageNumber ? `Page ${source.pageNumber}` : `Chunk ${source.chunkIndex}`;
  return <div className="rounded-xl border p-3" style={{ borderColor: C.border, background: C.bg }}>
    <div className="flex items-start gap-2"><FileText size={13} style={{ color: C.blue200 }} /><p className="text-xs font-bold leading-snug" style={{ color: C.textPrimary }}>{source.title}</p></div>
    <p className="mt-1 text-[10px]" style={{ color: C.textMuted }}>{location} · {Math.round(source.similarity * 100)}% relevance</p>
    <p className="mt-2 text-[10px] leading-relaxed line-clamp-3" style={{ color: C.textSecondary }}>{source.excerpt}</p>
  </div>;
}
