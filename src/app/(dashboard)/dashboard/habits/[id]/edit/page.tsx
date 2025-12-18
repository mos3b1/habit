// src/app/(dashboard)/dashboard/habits/[id]/edit/page.tsx

import Link from "next/link";
import { getHabitById, updateHabit } from "@/lib/actions/habits";
import { HabitForm } from "@/component/habits/habit-form";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Edit Habit Page
 */
export default async function EditHabitPage({ params }: Props) {
  const { id } = await params;
  const habit = await getHabitById(id);

  if (!habit) {
    notFound();
  }

  // Create bound action with habit ID
  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateHabit(id, formData);
    
    if (result.success) {
      redirect(`/dashboard/habits/${id}`);
    }
    
    return result;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href={`/dashboard/habits/${id}`}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Habit
      </Link>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Edit Habit
        </h1>
        <p className="text-gray-500 mb-6">
          Update your habit details.
        </p>

        <HabitForm habit={habit} action={handleUpdate} />
      </div>
    </div>
  );
}