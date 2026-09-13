import { NextResponse } from "next/server";

type ChatMessage = {
  from?: "user" | "ai";
  role?: "user" | "assistant" | "system";
  text?: string;
  content?: string;
};

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-20b";

export const dynamic = "force-dynamic";

const toGroqMessage = (message: ChatMessage) => {
  const role =
    message.role ??
    (message.from === "ai" ? "assistant" : message.from === "user" ? "user" : undefined);
  const content = message.content ?? message.text;

  if (!role || !content?.trim()) return null;
  if (!["user", "assistant", "system"].includes(role)) return null;

  return {
    role,
    content: content.trim(),
  };
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = (body.messages ?? []).map(toGroqMessage).filter(Boolean);

    if (!messages.length) {
      return NextResponse.json({ error: "Send at least one message." }, { status: 400 });
    }

    const response = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? DEFAULT_MODEL,
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "You are WorkHub AI, a concise assistant for a college department management system. Help with documents, meetings, announcements, tasks, faculty workload, and department operations. If the user asks for unavailable private records, say what information would be needed instead of inventing facts.",
          },
          ...messages,
        ],
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error?.message ?? "Groq request failed." },
        { status: response.status }
      );
    }

    const answer = payload?.choices?.[0]?.message?.content;

    if (!answer) {
      return NextResponse.json({ error: "Groq returned an empty response." }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI chat failed." },
      { status: 500 }
    );
  }
}
