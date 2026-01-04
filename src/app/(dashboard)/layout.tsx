// src/app/(dashboard)/layout.tsx


import { getOrCreateUser } from "@/lib/user";

import { HeroHeaderDashboard } from "@/components/hero-header-dashboard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeroHeaderDashboard />
 

      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">{children}</main>
    </div>
  );
}

