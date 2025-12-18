// src/app/(dashboard)/layout.tsx

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { syncUser } from "@/lib/auth";

/**
 * Dashboard Layout
 * 
 * This layout wraps all authenticated pages.
 * It includes:
 * - Navigation sidebar/header
 * - User menu (from Clerk)
 * - Common styling
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure user exists in our database
  // This is a fallback if webhook didn't fire
  await syncUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-indigo-600">
              🎯 HabitTracker
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/habits"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                My Habits
              </Link>
              <Link
                href="/dashboard/stats"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Statistics
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/**
               * UserButton Component
               * 
               * Clerk's pre-built component for:
               * - User avatar
               * - Dropdown menu
               * - Sign out
               * - Account management
               * 
               * afterSignOutUrl: where to go after signing out
               */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}