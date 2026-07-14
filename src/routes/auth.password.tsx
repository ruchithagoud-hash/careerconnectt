import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, AppHeader } from "@/components/AppShell";
import {
  checkPassword,
  clearPending,
  createAccount,
  getPending,
  passwordValid,
  resetPassword,
} from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Check, Eye, EyeOff, X } from "lucide-react";

export const Route = createFileRoute("/auth/password")({
  head: () => ({ meta: [{ title: "Create Password · CareerConnect" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ reset: s.reset === "1" ? "1" : undefined }),
  component: Password,
});

function Password() {
  const navigate = useNavigate();
  const { reset } = Route.useSearch();
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = getPending();
    if (!p || !p.verified) navigate({ to: "/auth" });
  }, [navigate]);

  const rules = checkPassword(pw);
  const canSubmit = passwordValid(pw) && pw === cpw && !busy;

  const submit = async () => {
    setError("");
    if (!passwordValid(pw)) return setError("Password does not meet all requirements.");
    if (pw !== cpw) return setError("Passwords do not match.");
    const pending = getPending();
    if (!pending) return navigate({ to: "/auth" });
    setBusy(true);
    try {
      if (reset === "1" && pending.accountId) {
        await resetPassword(pending.accountId, pw);
      } else {
        await createAccount({
          fullName: pending.fullName || "Student",
          email: pending.email,
          mobile: pending.mobile,
          password: pw,
        });
      }
      clearPending();
      navigate({ to: "/auth/login" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <AppHeader title={reset === "1" ? "New Password" : "Create Password"} back="/auth/verify" />
      <main className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Secure your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a strong password you'll remember.
          </p>
        </div>

        <div className="space-y-5">
          <PasswordField label="Password" value={pw} onChange={setPw} show={show} setShow={setShow} />
          <PasswordField label="Confirm Password" value={cpw} onChange={setCpw} show={show} setShow={setShow} />

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Password must include
            </p>
            <ul className="grid grid-cols-1 gap-1.5 text-sm">
              <Rule ok={rules.length} label="At least 8 characters" />
              <Rule ok={rules.upper} label="One uppercase letter" />
              <Rule ok={rules.lower} label="One lowercase letter" />
              <Rule ok={rules.number} label="One number" />
              <Rule ok={rules.special} label="One special character" />
            </ul>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <button
          onClick={submit}
          disabled={!canSubmit}
          className={cn(
            "mt-8 h-12 w-full rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.98]",
            canSubmit ? "bg-gradient-brand shadow-glow" : "bg-muted text-muted-foreground",
          )}
        >
          {reset === "1" ? "Reset Password" : "Create Account"}
        </button>
      </main>
    </AppShell>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  setShow,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="h-12 w-full rounded-xl border border-input bg-card px-4 pr-11 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function Rule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={cn("flex items-center gap-2", ok ? "text-foreground" : "text-muted-foreground")}>
      <span
        className={cn(
          "grid h-4 w-4 place-items-center rounded-full",
          ok ? "bg-gradient-brand text-white" : "bg-secondary text-muted-foreground",
        )}
      >
        {ok ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
      </span>
      {label}
    </li>
  );
}
