"use client";

import { useState, useTransition } from "react";
import { toggleHabitCompletion } from "@/lib/actions/habits";
import { toast } from "sonner";

type CheckInButtonProps = {
  habitId: string;
  date: string;
  isCompleted: boolean;
  color: string;
};

export function CheckInButton({ 
  habitId, 
  date,
  isCompleted: initialCompleted,
  color 
}: CheckInButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleClick() {
    const newState = !isCompleted;
    setIsCompleted(newState);
    
    if (newState) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    }

    startTransition(async () => {
      const result = await toggleHabitCompletion(habitId, date);
      
      if (!result.success) {
        setIsCompleted(!newState);
        toast.error(result.message);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`
        relative w-12 h-12 rounded-xl border-2 
        transition-all duration-300 ease-out
        flex items-center justify-center
        ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}
        ${isCompleted 
          ? "border-green-500 bg-green-500 text-white scale-105" 
          : "border-border hover:border-muted-foreground hover:bg-muted/50"
        }
        ${showSuccess ? "animate-bounce" : ""}
      `}
      style={isCompleted ? { borderColor: color, backgroundColor: color } : {}}
      aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
    >
      <svg
        className={`w-6 h-6 transition-all duration-300 ${
          isCompleted ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>

      {showSuccess && (
        <span 
          className="absolute inset-0 rounded-xl animate-ping opacity-75"
          style={{ backgroundColor: color }}
        />
      )}
    </button>
  );
}