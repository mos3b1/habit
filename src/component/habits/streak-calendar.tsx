// src/components/habits/streak-calendar.tsx

import { getLastNDays, getDayName, formatDateShort, isToday } from "@/lib/utils/date";

type HabitLog = {
  date: string;
  completed: boolean;
};

type StreakCalendarProps = {
  logs: HabitLog[];
  days?: number;
};

/**
 * Streak Calendar
 * 
 * Shows a visual calendar of recent habit completions.
 * Similar to GitHub's contribution graph.
 */
export function StreakCalendar({ logs, days = 30 }: StreakCalendarProps) {
  const dateRange = getLastNDays(days);
  
  // Create lookup map for completed dates
  const completedDates = new Set(
    logs.filter(l => l.completed).map(l => l.date)
  );

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-700">Last {days} Days</h3>
      
      <div className="flex flex-wrap gap-1">
        {dateRange.map((date) => {
          const isComplete = completedDates.has(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={date}
              className={`
                w-8 h-8 rounded-md flex items-center justify-center text-xs
                transition-all duration-200 cursor-default
                ${isTodayDate ? "ring-2 ring-indigo-400 ring-offset-1" : ""}
                ${isComplete 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }
              `}
              title={`${formatDateShort(date)}: ${isComplete ? "Completed ✓" : "Missed"}`}
            >
              {isComplete ? "✓" : "·"}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-100" />
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Week Streak Row
 * 
 * Shows just the last 7 days in a row format
 */
export function WeekStreakRow({ logs }: { logs: HabitLog[] }) {
  const last7Days = getLastNDays(7);
  
  const completedDates = new Set(
    logs.filter(l => l.completed).map(l => l.date)
  );

  return (
    <div className="flex gap-1">
      {last7Days.map((date) => {
        const isComplete = completedDates.has(date);
        const isTodayDate = isToday(date);

        return (
          <div
            key={date}
            className={`
              w-6 h-6 rounded flex items-center justify-center text-xs font-medium
              ${isTodayDate ? "ring-1 ring-indigo-400" : ""}
              ${isComplete 
                ? "bg-green-500 text-white" 
                : "bg-gray-100 text-gray-400"
              }
            `}
            title={`${getDayName(date)}: ${isComplete ? "Done" : "Missed"}`}
          >
            {getDayName(date).charAt(0)}
          </div>
        );
      })}
    </div>
  );
}