"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { calculateNextReview, type Rating } from "@/lib/srs";

export async function submitReview(cardId: string, rating: Rating) {
  const existing = await prisma.cardSchedule.findUnique({ where: { cardId } });

  const current = existing
    ? { interval: existing.interval, easeFactor: existing.easeFactor, repetitions: existing.repetitions }
    : { interval: 1, easeFactor: 2.5, repetitions: 0 };

  const next = calculateNextReview(rating, current);

  await prisma.$transaction([
    prisma.review.create({ data: { cardId, rating } }),
    prisma.cardSchedule.upsert({
      where: { cardId },
      create: { cardId, ...next },
      update: next,
    }),
  ]);
}

export async function importCards(rawText: string, language = "fr") {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const cards: { front: string; back: string; language: string; type: string }[] = [];

  for (const line of lines) {
    const separators = [" - ", " – ", ": ", "\t", " | "];
    let parts: string[] | null = null;

    for (const sep of separators) {
      if (line.includes(sep)) {
        const idx = line.indexOf(sep);
        parts = [line.slice(0, idx).trim(), line.slice(idx + sep.length).trim()];
        break;
      }
    }

    if (parts && parts[0] && parts[1]) {
      cards.push({ front: parts[0], back: parts[1], language, type: "vocabulary" });
    }
  }

  if (cards.length === 0) return { count: 0, error: "No cards could be parsed from this text." };

  const result = await prisma.card.createMany({ data: cards });
  revalidatePath("/");
  revalidatePath("/cards");
  return { count: result.count };
}

export async function addCard(front: string, back: string, language = "fr") {
  if (!front.trim() || !back.trim()) return { error: "Both fields are required." };
  await prisma.card.create({ data: { front: front.trim(), back: back.trim(), language, type: "vocabulary" } });
  revalidatePath("/");
  revalidatePath("/cards");
  return { ok: true };
}

export async function deleteCard(cardId: string) {
  await prisma.card.delete({ where: { id: cardId } });
  revalidatePath("/cards");
}
