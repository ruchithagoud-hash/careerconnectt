import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LogoLockup } from "./Logo";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background sm:max-w-lg sm:my-4 sm:min-h-[calc(100vh-2rem)] sm:rounded-[28px] sm:shadow-card sm:overflow-hidden sm:border sm:border-border">
        <div className="flex flex-1 flex-col pb-[76px]">{children}</div>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}

export function AppHeader({
  title,
  step,
  total,
  back,
  showLogo = false,
  right,
}: {
  title?: string;
  step?: number;
  total?: number;
  back?: string;
  showLogo?: boolean;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex min-w-0 items-center gap-2">
          {back ? (
            <Link
              to={back}
              className="-ml-1.5 rounded-full p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
          ) : showLogo ? (
            <LogoLockup size={26} />
          ) : null}
          {title && !showLogo && (
            <div className="truncate text-[15px] font-semibold tracking-tight text-foreground">{title}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {typeof step === "number" && typeof total === "number" && (
            <div className="text-[11px] font-semibold text-muted-foreground">
              Step <span className="text-primary">{step}</span> of {total}
            </div>
          )}
          {right}
        </div>
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
