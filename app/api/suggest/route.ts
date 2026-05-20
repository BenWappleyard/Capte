import { NextRequest, NextResponse } from "next/server";

export interface Suggestion {
  word: string;
  lang: "fr" | "en";
}

async function frenchSuggestions(q: string): Promise<string[]> {
  const res = await fetch(
    `https://fr.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=8&format=json&origin=*`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json() as [string, string[]];
  return (data[1] ?? []).map((w: string) => w.toLowerCase());
}

async function englishSuggestions(q: string): Promise<string[]> {
  const res = await fetch(
    `https://api.datamuse.com/sug?s=${encodeURIComponent(q)}&max=8`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json() as { word: string }[];
  return data.map((d) => d.word);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ suggestions: [] });

  try {
    const [frWords, enWords] = await Promise.all([
      frenchSuggestions(q).catch(() => [] as string[]),
      englishSuggestions(q).catch(() => [] as string[]),
    ]);

    const suggestions: Suggestion[] = [
      ...frWords.slice(0, 6).map((w): Suggestion => ({ word: w, lang: "fr" })),
      ...enWords.slice(0, 6).map((w): Suggestion => ({ word: w, lang: "en" })),
    ];

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
