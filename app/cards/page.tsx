export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { CardsClient } from "./CardsClient";

export default async function CardsPage() {
  const cards = await prisma.card.findMany({
    include: { schedule: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-5 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Cards</h1>
        <span className="text-sm text-[var(--color-muted)]">{cards.length} total</span>
      </div>
      <CardsClient cards={cards} />
    </div>
  );
}
