import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Link2, Wand2, Calendar, Eye, EyeOff, Copy, Check, ShieldCheck } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { urlApi } from "../api/endpoints.js";
import { copyToClipboard } from "../utils/index.js";
import toast from "react-hot-toast";

export default function ProtectedPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPw, setShowPw] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (values) => {
    try {
      const { data } = await urlApi.protectedShorten({
        fullUrl: values.fullUrl,
        password: values.password,
        customAlias: values.customAlias || undefined,
        expiresAt: values.expiresAt || undefined,
      });
      setResult(data);
      toast.success(data.message || "Protected link created");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const copy = async () => {
    await copyToClipboard(result.shortUrl);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition className="space-y-6 max-w-4xl">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-fg-muted mb-3">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Enterprise security
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Password-protected link</h1>
        <p className="mt-1.5 text-sm text-fg-muted">Gate any URL behind a password. Only trusted visitors get through.</p>
      </header>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Destination URL"
            placeholder="https://sensitive-content.example.com"
            icon={<Link2 className="h-4 w-4" />}
            error={errors.fullUrl?.message}
            {...register("fullUrl", { required: "URL is required" })}
          />
          <div className="relative">
            <Input
              label="Access password"
              type={showPw ? "text" : "password"}
              placeholder="Strong password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register("password", { required: "Password is required" })}
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-[38px] text-fg-subtle hover:text-fg">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Custom alias (optional)" placeholder="private-doc" icon={<Wand2 className="h-4 w-4" />} {...register("customAlias")} />
            <Input label="Expires at (optional)" type="datetime-local" icon={<Calendar className="h-4 w-4" />} {...register("expiresAt")} />
          </div>
          <Button type="submit" size="lg" loading={isSubmitting}>
            <ShieldCheck className="h-4 w-4" /> Create protected link
          </Button>
        </form>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-6">
              <div className="text-xs text-fg-subtle uppercase tracking-wider mb-1">Protected link</div>
              <div className="text-lg font-semibold text-gradient font-mono break-all">{result.shortUrl}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={copy} variant="secondary" size="sm">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
                {result.qrCodeDataUrl && (
                  <a href={result.qrCodeDataUrl} download="protected-qr.png">
                    <Button variant="secondary" size="sm">Download QR</Button>
                  </a>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
