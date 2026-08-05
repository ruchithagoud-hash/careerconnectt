import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileUp,
  Github,
  Linkedin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Chip } from "@/components/Chip";
import { useAuth } from "@/hooks/use-auth";
import {
  BRANCHES,
  CERTIFICATION_GROUPS,
  EXPERIENCE_EXTRAS,
  INTERESTS,
  INTERNSHIPS,
  QUALIFICATIONS,
  SKILL_GROUPS,
  YEARS,
} from "@/lib/career-data";
import {
  DEFAULT_PROFILE,
  loadProfile,
  missingRequired,
  profileCompletion,
  saveProfile,
  type ProfileData,
  type ProjectEntry,
} from "@/lib/profile-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile · CareerConnect" },
      {
        name: "description",
        content:
          "Complete your CareerConnect profile — education, skills, projects, certifications, internships and career interests.",
      },
      { property: "og:title", content: "My Profile · CareerConnect" },
      {
        property: "og:description",
        content: "Complete your profile to unlock personalized career recommendations.",
      },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Profile />
    </RequireAuth>
  ),
});

const SOFT_SKILLS = SKILL_GROUPS["Soft Skills"] ?? [];
const TECH_SKILL_GROUPS: Record<string, string[]> = Object.fromEntries(
  Object.entries(SKILL_GROUPS).filter(([g]) => g !== "Soft Skills"),
);
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => String(new Date().getFullYear() - 2 + i));

const STEPS = [
  "Personal Information",
  "Academic Details",
  "Technical Skills",
  "Projects",
  "Certifications",
  "Internships",
  "Experience",
  "Resume",
  "Professional URLs",
] as const;

/** Fields that must be filled before leaving a given step (1-indexed). */
function stepErrors(step: number, d: ProfileData): string[] {
  switch (step) {
    case 1: {
      const e: string[] = [];
      if (!d.fullName.trim()) e.push("Full name is required");
      if (!d.email.trim()) e.push("Email is required");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.push("Enter a valid email address");
      if (d.phone.trim() && !/^[+\d][\d\s-]{6,17}$/.test(d.phone.trim())) e.push("Enter a valid phone number");
      return e;
    }
    case 2: {
      const e: string[] = [];
      if (!d.qualification) e.push("Select a qualification");
      if (!d.branch) e.push("Select a branch");
      if (!d.year) e.push("Select your current year");
      return e;
    }
    case 3:
      return d.skills.length ? [] : ["Select at least one technical skill"];
    case 7:
      return d.interests.length ? [] : ["Select at least one career interest"];
    default:
      return [];
  }
}

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [touched, setTouched] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const p = loadProfile();
    setData({ ...p, email: p.email || user?.email || "" });
    hydrated.current = true;
  }, [user?.email]);

  // Auto-save (debounced) so every section persists as it is edited.
  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(() => saveProfile(data), 500);
    return () => clearTimeout(t);
  }, [data]);

  const update = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setSaved(false);
  };

  const toggle = (key: keyof ProfileData, value: string) =>
    setData((d) => {
      const arr = d[key] as string[];
      return {
        ...d,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });

  const missing = missingRequired(data);
  const pct = profileCompletion(data);
  const errors = stepErrors(step, data);

  const save = () => {
    setTouched(true);
    saveProfile(data);
    setSaved(true);
  };

  const goTo = (next: number) => {
    setStep(Math.min(STEPS.length, Math.max(1, next)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const next = () => {
    setTouched(true);
    if (errors.length) return;
    saveProfile(data);
    setSaved(true);
    goTo(step + 1);
    setTouched(false);
  };

  const prev = () => {
    saveProfile(data);
    goTo(step - 1);
    setTouched(false);
  };

  const searchCareer = () => {
    setTouched(true);
    if (missing.length) return;
    saveProfile(data);
    navigate({ to: "/results" });
  };

  const isLast = step === STEPS.length;

  return (
    <AppShell>
      <AppHeader title="My Profile" back="/" step={step} total={STEPS.length} />
      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        {/* Completion */}
        <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-bold tracking-tight">Profile completion</h2>
            <span className="text-sm font-extrabold text-primary">{pct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-brand transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {missing.length
              ? `Still needed: ${missing.join(", ")}`
              : "All required details are complete. You're ready to search careers."}
          </p>
        </section>

        {/* Step tabs */}
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => goTo(i + 1)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                step === i + 1
                  ? "bg-gradient-brand border-transparent text-white shadow-soft"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary",
              )}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {step === 1 && (
          <Section title="Personal Information">
            <Field label="Full Name" required>
              <Input value={data.fullName} onChange={(v) => update("fullName", v)} placeholder="e.g. Aarav Sharma" />
            </Field>
            <Field label="Email" required>
              <Input value={data.email} onChange={(v) => update("email", v)} placeholder="you@example.com" type="email" />
            </Field>
            <Field label="Phone" hint="Optional">
              <Input value={data.phone} onChange={(v) => update("phone", v)} placeholder="+91 98765 43210" />
            </Field>
            <Field label="Date of Birth" hint="Optional">
              <Input value={data.dob} onChange={(v) => update("dob", v)} type="date" />
            </Field>
            <Field label="Gender" hint="Optional">
              <div className="flex flex-wrap gap-2">
                {GENDERS.map((g) => (
                  <Chip key={g} label={g} selected={data.gender === g} onClick={() => update("gender", data.gender === g ? "" : g)} />
                ))}
              </div>
            </Field>
            <Field label="Location" hint="Optional">
              <Input value={data.location} onChange={(v) => update("location", v)} placeholder="City, State" />
            </Field>
          </Section>
        )}

        {step === 2 && (
          <Section title="Academic Details">
            <Field label="College" hint="Optional">
              <Input value={data.college} onChange={(v) => update("college", v)} placeholder="e.g. VIT Pune" />
            </Field>
            <Field label="University" hint="Optional">
              <Input value={data.university} onChange={(v) => update("university", v)} placeholder="e.g. Savitribai Phule Pune University" />
            </Field>
            <Field label="Degree / Highest Qualification" required>
              <Select value={data.qualification} onChange={(v) => update("qualification", v)} options={QUALIFICATIONS} placeholder="Select qualification" />
            </Field>
            <Field label="Degree Title" hint="Optional">
              <Input value={data.degree} onChange={(v) => update("degree", v)} placeholder="e.g. B.Tech in Computer Science" />
            </Field>
            <Field label="Branch / Specialization" required>
              <Select value={data.branch} onChange={(v) => update("branch", v)} options={BRANCHES} placeholder="Select branch" />
            </Field>
            <Field label="Current Year" required>
              <div className="flex flex-wrap gap-2">
                {YEARS.map((y) => (
                  <Chip key={y} label={y} selected={data.year === y} onClick={() => update("year", y)} />
                ))}
              </div>
            </Field>
            <Field label="CGPA / Percentage" hint="Optional">
              <Input value={data.cgpa} onChange={(v) => update("cgpa", v)} placeholder="e.g. 8.4 or 84%" />
            </Field>
            <Field label="Graduation Year" hint="Optional">
              <Select value={data.graduationYear} onChange={(v) => update("graduationYear", v)} options={GRAD_YEARS} placeholder="Select year" />
            </Field>
          </Section>
        )}

        {step === 3 && (
          <>
            <Section title="Technical Skills" subtitle={`${data.skills.length} selected`}>
              <GroupedChips groups={TECH_SKILL_GROUPS} selected={data.skills} onToggle={(v) => toggle("skills", v)} />
            </Section>
            <Section title="Soft Skills" subtitle={`${data.softSkills.length} selected`}>
              <FlatChips items={SOFT_SKILLS} selected={data.softSkills} onToggle={(v) => toggle("softSkills", v)} />
            </Section>
          </>
        )}

        {step === 4 && (
          <ProjectsEditor
            entries={data.projectEntries}
            onChange={(entries) => update("projectEntries", entries)}
          />
        )}

        {step === 5 && (
          <Section title="Certifications" subtitle={`${data.certifications.length} selected`}>
            <GroupedChips groups={CERTIFICATION_GROUPS} selected={data.certifications} onToggle={(v) => toggle("certifications", v)} />
          </Section>
        )}

        {step === 6 && (
          <Section title="Internships" subtitle={`${data.internships.length} selected`}>
            <FlatChips items={INTERNSHIPS} selected={data.internships} onToggle={(v) => toggle("internships", v)} />
          </Section>
        )}

        {step === 7 && (
          <>
            <Section title="Experience" subtitle={`${data.experienceExtras.length} selected`}>
              <FlatChips items={EXPERIENCE_EXTRAS} selected={data.experienceExtras} onToggle={(v) => toggle("experienceExtras", v)} />
            </Section>
            <Section title="Career Interests" subtitle={`${data.interests.length} selected`}>
              <FlatChips items={INTERESTS} selected={data.interests} onToggle={(v) => toggle("interests", v)} />
            </Section>
          </>
        )}

        {step === 8 && (
          <Section title="Resume">
            <Field label="Resume file" hint="PDF / DOC">
              <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-primary/50 bg-card px-4 text-sm font-medium text-primary transition hover:bg-secondary">
                <FileUp className="h-4 w-4" />
                <span className="truncate">
                  {data.resumeName ? `Replace — ${data.resumeName}` : "Upload resume"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    update("resumeName", file.name);
                    const reader = new FileReader();
                    reader.onload = () =>
                      update("resumeDataUrl", typeof reader.result === "string" && reader.result.length < 3_000_000 ? reader.result : "");
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </Field>
            {data.resumeName && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!data.resumeDataUrl}
                  onClick={() => window.open(data.resumeDataUrl, "_blank")}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
                >
                  <Eye className="h-4 w-4 text-primary" /> Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    update("resumeName", "");
                    update("resumeDataUrl", "");
                  }}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-secondary"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" /> Remove
                </button>
              </div>
            )}
          </Section>
        )}

        {step === 9 && (
          <Section title="Professional URLs">
            <Field label="GitHub URL" hint="Optional">
              <div className="relative">
                <Github className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={data.githubUrl} onChange={(v) => update("githubUrl", v)} placeholder="https://github.com/username" className="pl-10" />
              </div>
            </Field>
            <Field label="LinkedIn URL" hint="Optional">
              <div className="relative">
                <Linkedin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0A66C2]" />
                <Input value={data.linkedinUrl} onChange={(v) => update("linkedinUrl", v)} placeholder="https://linkedin.com/in/username" className="pl-10" />
              </div>
            </Field>
          </Section>
        )}

        {touched && errors.length > 0 && (
          <p className="mt-4 rounded-2xl bg-gradient-soft p-3 text-xs font-medium text-destructive">
            {errors.join(" · ")}
          </p>
        )}

        {isLast && touched && missing.length > 0 && (
          <p className="mt-4 rounded-2xl bg-gradient-soft p-3 text-xs font-medium text-primary">
            Please complete these details before searching careers: {missing.join(", ")}.
          </p>
        )}
      </main>

      <footer className="sticky bottom-0 border-t border-border/60 bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={prev}
            disabled={step === 1}
            aria-label="Previous step"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-1 rounded-2xl border border-border bg-card px-3 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-40 sm:px-4"
          >
            <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
          </button>
          <button
            onClick={save}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card px-3 text-sm font-semibold text-foreground transition hover:bg-secondary sm:px-4"
          >
            {saved ? <Check className="h-4 w-4 text-primary" /> : null}
            {saved ? "Saved" : "Save"}
          </button>
          {isLast ? (
            <button
              onClick={searchCareer}
              className={cn(
                "inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl px-3 text-sm font-semibold text-white transition-all active:scale-[0.98]",
                missing.length ? "bg-muted text-muted-foreground" : "bg-gradient-brand shadow-glow",
              )}
            >
              <Search className="h-4 w-4 shrink-0" /> <span className="truncate">Search My Career</span>
            </button>
          ) : (
            <button
              onClick={next}
              className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl bg-gradient-brand px-3 text-sm font-semibold text-white shadow-glow transition-all active:scale-[0.98]"
            >
              <span className="truncate">Save &amp; Continue</span> <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </AppShell>
  );
}

function ProjectsEditor({
  entries,
  onChange,
}: {
  entries: ProjectEntry[];
  onChange: (entries: ProjectEntry[]) => void;
}) {
  const empty: ProjectEntry = { id: "", title: "", description: "", technologies: "", githubUrl: "", demoUrl: "" };
  const [draft, setDraft] = useState<ProjectEntry | null>(null);
  const [error, setError] = useState("");

  const submit = () => {
    if (!draft) return;
    if (!draft.title.trim()) return setError("Project title is required");
    if (!draft.description.trim()) return setError("Project description is required");
    if (!draft.technologies.trim()) return setError("List at least one technology");
    if (!draft.githubUrl.trim()) return setError("GitHub URL is required");
    setError("");
    onChange(
      draft.id
        ? entries.map((e) => (e.id === draft.id ? draft : e))
        : [...entries, { ...draft, id: crypto.randomUUID() }],
    );
    setDraft(null);
  };

  return (
    <Section title="My Projects" subtitle={`${entries.length} added`}>
      <div className="space-y-3">
        {entries.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border/60 bg-secondary/40 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{p.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{p.description}</p>
                <p className="mt-1 text-[11px] font-medium text-primary">{p.technologies}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  aria-label={`Edit ${p.title}`}
                  onClick={() => {
                    setError("");
                    setDraft(p);
                  }}
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-card hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${p.title}`}
                  onClick={() => onChange(entries.filter((e) => e.id !== p.id))}
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-card hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {draft ? (
        <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-3">
          <Field label="Title" required>
            <Input value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} placeholder="e.g. AI Resume Analyzer" />
          </Field>
          <Field label="Description" required>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="What does the project do?"
              rows={3}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>
          <Field label="Technologies" required hint="Comma separated">
            <Input value={draft.technologies} onChange={(v) => setDraft({ ...draft, technologies: v })} placeholder="React, Python, PostgreSQL" />
          </Field>
          <Field label="GitHub URL" required>
            <Input value={draft.githubUrl} onChange={(v) => setDraft({ ...draft, githubUrl: v })} placeholder="https://github.com/username/project" />
          </Field>
          <Field label="Live Demo URL" hint="Optional">
            <Input value={draft.demoUrl} onChange={(v) => setDraft({ ...draft, demoUrl: v })} placeholder="https://project.vercel.app" />
          </Field>
          {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submit}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-gradient-brand text-sm font-semibold text-white shadow-soft"
            >
              {draft.id ? "Update Project" : "Add Project"}
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(null);
                setError("");
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setDraft(empty)}
          className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/50 text-sm font-semibold text-primary transition hover:bg-secondary"
        >
          <Plus className="h-4 w-4" /> Add project
        </button>
      )}
    </Section>
  );
}

function Section({
  title,
  subtitle,
  error,
  children,
}: {
  title: string;
  subtitle?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4 rounded-3xl border border-border/60 bg-card p-4 shadow-soft sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle && <span className="text-[11px] font-medium text-muted-foreground">{subtitle}</span>}
      </div>
      <div className="space-y-4">{children}</div>
      {error && <p className="mt-3 text-[11px] font-medium text-destructive">{error}</p>}
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-semibold text-foreground">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1.5 text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15",
        className,
      )}
    />
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
          !value && "text-muted-foreground",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-foreground">
            {o}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
    </div>
  );
}

function GroupedChips({
  groups,
  selected,
  onToggle,
}: {
  groups: Record<string, string[]>;
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{group}</h3>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip key={item} label={item} selected={selected.includes(item)} onClick={() => onToggle(item)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FlatChips({
  items,
  selected,
  onToggle,
}: {
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip key={item} label={item} selected={selected.includes(item)} onClick={() => onToggle(item)} />
      ))}
    </div>
  );
}
