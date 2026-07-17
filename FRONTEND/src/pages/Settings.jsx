import { motion } from "framer-motion";
import { Sun, Moon, Bell, Globe, Palette } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-brand" : "bg-surface-2 border border-border"}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
        style={{ left: checked ? "22px" : "2px" }}
      />
    </button>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <PageTransition className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-fg-muted">Customize your workspace experience.</p>
      </header>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Palette className="h-5 w-5 text-brand" />
          <div className="text-lg font-semibold">Appearance</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "light", icon: Sun, label: "Light" },
            { key: "dark", icon: Moon, label: "Dark" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`rounded-2xl border p-4 text-left transition ${
                theme === key ? "border-brand bg-brand/5" : "border-border hover:border-border-strong bg-surface-2/50"
              }`}
            >
              <Icon className={`h-5 w-5 mb-2 ${theme === key ? "text-brand" : "text-fg-muted"}`} />
              <div className="font-medium">{label}</div>
              <div className="text-xs text-fg-subtle mt-0.5">Use {label.toLowerCase()} theme</div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="h-5 w-5 text-brand" />
          <div className="text-lg font-semibold">Notifications</div>
        </div>
        <div className="space-y-4">
          {[
            ["Traffic spike alerts", "Get notified when links exceed predicted volume", true],
            ["Weekly summary", "A weekly digest of your top performing links", true],
            ["Product updates", "Occasional emails about new features", false],
          ].map(([title, desc, def], i) => (
            <SettingRow key={title} title={title} desc={desc} defaultChecked={def} />
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Globe className="h-5 w-5 text-brand" />
          <div className="text-lg font-semibold">Preferences</div>
        </div>
        <div className="space-y-4">
          <SettingRow title="Auto-generate QR codes" desc="Create a QR for every new short link" defaultChecked />
          <SettingRow title="Show expired links" desc="Include expired links in My URLs by default" />
        </div>
      </Card>
    </PageTransition>
  );
}

function SettingRow({ title, desc, defaultChecked }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-fg-subtle mt-0.5">{desc}</div>
      </div>
      <ToggleControlled defaultChecked={defaultChecked} />
    </div>
  );
}

import { useState } from "react";
function ToggleControlled({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return <Toggle checked={on} onChange={setOn} />;
}
