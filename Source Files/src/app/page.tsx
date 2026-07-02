"use client";

import { AppShell } from "@/components/AppShell";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Target,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Problem = {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: string;
  link?: string | null;
  isTodayGoal?: boolean;
};

type Overview = {
  profile: {
    name: string;
    goal: string;
    skillLevel: string;
    dailyGoal: string;
    preferredLanguage: string;
  } | null;
  problems: Problem[];
  notes: unknown[];
};

const difficultyStyles = {
  Easy: "bg-emerald-500/15 text-emerald-300",
  Medium: "bg-amber-500/15 text-amber-300",
  Hard: "bg-rose-500/15 text-rose-300"
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [message, setMessage] = useState("");

  async function loadOverview() {
    const response = await fetch("/api/overview");
    const data = await response.json();

    setOverview(data);
  }

  useEffect(() => {
    loadOverview();
  }, []);

  const problems = overview?.problems || [];
  const todayGoals = useMemo(
    () => problems.filter((problem) => problem.isTodayGoal),
    [problems]
  );

  const solvedCount = problems.filter((problem) => problem.status === "Solved").length;
  const inProgressCount = problems.filter(
    (problem) => problem.status === "In Progress"
  ).length;
  const todaySolvedCount = todayGoals.filter(
    (problem) => problem.status === "Solved"
  ).length;

  const todayProgress =
    todayGoals.length > 0
      ? Math.round((todaySolvedCount / todayGoals.length) * 100)
      : 0;

  async function updateProblem(
    id: string,
    data: {
      status?: string;
      isTodayGoal?: boolean;
    }
  ) {
    setMessage("");

    try {
      const response = await fetch(`/api/problems/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Could not update problem.");
      }

      await loadOverview();
      setMessage("Updated.");
    } catch {
      setMessage("Could not update problem.");
    }
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Dashboard</p>
        <h2 className="mt-1 text-3xl font-bold">
          Welcome back{overview?.profile?.name ? `, ${overview.profile.name}` : ""}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Track today&apos;s target, current progress, and your DSA practice rhythm.
        </p>
      </header>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <article className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-indigo-600/20 text-indigo-300">
            <BookOpen size={20} />
          </div>
          <p className="text-sm text-slate-400">Total problems</p>
          <p className="mt-1 text-3xl font-bold">{problems.length}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600/20 text-emerald-300">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-sm text-slate-400">Solved</p>
          <p className="mt-1 text-3xl font-bold">{solvedCount}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-amber-600/20 text-amber-300">
            <Clock3 size={20} />
          </div>
          <p className="text-sm text-slate-400">In progress</p>
          <p className="mt-1 text-3xl font-bold">{inProgressCount}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-violet-600/20 text-violet-300">
            <Target size={20} />
          </div>
          <p className="text-sm text-slate-400">Today&apos;s goal</p>
          <p className="mt-1 text-3xl font-bold">
            {todaySolvedCount}/{todayGoals.length}
          </p>
        </article>
      </section>

      <section className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-indigo-300">Today&apos;s Goal</p>
            <h3 className="mt-1 text-2xl font-bold">Daily target list</h3>
          </div>

          <div className="text-sm text-slate-400">
            {todaySolvedCount} of {todayGoals.length} completed
          </div>
        </div>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-900">
          <div
            className="h-full rounded-full bg-indigo-500"
            style={{ width: `${todayProgress}%` }}
          />
        </div>

        {message ? <p className="mb-4 text-sm text-slate-400">{message}</p> : null}

        {todayGoals.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950 p-5 text-sm text-slate-400">
            No problems added to today&apos;s goal yet. Add one from Problems or AI suggestions.
          </div>
        ) : (
          <div className="space-y-3">
            {todayGoals.map((problem) => (
              <article
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                key={problem.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

                      <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                        {problem.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">{problem.topic}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {problem.link ? (
                      <a
                        className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                        href={problem.link}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <ExternalLink size={15} />
                        Open
                      </a>
                    ) : null}

                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                      onClick={() =>
                        updateProblem(problem.id, {
                          status: "Solved"
                        })
                      }
                    >
                      <CheckCircle2 size={15} />
                      Mark solved
                    </button>

                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                      onClick={() =>
                        updateProblem(problem.id, {
                          isTodayGoal: false
                        })
                      }
                    >
                      <X size={15} />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="text-indigo-300" size={20} />
            <h3 className="text-xl font-semibold">Profile focus</h3>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <p>
              <span className="text-slate-500">Goal:</span>{" "}
              {overview?.profile?.goal || "Not set"}
            </p>
            <p>
              <span className="text-slate-500">Skill level:</span>{" "}
              {overview?.profile?.skillLevel || "Not set"}
            </p>
            <p>
              <span className="text-slate-500">Daily target:</span>{" "}
              {overview?.profile?.dailyGoal || "Not set"}
            </p>
            <p>
              <span className="text-slate-500">Language:</span>{" "}
              {overview?.profile?.preferredLanguage || "Not set"}
            </p>
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <h3 className="mb-3 text-xl font-semibold">Recent problems</h3>

          {problems.length === 0 ? (
            <p className="text-sm text-slate-400">No problems added yet.</p>
          ) : (
            <div className="space-y-3">
              {problems.slice(0, 5).map((problem) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-lg bg-slate-950 p-3"
                  key={problem.id}
                >
                  <div>
                    <p className="font-medium">{problem.title}</p>
                    <p className="text-sm text-slate-400">
                      {problem.topic} · {problem.status}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      difficultyStyles[problem.difficulty]
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </AppShell>
  );
}