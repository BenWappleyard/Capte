"use client";

import type { Rating } from "@/lib/srs";

const ratings: { label: string; value: Rating; color: string }[] = [
  { label: "I don't know", value: 1, color: "var(--color-again)" },
  { label: "I hesitated", value: 2, color: "var(--color-hard)" },
  { label: "I know it", value: 4, color: "var(--color-good)" },
];

export function RatingButtons({
  onRate,
  disabled,
}: {
  onRate: (r: Rating) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {ratings.map(({ label, value, color }) => (
        <button
          key={value}
          onClick={() => onRate(value)}
          disabled={disabled}
          className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border border-[var(--color-border)] bg-white active:scale-95 transition-transform disabled:opacity-50"
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
