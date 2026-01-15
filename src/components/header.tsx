"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const menuItems = [
  { name: "Features", href: "#Features" },
  { name: "Pricing", href: "/dashboard/upgrade" },
  { name: "Dashboard", href: "/dashboard" },
];

export const HeroHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={cn(
          "fixed z-30 w-full transition-all duration-300",
          isScrolled || menuOpen
            ? "bg-background/80 border-b border-border backdrop-blur-xl"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Logo and Desktop Nav */}
            <div className="flex items-center gap-12">
              <Logo size={60} ariaLabel="home" />

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm font-medium">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              <Button asChild variant="ghost" size="sm" className="font-medium">
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild size="sm" className="font-medium px-6 rounded-full">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
              className="lg:hidden relative z-50 p-2 -mr-2 text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <div className="relative size-6">
                <Menu
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    menuOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  )}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={cn(
              "lg:hidden overflow-hidden transition-all duration-500 ease-in-out",
              menuOpen ? "max-h-[500px] opacity-100 pb-8" : "max-h-0 opacity-0"
            )}
          >
            <div className="pt-4 space-y-6">
              <ul className="space-y-4">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors block px-2 py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-border flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button asChild variant="outline" className="w-full rounded-xl">
                    <Link href="/sign-in" onClick={() => setMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild className="w-full rounded-xl">
                    <Link href="/sign-up" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
