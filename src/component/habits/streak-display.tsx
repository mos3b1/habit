// src/components/habits/streak-display.tsx

"use client";

import { getStreakStatus, getStreakMessage } from "@/lib/utils/streak";

type StreakDisplayProps = {
  currentStreak: number;
  longestStreak: number;
  isCompletedToday?: boolean;
  showMessage?: boolean;
  size?: "sm" | "md" | "lg";
};

/**
 * Streak Display Component
 * 
 * Shows current streak with:
 * - Fire emoji animation
 * - Streak count
 * - Status label
 * - Optional motivational message
 */
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
      <div className={`flex items-center gap-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl ${classes.container}`}>
        {/* Fire Icon with Animation */}
        <div className={`${classes.icon} ${currentStreak > 0 ? "animate-pulse" : ""}`}>
          {status.emoji}
        </div>

        {/* Streak Info */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`font-bold text-gray-900 ${classes.number}`}>
              {currentStreak}
            </span>
            <span className={`text-gray-500 ${classes.label}`}>
              day{currentStreak !== 1 ? "s" : ""} streak
            </span>
          </div>
          <p className={`text-gray-600 ${classes.label}`}>
            {status.label}
          </p>
        </div>

        {/* Best Streak Badge */}
        {longestStreak > 0 && (
          <div className="text-center bg-white/50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500">Best</p>
            <p className="font-bold text-purple-600">
              🏆 {longestStreak}
            </p>
          </div>
        )}
      </div>

      {/* Motivational Message */}
      {showMessage && (
        <p className={`text-center text-gray-600 ${classes.label}`}>
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * Compact Streak Badge
 * 
 * Smaller version for cards and lists
 */
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
          ? "bg-gray-100 text-gray-500" 
          : "bg-orange-100 text-orange-700"
        }
      `}
    >
      <span className={streak > 0 ? "animate-pulse" : ""}>{status.emoji}</span>
      {streak} day{streak !== 1 ? "s" : ""}
    </span>
  );
}

/**
 * Streak Progress Ring
 * 
 * Circular progress towards a goal (e.g., 30-day challenge)
 */
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
      {/* Background Circle */}
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
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

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl">{status.emoji}</span>
        <span className="font-bold text-gray-900">{current}</span>
        <span className="text-xs text-gray-500">/ {goal}</span>
      </div>
    </div>
  );
}