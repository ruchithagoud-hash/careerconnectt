import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { LogOut, Pencil, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function ProfileMenu({ email }: { email?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initial = (email ?? "").trim().charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-soft transition active:scale-95"
      >
        {initial || <User className="h-4 w-4" />}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-2xl border border-border/60 bg-card p-1 shadow-card"
        >
          {email && (
            <p className="truncate px-3 py-2 text-[11px] font-medium text-muted-foreground">{email}</p>
          )}
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            <User className="h-4 w-4 text-primary" /> My Profile
          </Link>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            <Pencil className="h-4 w-4 text-primary" /> Edit Profile
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              supabase.auth.signOut();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
