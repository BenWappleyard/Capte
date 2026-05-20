export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { buildExercise } from "@/lib/exercises";
import { SessionClient } from "./SessionClient";

export default async function SessionPage() {
  const now = new Date();

  const allCards = await prisma.card.findMany({ take: 500 });

  const scheduledDue = await prisma.card.findMany({
    where: {
      schedule: { nextReview: { lte: now } },
    },
    include: { schedule: true },
    take: 30,
  });

  const scheduledIds = new Set(
    (await prisma.cardSchedule.findMany({ select: { cardId: true } })).map((s) => s.cardId)
  );
  const newCards = allCards
    .filter((c) => !scheduledIds.has(c.id))
    .slice(0, Math.max(0, 20 - scheduledDue.length));

  const sessionCards = [...scheduledDue, ...newCards]
    .sort(() => Math.random() - 0.5)
    .slice(0, 25);

  if (sessionCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
        <p className="text-xl font-semibold mb-2">Nothing due</p>
        <p className="text-[var(--color-muted)]">Come back later or import more cards.</p>
      </div>
    );
  }

  const exercises = sessionCards.map((card) => buildExercise(card, allCards));

  return <SessionClient exercises={exercises} />;
}
