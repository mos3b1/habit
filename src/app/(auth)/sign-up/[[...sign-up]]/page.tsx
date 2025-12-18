// src/app/(auth)/sign-up/[[...sign-up]]/page.tsx

import { SignUp } from "@clerk/nextjs";

/**
 * Sign Up Page
 * 
 * Similar to SignIn, Clerk handles:
 * - Email verification
 * - Password requirements
 * - OAuth providers
 * - CAPTCHA (if enabled)
 */
export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          formButtonPrimary: 
            "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
          card: "shadow-xl",
          headerTitle: "text-2xl font-bold",
          headerSubtitle: "text-gray-600",
        },
      }}
    />
  );
}