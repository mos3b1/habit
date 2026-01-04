export function HeroIconBackdrop() {
  return (
    <div className="pointer-events-none absolute -top-10 -left-10 opacity-20 blur-[0.5px]">
      <svg width="220" height="220" viewBox="0 0 200 200" fill="none">
        <defs>
          <linearGradient id="g" x1="30" y1="170" x2="170" y2="30">
            <stop stopColor="hsl(var(--primary))" />
            <stop offset="1" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>

        {/* big circle */}
        <circle cx="100" cy="100" r="78" stroke="url(#g)" strokeWidth="18" />

        {/* check mark */}
        <path
          d="M70 105l18 18 42-52"
          stroke="url(#g)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}