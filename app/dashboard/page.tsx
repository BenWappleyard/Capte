export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { DashboardClient } from "./DashboardClient";

async function getStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalCards, reviews, schedules] = await Promise.all([
    prisma.card.count(),
    prisma.review.findMany({
      where: { reviewedAt: { gte: thirtyDaysAgo } },
      orderBy: { reviewedAt: "asc" },
    }),
    prisma.cardSchedule.findMany(),
  ]);

  const ratingCounts = reviews.reduce(
    (acc, r) => { acc[r.rating] = (acc[r.rating] ?? 0) + 1; return acc; },
    {} as Record<number, number>
  );

  const goodPlus = (ratingCounts[3] ?? 0) + (ratingCounts[4] ?? 0);
  const retention = reviews.length > 0 ? Math.round((goodPlus / reviews.length) * 100) : 0;

  const dailyMap: Record<string, { date: string; count: number; retention: number }> = {};
  for (const review of reviews) {
    const key = review.reviewedAt.toISOString().split("T")[0];
    if (!dailyMap[key]) dailyMap[key] = { date: key, count: 0, retention: 0 };
    dailyMap[key].count += 1;
    if (review.rating >= 3) dailyMap[key].retention += 1;
  }
  const dailyData = Object.values(dailyMap).map((d) => ({
    ...d,
    retention: d.count > 0 ? Math.round((d.retention / d.count) * 100) : 0,
  }));

  const due7 = schedules.filter((s) => {
    const d = new Date(s.nextReview);
    const in7 = new Date(now);
    in7.setDate(in7.getDate() + 7);
    return d <= in7;
  }).length;

  return { totalCards, totalReviews: reviews.length, retention, dailyData, due7 };
}

export default async function DashboardPage() {
  const stats = await getStats();
  return <DashboardClient stats={stats} />;
}
