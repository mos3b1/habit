import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/component/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 md:grid-cols-2">
        {/* Left marketing side */}
        <div className="hidden md:flex flex-col justify-between border-r border-border p-10">
          <div className="flex items-center justify-between">
            <Logo href="/" />
            <ThemeToggle />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Build habits that stick.
            </h1>
            <p className="text-muted-foreground">
              One-tap daily check-ins, streaks, and analytics — designed for consistency.
            </p>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Free plan: up to 3 habits</li>
              <li>🔥 Streak tracking</li>
              <li>📊 Pro analytics + heatmap</li>
              <li>📤 CSV export (Pro)</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Secure authentication powered by Clerk.
          </p>
        </div>

        {/* Right auth form */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="mb-6 flex items-center justify-between md:hidden">
              <Logo href="/" />
              <ThemeToggle />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}