// src/app/(auth)/layout.tsx

/**
 * Auth Layout
 * 
 * WHY A SEPARATE LAYOUT?
 * - Auth pages have different design (centered, minimal)
 * - No navigation/sidebar needed
 * - Consistent styling across sign-in/sign-up
 * 
 * Route Groups (parentheses) don't affect URL:
 * - (auth)/sign-in → /sign-in (not /auth/sign-in)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>
      
      {/* Auth component */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}