import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Copy, ExternalLink, QrCode, BarChart3, Filter, Link2, Check } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Badge from "../components/Badge.jsx";
import Skeleton from "../components/Skeleton.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { urlApi } from "../api/endpoints.js";
import { copyToClipboard, formatDate, shortHost } from "../utils/index.js";
import toast from "react-hot-toast";

const TYPES = ["All Types", "standard", "custom", "protected", "location", "fire"];

export default function MyUrls() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [toDelete, setToDelete] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await urlApi.myUrls({ page, limit: 10, searchTerm: search, type });
      setUrls(data.urls || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, type]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const doDelete = async () => {
    try {
      await urlApi.remove(toDelete._id);
      toast.success("Link deleted");
      setToDelete(null);
      load();
    } catch (e) { toast.error(e.message); }
  };

  const copy = async (u) => {
    const full = `${import.meta.env.VITE_API_URL}/${u.short_url}`;
    await copyToClipboard(full);
    setCopiedId(u._id);
    toast.success("Copied");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const typeTone = (t) => ({
    standard: "neutral", custom: "brand", protected: "warning",
    location: "info", fire: "danger",
  }[t] || "neutral");

  return (
    <PageTransition className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My URLs</h1>
          <p className="mt-1.5 text-sm text-fg-muted">Search, sort, and manage every link you've shortened.</p>
        </div>
        <Button as={Link} to="/shorten" size="md">+ New link</Button>
      </header>

      <Card className="p-4">
        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-subtle" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by URL or short code…"
              className="w-full h-11 rounded-xl bg-bg-elev/60 border border-border pl-10 pr-4 text-sm focus:outline-none focus:border-brand/50"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-subtle pointer-events-none" />
              <select
                value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}
                className="h-11 rounded-xl bg-bg-elev/60 border border-border pl-10 pr-8 text-sm focus:outline-none focus:border-brand/50"
              >
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Button type="submit" variant="secondary">Search</Button>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : urls.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="No links found"
            description={search ? "Try a different search or filter." : "Create your first short link to see it here."}
            action={<Button as={Link} to="/shorten">Create link</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-fg-subtle bg-surface-2/50">
                <tr>
                  <th className="text-left font-medium px-5 py-3">Short link</th>
                  <th className="text-left font-medium px-5 py-3 hidden md:table-cell">Destination</th>
                  <th className="text-left font-medium px-5 py-3">Type</th>
                  <th className="text-right font-medium px-5 py-3">Clicks</th>
                  <th className="text-left font-medium px-5 py-3 hidden lg:table-cell">Created</th>
                  <th className="text-right font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {urls.map((u, i) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-t border-border hover:bg-surface-2/40 transition"
                    >
                      <td className="px-5 py-3 font-mono text-brand">/{u.short_url}</td>
                      <td className="px-5 py-3 hidden md:table-cell text-fg-muted truncate max-w-xs">{shortHost(u.full_url)}</td>
                      <td className="px-5 py-3"><Badge tone={typeTone(u.type)}>{u.type || "standard"}</Badge></td>
                      <td className="px-5 py-3 text-right tabular-nums font-medium">{u.clicks || 0}</td>
                      <td className="px-5 py-3 hidden lg:table-cell text-fg-subtle">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <IconBtn title="Copy" onClick={() => copy(u)}>
                            {copiedId === u._id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </IconBtn>
                          <IconBtn as="a" href={`${import.meta.env.VITE_API_URL}/${u.short_url}`} target="_blank" rel="noreferrer" title="Open">
                            <ExternalLink className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn as={Link} to={`/analytics/${u._id}`} title="Analytics">
                            <BarChart3 className="h-4 w-4" />
                          </IconBtn>
                          {u.qrCodeDataUrl && (
                            <IconBtn as="a" href={u.qrCodeDataUrl} download={`qr-${u.short_url}.png`} title="QR">
                              <QrCode className="h-4 w-4" />
                            </IconBtn>
                          )}
                          <IconBtn onClick={() => setToDelete(u)} title="Delete" tone="danger">
                            <Trash2 className="h-4 w-4" />
                          </IconBtn>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
            <div className="text-fg-subtle">Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete this link?">
        <p className="text-sm text-fg-muted">This action can't be undone. The short link will stop redirecting immediately.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={doDelete}>Delete link</Button>
        </div>
      </Modal>
    </PageTransition>
  );
}

function IconBtn({ as: Comp = "button", tone, children, ...props }) {
  const cls = tone === "danger"
    ? "hover:bg-danger/10 hover:text-danger"
    : "hover:bg-surface-2 hover:text-fg";
  return (
    <Comp className={`h-9 w-9 grid place-items-center rounded-lg text-fg-muted transition ${cls}`} {...props}>
      {children}
    </Comp>
  );
}
