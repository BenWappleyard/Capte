import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text")?.trim();
  const dir = searchParams.get("dir") ?? "fr|en";

  if (!text || text.length < 1) return NextResponse.json({ results: [] });

  const [from, to] = dir.split("|");
  const fromLabel = from === "fr" ? "French" : "English";
  const toLabel = to === "en" ? "English" : "French";

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Translate the following ${fromLabel} text into ${toLabel}. The text may be colloquial, informal, or slang — translate naturally into equivalent ${toLabel}, preserving the register and tone. Reply with only the translation, no explanation, no quotation marks.\n\n${text}`,
        },
      ],
    });

    const translation = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    return NextResponse.json({ results: translation ? [translation] : [] });
  } catch (err) {
    console.error("Translation error:", err);
    return NextResponse.json({ results: [] });
  }
}
