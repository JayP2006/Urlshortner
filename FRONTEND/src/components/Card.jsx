import { motion } from "framer-motion";
import { cn } from "../utils/index.js";

export default function Card({ className, children, hover = false, ...props }) {
  const Comp = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        whileHover: { y: -3 },
        transition: { type: "spring", stiffness: 260, damping: 24 },
      }
    : {};
  return (
    <Comp
      className={cn(
        "relative rounded-2xl border border-border bg-bg-elev/70 backdrop-blur-xl",
        "shadow-[0_1px_0_0_color-mix(in_oklab,#fff_6%,transparent)_inset,0_20px_40px_-24px_color-mix(in_oklab,#000_50%,transparent)]",
        hover && "hover:border-border-strong transition-colors",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
}
