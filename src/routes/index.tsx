import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Compass, Rocket, Brain, LogOut, Linkedin } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerCompass — Discover the Career That's Right for You" },
      { name: "description", content: "AI-powered career recommendations for students based on skills, projects, certifications, and interests." },
      { property: "og:title", content: "CareerCompass — Discover the Career That's Right for You" },
      { property: "og:description", content: "AI-powered career recommendations for students based on skills, projects, certifications, and interests." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const startAssessment = () => {
    if (user) navigate({ to: "/assessment" });
    else navigate({ to: `/auth?redirect=${encodeURIComponent("/assessment")}` });
  };

  const handleLinkedIn = async () => {
    const redirect = `${window.location.origin}/auth?redirect=${encodeURIComponent("/assessment")}`;
    await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: { redirectTo: redirect },
    });
  };

  return (
    <AppShell>
      <main className="relative flex flex-1 flex-col px-5 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
        <div className="absolute inset-x-0 top-0 -z-0 h-32 sm:h-40 bg-gradient-soft" />
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">CareerConnect</span>
          </div>

          <div className="mt-2 flex flex-1 flex-col items-center justify-start text-center">
            <Illustration />
            <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
              Discover the career
              <br />
              <span className="text-gradient-brand">that&apos;s right for you.</span>
            </h1>
            <p className="mt-1.5 max-w-sm text-xs text-muted-foreground sm:text-sm">
              Tell us about your skills, projects, and interests. Get personalized career matches in minutes.
            </p>

            <div className="mt-3 grid w-full max-w-sm grid-cols-3 gap-2">
              <Feature icon={<Brain className="h-4 w-4" />} label="AI Matched" />
              <Feature icon={<Compass className="h-4 w-4" />} label="Roadmaps" />
              <Feature icon={<Rocket className="h-4 w-4" />} label="Internships" />
            </div>
          </div>

          <div className="mt-3 flex w-full flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GET STARTED</span>
            {user ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="inline-flex h-11 w-full max-w-sm items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="inline-flex h-11 w-full max-w-sm items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex h-11 w-full max-w-sm items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary"
                >
                  Create account
                </Link>
                <button
                  type="button"
                  onClick={handleLinkedIn}
                  className="inline-flex h-11 w-full max-w-sm items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary"
                >
                  <Linkedin className="h-4 w-4 text-[#0A66C2]" /> Continue with LinkedIn
                </button>
              </>
            )}
          </div>

          <button
            onClick={startAssessment}
            className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow transition-transform active:scale-[0.98] sm:h-13 sm:text-base"
          >
            Start Career Assessment
          </button>
          <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
            Takes ~3 minutes · 7 quick steps
          </p>
        </div>
      </main>
    </AppShell>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-card/80 px-2 py-2 shadow-soft backdrop-blur">
      <div className="grid h-7 w-7 place-items-center rounded-xl bg-secondary text-primary">{icon}</div>
      <span className="text-[11px] font-semibold text-foreground">{label}</span>
    </div>
  );
}

function Illustration() {
  return (
    <div className="relative h-28 w-28 sm:h-36 sm:w-36">
      <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
      <svg viewBox="0 0 240 240" className="relative h-full w-full">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.62 0.2 250)" />
            <stop offset="1" stopColor="oklch(0.55 0.24 295)" />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="oklch(0.7 0.16 255)" />
            <stop offset="1" stopColor="oklch(0.75 0.14 300)" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="100" fill="url(#g1)" opacity="0.08" />
        <circle cx="120" cy="120" r="74" fill="url(#g1)" opacity="0.12" />
        <circle cx="120" cy="120" r="58" fill="white" stroke="url(#g1)" strokeWidth="3" />
        <circle cx="120" cy="120" r="58" fill="none" stroke="url(#g2)" strokeWidth="2" strokeDasharray="3 6" />
        <polygon points="120,72 132,120 120,114 108,120" fill="url(#g1)" />
        <polygon points="120,168 132,120 120,126 108,120" fill="oklch(0.85 0.05 280)" />
        <circle cx="120" cy="120" r="6" fill="white" stroke="url(#g1)" strokeWidth="2.5" />
        <circle cx="36" cy="60" r="6" fill="url(#g2)" />
        <circle cx="204" cy="80" r="4" fill="url(#g1)" />
        <circle cx="50" cy="190" r="5" fill="url(#g1)" opacity="0.7" />
        <circle cx="200" cy="180" r="7" fill="url(#g2)" opacity="0.8" />
      </svg>
    </div>
  );
}
