import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Button from "../../components/Button.jsx";
import Input from "../../components/Input.jsx";
import Logo from "../../components/Logo.jsx";
import PageTransition from "../../components/PageTransition.jsx";
import AuthShell from "./AuthShell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const [showPw, setShowPw] = useState(false);
  const { register: signup } = useAuth();
  const nav = useNavigate();
  const pw = watch("password") || "";
  const strength = Math.min(4, [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length);

  const onSubmit = async (values) => {
    try {
      await signup(values);
      nav("/dashboard", { replace: true });
    } catch (e) {
      toast.error(e.message || "Registration failed");
    }
  };

  const bars = ["bg-danger","bg-warning","bg-warning","bg-success","bg-success"];

  return (
    <PageTransition>
      <AuthShell>
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center mb-8"><Logo size="lg" /></div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-fg-muted">Start shortening in seconds. No credit card.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Ada Lovelace"
              icon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
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
                  placeholder="Minimum 8 characters"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-[38px] text-fg-subtle hover:text-fg">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {pw && (
                <div className="mt-2 flex gap-1">
                  {[0,1,2,3].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition ${i < strength ? bars[strength] : "bg-surface-2"}`} />
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Create account <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-fg-muted">
            Already have an account? <Link to="/login" className="text-brand hover:underline">Sign in</Link>
          </p>
        </div>
      </AuthShell>
    </PageTransition>
  );
}
