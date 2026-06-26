import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bookmark, ChevronRight, Compass } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { CAREERS, getSavedCareers, toggleSavedCareer } from "@/lib/career-data";
import { CareerIcon } from "@/lib/career-icons";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved Careers · CareerCompass" }] }),
  component: Saved,
});

function Saved() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => setIds(getSavedCareers()), []);

  const items = ids.map((id) => CAREERS.find((c) => c.id === id)).filter(Boolean) as typeof CAREERS;

  return (
    <AppShell>
      <AppHeader title="Saved Careers" />
      <main className="flex-1 overflow-y-auto px-5 py-5">
        {items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-soft text-primary">
              <Bookmark className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold">Nothing saved yet</h2>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Bookmark careers from your matches or while browsing to find them here.
            </p>
            <Link
              to="/careers"
              className="mt-5 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              <Compass className="h-4 w-4" /> Browse careers
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-[18px] border border-border bg-card p-4 shadow-soft">
                <Link to="/career/$id" params={{ id: c.id }} className="flex flex-1 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-soft text-primary">
                    <CareerIcon id={c.id} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-foreground">{c.name}</p>
                    <p className="truncate text-[11.5px] text-muted-foreground">{c.category} · {c.salary}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <button
                  onClick={() => setIds(toggleSavedCareer(c.id))}
                  className="rounded-full p-1.5 text-primary"
                  aria-label="Remove"
                >
                  <Bookmark className="h-4 w-4" fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
