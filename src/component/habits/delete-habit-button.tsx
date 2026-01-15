"use client";

import { useState } from "react";
import { deleteHabit } from "@/lib/actions/habits";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DeleteHabitButtonProps = {
  habitId: string;
  habitName: string;
};

export function DeleteHabitButton({ habitId, habitName }: DeleteHabitButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);

    const result = await deleteHabit(habitId);

    if (result.success) {

      toast.error(result.message);
      setShowModal(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsDeleting(false);
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
        title="Delete habit"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-card rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete Habit?
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <strong>"{habitName}"</strong>?
              This habit will be archived and can be restored later.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-xl hover:bg-muted/50 transition-colors text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}