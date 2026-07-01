"use client";

import { AppShell } from "@/components/AppShell";
import { useLearningStore } from "@/lib/use-learning-store";
import { Bot, Send, User } from "lucide-react";
import { useState } from "react";

type Message = {
  role: "user" | "mentor";
  content: string;
};

function buildMentorReply(input: string, weakTopics: string[]) {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("hint")) {
    return "Start by identifying what changes after each step. I will not give the full solution yet. Try defining the state of the problem and what makes a move valid.";
  }

  if (lowerInput.includes("sliding")) {
    return "For Sliding Window, keep one rule in mind: expand the right side to explore, shrink the left side when the window becomes invalid. The hard part is defining 'invalid' for the problem.";
  }

  if (lowerInput.includes("dp") || lowerInput.includes("dynamic")) {
    return "For DP, ask three questions: what is the state, what is the transition, and what is the base case? If you cannot define the state clearly, do not write code yet.";
  }

  if (lowerInput.includes("graph")) {
    return "For Graphs, first decide traversal type: BFS for shortest steps in unweighted graphs, DFS for exploring connected structure. Always track visited nodes carefully.";
  }

  if (weakTopics.length > 0) {
    return `Based on your current progress, I would focus on ${weakTopics[0]} next. Try one easy/medium problem, then write a note about the mistake you made.`;
  }

  return "Tell me the topic, your current approach, and where you are stuck. I will guide you with hints before giving a full solution.";
}

export default function MentorPage() {
  const { problems } = useLearningStore();

  const weakTopics = Array.from(
    new Set(
      problems
        .filter((problem) => problem.status !== "Solved")
        .map((problem) => problem.topic)
    )
  );

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "mentor",
      content:
        "I am ready. Ask me for a hint, dry run, concept explanation, or debugging help."
    }
  ]);

  function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input
    };

    const mentorMessage: Message = {
      role: "mentor",
      content: buildMentorReply(input, weakTopics)
    };

    setMessages((current) => [...current, userMessage, mentorMessage]);
    setInput("");
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">AI Mentor</p>
        <h2 className="mt-1 text-3xl font-bold">Ask for hints, not spoilers</h2>
        <p className="mt-2 text-sm text-slate-400">
          This is a local mentor simulation. Later we will connect it to the real OpenAI API.
        </p>
      </header>

      <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <div className="min-h-96 space-y-4">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                key={`${message.role}-${index}`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-lg p-4 text-sm leading-6 ${
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
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
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