// src/lib/db/schema.ts

/**
 * DATABASE SCHEMA
 * 
 * This is the "blueprint" of our database. It defines:
 * - What tables exist
 * - What columns each table has
 * - Data types and constraints
 * - Relationships between tables
 * 
 * Think of it like TypeScript interfaces, but for your database!
 */

import {
  pgTable,        // Function to create PostgreSQL tables
  text,           // Variable-length string
  timestamp,      // Date and time
  boolean,        // True/false
  uuid,           // Universally Unique Identifier
  integer,        // Whole numbers
  date,           // Date only (no time)
  pgEnum,         // PostgreSQL custom types
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


// ============================================================
// ENUMS (Custom Types)
// ============================================================

/**
 * Habit Frequency Enum
 * 
 * Why use an enum instead of a string?
 * - Database enforces valid values (can't accidentally save "daly")
 * - Self-documenting code
 * - TypeScript knows the exact possible values
 * 
 * We start simple - you can add 'weekly', 'custom' later
 */
export const frequencyEnum = pgEnum('frequency', ['daily', 'weekly']);

/**
 * Habit Category Enum
 * 
 * Predefined categories help with:
 * - Filtering/grouping habits
 * - Consistent UI (icons, colors per category)
 * - Analytics ("most habits are health-related")
 */
export const categoryEnum = pgEnum('category', [
  'health',      // Exercise, sleep, water intake
  'productivity',// Work tasks, learning
  'mindfulness', // Meditation, journaling
  'fitness',     // Specific workouts
  'learning',    // Reading, courses
  'other'        // Catch-all
]);
// Add this enum at the top with other enums
// export const subscriptionStatusEnum = pgEnum('subscription_status', [
//   'free',
//   'pro',
//   'canceled',
//   'past_due',
// ]);
// ============================================================
// USERS TABLE
// ============================================================

/**
 * Users Table
 * 
 * Stores basic user information. We'll sync this with Clerk
 * (our auth provider) in Step 2.
 * 
 * Why have our own users table when Clerk manages users?
 * - Store app-specific data (preferences, settings)
 * - Create relationships with other tables
 * - Don't depend on external service for basic queries
 */
export const users = pgTable('users', {
  // ... your existing columns stay the same ...
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').unique().notNull(),
  name: text('name'),
  imageUrl: text('image_url'),
  timezone: text('timezone').default('UTC').notNull(),
  
  // ========================================
  // ADD THESE NEW COLUMNS:
  // ========================================
  
  // Is user on "free" or "pro" plan?
  plan: text('plan').default('free').notNull(),
  
  // Stripe customer ID (for managing payments)
  stripeCustomerId: text('stripe_customer_id'),
  
  // Stripe subscription ID
  stripeSubscriptionId: text('stripe_subscription_id'),
  
  // ========================================
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// ============================================================
// HABITS TABLE
// ============================================================

/**
 * Habits Table
 * 
 * A habit is something a user wants to do regularly.
 * This table stores the habit definitions, not the daily logs.
 */
export const habits = pgTable('habits', {
  /**
   * Primary Key
   */
  id: uuid('id').primaryKey().defaultRandom(),

  /**
   * Foreign Key: userId
   * 
   * Links this habit to a specific user.
   * .references() creates a foreign key constraint:
   * - Database ensures userId exists in users table
   * - Prevents orphaned habits (habit without a user)
   */
  userId: uuid('user_id')
    .references(() => users.id, { 
      onDelete: 'cascade'  // If user is deleted, delete their habits too
    })
    .notNull(),

  /**
   * Habit name
   * What the user calls this habit
   * e.g., "Morning Run", "Read 30 minutes"
   */
  name: text('name').notNull(),

  /**
   * Description (optional)
   * Extra details about the habit
   * e.g., "Run at least 2km around the park"
   */
  description: text('description'),

  /**
   * Category
   * For grouping and UI purposes
   */
  category: categoryEnum('category').default('other').notNull(),

  /**
   * Frequency
   * How often should this habit be done?
   */
  frequency: frequencyEnum('frequency').default('daily').notNull(),

  /**
   * Target per period
   * 
   * For 'daily' frequency: target per day (usually 1)
   * For 'weekly' frequency: target per week (e.g., 3 = 3 times a week)
   * 
   * This allows "Exercise 3 times per week" type habits
   */
  targetFrequency: integer('target_frequency').default(1).notNull(),

  /**
   * Color for UI
   * 
   * Users can personalize their habits with colors
   * Stored as hex code (e.g., "#FF5733")
   */
  color: text('color').default('#6366f1').notNull(),

  /**
   * Emoji icon (optional)
   * 
   * Quick visual identifier
   * e.g., "🏃" for running, "📚" for reading
   */
  icon: text('icon'),

  /**
   * Active status
   * 
   * Instead of deleting habits (which would lose history),
   * we set isActive to false. This way:
   * - Past logs are preserved
   * - User can reactivate later
   * - We can filter active habits in UI
   */
  isActive: boolean('is_active').default(true).notNull(),

  /**
   * Streak tracking
   * 
   * We store current streak in the habit itself for quick access.
   * Alternative: Calculate from logs every time (slower but always accurate)
   * 
   * We'll update this when logging habits (Step 5)
   */
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),

  /**
   * Timestamps
   */
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},(table)=> ({
  userIdIdx: index('user_id_idx').on(table.userId),
}));

// ============================================================
// HABIT LOGS TABLE
// ============================================================

/**
 * Habit Logs Table
 * 
 * Records each completion (or skip) of a habit.
 * This is the "source of truth" for all habit activity.
 * 
 * One row = one habit on one day
 */
export const habitLogs = pgTable('habit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),

  /**
   * Foreign Key: habitId
   * Links to the habit this log is for
   */
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),

  /**
   * Date of this log
   * 
   * Using 'date' type (not timestamp) because:
   * - We only care about the day, not exact time
   * - Easier to query "all logs for 2024-01-15"
   * - No timezone confusion in the database
   * 
   * ⚠️ We'll handle timezone conversion in the application
   */
  date: date('date').notNull(),

  /**
   * Completion status
   * Did the user complete the habit this day?
   */
  completed: boolean('completed').default(false).notNull(),

  /**
   * Completion count
   * 
   * For habits that can be done multiple times per day
   * e.g., "Drink 8 glasses of water" - count how many
   * 
   * Default is 0, set to 1 (or more) when completed
   */
  completedCount: integer('completed_count').default(0).notNull(),

  /**
   * Optional note
   * 
   * Users can add context to their log
   * e.g., "Ran 5km today - new personal best!"
   */
  note: text('note'),

  /**
   * When was this log entry created?
   */
  createdAt: timestamp('created_at').defaultNow().notNull(),

  /**
   * When was it last modified?
   * (e.g., user unchecked and rechecked)
   */
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Add index for faster queries
  habitIdIdx: index('habit_id_idx').on(table.habitId),
  
  // Prevent duplicate logs
  uniqueLog: unique('unique_habit_date').on(table.habitId, table.date),
}));

// ============================================================
// RELATIONS
// ============================================================

/**
 * Relations
 * 
 * These don't create database constraints (we did that with .references())
 * Instead, they tell Drizzle how tables connect, enabling features like:
 * 
 * const userWithHabits = await db.query.users.findFirst({
 *   with: { habits: true }  // Automatically includes all user's habits!
 * });
 */

/**
 * User Relations
 * A user has many habits (one-to-many)
 */
export const usersRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}));

/**
 * Habit Relations
 * - A habit belongs to one user (many-to-one)
 * - A habit has many logs (one-to-many)
 */
export const habitsRelations = relations(habits, ({ one, many }) => ({
  // The 'one' relation - this habit belongs to one user
  user: one(users, {
    fields: [habits.userId],      // Our foreign key
    references: [users.id],        // The primary key it references
  }),
  // The 'many' relation - this habit has many logs
  logs: many(habitLogs),
}));

/**
 * Habit Log Relations
 * A log belongs to one habit (many-to-one)
 */
export const habitLogsRelations = relations(habitLogs, ({ one }) => ({
  habit: one(habits, {
    fields: [habitLogs.habitId],
    references: [habits.id],
  }),
}));

// ============================================================
// TYPE EXPORTS
// ============================================================

/**
 * TypeScript Types from Schema
 * 
 * Drizzle generates types from our schema automatically!
 * This ensures our TypeScript code matches our database exactly.
 * 
 * $inferSelect = type for reading data (SELECT)
 * $inferInsert = type for creating data (INSERT)
 */

// User types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Habit types
export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;

// Habit Log types
export type HabitLog = typeof habitLogs.$inferSelect;
export type NewHabitLog = typeof habitLogs.$inferInsert;