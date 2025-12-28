import { getLastNDays, getDayName, formatDateShort, isToday } from "@/lib/utils/date";

type HabitLog = {
  date: string;
  completed: boolean;
};

type StreakCalendarProps = {
  logs: HabitLog[];
  days?: number;
};

export function StreakCalendar({ logs, days = 30 }: StreakCalendarProps) {
  const dateRange = getLastNDays(days);
  
  const completedDates = new Set(
    logs.filter(l => l.completed).map(l => l.date)
  );

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Last {days} Days</h3>
      
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
                ${isTodayDate ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
                ${isComplete 
                  ? "bg-green-500 dark:bg-green-400 text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
                }
              `}
              title={`${formatDateShort(date)}: ${isComplete ? "Completed ✓" : "Missed"}`}
            >
              {isComplete ? "✓" : "·"}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-500 dark:bg-green-400" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-muted" />
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}

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
              ${isTodayDate ? "ring-1 ring-primary" : ""}
              ${isComplete 
                ? "bg-green-500 dark:bg-green-400 text-white" 
                : "bg-muted text-muted-foreground"
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