"use client";

import { AppShell } from "@/components/AppShell";
import type { ProblemStatus } from "@/lib/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

type DbProblem = {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: ProblemStatus;
  link: string | null;
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState<DbProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [link, setLink] = useState("");

  async function loadProblems() {
    try {
      const response = await fetch("/api/problems");

      if (!response.ok) {
        throw new Error("Failed to load problems");
      }

      const data = await response.json();
      setProblems(data);
    } catch {
      setMessage("Could not load problems.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProblems();
  }, []);

  async function handleAddProblem() {
    if (!title.trim() || !topic.trim()) return;

    setMessage("");

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          topic,
          difficulty,
          status: "Not Started",
          link
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add problem");
      }

      const createdProblem = await response.json();

      setProblems((current) => [createdProblem, ...current]);

      setTitle("");
      setTopic("");
      setDifficulty("Easy");
      setLink("");
      setMessage("Problem saved to database.");
    } catch {
      setMessage("Could not save problem.");
    }
  }

  async function updateProblemStatus(id: string, status: ProblemStatus) {
    setMessage("");

    try {
      const response = await fetch("/api/problems", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          status
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update problem");
      }

      const updatedProblem = await response.json();

      setProblems((current) =>
        current.map((problem) =>
          problem.id === id ? updatedProblem : problem
        )
      );
    } catch {
      setMessage("Could not update problem.");
    }
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Problem Library</p>
        <h2 className="mt-1 text-3xl font-bold">Track every DSA question</h2>
        <p className="mt-2 text-sm text-slate-400">
          Problems are now saved in PostgreSQL for your logged-in account.
        </p>
      </header>

      <section className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <h3 className="mb-4 text-xl font-semibold">Add a problem</h3>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
            placeholder="Problem title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
            placeholder="Topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          />

          <select
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
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
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
            placeholder="LeetCode link"
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
            onClick={handleAddProblem}
          >
            <Plus size={18} />
            Add problem
          </button>

          {message ? (
            <p className="text-sm text-slate-400">{message}</p>
          ) : null}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#101a2d]">
        {isLoading ? (
          <p className="p-5 text-sm text-slate-400">Loading problems...</p>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Problem</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr className="border-t border-slate-800" key={problem.id}>
                  <td className="px-4 py-4 font-medium">
                    {problem.link ? (
                      <a
                        className="hover:text-indigo-300"
                        href={problem.link}
                        target="_blank"
                      >
                        {problem.title}
                      </a>
                    ) : (
                      problem.title
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-300">{problem.topic}</td>
                  <td className="px-4 py-4 text-slate-300">
                    {problem.difficulty}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                      value={problem.status}
                      onChange={(event) =>
                        updateProblemStatus(
                          problem.id,
                          event.target.value as ProblemStatus
                        )
                      }
                    >
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Solved</option>
                      <option>Recommended</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AppShell>
  );
}