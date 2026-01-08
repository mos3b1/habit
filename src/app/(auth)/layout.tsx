import { Logo } from "@/components/logo";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page-gradient relative overflow-hidden">
      {/* 1. Full Screen Background Image (Commented out for Clean Gradient) */}
      {/* <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-50 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-[#0f172a]/40" />
      </div> */}

      {/* 2. Top Navigation (Logo) */}
      <div className="absolute top-6 left-6 z-20">
        <Logo href="/" />
      </div>

      {/* 3. Centered Auth Card */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">        <div className="flex flex-col items-center space-y-2 mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white hidden lg:block">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 hidden lg:block">
          Enter your details to access your account
        </p>
      </div>

        {children}
      </div>

      {/* 4. Footer Copy */}
      <div className="absolute bottom-6 z-20 text-xs text-white/70">
        Secure authentication powered by Clerk
      </div>
    </div>
  );
}