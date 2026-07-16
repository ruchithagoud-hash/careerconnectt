import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { isEmail, isMobile, startPending } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { KeyRound } from "lucide-react";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({ meta: [{ title: "Forgot Password · CareerConnect" }] }),
  component: Forgot,
});

function Forgot() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (!isEmail(identifier) && !isMobile(identifier))
      return setError("Enter a valid email or mobile number.");
    setBusy(true);
    try {
      await startPending({ kind: "forgot", identifier: identifier.trim() });
      navigate({ to: "/auth/verify" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send OTP.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <AppHeader title="Forgot Password" back="/auth/login" />
      <main className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-soft text-primary">
            <KeyRound className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Reset your password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We'll send a verification code to reset your password.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Email or Mobile</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or 9876543210"
            className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          onClick={submit}
          disabled={!identifier.trim() || busy}
          className={cn(
            "mt-8 h-12 w-full rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.98]",
            identifier.trim() && !busy ? "bg-gradient-brand shadow-glow" : "bg-muted text-muted-foreground",
          )}
        >
          {busy ? "Sending code…" : "Send OTP"}
        </button>
      </main>
    </AppShell>
  );
}
