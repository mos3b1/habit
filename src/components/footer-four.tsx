import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { title: "Features", href: "#Features" },
  { title: "Pricing", href: "/pricing" },
  { title: "Dashboard", href: "/dashboard" },
  { title: "Billing", href: "/dashboard/billing" },
  { title: "Privacy", href: "/privacy" },   // create later (optional)
  { title: "Terms", href: "/terms" },       // create later (optional)
];

export default function FooterSection() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand + Copyright */}
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Go home" className="flex items-center gap-2">
              <Logo href="/" size={24} showText={false} />
            </Link>

            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HabitFlow. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom line */}
        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            Built with Next.js, Drizzle, Neon, Clerk & Stripe.
          </p>
          <p>
            Need help?{" "}
            <a
              className="text-primary hover:underline"
              href="mailto:support@habitflow.app"
            >
              support@habitflow.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}