// src/lib/user.ts

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET OR CREATE USER
 * 
 * This is our simple solution instead of webhooks!
 * 
 * How it works:
 * 1. Get current user from Clerk
 * 2. Check if user exists in our database
 * 3. If NO → Create them
 * 4. If YES → Return existing user
 * 
 * Call this on any protected page to ensure user exists in DB.
 */
export async function getOrCreateUser() {
  // Step 1: Get user from Clerk
  const clerkUser = await currentUser();
  
  // Not logged in
  if (!clerkUser) {
    return null;
  }

  // Step 2: Check if user exists in our database
  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  // Step 3: If exists, return them
  if (existingUser) {
    return existingUser;
  }

  // Step 4: If not, create them
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  
  if (!email) {
    throw new Error("User has no email address");
  }

  const [newUser] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email: email,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
      imageUrl: clerkUser.imageUrl || null,
      timezone: "UTC",
    })
    .returning();

  console.log("✅ New user created:", email);
  
  return newUser;
}

/**
 * GET USER WITH HABITS
 * 
 * Same as above, but also fetches user's habits.
 * Useful for dashboard pages.
 */
export async function getUserWithHabits() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return null;
  }

  // First ensure user exists
  await getOrCreateUser();

  // Then fetch with habits
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
    with: {
      habits: {
        where: (habits, { eq }) => eq(habits.isActive, true),
        orderBy: (habits, { desc }) => [desc(habits.createdAt)],
      },
    },
  });

  return user;
}