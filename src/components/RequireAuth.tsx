import { useEffect, useRef, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const initialHref = useRouterState({ select: (s) => s.location.href });
  // Capture the protected destination once so repeated renders never nest
  // the redirect parameter into itself.
  const targetRef = useRef(initialHref);

  useEffect(() => {
    if (loading || user) return;
    const target = targetRef.current;
    if (target.startsWith("/auth")) return;
    navigate({ to: `/auth?redirect=${encodeURIComponent(target)}`, replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <>{children}</>;
}
