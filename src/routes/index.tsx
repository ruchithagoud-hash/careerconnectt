import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, FileText, Flame, Search, Bookmark, ChevronRight, Sparkle } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { CareerIcon } from "@/lib/career-icons";
import {
  CAREERS, POPULAR_CAREER_IDS, TRENDING_SKILLS,
  loadAssessment, recommendCareers, getSavedCareers, getRecents,
  type Recommendation,
} from "@/lib/career-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerCompass — Navigate Your Future" },
      { name: "description", content: "Personalized career guidance, skill insights and growth roadmaps." },
      { property: "og:title", content: "CareerCompass — Navigate Your Future" },
      { property: "og:description", content: "Personalized career guidance for students and graduates." },
    ],
  }),
  component: Home,
});

function Home() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const data = loadAssessment();
    const filled = [data.skills, data.interests, data.projects, data.certifications, data.internships]
      .filter((a) => a.length > 0).length;
    setHasAssessment(filled > 0 || !!data.qualification);
    setProgress(Math.min(100, Math.round(((filled + (data.qualification ? 1 : 0)) / 6) * 100)));
    const r = recommendCareers(data).slice(0, 6);
    setRecs(r);
    setSaved(getSavedCareers());
    setRecents(getRecents());
  }, []);

  const popular = POPULAR_CAREER_IDS
    .map((id) => CAREERS.find((c) => c.id === id))
    .filter(Boolean) as typeof CAREERS;

  const resumeScore = Math.max(40, Math.min(95, 40 + progress * 0.5 + saved.length * 3));

  return (
    <AppShell>
      <AppHeader showLogo right={
        <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-sm font-bold text-foreground">
          AS
        </Link>
      } />

      <main className="flex-1 overflow-y-auto px-5 pb-6 pt-3">
        {/* Greeting */}
        <section className="animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Good day</p>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-tight text-foreground">
            Let's plan your<br/>next big move.
          </h1>
        </section>

        {/* Search */}
        <Link
          to="/careers"
          className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-soft transition hover:border-primary/40"
        >
          <Search className="h-4 w-4" />
          Search roles, skills, companies
        </Link>

        {/* Continue Assessment */}
        <Link
          to="/assessment"
          className="mt-4 block overflow-hidden rounded-[20px] bg-gradient-brand p-5 text-white shadow-glow transition active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                {hasAssessment ? "Continue assessment" : "Start your assessment"}
              </p>
              <h2 className="mt-1 text-lg font-bold">
                {hasAssessment ? `${progress}% complete` : "Find your perfect career match"}
              </h2>
              <p className="mt-1 text-xs text-white/85">6 quick steps · about 3 minutes</p>
            </div>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-white transition-all" style={{ width: `${hasAssessment ? progress : 8}%` }} />
          </div>
        </Link>

        {/* Recommended */}
        {hasAssessment && recs.length > 0 && (
          <Section title="Recommended for you" actionTo="/results" actionLabel="See all">
            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {recs.slice(0, 5).map((r) => (
                <RecommendedCard key={r.id} rec={r} />
              ))}
            </div>
          </Section>
        )}

        {/* Popular Career Roles */}
        <Section title="Popular career roles" actionTo="/careers" actionLabel="Browse all">
          <div className="grid grid-cols-2 gap-3">
            {popular.map((c) => (
              <CompactCareerCard key={c.id} id={c.id} name={c.name} category={c.category} />
            ))}
          </div>
        </Section>

        {/* Trending Skills */}
        <Section title="Trending skills" icon={<Flame className="h-4 w-4 text-primary" />}>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SKILLS.map((s) => (
              <span key={s} className="rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground shadow-soft">
                {s}
              </span>
            ))}
          </div>
        </Section>

        {/* Resume Score */}
        <Section title="Resume readiness">
          <div className="rounded-[20px] border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-4">
              <ResumeRing value={Math.round(resumeScore)} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Profile score</p>
                <h3 className="mt-0.5 text-lg font-bold text-foreground">You're getting there</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add projects and certifications to boost your readiness.
                </p>
              </div>
            </div>
            <Link
              to="/assessment"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary"
            >
              Improve score <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Section>

        {/* Recent searches */}
        {recents.length > 0 && (
          <Section title="Recent searches">
            <div className="flex flex-wrap gap-2">
              {recents.map((r) => (
                <Link key={r} to="/careers" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground shadow-soft">
                  <Search className="h-3 w-3 text-muted-foreground" /> {r}
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Saved careers */}
        <Section title="Saved careers" actionTo="/saved" actionLabel="View all">
          {saved.length === 0 ? (
            <EmptyTile icon={<Bookmark className="h-4 w-4" />} label="No saved careers yet" hint="Tap the bookmark on any role to save it." />
          ) : (
            <div className="space-y-2">
              {saved.slice(0, 3).map((id) => {
                const c = CAREERS.find((x) => x.id === id);
                if (!c) return null;
                return <SavedRow key={id} id={c.id} name={c.name} category={c.category} />;
              })}
            </div>
          )}
        </Section>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkle className="h-3 w-3 text-primary" /> Navigate Your Future
        </div>
      </main>
    </AppShell>
  );
}

function Section({
  title, children, actionTo, actionLabel, icon,
}: { title: string; children: React.ReactNode; actionTo?: string; actionLabel?: string; icon?: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-[15px] font-bold tracking-tight text-foreground">
          {icon} {title}
        </h2>
        {actionTo && (
          <Link to={actionTo} className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary">
            {actionLabel} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function RecommendedCard({ rec }: { rec: Recommendation }) {
  return (
    <Link
      to="/career/$id" params={{ id: rec.id }}
      className="w-[230px] shrink-0 rounded-[20px] border border-border bg-card p-4 shadow-soft transition active:scale-[0.99] hover:border-primary/40"
    >
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-soft text-primary">
          <CareerIcon id={rec.id} className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          {rec.matchPercent}% match
        </span>
      </div>
      <h3 className="mt-3 truncate text-sm font-bold text-foreground">{rec.name}</h3>
      <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{rec.tagline}</p>
    </Link>
  );
}

function CompactCareerCard({ id, name, category }: { id: string; name: string; category: string }) {
  return (
    <Link
      to="/career/$id" params={{ id }}
      className="rounded-[18px] border border-border bg-card p-4 shadow-soft transition active:scale-[0.99] hover:border-primary/40"
    >
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-soft text-primary">
        <CareerIcon id={id} className="h-[18px] w-[18px]" />
      </div>
      <h3 className="mt-3 text-[13.5px] font-bold leading-tight text-foreground">{name}</h3>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{category}</p>
    </Link>
  );
}

function SavedRow({ id, name, category }: { id: string; name: string; category: string }) {
  return (
    <Link to="/career/$id" params={{ id }} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-soft text-primary">
        <CareerIcon id={id} className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{category}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function EmptyTile({ icon, label, hint }: { icon: React.ReactNode; label: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-5 text-center">
      <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-secondary text-muted-foreground">{icon}</div>
      <p className="mt-2 text-sm font-semibold text-foreground">{label}</p>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function ResumeRing({ value }: { value: number }) {
  const r = 28;
  const C = 2 * Math.PI * r;
  const offset = C - (value / 100) * C;
  return (
    <div className="relative h-[72px] w-[72px]">
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
        <circle cx="36" cy="36" r={r} stroke="oklch(0.93 0.013 256)" strokeWidth="7" fill="none" />
        <circle
          cx="36" cy="36" r={r} stroke="url(#rg)" strokeWidth="7" strokeLinecap="round" fill="none"
          strokeDasharray={C} strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2563EB" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-[15px] font-extrabold leading-none text-foreground">{value}</div>
          <div className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">Score</div>
        </div>
      </div>
      <FileText className="absolute -bottom-1 -right-1 h-4 w-4 text-primary" />
    </div>
  );
}
