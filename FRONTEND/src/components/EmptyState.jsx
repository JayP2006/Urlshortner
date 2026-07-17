import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,var(--brand),var(--brand-2))] blur-2xl opacity-30" />
        <div className="relative h-20 w-20 rounded-3xl grid place-items-center bg-surface-2 border border-border">
          {Icon && <Icon className="h-8 w-8 text-fg-muted" />}
        </div>
      </motion.div>
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-fg-subtle">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
