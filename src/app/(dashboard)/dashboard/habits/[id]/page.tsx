// src/app/(dashboard)/dashboard/habits/[id]/page.tsx

import Link from "next/link";
import { getHabitWithLogs } from "@/lib/actions/habits";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * View Habit Details Page
 * 
 * Shows:
 * - Habit info
 * - Recent activity
 * - Streak information
 */
export default async function HabitDetailPage({ params }: Props) {
  const { id } = await params;
  const habit = await getHabitWithLogs(id);

  if (!habit) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/habits"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Habits
      </Link>

      {/* Habit Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${habit.color}20` }}
            >
              {habit.icon || "📌"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{habit.name}</h1>
              <p className="text-gray-500">
                {habit.frequency === "daily" ? "Daily habit" : `${habit.targetFrequency}x per week`}
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/habits/${habit.id}/edit`}
            className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
        </div>

        {/* Description */}
        {habit.description && (
          <p className="text-gray-600 mb-6">{habit.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{habit.currentStreak}</p>
            <p className="text-sm text-orange-700">Current Streak</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{habit.longestStreak}</p>
            <p className="text-sm text-purple-700">Longest Streak</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{habit.logs?.length || 0}</p>
            <p className="text-sm text-green-700">Total Completions</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Recent Activity</h2>
          {habit.logs && habit.logs.length > 0 ? (
            <div className="space-y-2">
              {habit.logs.slice(0, 7).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-600">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className={log.completed ? "text-green-600" : "text-gray-400"}>
                    {log.completed ? "✅ Completed" : "⭕ Missed"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No activity yet. Start tracking today!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}