import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitLogs } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/user";
import { eq, and, desc } from "drizzle-orm";

export const runtime = "nodejs";

function escapeCsv(value: unknown) {
  const s = String(value ?? "");
  // Escape quotes and wrap values that contain special chars
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // PRO gate
  if (user.plan !== "pro") {
    return NextResponse.json({ error: "Pro only" }, { status: 403 });
  }

  // Join logs + habits so we export habit name/category
  const rows = await db
    .select({
      date: habitLogs.date,
      habitName: habits.name,
      category: habits.category,
      completed: habitLogs.completed,
      completedCount: habitLogs.completedCount,
      note: habitLogs.note,
    })
    .from(habitLogs)
    .innerJoin(habits, eq(habitLogs.habitId, habits.id))
    .where(and(eq(habits.userId, user.id), eq(habits.isActive, true)))
    .orderBy(desc(habitLogs.date));

  const header = ["date", "habit", "category", "completed", "count", "note"].join(",");
  const lines = rows.map((r) =>
    [
      escapeCsv(r.date),
      escapeCsv(r.habitName),
      escapeCsv(r.category),
      escapeCsv(r.completed ? "true" : "false"),
      escapeCsv(r.completedCount),
      escapeCsv(r.note),
    ].join(",")
  );

  const csv = [header, ...lines].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="habitflow-export.csv"`,
    },
  });
}