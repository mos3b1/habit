"use client";

import React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/component/theme-toggle"; // ✅ fixed path
import { Logo } from "@/components/logo";

function ProBadge() {
  return (
    <span className="ml-2 rounded-full bg-gradient-to-r from-primary to-accent px-2 py-0.5 text-[10px] font-semibold text-white">
      PRO
    </span>
  );
}

export function HeroHeaderDashboardClient({ isPro }: { isPro: boolean }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Habits", href: "/dashboard/habits" },
    {
      name: "Analytics",
      // Free users go to upgrade instead of analytics
      href: isPro ? "/dashboard/analytics" : "/dashboard/upgrade",
      proOnly: true,
    }, {
      name: "Calendar", href: isPro ? "/dashboard/calendar" : "/dashboard/upgrade",
      proOnly: true,
    }
  ];

  return (
    <header>
      <nav
        className={cn(
          "fixed z-20 w-full transition-all duration-300",
          isScrolled && "bg-background/75 border-b border-border backdrop-blur-lg"
        )}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Logo href="/dashboard" />

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <Button key={item.name} asChild variant="ghost" size="sm">
                  <Link href={item.href} className="text-sm">
                    <span className="inline-flex items-center">
                      {item.name}
                      {/* show PRO badge only for free users */}
                      {item.proOnly && !isPro && <ProBadge />}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden rounded-lg p-2 text-foreground hover:bg-muted transition"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile dropdown */}
          <div
            className={cn(
              "lg:hidden overflow-hidden transition-all duration-300",
              menuOpen ? "max-h-[420px] pb-6" : "max-h-0"
            )}
          >
            <div className="mt-4 rounded-2xl border border-border bg-background p-4">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
                  >
                    <span>{item.name}</span>
                    {item.proOnly && !isPro && <ProBadge />}
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>

              <div className="mt-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}