import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-10">{children}</div>
      <div className="hidden lg:flex relative overflow-hidden items-center justify-center p-10 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand)_28%,var(--bg)),color-mix(in_oklab,var(--brand-2)_22%,var(--bg)))]">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md text-white"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5" /> Trusted by growth teams
          </div>
          <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight">
            The link platform that <span className="font-serif italic">predicts</span> your traffic.
          </h2>
          <p className="mt-4 text-white/80">
            ShrinkX combines shortening, protection, geo-routing, and AI predictions into one premium workspace.
          </p>
          <div className="mt-10 space-y-3">
            {[
              [ShieldCheck, "Enterprise-grade protection on every link"],
              [Zap, "Sub-100ms redirect performance globally"],
              [Sparkles, "AI-powered click predictions and spike alerts"],
            ].map(([Icon, txt], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur p-3.5"
              >
                <div className="h-9 w-9 rounded-lg bg-white/15 grid place-items-center">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm">{txt}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
