// src/app/(dashboard)/dashboard/analytics/page.tsx

import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import {
  getOverallStats,
  getDailyStats,
  getHeatmapData,
  getHabitsWithDetailedStats,
} from "@/lib/actions/analytics";
import { WeeklyChart } from "@/component/dashboard/weekly-chart";
import { HabitHeatmap } from "@/component/dashboard/habit-heatmap";
import { ProgressRing } from "@/component/dashboard/progress-ring";
import { Button } from "@/components/ui/button";
export default async function AnalyticsPage() {
  const user = await getOrCreateUser();
  if (!user) {
    redirect("/sign-in");
  }

  if (user.plan !== "pro") {
    redirect("/dashboard/upgrade");
  }

  // Fetch data
  const [stats, dailyStats, heatmapData, habitsWithStats] = await Promise.all([
    getOverallStats(),
    getDailyStats(14), // Last 2 weeks
    getHeatmapData(60), // Last 2 months
    getHabitsWithDetailedStats(),
  ]);

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-foreground font-bold tracking-tight text-3xl md:text-5xl">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your progress and identify patterns
          </p>
        </div>

        <Button asChild variant="outline" className="">
          <a href="/api/export/csv">Export CSV</a>
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex items-center gap-6">
          <ProgressRing
            value={safeStats.weeklyCompletionRate}
            label="This Week"
          />
          <div>
            <p className="text-sm 	text-muted-foreground+20">Weekly Rate</p>
            <p className="text-3xl font-bold text-gray-900">
              {safeStats.weeklyCompletionRate}%
            </p>
            <p className="text-sm 	text-muted-foreground mt-1">
              {safeStats.weeklyCompletionRate >= 80
                ? "🔥 Excellent!"
                : safeStats.weeklyCompletionRate >= 50
                  ? "👍 Good progress"
                  : "💪 Keep pushing!"}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex items-center gap-6">
          <ProgressRing
            value={safeStats.monthlyCompletionRate}
            label="This Month"
          />
          <div>
            <p className="text-sm 	text-muted-foreground+20">Monthly Rate</p>
            <p className="text-3xl font-bold text-gray-900">
              {safeStats.monthlyCompletionRate}%
            </p>
            <p className="text-sm 	text-muted-foreground mt-1">
              {safeStats.totalCompletions} total completions
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-sm text-purple-600">All-Time Best</p>
              <p className="text-3xl font-bold text-purple-700">
                {safeStats.bestStreak} days
              </p>
            </div>
          </div>
          <p className="text-sm text-purple-600">Your longest streak ever</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <WeeklyChart data={dailyStats} />
        <HabitHeatmap data={heatmapData} title="Last 60 Days" />
      </div>

      {/* Individual Habit Stats */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h2 className="text-foreground font-semibold text-xl md:text-2xl mb-4">
          Habit Breakdown
        </h2>

        {habitsWithStats.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No habits yet. Create some habits to see analytics!
          </p>
        ) : (
          <div className="space-y-4">
            {habitsWithStats.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center gap-4 p-4 bg-card rounded-xl"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${habit.color}20` }}
                >
                  {habit.icon || "📌"}
                </div>

                <div className="flex-1">
                  <p className="font-medium 	text-muted-foreground+20">
                    {habit.name}
                  </p>
                  <div className="flex items-center gap-4 text-sm 	text-muted-foreground mt-1">
                    <span>🔥 {habit.currentStreak} day streak</span>
                    <span>🏆 Best: {habit.longestStreak}</span>
                    <span>✅ {habit.totalCompletions} total</span>
                  </div>
                </div>

                {/* Mini heatmap */}
                <div className="hidden md:flex gap-0.5">
                  {habit.last30Days.slice(-14).map((completed, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${completed ? "bg-green-500" : "bg-gray-200"
                        }`}
                    />
                  ))}
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold 	text-muted-foreground+10">
                    {habit.completionRate}%
                  </p>
                  <p className="text-xs 	text-muted-foreground">30-day rate</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
