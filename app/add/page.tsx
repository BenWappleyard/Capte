import { prisma } from "@/lib/db";
import { AddView } from "./AddView";

export const dynamic = "force-dynamic";

export default async function AddPage() {
  const cards = await prisma.card.findMany({
    select: { front: true, back: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-5 pt-8">
      <AddView deckCards={cards} />
    </div>
  );
}
