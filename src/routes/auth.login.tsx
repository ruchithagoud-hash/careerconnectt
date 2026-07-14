import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { login } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, LogIn } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Login · CareerConnect" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (!identifier.trim() || !password) return setError("Enter your credentials.");
    setBusy(true);
    try {
      await login(identifier, password);
      navigate({ to: "/assessment" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <AppHeader title="Login" back="/auth" />
      <main className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Log in to continue your career journey.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">Email or Mobile</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or 9876543210"
              className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </div>
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label className="text-sm font-semibold">Password</label>
              <Link to="/auth/forgot" className="text-xs font-semibold text-primary">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <button
          onClick={submit}
          disabled={busy}
          className={cn(
            "mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow transition-all active:scale-[0.98]",
            busy && "opacity-70",
          )}
        >
          <LogIn className="h-4 w-4" /> Login
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/auth/register" className="font-semibold text-primary">
            Create Account
          </Link>
        </p>
      </main>
    </AppShell>
  );
}
