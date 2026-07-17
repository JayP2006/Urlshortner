import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Globe, Layers } from "lucide-react";
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import Skeleton from "../components/Skeleton.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { urlApi } from "../api/endpoints.js";

const COLORS = ["var(--brand)", "var(--brand-2)", "var(--info)", "var(--success)", "var(--warning)"];

export default function Analytics() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const promises = [urlApi.analyticsSummary(), urlApi.hourlyStats()];
        if (id) promises.push(urlApi.urlAnalytics(id));
        const results = await Promise.allSettled(promises);
        if (!alive) return;
        if (results[0].status === "fulfilled") setSummary(results[0].value.data);
        if (results[1].status === "fulfilled") setHourly(results[1].value.data || []);
        if (id && results[2]?.status === "fulfilled") setUrlData(results[2].value.data);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [id]);

  return (
    <PageTransition className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1.5 text-sm text-fg-muted">
          {id ? "Deep-dive intelligence for this link." : "Portfolio-wide performance across all your links."}
        </p>
      </header>

      {!id && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BarChart3} label="Total clicks" value={summary?.totalClicks ?? 0} tone="brand" index={0} />
          <StatCard icon={TrendingUp} label="Total links" value={summary?.totalLinks ?? 0} tone="info" index={1} />
          <StatCard icon={Layers} label="Active" value={summary?.activeLinks ?? 0} tone="success" index={2} />
          <StatCard icon={Globe} label="Avg / link" value={summary?.averageClicksPerLink ?? 0} tone="warning" index={3} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <div className="text-xs font-medium text-fg-subtle uppercase tracking-wider">Hourly clicks (24h)</div>
          <div className="text-lg font-semibold mb-3">Traffic trend</div>
          <div className="h-72">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer>
                <AreaChart data={hourly}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="var(--fg-subtle)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--fg-subtle)" fontSize={11} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Area dataKey="clicks" stroke="var(--brand)" strokeWidth={2} fill="url(#ag)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-xs font-medium text-fg-subtle uppercase tracking-wider">Top countries</div>
          <div className="text-lg font-semibold mb-3">Geo distribution</div>
          {loading ? <Skeleton className="h-48 w-full" /> : (summary?.topCountries?.length ? (
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={summary.topCountries} dataKey="clicks" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={4}>
                    {summary.topCountries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState icon={Globe} title="No geo data yet" description="Clicks will appear once your links get traffic." />)}
        </Card>
      </div>

      {!id && (
        <Card className="p-6">
          <div className="text-xs font-medium text-fg-subtle uppercase tracking-wider">Clicks (last 7 days)</div>
          <div className="text-lg font-semibold mb-3">Daily performance</div>
          <div className="h-64">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer>
                <BarChart data={summary?.clicksOverTime || []}>
                  <XAxis dataKey="name" stroke="var(--fg-subtle)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--fg-subtle)" fontSize={11} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="clicks" fill="var(--brand-2)" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      )}

      {id && urlData && (
        <Card className="p-6">
          <div className="text-xs font-medium text-fg-subtle uppercase tracking-wider">This link</div>
          <div className="text-lg font-semibold mb-1 font-mono text-gradient">/{urlData.url?.short_url}</div>
          <div className="text-xs text-fg-subtle mb-4 truncate">→ {urlData.url?.full_url}</div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={[...(urlData.data?.historics || []), ...(urlData.data?.predictions || [])]}>
                <XAxis dataKey="time" stroke="var(--fg-subtle)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--fg-subtle)" fontSize={11} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="clicks" stroke="var(--brand)" strokeWidth={2} dot={false} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="var(--brand-2)" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </PageTransition>
  );
}
