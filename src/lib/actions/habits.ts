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
import { calculateCurrentStreak, calculateLongestStreak } from "@/lib/utils/streak";

import { getTodayDate, getWeekRange } from "@/lib/utils/date";


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
  success: boolean;//if true action was successful
  message: string;//user-friendly message
  errors?: Record<string, string[]>; //is can be string or array of strings
};

//this is the shape of data we expect from habit forms
type HabitFormData = {
  name: string;
  description?: string;//optional
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
    if (user.plan === "free") {
      // Count current active habits
      const currentHabits = await db.query.habits.findMany({
        where: and(
          eq(habits.userId, user.id),
          eq(habits.isActive, true)
        ),
      });

      if (currentHabits.length >= 3) {
        return {
          success: false,
          message: "Free plan allows only 3 habits. Upgrade to Pro for unlimited habits!",
        };
      }
    }

    //you get the form data from the form submission
    // Step 2: Extract data from form
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
// export async function toggleHabitCompletion(
//   habitId: string,
//   date: string = getTodayDate()
// ): Promise<ActionResponse> {
//   try {
//     const user = await getOrCreateUser();

//     if (!user) {
//       return { success: false, message: "You must be logged in" };
//     }

//     // get habits of cuurent user
//     const habit = await db.query.habits.findFirst({//get the just first habit
//       where: and(
//         eq(habits.id, habitId),//get specific habit
//         eq(habits.userId, user.id)//get user
//       ),
//     });

//     if (!habit) {
//       return { success: false, message: "Habit not found" };
//     }

//     // Check if log exists for this date
//     const existingLog = await db.query.habitLogs.findFirst({//get the firt log
//       where: and(
//         eq(habitLogs.habitId, habitId),//het logs belong for the habit
//         eq(habitLogs.date, date)//get the log of this day
//       ),
//     });

//     if (existingLog) {
//       // Toggle: if completed, uncomplete; if not completed, complete
//       await db
//         .update(habitLogs)//habitlog table
//         .set({
//           completed: !existingLog.completed,//reverse
//           completedCount: existingLog.completed ? 0 : 1,
//           updatedAt: new Date(),
//         })
//         .where(eq(habitLogs.id, existingLog.id));

//       revalidatePath("/dashboard");

//       return {
//         success: true,
//         message: existingLog.completed ? "Habit unchecked" : "Habit completed! 🎉",
//       };
//     } else {
//       // Create new log entry
//       await db.insert(habitLogs).values({
//         habitId,
//         date,
//         completed: true,
//         completedCount: 1,
//       });

//       revalidatePath("/dashboard");

//       return {
//         success: true,
//         message: "Habit completed! 🎉",
//       };
//     }

//   } catch (error) {
//     console.error("Error toggling habit:", error);
//     return { success: false, message: "Something went wrong" };
//   }
// }

//update version of function toggleHabitCompletion

/**
 * Toggle habit completion for a specific date
 * 
 * UPDATED: Now also updates streak after toggle!
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

    let isNowCompleted: boolean;

    if (existingLog) {
      // Toggle: if completed, uncomplete; if not completed, complete
      isNowCompleted = !existingLog.completed;

      await db
        .update(habitLogs)
        .set({
          completed: isNowCompleted,
          completedCount: isNowCompleted ? 1 : 0,
          updatedAt: new Date(),
        })
        .where(eq(habitLogs.id, existingLog.id));
    } else {
      // Create new log entry (completed)
      isNowCompleted = true;

      await db.insert(habitLogs).values({
        habitId,
        date,
        completed: true,
        completedCount: 1,
      });
    }

    // ✨ UPDATE STREAK AFTER TOGGLE
    await updateHabitStreak(habitId);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/habits");
    revalidatePath(`/dashboard/habits/${habitId}`);

    return {
      success: true,
      message: isNowCompleted ? "Habit completed! 🎉" : "Habit unchecked",
    };

  } catch (error) {

    return { success: false, message: "Something went wrong" };
  }
}




// Get habits + today status + weekly progress
export async function getHabitsWithStatus(date: string = getTodayDate()) {
  const user = await getOrCreateUser();
  if (!user) return [];

  // 1. Get all active habits for this user
  const userHabits = await db.query.habits.findMany({
    where: and(eq(habits.userId, user.id), eq(habits.isActive, true)),
  });

  if (userHabits.length === 0) return [];

  const habitIds = userHabits.map((h) => h.id);
  const habitIdSet = new Set(habitIds);

  // 2. Today logs (for isCompletedToday)
  const todayLogs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.date, date),
  });

  const todayLogMap = new Map<string, (typeof habitLogs.$inferSelect)>();
  for (const log of todayLogs) {
    if (habitIdSet.has(log.habitId)) {
      todayLogMap.set(log.habitId, log);
    }
  }

  // 3. Weekly logs (only completed = true)
  const { start: weekStart, end: weekEnd } = getWeekRange(date, 1); // Monday start

  // We fetch ALL logs, then filter in JS. Simpler for now.
  const allLogs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.completed, true),
  });

  const weeklyLogs = allLogs.filter(
    (log) =>
      habitIdSet.has(log.habitId) &&
      log.date >= weekStart &&
      log.date <= weekEnd
  );

  const weeklyCountMap = new Map<string, number>();
  for (const log of weeklyLogs) {
    weeklyCountMap.set(
      log.habitId,
      (weeklyCountMap.get(log.habitId) || 0) + 1
    );
  }

  // 4. Combine everything into one array
  const habitsWithStatus = userHabits.map((habit) => {
    const todayLog = todayLogMap.get(habit.id) || null;
    const isCompletedToday = !!todayLog?.completed;

    const weeklyCompletedCount = weeklyCountMap.get(habit.id) || 0;
    // For daily habits, weekly info is optional but still nice.
    const weeklyTarget =
      habit.frequency === "weekly" ? habit.targetFrequency : null;
    const isWeekGoalMet =
      habit.frequency === "weekly" && weeklyTarget
        ? weeklyCompletedCount >= weeklyTarget
        : null;

    return {
      ...habit,
      isCompletedToday,
      todayLog,
      weeklyCompletedCount,
      weeklyTarget,
      isWeekGoalMet,
    };
  });

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

  const habitIds = userHabits.map(h => h.id);//is gonna store like array inside habitsIds

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
      habitIds.includes(log.habitId) && //specifiq id
      log.date >= startDate && //specific date
      log.date <= endDate
  );

  const completed = relevantLogs.length;

  // this calculate the number of days in this range
  const daysDiff = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const total = habitIds.length * daysDiff;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percentage };//is retun number of active habit in this range,retunr the number of complete logs,return average
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

    return { success: false, message: "Something went wrong" };
  }
}



// ============================================================
// STREAK UPDATE FUNCTIONS
// ============================================================

/**
 * Recalculate and update streak for a specific habit
 * 
 * Called after any check-in to ensure streaks are accurate.
 */
async function updateHabitStreak(habitId: string): Promise<void> {
  // Get all logs for this habit
  const logs = await db.query.habitLogs.findMany({
    where: eq(habitLogs.habitId, habitId),
    orderBy: [desc(habitLogs.date)],
  });

  // Calculate streaks
  const currentStreak = calculateCurrentStreak(logs);
  const longestStreak = calculateLongestStreak(logs);

  // Get current habit to compare longest streak
  const habit = await db.query.habits.findFirst({
    where: eq(habits.id, habitId),
  });

  // Only update longest streak if new one is higher
  const newLongestStreak = Math.max(
    longestStreak,
    habit?.longestStreak || 0
  );

  // Update habit with new streak values
  await db
    .update(habits)
    .set({
      currentStreak,
      longestStreak: newLongestStreak,
      updatedAt: new Date(),
    })
    .where(eq(habits.id, habitId));
}



/**
 * Recalculate streaks for ALL user's habits
 * 
 * Useful for:
 * - Daily cron job to update streaks at midnight
 * - Fixing any streak inconsistencies
 * - After importing data
 */
export async function recalculateAllStreaks(): Promise<ActionResponse> {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return { success: false, message: "You must be logged in" };
    }

    // Get all user's habits
    const userHabits = await db.query.habits.findMany({
      where: eq(habits.userId, user.id),
    });

    // Update each habit's streak
    for (const habit of userHabits) {
      await updateHabitStreak(habit.id);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/habits");

    return {
      success: true,
      message: `Updated streaks for ${userHabits.length} habits`
    };

  } catch (error) {

    return { success: false, message: "Something went wrong" };
  }
}






// ============================================================
// GET HABIT WITH STREAK DETAILS
// ============================================================

/**
 * Get detailed streak information for a habit
 */
export async function getHabitStreakDetails(habitId: string) {
  const user = await getOrCreateUser();

  if (!user) {
    return null;
  }

  // Get habit with all logs
  const habit = await db.query.habits.findFirst({
    where: and(
      eq(habits.id, habitId),
      eq(habits.userId, user.id)
    ),
    with: {
      logs: {
        orderBy: (logs, { desc }) => [desc(logs.date)],
      },
    },
  });

  if (!habit) return null;

  // Calculate fresh streak stats
  const currentStreak = calculateCurrentStreak(habit.logs);
  const longestStreak = calculateLongestStreak(habit.logs);
  const totalCompletions = habit.logs.filter(l => l.completed).length;

  // Get today's status
  const today = getTodayDate();
  const todayLog = habit.logs.find(l => l.date === today);
  const isCompletedToday = todayLog?.completed || false;

  return {
    ...habit,
    currentStreak,
    longestStreak,
    totalCompletions,
    isCompletedToday,
    completionRate: habit.logs.length > 0
      ? Math.round((totalCompletions / habit.logs.length) * 100)
      : 0,
  };
}

