export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="cc-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#cc-grad)" />
      {/* compass ring */}
      <circle cx="24" cy="24" r="13" stroke="white" strokeOpacity="0.55" strokeWidth="1.6" fill="none" />
      {/* upward arrow / needle */}
      <path d="M24 33 L19 22 L24 24 L29 22 Z" fill="white" />
      <path d="M24 15 L27 22 L24 21 L21 22 Z" fill="white" fillOpacity="0.85" />
    </svg>
  );
}

export function LogoLockup({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark size={size} />
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight text-foreground">
          Career<span className="text-primary">Compass</span>
        </div>
      </div>
    </div>
  );
}
