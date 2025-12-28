// src/components/dashboard/habit-heatmap.tsx

"use client";

import { formatDateShort, getDayName, isToday } from "@/lib/utils/date";

type HeatmapData = {
  date: string;
  level: number; // 0-4
};

type HabitHeatmapProps = {
  data: HeatmapData[];
  title?: string;
};

export function HabitHeatmap({ data, title = "Activity Heatmap" }: HabitHeatmapProps) {
  // Color levels (GitHub-style)
  const levelColors = [
    "bg-gray-100",      // 0 - none
    "bg-green-200",     // 1 - low
    "bg-green-400",     // 2 - medium-low
    "bg-green-500",     // 3 - medium-high
    "bg-green-600",     // 4 - high
  ];

  return (
    <div className="bg-background rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground">Last {data.length} days</p>
      </div>

      {/* Heatmap Grid */}
      <div className="flex flex-wrap gap-1">
        {data.map((day, index) => (
          <div
            key={day.date}
            className={`
              w-4 h-4 rounded-sm cursor-pointer
              transition-all duration-200 hover:scale-125 hover:z-10
              ${levelColors[day.level]}
              ${isToday(day.date) ? "ring-2 ring-indigo-500 ring-offset-1" : ""}
            `}
            title={`${formatDateShort(day.date)}: ${
              day.level === 0 ? "No activity" :
              day.level === 1 ? "Low activity" :
              day.level === 2 ? "Moderate activity" :
              day.level === 3 ? "Good activity" :
              "Great activity!"
            }`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-primary">
        <span>Less</span>
        {levelColors.map((color, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-sm ${color}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}