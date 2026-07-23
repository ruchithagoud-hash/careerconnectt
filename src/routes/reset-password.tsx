import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Lock, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password · CareerConnect" },
      { name: "description", content: "Set a new password for your CareerConnect account." },
      { property: "og:title", content: "Reset password · CareerConnect" },
      { property: "og:description", content: "Set a new password for your account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null);
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setInfo("Password updated. Redirecting…");
    setTimeout(() => navigate({ to: "/" }), 1200);
  }

  return (
    <AppShell>
      <main className="relative flex flex-1 flex-col px-6 pb-8 pt-8">
        <div className="absolute inset-x-0 top-0 -z-0 h-56 bg-gradient-soft" />
        <div className="relative z-10 flex flex-1 flex-col">
          <Link to="/auth" className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight">CareerConnect</span>
          </div>

          <h1 className="mt-8 text-2xl font-extrabold tracking-tight">Set a new password</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Choose a strong password you haven't used before.</p>

          {!ready && (
            <div className="mt-6 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Waiting for a valid reset session. Open the reset link from your email on this device.
            </div>
          )}

          {error && <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
          {info && <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">{info}</div>}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <Field placeholder="New password" value={password} onChange={setPassword} />
            <Field placeholder="Confirm password" value={confirm} onChange={setConfirm} />
            <button
              type="submit"
              disabled={busy || !ready}
              className="mt-2 inline-flex h-13 w-full items-center justify-center rounded-2xl bg-gradient-brand py-3.5 text-sm font-semibold text-white shadow-glow transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? "Please wait…" : "Update password"}
            </button>
          </form>
        </div>
      </main>
    </AppShell>
  );
}

function Field({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock className="h-4 w-4" /></span>
      <input
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={8}
        className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 pl-11 text-sm outline-none transition focus:border-primary"
      />
    </div>
  );
}
