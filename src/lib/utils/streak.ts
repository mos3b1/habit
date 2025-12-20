// src/lib/utils/streak.ts

/**
 * STREAK CALCULATION UTILITIES
 * 
 * This handles all the logic for calculating streaks.
 * 
 * KEY CONCEPTS:
 * 1. Current streak = consecutive days ending at today/yesterday
 * 2. If today is not done, we still count yesterday's streak
 * 3. Missing a single day breaks the streak
 * 4. Longest streak is the maximum ever achieved
 */

import { formatDate, getTodayDate, parseDate } from "./date";

type HabitLog = {
  date: string;
  completed: boolean;
};

/**
 * Calculate current streak from habit logs
 * 
 * ALGORITHM:
 * 1. Sort logs by date (newest first)
 * 2. Start from today (or yesterday if today not done)
 * 3. Count consecutive completed days going backwards
 * 4. Stop when we hit a gap or incomplete day
 * 
 * @param logs - Array of habit log entries
 * @returns Current streak count
 */
export function calculateCurrentStreak(logs: HabitLog[]): number {
  if (!logs || logs.length === 0) return 0;

  // Create a Set of completed dates for O(1) lookup
  const completedDates = new Set(
    logs
      .filter(log => log.completed)
      .map(log => log.date)
  );

  if (completedDates.size === 0) return 0;

  const today = getTodayDate();
  let streak = 0;
  let currentDate = today;

  // If today is not completed, start checking from yesterday
  // This allows the streak to continue even if user hasn't checked in yet today
  if (!completedDates.has(today)) {
    currentDate = getPreviousDate(today);
  }

  // Count consecutive days going backwards
  while (completedDates.has(currentDate)) {
    streak++;
    currentDate = getPreviousDate(currentDate);
  }

  return streak;
}

/**
 * Calculate longest streak ever achieved
 * 
 * ALGORITHM:
 * 1. Sort all completed dates
 * 2. Iterate through, counting consecutive days
 * 3. Track the maximum streak found
 * 
 * @param logs - Array of habit log entries
 * @returns Longest streak count
 */
export function calculateLongestStreak(logs: HabitLog[]): number {
  if (!logs || logs.length === 0) return 0;

  // Get only completed dates, sorted
  const completedDates = logs
    .filter(log => log.completed)
    .map(log => log.date)
    .sort();

  if (completedDates.length === 0) return 0;
  if (completedDates.length === 1) return 1;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = completedDates[i - 1];
    const currDate = completedDates[i];

    // Check if dates are consecutive
    if (isConsecutiveDay(prevDate, currDate)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      // Streak broken, reset
      currentStreak = 1;
    }
  }

  return longestStreak;
}

/**
 * Check if two dates are consecutive (one day apart)
 */
export function isConsecutiveDay(date1: string, date2: string): boolean {
  const nextDay = getNextDate(date1);
  return nextDay === date2;
}

/**
 * Get the previous date (YYYY-MM-DD format)
 */
export function getPreviousDate(dateString: string): string {
  const date = parseDate(dateString);
  date.setDate(date.getDate() - 1);
  return formatDate(date);
}

/**
 * Get the next date (YYYY-MM-DD format)
 */
export function getNextDate(dateString: string): string {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + 1);
  return formatDate(date);
}

/**
 * Calculate streak statistics
 * 
 * Returns all streak-related info in one call.
 * Efficient because we only iterate through logs once.
 */
export function calculateStreakStats(logs: HabitLog[]): {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
} {
  const currentStreak = calculateCurrentStreak(logs);
  const longestStreak = calculateLongestStreak(logs);
  const totalCompletions = logs.filter(l => l.completed).length;
  
  // Completion rate: completed / total logged days
  const completionRate = logs.length > 0 
    ? Math.round((totalCompletions / logs.length) * 100) 
    : 0;

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate,
  };
}

/**
 * Determine streak status for UI display
 */
export function getStreakStatus(currentStreak: number): {
  label: string;
  color: string;
  emoji: string;
} {
  if (currentStreak === 0) {
    return { label: "No streak", color: "gray", emoji: "💤" };
  }
  if (currentStreak < 3) {
    return { label: "Getting started", color: "blue", emoji: "🌱" };
  }
  if (currentStreak < 7) {
    return { label: "Building momentum", color: "green", emoji: "🌿" };
  }
  if (currentStreak < 14) {
    return { label: "On a roll!", color: "yellow", emoji: "🔥" };
  }
  if (currentStreak < 30) {
    return { label: "Impressive!", color: "orange", emoji: "⚡" };
  }
  if (currentStreak < 100) {
    return { label: "Incredible!", color: "red", emoji: "🏆" };
  }
  return { label: "Legendary!", color: "purple", emoji: "👑" };
}

/**
 * Get motivational message based on streak
 */
export function getStreakMessage(currentStreak: number, todayCompleted: boolean): string {
  if (currentStreak === 0) {
    return "Start your streak today! 💪";
  }
  
  if (!todayCompleted) {
    if (currentStreak === 1) {
      return "Complete today to keep your streak going!";
    }
    return `Don't break your ${currentStreak}-day streak! Complete today's habit.`;
  }

  // Today is completed
  switch (currentStreak) {
    case 1:
      return "Day 1 done! Come back tomorrow to build your streak! 🌱";
    case 3:
      return "3 days in a row! You're building a habit! 🌿";
    case 7:
      return "A whole week! You're on fire! 🔥";
    case 14:
      return "Two weeks strong! This is becoming second nature! ⚡";
    case 21:
      return "21 days! They say it takes 21 days to form a habit! 🎯";
    case 30:
      return "30-day streak! You're unstoppable! 🏆";
    case 50:
      return "50 days! Half way to 100! Keep going! 💫";
    case 100:
      return "100 DAYS! You're a habit master! 👑";
    default:
      if (currentStreak > 100) {
        return `${currentStreak} days! You're legendary! 👑`;
      }
      return `${currentStreak} days and counting! Keep it up! 🔥`;
  }
}