"use client";

import { useState } from "react";
import type { Exercise } from "@/lib/exercises";

export function FillInTheBlank({
  exercise,
  answered,
  onAnswer,
}: {
  exercise: Exercise;
  answered: string | null;
  onAnswer: (v: string) => void;
}) {
  const [value, setValue] = useState("");

  const isCorrect =
    answered !== null &&
    answered.toLowerCase().trim() === exercise.answer.toLowerCase().trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) onAnswer(value.trim());
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      <div className="bg-white border border-[var(--color-border)] rounded-3xl p-8 text-center">
        <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest mb-3">
          Fill in the blank
        </p>
        <p className="text-xl font-medium leading-relaxed">{exercise.prompt}</p>
        {exercise.hints && (
          <p className="text-sm text-[var(--color-muted)] mt-3">({exercise.hints})</p>
        )}
      </div>

      {!answered ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type your answer…"
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
      ) : (
        <div
          className={`px-5 py-4 rounded-2xl text-sm font-medium ${
            isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {isCorrect ? `Correct: ${exercise.answer}` : `Answer: ${exercise.answer}`}
        </div>
      )}
    </div>
  );
}
