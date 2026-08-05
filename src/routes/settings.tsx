import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Shield, User } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CareerConnect" },
      { name: "description", content: "Manage your CareerConnect account, profile details, and privacy preferences." },
      { property: "og:title", content: "Settings — CareerConnect" },
      { property: "og:description", content: "Manage your CareerConnect account, profile details, and privacy preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <SettingsPage />
    </RequireAuth>
  ),
});

function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell>
      <AppHeader title="Settings" back="/" />
      <main className="flex-1 space-y-4 px-5 py-5">
        <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Account</p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">{user?.email}</p>
        </section>

        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-sm font-semibold text-foreground shadow-soft transition hover:bg-secondary"
        >
          <User className="h-4 w-4 text-primary" /> My Profile
        </Link>

        <Link
          to="/privacy"
          className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-sm font-semibold text-foreground shadow-soft transition hover:bg-secondary"
        >
          <Shield className="h-4 w-4 text-primary" /> Privacy Policy
        </Link>

        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
          className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-sm font-semibold text-foreground shadow-soft transition hover:bg-secondary"
        >
          <LogOut className="h-4 w-4 text-muted-foreground" /> Logout
        </button>
      </main>
    </AppShell>
  );
}
