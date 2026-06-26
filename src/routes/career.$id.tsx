import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Award, Briefcase, Building2, GraduationCap, MapPin, Rocket, Target, Wallet,
  BookOpen, Layers, TrendingUp, MessageCircle, Bookmark, Play,
} from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { CAREERS, isCareerSaved, toggleSavedCareer, type Career } from "@/lib/career-data";
import { CareerIcon } from "@/lib/career-icons";

export const Route = createFileRoute("/career/$id")({
  head: ({ params }) => {
    const c = CAREERS.find((x) => x.id === params.id);
    return {
      meta: [
        { title: c ? `${c.name} · CareerCompass` : "Career · CareerCompass" },
        { name: "description", content: c?.description ?? "Career details." },
      ],
    };
  },
  loader: ({ params }) => {
    const career = CAREERS.find((c) => c.id === params.id);
    if (!career) throw notFound();
    return { career: career! };
  },
  notFoundComponent: () => (
    <AppShell>
      <AppHeader title="Not Found" back="/results" />
      <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
        Career not found.
      </div>
    </AppShell>
  ),
  component: CareerDetail,
});

function CareerDetail() {
  const { career } = Route.useLoaderData() as { career: Career };
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(isCareerSaved(career.id)), [career.id]);

  return (
    <AppShell>
      <AppHeader title={career.name} back="/results" right={
        <button
          onClick={() => setSaved(toggleSavedCareer(career.id).includes(career.id))}
          aria-label="Save"
          className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground"
        >
          <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
        </button>
      } />
      <main className="flex-1 overflow-y-auto pb-8">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-brand px-5 pb-7 pt-6 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 backdrop-blur">
              <CareerIcon id={career.id} className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">{career.category}</p>
              <h1 className="text-[22px] font-extrabold leading-tight tracking-tight">{career.name}</h1>
              <p className="mt-1 text-[13px] text-white/90">{career.tagline}</p>
            </div>
          </div>
          <div className="relative mt-5 grid grid-cols-2 gap-2.5">
            <Stat icon={<Wallet className="h-4 w-4" />} label="Avg. Salary" value={career.salary} />
            <Stat icon={<MapPin className="h-4 w-4" />} label="Hiring" value={`${career.companies.length}+ companies`} />
          </div>
        </div>

        <div className="space-y-6 px-5 py-6">
          <Section icon={<BookOpen className="h-4 w-4" />} title="Overview">
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">{career.description}</p>
          </Section>

          <Section icon={<Target className="h-4 w-4" />} title="Roles & Responsibilities">
            <ul className="space-y-2">
              {career.responsibilities.map((r) => (
                <li key={r} className="flex gap-2 text-[13.5px] text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-brand" />{r}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={<Layers className="h-4 w-4" />} title="Required Skills">
            <TagList items={career.skills} />
          </Section>

          <Section icon={<Award className="h-4 w-4" />} title="Preferred Certifications">
            {career.certifications.length ? <TagList items={career.certifications} /> : <EmptyText>No required certifications.</EmptyText>}
          </Section>

          <Section icon={<Rocket className="h-4 w-4" />} title="Recommended Projects">
            {career.projects.length ? <TagList items={career.projects} /> : <EmptyText>Build any portfolio-grade project.</EmptyText>}
          </Section>

          <Section icon={<Wallet className="h-4 w-4" />} title="Salary Range">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="text-[22px] font-extrabold text-foreground">{career.salary}</div>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">Typical compensation in India · varies by company and experience</p>
            </div>
          </Section>

          <Section icon={<TrendingUp className="h-4 w-4" />} title="Growth Path">
            <div className="space-y-2">
              {career.growthPath.map((g, i) => (
                <div key={g} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-brand text-[11px] font-bold text-white">{i + 1}</span>
                  <span className="text-[13.5px] font-semibold text-foreground">{g}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={<Building2 className="h-4 w-4" />} title="Companies Hiring">
            <div className="grid grid-cols-2 gap-2">
              {career.companies.map((c) => (
                <div key={c} className="rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] font-semibold text-foreground shadow-soft">
                  {c}
                </div>
              ))}
            </div>
          </Section>

          <Section icon={<GraduationCap className="h-4 w-4" />} title="Roadmap">
            <div className="space-y-3">
              {career.roadmap.map((r, idx) => (
                <div key={r.stage} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-white">{idx + 1}</span>
                    <h4 className="text-[13.5px] font-bold">{r.stage}</h4>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {r.items.map((it) => (
                      <li key={it} className="flex gap-2 text-[13px] text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={<MessageCircle className="h-4 w-4" />} title="Interview Preparation">
            <ul className="space-y-2">
              {career.interviewPrep.map((q) => (
                <li key={q} className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-[13px] shadow-soft">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-brand" />{q}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={<Briefcase className="h-4 w-4" />} title="Suitable Internship Roles">
            {career.internships.length ? <TagList items={career.internships} /> : <EmptyText>Open to any related internship.</EmptyText>}
          </Section>

          <button className="mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand text-[15px] font-bold text-white shadow-glow transition active:scale-[0.99]">
            <Play className="h-4 w-4" fill="white" /> Start Learning
          </button>
        </div>
      </main>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 px-3 py-2.5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/80">{icon} {label}</div>
      <div className="mt-0.5 text-[13px] font-bold">{value}</div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-[14px] font-bold text-foreground">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-soft text-primary">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span key={i} className="rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground shadow-soft">{i}</span>
      ))}
    </div>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-[12.5px] text-muted-foreground">{children}</p>;
}

// Link import kept for potential future use
void Link;
