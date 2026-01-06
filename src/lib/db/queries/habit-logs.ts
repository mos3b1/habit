//this is folder is fro db quires functions

// src/lib/db/queries/habit-logs.ts

/**
 * Habit Log Database Queries
 */

import { eq, and, between, desc } from 'drizzle-orm';
import { db, habitLogs, NewHabitLog, HabitLog } from '..';

/**
 * Get logs for a habit within a date range
 */
export async function getHabitLogs(
  habitId: string,
  startDate: string,
  endDate: string
): Promise<HabitLog[]> {
  return db
    .select()
    .from(habitLogs)
    .where(
      and(
        eq(habitLogs.habitId, habitId),
        between(habitLogs.date, startDate, endDate)//the date of the habit log is between the start date and end date
      )
    )
    .orderBy(desc(habitLogs.date));
}

/**
 * Get a log for a specific habit on a specific date
 */
export async function getHabitLogForDate(
  habitId: string,
  date: string
): Promise<HabitLog | undefined> {
  const result = await db
    .select()
    .from(habitLogs)
    .where(
      and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.date, date)
      )
    )
    .limit(1);

  return result[0];
}

/**
 * Create or update a habit log
 * 
 * This is the core function for checking off habits.
 * If a log exists for this date, update it.
 * If not, create a new one.
 */
export async function upsertHabitLog(
  habitId: string,
  date: string,
  completed: boolean,
  note?: string
): Promise<HabitLog> {
  // Check if log exists
  const existingLog = await getHabitLogForDate(habitId, date);

  if (existingLog) {
    // Update existing log
    const result = await db
      .update(habitLogs)
      .set({
        completed,
        completedCount: completed ? 1 : 0,
        note,
        updatedAt: new Date(),
      })
      .where(eq(habitLogs.id, existingLog.id))
      .returning();

    return result[0];
  }

  // Create new log
  const result = await db
    .insert(habitLogs)
    .values({
      habitId,
      date,
      completed,
      completedCount: completed ? 1 : 0,
      note,
    })
    .returning();

  return result[0];
}