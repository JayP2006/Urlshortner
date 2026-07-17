import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Button from "../../components/Button.jsx";
import Input from "../../components/Input.jsx";
import Logo from "../../components/Logo.jsx";
import PageTransition from "../../components/PageTransition.jsx";
import AuthShell from "./AuthShell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const onSubmit = async (values) => {
    try {
      await login(values);
      nav(from, { replace: true });
    } catch (e) {
      toast.error(e.message || "Login failed");
    }
  };

  return (
    <PageTransition>
      <AuthShell>
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center mb-8"><Logo size="lg" /></div>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-fg-muted">Sign in to your ShrinkX workspace.</p>
          </motion.div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
            />
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-[38px] text-fg-subtle hover:text-fg"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-fg-muted">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-surface-2 accent-brand"
                />
                Remember me
              </label>
              <button type="button" className="text-brand hover:underline">Forgot password?</button>
            </div>
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-fg-muted">
            Don't have an account? <Link to="/register" className="text-brand hover:underline">Create one</Link>
          </p>
        </div>
      </AuthShell>
    </PageTransition>
  );
}
