import { getHabitsWithStatus } from "@/lib/actions/habits";
import { formatDateDisplay } from "@/lib/utils/date";

export async function DayDetails({ date }: { date: string }) {
  const habits = await getHabitsWithStatus(date);
  const completed = habits.filter((h) => h.isCompletedToday).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-lg font-semibold text-foreground">
        {formatDateDisplay(date)}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Completed: <span className="font-semibold text-foreground">{completed}/{habits.length}</span>
      </p>

      <div className="mt-4 space-y-3">
        {habits.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No habits yet. Create your first habit to start tracking.
          </p>
        ) : (
          habits.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                  {h.icon || "📌"} {h.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  🔥 {h.currentStreak} day streak
                </p>
              </div>

              <div className={h.isCompletedToday ? "text-primary" : "text-muted-foreground"}>
                {h.isCompletedToday ? "✓ Done" : "—"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}