"use client";

import { useState, useTransition } from "react";
import { deleteCard } from "@/app/actions";
import { Trash2 } from "lucide-react";
import { caveat } from "@/lib/fonts";

interface CardWithSchedule {
  id: string;
  front: string;
  back: string;
  type: string;
  category: string | null;
  schedule: {
    nextReview: Date;
    interval: number;
    repetitions: number;
  } | null;
}

export function CardsClient({ cards, total }: { cards: CardWithSchedule[]; total: number }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = cards.filter(
    (c) =>
      c.front.toLowerCase().includes(query.toLowerCase()) ||
      c.back.toLowerCase().includes(query.toLowerCase())
  );

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteCard(id);
      setDeletingId(null);
    });
  }

  return (
    <div>
      <div className="relative mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cards…"
          className={`w-full border border-[var(--color-border)] rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-[var(--color-accent)] bg-white ${!query ? "pr-20" : ""}`}
        />
        {!query && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--color-muted)] pointer-events-none">
            {total} total
          </span>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--color-muted)] text-sm py-10">
          {query ? "No cards match your search." : "No cards yet."}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((card) => (
          <div
            key={card.id}
            className="flex items-start gap-3 bg-white px-4 py-4 shadow-[2px_3px_0px_rgba(0,0,0,0.12)]"
          >
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-base truncate ${caveat.className}`}>{card.front}</p>
              <p className={`text-[var(--color-muted)] text-base truncate ${caveat.className}`}>{card.back}</p>
              {card.schedule && (
                <p className="text-xs text-[var(--color-muted)] mt-1 opacity-70">
                  {card.schedule.repetitions} rep{card.schedule.repetitions !== 1 ? "s" : ""} · next in {card.schedule.interval}d
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(card.id)}
              disabled={isPending && deletingId === card.id}
              className="p-1.5 text-[var(--color-muted)] active:text-red-500 transition-colors disabled:opacity-40"
              aria-label="Delete card"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
