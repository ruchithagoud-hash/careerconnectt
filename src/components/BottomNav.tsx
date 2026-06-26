import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ClipboardList, Compass, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/assessment", label: "Assessment", icon: ClipboardList },
  { to: "/careers", label: "Careers", icon: Compass },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 sm:absolute">
      <div className="mx-auto w-full max-w-md sm:max-w-lg">
        <div className="mx-3 mb-3 flex items-center justify-between rounded-2xl border border-border bg-card/95 px-2 py-1.5 shadow-card backdrop-blur">
          {ITEMS.map(({ to, label, icon: Icon }) => {
            const active =
              to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className="h-[20px] w-[20px]"
                  strokeWidth={active ? 2.4 : 1.8}
                  fill={active ? "currentColor" : "none"}
                  fillOpacity={active ? 0.12 : 0}
                />
                <span className={cn("text-[10px] font-semibold tracking-tight", active && "text-primary")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
