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
}

function shortDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function DashboardClient({ stats }: { stats: Stats }) {
  const hasData = stats.dailyData.length > 0;

  return (
    <div className="px-5 pt-8 pb-4">
      <div className="grid grid-cols-2 gap-3 mb-7">
        <Metric label="Reviews (30d)" value={stats.totalReviews} />
        <Metric label="Retention" value={`${stats.retention}%`} accent />
      </div>

      {hasData ? (
        <>
          <Section title="Daily reviews">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.dailyData} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                    <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={shortDate}
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [v, "Reviews"]}
                  labelFormatter={(d) => shortDate(String(d))}
                  contentStyle={{ borderRadius: 0, border: "none", boxShadow: "2px 3px 0px rgba(0,0,0,0.12)", fontSize: 13 }}
                  cursor={{ fill: "#EFF6FF" }}
                />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Retention (%)">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.dailyData} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={shortDate}
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Retention"]}
                  labelFormatter={(d) => shortDate(String(d))}
                  contentStyle={{ borderRadius: 0, border: "none", boxShadow: "2px 3px 0px rgba(0,0,0,0.12)", fontSize: 13 }}
                  cursor={{ stroke: "#DBEAFE", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="retention"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fill="url(#retGrad)"
                  dot={{ fill: "#2563EB", stroke: "#fff", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
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
    <div className={`rounded-3xl px-4 py-4 ${accent ? "bg-[var(--color-accent-light)]" : "bg-white"}`}>
      <p className={`text-2xl font-semibold ${accent ? "text-[var(--color-accent)]" : ""}`}>{value}</p>
      <p className="text-xs text-[var(--color-muted)] mt-1">{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-[var(--color-muted)] mb-3">{title}</p>
      <div className="bg-white rounded-3xl p-5">
        {children}
      </div>
    </div>
  );
}
