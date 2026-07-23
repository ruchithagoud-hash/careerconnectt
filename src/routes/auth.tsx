import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Mail, Lock, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · CareerConnect" },
      { name: "description", content: "Sign in or create your CareerConnect account to save your career assessment results." },
      { property: "og:title", content: "Sign in · CareerConnect" },
      { property: "og:description", content: "Sign in or create your CareerConnect account." },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  const reset = () => { setError(null); setInfo(null); };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); reset(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(error.message);
    else navigate({ to: "/" });
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault(); reset();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined,
      },
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setInfo(`We sent a verification link to ${email.trim()}. Click the link in your inbox to confirm your account, then sign in.`);
    setMode("login");
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault(); reset(); setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    });
    setBusy(false);
    if (error) setError(error.message);
    else setInfo("Check your email for a password reset link.");
  }

  return (
    <AppShell>
      <main className="relative flex flex-1 flex-col px-6 pb-8 pt-8">
        <div className="absolute inset-x-0 top-0 -z-0 h-56 bg-gradient-soft" />
        <div className="relative z-10 flex flex-1 flex-col">
          <Link to="/" className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight">CareerConnect</span>
          </div>

          <div className="mt-8">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {mode === "login" && "Welcome back"}
              {mode === "signup" && "Create your account"}
              {mode === "forgot" && "Reset password"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "login" && "Sign in to continue your career journey."}
              {mode === "signup" && "Save your assessments and get personalized matches."}
              {mode === "forgot" && "We'll email you a secure link to set a new password."}
            </p>
          </div>

          {(mode === "login" || mode === "signup") && (
            <div className="mt-6 inline-flex rounded-2xl bg-secondary p-1">
              <button
                onClick={() => { setMode("login"); reset(); }}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-white text-foreground shadow-soft" : "text-muted-foreground"}`}
              >Sign in</button>
              <button
                onClick={() => { setMode("signup"); reset(); }}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-white text-foreground shadow-soft" : "text-muted-foreground"}`}
              >Sign up</button>
            </div>
          )}

          {error && <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
          {info && <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">{info}</div>}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="mt-5 space-y-3">
              <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="Email" value={email} onChange={setEmail} required />
              <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="Password" value={password} onChange={setPassword} required />
              <button type="button" onClick={() => { setMode("forgot"); reset(); }} className="text-xs font-semibold text-primary">Forgot password?</button>
              <SubmitButton busy={busy}>Sign in</SubmitButton>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignup} className="mt-5 space-y-3">
              <Field icon={<Sparkles className="h-4 w-4" />} type="text" placeholder="Full name" value={name} onChange={setName} required />
              <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="Email" value={email} onChange={setEmail} required />
              <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="Password (min 8 characters)" value={password} onChange={setPassword} required minLength={8} />
              <SubmitButton busy={busy}>Create account</SubmitButton>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="mt-5 space-y-3">
              <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="Email" value={email} onChange={setEmail} required />
              <SubmitButton busy={busy}>Send reset link</SubmitButton>
              <button type="button" onClick={() => { setMode("login"); reset(); }} className="w-full text-xs font-semibold text-primary">Back to sign in</button>
            </form>
          )}
        </div>
      </main>
    </AppShell>
  );
}

function Field({ icon, type, placeholder, value, onChange, required, minLength }: {
  icon: React.ReactNode; type: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; minLength?: number;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 pl-11 text-sm outline-none transition focus:border-primary"
      />
    </div>
  );
}

function SubmitButton({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="mt-2 inline-flex h-13 w-full items-center justify-center rounded-2xl bg-gradient-brand py-3.5 text-sm font-semibold text-white shadow-glow transition-transform active:scale-[0.98] disabled:opacity-60"
    >
      {busy ? "Please wait…" : children}
    </button>
  );
}
