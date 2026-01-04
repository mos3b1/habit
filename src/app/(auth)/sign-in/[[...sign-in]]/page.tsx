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