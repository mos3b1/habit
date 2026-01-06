import { Logo } from "@/components/logo";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f172a]">
      {/* 1. Full Screen Background Image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-50 blur-[2px]"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-[#0f172a]/40" />
      </div>

      {/* 2. Top Navigation (Logo) */}
      <div className="absolute top-6 left-6 z-20">
        <Logo href="/" />
      </div>

      {/* 3. Centered Auth Card */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="flex flex-col items-center space-y-2 mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Welcome back
          </h1>
          <p className="text-sm text-slate-200 drop-shadow-sm">
            Enter your details to access your account
          </p>
        </div>

        {children}
      </div>

      {/* 4. Footer Copy */}
      <div className="absolute bottom-6 z-20 text-xs text-slate-400 opacity-60">
        Secure authentication powered by Clerk
      </div>
    </div>
  );
}