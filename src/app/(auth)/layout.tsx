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
      {/* <div className="absolute top-6 left-6 z-20">
        <Logo href="/" />
      </div> */}

      {/* 3. Centered Auth Card */}
      {children}

      {/* 4. Footer Copy */}

    </div>
  );
}