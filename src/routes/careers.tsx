import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { CAREERS, pushRecent } from "@/lib/career-data";
import { CareerIcon } from "@/lib/career-icons";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/careers")({
  head: () => ({ meta: [{ title: "Browse Careers · CareerCompass" }] }),
  component: Careers,
});

function Careers() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(CAREERS.map((c) => c.category)))];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return CAREERS.filter((c) => (cat === "All" || c.category === cat))
      .filter((c) =>
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.skills.some((s) => s.toLowerCase().includes(query)) ||
        c.category.toLowerCase().includes(query)
      );
  }, [q, cat]);

  return (
    <AppShell>
      <AppHeader title="Browse Careers" />
      <main className="flex-1 overflow-y-auto px-5 py-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => q && pushRecent(q)}
            placeholder="Search roles, skills, categories"
            className="h-12 w-full rounded-2xl border border-input bg-card pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </div>

        <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition",
                cat === c
                  ? "bg-gradient-brand border-transparent text-white shadow-soft"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {filtered.length} role{filtered.length === 1 ? "" : "s"}
        </p>

        <div className="mt-3 space-y-3 pb-4">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to="/career/$id" params={{ id: c.id }}
              className="flex items-center gap-3 rounded-[18px] border border-border bg-card p-4 shadow-soft transition active:scale-[0.99] hover:border-primary/40"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-soft text-primary">
                <CareerIcon id={c.id} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-foreground">{c.name}</p>
                <p className="truncate text-[11.5px] text-muted-foreground">{c.category} · {c.salary}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
