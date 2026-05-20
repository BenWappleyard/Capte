"use client";

import { useState, useRef, useTransition } from "react";
import { addCard } from "@/app/actions";
import { Loader2 } from "lucide-react";

const FLAG = { fr: "🇫🇷", en: "🇬🇧" } as const;
type Lang = "fr" | "en";

interface Preview { front: string; back: string }

export function PhraseAdd() {
  const [phrase, setPhrase] = useState("");
  const [inputLang, setInputLang] = useState<Lang>("fr");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [translating, setTranslating] = useState(false);
  const [, startTransition] = useTransition();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleChange(value: string) {
    setPhrase(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 3) {
      setPreview(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setTranslating(true);
      try {
        const dir = inputLang === "fr" ? "fr|en" : "en|fr";
        const res = await fetch(`/api/translate?text=${encodeURIComponent(value.trim())}&dir=${dir}`);
        const { results } = await res.json() as { results: string[] };
        const translation = results[0] ?? "";
        if (!translation) return;
        const front = inputLang === "fr" ? value.trim() : translation;
        const back = inputLang === "fr" ? translation : value.trim();
        setPreview({ front, back });
      } finally {
        setTranslating(false);
      }
    }, 500);
  }

  function handleAdd() {
    if (!preview) return;
    const { front, back } = preview;
    setPreview(null);
    setPhrase("");
    startTransition(async () => { await addCard(front, back); });
    textareaRef.current?.focus();
  }

  function handleDismiss() {
    setPreview(null);
    setPhrase("");
    textareaRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Input */}
      <div className="border border-[var(--color-border)] rounded-2xl bg-white focus-within:border-[var(--color-accent)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <button
            type="button"
            onClick={() => { setInputLang((l) => l === "fr" ? "en" : "fr"); setPhrase(""); setPreview(null); }}
            className="text-base select-none"
            title="Switch language"
          >
            {FLAG[inputLang]}
          </button>
          <span className="text-xs text-[var(--color-muted)]">
            {inputLang === "fr" ? "Français" : "English"}
          </span>
          {translating && <Loader2 size={13} className="ml-auto text-[var(--color-muted)] animate-spin" />}
        </div>
        <textarea
          ref={textareaRef}
          value={phrase}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type a phrase…"
          rows={3}
          className="w-full px-4 pb-3 text-base outline-none bg-transparent resize-none leading-relaxed"
        />
      </div>

      {/* Live card preview */}
      {preview && (
        <div
          style={{
            animation: "fadeSlideIn 0.25s ease both",
          }}
        >
          <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }`}</style>

          <div className="border border-[var(--color-border)] rounded-3xl bg-white overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-muted)] mb-2">{FLAG.fr} Français</p>
              <p className="text-lg font-medium leading-snug">{preview.front}</p>
            </div>
            <div className="px-6 py-5 bg-[var(--color-accent-light)]">
              <p className="text-xs text-[var(--color-accent)] mb-2">{FLAG.en} English</p>
              <p className="text-lg font-medium leading-snug text-[var(--color-accent)]">{preview.back}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <button
              onClick={handleAdd}
              className="flex-1 bg-[var(--color-accent)] text-white rounded-2xl py-3.5 font-medium text-sm active:opacity-80"
            >
              Add card
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 border border-[var(--color-border)] bg-white rounded-2xl py-3.5 font-medium text-sm text-[var(--color-muted)] active:opacity-80"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
