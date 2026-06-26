import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 active:scale-95",
        selected
          ? "bg-gradient-brand border-transparent text-white shadow-soft"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary"
      )}
    >
      {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      {label}
    </button>
  );
}
