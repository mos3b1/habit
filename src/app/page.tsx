// src/app/page.tsx

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Landing Page
 * 
 * This is what visitors see at the root URL.
 * If already signed in, redirect to dashboard.
 */
export default async function HomePage() {
  // Check if user is already signed in
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-600">
            🎯 HabitTracker
          </div>
          <div className="space-x-4">
            <Link
              href="/sign-in"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="animate-pulse">🚀</span>
            Build better habits, one day at a time
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your Habits,
            <span className="text-indigo-600"> Transform Your Life</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Simple, beautiful habit tracking that helps you stay consistent.
            Build streaks, track progress, and become the best version of yourself.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-200"
            >
              Start Tracking Free →
            </Link>
            <Link
              href="#features"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all border border-gray-200"
            >
              See Features
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-gray-500">
            <div className="flex -space-x-2">
              {["🧑‍💻", "👩‍🎨", "👨‍🔬", "👩‍🚀", "🧑‍🍳"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg border-2 border-white"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sm">
              Join <span className="font-semibold text-gray-700">1,000+</span> people
              building better habits
            </p>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-32">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to succeed
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🔥
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Streak Tracking
              </h3>
              <p className="text-gray-600">
                Build momentum with visual streak counters. Never break the chain!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Progress Charts
              </h3>
              <p className="text-gray-600">
                Visualize your journey with beautiful progress charts and statistics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Daily Check-ins
              </h3>
              <p className="text-gray-600">
                Simple one-tap check-ins to mark habits complete each day.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-500">
          <p>© 2024 HabitTracker. Built with Next.js, Clerk, and Drizzle.</p>
        </div>
      </footer>
    </div>
  );
}