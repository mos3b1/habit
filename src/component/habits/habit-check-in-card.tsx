// src/components/habits/habit-check-in-card.tsx

// UPDATE: Add streak display and animation

import { CheckInButton } from "./check-in-buttton";
import { StreakBadge } from "./streak-display";
import { WeekStreakRow } from "./streak-calendar";
import type { Habit, HabitLog } from "@/lib/db/schema";

type HabitWithStatus = Habit & {
  isCompletedToday: boolean;
  todayLog: HabitLog | null;
  logs?: HabitLog[]; // Add logs for week display
};

type HabitCheckInCardProps = {
  habit: HabitWithStatus;
  date: string;
  showWeek?: boolean;
};

export function HabitCheckInCard({ 
  habit, 
  date, 
  showWeek = false 
}: HabitCheckInCardProps) {
  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-xl
        transition-all duration-300
        ${habit.isCompletedToday 
          ? "bg-green-50 border border-green-200" 
          : "bg-white border border-gray-100 hover:border-gray-200"
        }
      `}
    >
      {/* Left side: Icon and Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Habit Icon */}
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            flex-shrink-0 transition-all duration-300
            ${habit.isCompletedToday ? "scale-110" : ""}
          `}
          style={{ 
            backgroundColor: habit.isCompletedToday 
              ? `${habit.color}30` 
              : `${habit.color}15` 
          }}
        >
          {habit.icon || "📌"}
        </div>

        {/* Habit Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-medium truncate transition-colors ${
              habit.isCompletedToday ? "text-green-700" : "text-gray-900"
            }`}>
              {habit.name}
              {habit.isCompletedToday && (
                <span className="ml-2 text-green-600">✓</span>
              )}
            </h3>
          </div>
          
          <div className="flex items-center gap-3 text-sm mt-1 flex-wrap">
            {/* Streak Badge */}
            <StreakBadge streak={habit.currentStreak} />
            
            {/* Best Streak */}
            {habit.longestStreak > 0 && habit.longestStreak > habit.currentStreak && (
              <span className="text-xs text-gray-400">
                Best: {habit.longestStreak}
              </span>
            )}

            {/* Category */}
            <span
              className="px-2 py-0.5 rounded-full text-xs hidden sm:inline-block"
              style={{ 
                backgroundColor: `${habit.color}20`,
                color: habit.color 
              }}
            >
              {habit.category}
            </span>
          </div>

          {/* Week streak row (optional) */}
          {showWeek && habit.logs && (
            <div className="mt-2">
              <WeekStreakRow logs={habit.logs} />
            </div>
          )}
        </div>
      </div>

      {/* Right side: Check-in Button */}
      <div className="flex-shrink-0 ml-4">
        <CheckInButton
          habitId={habit.id}
          date={date}
          isCompleted={habit.isCompletedToday}
          color={habit.color}
        />
      </div>
    </div>
  );
}