// src/lib/user.ts

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser() {
  try {
    // Step 1: Get user from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      
      return null;
    }

  

    // Step 2: Check if user exists
    let existingUser;
    try {
      existingUser = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkUser.id),
      });
     
    } catch (queryError) {
     
      throw queryError;
    }

    // Step 3: If exists, return
    if (existingUser) {
      
      return existingUser;
    }

    // Step 4: Create new user
   
    
    const email = clerkUser.emailAddresses[0]?.emailAddress;
   
    
    if (!email) {
      throw new Error("User has no email address");
    }

    const userData = {
      clerkId: clerkUser.id,
      email: email,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
      imageUrl: clerkUser.imageUrl || null,
      timezone: "UTC",
    };
    
   

    try {
      const [newUser] = await db
        .insert(users)
        .values(userData)
        .returning();

     
      return newUser;
      
    } catch (insertError: any) {
      // Log the REAL error
     
      
      // If it's a duplicate key error, try to find the existing user
      if (insertError.message?.includes("duplicate") || 
          insertError.message?.includes("unique") ||
          insertError.cause?.message?.includes("duplicate")) {
       
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
        if (existingUser) {
          return existingUser;
        }
      }
      
      throw insertError;
    }

  } catch (error: any) {
    
    throw error;
  }
}

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


