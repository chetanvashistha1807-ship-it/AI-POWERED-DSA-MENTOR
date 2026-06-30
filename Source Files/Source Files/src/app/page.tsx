import {
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle2,
  Flame,
  NotebookPen,
  Route,
  Search
} from "lucide-react";

const stats = [
  { label: "Problems solved", value: "42", icon: CheckCircle2 },
  { label: "Current streak", value: "8 days", icon: Flame },
  { label: "Roadmap progress", value: "34%", icon: Route },
  { label: "Weak topics", value: "3", icon: BarChart3 }
];

const tasks = [
  "Revise Binary Search fundamentals",
  "Solve 2 Sliding Window problems",
  "Add notes for Prefix Sum mistakes",
  "Ask AI Mentor for DP intuition"
];

const problems = [
  {
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    status: "Solved"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window",
    difficulty: "Medium",
    status: "In Progress"
  },
  {
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    status: "Recommended"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09111f] text-slate-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        <aside className="hidden w-64 shrink-0 rounded-lg border border-slate-800 bg-[#101a2d] p-4 lg:block">
          <div className="mb-8">
            <p className="text-sm text-indigo-300">AI DSA Mentor</p>
            <h1 className="mt-1 text-2xl font-bold">Learning Hub</h1>
          </div>

          <nav className="space-y-2 text-sm text-slate-300">
            {[
              "Dashboard",
              "Learning Roadmap",
              "Problems",
              "AI Mentor",
              "Notes",
              "Analytics",
              "Profile",
              "Settings"
            ].map((item) => (
              <a
                className="block rounded-md px-3 py-2 hover:bg-slate-800 hover:text-white"
                href="#"
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-800 bg-[#101a2d] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-indigo-300">Welcome back, Chetan</p>
              <h2 className="mt-1 text-3xl font-bold">Today’s DSA plan</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Keep moving through your roadmap. The mentor remembers your
                solved problems, weak topics, notes, and previous AI discussions.
              </p>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
              <Bot size={18} />
              Ask AI Mentor
            </button>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  className="rounded-lg border border-slate-800 bg-[#101a2d] p-4"
                  key={stat.label}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-indigo-300">
                    <Icon size={20} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Daily recommendation</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Based on your current roadmap and weak topics.
                  </p>
                </div>
                <BookOpen className="text-indigo-300" />
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#16243a] p-4">
                <p className="text-sm text-slate-400">Recommended topic</p>
                <h4 className="mt-1 text-2xl font-bold">Sliding Window</h4>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  You recently solved Prefix Sum problems and attempted one
                  substring problem. Sliding Window is the best next step because
                  it builds naturally on those patterns.
                </p>
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
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">AI Mentor memory</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Context the AI will use before answering.
                  </p>
                </div>
                <Bot className="text-indigo-300" />
              </div>

              <div className="space-y-3 text-sm">
                {[
                  "Current plan: Placement preparation",
                  "Strong topics: Arrays, Binary Search",
                  "Weak topics: Graphs, DP, Sliding Window",
                  "Solved questions are excluded from recommendations"
                ].map((item) => (
                  <p
                    className="rounded-md bg-slate-900/60 px-3 py-3 text-slate-300"
                    key={item}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold">Problem tracker</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Track external LeetCode problems without rebuilding LeetCode.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-400">
                <Search size={16} />
                Search problems
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-800">
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
                    <tr className="border-t border-slate-800" key={problem.title}>
                      <td className="px-4 py-4 font-medium">{problem.title}</td>
                      <td className="px-4 py-4 text-slate-300">{problem.topic}</td>
                      <td className="px-4 py-4 text-slate-300">
                        {problem.difficulty}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-200">
                          {problem.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
              <div className="mb-4 flex items-center gap-3">
                <NotebookPen className="text-indigo-300" />
                <h3 className="text-xl font-semibold">Recent notes</h3>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Binary Search: always define whether the loop keeps the answer in
                the search space. Avoid mixing lower-bound and exact-search logic.
              </p>
            </section>

            <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
              <div className="mb-4 flex items-center gap-3">
                <BarChart3 className="text-indigo-300" />
                <h3 className="text-xl font-semibold">Progress insight</h3>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Your accuracy is strongest in Arrays. The next meaningful jump
                will come from revising Graph traversal and solving medium-level
                Sliding Window problems.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}