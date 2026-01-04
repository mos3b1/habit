"use client";

import { useRouter } from "next/navigation";
import { HeatmapDay } from "@/lib/actions/calendar";
import { formatDateShort } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

export function CalendarHeatmap({
  data,
  selectedDate,
}: {
  data: HeatmapDay[];
  selectedDate: string;
}) {
  const router = useRouter();

  // color mapping using theme tokens
  const levelClass = (level: number) => {
    switch (level) {
      case 0:
        return "bg-muted";
      case 1:
        return "bg-primary/25";
      case 2:
        return "bg-primary/40";
      case 3:
        return "bg-primary/65";
      case 4:
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Last 12 weeks</h2>
        <p className="text-sm text-muted-foreground">
          Click a day for details
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-1">
        {data.map((d) => (
          <button
            key={d.date}
            onClick={() => router.push(`/dashboard/calendar?date=${d.date}`)}
            className={cn(
              "h-4 w-4 rounded-sm transition hover:scale-110",
              levelClass(d.level),
              d.date === selectedDate && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            title={`${formatDateShort(d.date)}: ${d.completed}/${d.total} completed`}
            aria-label={`${d.date} ${d.completed} of ${d.total} completed`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <span className="h-3 w-3 rounded-sm bg-muted" />
        <span className="h-3 w-3 rounded-sm bg-primary/25" />
        <span className="h-3 w-3 rounded-sm bg-primary/40" />
        <span className="h-3 w-3 rounded-sm bg-primary/65" />
        <span className="h-3 w-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}