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
        className="inline-flex items-center gap-2 text-card-foreground hover:text-card-foreground+20 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Habits
      </Link>

      {/* Form Card */}
      <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">
          Edit Habit
        </h1>
        <p className="text-card-foreground mb-6 text-center">
          Update your habit details.
        </p>

        <HabitForm habit={habit} action={handleUpdate} />
        {/* we send habit and handleUpdate as action  */}
      </div>
    </div>
  );
}