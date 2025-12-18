// src/components/habits/week-overview.tsx

import { getLastNDays, getDayName, isToday } from "@/lib/utils/date";

type WeekOverviewProps = {
  completionData: Record<string, { completed: number; total: number }>;
};

/**
 * Week Overview
 * 
 * Shows a mini calendar of the last 7 days
 * with completion status for each day.
 */
export function WeekOverview({ completionData }: WeekOverviewProps) {
  const last7Days = getLastNDays(7);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">This Week</h3>
      
      <div className="grid grid-cols-7 gap-2">
        {last7Days.map((date) => {
          const dayData = completionData[date] || { completed: 0, total: 0 };
          const isComplete = dayData.total > 0 && dayData.completed === dayData.total;
          const hasPartial = dayData.completed > 0 && !isComplete;
          const isTodayDate = isToday(date);

          return (
            <div
              key={date}
              className={`
                flex flex-col items-center p-2 rounded-lg
                ${isTodayDate ? "bg-indigo-50 ring-2 ring-indigo-200" : ""}
              `}
            >
              {/* Day name */}
              <span className="text-xs text-gray-500 mb-1">
                {getDayName(date)}
              </span>
              
              {/* Status indicator */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${isComplete 
                    ? "bg-green-500 text-white" 
                    : hasPartial
                    ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                    : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : hasPartial ? (
                  <span>{dayData.completed}</span>
                ) : (
                  <span className="text-xs">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}