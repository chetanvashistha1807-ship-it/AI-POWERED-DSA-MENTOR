"use client";

import { AppShell } from "@/components/AppShell";
import { Bot, Send, User } from "lucide-react";
import { useState } from "react";

type Message = {
  role: "user" | "mentor";
  content: string;
};

export default function MentorPage() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "mentor",
      content:
        "I am ready. Ask me for a hint, dry run, concept explanation, debugging help, or what to study next."
    }
  ]);

  async function handleSend() {
    if (!input.trim() || isSending) return;

    const userText = input;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: userText
      }
    ]);

    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userText
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.details ||
            errorData?.error ||
            "Failed to get mentor response"
        );
      }

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "mentor",
          content: data.reply
        }
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown mentor error";

      setMessages((current) => [
        ...current,
        {
          role: "mentor",
          content: `I could not reach the AI service.\n\n${errorMessage}`
        }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">AI Mentor</p>
        <h2 className="mt-1 text-3xl font-bold">Ask for hints, not spoilers</h2>
        <p className="mt-2 text-sm text-slate-400">
          The mentor uses your database-backed profile, problems, and notes as context.
        </p>
      </header>

      <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <div className="min-h-96 space-y-4">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                className={`flex gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
                key={`${message.role}-${index}`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-2xl whitespace-pre-wrap rounded-lg p-4 text-sm leading-6 ${
                    isUser
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 text-slate-300"
                  }`}
                >
                  {message.content}
                </div>

                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {isSending ? (
            <p className="text-sm text-slate-400">Mentor is thinking...</p>
          ) : null}
        </div>

        <div className="mt-6 flex gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
            placeholder="Ask your mentor about a topic, hint, bug, or solution idea..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSend();
              }
            }}
          />

          <button
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSending}
            onClick={handleSend}
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </section>
    </AppShell>
  );
}