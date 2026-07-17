import { Link } from "react-router-dom";
import { cn } from "../utils/index.js";

export default function Logo({ className, showText = true, size = "md" }) {
  const sizes = { sm: "h-7 w-7 text-base", md: "h-9 w-9 text-lg", lg: "h-12 w-12 text-2xl" };
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5 group", className)}>
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-[linear-gradient(135deg,var(--brand),var(--brand-2))] blur-md opacity-60 group-hover:opacity-90 transition" />
        <div
          className={cn(
            "relative rounded-xl bg-[linear-gradient(135deg,var(--brand),var(--brand-2))] font-serif text-white grid place-items-center shadow-lg",
            sizes[size]
          )}
        >
          S
        </div>
      </div>
      {showText && (
        <span className="font-semibold tracking-tight text-fg text-lg">
          Shrink<span className="text-gradient">X</span>
        </span>
      )}
    </Link>
  );
}
