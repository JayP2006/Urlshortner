import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Sparkles, Copy, QrCode, Share2, Check, Clipboard, Calendar, Wand2 } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { urlApi } from "../api/endpoints.js";
import { copyToClipboard } from "../utils/index.js";
import toast from "react-hot-toast";

export default function ShortenPage() {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm();
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (values) => {
    try {
      const payload = { fullUrl: values.fullUrl };
      if (values.customAlias) payload.customAlias = values.customAlias;
      if (values.expiresAt) payload.expiresAt = values.expiresAt;
      const { data } = await urlApi.shorten(payload);
      setResult(data);
      toast.success(data.message || "Link created");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      setValue("fullUrl", t);
      toast.success("Pasted from clipboard");
    } catch {}
  };

  const copy = async () => {
    await copyToClipboard(result.shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Shorten a URL</h1>
        <p className="mt-1.5 text-sm text-fg-muted">Instant, trackable, beautiful short links.</p>
      </header>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <Input
              label="Destination URL"
              placeholder="https://your-long-url.com/very-long-path"
              icon={<Link2 className="h-4 w-4" />}
              error={errors.fullUrl?.message}
              {...register("fullUrl", { required: "URL is required" })}
            />
            <button type="button" onClick={paste} className="absolute right-3 top-[38px] text-xs text-fg-muted hover:text-brand flex items-center gap-1">
              <Clipboard className="h-3.5 w-3.5" /> Paste
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Custom alias (optional)"
              placeholder="my-launch"
              icon={<Wand2 className="h-4 w-4" />}
              {...register("customAlias")}
            />
            <Input
              label="Expires at (optional)"
              type="datetime-local"
              icon={<Calendar className="h-4 w-4" />}
              {...register("expiresAt")}
            />
          </div>

          <Button type="submit" size="lg" loading={isSubmitting}>
            <Sparkles className="h-4 w-4" /> Generate short link
          </Button>
        </form>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 text-success mb-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" /> Link is live
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href={result.shortUrl} target="_blank" rel="noreferrer" className="text-xl font-semibold text-gradient font-mono break-all">
                  {result.shortUrl}
                </a>
              </div>
              <div className="mt-1 text-xs text-fg-subtle break-all">→ {result.originalUrl}</div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={copy} variant="secondary" size="sm">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="secondary" size="sm"
                  onClick={() => { if (navigator.share) navigator.share({ url: result.shortUrl }); else copy(); }}
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                {result.qrCodeDataUrl && (
                  <a href={result.qrCodeDataUrl} download={`qr-${Date.now()}.png`}>
                    <Button variant="secondary" size="sm"><QrCode className="h-4 w-4" /> Download QR</Button>
                  </a>
                )}
              </div>

              {result.qrCodeDataUrl && (
                <div className="mt-6 flex items-center gap-4">
                  <img src={result.qrCodeDataUrl} alt="QR" className="h-32 w-32 rounded-xl border border-border bg-white p-2" />
                  <div className="text-sm text-fg-muted">
                    <div className="font-medium text-fg mb-1">Scan to open</div>
                    High-density QR (H error correction). Perfect for print.
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
