"use client";

import { AppShell } from "@/components/AppShell";
import { Bot, CheckCircle2, Search } from "lucide-react";
import { useEffect, useState } from "react";

type OverviewProblem = {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  status: string;
};

type OverviewNote = {
  id: string;
};

type Overview = {
  profile: {
    name: string;
  };
  problems: OverviewProblem[];
  notes: OverviewNote[];
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const response = await fetch("/api/overview");

        if (!response.ok) {
          throw new Error("Failed to load overview");
        }

        const data = await response.json();
        setOverview(data);
      } finally {
        setIsLoading(false);
      }
    }

    loadOverview();
  }, []);

  const problems = overview?.problems ?? [];
  const notes = overview?.notes ?? [];

  const solvedCount = problems.filter((problem) => problem.status === "Solved").length;
  const inProgressCount = problems.filter(
    (problem) => problem.status === "In Progress"
  ).length;
  const recommendedProblems = problems.filter(
    (problem) => problem.status === "Recommended"
  );
  const totalProblems = problems.length;
  const progress =
    totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);

  const weakTopics = Array.from(
    new Set(
      problems
        .filter((problem) => problem.status !== "Solved")
        .map((problem) => problem.topic)
    )
  ).slice(0, 3);

  const stats = [
    { label: "Problems solved", value: `${solvedCount}` },
    { label: "In progress", value: `${inProgressCount}` },
    { label: "Roadmap progress", value: `${progress}%` },
    { label: "Saved notes", value: `${notes.length}` }
  ];

  const tasks = [
    "Review one weak topic",
    "Solve one recommended problem",
    "Add notes for today's mistake",
    "Ask AI Mentor for a hint before reading solution"
  ];

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">
          Welcome back, {overview?.profile.name ?? "Learner"}
        </p>
        <h2 className="mt-1 text-3xl font-bold">Today&apos;s DSA plan</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          {isLoading
            ? "Loading your saved learning data..."
            : "Your dashboard now reads from PostgreSQL."}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            className="rounded-lg border border-slate-800 bg-[#101a2d] p-4"
            key={stat.label}
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <h3 className="text-xl font-semibold">Daily recommendation</h3>

          <div className="mt-4 rounded-lg border border-slate-800 bg-[#16243a] p-4">
            <p className="text-sm text-slate-400">Recommended problem</p>

            {recommendedProblems[0] ? (
              <>
                <h4 className="mt-1 text-2xl font-bold">
                  {recommendedProblems[0].title}
                </h4>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Topic: {recommendedProblems[0].topic}. Difficulty:{" "}
                  {recommendedProblems[0].difficulty}. This problem is marked as
                  recommended and has not been solved yet.
                </p>
              </>
            ) : (
              <>
                <h4 className="mt-1 text-2xl font-bold">Pick a weak topic</h4>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Mark a problem as Recommended from the Problems page to see it here.
                </p>
              </>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {tasks.map((task) => (
              <div
                className="flex items-center gap-3 rounded-md border border-slate-800 px-3 py-3 text-sm text-slate-300"
                key={task}
              >
                <CheckCircle2 size={18} className="text-emerald-400" />
                {task}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <div className="mb-4 flex items-center gap-3">
            <Bot className="text-indigo-300" />
            <h3 className="text-xl font-semibold">AI Mentor memory</h3>
          </div>

          {[
            `Solved problems: ${solvedCount}`,
            `Saved notes: ${notes.length}`,
            `Weak topics: ${weakTopics.length ? weakTopics.join(", ") : "None yet"}`,
            "Solved questions are excluded from recommendations"
          ].map((item) => (
            <p
              className="mb-3 rounded-md bg-slate-900/60 px-3 py-3 text-sm text-slate-300"
              key={item}
            >
              {item}
            </p>
          ))}
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recent problems</h3>
          <div className="flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-400">
            <Search size={16} />
            Saved in database
          </div>
        </div>

        <div className="grid gap-3">
          {problems.slice(0, 3).map((problem) => (
            <div
              className="rounded-md border border-slate-800 p-4"
              key={problem.id}
            >
              <p className="font-semibold">{problem.title}</p>
              <p className="mt-1 text-sm text-slate-400">
                {problem.topic} - {problem.difficulty} - {problem.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}