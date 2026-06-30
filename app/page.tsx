export const dynamic = 'force-dynamic';

import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import { TypewriterGreeting } from "@/components/TypewriterGreeting";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

async function getStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalCards, reviewedToday] = await Promise.all([
    prisma.card.count(),
    prisma.review.count({ where: { reviewedAt: { gte: todayStart } } }),
  ]);

  return { totalCards, reviewedToday };
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="relative px-5 pt-10">
      <LanguageSwitcher />
      <div className="mb-8">
        <TypewriterGreeting />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard label="Reviewed today" value={stats.reviewedToday} />
        <StatCard label="Total cards" value={stats.totalCards} />
      </div>

      <div className="session-border rounded-2xl p-[2px]">
        <Link
          href="/session"
          className="flex items-center justify-between w-full bg-[#EEF2FF] text-[#002395] rounded-[14px] px-6 py-5 font-medium text-lg active:opacity-90 transition-opacity"
        >
          <span>Start session</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white px-4 py-4 shadow-[2px_3px_0px_rgba(0,0,0,0.12)]">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-[var(--color-muted)] mt-1">{label}</p>
    </div>
  );
}
