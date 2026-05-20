"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { addCard } from "@/app/actions";
import { Loader2 } from "lucide-react";

interface DeckCard { front: string; back: string }
interface Suggestion { word: string; lang: "fr" | "en" }
type Gender = "m" | "f" | "mf" | null;
type WordType = "noun" | "verb" | "adjective" | "adverb" | "phrase" | "pronoun" | "preposition" | null;
interface PendingCard { front: string; back: string; gender: Gender; wordType: WordType }

const FLAG = { fr: "🇫🇷", en: "🇬🇧" } as const;

// ── Flip card confirmation ────────────────────────────────────────────────────

const GENDER_LABEL: Record<string, string> = { m: "masculine", f: "feminine", mf: "masc. / fem." };
const WORD_TYPE_LABEL: Record<string, string> = {
  noun: "noun", verb: "verb", adjective: "adjective", adverb: "adverb",
  phrase: "phrase", pronoun: "pronoun", preposition: "preposition",
};

function CardConfirm({
  card,
  onAdd,
  onDismiss,
}: {
  card: PendingCard;
  onAdd: () => void;
  onDismiss: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setFlipped(true); setHasFlipped(true); }, 900);
    return () => clearTimeout(t);
  }, []);

  function toggle() {
    setFlipped((f) => !f);
    setHasFlipped(true);
  }

  const metaFr = [card.wordType ? WORD_TYPE_LABEL[card.wordType] : null, card.gender ? GENDER_LABEL[card.gender] : null]
    .filter(Boolean).join(" · ");
  const metaEn = card.wordType ? WORD_TYPE_LABEL[card.wordType] : null;

  return (
    <div className="mt-5">
      <div style={{ perspective: "1000px" }} onClick={toggle} className="cursor-pointer select-none">
        <div
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            position: "relative",
            height: "170px",
          }}
        >
          {/* Front – French */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white border border-[var(--color-border)] rounded-3xl px-6"
          >
            <span className="text-xs text-[var(--color-muted)] mb-3">{FLAG.fr} Français</span>
            <p className="text-2xl font-medium text-center">{card.front}</p>
            {metaFr && <p className="text-xs text-[var(--color-muted)] mt-2">{metaFr}</p>}
          </div>

          {/* Back – English */}
          <div
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-accent-light)] border border-[var(--color-accent)] rounded-3xl px-6"
          >
            <span className="text-xs text-[var(--color-accent)] mb-3">{FLAG.en} English</span>
            <p className="text-2xl font-medium text-center text-[var(--color-accent)]">{card.back}</p>
            {metaEn && <p className="text-xs text-[var(--color-accent)] opacity-60 mt-2">{metaEn}</p>}
          </div>
        </div>
      </div>

      {/* CTAs — appear on first flip and stay */}
      <div
        style={{
          opacity: hasFlipped ? 1 : 0,
          transform: hasFlipped ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s",
          pointerEvents: hasFlipped ? "auto" : "none",
        }}
        className="flex gap-3 mt-4"
      >
        <button onClick={onAdd} className="flex-1 bg-[var(--color-accent)] text-white rounded-2xl py-3.5 font-medium text-sm active:opacity-80">
          Add card
        </button>
        <button onClick={onDismiss} className="flex-1 border border-[var(--color-border)] bg-white rounded-2xl py-3.5 font-medium text-sm text-[var(--color-muted)] active:opacity-80">
          Dismiss
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function QuickAdd({ deckCards = [] }: { deckCards?: DeckCard[] }) {
  const [query, setQuery] = useState("");
  const [inputLang, setInputLang] = useState<"fr" | "en">("fr");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [highlighted, setHighlighted] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<PendingCard | null>(null);
  const [, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setHighlighted(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const deckMatches: Suggestion[] = deckCards
          .filter((c) => {
            const field = inputLang === "fr" ? c.front : c.back;
            return field.toLowerCase().startsWith(value.toLowerCase());
          })
          .slice(0, 4)
          .map((c) => ({ word: inputLang === "fr" ? c.front : c.back, lang: inputLang }));

        setSuggestions(deckMatches);

        const res = await fetch(`/api/suggest?q=${encodeURIComponent(value)}`);
        const data = await res.json() as { suggestions: Suggestion[] };
        const deckSet = new Set(deckMatches.map((s) => s.word.toLowerCase()));
        const primary = data.suggestions.filter((s) => s.lang === inputLang && !deckSet.has(s.word.toLowerCase()));
        const secondary = data.suggestions.filter((s) => s.lang !== inputLang && !deckSet.has(s.word.toLowerCase()));
        setSuggestions([...deckMatches, ...primary, ...secondary].slice(0, 10));
      } catch {
        // keep deck matches
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  async function selectSuggestion(s: Suggestion) {
    setSuggestions([]);
    setQuery("");
    setLoading(true);
    try {
      const dir = s.lang === "fr" ? "fr|en" : "en|fr";
      const frenchWord = s.word; // always fetch gender for the French word

      const [translateRes, genderRes] = await Promise.all([
        fetch(`/api/translate?text=${encodeURIComponent(s.word)}&dir=${dir}`),
        s.lang === "fr"
          ? fetch(`/api/gender?word=${encodeURIComponent(frenchWord)}`)
          : Promise.resolve(null),
      ]);

      const { results } = await translateRes.json() as { results: string[] };
      const translation = results[0] ?? "";
      const front = s.lang === "fr" ? s.word : translation;
      const back = s.lang === "fr" ? translation : s.word;

      let gender: Gender = null;
      let wordType: WordType = null;
      if (genderRes) {
        const gData = await genderRes.json() as { gender: Gender; wordType: WordType };
        gender = gData.gender;
        wordType = gData.wordType;
      }

      setPending({ front, back, gender, wordType });
    } finally {
      setLoading(false);
    }
  }

  function confirmAdd() {
    if (!pending) return;
    const { front, back } = pending;
    setPending(null);
    startTransition(async () => {
      await addCard(front, back);
    });
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); selectSuggestion(suggestions[highlighted]); }
    else if (e.key === "Escape") { setSuggestions([]); }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="flex items-center border border-[var(--color-border)] rounded-2xl bg-white focus-within:border-[var(--color-accent)]">
        <button
          type="button"
          onClick={() => { setInputLang((l) => l === "fr" ? "en" : "fr"); setQuery(""); setSuggestions([]); setPending(null); }}
          className="pl-4 pr-2 py-3.5 text-base shrink-0 select-none"
          title="Switch language"
        >
          {FLAG[inputLang]}
        </button>
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoComplete="off"
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (query.length >= 2) handleChange(query); }}
          placeholder={inputLang === "fr" ? "Type a French word…" : "Type an English word…"}
          className="flex-1 py-3.5 pr-4 text-base outline-none bg-transparent"
        />
        {loading && <Loader2 size={16} className="mr-4 text-[var(--color-muted)] animate-spin shrink-0" />}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border)] rounded-2xl shadow-lg overflow-hidden z-50">
          {suggestions.map((s, i) => (
            <button
              key={`${s.lang}-${s.word}-${i}`}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
              onMouseEnter={() => setHighlighted(i)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left ${
                i === highlighted ? "bg-[var(--color-bg)]" : ""
              } ${i > 0 ? "border-t border-[var(--color-border)]" : ""}`}
            >
              <span className="text-base">{FLAG[s.lang]}</span>
              <span>{s.word}</span>
              {s.lang !== inputLang && (
                <span className="ml-auto text-xs text-[var(--color-muted)]">other language</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Flashcard confirmation */}
      {pending && (
        <CardConfirm
          card={pending}
          onAdd={confirmAdd}
          onDismiss={() => { setPending(null); inputRef.current?.focus(); }}
        />
      )}
    </div>
  );
}
