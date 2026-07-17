import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Link2, Download, Copy, Check, Share2 } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { urlApi } from "../api/endpoints.js";
import { copyToClipboard } from "../utils/index.js";
import toast from "react-hot-toast";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const gen = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const { data } = await urlApi.generateQr(url);
      setQr(data.qrCodeDataUrl);
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const copy = async () => {
    await copyToClipboard(url);
    setCopied(true); toast.success("URL copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <PageTransition className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">QR generator</h1>
        <p className="mt-1.5 text-sm text-fg-muted">Instantly produce beautiful, high-density QR codes for any URL.</p>
      </header>

      <Card className="p-6">
        <form onSubmit={gen} className="flex flex-col sm:flex-row gap-3">
          <Input
            containerClassName="flex-1"
            label="URL"
            placeholder="https://example.com"
            icon={<Link2 className="h-4 w-4" />}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="sm:pt-[26px]">
            <Button type="submit" size="md" loading={loading}>
              <QrCode className="h-4 w-4" /> Generate
            </Button>
          </div>
        </form>
      </Card>

      <AnimatePresence>
        {qr && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,var(--brand),var(--brand-2))] blur-2xl opacity-30" />
                  <img src={qr} alt="QR" className="relative h-56 w-56 rounded-2xl bg-white p-4 border border-border shadow-xl" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-fg-subtle uppercase tracking-wider">Encoded URL</div>
                  <div className="mt-1 text-sm font-mono text-brand break-all">{url}</div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <a href={qr} download="qrcode.png">
                      <Button size="md"><Download className="h-4 w-4" /> Download PNG</Button>
                    </a>
                    <Button variant="secondary" size="md" onClick={copy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy URL
                    </Button>
                    <Button variant="secondary" size="md" onClick={() => navigator.share?.({ url })}>
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
