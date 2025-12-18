// src/lib/utils/date.ts

/**
 * DATE UTILITIES
 * 
 * WHY SEPARATE FILE?
 * - Date handling is tricky (timezones!)
 * - Reusable across the app
 * - Easy to test
 * - Consistent formatting everywhere
 */

/**
 * Get today's date as YYYY-MM-DD string
 * 
 * WHY STRING FORMAT?
 * - Our database stores dates as strings
 * - Avoids timezone confusion
 * - Easy to compare: "2024-01-15" === "2024-01-15"
 */
export function getTodayDate(): string {
  const today = new Date();
  return formatDate(today);
}

/**
 * Format a Date object to YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string to Date object
 */
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get a human-readable date string
 * e.g., "Monday, January 15, 2024"
 */
export function formatDateDisplay(dateString: string): string {
  const date = parseDate(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get a short date string
 * e.g., "Jan 15"
 */
export function formatDateShort(dateString: string): string {
  const date = parseDate(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Check if a date string is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayDate();
}

/**
 * Check if a date string is in the past
 */
export function isPast(dateString: string): boolean {
  return dateString < getTodayDate();
}

/**
 * Check if a date string is in the future
 */
export function isFuture(dateString: string): boolean {
  return dateString > getTodayDate();
}

/**
 * Get the previous day
 */
export function getPreviousDay(dateString: string): string {
  const date = parseDate(dateString);
  date.setDate(date.getDate() - 1);
  return formatDate(date);
}

/**
 * Get the next day
 */
export function getNextDay(dateString: string): string {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + 1);
  return formatDate(date);
}

/**
 * Get an array of the last N days
 * Useful for showing week view
 */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(formatDate(date));
  }
  
  return days;
}

/**
 * Get day of week (0 = Sunday, 1 = Monday, etc.)
 */
export function getDayOfWeek(dateString: string): number {
  return parseDate(dateString).getDay();
}

/**
 * Get day name (short)
 */
export function getDayName(dateString: string): string {
  return parseDate(dateString).toLocaleDateString("en-US", { weekday: "short" });
}