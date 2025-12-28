// src/app/(dashboard)/dashboard/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getHabitsWithStatus } from "@/lib/actions/habits";
import {
  getOverallStats,
  getDailyStats,
  getHeatmapData,
  getBestHabits,
} from "@/lib/actions/analytics";
import { getOrCreateUser } from "@/lib/user";
import { getTodayDate, formatDateDisplay } from "@/lib/utils/date";
import { StatsCards } from "@/component/dashboard/stats-cards";
import { WeeklyChart } from "@/component/dashboard/weekly-chart";
import { HabitHeatmap } from "@/component/dashboard/habit-heatmap";
import { StreakHighlights } from "@/component/dashboard/streak-highlights";
import { TodayHabits } from "@/component/habits/today-habits";
import { DateNavigator } from "@/component/habits/date-navigator";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const user = await getOrCreateUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Get date from URL or use today
  const params = await searchParams;
  const selectedDate = params.date || getTodayDate();

  // Fetch all data in parallel
  const [stats, dailyStats, heatmapData, bestHabits, habits] =
    await Promise.all([
      getOverallStats(),
      getDailyStats(7),
      getHeatmapData(30),
      getBestHabits(3),
      getHabitsWithStatus(selectedDate),
    ]);

  // Handle case where stats is null
  const safeStats = stats || {
    totalHabits: 0,
    completedToday: 0,
    totalToday: 0,
    bestStreak: 0,
    totalCompletions: 0,
    weeklyCompletionRate: 0,
    monthlyCompletionRate: 0,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-primary rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-foreground tracking-tight">
              Welcome back, {user.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-muted-foreground">{formatDateDisplay(selectedDate)}</p>
          </div>

          <Link
            href="/dashboard/habits/new"
            className="bg-secondary text-secondary-foreground backdrop-blur px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
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
      <StatsCards stats={safeStats} />

      {/* Charts Section */}
      {safeStats.totalHabits > 0 && (
        <>
          {/* Weekly Chart & Heatmap */}
          <div className="grid lg:grid-cols-2 gap-6">
            <WeeklyChart data={dailyStats} />
            <HabitHeatmap data={heatmapData} title="Last 30 Days" />
          </div>

          {/* Streak Highlights */}
          <StreakHighlights habits={bestHabits} />
        </>
      )}

      {/* Date Navigator */}
      <DateNavigator currentDate={selectedDate} />

      {/* Today's Habits */}
      <TodayHabits habits={habits} date={selectedDate} />

      {/* {user.plan === "free" && habitCount >= 3 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">
                You've reached the free limit!
              </h3>
              <p className="text-indigo-100">
                Upgrade to Pro for unlimited habits
              </p>
            </div>
            <a
              href="/dashboard/upgrade"
              className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50"
            >
              Upgrade Now
            </a>
          </div>
        </div>
      )} */}
    </div>
  );
}
