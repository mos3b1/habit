import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import { getCalendarHeatmapData } from "@/lib/actions/calendar";
import { CalendarHeatmap } from "@/component/calendar/calendar-heatmap";
import { DayDetails } from "@/component/calendar/day-details";
import { getTodayDate } from "@/lib/utils/date";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const user = await getOrCreateUser();

  // PRO gate
//   if (!user || user.plan !== "pro") {
//     redirect("/dashboard/upgrade");
//   }

  const { date } = await searchParams;
  const selectedDate = date || getTodayDate();

  const heatmap = await getCalendarHeatmapData(84); // last 12 weeks (84 days)

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground">
          Your habit history with a GitHub-style heatmap. Click a day to view details.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <CalendarHeatmap data={heatmap} selectedDate={selectedDate} />
        <DayDetails date={selectedDate} />
      </div>
    </div>
  );
}