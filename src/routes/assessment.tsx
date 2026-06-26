import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { Chip } from "@/components/Chip";
import {
  BRANCHES,
  CERTIFICATION_GROUPS,
  DEFAULT_ASSESSMENT,
  EXPERIENCE_EXTRAS,
  INTERESTS,
  INTERNSHIPS,
  PROJECT_GROUPS,
  QUALIFICATIONS,
  SKILL_GROUPS,
  YEARS,
  saveAssessment,
  type AssessmentData,
} from "@/lib/career-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [{ title: "Career Assessment · CareerCompass" }],
  }),
  component: Assessment,
});

const TOTAL = 6;

function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssessmentData>(DEFAULT_ASSESSMENT);

  const update = <K extends keyof AssessmentData>(key: K, value: AssessmentData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggle = (key: keyof AssessmentData, value: string) =>
    setData((d) => {
      const arr = d[key] as string[];
      return {
        ...d,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });

  const next = () => {
    if (step < TOTAL) setStep(step + 1);
    else {
      saveAssessment(data);
      navigate({ to: "/results" });
    }
  };
  const back = () => step > 1 && setStep(step - 1);

  const canNext = useMemo(() => {
    if (step === 1) return data.qualification && data.branch && data.year;
    return true;
  }, [step, data]);

  return (
    <AppShell>
      <AppHeader title="Assessment" step={step} total={TOTAL} />
      <main className="flex-1 overflow-y-auto px-5 py-6">
        {step === 1 && <ProfileStep data={data} update={update} />}
        {step === 2 && (
          <GroupedChipStep
            title="Select Your Skills"
            subtitle="Pick everything you're comfortable with."
            groups={SKILL_GROUPS}
            selected={data.skills}
            onToggle={(v) => toggle("skills", v)}
            searchable
          />
        )}
        {step === 3 && (
          <GroupedChipStep
            title="Certifications"
            subtitle="Add any certifications you've earned."
            groups={CERTIFICATION_GROUPS}
            selected={data.certifications}
            onToggle={(v) => toggle("certifications", v)}
            allowCustom
            customLabel="Add Custom Certification"
          />
        )}
        {step === 4 && (
          <GroupedChipStep
            title="Projects"
            subtitle="Select projects you've built or contributed to."
            groups={PROJECT_GROUPS}
            selected={data.projects}
            onToggle={(v) => toggle("projects", v)}
            allowCustom
            customLabel="Add Custom Project"
            searchable
          />
        )}
        {step === 5 && (
          <FlatChipStep
            title="What interests you?"
            subtitle="Pick the areas you'd love to work in."
            items={INTERESTS}
            selected={data.interests}
            onToggle={(v) => toggle("interests", v)}
          />
        )}
        {step === 6 && (
          <ExperienceStep
            data={data}
            onToggleInternship={(v) => toggle("internships", v)}
            onToggleExtra={(v) => toggle("experienceExtras", v)}
          />
        )}
      </main>

      <footer className="sticky bottom-0 border-t border-border/60 bg-background/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={back}
              className="h-12 flex-1 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            disabled={!canNext}
            className={cn(
              "h-12 flex-[2] rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.98]",
              canNext ? "bg-gradient-brand shadow-glow" : "bg-muted text-muted-foreground"
            )}
          >
            {step === TOTAL ? "Find My Career" : "Next"}
          </button>
        </div>
      </footer>
    </AppShell>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function ProfileStep({
  data,
  update,
}: {
  data: AssessmentData;
  update: <K extends keyof AssessmentData>(k: K, v: AssessmentData[K]) => void;
}) {
  return (
    <div>
      <StepTitle title="Tell us about yourself" subtitle="A quick snapshot of your education." />
      <div className="space-y-5">
        <Field label="Highest Qualification">
          <Select value={data.qualification} onChange={(v) => update("qualification", v)} options={QUALIFICATIONS} placeholder="Select qualification" />
        </Field>
        <Field label="Branch / Specialization">
          <Select value={data.branch} onChange={(v) => update("branch", v)} options={BRANCHES} placeholder="Select branch" />
        </Field>
        <Field label="Current Year">
          <div className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <Chip key={y} label={y} selected={data.year === y} onClick={() => update("year", y)} />
            ))}
          </div>
        </Field>
        <Field label="CGPA / Percentage" hint="Optional">
          <input
            value={data.cgpa}
            onChange={(e) => update("cgpa", e.target.value)}
            placeholder="e.g. 8.4 or 84%"
            className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12 w-full appearance-none rounded-xl border border-input bg-card px-4 pr-10 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15",
          !value && "text-muted-foreground"
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-foreground">
            {o}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
    </div>
  );
}

function GroupedChipStep({
  title,
  subtitle,
  groups,
  selected,
  onToggle,
  searchable,
  allowCustom,
  customLabel,
}: {
  title: string;
  subtitle?: string;
  groups: Record<string, string[]>;
  selected: string[];
  onToggle: (v: string) => void;
  searchable?: boolean;
  allowCustom?: boolean;
  customLabel?: string;
}) {
  const [query, setQuery] = useState("");
  const [customs, setCustoms] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState("");

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    const out: Record<string, string[]> = {};
    Object.entries(groups).forEach(([k, items]) => {
      const f = items.filter((i) => i.toLowerCase().includes(q));
      if (f.length) out[k] = f;
    });
    return out;
  }, [groups, query]);

  const addCustom = () => {
    const v = draft.trim();
    if (!v) return;
    if (!customs.includes(v)) setCustoms((c) => [...c, v]);
    if (!selected.includes(v)) onToggle(v);
    setDraft("");
    setShowInput(false);
  };

  return (
    <div>
      <StepTitle title={title} subtitle={subtitle} />

      {selected.length > 0 && (
        <div className="mb-5 rounded-2xl bg-gradient-soft p-3 text-xs font-medium text-primary">
          {selected.length} selected
        </div>
      )}

      {searchable && (
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </div>
      )}

      <div className="space-y-6 pb-4">
        {Object.entries(filteredGroups).map(([group, items]) => (
          <div key={group}>
            <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{group}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Chip key={item} label={item} selected={selected.includes(item)} onClick={() => onToggle(item)} />
              ))}
            </div>
          </div>
        ))}

        {allowCustom && (
          <div>
            <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom</h3>
            <div className="flex flex-wrap gap-2">
              {customs.map((c) => (
                <Chip key={c} label={c} selected={selected.includes(c)} onClick={() => onToggle(c)} />
              ))}
              {showInput ? (
                <div className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-2 py-1">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustom()}
                    placeholder="Type and press Enter"
                    className="w-44 bg-transparent px-1.5 text-sm outline-none"
                  />
                  <button onClick={addCustom} className="rounded-full bg-gradient-brand p-1 text-white"><Plus className="h-3.5 w-3.5" /></button>
                  <button onClick={() => { setShowInput(false); setDraft(""); }} className="rounded-full p-1 text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                </div>
              ) : (
                <button
                  onClick={() => setShowInput(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-card px-3.5 py-1.5 text-sm font-medium text-primary transition hover:bg-secondary"
                >
                  <Plus className="h-3.5 w-3.5" /> {customLabel ?? "Add Custom"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FlatChipStep({
  title,
  subtitle,
  items,
  selected,
  onToggle,
}: {
  title: string;
  subtitle?: string;
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <StepTitle title={title} subtitle={subtitle} />
      {selected.length > 0 && (
        <div className="mb-5 rounded-2xl bg-gradient-soft p-3 text-xs font-medium text-primary">
          {selected.length} selected
        </div>
      )}
      <div className="flex flex-wrap gap-2 pb-4">
        {items.map((item) => (
          <Chip key={item} label={item} selected={selected.includes(item)} onClick={() => onToggle(item)} />
        ))}
      </div>
    </div>
  );
}

function ExperienceStep({
  data,
  onToggleInternship,
  onToggleExtra,
}: {
  data: AssessmentData;
  onToggleInternship: (v: string) => void;
  onToggleExtra: (v: string) => void;
}) {
  return (
    <div>
      <StepTitle title="Your experience" subtitle="Internships, hackathons, anything that shaped you." />

      <div className="space-y-6 pb-4">
        <div>
          <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Internships</h3>
          <div className="flex flex-wrap gap-2">
            {INTERNSHIPS.map((i) => (
              <Chip key={i} label={i} selected={data.internships.includes(i)} onClick={() => onToggleInternship(i)} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Other experience</h3>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_EXTRAS.map((i) => (
              <Chip key={i} label={i} selected={data.experienceExtras.includes(i)} onClick={() => onToggleExtra(i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
