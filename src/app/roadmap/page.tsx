"use client";

import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";

type RoadmapProblem = {
  id: string;
  topic: string;
  status: string;
};

type Overview = {
  problems: RoadmapProblem[];
};

function getTopicStatus(progress: number) {
  if (progress >= 80) return "Strong";
  if (progress >= 50) return "Good";
  if (progress > 0) return "Learning";
  return "Not Started";
}

export default function RoadmapPage() {
  const [problems, setProblems] = useState<RoadmapProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const response = await fetch("/api/overview");

        if (!response.ok) {
          throw new Error("Failed to load overview");
        }

        const data: Overview = await response.json();
        setProblems(data.problems);
      } finally {
        setIsLoading(false);
      }
    }

    loadOverview();
  }, []);

  const topics = Array.from(new Set(problems.map((problem) => problem.topic)));

  const roadmap = topics.map((topic) => {
    const topicProblems = problems.filter((problem) => problem.topic === topic);
    const solved = topicProblems.filter((problem) => problem.status === "Solved").length;
    const progress =
      topicProblems.length === 0
        ? 0
        : Math.round((solved / topicProblems.length) * 100);

    return {
      topic,
      total: topicProblems.length,
      solved,
      progress,
      status: getTopicStatus(progress)
    };
  });

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Learning Roadmap</p>
        <h2 className="mt-1 text-3xl font-bold">Your topic progress</h2>
        <p className="mt-2 text-sm text-slate-400">
          This roadmap is calculated from your database-backed problems.
        </p>
      </header>

      <section className="space-y-4">
        {isLoading ? (
          <p className="rounded-lg border border-slate-800 bg-[#101a2d] p-5 text-sm text-slate-400">
            Loading roadmap...
          </p>
        ) : roadmap.length > 0 ? (
          roadmap.map((item, index) => (
            <article
              className="rounded-lg border border-slate-800 bg-[#101a2d] p-5"
              key={item.topic}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Topic {index + 1}</p>
                  <h3 className="text-xl font-semibold">{item.topic}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.solved} of {item.total} problems solved
                  </p>
                </div>

                <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-sm text-indigo-200">
                  {item.status}
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              <p className="mt-2 text-sm text-slate-400">
                {item.progress}% complete
              </p>
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-slate-800 bg-[#101a2d] p-5 text-sm text-slate-400">
            No roadmap yet. Add problems from the Problems page to generate topic progress.
          </p>
        )}
      </section>
    </AppShell>
  );
}