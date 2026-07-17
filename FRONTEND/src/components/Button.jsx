import { motion } from "framer-motion";
import { cn } from "../utils/index.js";

const variants = {
  primary:
    "bg-[linear-gradient(135deg,var(--brand),var(--brand-2))] text-white shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--brand)_60%,transparent)] hover:brightness-110",
  secondary:
    "bg-surface-2 text-fg border border-border hover:border-border-strong",
  ghost: "text-fg hover:bg-surface-2",
  outline: "border border-border-strong text-fg hover:bg-surface-2",
  danger:
    "bg-danger/90 text-white hover:bg-danger shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--danger)_60%,transparent)]",
};

const sizes = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-2xl",
  icon: "h-10 w-10 rounded-xl",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  loading,
  disabled,
  className,
  children,
  ...props
}) {

  const MotionComp = motion(Comp);

  return (
    <MotionComp
      whileHover={disabled || loading ? undefined : { y: -1 }}
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      disabled={Comp === "button" ? (disabled || loading) : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {children}
    </MotionComp>
  );
}