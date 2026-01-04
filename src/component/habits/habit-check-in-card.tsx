import { CheckInButton } from "./check-in-buttton";
import { StreakBadge } from "./streak-display";
import { WeekStreakRow } from "./streak-calendar";
import type { Habit, HabitLog } from "@/lib/db/schema";

type HabitWithStatus = Habit & {
  isCompletedToday: boolean;
  todayLog: HabitLog | null;
  logs?: HabitLog[];
};

type HabitCheckInCardProps = {
  habit: HabitWithStatus;
  date: string;
  showWeek?: boolean;
};

export function HabitCheckInCard({
  habit,
  date,
  showWeek = false,
}: HabitCheckInCardProps) {
  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-xl
        transition-all duration-300
        ${
          habit.isCompletedToday
            ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
            : "bg-card border border-border hover:border-muted-foreground"
        }
      `}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            flex-shrink-0 transition-all duration-300
            ${habit.isCompletedToday ? "scale-110" : ""}
          `}
          style={{
            backgroundColor: habit.isCompletedToday
              ? `${habit.color}30`
              : `${habit.color}15`,
          }}
        >
          {habit.icon || "📌"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-medium truncate transition-colors ${
                habit.isCompletedToday
                  ? "text-green-700 dark:text-green-300"
                  : "text-foreground"
              }`}
            >
              {habit.name}
              {habit.isCompletedToday && (
                <span className="ml-2 text-green-600 dark:text-green-400">
                  ✓
                </span>
              )}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {habit.frequency === "weekly" && habit.weeklyTarget ? (
              <span>
                This week:{" "}
                <span className="font-semibold text-foreground">
                  {habit.weeklyCompletedCount}/{habit.weeklyTarget}
                </span>
              </span>
            ) : (
              <span>
                🔥{" "}
                <span className="font-semibold text-foreground">
                  {habit.currentStreak}
                </span>{" "}
                day streak
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm mt-1 flex-wrap">
            <StreakBadge streak={habit.currentStreak} />

            {habit.longestStreak > 0 &&
              habit.longestStreak > habit.currentStreak && (
                <span className="text-xs text-muted-foreground">
                  Best: {habit.longestStreak}
                </span>
              )}

            <span
              className="px-2 py-0.5 rounded-full text-xs hidden sm:inline-block"
              style={{
                backgroundColor: `${habit.color}20`,
                color: habit.color,
              }}
            >
              {habit.category}
            </span>
          </div>

          {showWeek && habit.logs && (
            <div className="mt-2">
              <WeekStreakRow logs={habit.logs} />
            </div>
          )}
        </div>
      </div>

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
