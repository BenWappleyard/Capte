"use client";

import { useState } from "react";
import type { Exercise } from "@/lib/exercises";

export function TranslationExercise({
  exercise,
  answered,
  onAnswer,
}: {
  exercise: Exercise;
  answered: string | null;
  onAnswer: (v: string) => void;
}) {
  const [value, setValue] = useState("");

  const label = exercise.promptLanguage === "fr" ? "Translate to English" : "Translate to French";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) onAnswer(value.trim());
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      <div className="bg-white border border-[var(--color-border)] rounded-3xl p-8 text-center">
        <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest mb-3">{label}</p>
        <p className="text-2xl font-medium">{exercise.prompt}</p>
      </div>

      {!answered ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your translation…"
            className="flex-1 border border-[var(--color-border)] rounded-2xl px-5 py-4 text-base outline-none focus:border-[var(--color-accent)] bg-white"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="px-5 py-4 bg-[var(--color-accent)] text-white rounded-2xl font-medium disabled:opacity-40"
          >
            Check
          </button>
        </form>
      ) : null}
    </div>
  );
}
