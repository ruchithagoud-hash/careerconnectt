import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background sm:max-w-lg sm:my-4 sm:min-h-[calc(100vh-2rem)] sm:rounded-3xl sm:shadow-card sm:overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function AppHeader({
  title,
  step,
  total,
  back,
}: {
  title?: string;
  step?: number;
  total?: number;
  back?: string;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          {back ? (
            <Link
              to={back}
              className="rounded-full p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-brand text-white shadow-soft">
              <Sparkles className="h-4 w-4" />
            </div>
          )}
          <div className="text-sm font-bold tracking-tight text-foreground">
            {title ?? "CareerConnect"}
          </div>
        </div>
        {typeof step === "number" && typeof total === "number" && (
          <div className="text-xs font-semibold text-muted-foreground">
            Step <span className="text-primary">{step}</span> of {total}
          </div>
        )}
      </div>
      {typeof step === "number" && typeof total === "number" && (
        <div className="h-1 w-full bg-secondary">
          <div
            className="h-full bg-gradient-brand transition-all duration-500"
            style={{ width: `${(step / total) * 100}%` }}
          />
        </div>
      )}
    </header>
  );
}
