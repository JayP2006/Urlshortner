import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Link2, MousePointerClick, TrendingUp, Users, QrCode, Lock, MapPin, Sparkles,
  ArrowUpRight, Plus, ArrowRight,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import PageTransition from "../components/PageTransition.jsx";
import StatCard from "../components/StatCard.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Skeleton from "../components/Skeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Badge from "../components/Badge.jsx";
import { urlApi } from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatRelative, shortHost } from "../utils/index.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [recent, setRecent] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [s, h, r, p] = await Promise.allSettled([
          urlApi.analyticsSummary(),
          urlApi.hourlyStats(),
          urlApi.recentLinks(),
          urlApi.predictions(),
        ]);
        console.log(r)
        if (!alive) return;
        if (s.status === "fulfilled") setSummary(s.value.data);
        if (h.status === "fulfilled") setHourly(h.value.data || []);
        if (r.status === "fulfilled") setRecent(r.value.data || []);
        if (p.status === "fulfilled") {
          const arr = p.value.data?.future || [];
          setPredictions(arr.map((v, i) => ({ hour: `+${i + 1}h`, clicks: v })));
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <PageTransition className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, <span className="text-gradient font-serif italic">{user?.name?.split(" ")[0] || "there"}</span>
          </h1>
          <p className="mt-1.5 text-sm text-fg-muted">Here's how your links are performing today.</p>
        </div>
        <div className="flex gap-2">
          <Button as={Link} to="/shorten" size="md"><Plus className="h-4 w-4" /> New link</Button>
          <Button as={Link} to="/my-urls" variant="secondary" size="md">My URLs</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Link2} label="Total links" value={summary?.totalLinks ?? 0} tone="brand" index={0} />
        <StatCard icon={MousePointerClick} label="Total clicks" value={summary?.totalClicks ?? 0} tone="info" index={1} />
        <StatCard icon={Users} label="Active links" value={summary?.activeLinks ?? 0} tone="success" index={2} />
        <StatCard icon={TrendingUp} label="Avg / link" value={summary?.averageClicksPerLink ?? 0} tone="warning" index={3} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-medium text-fg-subtle uppercase tracking-wider">Traffic (24h)</div>
              <div className="text-lg font-semibold mt-1">Hourly clicks</div>
            </div>
            <Badge tone="brand">Live</Badge>
          </div>
          <div className="h-64">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourly.length ? hourly : Array.from({ length: 12 }, (_, i) => ({ hour: `${i}h`, clicks: 0 }))}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="var(--fg-subtle)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--fg-subtle)" fontSize={11} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="clicks" stroke="var(--brand)" strokeWidth={2} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-brand" />
            <div className="text-xs font-medium text-fg-subtle uppercase tracking-wider">AI Prediction</div>
          </div>
          <div className="text-lg font-semibold">Next 12 hours</div>
          <div className="h-48 mt-2">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictions}>
                  <XAxis dataKey="hour" stroke="var(--fg-subtle)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="clicks" fill="var(--brand-2)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <Link to="/predictions" className="mt-3 inline-flex items-center gap-1 text-xs text-brand hover:underline">
            View full forecast <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>
      </div>

      {/* Quick actions + recent */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-lg font-semibold mb-4">Quick actions</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { to: "/shorten", icon: Link2, label: "Shorten" },
              { to: "/protected-link", icon: Lock, label: "Protected" },
              { to: "/location-link", icon: MapPin, label: "Location" },
              { to: "/qr-generator", icon: QrCode, label: "QR Code" },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="group rounded-xl border border-border bg-surface-2/60 hover:border-brand/40 hover:bg-brand/5 transition p-4">
                <a.icon className="h-5 w-5 text-brand mb-2" />
                <div className="text-sm font-medium">{a.label}</div>
                <div className="text-xs text-fg-subtle mt-1 flex items-center gap-1">Open <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" /></div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Recent links</div>
            <Link to="/my-urls" className="text-xs text-brand hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : recent.length === 0 ? (
            <EmptyState icon={Link2} title="No links yet" description="Your recent links will appear here." action={<Button as={Link} to="/shorten" size="sm">Create link</Button>} />
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((l) => (
                <motion.li
                  key={l.short_url || l.shortCode}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="py-3 flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-surface-2 grid place-items-center text-brand">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">/{l.short_url}</div>
                    <div className="text-xs text-fg-subtle">{formatRelative(l.createdAt)}</div>
                  </div>
                  <Badge tone={l.active === false ? "danger" : "success"}>{l.active === false ? "inactive" : "active"}</Badge>
                </motion.li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PageTransition>
  );
}
