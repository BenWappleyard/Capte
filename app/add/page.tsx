import { prisma } from "@/lib/db";
import { AddView } from "./AddView";
import { BulkImport } from "./BulkImport";

export const dynamic = "force-dynamic";

export default async function AddPage() {
  const cards = await prisma.card.findMany({
    select: { front: true, back: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-5 pt-8">
      <h1 className="text-2xl font-semibold mb-6">Add</h1>
      <AddView deckCards={cards} />
      <BulkImport />
    </div>
  );
}
