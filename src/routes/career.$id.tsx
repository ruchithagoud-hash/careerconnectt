import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Award, Briefcase, Building2, GraduationCap, MapPin, Rocket, Target, Wallet, BookOpen, Layers } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { CAREERS } from "@/lib/career-data";

export const Route = createFileRoute("/career/$id")({
  head: ({ params }) => {
    const c = CAREERS.find((x) => x.id === params.id);
    return {
      meta: [
        { title: c ? `${c.name} · CareerConnect` : "Career · CareerConnect" },
        { name: "description", content: c?.description ?? "Career details." },
      ],
    };
  },
  loader: ({ params }) => {
    const career = CAREERS.find((c) => c.id === params.id);
    if (!career) throw notFound();
    return { career };
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
  const { career } = Route.useLoaderData();

  return (
    <AppShell>
      <AppHeader title={career.name} back="/results" />
      <main className="flex-1 overflow-y-auto pb-8">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-brand px-5 pb-7 pt-6 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-3xl backdrop-blur">
              {career.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight">{career.name}</h1>
              <p className="mt-1 text-sm text-white/90">{career.tagline}</p>
            </div>
          </div>
          <div className="relative mt-5 grid grid-cols-2 gap-2.5">
            <Stat icon={<Wallet className="h-4 w-4" />} label="Avg. Salary" value={career.salary} />
            <Stat icon={<MapPin className="h-4 w-4" />} label="Hiring" value={`${career.companies.length}+ companies`} />
          </div>
        </div>

        <div className="space-y-6 px-5 py-6">
          <Section icon={<BookOpen className="h-4 w-4" />} title="Overview">
            <p className="text-sm leading-relaxed text-muted-foreground">{career.description}</p>
          </Section>

          <Section icon={<Target className="h-4 w-4" />} title="Roles & Responsibilities">
            <ul className="space-y-2">
              {career.responsibilities.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-brand" />
                  {r}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={<Layers className="h-4 w-4" />} title="Required Skills">
            <TagList items={career.skills} />
          </Section>

          <Section icon={<Award className="h-4 w-4" />} title="Recommended Certifications">
            <TagList items={career.certifications} />
          </Section>

          <Section icon={<Rocket className="h-4 w-4" />} title="Recommended Projects">
            <TagList items={career.projects} />
          </Section>

          <Section icon={<Briefcase className="h-4 w-4" />} title="Suitable Internship Roles">
            <TagList items={career.internships} />
          </Section>

          <Section icon={<GraduationCap className="h-4 w-4" />} title="Career Roadmap">
            <div className="space-y-3">
              {career.roadmap.map((r, idx) => (
                <div key={r.stage} className="relative rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold">{r.stage}</h4>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {r.items.map((it) => (
                      <li key={it} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={<Building2 className="h-4 w-4" />} title="Top Hiring Companies">
            <div className="grid grid-cols-2 gap-2">
              {career.companies.map((c) => (
                <div key={c} className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground shadow-soft">
                  {c}
                </div>
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="h-12 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary">
              Learning Path
            </button>
            <Link
              to="/results"
              className="grid h-12 place-items-center rounded-2xl bg-gradient-brand text-sm font-semibold text-white shadow-glow transition active:scale-[0.98]"
            >
              Back to Matches
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 px-3 py-2.5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/80">
        {icon} {label}
      </div>
      <div className="mt-0.5 text-sm font-bold">{value}</div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
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
        <span key={i} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft">
          {i}
        </span>
      ))}
    </div>
  );
}
