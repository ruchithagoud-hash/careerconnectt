import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { loadAssessment, recommendCareers, type Career } from "@/lib/career-data";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [{ title: "Your Career Matches · CareerConnect" }],
  }),
  component: () => (
    <RequireAuth>
      <Results />
    </RequireAuth>
  ),
});

function Results() {
  const [list, setList] = useState<(Career & { score: number; matchReasons: string[] })[]>([]);

  useEffect(() => {
    const data = loadAssessment();
    const recs = recommendCareers(data);
    const ranked = recs.filter((r) => r.score > 0);
    setList(ranked.length ? ranked : recs);
  }, []);

  const top = list[0];

  return (
    <AppShell>
      <AppHeader title="Your Matches" back="/assessment" />
      <main className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="mr-1 inline h-3.5 w-3.5" />
            Recommended for you
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
            We found <span className="text-gradient-brand">{list.length} careers</span> that fit you.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ranked by how well your skills, projects, and interests match.
          </p>
        </div>

        {top && (
          <Link
            to="/career/$id"
            params={{ id: top.id }}
            className="mb-4 block overflow-hidden rounded-3xl bg-gradient-brand p-5 text-white shadow-glow transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Top Match
              </span>
              <Target className="h-4 w-4 opacity-80" />
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-2xl">
                {top.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-extrabold">{top.name}</h3>
                <p className="mt-1 text-sm text-white/90">{top.tagline}</p>
              </div>
            </div>
            {top.matchReasons.length > 0 && (
              <p className="mt-3 text-xs text-white/85">
                Why: {top.matchReasons.slice(0, 3).join(" · ")}
              </p>
            )}
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
              Explore career <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        )}

        <div className="space-y-3 pb-6">
          {list.slice(1).map((c) => (
            <CareerCard key={c.id} career={c} />
          ))}
        </div>
      </main>
    </AppShell>
  );
}

function CareerCard({ career }: { career: Career & { score: number; matchReasons: string[] } }) {
  return (
    <Link
      to="/career/$id"
      params={{ id: career.id }}
      className="block rounded-2xl border border-border bg-card p-4 shadow-soft transition active:scale-[0.99] hover:border-primary/40"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-soft text-xl">
          {career.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-base font-bold text-foreground">{career.name}</h3>
            {career.matchReasons.length > 0 && (
              <span className="shrink-0 rounded-full bg-gradient-soft px-2 py-0.5 text-[10px] font-bold text-primary">
                {career.score} pts
              </span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{career.tagline}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {career.skills.slice(0, 3).map((s) => (
              <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                {s}
              </span>
            ))}
            {career.skills.length > 3 && (
              <span className="rounded-full px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
                +{career.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
