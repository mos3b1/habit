// src/lib/auth.ts

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";


export async function getCurrentUser() {
  const { userId } = await auth();

  // Not authenticated
  if (!userId) {
    return null;
  }

  // Find user in our database
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  return user;
}

/**
 * Get Current User (Required)
 * 
 * Same as above, but throws error if not found.
 * Use this in protected routes where user MUST exist.
 */
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found. Please sign in.");
  }

  return user;
}


export async function getCurrentUserWithHabits() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    with: {
      habits: {
        where: (habits, { eq }) => eq(habits.isActive, true),
        orderBy: (habits, { desc }) => [desc(habits.createdAt)],
      },
    },
  });

  return user;
}

/**
 * Sync User to Database
 * 
 * Alternative to webhooks - sync on first request.
 * 
 * WHY HAVE BOTH?
 * - Webhooks are more reliable (background sync)
 * - This is a fallback if webhook fails
 * - Also useful for development
 */
export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  // Check if user exists in our database
  let user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  // If not, create them
  if (!user) {
    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    );

    if (!primaryEmail) {
      throw new Error("User has no primary email");
    }

    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        email: primaryEmail.emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
        imageUrl: clerkUser.imageUrl || null,
      })
      .returning();

    user = newUser;
  }

  return user;
}