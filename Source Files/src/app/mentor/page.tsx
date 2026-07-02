"use client";

import { AppShell } from "@/components/AppShell";
import {
  Bot,
  Code2,
  Lightbulb,
  Loader2,
  Route,
  Send,
  Sparkles,
  Trash2,
  User
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "mentor";
  content: string;
};

const starterMessage: Message = {
  role: "mentor",
  content:
    "I am ready. Ask me for a hint, dry run, concept explanation, debugging help, or what to study next."
};

const quickPrompts = [
  {
    label: "Today's problems",
    icon: Sparkles,
    prompt: "Suggest 3 problems for today's DSA practice based on my profile."
  },
  {
    label: "Explain topic",
    icon: Lightbulb,
    prompt: "Explain sliding window with one simple example."
  },
  {
    label: "Give hint",
    icon: Bot,
    prompt: "Give me a hint for the problem I am currently solving."
  },
  {
    label: "Debug code",
    icon: Code2,
    prompt: "Help me debug my code. I will paste it next."
  },
  {
    label: "7-day plan",
    icon: Route,
    prompt: "Create a 7-day DSA practice plan for me."
  }
];

export default function MentorPage() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  async function loadHistory() {
    try {
      const response = await fetch("/api/mentor/history");
      const data = await response.json();

      if (Array.isArray(data.messages) && data.messages.length > 0) {
        setMessages(data.messages);
      }
    } catch {
      setMessages([starterMessage]);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function clearHistory() {
    const confirmed = window.confirm("Clear this mentor chat history?");

    if (!confirmed) return;

    try {
      const response = await fetch("/api/mentor/history", {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Could not clear mentor history.");
      }

      setMessages([starterMessage]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "mentor",
          content: "I could not clear the mentor history."
        }
      ]);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages, isSending]);

  async function handleSend(text?: string) {
    const userText = text || input;

    if (!userText.trim() || isSending) return;

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
          The mentor uses your database-backed profile, problems, notes, and catalog as context.
        </p>
      </header>

      <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-indigo-500 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSending || isLoadingHistory}
                  key={item.label}
                  onClick={() => handleSend(item.prompt)}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSending || isLoadingHistory}
            onClick={clearHistory}
          >
            <Trash2 size={15} />
            Clear chat
          </button>
        </div>

        <div className="min-h-96 space-y-4">
          {isLoadingHistory ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="animate-spin" size={16} />
              Loading mentor history...
            </div>
          ) : null}

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
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600">
                <Bot size={18} />
              </div>
              <div className="rounded-lg bg-slate-900 p-4 text-sm text-slate-400">
                Mentor is thinking...
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div className="mt-6 flex gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
            disabled={isLoadingHistory}
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
            disabled={isSending || isLoadingHistory}
            onClick={() => handleSend()}
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </section>
    </AppShell>
  );
}