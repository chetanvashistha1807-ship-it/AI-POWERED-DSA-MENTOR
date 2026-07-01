"use client";

import { AppShell } from "@/components/AppShell";
import { NotebookPen, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type DbNote = {
  id: string;
  title: string;
  linkedTo: string;
  content: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<DbNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [linkedTo, setLinkedTo] = useState("");
  const [content, setContent] = useState("");

  async function loadNotes() {
    try {
      const response = await fetch("/api/notes");

      if (!response.ok) {
        throw new Error("Failed to load notes");
      }

      const data = await response.json();
      setNotes(data);
    } catch {
      setMessage("Could not load notes.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleAddNote() {
    if (!title.trim() || !content.trim()) return;

    setMessage("");

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          linkedTo: linkedTo || "General",
          content
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const createdNote = await response.json();

      setNotes((current) => [createdNote, ...current]);

      setTitle("");
      setLinkedTo("");
      setContent("");
      setMessage("Note saved to database.");
    } catch {
      setMessage("Could not save note.");
    }
  }

  return (
    <AppShell>
      <header className="mb-6 rounded-lg border border-slate-800 bg-[#101a2d] p-5">
        <p className="text-sm text-indigo-300">Notes</p>
        <h2 className="mt-1 text-3xl font-bold">Your learning memory</h2>
        <p className="mt-2 text-sm text-slate-400">
          Notes are now saved in PostgreSQL for your logged-in account.
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

        <div className="mt-4 flex items-center gap-4">
          <button
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
            onClick={handleAddNote}
          >
            <Plus size={18} />
            Add note
          </button>

          {message ? <p className="text-sm text-slate-400">{message}</p> : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <p className="rounded-lg border border-slate-800 bg-[#101a2d] p-5 text-sm text-slate-400">
            Loading notes...
          </p>
        ) : (
          notes.map((note) => (
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
          ))
        )}
      </section>
    </AppShell>
  );
}