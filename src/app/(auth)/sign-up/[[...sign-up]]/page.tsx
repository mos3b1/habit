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
          card: "bg-card border border-border shadow-sm",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          formFieldLabel: "text-foreground",
          formFieldInput: "bg-background border-border text-foreground",
          formButtonPrimary: "bg-primary text-primary-foreground hover:opacity-90",
          footerActionLink: "text-primary hover:underline",
        },
      }}
    />
  );
}