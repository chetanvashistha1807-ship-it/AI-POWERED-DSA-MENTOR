"use client";

import { AppShell } from "@/components/AppShell";
import { useLearningStore } from "@/lib/use-learning-store";
import { NotebookPen, Plus } from "lucide-react";
import { useState } from "react";

export default function NotesPage() {
  const { notes, addNote } = useLearningStore();

  const [title, setTitle] = useState("");
  const [linkedTo, setLinkedTo] = useState("");
  const [content, setContent] = useState("");

  function handleAddNote() {
    if (!title.trim() || !content.trim()) return;

    addNote({
      title,
      linkedTo: linkedTo || "General",
      content
    });

    setTitle("");
    setLinkedTo("");
    setContent("");
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Notes</p>
        <h2 className="mt-1 text-3xl font-bold">Your learning memory</h2>
        <p className="mt-2 text-sm text-slate-400">
          Save patterns, mistakes, explanations, and revision notes.
        </p>
      </header>

      <section className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <h3 className="mb-4 text-xl font-semibold">Add a note</h3>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
            placeholder="Note title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <input
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
            placeholder="Linked topic or problem"
            value={linkedTo}
            onChange={(event) => setLinkedTo(event.target.value)}
          />
        </div>

        <textarea
          className="mt-3 min-h-32 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
          placeholder="Write your learning note..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />

        <button
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
          onClick={handleAddNote}
        >
          <Plus size={18} />
          Add note
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {notes.map((note) => (
          <article
            className="rounded-lg border border-slate-800 bg-[#101a2d] p-5"
            key={note.id}
          >
            <div className="mb-4 flex items-center gap-3">
              <NotebookPen className="text-indigo-300" />
              <div>
                <h3 className="font-semibold">{note.title}</h3>
                <p className="text-sm text-slate-400">{note.linkedTo}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-300">{note.content}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}