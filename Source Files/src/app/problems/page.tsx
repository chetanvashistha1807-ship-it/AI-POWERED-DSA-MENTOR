"use client";

import { AppShell } from "@/components/AppShell";
import {
  Bot,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Loader2,
  Plus,
  Target
} from "lucide-react";
import { useEffect, useState } from "react";

type Problem = {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: string;
  link?: string | null;
  isTodayGoal?: boolean;
};

type SuggestedProblem = {
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link: string;
  reason: string;
};

const difficultyStyles = {
  Easy: "bg-emerald-500/15 text-emerald-300",
  Medium: "bg-amber-500/15 text-amber-300",
  Hard: "bg-rose-500/15 text-rose-300"
};

const focusModes = [
  {
    label: "Beginner practice",
    prompt:
      "Suggest 3 beginner-friendly LeetCode problems for building DSA fundamentals."
  },
  {
    label: "Weak topics",
    prompt:
      "Suggest 3 LeetCode problems that help me improve my weakest DSA topics based on my saved problems."
  },
  {
    label: "Interview prep",
    prompt:
      "Suggest 3 interview-style LeetCode problems that are commonly useful for placement preparation."
  },
  {
    label: "Revision",
    prompt:
      "Suggest 3 revision problems from different topics so I can maintain consistency."
  },
  {
    label: "Hard challenge",
    prompt:
      "Suggest 3 challenging LeetCode problems, but keep them reasonable for my current profile."
  }
];

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedProblem[]>([]);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy"
  );
  const [link, setLink] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProblems() {
    const response = await fetch("/api/problems");
    const data = await response.json();

    setProblems(Array.isArray(data) ? data : data.problems || []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadProblems();
  }, []);

  async function addProblem(problem: {
    title: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    link?: string;
    status?: string;
    isTodayGoal?: boolean;
  }) {
    setIsAdding(true);
    setMessage("");

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: problem.title,
          topic: problem.topic,
          difficulty: problem.difficulty,
          link: problem.link || "",
          status: problem.status || "Recommended",
          isTodayGoal: Boolean(problem.isTodayGoal)
        })
      });

      if (!response.ok) {
        throw new Error("Could not add problem.");
      }

      await loadProblems();
      setMessage(
        problem.isTodayGoal
          ? "Problem added to today's goal."
          : "Problem added to your list."
      );
    } catch {
      setMessage("Could not add problem.");
    } finally {
      setIsAdding(false);
    }
  }

  async function updateProblemStatus(id: string, status: string) {
    setMessage("");

    try {
      const response = await fetch(`/api/problems/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status
        })
      });

      if (!response.ok) {
        throw new Error("Could not update status.");
      }

      await loadProblems();
      setMessage("Problem status updated.");
    } catch {
      setMessage("Could not update status.");
    }
  }

  async function updateTodayGoal(id: string, isTodayGoal: boolean) {
    setMessage("");

    try {
      const response = await fetch(`/api/problems/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isTodayGoal
        })
      });

      if (!response.ok) {
        throw new Error("Could not update today's goal.");
      }

      await loadProblems();
      setMessage(isTodayGoal ? "Added to today's goal." : "Removed from today's goal.");
    } catch {
      setMessage("Could not update today's goal.");
    }
  }

  async function handleManualAdd() {
    if (!title.trim() || !topic.trim()) {
      setMessage("Please add a title and topic.");
      return;
    }

    await addProblem({
      title,
      topic,
      difficulty,
      link,
      status: "Recommended"
    });

    setTitle("");
    setTopic("");
    setDifficulty("Easy");
    setLink("");
  }

  async function getAiSuggestions() {
    setIsSuggesting(true);
    setMessage("");

    try {
      const response = await fetch("/api/mentor/problem-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt:
            aiPrompt ||
            "Suggest 3 useful LeetCode problems for my current DSA practice."
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not get AI suggestions.");
      }

      setSuggestions(data.suggestions || []);
      setMessage("AI suggestions ready.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not get AI suggestions."
      );
    } finally {
      setIsSuggesting(false);
    }
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Problems</p>
        <h2 className="mt-1 text-3xl font-bold">Your practice list</h2>
        <p className="mt-2 text-sm text-slate-400">
          Add problems manually, update status, or let AI suggest real LeetCode problems.
        </p>
      </header>

      <section className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bot className="text-indigo-300" size={20} />
          <h3 className="text-xl font-semibold">AI problem suggestions</h3>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {focusModes.map((mode) => (
            <button
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-indigo-500 hover:bg-slate-900 hover:text-white"
              key={mode.label}
              onClick={() => setAiPrompt(mode.prompt)}
            >
              <Target size={14} />
              {mode.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-500"
            placeholder="Example: suggest 3 graph problems for beginners"
            value={aiPrompt}
            onChange={(event) => setAiPrompt(event.target.value)}
          />

          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSuggesting}
            onClick={getAiSuggestions}
          >
            {isSuggesting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Lightbulb size={16} />
            )}
            Suggest problems
          </button>
        </div>

        {suggestions.length > 0 ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {suggestions.map((problem) => (
              <article
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                key={`${problem.title}-${problem.link}`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">{problem.title}</h4>
                    <p className="mt-1 text-sm text-slate-400">{problem.topic}</p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      difficultyStyles[problem.difficulty]
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                <p className="min-h-12 text-sm leading-6 text-slate-400">
                  {problem.reason}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    href={problem.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink size={15} />
                    LeetCode
                  </a>

                  <button
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isAdding}
                    onClick={() =>
                      addProblem({
                        title: problem.title,
                        topic: problem.topic,
                        difficulty: problem.difficulty,
                        link: problem.link,
                        status: "Recommended"
                      })
                    }
                  >
                    <Plus size={15} />
                    Add to Problems
                  </button>

                  <button
                    className="inline-flex items-center gap-2 rounded-md border border-indigo-500 px-3 py-2 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isAdding}
                    onClick={() =>
                      addProblem({
                        title: problem.title,
                        topic: problem.topic,
                        difficulty: problem.difficulty,
                        link: problem.link,
                        status: "Recommended",
                        isTodayGoal: true
                      })
                    }
                  >
                    <CheckCircle2 size={15} />
                    Add to Today
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <h3 className="mb-4 text-xl font-semibold">Add a problem</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-500"
            placeholder="Problem title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-500"
            placeholder="Topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          />

          <select
            className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value as "Easy" | "Medium" | "Hard")
            }
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-500"
            placeholder="LeetCode link"
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
        </div>

        <div className="mt-5 flex items-center gap-4">
          <button
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isAdding}
            onClick={handleManualAdd}
          >
            <Plus size={16} />
            Add problem
          </button>

          {message ? <p className="text-sm text-slate-400">{message}</p> : null}
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <h3 className="mb-4 text-xl font-semibold">Saved problems</h3>

        {isLoading ? (
          <p className="text-sm text-slate-400">Loading problems...</p>
        ) : problems.length === 0 ? (
          <p className="text-sm text-slate-400">No problems added yet.</p>
        ) : (
          <div className="space-y-3">
            {problems.map((problem) => (
              <article
                className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between"
                key={problem.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold">{problem.title}</h4>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        difficultyStyles[problem.difficulty]
                      }`}
                    >
                      {problem.difficulty}
                    </span>

                    {problem.isTodayGoal ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2 py-1 text-xs font-semibold text-indigo-300">
                        <CheckCircle2 size={13} />
                        Today
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <p className="text-sm text-slate-400">{problem.topic}</p>

                    <select
                      className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
                      value={problem.status}
                      onChange={(event) =>
                        updateProblemStatus(problem.id, event.target.value)
                      }
                    >
                      <option>Recommended</option>
                      <option>In Progress</option>
                      <option>Solved</option>
                      <option>Skipped</option>
                      <option>Not Started</option>
                    </select>

                    <button
                      className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                      onClick={() =>
                        updateTodayGoal(problem.id, !problem.isTodayGoal)
                      }
                    >
                      {problem.isTodayGoal ? "Remove from Today" : "Add to Today"}
                    </button>
                  </div>
                </div>

                {problem.link ? (
                  <a
                    className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200"
                    href={problem.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open problem
                    <ExternalLink size={15} />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}