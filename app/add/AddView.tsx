"use client";

import { useState } from "react";
import { QuickAdd } from "@/components/QuickAdd";
import { PhraseAdd } from "@/components/PhraseAdd";

interface DeckCard { front: string; back: string }

export function AddView({ deckCards }: { deckCards: DeckCard[] }) {
  const [mode, setMode] = useState<"word" | "phrase">("word");

  return (
    <div>
      {/* Segmented controller */}
      <div className="flex bg-[var(--color-border)] rounded-2xl p-1 mb-6">
        {(["word", "phrase"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === m
                ? "bg-white text-[var(--color-text)] shadow-sm"
                : "text-[var(--color-muted)]"
            }`}
          >
            {m === "word" ? "Word" : "Phrase"}
          </button>
        ))}
      </div>

      {mode === "word" ? <QuickAdd deckCards={deckCards} /> : <PhraseAdd />}
    </div>
  );
}
