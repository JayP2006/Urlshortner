import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Link2, Plus, Trash2, Globe2, Copy, Check } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { urlApi } from "../api/endpoints.js";
import { copyToClipboard } from "../utils/index.js";
import toast from "react-hot-toast";

const COUNTRIES = [
  ["US","United States"],["IN","India"],["GB","United Kingdom"],["CA","Canada"],
  ["AU","Australia"],["DE","Germany"],["FR","France"],["JP","Japan"],
  ["BR","Brazil"],["MX","Mexico"],["SG","Singapore"],["AE","UAE"],
];

export default function LocationPage() {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { geoRules: [{ countryCode: "US", redirectUrl: "" }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "geoRules" });
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (values) => {
    try {
      const { data } = await urlApi.locationShorten({
        fullUrl: values.fullUrl,
        customAlias: values.customAlias || undefined,
        defaultGeoUrl: values.defaultGeoUrl || undefined,
        geoRules: values.geoRules.filter(r => r.redirectUrl),
      });
      setResult(data);
      toast.success("Location link created");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const copy = async () => {
    await copyToClipboard(result.shortUrl);
    setCopied(true); toast.success("Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition className="space-y-6 max-w-4xl">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-fg-muted mb-3">
          <Globe2 className="h-3.5 w-3.5 text-brand" /> Geo-routing
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Location-based link</h1>
        <p className="mt-1.5 text-sm text-fg-muted">Send visitors to different destinations based on their country.</p>
      </header>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Base URL"
            placeholder="https://your-brand.com"
            icon={<Link2 className="h-4 w-4" />}
            error={errors.fullUrl?.message}
            {...register("fullUrl", { required: "URL is required" })}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Custom alias (optional)" placeholder="global-launch" {...register("customAlias")} />
            <Input label="Default fallback URL" placeholder="https://fallback.example.com" {...register("defaultGeoUrl")} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-fg-muted">Geo rules</span>
              <button type="button" onClick={() => append({ countryCode: "US", redirectUrl: "" })} className="text-xs text-brand hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add rule
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <select
                    {...register(`geoRules.${i}.countryCode`)}
                    className="h-11 rounded-xl bg-bg-elev/60 border border-border px-3 text-sm w-40 focus:outline-none focus:border-brand/50"
                  >
                    {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{code} — {name}</option>)}
                  </select>
                  <input
                    {...register(`geoRules.${i}.redirectUrl`)}
                    placeholder="https://destination.example.com"
                    className="flex-1 h-11 rounded-xl bg-bg-elev/60 border border-border px-4 text-sm focus:outline-none focus:border-brand/50"
                  />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} className="h-11 w-11 grid place-items-center rounded-xl text-danger hover:bg-danger/10 border border-border">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" loading={isSubmitting}>
            <MapPin className="h-4 w-4" /> Create geo link
          </Button>
        </form>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-6">
              <div className="text-xs text-fg-subtle uppercase tracking-wider mb-1">Geo link ready</div>
              <div className="text-lg font-semibold text-gradient font-mono break-all">{result.shortUrl}</div>
              <div className="mt-4">
                <Button onClick={copy} variant="secondary" size="sm">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
