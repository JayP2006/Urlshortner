import { Link } from "react-router-dom";
import { motion } from "framer-motion";import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  BarChart3,
  QrCode,
  Sparkles,
  Check,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import PageTransition from "../components/PageTransition.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useState } from "react";

const features = [
  { icon: Zap, title: "Instant shortening", desc: "Sub-100ms link creation with global edge routing." },
  { icon: Shield, title: "Protected links", desc: "Password-gate any URL with cryptographic security." },
  { icon: Globe, title: "Geo-routing", desc: "Send visitors to different destinations by country." },
  { icon: BarChart3, title: "Live analytics", desc: "Hourly, daily, and lifetime click intelligence." },
  { icon: QrCode, title: "Beautiful QR", desc: "High-density QR codes for every link, instant PNG export." },
  { icon: Sparkles, title: "AI predictions", desc: "Forecast traffic and detect spikes before they happen." },
];

export default function Landing() {
  const { theme, toggle } = useTheme();
const [menuOpen, setMenuOpen] = useState(false);
  return (
    <PageTransition>
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 glass border-b border-border">
  <div className="max-w-7xl mx-auto flex h-16 items-center px-4 sm:px-6">

    <Logo />

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center gap-8 mx-auto text-sm text-fg-muted">
      <a href="#features" className="hover:text-fg transition">Features</a>
      <a href="#pricing" className="hover:text-fg transition">Pricing</a>
      <a href="#about" className="hover:text-fg transition">About</a>
    </nav>

    {/* Desktop Right */}
    <div className="hidden md:flex ml-auto items-center gap-2">
      <button
        onClick={toggle}
        className="h-9 w-9 grid place-items-center rounded-lg hover:bg-surface-2 text-fg-muted"
      >
        {theme === "dark"
          ? <Sun className="h-4 w-4" />
          : <Moon className="h-4 w-4" />}
      </button>

      <Link
        to="/login"
        className="text-sm text-fg-muted hover:text-fg px-3 h-9 grid place-items-center"
      >
        Sign in
      </Link>

      <Button as={Link} to="/register" size="sm">
        Get started
      </Button>
    </div>

    {/* Mobile */}
    <div className="ml-auto flex md:hidden items-center gap-2">

      <button
        onClick={toggle}
        className="h-9 w-9 rounded-lg grid place-items-center hover:bg-surface-2"
      >
        {theme === "dark"
          ? <Sun className="h-4 w-4" />
          : <Moon className="h-4 w-4" />}
      </button>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="h-9 w-9 rounded-lg border border-border grid place-items-center"
      >
        {menuOpen
          ? <X className="h-5 w-5" />
          : <Menu className="h-5 w-5" />}
      </button>

    </div>

  </div>

  {menuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="md:hidden border-t border-border bg-bg-elev"
    >
      <nav className="flex flex-col p-4 gap-3">

        <a
          href="#features"
          onClick={() => setMenuOpen(false)}
          className="py-2"
        >
          Features
        </a>

        <a
          href="#pricing"
          onClick={() => setMenuOpen(false)}
          className="py-2"
        >
          Pricing
        </a>

        <a
          href="#about"
          onClick={() => setMenuOpen(false)}
          className="py-2"
        >
          About
        </a>

        <Button
          as={Link}
          to="/login"
          variant="secondary"
          className="w-full"
          onClick={() => setMenuOpen(false)}
        >
          Sign in
        </Button>

        <Button
          as={Link}
          to="/register"
          className="w-full"
          onClick={() => setMenuOpen(false)}
        >
          Get Started
        </Button>

      </nav>
    </motion.div>
  )}

</header>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg" />
          <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 pt-24 pb-32 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs text-fg-muted mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Now with AI traffic predictions
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
            >
              Link intelligence,
              <br />
              <span className="text-gradient font-serif italic">reimagined.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-6 max-w-2xl mx-auto text-lg text-fg-muted"
            >
              The premium URL platform for teams that care about performance,
              privacy, and predicting where traffic will go next.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-10 flex flex-wrap justify-center gap-3"
            >
              <Button as={Link} to="/register" size="lg">
                Start free <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} to="/login" variant="secondary" size="lg">Sign in</Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-20 mx-auto max-w-5xl"
            >
              <div className="rounded-3xl border border-border-strong bg-bg-elev/80 backdrop-blur-xl p-2 shadow-2xl">
                <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-bg-elev p-8 min-h-[320px] grid-bg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
  {[
    ["Total links", "12,489"],
    ["Clicks today", "3,204"],
    ["Visitors", "1,912"],
    ["Countries", "42"],
  ].map(([l, v]) => (
    <div
      key={l}
      className="rounded-xl bg-bg-elev/70 border border-border p-3 sm:p-4"
    >
      <div className="text-[11px] sm:text-xs text-fg-subtle leading-tight">
        {l}
      </div>

      <div className="mt-1 text-xl sm:text-2xl font-semibold">
        {v}
      </div>
    </div>
  ))}
</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Built for professionals.</h2>
            <p className="mt-3 text-fg-muted">Everything you need to run links like a growth team.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 hover:border-border-strong transition group"
              >
                <div className="h-11 w-11 rounded-xl bg-[linear-gradient(135deg,var(--brand),var(--brand-2))] grid place-items-center mb-4 shadow-lg">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <div className="font-semibold text-fg">{f.title}</div>
                <p className="mt-1 text-sm text-fg-muted">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-32 text-center">
          <div className="glass rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Ready when you are.
            </h2>
            <p className="mt-3 text-fg-muted">Create your first link in under 30 seconds.</p>
            <div className="mt-8">
              <Button as={Link} to="/register" size="lg">
                Create free account <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t border-border py-8 text-center text-sm text-fg-subtle">
          © {new Date().getFullYear()} ShrinkX — Link intelligence for modern teams.
        </footer>
      </div>
    </PageTransition>
  );
}
