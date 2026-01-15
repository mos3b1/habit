"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/header";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import HeroVisual from "./HeroIcons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Initial State
      // autoAlpha handles opacity + visibility to prevent interaction/layout issues
      gsap.set(".hero-text", { y: 20, autoAlpha: 0 });
      gsap.set(".hero-visual", { x: 50, autoAlpha: 0, scale: 0.95 });
      gsap.set(".hero-blob", { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 2. Entrance Animation (Faster)
      tl.to(".hero-blob", { autoAlpha: 0.4, duration: 1.5, stagger: 0.2 })
        .to(
          ".hero-text",
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.08,
          },
          "-=1.2"
        )
        .to(
          ".hero-visual",
          {
            x: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1,
          },
          "-=0.6"
        );

      // 3. Continuous Background Movement
      gsap.to(".blob-1", {
        x: "random(-50, 50)",
        y: "random(-50, 50)",
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".blob-2", {
        rotation: 10,
        x: "random(-30, 30)",
        y: "random(-30, 30)",
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <HeroHeader />

      <main ref={containerRef} className="relative overflow-hidden">
        {/* Background: modern animated blobs + grid */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="hero-blob blob-1 absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl opacity-0"
            style={{ background: "hsl(var(--primary))" }}
          />
          <div
            className="hero-blob blob-2 absolute top-16 right-0 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-0"
            style={{ background: "hsl(var(--accent))" }}
          />
          <div
            className="hero-blob blob-3 absolute bottom-0 left-0 h-80 w-80 rounded-full blur-3xl opacity-0"
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

          <div className="absolute inset-0 [background:radial-gradient(120%_120%_at_50%_100%,transparent_0%,hsl(var(--background))_70%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          {/* Badge */}
          <div className="hero-text mb-8 flex justify-center invisible">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm shadow-sm transition-transform hover:scale-105">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-medium">Free plan available</span> • Track up to 3 habits
            </div>
          </div>

          {/* Main content grid */}
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left side: Content */}
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="hero-text invisible text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  Build habits that <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    stick
                  </span>{" "}
                  forever.
                </h1>

                <p className="hero-text invisible text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0">
                  One-tap daily check-ins, automated streaks, and powerful insights to keep you consistent.
                </p>

                {/* CTAs */}
                <div className="hero-text invisible flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <SignedOut>
                    <Button asChild size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-1">
                      <Link href="/sign-up">
                        Get Started Free <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </SignedOut>

                  <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                    <Link href="/dashboard/upgrade">View Pricing</Link>
                  </Button>
                </div>

                {/* Trusted By Addition */}
                <div className="hero-text invisible pt-6">
                  <p className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">Trusted by productive people at</p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Stripe Logo */}
                    <svg className="h-7 w-auto text-foreground" viewBox="0 0 40 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.8 9.6C5.8 11.8 7.6 12.3 9.4 12.3C10.8 12.3 12.2 11.9 13.5 11.4V14.1C12.2 14.6 10.7 15 9.3 15C4.7 15 1.8 12.7 1.8 8.6V0.3H5.8V9.6ZM9.3 12.3C7.6 12.3 5.8 11.8 5.8 9.6V0.3H1.8C1.8 0.1 1.9 0 2.1 0H5.5C5.7 0 5.8 0.1 5.8 0.3V9.6ZM34.2 14.7L30.6 2.4H34.5L36.3 10.1L38.2 2.4H42L38.3 14.7H34.2ZM24.6 4.9C24.6 3.6 25.5 2.8 26.9 2.8C28.2 2.8 29.1 3.5 29.3 4.8H32.8C32.4 1.9 30 0 26.9 0C23.6 0 20.9 2.3 20.9 6C20.9 9.6 23.6 11.9 26.9 11.9C30 11.9 32.4 10.1 32.8 7.2H29.3C29.1 8.4 28.2 9.2 26.9 9.2C25.5 9.2 24.6 8.3 24.6 7.1V6.9H32.9V6.2C32.9 6.2 32.9 6.2 32.9 6.2C32.9 5.8 32.9 5.3 32.9 4.9H24.6ZM24.7 5.8H29.1C29 5 28.3 4.9 26.9 4.9C25.5 4.9 24.8 5 24.7 5.8ZM16.3 2.4V14.8H20.1V8.6C20.1 6.3 21.2 5.5 22.8 5.5C23.2 5.5 23.5 5.5 23.8 5.6V2.2C23.4 2.1 23 2.1 22.6 2.1C21.2 2.1 19.9 2.8 19.2 4.1L19.1 4.1V2.4H16.3Z" />
                    </svg>
                    {/* GitHub Logo */}
                    <svg className="h-6 w-auto text-foreground" viewBox="0 0 98 96" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217C0 71.75 14.609 90.852 34.877 96C37.268 96.313 38.203 94.973 38.203 93.633C38.203 92.428 38.151 86.971 38.151 86.971C24.021 89.921 21.042 80.938 21.042 80.938C19.8249 77.8647 18.0673 75.0504 15.82 72.636C8.75 67.899 15.932 67.971 15.932 67.971C21.493 68.604 24.471 73.744 24.471 73.744C29.626 82.5 37.957 80 41.246 78.5C41.776 74.833 43.238 72.33 44.869 70.923C33.407 69.608 21.366 65.176 21.366 45.395C21.366 39.752 23.364 35.158 26.653 31.564C26.122 30.25 24.364 24.975 27.165 17.893C27.165 17.893 31.505 16.5 41.385 23.235C45.513 22.083 49.805 21.984 54.028 22.923C63.908 16.188 68.249 17.581 68.249 17.581C71.049 24.663 69.291 29.937 68.76 31.251C72.049 34.845 74.047 39.439 74.047 45.082C74.047 64.939 61.944 69.295 50.418 70.61C52.417 72.359 54.204 75.827 54.204 81.137C54.204 88.75 54.136 92.75 54.136 93.633C54.136 94.973 55.071 96.388 57.53 95.922C84.53 88.105 97.711 59.73 98 49.217C98 22 75.923 0 48.854 0Z" />
                    </svg>
                    {/* Vercel Logo */}
                    <svg className="h-5 w-auto text-foreground" viewBox="0 0 1155 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right side: Visual */}
              <div className="hero-visual invisible flex justify-center lg:justify-end">
                <HeroVisual className="drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}