// src/lib/actions/habits.ts

"use server";

/**
 * "use server" directive tells Next.js:
 * - These functions run ONLY on the server
 * - They can access database directly
 * - They can be called from client components
 * - Form data is automatically serialized
 */

import { db } from "@/lib/db";
import { habits, habitLogs } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/user";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


import { getTodayDate } from "@/lib/utils/date";

// ============================================================
// TYPES
// ============================================================

/**
 * Action Response Type
 * 
 * Every action returns this shape for consistent error handling.
 * Makes it easy to show success/error messages in UI.
 */
type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;  // Field-specific errors
};

/**
 * Habit Form Data
 * 
 * What we expect from the create/edit form
 */
type HabitFormData = {
  name: string;
  description?: string;
  category: "health" | "productivity" | "mindfulness" | "fitness" | "learning" | "other";
  frequency: "daily" | "weekly";
  targetFrequency: number;
  color: string;
  icon?: string;
};

// ============================================================
// VALIDATION
// ============================================================

/**
 * Validate Habit Data
 * 
 * WHY VALIDATE ON SERVER?
 * - Client validation can be bypassed
 * - Server is the last line of defense
 * - Ensures data integrity
 * 
 * We keep it simple - you can use Zod for more complex validation
 */
function validateHabit(data: HabitFormData): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = ["Habit name is required"];
  } else if (data.name.length > 100) {
    errors.name = ["Habit name must be less than 100 characters"];
  }

  // Target frequency validation
  if (data.targetFrequency < 1 || data.targetFrequency > 10) {
    errors.targetFrequency = ["Target must be between 1 and 10"];
  }

  // Color validation (hex format)
  if (!/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
    errors.color = ["Invalid color format"];
  }

  return errors;
}

// ============================================================
// CREATE HABIT
// ============================================================

/**
 * Create a new habit
 * 
 * @param formData - Form data from the habit form
 * @returns ActionResponse with success/error info
 */
export async function createHabit(formData: FormData): Promise<ActionResponse> {
  try {
    // Step 1: Get current user
    const user = await getOrCreateUser();
    
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to create a habit",
      };
    }

    // Step 2: Extract form data
    const data: HabitFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      category: formData.get("category") as HabitFormData["category"],
      frequency: formData.get("frequency") as HabitFormData["frequency"],
      targetFrequency: parseInt(formData.get("targetFrequency") as string) || 1,
      color: formData.get("color") as string || "#6366f1",
      icon: formData.get("icon") as string || undefined,
    };

    // Step 3: Validate
    const errors = validateHabit(data);
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      };
    }

    // Step 4: Insert into database
    await db.insert(habits).values({
      userId: user.id,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      category: data.category,
      frequency: data.frequency,
      targetFrequency: data.targetFrequency,
      color: data.color,
      icon: data.icon || null,
    });

    // Step 5: Revalidate cache
    // This tells Next.js to refresh the data on these pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/habits");

    return {
      success: true,
      message: "Habit created successfully!",
    };

  } catch (error) {
    console.error("Error creating habit:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// ============================================================
// READ HABITS
// ============================================================

/**
 * Get all habits for current user
 */
export async function getHabits() {
  const user = await getOrCreateUser();
  
  if (!user) {
    return [];
  }

  const userHabits = await db.query.habits.findMany({
    where: and(
      eq(habits.userId, user.id),
      eq(habits.isActive, true)  // Only active habits
    ),
    orderBy: [desc(habits.createdAt)],
  });

  return userHabits;
}

/**
 * Get a single habit by ID
 * 
 * WHY CHECK userId?
 * - Security! Prevent users from accessing other users' habits
 * - Even if someone guesses an ID, they can't see it
 */
export async function getHabitById(habitId: string) {
  const user = await getOrCreateUser();
  
  if (!user) {
    return null;
  }

  const habit = await db.query.habits.findFirst({
    where: and(
      eq(habits.id, habitId),
      eq(habits.userId, user.id)  // Security check!
    ),
  });

  return habit;
}

/**
 * Get habit with its logs
 * 
 * Useful for viewing habit details with history
 */
export async function getHabitWithLogs(habitId: string) {
  const user = await getOrCreateUser();
  
  if (!user) {
    return null;
  }

  const habit = await db.query.habits.findFirst({
    where: and(
      eq(habits.id, habitId),
      eq(habits.userId, user.id)
    ),
    with: {
      logs: {
        orderBy: (logs, { desc }) => [desc(logs.date)],
        limit: 30,  // Last 30 days
      },
    },
  });

  return habit;
}

// ============================================================
// UPDATE HABIT
// ============================================================

/**
 * Update an existing habit
 */
export async function updateHabit(
  habitId: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return {
        success: false,
        message: "You must be logged in",
      };
    }

    // Verify ownership
    const existingHabit = await db.query.habits.findFirst({
      where: and(
        eq(habits.id, habitId),
        eq(habits.userId, user.id)
      ),
    });

    if (!existingHabit) {
      return {
        success: false,
        message: "Habit not found",
      };
    }

    // Extract and validate data
    const data: HabitFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      category: formData.get("category") as HabitFormData["category"],
      frequency: formData.get("frequency") as HabitFormData["frequency"],
      targetFrequency: parseInt(formData.get("targetFrequency") as string) || 1,
      color: formData.get("color") as string || "#6366f1",
      icon: formData.get("icon") as string || undefined,
    };

    const errors = validateHabit(data);
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      };
    }

    // Update in database
    await db
      .update(habits)
      .set({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        category: data.category,
        frequency: data.frequency,
        targetFrequency: data.targetFrequency,
        color: data.color,
        icon: data.icon || null,
        updatedAt: new Date(),
      })
      .where(eq(habits.id, habitId));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/habits");
    revalidatePath(`/dashboard/habits/${habitId}`);

    return {
      success: true,
      message: "Habit updated successfully!",
    };

  } catch (error) {
    console.error("Error updating habit:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// ============================================================
// DELETE HABIT (Soft Delete)
// ============================================================

/**
 * Delete a habit (soft delete)
 * 
 * WHY SOFT DELETE?
 * - Preserves history and data
 * - User can potentially recover
 * - Better for analytics
 * 
 * We set isActive = false instead of actually deleting
 */
export async function deleteHabit(habitId: string): Promise<ActionResponse> {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return {
        success: false,
        message: "You must be logged in",
      };
    }

    // Verify ownership
    const existingHabit = await db.query.habits.findFirst({
      where: and(
        eq(habits.id, habitId),
        eq(habits.userId, user.id)
      ),
    });

    if (!existingHabit) {
      return {
        success: false,
        message: "Habit not found",
      };
    }

    // Soft delete - set isActive to false
    await db
      .update(habits)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(habits.id, habitId));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/habits");

    return {
      success: true,
      message: "Habit deleted successfully",
    };

  } catch (error) {
    console.error("Error deleting habit:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// ============================================================
// ARCHIVE/RESTORE HABIT
// ============================================================

/**
 * Toggle habit active status
 * 
 * Useful for temporarily pausing habits
 */
export async function toggleHabitActive(habitId: string): Promise<ActionResponse> {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return { success: false, message: "You must be logged in" };
    }

    const existingHabit = await db.query.habits.findFirst({
      where: and(
        eq(habits.id, habitId),
        eq(habits.userId, user.id)
      ),
    });

    if (!existingHabit) {
      return { success: false, message: "Habit not found" };
    }

    await db
      .update(habits)
      .set({
        isActive: !existingHabit.isActive,
        updatedAt: new Date(),
      })
      .where(eq(habits.id, habitId));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/habits");

    return {
      success: true,
      message: existingHabit.isActive ? "Habit archived" : "Habit restored",
    };

  } catch (error) {
    console.error("Error toggling habit:", error);
    return { success: false, message: "Something went wrong" };
  }
}







// ============================================================
// CHECK-IN ACTIONS
// ============================================================

/**
 * Toggle habit completion for a specific date
 * 
 * This is the main check-in function:
 * - If not completed → mark as completed
 * - If completed → mark as not completed (undo)
 */
export async function toggleHabitCompletion(
  habitId: string,
  date: string = getTodayDate()
): Promise<ActionResponse> {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return { success: false, message: "You must be logged in" };
    }

    // Verify habit belongs to user
    const habit = await db.query.habits.findFirst({
      where: and(
        eq(habits.id, habitId),
        eq(habits.userId, user.id)
      ),
    });

    if (!habit) {
      return { success: false, message: "Habit not found" };
    }

    // Check if log exists for this date
    const existingLog = await db.query.habitLogs.findFirst({
      where: and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.date, date)
      ),
    });

    if (existingLog) {
      // Toggle: if completed, uncomplete; if not completed, complete
      await db
        .update(habitLogs)
        .set({
          completed: !existingLog.completed,
          completedCount: existingLog.completed ? 0 : 1,
          updatedAt: new Date(),
        })
        .where(eq(habitLogs.id, existingLog.id));

      revalidatePath("/dashboard");
      
      return {
        success: true,
        message: existingLog.completed ? "Habit unchecked" : "Habit completed! 🎉",
      };
    } else {
      // Create new log entry
      await db.insert(habitLogs).values({
        habitId,
        date,
        completed: true,
        completedCount: 1,
      });

      revalidatePath("/dashboard");
      
      return {
        success: true,
        message: "Habit completed! 🎉",
      };
    }

  } catch (error) {
    console.error("Error toggling habit:", error);
    return { success: false, message: "Something went wrong" };
  }
}






/**
 * Get habits with their completion status for a specific date
 */
export async function getHabitsWithStatus(date: string = getTodayDate()) {
  const user = await getOrCreateUser();
  
  if (!user) {
    return [];
  }

  // Get all active habits
  const userHabits = await db.query.habits.findMany({
    where: and(
      eq(habits.userId, user.id),
      eq(habits.isActive, true)
    ),
    orderBy: [desc(habits.createdAt)],
  });

  // Get logs for the specified date
  const logs = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.date, date),
      // Only get logs for user's habits
      // We filter after since Drizzle doesn't support complex subqueries easily
    ),
  });

  // Create a map of habitId -> log for quick lookup
  const logMap = new Map(logs.map(log => [log.habitId, log]));

  // Combine habits with their status
  const habitsWithStatus = userHabits.map(habit => ({
    ...habit,
    isCompletedToday: logMap.get(habit.id)?.completed || false,
    todayLog: logMap.get(habit.id) || null,
  }));

  return habitsWithStatus;
}








/**
 * Get completion stats for a date range
 */
export async function getCompletionStats(startDate: string, endDate: string) {
  const user = await getOrCreateUser();
  
  if (!user) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  const userHabits = await db.query.habits.findMany({
    where: and(
      eq(habits.userId, user.id),
      eq(habits.isActive, true)
    ),
  });

  const habitIds = userHabits.map(h => h.id);
  
  if (habitIds.length === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  const logs = await db.query.habitLogs.findMany({
    where: and(
      eq(habitLogs.completed, true),
      // Date range filtering would go here
      // For now, we filter in JS
    ),
  });

  // Filter logs for user's habits and date range
  const relevantLogs = logs.filter(
    log => 
      habitIds.includes(log.habitId) && 
      log.date >= startDate && 
      log.date <= endDate
  );

  const completed = relevantLogs.length;
  // For daily habits, total = habits × days in range
  const daysDiff = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const total = habitIds.length * daysDiff;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percentage };
}








/**
 * Add note to a habit log
 */
export async function addNoteToLog(
  habitId: string,
  date: string,
  note: string
): Promise<ActionResponse> {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return { success: false, message: "You must be logged in" };
    }

    // Verify ownership
    const habit = await db.query.habits.findFirst({
      where: and(
        eq(habits.id, habitId),
        eq(habits.userId, user.id)
      ),
    });

    if (!habit) {
      return { success: false, message: "Habit not found" };
    }

    // Find or create log
    const existingLog = await db.query.habitLogs.findFirst({
      where: and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.date, date)
      ),
    });

    if (existingLog) {
      await db
        .update(habitLogs)
        .set({ note, updatedAt: new Date() })
        .where(eq(habitLogs.id, existingLog.id));
    } else {
      await db.insert(habitLogs).values({
        habitId,
        date,
        completed: false,
        completedCount: 0,
        note,
      });
    }

    revalidatePath("/dashboard");
    
    return { success: true, message: "Note saved!" };

  } catch (error) {
    console.error("Error adding note:", error);
    return { success: false, message: "Something went wrong" };
  }
}




