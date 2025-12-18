// src/lib/db/queries/habits.ts

/**
 * Habit Database Queries
 */

import { eq, and, desc } from 'drizzle-orm';
import { db, habits, NewHabit, Habit } from '..';

/**
 * Get all active habits for a user
 */
export async function getUserHabits(userId: string): Promise<Habit[]> {
  return db
    .select()
    .from(habits)
    .where(
      and(
        eq(habits.userId, userId),
        eq(habits.isActive, true)
      )
    )
    .orderBy(desc(habits.createdAt));
}

/**
 * Get a single habit by ID
 * Includes userId check for security (ensure user owns this habit)
 */
export async function getHabitById(
  habitId: string,
  userId: string
): Promise<Habit | undefined> {
  const result = await db
    .select()
    .from(habits)
    .where(
      and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      )
    )
    .limit(1);
  
  return result[0];
}

/**
 * Create a new habit
 */
export async function createHabit(habitData: NewHabit): Promise<Habit> {
  const result = await db
    .insert(habits)
    .values(habitData)
    .returning();
  
  return result[0];
}

/**
 * Update a habit
 */
export async function updateHabit(
  habitId: string,
  userId: string,
  updates: Partial<NewHabit>
): Promise<Habit | undefined> {
  const result = await db
    .update(habits)
    .set({ 
      ...updates, 
      updatedAt: new Date() 
    })
    .where(
      and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      )
    )
    .returning();
  
  return result[0];
}

/**
 * Soft delete a habit (set isActive to false)
 */
export async function deleteHabit(
  habitId: string,
  userId: string
): Promise<void> {
  await db
    .update(habits)
    .set({ 
      isActive: false, 
      updatedAt: new Date() 
    })
    .where(
      and(
        eq(habits.id, habitId),
        eq(habits.userId, userId)
      )
    );
}