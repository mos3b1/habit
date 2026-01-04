"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/header";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import HeroVisual from "./HeroIcons";

export default function HeroSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const iconref=useRef(null);



  return (
    <>
      <HeroHeader />

      <main ref={rootRef} className="relative overflow-hidden">
        {/* Background: modern blobs + grid */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Gradient blobs (use your theme tokens) */}
          <div
            className="blob blob-1 absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl opacity-20"
            style={{ background: "hsl(var(--primary))" }}
          />
          <div
            className="blob blob-2 absolute top-16 right-0 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-15"
            style={{ background: "hsl(var(--accent))" }}
          />
          <div
            className="blob blob-3 absolute bottom-0 left-0 h-80 w-80 rounded-full blur-3xl opacity-10"
            style={{ background: "hsl(var(--primary))" }}
          />

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Bottom radial fade */}
          <div className="absolute inset-0 [background:radial-gradient(120%_120%_at_50%_100%,transparent_0%,hsl(var(--background))_70%)]" />
        </div>

        <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          {/* Badge */}
          <div className="mb-8 flex justify-center" >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Free plan • Track up to 3 habits
            </div>
          </div>

          {/* Main content grid: Text left, Visual right */}
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left side: All text content */}
              <div className="space-y-8">
                <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-center">
                  Build habits that <span className="text-primary">stick</span>{" "}
                  in <span className="text-primary">60 seconds</span> a day.
                </h1>

                <p className="hp text-base text-muted-foreground sm:text-lg max-w-xl text-center">
                  One-tap daily check-ins, streaks, and clean analytics to help
                  you stay consistent. Stop restarting. Start building momentum.
                </p>

                {/* CTAs */}
                <div className="flex  sm:flex-row items-start justify-center sm:items-end  gap-3 ">
                  <SignedOut>
                    <Button asChild size="lg" className="pr-4.5">
                      <Link href="/sign-up">
                        Start Free <ChevronRight className="opacity-50" />
                      </Link>
                    </Button>
                  </SignedOut>

            

                  <Button asChild size="lg" variant="outline">
                    <Link href="/pricing">See Pricing</Link>
                  </Button>
                </div>

                {/* Trust line */}
                <div className="flex flex-wrap items-start gap-x-4 gap-y-2 text-sm text-muted-foreground justify-center">
                  <span>✅ No credit card required</span>
                  <span>🔒 Secure payments via Stripe</span>
                  <span>⚡ Upgrade anytime</span>
                </div>
              </div>

              {/* Right side: Visual */}
              <div className="flex justify-center lg:justify-end">
                <HeroVisual />
              </div>
            </div>
          </div>

     
        </section>
      </main>
    </>
  );
}