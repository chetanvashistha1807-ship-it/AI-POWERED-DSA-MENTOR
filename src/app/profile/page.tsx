"use client";

import { AppShell } from "@/components/AppShell";
import { useLearningStore } from "@/lib/use-learning-store";
import { Save, User } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { profile, updateProfile } = useLearningStore();

  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.goal);
  const [skillLevel, setSkillLevel] = useState(profile.skillLevel);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal);
  const [preferredLanguage, setPreferredLanguage] = useState(
    profile.preferredLanguage
  );

  function handleSave() {
    updateProfile({
      name,
      goal,
      skillLevel,
      dailyGoal,
      preferredLanguage
    });
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Profile</p>
        <h2 className="mt-1 text-3xl font-bold">{profile.name}&apos;s learning profile</h2>
        <p className="mt-2 text-sm text-slate-400">
          Your goals help the mentor recommend the right topics and problems.
        </p>
      </header>

      <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <p className="text-sm text-slate-400">{profile.goal}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-400">Name</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Goal</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Skill level</span>
            <select
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              value={skillLevel}
              onChange={(event) => setSkillLevel(event.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Daily goal</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              value={dailyGoal}
              onChange={(event) => setDailyGoal(event.target.value)}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm text-slate-400">Preferred language</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              value={preferredLanguage}
              onChange={(event) => setPreferredLanguage(event.target.value)}
            />
          </label>
        </div>

        <button
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
          onClick={handleSave}
        >
          <Save size={18} />
          Save profile
        </button>
      </section>
    </AppShell>
  );
}