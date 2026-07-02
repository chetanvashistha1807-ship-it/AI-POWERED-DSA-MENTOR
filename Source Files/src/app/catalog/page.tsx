"use client";

import { AppShell } from "@/components/AppShell";
import { BookOpen, Plus, Target } from "lucide-react";
import { useEffect, useState } from "react";

type CatalogProblem = {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  leetcodeUrl: string;
  pattern: string | null;
  description: string | null;
};

export default function CatalogPage() {
  const [catalog, setCatalog] = useState<CatalogProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadCatalog() {
    try {
      const response = await fetch("/api/catalog");

      if (!response.ok) {
        throw new Error("Failed to load catalog");
      }

      const data = await response.json();
      setCatalog(data);
    } catch {
      setMessage("Could not load problem catalog.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCatalog();
  }, []);

  async function addToProblems(catalogProblemId: string, isTodayGoal: boolean) {
    setMessage("");

    try {
      const response = await fetch("/api/catalog/add-to-problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          catalogProblemId,
          status: isTodayGoal ? "Recommended" : "Not Started",
          isTodayGoal
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add problem");
      }

      setMessage(
        isTodayGoal
          ? "Problem added to today's goal."
          : "Problem added to your tracker."
      );
    } catch {
      setMessage("Could not add problem.");
    }
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Problem Catalog</p>
        <h2 className="mt-1 text-3xl font-bold">DSA problem bank</h2>
        <p className="mt-2 text-sm text-slate-400">
          Add curated problems to your tracker or today&apos;s goal.
        </p>
      </header>

      {message ? (
        <p className="mb-4 rounded-md border border-slate-800 bg-[#101a2d] px-4 py-3 text-sm text-slate-300">
          {message}
        </p>
      ) : null}

      <section className="grid gap-4">
        {isLoading ? (
          <p className="rounded-lg border border-slate-800 bg-[#101a2d] p-5 text-sm text-slate-400">
            Loading catalog...
          </p>
        ) : (
          catalog.map((problem) => (
            <article
              className="rounded-lg border border-slate-800 bg-[#101a2d] p-5"
              key={problem.id}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <BookOpen className="text-indigo-300" />
                    <div>
                      <h3 className="text-xl font-semibold">{problem.title}</h3>
                      <p className="text-sm text-slate-400">
                        {problem.topic} - {problem.difficulty}
                        {problem.pattern ? ` - ${problem.pattern}` : ""}
                      </p>
                    </div>
                  </div>

                  {problem.description ? (
                    <p className="max-w-3xl text-sm leading-6 text-slate-300">
                      {problem.description}
                    </p>
                  ) : null}

                  <a
                    className="mt-3 inline-block text-sm text-indigo-300 hover:text-indigo-200"
                    href={problem.leetcodeUrl}
                    target="_blank"
                  >
                    Open on LeetCode
                  </a>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
                    onClick={() => addToProblems(problem.id, false)}
                  >
                    <Plus size={18} />
                    Add to My Problems
                  </button>

                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
                    onClick={() => addToProblems(problem.id, true)}
                  >
                    <Target size={18} />
                    Add to Today&apos;s Goal
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </AppShell>
  );
}