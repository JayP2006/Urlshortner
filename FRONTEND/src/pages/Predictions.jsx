import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import Skeleton from "../components/Skeleton.jsx";
import { urlApi } from "../api/endpoints.js";

export default function Predictions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await urlApi.predictions();
        setData((res.future || []).map((v, i) => ({ hour: `+${i + 1}h`, clicks: v })));
      } finally { setLoading(false); }
    })();
  }, []);

  const total = data.reduce((a, b) => a + b.clicks, 0);
  const peak = Math.max(...data.map(d => d.clicks), 0);
  const risk = peak > 25 ? "High" : peak > 15 ? "Medium" : "Low";
  const riskTone = risk === "High" ? "text-danger" : risk === "Medium" ? "text-warning" : "text-success";

  return (
    <PageTransition className="space-y-6">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 text-brand px-3 py-1 text-xs mb-3">
          <Sparkles className="h-3.5 w-3.5" /> AI-powered
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Traffic predictions</h1>
        <p className="mt-1.5 text-sm text-fg-muted">Forecast the next 12 hours across your link portfolio.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-xs text-fg-subtle uppercase tracking-wider">Expected clicks (12h)</div>
          <div className="mt-2 text-3xl font-semibold">{total}</div>
          <div className="mt-1 text-xs text-fg-subtle flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Forecast horizon</div>
        </Card>
        <Card className="p-6">
          <div className="text-xs text-fg-subtle uppercase tracking-wider">Peak hour clicks</div>
          <div className="mt-2 text-3xl font-semibold">{peak}</div>
          <div className="mt-1 text-xs text-fg-subtle flex items-center gap-1"><Zap className="h-3 w-3" /> Highest predicted burst</div>
        </Card>
        <Card className="p-6">
          <div className="text-xs text-fg-subtle uppercase tracking-wider">Risk level</div>
          <div className={`mt-2 text-3xl font-semibold ${riskTone}`}>{risk}</div>
          <div className="mt-1 text-xs text-fg-subtle flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Based on predicted spikes</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="text-xs font-medium text-fg-subtle uppercase tracking-wider">Forecast</div>
        <div className="text-lg font-semibold mb-3">Next 12 hours</div>
        <div className="h-72">
          {loading ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer>
              <BarChart data={data}>
                <defs>
                  <linearGradient id="gpred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" />
                    <stop offset="100%" stopColor="var(--brand-2)" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="var(--fg-subtle)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--fg-subtle)" fontSize={11} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="clicks" fill="url(#gpred)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { title: "Boost during peak", desc: "Consider paid promotion an hour before your predicted peak to compound organic traffic." },
          { title: "Protect against abuse", desc: "Predicted spikes above 25 clicks/hour may warrant password protection on sensitive links." },
        ].map((r, i) => (
          <motion.div
            key={r.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-brand/10 text-brand grid place-items-center"><Sparkles className="h-4 w-4" /></div>
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="mt-1 text-sm text-fg-muted">{r.desc}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
}
