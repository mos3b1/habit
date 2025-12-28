// src/app/(dashboard)/layout.tsx

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { getOrCreateUser } from "@/lib/user";
import { HeroHeader_dashboard } from "@/components/header_dash";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await getOrCreateUser();
  } catch (error) {
    console.error("Error syncing user:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeroHeader_dashboard />
 

      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
    >
      {children}
    </Link>
  );
}