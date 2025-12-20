// src/app/(dashboard)/dashboard/habits/page.tsx

import Link from "next/link";
import { getHabits } from "@/lib/actions/habits";
import { HabitCard } from "@/component/habits/habit-card";

/**
 * Habits List Page
 * 
 * Shows all user's habits with ability to:
 * - View all habits
 * - Create new habit
 * - Filter by category (future improvement)
 */
export default async function HabitsPage() {
  const habits = await getHabits();//fetch all habits for the user

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
          <p className="text-gray-500">Manage and track your habits</p>
        </div>
        <Link
          href="/dashboard/habits/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Habit
        </Link>
      </div>

      {/* Habits Grid */}
      {habits.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No habits yet
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start building better habits today. Create your first habit and begin your journey!
          </p>
          <Link
            href="/dashboard/habits/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Habit
          </Link>
        </div>
      ) : (
        // Habits Grid
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {habits.length > 0 && (
        <div className="bg-white rounded-xl p-6 mt-8">
          <h2 className="font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-indigo-600">{habits.length}</p>
              <p className="text-sm text-gray-500">Active Habits</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {habits.reduce((sum, h) => sum + h.currentStreak, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Streak Days</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">
                {Math.max(...habits.map(h => h.longestStreak), 0)}
              </p>
              <p className="text-sm text-gray-500">Best Streak</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}