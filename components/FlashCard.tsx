"use client";

import { caveat } from "@/lib/fonts";

interface Props {
  front: string;
  back: string;
  revealed: boolean;
  onReveal: () => void;
}

export function FlashCard({ front, back, revealed, onReveal }: Props) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="relative flex-1 min-h-64">
        {/* Stack cards behind */}
        <div
          className="absolute inset-0 bg-white shadow-[2px_3px_0px_rgba(0,0,0,0.12)]"
          style={{transform: "rotate(2.5deg)" }}
        />
        <div
          className="absolute inset-0 bg-white shadow-[2px_3px_0px_rgba(0,0,0,0.12)]"
          style={{transform: "rotate(-1.5deg)" }}
        />

        {/* Main card */}
        <button
          onClick={!revealed ? onReveal : undefined}
          className="absolute inset-0 flex flex-col items-center justify-center bg-white shadow-[2px_3px_0px_rgba(0,0,0,0.12)] p-8 text-center active:scale-[0.98] transition-transform"
          style={{boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
        >
          <p className={`text-2xl font-semibold mb-2 ${caveat.className}`}>{front}</p>
          {!revealed ? (
            <p className="text-sm text-[var(--color-muted)] mt-4">Tap to reveal</p>
          ) : (
            <div className="mt-6 pt-6 border-t border-[var(--color-border)] w-full">
              <p className={`text-[var(--color-muted)] text-xl ${caveat.className}`}>{back}</p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
