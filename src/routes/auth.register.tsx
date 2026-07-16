import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { isEmail, isMobile, startPending } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Register · CareerConnect" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (fullName.trim().length < 2) return setError("Please enter your full name.");
    if (!isEmail(identifier) && !isMobile(identifier))
      return setError("Enter a valid email address or mobile number.");
    setBusy(true);
    try {
      await startPending({
        kind: "register",
        fullName: fullName.trim(),
        identifier: identifier.trim(),
      });
      navigate({ to: "/auth/verify" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send OTP.");
    } finally {
      setBusy(false);
    }
  };

  const canNext = fullName.trim().length >= 2 && identifier.trim().length > 0 && !busy;

  return (
    <AppShell>
      <AppHeader title="Create Account" back="/auth" />
      <main className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Let's get you started</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We'll send a verification code to confirm it's you.
          </p>
        </div>

        <div className="space-y-5">
          <Field label="Full Name">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aditi Sharma"
              className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>
          <Field label="Email Address or Mobile Number">
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or 9876543210"
              className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <button
          onClick={submit}
          disabled={!canNext}
          className={cn(
            "mt-8 h-12 w-full rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.98]",
            canNext ? "bg-gradient-brand shadow-glow" : "bg-muted text-muted-foreground",
          )}
        >
          {busy ? "Sending code…" : "Continue"}
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-primary">
            Login
          </Link>
        </p>
      </main>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}
