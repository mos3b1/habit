import { getLastNDays, getDayName, isToday } from "@/lib/utils/date";

type WeekOverviewProps = {
  completionData: Record<string, { completed: number; total: number }>;
};

export function WeekOverview({ completionData }: WeekOverviewProps) {
  const last7Days = getLastNDays(7);

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="font-semibold text-foreground mb-4">This Week</h3>
      
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
                ${isTodayDate ? "bg-primary/10 ring-2 ring-primary/20" : ""}
              `}
            >
              <span className="text-xs text-muted-foreground mb-1">
                {getDayName(date)}
              </span>
              
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${isComplete 
                    ? "bg-green-500 dark:bg-green-400 text-white" 
                    : hasPartial
                    ? "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 border-2 border-yellow-300 dark:border-yellow-800"
                    : "bg-muted text-muted-foreground"
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