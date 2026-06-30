"use client";

import { useState } from "react";
import { X } from "lucide-react";

const LANGUAGES = [
  { code: "fr", label: "French", native: "Français" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "tn", label: "Setswana", native: "Setswana" },
  { code: "it", label: "Tuscan Italian", native: "Italiano Toscano" },
  { code: "cy", label: "Welsh", native: "Cymraeg" },
];

function FlagSvg({ code }: { code: string }) {
  if (code === "fr") return (
    <svg viewBox="0 0 3 2" width="100%" height="100%" preserveAspectRatio="none">
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </svg>
  );
  if (code === "es") return (
    <svg viewBox="0 0 3 2" width="100%" height="100%" preserveAspectRatio="none">
      <rect width="3" height="0.5" fill="#C60B1E" />
      <rect y="0.5" width="3" height="1" fill="#FFC400" />
      <rect y="1.5" width="3" height="0.5" fill="#C60B1E" />
    </svg>
  );
  if (code === "tn") return (
    // Botswana flag: light blue with central black band bordered by white
    <svg viewBox="0 0 3 2" width="100%" height="100%" preserveAspectRatio="none">
      <rect width="3" height="2" fill="#75AADB" />
      <rect y="0.7" width="3" height="0.6" fill="#FFFFFF" />
      <rect y="0.75" width="3" height="0.5" fill="#000000" />
    </svg>
  );
  if (code === "it") return (
    <svg viewBox="0 0 3 2" width="100%" height="100%" preserveAspectRatio="none">
      <rect width="1" height="2" fill="#009246" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#CE2B37" />
    </svg>
  );
  if (code === "cy") return (
    <svg viewBox="0 0 3 2" width="100%" height="100%" preserveAspectRatio="none">
      <rect width="3" height="1" fill="#FFFFFF" />
      <rect y="1" width="3" height="1" fill="#00B140" />
    </svg>
  );
  return null;
}

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("fr");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 w-6 h-6 rounded-full overflow-hidden shadow-[2px_3px_0px_rgba(0,0,0,0.12)] active:opacity-70 transition-opacity"
        aria-label="Switch language"
      >
        <FlagSvg code={selected} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white px-5 pt-5 pb-10 rounded-t-3xl">
            <div className="flex items-center justify-between mb-5">
              <p className="font-semibold text-base">Learning language</p>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-[var(--color-muted)]"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setSelected(lang.code); setOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-3.5 w-full text-left transition-colors ${
                    selected === lang.code
                      ? "bg-[var(--color-accent-light)]"
                      : "bg-[#F9F9F9]"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 shadow-sm">
                    <FlagSvg code={lang.code} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{lang.label}</p>
                    <p className="text-xs text-[var(--color-muted)]">{lang.native}</p>
                  </div>
                  {selected === lang.code && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
