import { Bell, Search, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../utils/index.js";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const [notifs, setNotifs] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 hidden lg:flex glass border-b border-border h-16 items-center px-6 gap-4">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-subtle" />
        <input
          placeholder="Search links, analytics, settings…"
          className="w-full h-10 rounded-xl bg-surface-2/60 border border-border pl-10 pr-16 text-sm placeholder:text-fg-subtle focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition"
        />
        <kbd className="hidden md:inline absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-fg-subtle border border-border rounded px-1.5 py-0.5 font-mono">⌘ K</kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggle}
          className="h-10 w-10 grid place-items-center rounded-xl hover:bg-surface-2 text-fg-muted hover:text-fg transition"
          title="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.span>
          </AnimatePresence>
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifs((v) => !v)}
            className="h-10 w-10 grid place-items-center rounded-xl hover:bg-surface-2 text-fg-muted hover:text-fg transition relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand ring-2 ring-bg-elev" />
          </button>
          <AnimatePresence>
            {notifs && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-12 w-80 rounded-2xl border border-border bg-bg-elev shadow-2xl p-2 z-50"
              >
                <div className="px-3 py-2 text-xs font-semibold text-fg-subtle uppercase tracking-wide">Notifications</div>
                {[1,2,3].map((i) => (
                  <div key={i} className="px-3 py-2.5 rounded-xl hover:bg-surface-2 transition">
                    <div className="text-sm font-medium">Traffic spike detected</div>
                    <div className="text-xs text-fg-subtle mt-0.5">Your link /promo-2026 is trending upward</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {user && (
          <div className="relative ml-1">
            <button
              onClick={() => setMenu((v) => !v)}
              className={cn(
                "flex items-center gap-2 pl-1 pr-2 h-10 rounded-xl hover:bg-surface-2 transition",
                menu && "bg-surface-2"
              )}
            >
              <img src={user.gravatar} alt="" className="h-8 w-8 rounded-lg ring-1 ring-border" />
              <div className="hidden xl:block text-left">
                <div className="text-sm font-medium leading-none">{user.name}</div>
                <div className="text-[11px] text-fg-subtle mt-0.5">Pro plan</div>
              </div>
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-12 w-56 rounded-2xl border border-border bg-bg-elev shadow-2xl p-2 z-50"
                  onMouseLeave={() => setMenu(false)}
                >
                  <Link to="/profile" onClick={() => setMenu(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-surface-2">Profile</Link>
                  <Link to="/settings" onClick={() => setMenu(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-surface-2">Settings</Link>
                  <div className="my-1 h-px bg-border" />
                  <button
                    onClick={async () => { await logout(); navigate("/login"); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-danger/10 hover:text-danger transition"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}
