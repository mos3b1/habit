// src/lib/actions/analytics.ts

"use server";

import { db } from "@/lib/db";
import { habits, habitLogs } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/user";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { 
  getTodayDate, 
  getLastNDays, 
  formatDate, 
  parseDate 
} from "@/lib/utils/date";

// ============================================================
// TYPES
// ============================================================

export type DailyStats = {
  date: string;
  completed: number;
  total: number;
  percentage: number;
};

export type HabitWithStats = {
  id: string;
  name: string;
  icon: string | null;
  color: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
  last30Days: boolean[]; // true = completed, false = not
};

export type OverallStats = {
  totalHabits: number;
  completedToday: number;
  totalToday: number;
  bestStreak: number;
  totalCompletions: number;
  weeklyCompletionRate: number;
  monthlyCompletionRate: number;
};

// ============================================================
// GET OVERALL STATS
// ============================================================

export async function getOverallStats(): Promise<OverallStats | null> {
  const user = await getOrCreateUser();
  if (!user) return null;

  const today = getTodayDate();
  const last7Days = getLastNDays(7);
  const last30Days = getLastNDays(30);

  // Get all active habits for this user 
  const userHabits = await db.query.habits.findMany({
    where: and(
      eq(habits.userId, user.id),
      eq(habits.isActive, true)
    ),
  });

  if (userHabits.length === 0) {
    return {
      totalHabits: 0,
      completedToday: 0,
      totalToday: 0,
      bestStreak: 0,
      totalCompletions: 0,
      weeklyCompletionRate: 0,
      monthlyCompletionRate: 0,
    };
  }

  //store it as array
  const habitIds = userHabits.map(h => h.id);

  // Get today's logs and completed
  const todayLogs = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.date, today),
      eq(habitLogs.completed, true)
    ),
  });

  //get just logs is for this user and for this day and comleted
  const completedToday = todayLogs.filter(
    log => habitIds.includes(log.habitId)
  ).length;

  // Get all logs for weekly calculation
  const weekStart = last7Days[0];
  //get all comelete logs
  const allLogs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.completed, true),
  });

  // Filter logs for habits and for current user
  const userLogs = allLogs.filter(log => habitIds.includes(log.habitId));

  // Weekly completion rate
  const weeklyLogs = userLogs.filter(
    log => log.date >= weekStart && log.date <= today
  );
  const weeklyPossible = userHabits.length * 7;
  const weeklyCompletionRate = weeklyPossible > 0 
    ? Math.round((weeklyLogs.length / weeklyPossible) * 100)
    : 0;

  // Monthly completion rate
  const monthStart = last30Days[0];
  const monthlyLogs = userLogs.filter(
    log => log.date >= monthStart && log.date <= today
  );
  const monthlyPossible = userHabits.length * 30;
  const monthlyCompletionRate = monthlyPossible > 0
    ? Math.round((monthlyLogs.length / monthlyPossible) * 100)
    : 0;

  // Best streak across all habits (best longestStreak of all habits)
  const bestStreak = Math.max(...userHabits.map(h => h.longestStreak), 0);

  // Total completions ever
  const totalCompletions = userLogs.length;

  return {
    totalHabits: userHabits.length,
    completedToday,
    totalToday: userHabits.length,
    bestStreak,
    totalCompletions,
    weeklyCompletionRate,
    monthlyCompletionRate,
  };
}

// ============================================================
// GET DAILY STATS FOR CHART
// ============================================================

export async function getDailyStats(days: number = 7): Promise<DailyStats[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  const dateRange = getLastNDays(days);
  const today = getTodayDate();

  // Get all active habits of cuurent user
  const userHabits = await db.query.habits.findMany({
    where: and(
      eq(habits.userId, user.id),
      eq(habits.isActive, true)
    ),
  });

  if (userHabits.length === 0) {
    return dateRange.map(date => ({
      date,
      completed: 0,
      total: 0,
      percentage: 0,
    }));
  }

  //get habitsId and put it in array
  const habitIds = userHabits.map(h => h.id);
  //get the number of active habits of this user
  const totalHabits = userHabits.length;

  // Get all logs and comleted
  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.completed, true),
  });

  // we get all logs but her we filter to just get the logs of this user and its habits i mean the cuurent user
  const relevantLogs = logs.filter(
    log => habitIds.includes(log.habitId) && //habitsId id array of id of habits and complete and fir cuurent user
           dateRange.includes(log.date)//daterange is array that store array
  );

  // Group by date
  const logsByDate = new Map<string, number>();
  for (const log of relevantLogs) {
    logsByDate.set(log.date, (logsByDate.get(log.date) || 0) + 1);
  }
  //[{date,logs},{....},{}]

  // Build stats array
  return dateRange.map(date => {
    const completed = logsByDate.get(date) || 0;
    return {
      date,
      completed,
      total: totalHabits,
      percentage: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0,
    };
  });
}

// ============================================================
// GET HABIT HEATMAP DATA
// ============================================================

export async function getHeatmapData(days: number = 30): Promise<{
  date: string;
  level: number; // 0-4 (0 = none, 4 = all completed)
}[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  const dateRange = getLastNDays(days);

  // Get all active habits count
  const userHabits = await db.query.habits.findMany({
    where: and(
      eq(habits.userId, user.id),
      eq(habits.isActive, true)
    ),
  });

  if (userHabits.length === 0) {
    return dateRange.map(date => ({ date, level: 0 }));
  }

  const habitIds = userHabits.map(h => h.id);
  const totalHabits = userHabits.length;

  // Get all completed logs
  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.completed, true),
  });

  // Filter and count by date
  const completionsByDate = new Map<string, number>();
  for (const log of logs) {
    if (habitIds.includes(log.habitId) && dateRange.includes(log.date)) {
      completionsByDate.set(log.date, (completionsByDate.get(log.date) || 0) + 1);
    }
  }

  // Convert to levels (0-4)
  return dateRange.map(date => {
    const completed = completionsByDate.get(date) || 0;
    const percentage = (completed / totalHabits) * 100;
    
    let level = 0;
    if (percentage > 0 && percentage < 25) level = 1;
    else if (percentage >= 25 && percentage < 50) level = 2;
    else if (percentage >= 50 && percentage < 75) level = 3;
    else if (percentage >= 75) level = 4;
    
    return { date, level };
  });
}

// ============================================================
// GET HABITS WITH DETAILED STATS
// ============================================================

export async function getHabitsWithDetailedStats(): Promise<HabitWithStats[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  const last30Days = getLastNDays(30);

  // Get habits with their logs
  const userHabits = await db.query.habits.findMany({
    where: and(
      eq(habits.userId, user.id),
      eq(habits.isActive, true)
    ),
    with: {
      logs: {
        orderBy: (logs, { desc }) => [desc(logs.date)],
      },
    },
  });

  return userHabits.map(habit => {
    // Get logs for last 30 days
    const recentLogs = habit.logs.filter(log => last30Days.includes(log.date));
    
    // Build last30Days array
    const completedDates = new Set(
      recentLogs.filter(l => l.completed).map(l => l.date)
    );
    
    const last30DaysStatus = last30Days.map(date => completedDates.has(date));
    
    // Calculate completion rate
    const totalCompletions = habit.logs.filter(l => l.completed).length;
    const recentCompletions = recentLogs.filter(l => l.completed).length;
    const completionRate = last30Days.length > 0
      ? Math.round((recentCompletions / last30Days.length) * 100)
      : 0;

    return {
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      totalCompletions,
      completionRate,
      last30Days: last30DaysStatus,
    };
  });
}

// ============================================================
// GET BEST PERFORMING HABITS
// ============================================================

export async function getBestHabits(limit: number = 3) {
  const user = await getOrCreateUser();
  if (!user) return [];

  const userHabits = await db.query.habits.findMany({
    where: and(
      eq(habits.userId, user.id),
      eq(habits.isActive, true)
    ),
    orderBy: [desc(habits.currentStreak)],
    limit,
  });

  return userHabits;
}