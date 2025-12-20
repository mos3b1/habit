// src/app/(dashboard)/dashboard/page.tsx

import Link from "next/link";
import { getHabitsWithStatus, getCompletionStats } from "@/lib/actions/habits";
import { getOrCreateUser } from "@/lib/user";
import { redirect } from "next/navigation";
import {
  getTodayDate,
  getLastNDays,
  formatDateDisplay,
} from "@/lib/utils/date";
import { TodayHabits } from "@/component/habits/today-habits";
import { DateNavigator } from "@/component/habits/date-navigator";
import { WeekOverview } from "@/component/habits/week-overview";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  //check if have user logged in
  const user = await getOrCreateUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Get date from URL or use today
  const params = await searchParams;
  const selectedDate = params.date || getTodayDate();

  // Get habits with their status for the selected date
  const habits = await getHabitsWithStatus(selectedDate);

  // Calculate stats
  const completedToday = habits.filter((h) => h.isCompletedToday).length;
  const totalHabits = habits.length;

  // Calculate best streak across all habits
  const bestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);

  // Calculate total current streak days
  const totalStreakDays = habits.reduce((sum, h) => sum + h.currentStreak, 0);

  // Get week completion data for overview
  const last7Days = getLastNDays(7);
  const weekData: Record<string, { completed: number; total: number }> = {};

  // For now, just show today's data - we'll optimize this later
  weekData[selectedDate] = { completed: completedToday, total: totalHabits };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, {user.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-indigo-100">{formatDateDisplay(selectedDate)}</p>
          </div>

          {/* Quick Add Button */}
          <Link
            href="/dashboard/habits/new"
            className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Habit
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="📝"
          label="Active Habits"
          value={totalHabits.toString()}
          color="blue"
        />
        <StatCard
          icon="✅"
          label="Completed Today"
          value={`${completedToday}/${totalHabits}`}
          color={
            completedToday === totalHabits && totalHabits > 0 ? "green" : "gray"
          }
        />
        <StatCard
          icon="🔥"
          label="Total Streak Days"
          value={totalStreakDays.toString()}
          color="orange"
        />
        <StatCard
          icon="🏆"
          label="Best Streak"
          value={`${bestStreak} days`}
          color="purple"
        />
      </div>

      {habits.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Best Performing Habit */}
          {(() => {
            const bestHabit = habits.reduce(
              (best, current) =>
                current.currentStreak > (best?.currentStreak || 0)
                  ? current
                  : best,
              habits[0]
            );

            if (!bestHabit || bestHabit.currentStreak === 0) return null;

            return (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                <h3 className="text-sm font-medium text-orange-800 mb-3">
                  🔥 Hottest Streak
                </h3>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${bestHabit.color}20` }}
                  >
                    {bestHabit.icon || "📌"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {bestHabit.name}
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {bestHabit.currentStreak} days
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Longest Streak Ever */}
          {(() => {
            const longestHabit = habits.reduce(
              (best, current) =>
                current.longestStreak > (best?.longestStreak || 0)
                  ? current
                  : best,
              habits[0]
            );

            if (!longestHabit || longestHabit.longestStreak === 0) return null;

            return (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-sm font-medium text-purple-800 mb-3">
                  🏆 Personal Best
                </h3>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${longestHabit.color}20` }}
                  >
                    {longestHabit.icon || "📌"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {longestHabit.name}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {longestHabit.longestStreak} days
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Date Navigator */}
      <DateNavigator currentDate={selectedDate} />

      {/* Week Overview */}
      <WeekOverview completionData={weekData} />

      {/* Today's Habits */}
      <TodayHabits habits={habits} date={selectedDate} />
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: "blue" | "green" | "orange" | "purple" | "gray";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
    gray: "bg-gray-50 text-gray-700",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
