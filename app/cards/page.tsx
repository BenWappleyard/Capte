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
      <CardsClient cards={cards} total={cards.length} />
    </div>
  );
}
