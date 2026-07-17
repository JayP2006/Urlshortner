import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Link2, Lock, MapPin, LinkIcon, BarChart3, Sparkles,
  QrCode, Wand2, Settings, User, LogOut, ChevronLeft, Menu,
} from "lucide-react";
import Logo from "../Logo.jsx";
import Navbar from "./Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { cn } from "../../utils/index.js";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/shorten", icon: Link2, label: "Shorten URL" },
  { to: "/protected-link", icon: Lock, label: "Protected Link" },
  { to: "/location-link", icon: MapPin, label: "Location Link" },
  { to: "/my-urls", icon: LinkIcon, label: "My URLs" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/predictions", icon: Sparkles, label: "Predictions" },
  { to: "/qr-generator", icon: QrCode, label: "QR Generator" },
  { to: "/ai-preview", icon: Wand2, label: "AI Preview" },
];

const bottomNav = [
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const width = collapsed ? "lg:w-[76px]" : "lg:w-[248px]";

  return (
    <div className="min-h-screen w-full">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 glass border-b border-border px-4 h-14 flex items-center justify-between">
        <Logo />
        <button
          className="p-2 rounded-lg hover:bg-surface-2"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar (desktop) */}
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col glass border-r border-border transition-[width] duration-300",
          width
        )}
      >
        <SidebarInner collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} onLogout={handleLogout} user={user} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] glass-strong border-r border-border-strong lg:hidden flex flex-col"
            >
              <SidebarInner collapsed={false} onLogout={handleLogout} onNavigate={() => setMobileOpen(false)} user={user} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-[248px]")}>
        <Navbar />
        <main className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-[1500px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarInner({ collapsed, onToggle, onLogout, onNavigate, user }) {
  return (
    <>
      <div className={cn("h-16 flex items-center px-4 border-b border-border", collapsed && "justify-center")}>
        <Logo showText={!collapsed} />
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {nav.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
        <div className="pt-4 mt-4 border-t border-border space-y-1">
          {bottomNav.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>
      <div className="p-3 border-t border-border space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 rounded-xl bg-surface-2 p-3">
            <img src={user.gravatar} alt="" className="h-9 w-9 rounded-full ring-2 ring-border-strong" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-fg-subtle truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-3 h-10 text-sm text-fg-muted hover:bg-danger/10 hover:text-danger transition",
            collapsed && "justify-center px-0"
          )}
          title="Log out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
        {onToggle && (
          <button
            onClick={onToggle}
            className={cn(
              "hidden lg:flex w-full items-center gap-3 rounded-xl px-3 h-9 text-xs text-fg-subtle hover:bg-surface-2 transition",
              collapsed && "justify-center px-0"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 shrink-0 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
      </div>
    </>
  );
}

function NavItem({ to, icon: Icon, label, collapsed, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      end={to === "/analytics"}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 h-10 text-sm font-medium transition-all",
          isActive
            ? "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand)_22%,transparent),color-mix(in_oklab,var(--brand-2)_18%,transparent))] text-fg border border-brand/20"
            : "text-fg-muted hover:text-fg hover:bg-surface-2",
          collapsed && "justify-center px-0"
        )
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[linear-gradient(180deg,var(--brand),var(--brand-2))]"
            />
          )}
          <Icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  );
}
