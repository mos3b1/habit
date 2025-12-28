// src/components/dashboard/stats-cards.tsx

import type { OverallStats } from "@/lib/actions/analytics";

type StatsCardsProps = {
  stats: OverallStats;
};

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Active Habits",
      value: stats.totalHabits.toString(),
      icon: "📝",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed Today",
      value: `${stats.completedToday}/${stats.totalToday}`,
      icon: "✅",
      color: stats.completedToday === stats.totalToday && stats.totalToday > 0
        ? "bg-green-50 text-green-600 ring-2 ring-primary/30 border-primary/40"
        : "bg-gray-50 text-gray-600",
      highlight: stats.completedToday === stats.totalToday && stats.totalToday > 0,
    },
    {
      label: "Best Streak",
      value: `${stats.bestStreak} days`,
      icon: "🔥",
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "This Week",
      value: `${stats.weeklyCompletionRate}%`,
      icon: "📊",
      color: stats.weeklyCompletionRate >= 80 
        ? "bg-green-50 text-green-600"
        : stats.weeklyCompletionRate >= 50
        ? "bg-yellow-50 text-yellow-600"
        : "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`
            bg-card rounded-xl p-4 shadow-sm border border-border
            transition-all duration-200 hover:shadow-md
            ${card.highlight ? "ring-2 ring-green-500 ring-offset-2" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{card.label}</p>
              <p className="text-lg font-bold text-muted-foreground">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}