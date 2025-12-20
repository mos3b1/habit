// src/app/(dashboard)/layout.tsx

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { getOrCreateUser } from "@/lib/user";
import { HeroHeader_dashboard } from "@/components/header_dash";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // This will create user if they don't exist
    await getOrCreateUser();
  } catch (error) {
    console.error("Error syncing user:", error);
    // Continue anyway - user might still be able to use the app
  }

  return (
    <div className="min-h-screen background ">
      {/* Header */}
      {/* <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
            🎯 HabitTracker
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/dashboard/habits" className="text-gray-600 hover:text-gray-900">
              Habits
            </Link>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header> */}

      <HeroHeader_dashboard />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">
        {children}
      </main>
    </div>
  );
}