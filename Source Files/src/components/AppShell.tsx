

"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Bot,
  LayoutDashboard,
  NotebookPen,
  Route,
  Settings,
  User
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Problem Catalog", href: "/catalog", icon: BookOpen },
  { label: "Learning Roadmap", href: "/roadmap", icon: Route },
  { label: "Problems", href: "/problems", icon: BookOpen },
  { label: "AI Mentor", href: "/mentor", icon: Bot },
  { label: "Notes", href: "/notes", icon: NotebookPen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#09111f] text-slate-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        <aside className="hidden w-64 shrink-0 rounded-lg border border-slate-800 bg-[#101a2d] p-4 lg:block">
          <div className="mb-8">
            <p className="text-sm text-indigo-300">AI DSA Mentor</p>
            <h1 className="mt-1 text-2xl font-bold">Learning Hub</h1>
          </div>

          <div className="mb-6 flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-3">
            <span className="text-sm text-slate-300">Account</span>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>

          <nav className="space-y-2 text-sm text-slate-300">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </main>
  );
}