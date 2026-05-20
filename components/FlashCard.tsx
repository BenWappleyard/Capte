"use client";

interface Props {
  front: string;
  back: string;
  revealed: boolean;
  onReveal: () => void;
}

export function FlashCard({ front, back, revealed, onReveal }: Props) {
  return (
    <div className="flex-1 flex flex-col">
      <button
        onClick={!revealed ? onReveal : undefined}
        className="flex-1 flex flex-col items-center justify-center bg-white border border-[var(--color-border)] rounded-3xl p-8 text-center cursor-pointer active:scale-[0.98] transition-transform min-h-64"
      >
        <p className="text-2xl font-medium mb-2">{front}</p>
        {!revealed ? (
          <p className="text-sm text-[var(--color-muted)] mt-4">Tap to reveal</p>
        ) : (
          <div className="mt-6 pt-6 border-t border-[var(--color-border)] w-full">
            <p className="text-[var(--color-muted)] text-lg">{back}</p>
          </div>
        )}
      </button>
    </div>
  );
}
