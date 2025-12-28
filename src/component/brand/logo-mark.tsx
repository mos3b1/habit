import * as React from "react";

type LogoMarkProps = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * Theme-colored SVG mark.
 * Uses CSS variables: --primary and --accent from your globals.css.
 * Works in light/dark automatically.
 */
export function LogoMark({ size = 36, className, title = "HabitTracker" }: LogoMarkProps) {
  const id = React.useId(); // unique gradient id (prevents conflicts)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="10" y1="54" x2="54" y2="10">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="55%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>

      {/* Left wing */}
      <path
        d="M10 28c9 1 15 7 20 18 2 5 5 9 9 12-8 0-15-6-20-15-5-9-8-13-9-15z"
        fill={`url(#${id}-grad)`}
        opacity="0.95"
      />

      {/* Main swoosh check */}
      <path
        d="M18 44c6 10 14 14 22 8 7-5 12-14 18-28 1-2 3-3 5-2 2 1 2 3 1 5C56 46 47 58 35 60 23 62 14 54 10 44c-1-2 0-4 2-5 2-1 4 0 6 5z"
        fill={`url(#${id}-grad)`}
      />
    </svg>
  );
}