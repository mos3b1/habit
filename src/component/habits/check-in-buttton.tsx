// src/components/habits/check-in-button.tsx

"use client";

import { useState, useTransition } from "react";
import { toggleHabitCompletion } from "@/lib/actions/habits";

type CheckInButtonProps = {
  habitId: string;
  date: string;
  isCompleted: boolean;
  color: string;
};

/**
 * Check-in Button Component
 * 
 * Features:
 * - Optimistic updates (instant visual feedback)
 * - Loading state
 * - Animated transitions
 * - Haptic-like visual feedback
 */
export function CheckInButton({ 
  habitId, 
  date, 
  isCompleted: initialCompleted,
  color 
}: CheckInButtonProps) {
  // Local state for optimistic update
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleClick() {
    // Optimistic update - change UI immediately
    const newState = !isCompleted;
    setIsCompleted(newState);
    
    // Show success animation
    if (newState) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    }

    // Actually update the server
    startTransition(async () => {
      const result = await toggleHabitCompletion(habitId, date);
      
      // If server update failed, revert the optimistic update
      if (!result.success) {
        setIsCompleted(!newState);
        console.error(result.message);
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
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }
        ${showSuccess ? "animate-bounce" : ""}
      `}
      style={isCompleted ? { borderColor: color, backgroundColor: color } : {}}
      aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
    >
      {/* Checkmark Icon */}
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

      {/* Success ripple effect */}
      {showSuccess && (
        <span 
          className="absolute inset-0 rounded-xl animate-ping opacity-75"
          style={{ backgroundColor: color }}
        />
      )}
    </button>
  );
}