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
import { dark } from '@clerk/themes'
/**
 * Metadata for SEO
 */
export const metadata: Metadata = {
  title: "Habitly - Build Better Habits",
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
    <ClerkProvider
      appearance={{
        baseTheme: dark, // Force dark mode to ensure consistency
        variables: {
          colorPrimary: '#10b981',          // Brand Green (Primary)
          colorBackground: '#0f172a',       // Fixed Dark Slate (matches your app card)
          colorInputBackground: '#1e293b',  // Fixed Darker Slate
          colorText: '#f8fafc',             // Fixed White text
          colorTextSecondary: '#94a3b8',    // Fixed Grey text
          borderRadius: '0.75rem',
        },
        elements: {
          // Force Card to use the fixed variables, ignoring system theme
          card: 'bg-[#0f172a] border-[#1e293b]',

          // Primary button - Green to Blue gradient
          formButtonPrimary:
            'bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 ' +
            'text-primary-foreground font-semibold transition-all duration-300 ' +
            'shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 ' +
            'hover:-translate-y-0.5 active:translate-y-0 border-0',

          // Input fields
          formFieldInput:
            'bg-input border-border text-foreground ' +
            'focus:border-ring focus:ring-2 focus:ring-ring/20 ' +
            'placeholder:text-muted-foreground',

          // Social buttons
          socialButtonsIconButton:
            'border-border hover:bg-accent hover:border-accent ' +
            'hover:-translate-y-0.5 transition-all duration-300 ' +
            'hover:shadow-lg hover:shadow-accent/30',

          socialButtonsBlockButton:
            'border-border hover:bg-accent hover:border-accent ' +
            'hover:-translate-y-0.5 transition-all duration-300 ' +
            'hover:shadow-lg hover:shadow-accent/30',

          // Footer - Force fixed dark background
          footer: 'bg-[#0f172a] border-t border-[#1e293b]',
          footerAction: 'bg-[#0f172a]',
          footerActionText: 'text-[#94a3b8]',
          footerActionLink: 'text-primary hover:text-accent transition-colors',

          // Form field label
          formFieldLabel: 'text-foreground font-medium',

          // Divider
          dividerLine: 'bg-border',
          dividerText: 'text-muted-foreground',

          // Header
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
