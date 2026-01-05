
"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Button component (simplified for demo)
const Button = ({ 
  children, 
  variant = "default", 
  size = "default",
  className,
  ...props 
}: any) => (
  <button
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
      size === "lg" && "px-6 py-3 text-base",
      variant === "outline" 
        ? "border border-border bg-background hover:bg-accent" 
        : "bg-primary text-primary-foreground hover:bg-primary/90",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

// HeroVisual component from your HeroIcons.tsx
export default function HeroVisual({ className }: { className?: string }) {
  const refIcon=useRef(null);
  
  return (
    <div className={cn("relative mx-auto w-full max-w-[560px]", className)}>
      {/* Big background panel */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xl shadow-black/10 backdrop-blur">
        <div className="grid gap-4 ">
          <div className="grid lg:grid-cols-2 grid-cols-1  gap-4 ">
            <MiniCard title="Monthly plan" >
              <MiniDonut />
            </MiniCard>

            <MiniCard title="Streak trend">
            
              <MiniLine />
            </MiniCard>
          </div>

          <MiniCard title="Weekly progress">
            <MiniArea />
          </MiniCard>
        </div>
      </div>

      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 55%), radial-gradient(circle at 70% 30%, #8b5cf6 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

function MiniCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border  bg-background+20 p-4 shadow-sm">
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function MiniDonut() {
  const size = 86;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const p1 = 0.35;
  const p2 = 0.25;
  const p3 = 0.20;
  const p4 = 0.20;

  const seg = (p: number) => c * p;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-700"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#3b82f6"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${seg(p1)} ${c - seg(p1)}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#8b5cf6"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${seg(p2)} ${c - seg(p2)}`}
          strokeDashoffset={-seg(p1)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${seg(p3)} ${c - seg(p3)}`}
          strokeDashoffset={-(seg(p1) + seg(p2))}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${seg(p4)} ${c - seg(p4)}`}
          strokeDashoffset={-(seg(p1) + seg(p2) + seg(p3))}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <circle cx={size / 2} cy={size / 2} r={r - 14} fill="currentColor" className="text-white dark:text-zinc-900" />
      </svg>

      <div className="space-y-1">
        <div className="text-sm font-semibold">$2 / month</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Pro subscription</div>
      </div>
    </div>
  );
}

function MiniLine() {
  return (
    <svg viewBox="0 0 240 80" className="h-16 w-full">
      <path
        d="M0 10 H240 M0 40 H240 M0 70 H240"
        stroke="currentColor"
        className="text-zinc-200 dark:text-zinc-700"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M10 55 C40 20, 70 75, 100 42 C130 18, 160 60, 190 30 C210 12, 225 22, 235 18"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10 55 C40 20, 70 75, 100 42 C130 18, 160 60, 190 30 C210 12, 225 22, 235 18"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="10"
        opacity="0.12"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniArea() {
  return (
    <svg viewBox="0 0 360 140" className="h-28 w-full">
      <path
        d="M20 20 H340 M20 60 H340 M20 100 H340"
        stroke="currentColor"
        className="text-zinc-200 dark:text-zinc-700"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M20 110
           C80 95, 110 55, 160 70
           C210 85, 240 35, 290 55
           C320 68, 335 50, 340 42
           L340 120 L20 120 Z"
        fill="#3b82f6"
        opacity="0.18"
      />
      <path
        d="M20 110
           C80 95, 110 55, 160 70
           C210 85, 240 35, 290 55
           C320 68, 335 50, 340 42"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g fill="currentColor" className="text-zinc-500 dark:text-zinc-400" fontSize="10">
        <text x="20" y="136">Mon</text>
        <text x="75" y="136">Tue</text>
        <text x="130" y="136">Wed</text>
        <text x="185" y="136">Thu</text>
        <text x="240" y="136">Fri</text>
        <text x="295" y="136">Sat</text>
        <text x="330" y="136">Sun</text>
      </g>
    </svg>
  );
}