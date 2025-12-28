
"use client";

import { getStreakStatus, getStreakMessage } from "@/lib/utils/streak";

type StreakDisplayProps = {
  currentStreak: number;
  longestStreak: number;
  isCompletedToday?: boolean;
  showMessage?: boolean;
  size?: "sm" | "md" | "lg";
};

export function StreakDisplay({
  currentStreak,
  longestStreak,
  isCompletedToday = false,
  showMessage = false,
  size = "md",
}: StreakDisplayProps) {
  const status = getStreakStatus(currentStreak);
  const message = getStreakMessage(currentStreak, isCompletedToday);

  const sizeClasses = {
    sm: {
      container: "p-3",
      icon: "text-2xl",
      number: "text-xl",
      label: "text-xs",
    },
    md: {
      container: "p-4",
      icon: "text-3xl",
      number: "text-2xl",
      label: "text-sm",
    },
    lg: {
      container: "p-6",
      icon: "text-5xl",
      number: "text-4xl",
      label: "text-base",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl ${classes.container} border border-orange-100 dark:border-orange-900`}>
        <div className={`${classes.icon} ${currentStreak > 0 ? "animate-pulse" : ""}`}>
          {status.emoji}
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`font-bold text-foreground ${classes.number}`}>
              {currentStreak}
            </span>
            <span className={`text-muted-foreground ${classes.label}`}>
              day{currentStreak !== 1 ? "s" : ""} streak
            </span>
          </div>
          <p className={`text-muted-foreground ${classes.label}`}>
            {status.label}
          </p>
        </div>

        {longestStreak > 0 && (
          <div className="text-center bg-card rounded-lg px-3 py-2 border border-border">
            <p className="text-xs text-muted-foreground">Best</p>
            <p className="font-bold text-purple-600 dark:text-purple-400">
              🏆 {longestStreak}
            </p>
          </div>
        )}
      </div>

      {showMessage && (
        <p className={`text-center text-muted-foreground ${classes.label}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export function StreakBadge({ 
  streak, 
  showZero = false 
}: { 
  streak: number; 
  showZero?: boolean;
}) {
  if (streak === 0 && !showZero) return null;

  const status = getStreakStatus(streak);

  return (
    <span 
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
        ${streak === 0 
          ? "bg-muted text-muted-foreground" 
          : "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300"
        }
      `}
    >
      <span className={streak > 0 ? "animate-pulse" : ""}>{status.emoji}</span>
      {streak} day{streak !== 1 ? "s" : ""}
    </span>
  );
}

export function StreakProgressRing({
  current,
  goal = 30,
  size = 100,
}: {
  current: number;
  goal?: number;
  size?: number;
}) {
  const percentage = Math.min((current / goal) * 100, 100);
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const status = getStreakStatus(current);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={percentage >= 100 ? "#22c55e" : "#f97316"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl">{status.emoji}</span>
        <span className="font-bold text-foreground">{current}</span>
        <span className="text-xs text-muted-foreground">/ {goal}</span>
      </div>
    </div>
  );
}