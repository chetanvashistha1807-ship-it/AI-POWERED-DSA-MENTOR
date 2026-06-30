"use client";

import { AppShell } from "@/components/AppShell";
import { useLearningStore } from "@/lib/use-learning-store";
import type { ProblemStatus } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function ProblemsPage() {
  const { problems, addProblem, updateProblemStatus } = useLearningStore();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [link, setLink] = useState("");

  function handleAddProblem() {
    if (!title.trim() || !topic.trim()) return;

    addProblem({
      title,
      topic,
      difficulty,
      status: "Not Started",
      link
    });

    setTitle("");
    setTopic("");
    setDifficulty("Easy");
    setLink("");
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Problem Library</p>
        <h2 className="mt-1 text-3xl font-bold">Track every DSA question</h2>
        <p className="mt-2 text-sm text-slate-400">
          Add LeetCode problems, track status, and avoid repeated recommendations.
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

        <button
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
          onClick={handleAddProblem}
        >
          <Plus size={18} />
          Add problem
        </button>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#101a2d]">
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
                    <a className="hover:text-indigo-300" href={problem.link} target="_blank">
                      {problem.title}
                    </a>
                  ) : (
                    problem.title
                  )}
                </td>
                <td className="px-4 py-4 text-slate-300">{problem.topic}</td>
                <td className="px-4 py-4 text-slate-300">{problem.difficulty}</td>
                <td className="px-4 py-4">
                  <select
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                    value={problem.status}
                    onChange={(event) =>
                      updateProblemStatus(problem.id, event.target.value as ProblemStatus)
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
      </section>
    </AppShell>
  );
}