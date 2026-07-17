import { motion } from "framer-motion";

export default function Skeleton({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      className={`rounded-lg bg-surface-2 ${className}`}
    />
  );
}
