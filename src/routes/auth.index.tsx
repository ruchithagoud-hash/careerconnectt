import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, UserPlus, LogIn } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/auth/")({
  head: () => ({ meta: [{ title: "Welcome · CareerConnect" }] }),
  component: AuthWelcome,
});

function AuthWelcome() {
  return (
    <AppShell>
      <main className="relative flex flex-1 flex-col px-6 pb-8 pt-10">
        <div className="absolute inset-x-0 top-0 -z-0 h-72 bg-gradient-soft" />
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight">CareerConnect</span>
          </div>

          <div className="mt-16 flex flex-1 flex-col items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-brand text-white shadow-glow">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Discover Your <span className="text-gradient-brand">Ideal Career</span>
            </h1>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground sm:text-base">
              Create your account to receive personalized career recommendations based on your
              education, skills, certifications, projects, interests, and experience.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            <Link
              to="/auth/register"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand text-base font-semibold text-white shadow-glow transition-transform active:scale-[0.98]"
            >
              <UserPlus className="h-5 w-5" /> Create Account
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-base font-semibold text-foreground transition hover:bg-secondary"
            >
              <LogIn className="h-5 w-5" /> Already have an account? Login
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
