// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

/**
 * Metadata for SEO
 */
export const metadata: Metadata = {
  title: "Habit Tracker - Build Better Habits",
  description: "Track your daily habits and build lasting routines",
};

/**
 * Root Layout
 * 
 * WHY ClerkProvider at root level?
 * - Makes auth state available EVERYWHERE in your app
 * - All pages can use useAuth(), useUser(), etc.
 * - Required for Clerk components to work
 * 
 * Think of it like React Context - wraps the entire app
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}