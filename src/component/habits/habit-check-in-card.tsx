// src/components/habits/habit-check-in-card.tsx

import { CheckInButton } from "./check-in-buttton";
import type { Habit, HabitLog } from "@/lib/db/schema";

type HabitWithStatus = Habit & {
  isCompletedToday: boolean;
  todayLog: HabitLog | null;
};

type HabitCheckInCardProps = {
  habit: HabitWithStatus;
  date: string;
};

/**
 * Habit Check-in Card
 * 
 * Displays a habit with its check-in button.
 * Used in the daily check-in interface.
 */
export function HabitCheckInCard({ habit, date }: HabitCheckInCardProps) {
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
      <div className="flex items-center gap-4">
        {/* Habit Icon */}
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            transition-all duration-300
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
        <div>
          <h3 className={`font-medium transition-colors ${
            habit.isCompletedToday ? "text-green-700" : "text-gray-900"
          }`}>
            {habit.name}
            {habit.isCompletedToday && (
              <span className="ml-2 text-green-600">✓</span>
            )}
          </h3>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {/* Streak */}
            <span className="flex items-center gap-1">
              🔥 {habit.currentStreak} day streak
            </span>
            
            {/* Category */}
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{ 
                backgroundColor: `${habit.color}20`,
                color: habit.color 
              }}
            >
              {habit.category}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Check-in Button */}
      <CheckInButton
        habitId={habit.id}
        date={date}
        isCompleted={habit.isCompletedToday}
        color={habit.color}
      />
    </div>
  );
}