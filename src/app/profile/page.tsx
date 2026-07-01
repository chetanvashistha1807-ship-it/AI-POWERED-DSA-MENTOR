"use client";

import { AppShell } from "@/components/AppShell";
import { Save, User } from "lucide-react";
import { useEffect, useState } from "react";

type Profile = {
  name: string;
  goal: string;
  skillLevel: string;
  dailyGoal: string;
  preferredLanguage: string;
};

const fallbackProfile: Profile = {
  name: "DSA Learner",
  goal: "Placement preparation",
  skillLevel: "Beginner",
  dailyGoal: "3 problems",
  preferredLanguage: "C++ / Java / Python"
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        setProfile({
          name: data.name,
          goal: data.goal,
          skillLevel: data.skillLevel,
          dailyGoal: data.dailyGoal,
          preferredLanguage: data.preferredLanguage
        });
      } catch {
        setMessage("Could not load profile yet.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(field: keyof Profile, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();

      setProfile({
        name: data.name,
        goal: data.goal,
        skillLevel: data.skillLevel,
        dailyGoal: data.dailyGoal,
        preferredLanguage: data.preferredLanguage
      });

      setMessage("Profile saved to database.");
    } catch {
      setMessage("Could not save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Profile</p>
        <h2 className="mt-1 text-3xl font-bold">
          {profile.name}&apos;s learning profile
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          This profile is now saved in PostgreSQL for your logged-in account.
        </p>
      </header>

      <section className="rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <p className="text-sm text-slate-400">
              {isLoading ? "Loading profile..." : profile.goal}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-400">Name</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              value={profile.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Goal</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              value={profile.goal}
              onChange={(event) => updateField("goal", event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Skill level</span>
            <select
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              value={profile.skillLevel}
              onChange={(event) => updateField("skillLevel", event.target.value)}
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
              value={profile.dailyGoal}
              onChange={(event) => updateField("dailyGoal", event.target.value)}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm text-slate-400">Preferred language</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              value={profile.preferredLanguage}
              onChange={(event) =>
                updateField("preferredLanguage", event.target.value)
              }
            />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={handleSave}
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save profile"}
          </button>

          {message ? <p className="text-sm text-slate-400">{message}</p> : null}
        </div>
      </section>
    </AppShell>
  );
}