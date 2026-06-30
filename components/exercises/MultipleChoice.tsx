"use client";

import type { Exercise } from "@/lib/exercises";
import { caveat } from "@/lib/fonts";

export function MultipleChoice({
  exercise,
  answered,
  onAnswer,
}: {
  exercise: Exercise;
  answered: string | null;
  onAnswer: (v: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col gap-5">
      <div className="bg-white shadow-[2px_3px_0px_rgba(0,0,0,0.12)] p-8 text-center">
<p className={`text-2xl font-semibold ${caveat.className}`}>{exercise.prompt}</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {exercise.options?.map((opt) => {
          let state = "default";
          if (answered) {
            if (opt === exercise.answer) state = "correct";
            else if (opt === answered) state = "wrong";
          }
          return (
            <button
              key={opt}
              onClick={() => !answered && onAnswer(opt)}
              disabled={!!answered}
              className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-colors ${
                state === "correct"
                  ? "border-green-400 bg-green-50 text-green-800"
                  : state === "wrong"
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-[var(--color-border)] bg-white active:bg-[var(--color-bg)]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
