"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  getTodayDate, 
  formatDateDisplay, 
  getPreviousDay, 
  getNextDay,
  isToday,
  isFuture 
} from "@/lib/utils/date";

type DateNavigatorProps = {
  currentDate: string;
  baseUrl?: string;
};

export function DateNavigator({ currentDate, baseUrl = "/dashboard" }: DateNavigatorProps) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const isCurrentToday = isToday(currentDate);
  const canGoNext = !isCurrentToday && !isFuture(getNextDay(currentDate));

  function handlePrevious() {
    setIsAnimating(true);
    const prevDate = getPreviousDay(currentDate);
    router.push(`${baseUrl}?date=${prevDate}`);
    setTimeout(() => setIsAnimating(false), 300);
  }

  function handleNext() {
    if (!canGoNext) return;
    setIsAnimating(true);
    const nextDate = getNextDay(currentDate);
    router.push(`${baseUrl}?date=${nextDate}`);
    setTimeout(() => setIsAnimating(false), 300);
  }

  function handleToday() {
    if (isCurrentToday) return;
    router.push(baseUrl);
  }

  return (
    <div className="flex items-center justify-between bg-card rounded-xl p-4 shadow-sm border border-border">
      <button
        onClick={handlePrevious}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Previous day"
      >
        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={`text-center transition-opacity ${isAnimating ? "opacity-50" : ""}`}>
        <p className="text-lg font-semibold text-foreground">
          {formatDateDisplay(currentDate)}
        </p>
        {isCurrentToday ? (
          <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
            <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
            Today
          </span>
        ) : (
          <button
            onClick={handleToday}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Back to Today →
          </button>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className={`p-2 rounded-lg transition-colors ${
          canGoNext 
            ? "hover:bg-muted" 
            : "opacity-30 cursor-not-allowed"
        }`}
        aria-label="Next day"
      >
        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}