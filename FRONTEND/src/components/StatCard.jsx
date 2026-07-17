import Counter from "./Counter.jsx";
import Card from "./Card.jsx";
import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, delta, tone = "brand", index = 0 }) {
  const tones = {
    brand: "from-brand/25 to-brand-2/10 text-brand",
    success: "from-success/25 to-success/5 text-success",
    warning: "from-warning/25 to-warning/5 text-warning",
    info: "from-info/25 to-info/5 text-info",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card hover className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-fg-subtle uppercase tracking-wider">{label}</div>
            <div className="mt-2 text-3xl font-semibold text-fg">
              <Counter value={Number(value) || 0} />
            </div>
            {delta != null && (
              <div className={`mt-2 text-xs font-medium ${delta >= 0 ? "text-success" : "text-danger"}`}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs last week
              </div>
            )}
          </div>
          <div className={`h-11 w-11 rounded-xl grid place-items-center bg-gradient-to-br ${tones[tone]}`}>
            {Icon && <Icon className="h-5 w-5" />}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
