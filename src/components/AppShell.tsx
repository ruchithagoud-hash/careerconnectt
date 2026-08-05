import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background sm:my-4 sm:min-h-[calc(100vh-2rem)] sm:max-w-lg sm:overflow-hidden sm:rounded-3xl sm:shadow-card md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
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
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-2">
          {back ? (
            <Link
              to={back}
              className="shrink-0 rounded-full p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
          ) : (
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-soft">
              <Sparkles className="h-4 w-4" />
            </div>
          )}
          <div className="truncate text-sm font-bold tracking-tight text-foreground sm:text-base">
            {title ?? "CareerConnect"}
          </div>
        </div>
        {typeof step === "number" && typeof total === "number" && (
          <div className="shrink-0 whitespace-nowrap text-xs font-semibold text-muted-foreground">
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
