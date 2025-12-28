// src/components/dashboard/weekly-chart.tsx

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { DailyStats } from "@/lib/actions/analytics";
import { getDayName, isToday } from "@/lib/utils/date";

type WeeklyChartProps = {
  data: DailyStats[];
};

export function WeeklyChart({ data }: WeeklyChartProps) {
  // Transform data for chart
  const chartData = data.map(day => ({
    ...day,
    day: getDayName(day.date),
    isToday: isToday(day.date),
  }));

  // Calculate average
  const avgPercentage = Math.round(
    chartData.reduce((sum, d) => sum + d.percentage, 0) / chartData.length
  );

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-primary">Weekly Progress</h3>
          <p className="text-sm text-muted-foreground">Completion rate per day</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600">{avgPercentage}%</p>
          <p className="text-xs text-muted-foreground">Avg. this week</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm">
                      <p className="font-medium">{data.day}</p>
                      <p>{data.completed}/{data.total} habits</p>
                      <p className="text-indigo-300">{data.percentage}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="percentage" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isToday ? "#6366f1" : entry.percentage >= 75 ? "#22c55e" : entry.percentage >= 50 ? "#eab308" : "#e5e7eb"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>75%+</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span>50-74%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-200" />
          <span>&lt;50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-indigo-500" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}