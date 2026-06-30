"use client";

import { AppShell } from "@/components/AppShell";
import { useLearningStore } from "@/lib/use-learning-store";
import { BarChart3, Flame, Target, TrendingUp } from "lucide-react";

function getDifficultyCount(
  problems: { difficulty: string; status: string }[],
  difficulty: string
) {
  return problems.filter((problem) => problem.difficulty === difficulty).length;
}

export default function AnalyticsPage() {
  const { problems, notes } = useLearningStore();

  const solved = problems.filter((problem) => problem.status === "Solved").length;
  const attempted = problems.filter(
    (problem) => problem.status === "In Progress" || problem.status === "Solved"
  ).length;

  const accuracy =
    attempted === 0 ? 0 : Math.round((solved / attempted) * 100);

  const topicMap = new Map<string, { total: number; solved: number }>();

  problems.forEach((problem) => {
    const existing = topicMap.get(problem.topic) ?? { total: 0, solved: 0 };

    topicMap.set(problem.topic, {
      total: existing.total + 1,
      solved: existing.solved + (problem.status === "Solved" ? 1 : 0)
    });
  });

  const weakTopics = Array.from(topicMap.entries())
    .map(([topic, data]) => ({
      topic,
      progress: Math.round((data.solved / data.total) * 100)
    }))
    .filter((item) => item.progress < 60)
    .sort((a, b) => a.progress - b.progress);

  const analytics = [
    { label: "Problems solved", value: `${solved}`, icon: TrendingUp },
    { label: "Accuracy", value: `${accuracy}%`, icon: Target },
    { label: "Saved notes", value: `${notes.length}`, icon: Flame },
    { label: "Tracked topics", value: `${topicMap.size}`, icon: BarChart3 }
  ];

  const difficultyRows = [
    { label: "Easy", count: getDifficultyCount(problems, "Easy") },
    { label: "Medium", count: getDifficultyCount(problems, "Medium") },
    { label: "Hard", count: getDifficultyCount(problems, "Hard") }
  ];

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Analytics</p>
        <h2 className="mt-1 text-3xl font-bold">Progress and weak topics</h2>
        <p className="mt-2 text-sm text-slate-400">
          These numbers are calculated from your saved problems and notes.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analytics.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="rounded-lg border border-slate-800 bg-[#101a2d] p-4"
              key={item.label}
            >
              <Icon className="mb-4 text-indigo-300" />
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="mt-1 text-sm text-slate-400">{item.label}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <h3 className="text-xl font-semibold">Weak topic analysis</h3>

          <div className="mt-4 space-y-3">
            {weakTopics.length > 0 ? (
              weakTopics.map((item, index) => (
                <div
                  className="flex items-center justify-between rounded-md border border-slate-800 p-4"
                  key={item.topic}
                >
                  <span>{item.topic}</span>
                  <span className="text-sm text-slate-400">
                    Priority {index + 1} · {item.progress}%
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-md border border-slate-800 p-4 text-sm text-slate-400">
                No weak topics yet. Add problems and update their status to generate insights.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
          <h3 className="text-xl font-semibold">Difficulty distribution</h3>

          <div className="mt-4 space-y-4">
            {difficultyRows.map((row) => {
              const width =
                problems.length === 0
                  ? 0
                  : Math.round((row.count / problems.length) * 100);

              return (
                <div key={row.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{row.label}</span>
                    <span className="text-slate-400">{row.count}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}