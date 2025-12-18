// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx

import { SignIn } from "@clerk/nextjs";

/**
 * Sign In Page
 * 
 * [[...sign-in]] is a "catch-all" route that handles:
 * - /sign-in
 * - /sign-in/factor-one (MFA)
 * - /sign-in/factor-two
 * - etc.
 * 
 * WHY USE CLERK'S COMPONENT?
 * - Handles all auth complexity (passwords, OAuth, MFA)
 * - Secure by default
 * - Accessible (a11y)
 * - Customizable with appearance prop
 */
export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          // Customize the look to match your brand
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