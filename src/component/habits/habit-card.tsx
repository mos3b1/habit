// src/components/habits/habit-card.tsx (THEMED VERSION)

import Link from "next/link";
import type { Habit } from "@/lib/db/schema";
import { DeleteHabitButton } from "./delete-habit-button";

type HabitCardProps = {
  habit: Habit;
};

/**
 * Habit Card Component - Fully themed for light/dark mode
 * 
 * Uses CSS variables:
 * - bg-card for card background
 * - text-foreground for main text
 * - text-muted-foreground for secondary text
 * - border-border for borders
 */
export function HabitCard({ habit }: HabitCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        {/* Top Row: Icon, Name, Actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Habit Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${habit.color}20` }}
            >
              {habit.icon || "📌"}
            </div>
            
            {/* Habit Info */}
            <div>
              <h3 className="font-semibold text-foreground">{habit.name}</h3>
              <p className="text-sm text-muted-foreground">
                {habit.frequency === "daily" ? "Daily" : `${habit.targetFrequency}x per week`}
              </p>
            </div>
          </div>

          {/* Actions Dropdown */}
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/habits/${habit.id}/edit`}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Edit habit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <DeleteHabitButton habitId={habit.id} habitName={habit.name} />
          </div>
        </div>

        {/* Description */}
        {habit.description ? (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {habit.description}
          </p>
        ):(
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            No Description ..
          </p>

        )}

        {/* Stats Row */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          {/* Category Badge */}
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${habit.color}20`,
              color: habit.color 
            }}
          >
            {habit.category}
          </span>

          {/* Current Streak */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>🔥</span>
            <span>{habit.currentStreak} day streak</span>
          </div>

          {/* Best Streak */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>🏆</span>
            <span>Best: {habit.longestStreak}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <Link
        href={`/dashboard/habits/${habit.id}`}
        className="block px-5 py-3 bg-muted/30 rounded-b-xl text-center text-sm text-primary font-medium hover:bg-muted/50 transition-colors"
      >
        View Details →
      </Link>
    </div>
  );
}