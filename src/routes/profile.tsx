import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, FileUp, Github, Linkedin, Search } from "lucide-react";
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
  PROJECT_GROUPS,
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

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    setData({ ...p, email: p.email || user?.email || "" });
  }, [user?.email]);

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

  const save = () => {
    setTouched(true);
    saveProfile(data);
    setSaved(true);
  };

  const searchCareer = () => {
    setTouched(true);
    if (missing.length) return;
    saveProfile(data);
    navigate({ to: "/results" });
  };

  return (
    <AppShell>
      <AppHeader title="My Profile" back="/" />
      <main className="flex-1 overflow-y-auto px-5 py-5">
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

        <Section title="Personal Information">
          <Field label="Full Name" required error={touched && !data.fullName.trim() ? "Full name is required" : undefined}>
            <Input value={data.fullName} onChange={(v) => update("fullName", v)} placeholder="e.g. Aarav Sharma" />
          </Field>
          <Field label="Email" required error={touched && !data.email.trim() ? "Email is required" : undefined}>
            <Input value={data.email} onChange={(v) => update("email", v)} placeholder="you@example.com" type="email" />
          </Field>
          <Field label="Phone" hint="Optional">
            <Input value={data.phone} onChange={(v) => update("phone", v)} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Location" hint="Optional">
            <Input value={data.location} onChange={(v) => update("location", v)} placeholder="City, State" />
          </Field>
        </Section>

        <Section title="Education">
          <Field label="Highest Qualification" required error={touched && !data.qualification ? "Select a qualification" : undefined}>
            <Select value={data.qualification} onChange={(v) => update("qualification", v)} options={QUALIFICATIONS} placeholder="Select qualification" />
          </Field>
          <Field label="Branch / Specialization" required error={touched && !data.branch ? "Select a branch" : undefined}>
            <Select value={data.branch} onChange={(v) => update("branch", v)} options={BRANCHES} placeholder="Select branch" />
          </Field>
          <Field label="Current Year" required error={touched && !data.year ? "Select your current year" : undefined}>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => (
                <Chip key={y} label={y} selected={data.year === y} onClick={() => update("year", y)} />
              ))}
            </div>
          </Field>
          <Field label="College / University" hint="Optional">
            <Input value={data.college} onChange={(v) => update("college", v)} placeholder="e.g. VIT Pune" />
          </Field>
          <Field label="CGPA / Percentage" hint="Optional">
            <Input value={data.cgpa} onChange={(v) => update("cgpa", v)} placeholder="e.g. 8.4 or 84%" />
          </Field>
        </Section>

        <Section
          title="Technical Skills"
          subtitle={`${data.skills.length} selected`}
          error={touched && !data.skills.length ? "Select at least one technical skill" : undefined}
        >
          <GroupedChips groups={TECH_SKILL_GROUPS} selected={data.skills} onToggle={(v) => toggle("skills", v)} />
        </Section>

        <Section title="Soft Skills" subtitle={`${data.softSkills.length} selected`}>
          <FlatChips items={SOFT_SKILLS} selected={data.softSkills} onToggle={(v) => toggle("softSkills", v)} />
        </Section>

        <Section title="Projects" subtitle={`${data.projects.length} selected`}>
          <GroupedChips groups={PROJECT_GROUPS} selected={data.projects} onToggle={(v) => toggle("projects", v)} />
        </Section>

        <Section title="Certifications" subtitle={`${data.certifications.length} selected`}>
          <GroupedChips groups={CERTIFICATION_GROUPS} selected={data.certifications} onToggle={(v) => toggle("certifications", v)} />
        </Section>

        <Section title="Internships" subtitle={`${data.internships.length} selected`}>
          <FlatChips items={INTERNSHIPS} selected={data.internships} onToggle={(v) => toggle("internships", v)} />
        </Section>

        <Section title="Experience" subtitle={`${data.experienceExtras.length} selected`}>
          <FlatChips items={EXPERIENCE_EXTRAS} selected={data.experienceExtras} onToggle={(v) => toggle("experienceExtras", v)} />
        </Section>

        <Section
          title="Career Interests"
          subtitle={`${data.interests.length} selected`}
          error={touched && !data.interests.length ? "Select at least one career interest" : undefined}
        >
          <FlatChips items={INTERESTS} selected={data.interests} onToggle={(v) => toggle("interests", v)} />
        </Section>

        <Section title="Resume & Links">
          <Field label="Resume" hint="PDF / DOC">
            <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-primary/50 bg-card px-4 text-sm font-medium text-primary transition hover:bg-secondary">
              <FileUp className="h-4 w-4" />
              <span className="truncate">{data.resumeName || "Upload resume"}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => update("resumeName", e.target.files?.[0]?.name ?? "")}
              />
            </label>
          </Field>
          <Field label="LinkedIn URL" hint="Optional">
            <div className="relative">
              <Linkedin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0A66C2]" />
              <Input
                value={data.linkedinUrl}
                onChange={(v) => update("linkedinUrl", v)}
                placeholder="https://linkedin.com/in/username"
                className="pl-10"
              />
            </div>
          </Field>
          <Field label="GitHub URL" hint="Optional">
            <div className="relative">
              <Github className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={data.githubUrl}
                onChange={(v) => update("githubUrl", v)}
                placeholder="https://github.com/username"
                className="pl-10"
              />
            </div>
          </Field>
        </Section>

        {touched && missing.length > 0 && (
          <p className="mt-5 rounded-2xl bg-gradient-soft p-3 text-xs font-medium text-primary">
            Please complete these details before searching careers: {missing.join(", ")}.
          </p>
        )}
      </main>

      <footer className="sticky bottom-0 border-t border-border/60 bg-background/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            {saved ? <Check className="h-4 w-4 text-primary" /> : null}
            {saved ? "Saved" : "Save Profile"}
          </button>
          <button
            onClick={searchCareer}
            className={cn(
              "inline-flex h-12 flex-[1.4] items-center justify-center gap-1.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.98]",
              missing.length ? "bg-muted text-muted-foreground" : "bg-gradient-brand shadow-glow",
            )}
          >
            <Search className="h-4 w-4" /> Search My Career
          </button>
        </div>
      </footer>
    </AppShell>
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
    <section className="mt-4 rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
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
