import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Link2, Globe, Sparkles } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Skeleton from "../components/Skeleton.jsx";
import { urlApi } from "../api/endpoints.js";
import { shortHost } from "../utils/index.js";
import toast from "react-hot-toast";

export default function AIPreview() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true); setResult(null);
    try {
      const { data } = await urlApi.aiPreview(url);
      setResult(data);
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <PageTransition className="space-y-6 max-w-4xl">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 text-brand px-3 py-1 text-xs mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">AI link preview</h1>
        <p className="mt-1.5 text-sm text-fg-muted">Extract metadata and get a professional summary of any URL.</p>
      </header>

      <Card className="p-6">
        <form onSubmit={run} className="flex flex-col sm:flex-row gap-3">
          <Input
            containerClassName="flex-1"
            label="URL"
            placeholder="https://openai.com"
            icon={<Link2 className="h-4 w-4" />}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="sm:pt-[26px]">
            <Button type="submit" loading={loading}><Wand2 className="h-4 w-4" /> Preview</Button>
          </div>
        </form>
      </Card>

      {loading && (
        <Card className="p-6 space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </Card>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="overflow-hidden shadow-xl">

  {result.image ? (
    <img
      src={result.image}
      alt={result.aiTitle}
      className="h-56 w-full object-cover"
    />
  ) : (
    <div className="h-56 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand)_45%,var(--bg)),color-mix(in_oklab,var(--brand-2)_35%,var(--bg)))] grid place-items-center">
      <Globe className="h-16 w-16 text-white/80" />
    </div>
  )}

  <div className="p-6">

    <div className="flex items-center gap-3">

      <img
        src={result.favicon}
        alt=""
        className="h-6 w-6 rounded"
        onError={(e)=>{
          e.target.style.display="none";
        }}
      />

      <div>
        <p className="text-xs text-fg-subtle">
          {result.siteName}
        </p>

        <p className="text-xs text-fg-muted">
          {result.domain}
        </p>
      </div>

    </div>

    <h2 className="mt-4 text-2xl font-semibold">
      {result.aiTitle || "Untitled"}
    </h2>

    {result.aiDescription && (
      <p className="mt-3 text-fg-muted">
        {result.aiDescription}
      </p>
    )}

    {result.aiSummary && (
      <div className="mt-5 rounded-2xl border border-brand/20 bg-brand/5 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-brand mb-2">
          <Sparkles className="h-4 w-4"/>
          AI Summary
        </div>

        <p className="text-sm leading-7">
          {result.aiSummary}
        </p>
      </div>
    )}

  </div>

</Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
