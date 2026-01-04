// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/component/theme-provider";
import icon from "@/../public/ChatGPT_Image_21_déc._2025__17_16_10-removebg-preview.png";
const inter = Inter({ subsets: ["latin"] });
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
/**
 * Metadata for SEO
 */
export const metadata: Metadata = {
  title: "Habit Tracker - Build Better Habits",
  description: "Track your daily habits and build lasting routines",
  icons: {
    icon: "/favicon.ico",
  },
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
          <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster  position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
