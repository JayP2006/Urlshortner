import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Mail, Lock, Key, Copy, Check, Trash2, RefreshCw, ShieldAlert } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import { userApi } from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";
import { copyToClipboard } from "../utils/index.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const nav = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const profileForm = useForm({ defaultValues: { name: user?.name, email: user?.email } });
  const pwForm = useForm();

  const saveProfile = async (values) => {
    try {
      const { data } = await userApi.updateProfile(values);
      updateUser(data.user);
      toast.success("Profile updated");
    } catch (e) { toast.error(e.message); }
  };

  const changePw = async (values) => {
    try {
      await userApi.changePassword(values);
      pwForm.reset();
      toast.success("Password changed");
    } catch (e) { toast.error(e.message); }
  };

  const genKey = async () => {
    try {
      const { data } = await userApi.generateApiKey();
      setApiKey(data.apiKey);
      toast.success("API key generated");
    } catch (e) { toast.error(e.message); }
  };

  const copyKey = async () => {
    await copyToClipboard(apiKey);
    setCopied(true); toast.success("Copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const deleteMe = async () => {
    try {
      await userApi.deleteAccount();
      toast.success("Account deleted");
      await logout();
      nav("/");
    } catch (e) { toast.error(e.message); }
  };

  return (
    <PageTransition className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1.5 text-sm text-fg-muted">Manage your account, security, and API access.</p>
      </header>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={user?.gravatar} alt="" className="h-16 w-16 rounded-2xl ring-2 ring-border-strong" />
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-sm text-fg-subtle">{user?.email}</div>
          </div>
        </div>
        <form onSubmit={profileForm.handleSubmit(saveProfile)} className="grid sm:grid-cols-2 gap-4">
          <Input label="Full name" icon={<User className="h-4 w-4" />} {...profileForm.register("name", { required: true })} />
          <Input label="Email" type="email" icon={<Mail className="h-4 w-4" />} {...profileForm.register("email", { required: true })} />
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" loading={profileForm.formState.isSubmitting}>Save changes</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <div className="text-lg font-semibold mb-1">Change password</div>
        <p className="text-sm text-fg-muted mb-5">Choose a strong password you don't use anywhere else.</p>
        <form onSubmit={pwForm.handleSubmit(changePw)} className="grid sm:grid-cols-2 gap-4">
          <Input label="Current password" type="password" icon={<Lock className="h-4 w-4" />} {...pwForm.register("oldPassword", { required: true })} />
          <Input label="New password" type="password" icon={<Lock className="h-4 w-4" />} {...pwForm.register("newPassword", { required: true, minLength: 6 })} />
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" loading={pwForm.formState.isSubmitting}>Update password</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-semibold">API key</div>
            <p className="text-sm text-fg-muted">Programmatic access to your ShrinkX account.</p>
          </div>
          <Button variant="secondary" onClick={genKey}><RefreshCw className="h-4 w-4" /> Generate</Button>
        </div>
        {apiKey && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-3"
          >
            <Key className="h-4 w-4 text-brand" />
            <code className="flex-1 text-sm font-mono text-fg break-all">{apiKey}</code>
            <button onClick={copyKey} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-bg-elev text-fg-muted hover:text-fg">
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </motion.div>
        )}
      </Card>

      <Card className="p-6 border-danger/30">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-danger/10 text-danger grid place-items-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold">Danger zone</div>
            <p className="text-sm text-fg-muted mt-1">Permanently delete your account and all associated links. This cannot be undone.</p>
          </div>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}><Trash2 className="h-4 w-4" /> Delete account</Button>
        </div>
      </Card>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete your account?">
        <p className="text-sm text-fg-muted">This will permanently remove your account, links, and analytics. There is no recovery.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteMe}>Yes, delete</Button>
        </div>
      </Modal>
    </PageTransition>
  );
}
