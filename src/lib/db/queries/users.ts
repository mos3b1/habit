// src/lib/db/queries/users.ts

/**
 * User Database Queries
 * 
 * Centralized functions for user-related database operations.
 * Benefits:
 * - Reusable across the app
 * - Easy to test
 * - Single place to update if logic changes
 */

import { eq } from 'drizzle-orm';
import { db, users, NewUser, User } from '..';

/**
 * Find a user by their Clerk ID
 * Used after authentication to get our user record
 */
export async function getUserByClerkId(
  clerkId: string
): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  
  return result[0];
}

/**
 * Create a new user
 * Called when a new user signs up via Clerk
 */
export async function createUser(userData: NewUser): Promise<User> {
  const result = await db
    .insert(users)
    .values(userData)
    .returning(); // Return the created user
  
  return result[0];
}

/**
 * Get or create user
 * Useful for ensuring a user exists in our DB
 */
export async function getOrCreateUser(
  clerkId: string,
  userData: Omit<NewUser, 'clerkId'>
): Promise<User> {
  // Try to find existing user
  const existingUser = await getUserByClerkId(clerkId);
  if (existingUser) {
    return existingUser;
  }
  
  // Create new user
  return createUser({ ...userData, clerkId });
}

/**
 * Update user timezone
 */
export async function updateUserTimezone(
  userId: string,
  timezone: string
): Promise<void> {
  await db
    .update(users)
    .set({ 
      timezone, 
      updatedAt: new Date() 
    })
    .where(eq(users.id, userId));
}