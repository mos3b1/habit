// src/components/dashboard/streak-highlights.tsx

import type { Habit } from "@/lib/db/schema";
import Link from "next/link";

type StreakHighlightsProps = {
  habits: Habit[];
};

export function StreakHighlights({ habits }: StreakHighlightsProps) {
  if (habits.length === 0) return null;

  // Sort by current streak
  const sortedByStreak = [...habits].sort((a, b) => b.currentStreak - a.currentStreak);
  
  // Get top 3 streaks (only if > 0)
  const topStreaks = sortedByStreak.filter(h => h.currentStreak > 0).slice(0, 3);
  
  // Get best ever
  const bestEver = [...habits].sort((a, b) => b.longestStreak - a.longestStreak)[0];

  if (topStreaks.length === 0 && (!bestEver || bestEver.longestStreak === 0)) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Current Hot Streaks */}
      {topStreaks.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-sm font-medium text-orange-800 mb-4 flex items-center gap-2">
            🔥 Hot Streaks
          </h3>
          <div className="space-y-3">
            {topStreaks.map((habit, index) => (
              <Link
                key={habit.id}
                href={`/dashboard/habits/${habit.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors"
              >
                <span className="text-lg">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${habit.color}20` }}
                >
                  {habit.icon || "📌"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-muted-foreground truncate">{habit.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">{habit.currentStreak}</p>
                  <p className="text-xs text-orange-500">days</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Personal Best */}
      {bestEver && bestEver.longestStreak > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-sm font-medium text-purple-800 mb-4 flex items-center gap-2">
            🏆 Personal Record
          </h3>
          <Link
            href={`/dashboard/habits/${bestEver.id}`}
            className="flex items-center gap-4"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${bestEver.color}20` }}
            >
              {bestEver.icon || "📌"}
            </div>
            <div className="flex-1">
              <p className="font-medium text-muted-foreground">{bestEver.name}</p>
              <p className="text-sm text-purple-600">Longest streak ever</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-600">{bestEver.longestStreak}</p>
              <p className="text-xs text-purple-500">days</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}