export const dynamic = 'force-dynamic';

import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight, CheckCircle } from "lucide-react";
import { TypewriterGreeting } from "@/components/TypewriterGreeting";

async function getStats() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const [totalCards, dueScheduled, scheduledCount, reviewedToday] = await Promise.all([
    prisma.card.count(),
    prisma.cardSchedule.count({ where: { nextReview: { lte: now } } }),
    prisma.cardSchedule.count(),
    prisma.review.count({ where: { reviewedAt: { gte: todayStart } } }),
  ]);

  const newCards = totalCards - scheduledCount;
  return { totalCards, dueCards: dueScheduled + newCards, reviewedToday };
}

export default async function HomePage() {
  const stats = await getStats();
  const hasSession = stats.dueCards > 0;

  return (
    <div className="px-5 pt-10">
      <div className="mb-8">
        <p className="text-xs text-[var(--color-muted)] font-medium tracking-widest uppercase">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <TypewriterGreeting />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard label="Due today" value={stats.dueCards} accent />
        <StatCard label="Reviewed" value={stats.reviewedToday} />
        <StatCard label="Total cards" value={stats.totalCards} />
      </div>

      {hasSession ? (
        <Link
          href="/session"
          className="flex items-center justify-between w-full bg-[var(--color-accent)] text-white rounded-2xl px-6 py-5 font-medium text-lg active:opacity-90 transition-opacity"
        >
          <span>Start session</span>
          <span className="flex items-center gap-2 text-sm opacity-80">
            {stats.dueCards} cards <ArrowRight size={18} />
          </span>
        </Link>
      ) : (
        <div className="flex items-center gap-3 w-full bg-[var(--color-accent-light)] rounded-2xl px-6 py-5">
          <CheckCircle size={22} className="text-[var(--color-accent)] shrink-0" />
          <div>
            <p className="font-medium text-[var(--color-accent)]">All caught up</p>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">No cards due right now</p>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl px-4 py-4 ${
        accent
          ? "bg-[var(--color-accent-light)]"
          : "bg-white border border-[var(--color-border)]"
      }`}
    >
      <p className={`text-2xl font-semibold ${accent ? "text-[var(--color-accent)]" : ""}`}>
        {value}
      </p>
      <p className="text-xs text-[var(--color-muted)] mt-1">{label}</p>
    </div>
  );
}
