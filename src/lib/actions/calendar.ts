"use server";

import { db } from "@/lib/db";
import { habits, habitLogs } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/user";
import { getLastNDays } from "@/lib/utils/date";
import { eq, and } from "drizzle-orm";

export type HeatmapDay = {
  date: string;
  completed: number;
  total: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function toLevel(completed: number, total: number): 0 | 1 | 2 | 3 | 4 {
  if (total <= 0) return 0;
  const pct = (completed / total) * 100;
  if (pct === 0) return 0;
  if (pct < 25) return 1;
  if (pct < 50) return 2;
  if (pct < 75) return 3;
  return 4;
}

/**
 * Returns heatmap data for last N days:
 * - completed = number of habits completed that day
 * - total = number of active habits
 * - level = 0..4 color intensity
 */
export async function getCalendarHeatmapData(days = 84): Promise<HeatmapDay[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  const dateRange = getLastNDays(days);

  const userHabits = await db.query.habits.findMany({
    where: and(eq(habits.userId, user.id), eq(habits.isActive, true)),
    columns: { id: true },
  });

  const total = userHabits.length;
  if (total === 0) {
    return dateRange.map((date) => ({ date, completed: 0, total: 0, level: 0 }));
  }

  const habitIds = new Set(userHabits.map((h) => h.id));

  // Get all completed logs (then filter by date range + habitIds)
  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.completed, true),
    columns: { habitId: true, date: true },
  });

  const completedByDate = new Map<string, number>();
  for (const log of logs) {
    if (!habitIds.has(log.habitId)) continue;
    if (!dateRange.includes(log.date)) continue;
    completedByDate.set(log.date, (completedByDate.get(log.date) || 0) + 1);
  }

  return dateRange.map((date) => {
    const completed = completedByDate.get(date) || 0;
    const level = toLevel(completed, total);
    return { date, completed, total, level };
  });
}