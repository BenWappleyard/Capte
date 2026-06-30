"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Exercise } from "@/lib/exercises";
import type { Rating } from "@/lib/srs";
import { submitReview } from "@/app/actions";
import { FlashCard } from "@/components/FlashCard";
import { MultipleChoice } from "@/components/exercises/MultipleChoice";
import { FillInTheBlank } from "@/components/exercises/FillInTheBlank";
import { TranslationExercise } from "@/components/exercises/TranslationExercise";
import { ConjugationDrill } from "@/components/exercises/ConjugationDrill";
import { RatingButtons } from "@/components/RatingButtons";
import { X } from "lucide-react";

interface Props {
  exercises: Exercise[];
}

export function SessionClient({ exercises }: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState<string | null>(null);
  const [results, setResults] = useState<{ rating: Rating }[]>([]);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const current = exercises[index];
  const progress = index / exercises.length;

  function handleReveal() {
    setRevealed(true);
  }

  function handleAnswer(value: string) {
    setAnswered(value);
    setRevealed(true);
  }

  function handleRate(rating: Rating) {
    startTransition(async () => {
      await submitReview(current.cardId, rating);
      const next = [...results, { rating }];
      setResults(next);

      if (index + 1 >= exercises.length) {
        setDone(true);
      } else {
        setIndex(index + 1);
        setRevealed(false);
        setAnswered(null);
      }
    });
  }

  if (done) {
    return <SessionSummary results={results} onHome={() => router.push("/")} />;
  }

  const isPassive = current.type === "flashcard";
  const isInteractive = !isPassive;

  return (
    <div className="flex flex-col min-h-screen px-5 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/")}
          className="p-1 text-[var(--color-muted)]"
          aria-label="Exit session"
        >
          <X size={20} />
        </button>
        <div className="flex-1 bg-[var(--color-border)] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-xs text-[var(--color-muted)] tabular-nums w-12 text-right">
          {index + 1}/{exercises.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        {current.type === "flashcard" && (
          <FlashCard
            front={current.prompt}
            back={current.answer}
            revealed={revealed}
            onReveal={handleReveal}
          />
        )}
        {current.type === "multiple_choice" && (
          <MultipleChoice
            exercise={current}
            answered={answered}
            onAnswer={handleAnswer}
          />
        )}
        {current.type === "fill_blank" && (
          <FillInTheBlank
            exercise={current}
            answered={answered}
            onAnswer={handleAnswer}
          />
        )}
        {current.type === "translation" && (
          <TranslationExercise
            exercise={current}
            answered={answered}
            onAnswer={handleAnswer}
          />
        )}
        {current.type === "conjugation" && (
          <ConjugationDrill
            exercise={current}
            answered={answered}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {revealed && (
        <div className="pb-8 pt-4">
          {isInteractive && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
              answered?.toLowerCase().trim() === current.answer.toLowerCase().trim()
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}>
              {answered?.toLowerCase().trim() === current.answer.toLowerCase().trim()
                ? "Correct"
                : `Answer: ${current.answer}`}
            </div>
          )}
          <RatingButtons onRate={handleRate} disabled={isPending} />
        </div>
      )}
    </div>
  );
}

function SessionSummary({
  results,
  onHome,
}: {
  results: { rating: Rating }[];
  onHome: () => void;
}) {
  const counts = results.reduce(
    (acc, r) => { acc[r.rating] = (acc[r.rating] ?? 0) + 1; return acc; },
    {} as Record<number, number>
  );
  const goodPlus = (counts[3] ?? 0) + (counts[4] ?? 0);
  const retention = Math.round((goodPlus / results.length) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center mb-6">
        <span className="text-2xl">✓</span>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Session complete</h2>
      <p className="text-[var(--color-muted)] mb-8">{results.length} cards reviewed</p>

      <div className="w-full grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
          <p className="text-2xl font-semibold">{retention}%</p>
          <p className="text-xs text-[var(--color-muted)] mt-1">Retention</p>
        </div>
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
          <p className="text-2xl font-semibold">{results.length}</p>
          <p className="text-xs text-[var(--color-muted)] mt-1">Cards done</p>
        </div>
      </div>

      <div className="w-full flex gap-2 mb-6">
        {[
          { label: "I don't know", count: counts[1] ?? 0, color: "var(--color-again)" },
          { label: "I hesitated", count: counts[2] ?? 0, color: "var(--color-hard)" },
          { label: "I know it", count: counts[4] ?? 0, color: "var(--color-good)" },
        ].map((r) => (
          <div key={r.label} className="flex-1 text-center">
            <div
              className="h-1.5 rounded-full mb-2"
              style={{ backgroundColor: r.color, opacity: r.count ? 1 : 0.2 }}
            />
            <p className="text-sm font-medium">{r.count}</p>
            <p className="text-xs text-[var(--color-muted)]">{r.label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onHome}
        className="w-full bg-[var(--color-accent)] text-white rounded-2xl py-4 font-medium text-base"
      >
        Done
      </button>
    </div>
  );
}
