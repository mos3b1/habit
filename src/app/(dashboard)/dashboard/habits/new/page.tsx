// src/app/(dashboard)/dashboard/habits/new/page.tsx

import Link from "next/link";
import { HabitForm } from "@/component/habits/habit-form";
import { createHabit } from "@/lib/actions/habits";
import { redirect } from "next/navigation";

/**
 * Create New Habit Page
 */
export default function NewHabitPage() {
  // Wrapper action that redirects on success
  async function handleCreate(formData: FormData) {
    "use server";
    const result = await createHabit(formData);
    
    if (result.success) {
      redirect("/dashboard/habits");
    }
    
    return result;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href="/dashboard/habits"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Habits
      </Link>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create New Habit
        </h1>
        <p className="text-gray-500 mb-6">
          Define your habit and start tracking your progress.
        </p>

        <HabitForm action={handleCreate} />
      </div>
    </div>
  );
}