import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  GraduationCap, Bookmark, ClipboardList, Moon, Settings, HelpCircle, Info, ChevronRight, Mail,
} from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { LogoMark } from "@/components/Logo";
import { getSavedCareers, loadAssessment } from "@/lib/career-data";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · CareerCompass" }] }),
  component: Profile,
});

function Profile() {
  const [dark, setDark] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [assessment, setAssessment] = useState({ qualification: "", branch: "", year: "" });

  useEffect(() => {
    setSavedCount(getSavedCareers().length);
    const a = loadAssessment();
    setAssessment({ qualification: a.qualification, branch: a.branch, year: a.year });
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <AppShell>
      <AppHeader title="Profile" />
      <main className="flex-1 overflow-y-auto px-5 py-5">
        {/* Identity */}
        <div className="flex items-center gap-4 rounded-[20px] border border-border bg-card p-5 shadow-soft">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-lg font-bold text-white">
            AS
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[16px] font-bold text-foreground">Aarav Sharma</h2>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-muted-foreground">
              <Mail className="h-3 w-3" /> aarav@example.com
            </p>
          </div>
        </div>

        {/* Education */}
        <Group title="Education">
          <Row icon={<GraduationCap className="h-4 w-4" />} label={assessment.qualification || "Add qualification"} hint={assessment.branch || "—"} to="/assessment" />
          <Row icon={<ClipboardList className="h-4 w-4" />} label={assessment.year ? `${assessment.year} Year` : "Current year"} hint="Tap to update" to="/assessment" />
        </Group>

        {/* Activity */}
        <Group title="Activity">
          <Row icon={<Bookmark className="h-4 w-4" />} label="Saved Careers" hint={`${savedCount} saved`} to="/saved" />
          <Row icon={<ClipboardList className="h-4 w-4" />} label="Saved Assessment" hint="Continue any time" to="/assessment" />
        </Group>

        {/* Preferences */}
        <Group title="Preferences">
          <ToggleRow icon={<Moon className="h-4 w-4" />} label="Dark Mode" value={dark} onChange={toggleDark} />
          <Row icon={<Settings className="h-4 w-4" />} label="Settings" hint="Notifications · Language" />
        </Group>

        {/* Support */}
        <Group title="Support">
          <Row icon={<HelpCircle className="h-4 w-4" />} label="Help & Support" hint="FAQs · Contact us" />
          <Row icon={<Info className="h-4 w-4" />} label="About CareerCompass" hint="v1.0.0" />
        </Group>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <LogoMark size={28} />
          <p className="text-[11px] font-semibold text-muted-foreground">CareerCompass · Navigate Your Future</p>
        </div>
      </main>
    </AppShell>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="overflow-hidden rounded-[18px] border border-border bg-card shadow-soft">{children}</div>
    </section>
  );
}

function Row({ icon, label, hint, to }: { icon: React.ReactNode; label: string; hint?: string; to?: string }) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-soft text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-foreground">{label}</p>
        {hint && <p className="truncate text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );
  return to ? (
    <Link to={to} className="block border-b border-border last:border-b-0">{inner}</Link>
  ) : (
    <button className="block w-full border-b border-border text-left last:border-b-0">{inner}</button>
  );
}

function ToggleRow({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-b-0">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-soft text-primary">{icon}</div>
      <div className="flex-1 text-[13.5px] font-semibold text-foreground">{label}</div>
      <button
        onClick={onChange}
        aria-pressed={value}
        className={`relative h-6 w-11 rounded-full transition ${value ? "bg-gradient-brand" : "bg-secondary"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${value ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
