import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { getPending, resendOtp, submitOtp } from "@/lib/auth";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/auth/verify")({
  head: () => ({ meta: [{ title: "Verify OTP · CareerConnect" }] }),
  component: Verify,
});

function Verify() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(() => getPending());
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [busy, setBusy] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!pending) navigate({ to: "/auth" });
  }, [pending, navigate]);

  useEffect(() => {
    const t = setInterval(() => {
      const p = getPending();
      if (!p) return;
      setSecondsLeft(Math.max(0, Math.ceil((p.otpExpiresAt - Date.now()) / 1000)));
      setResendCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const target = pending?.identifier || "your account";

  const onChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[i] = ch;
    setDigits(next);
    if (ch && i < 5) inputs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verify = async () => {
    setError("");
    const code = digits.join("");
    if (code.length !== 6) return setError("Enter the 6-digit code.");
    setBusy(true);
    try {
      const next = await submitOtp(code);
      if (next.kind === "register") navigate({ to: "/auth/password" });
      else navigate({ to: "/auth/password", search: { reset: "1" } as never });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed.");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError("");
    try {
      const p = await resendOtp();
      if (p) {
        setPending(p);
        setDigits(["", "", "", "", "", ""]);
        setResendCooldown(60);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not resend OTP.");
    }
  };

  return (
    <AppShell>
      <AppHeader title="Verification" back="/auth/register" />
      <main className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-soft text-primary">
            <MailCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Verify your identity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the 6-digit code sent to <span className="font-semibold text-foreground">{target}</span>
          </p>
          {pending?.otp && (
            <p className="mt-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              Demo OTP: {pending.otp}
            </p>
          )}
          {secondsLeft > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Expires in <span className="font-semibold text-foreground">{Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}</span>
            </p>
          )}
        </div>

        <div className="mx-auto flex max-w-xs justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={d}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-11 rounded-xl border border-input bg-card text-center text-xl font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          onClick={verify}
          disabled={busy}
          className="mt-8 h-12 w-full rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {busy ? "Verifying…" : "Verify"}
        </button>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          {resendCooldown > 0 ? (
            <>Resend code in <span className="font-semibold text-foreground">{resendCooldown}s</span></>
          ) : (
            <button onClick={resend} className="font-semibold text-primary">
              Resend OTP
            </button>
          )}
        </div>
      </main>
    </AppShell>
  );
}
