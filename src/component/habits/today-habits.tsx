// src/components/habits/today-habits.tsx

import Link from "next/link";
import { HabitCheckInCard } from "./habit-check-in-card";
import type { Habit, HabitLog } from "@/lib/db/schema";

type HabitWithStatus = Habit & {
  isCompletedToday: boolean;
  todayLog: HabitLog | null;
  weeklyCompletedCount?: number;
  weeklyTarget?: number | null;
  isWeekGoalMet?: boolean | null;
};

type TodayHabitsProps = {
  habits: HabitWithStatus[];
  date: string;
};

/**
 * Today's Habits List
 * 
 * Shows all habits with their check-in status.
 * Includes progress indicator and empty state.
 */
export function TodayHabits({ habits, date }: TodayHabitsProps) {
  const completedCount = habits.filter(h => h.isCompletedToday).length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Empty state
  if (habits.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          No habits to track
        </h2>
        <p className="text-foreground-50 mb-6">
          Create your first habit to start your journey!
        </p>
        <Link
          href="/dashboard/habits/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Habit
        </Link>
      </div>
    );
  }

  // All done state
  const allDone = completedCount === totalCount;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">
            Today's Progress
          </h2>
          <span className={`text-lg font-bold ${allDone ? "text-green-600" : "text-foreground"
            }`}>
            {completedCount}/{totalCount}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${allDone ? "bg-green-500" : "bg-indigo-500"
              }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Celebration message */}
        {allDone && (
          <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
            <span className="text-2xl">🎉</span>
            <span className="font-medium">All habits completed! Great job!</span>
            <span className="text-2xl">🎉</span>
          </div>
        )}
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <HabitCheckInCard
            key={habit.id}
            habit={habit}
            date={date}
          />
        ))}
      </div>
    </div>
  );
}