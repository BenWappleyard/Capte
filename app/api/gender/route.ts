import { NextRequest, NextResponse } from "next/server";

export type Gender = "m" | "f" | "mf" | null;
export type WordType = "noun" | "verb" | "adjective" | "adverb" | "phrase" | "pronoun" | "preposition" | null;

const WORD_TYPE_MAP: [RegExp, WordType][] = [
  [/\{\{S\|locution (nominale|verbale|adjectivale|adverbiale|prépositionnelle)[^}]*\}\}/i, "phrase"],
  [/\{\{S\|nom[^}]*\}\}/i, "noun"],
  [/\{\{S\|verbe[^}]*\}\}/i, "verb"],
  [/\{\{S\|adjectif[^}]*\}\}/i, "adjective"],
  [/\{\{S\|adverbe[^}]*\}\}/i, "adverb"],
  [/\{\{S\|pronom[^}]*\}\}/i, "pronoun"],
  [/\{\{S\|préposition[^}]*\}\}/i, "preposition"],
  [/===\s*Nom commun\s*===/i, "noun"],
  [/===\s*Verbe\s*===/i, "verb"],
  [/===\s*Adjectif\s*===/i, "adjective"],
  [/===\s*Adverbe\s*===/i, "adverb"],
];

export async function GET(req: NextRequest) {
  const word = new URL(req.url).searchParams.get("word")?.trim();
  if (!word) return NextResponse.json({ gender: null, wordType: null });

  try {
    const url = `https://fr.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext&format=json&origin=*`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json() as { parse?: { wikitext?: { "*": string } } };
    const wikitext = data.parse?.wikitext?.["*"] ?? "";

    return NextResponse.json({
      gender: parseGender(wikitext),
      wordType: parseWordType(wikitext),
    });
  } catch {
    return NextResponse.json({ gender: null, wordType: null });
  }
}

function parseGender(wikitext: string): Gender {
  const genreMatch = wikitext.match(/\|genre\s*=\s*([mf]{1,2})/i);
  if (genreMatch) {
    const g = genreMatch[1].toLowerCase();
    if (g === "m") return "m";
    if (g === "f") return "f";
    if (g === "mf" || g === "fm") return "mf";
  }
  if (/\{\{mf\}\}/i.test(wikitext)) return "mf";
  if (/\{\{m\}\}/i.test(wikitext)) return "m";
  if (/\{\{f\}\}/i.test(wikitext)) return "f";
  if (/\bféminin\b/i.test(wikitext) && !/\bmasculin\b/i.test(wikitext)) return "f";
  if (/\bmasculin\b/i.test(wikitext) && !/\bféminin\b/i.test(wikitext)) return "m";
  return null;
}

function parseWordType(wikitext: string): WordType {
  for (const [pattern, type] of WORD_TYPE_MAP) {
    if (pattern.test(wikitext)) return type;
  }
  return null;
}
