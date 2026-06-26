import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Bookmark, Target } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { CareerIcon } from "@/lib/career-icons";
import {
  loadAssessment, recommendCareers, getSavedCareers, toggleSavedCareer,
  type Recommendation,
} from "@/lib/career-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Your Career Matches · CareerCompass" }] }),
  component: Results,
});

function Results() {
  const [list, setList] = useState<Recommendation[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const data = loadAssessment();
    setList(recommendCareers(data));
    setSaved(getSavedCareers());
  }, []);

  const top = list[0];

  return (
    <AppShell>
      <AppHeader title="Your Matches" back="/assessment" />
      <main className="flex-1 overflow-y-auto px-5 py-5">
        <div className="mb-5 animate-fade-in-up">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            <Target className="h-3.5 w-3.5" /> Recommended career path
          </p>
          <h1 className="mt-2 text-[22px] font-extrabold tracking-tight">
            We found <span className="text-gradient-brand">{list.length} careers</span> that fit you.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ranked by how well your skills, projects and interests align.
          </p>
        </div>

        {top && <TopMatchCard rec={top} saved={saved.includes(top.id)} onSave={() => setSaved(toggleSavedCareer(top.id))} />}

        <div className="mt-5">
          <h2 className="mb-3 text-[15px] font-bold tracking-tight">Other recommended careers</h2>
          <div className="space-y-3 pb-4">
            {list.slice(1).map((c) => (
              <CareerCard key={c.id} rec={c} saved={saved.includes(c.id)} onSave={() => setSaved(toggleSavedCareer(c.id))} />
            ))}
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function TopMatchCard({ rec, saved, onSave }: { rec: Recommendation; saved: boolean; onSave: () => void }) {
  return (
    <div className="overflow-hidden rounded-[22px] bg-gradient-brand p-5 text-white shadow-glow">
      <div className="flex items-start justify-between">
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          Top Match
        </span>
        <button onClick={onSave} aria-label="Save" className="grid h-8 w-8 place-items-center rounded-full bg-white/15 backdrop-blur">
          <Bookmark className="h-4 w-4" fill={saved ? "white" : "none"} />
        </button>
      </div>
      <div className="mt-4 flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
          <CareerIcon id={rec.id} className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-extrabold leading-tight">{rec.name}</h3>
          <p className="mt-0.5 text-sm font-semibold text-white/90">{rec.matchPercent}% Match</p>
        </div>
      </div>

      {rec.matchReasons.length > 0 && (
        <div className="mt-4 rounded-2xl bg-white/10 p-3 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Why recommended</p>
          <ul className="mt-2 space-y-1.5">
            {rec.matchReasons.slice(0, 4).map((r) => (
              <li key={r} className="flex items-center gap-2 text-[13px] font-medium">
                <Check className="h-3.5 w-3.5" strokeWidth={3} /> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to="/career/$id" params={{ id: rec.id }}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-2xl bg-white text-sm font-bold text-primary transition active:scale-[0.99]"
      >
        Explore career <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function CareerCard({ rec, saved, onSave }: { rec: Recommendation; saved: boolean; onSave: () => void }) {
  return (
    <div className="rounded-[18px] border border-border bg-card p-4 shadow-soft transition hover:border-primary/40">
      <Link to="/career/$id" params={{ id: rec.id }} className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-soft text-primary">
          <CareerIcon id={rec.id} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[14.5px] font-bold text-foreground">{rec.name}</h3>
            <span className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
              rec.matchPercent >= 70 ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
            )}>
              {rec.matchPercent}% match
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-[11.5px] text-muted-foreground">{rec.tagline}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {rec.skills.slice(0, 3).map((s) => (
              <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">{s}</span>
            ))}
          </div>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
      </Link>
      <button
        onClick={onSave}
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary"
      >
        <Bookmark className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} />
        {saved ? "Saved" : "Save career"}
      </button>
    </div>
  );
}
