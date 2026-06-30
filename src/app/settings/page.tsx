import { AppShell } from "@/components/AppShell";
import { Settings } from "lucide-react";

const settings = [
  "Account",
  "Appearance",
  "Notifications",
  "AI Preferences",
  "Privacy",
  "Integrations"
];

export default function SettingsPage() {
  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Settings</p>
        <h2 className="mt-1 text-3xl font-bold">Control your mentor</h2>
        <p className="mt-2 text-sm text-slate-400">
          These settings will become functional after authentication and database setup.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {settings.map((item) => (
          <article
            className="rounded-lg border border-slate-800 bg-[#101a2d] p-5"
            key={item}
          >
            <div className="mb-3 flex items-center gap-3">
              <Settings className="text-indigo-300" />
              <h3 className="text-lg font-semibold">{item}</h3>
            </div>
            <p className="text-sm text-slate-400">
              Configure {item.toLowerCase()} options for your AI DSA Mentor account.
            </p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}