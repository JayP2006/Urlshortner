import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-[linear-gradient(135deg,var(--brand),var(--brand-2))] opacity-90 blur-lg absolute inset-0" />
        <motion.div
          className="h-16 w-16 rounded-2xl bg-[linear-gradient(135deg,var(--brand),var(--brand-2))] relative flex items-center justify-center text-white font-bold text-2xl font-serif"
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          S
        </motion.div>
      </div>
    </div>
  );
}
