// src/app/(dashboard)/dashboard/habits/[id]/page.tsx

import Link from "next/link";
import { getHabitStreakDetails } from "@/lib/actions/habits";
import { notFound } from "next/navigation";
import { StreakDisplay, StreakProgressRing } from "@/component/habits/streak-display";
import { StreakCalendar } from "@/component/habits/streak-calendar";
import { getTodayDate } from "@/lib/utils/date";
import { CheckInButton } from "@/component/habits/check-in-buttton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function HabitDetailPage({ params }: Props) {
  const { id } = await params;
  const habit = await getHabitStreakDetails(id);

  if (!habit) {
    notFound();
  }

  const today = getTodayDate();

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

      {/* Habit Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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

          <div className="flex items-center gap-3">
            {/* Today's Check-in */}
            <div className="text-right mr-2">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-xs text-gray-400">
                {habit.isCompletedToday ? "Done! ✓" : "Not yet"}
              </p>
            </div>
            <CheckInButton
              habitId={habit.id}
              date={today}
              isCompleted={habit.isCompletedToday}
              color={habit.color}
            />
            
            <Link
              href={`/dashboard/habits/${habit.id}/edit`}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
          </div>
        </div>

        {habit.description && (
          <p className="text-gray-600 mb-6">{habit.description}</p>
        )}

        {/* Streak Display */}
        <StreakDisplay
          currentStreak={habit.currentStreak}
          longestStreak={habit.longestStreak}
          isCompletedToday={habit.isCompletedToday}
          showMessage={true}
          size="lg"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Current Streak"
          value={habit.currentStreak}
          icon="🔥"
          suffix="days"
        />
        <StatCard
          label="Longest Streak"
          value={habit.longestStreak}
          icon="🏆"
          suffix="days"
        />
        <StatCard
          label="Total Completions"
          value={habit.totalCompletions}
          icon="✅"
          suffix="times"
        />
        <StatCard
          label="Completion Rate"
          value={habit.completionRate}
          icon="📊"
          suffix="%"
        />
      </div>

      {/* Streak Progress Ring */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">30-Day Challenge</h2>
            <p className="text-gray-500 text-sm">
              {habit.currentStreak >= 30 
                ? "🎉 Challenge completed!"
                : `${30 - habit.currentStreak} more days to go!`
              }
            </p>
          </div>
          <StreakProgressRing current={habit.currentStreak} goal={30} size={120} />
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Activity History</h2>
        <StreakCalendar logs={habit.logs} days={30} />
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
        
        {habit.logs && habit.logs.length > 0 ? (
          <div className="space-y-2">
            {habit.logs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  ${log.completed ? "bg-green-50" : "bg-gray-50"}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={log.completed ? "text-green-600" : "text-gray-400"}>
                    {log.completed ? "✅" : "⭕"}
                  </span>
                  <span className="text-gray-700">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span className={`text-sm ${log.completed ? "text-green-600" : "text-gray-400"}`}>
                  {log.completed ? "Completed" : "Missed"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No activity yet. Complete this habit today to start!
          </p>
        )}
      </div>
    </div>
  );
}

// Helper component for stat cards
function StatCard({ 
  label, 
  value, 
  icon, 
  suffix 
}: { 
  label: string; 
  value: number; 
  icon: string; 
  suffix: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {value}
        <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>
      </p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}