// src/middleware.ts (in src folder, NOT in app folder!)

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * MIDDLEWARE
 * 
 * This runs BEFORE every request to your app.
 * We use it to:
 * 1. Check if user is authenticated
 * 2. Redirect unauthenticated users to sign-in
 * 3. Allow public routes without auth
 * 
 * WHY MIDDLEWARE instead of checking in each page?
 * - Single source of truth for auth rules
 * - Runs on the Edge (faster)
 * - Protects API routes too
 * - Can't be bypassed by client-side navigation
 */

/**
 * Define which routes are PUBLIC (no auth required)
 * Everything else will require authentication
 */
const isPublicRoute = createRouteMatcher([
  "/",                    // Landing page
  "/sign-in(.*)",        // Sign in page and sub-routes
  "/sign-up(.*)",        // Sign up page and sub-routes
  "/api/webhooks(.*)",   // Webhooks (Clerk needs to call these)
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is NOT public, require authentication
  if (!isPublicRoute(req)) {
    await auth.protect(); // Redirects to sign-in if not authenticated
  }
});

/**
 * Middleware Config
 * 
 * 'matcher' tells Next.js which routes to run middleware on
 * 
 * We EXCLUDE:
 * - _next/static: Next.js static files
 * - _next/image: Next.js image optimization
 * - favicon.ico: Browser icon
 * - Public assets (images, etc.)
 * 
 * WHY EXCLUDE THESE?
 * - They don't need auth checking
 * - Improves performance
 * - Avoids unnecessary middleware calls
 */
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};