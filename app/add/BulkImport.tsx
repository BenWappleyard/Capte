"use client";

import { useState, useTransition } from "react";
import { importCards } from "@/app/actions";
import { ChevronDown } from "lucide-react";

export function BulkImport() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ count?: number; error?: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setResult(null);
    startTransition(async () => {
      const r = await importCards(text);
      setResult(r);
      if (r.count && r.count > 0) setText("");
    });
  }

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm text-[var(--color-muted)] font-medium"
      >
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
        Bulk import from Google Docs
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <p className="text-xs text-[var(--color-muted)]">
            Paste multiple lines — one entry per line, French and English separated by a dash, colon, or pipe.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"bonjour - hello\nmerci - thank you"}
            rows={8}
            className="w-full border border-[var(--color-border)] rounded-2xl px-5 py-4 text-sm font-mono outline-none focus:border-[var(--color-accent)] bg-white resize-none leading-relaxed"
          />
          {result && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium ${result.error ? "bg-red-50 text-red-700" : "bg-[var(--color-accent-light)] text-[var(--color-accent)]"}`}>
              {result.error ?? `${result.count} card${result.count === 1 ? "" : "s"} imported`}
            </div>
          )}
          <button
            type="submit"
            disabled={!text.trim() || isPending}
            className="w-full bg-[var(--color-accent)] text-white rounded-2xl py-4 font-medium disabled:opacity-40"
          >
            {isPending ? "Importing…" : "Import"}
          </button>
        </form>
      )}
    </div>
  );
}
