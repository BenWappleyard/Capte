"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

interface DailyData {
  date: string;
  count: number;
  retention: number;
}

interface Stats {
  totalCards: number;
  totalReviews: number;
  retention: number;
  dailyData: DailyData[];
  due7: number;
}

function shortDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function DashboardClient({ stats }: { stats: Stats }) {
  const hasData = stats.dailyData.length > 0;

  return (
    <div className="px-5 pt-8 pb-4">
      <h1 className="text-2xl font-semibold mb-6">Progress</h1>

      <div className="grid grid-cols-2 gap-3 mb-7">
        <Metric label="Total cards" value={stats.totalCards} />
        <Metric label="Reviews (30d)" value={stats.totalReviews} />
        <Metric label="Retention" value={`${stats.retention}%`} accent />
        <Metric label="Due in 7 days" value={stats.due7} />
      </div>

      {hasData ? (
        <>
          <Section title="Daily reviews">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.dailyData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#E7E5E4" />
                <XAxis
                  dataKey="date"
                  tickFormatter={shortDate}
                  tick={{ fontSize: 10, fill: "#78716C" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10, fill: "#78716C" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [v, "Reviews"]}
                  labelFormatter={(d) => shortDate(String(d))}
                  contentStyle={{ borderRadius: 12, border: "1px solid #E7E5E4", fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Retention (%)">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={stats.dailyData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#E7E5E4" />
                <XAxis
                  dataKey="date"
                  tickFormatter={shortDate}
                  tick={{ fontSize: 10, fill: "#78716C" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#78716C" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Retention"]}
                  labelFormatter={(d) => shortDate(String(d))}
                  contentStyle={{ borderRadius: 12, border: "1px solid #E7E5E4", fontSize: 12 }}
                />
                <defs>
                  <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D9488" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="retention"
                  stroke="#0D9488"
                  strokeWidth={2}
                  fill="url(#retGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Section>
        </>
      ) : (
        <div className="flex items-center justify-center h-40 text-[var(--color-muted)] text-sm">
          Complete some sessions to see your progress.
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl px-4 py-4 ${accent ? "bg-[var(--color-accent-light)]" : "bg-white border border-[var(--color-border)]"}`}>
      <p className={`text-2xl font-semibold ${accent ? "text-[var(--color-accent)]" : ""}`}>{value}</p>
      <p className="text-xs text-[var(--color-muted)] mt-1">{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-[var(--color-muted)] mb-3">{title}</p>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4">
        {children}
      </div>
    </div>
  );
}
