import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/Button.jsx";
import PageTransition from "../../components/PageTransition.jsx";

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen grid place-items-center px-6">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="text-[9rem] leading-none font-serif italic text-gradient"
          >
            404
          </motion.div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm text-fg-muted">The URL you followed doesn't exist or was moved.</p>
          <div className="mt-8 flex justify-center gap-2">
            <Button as={Link} to="/">Go home</Button>
            <Button as={Link} to="/dashboard" variant="secondary">Open dashboard</Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
