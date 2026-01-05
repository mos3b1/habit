// src/app/page.tsx

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section-one";

import FooterSection from "@/components/footer-four";
import Features from "@/components/features-2";
import { getOrCreateUser } from "@/lib/user";
import Pricing from "@/components/pricing";
/**
 * Landing Page
 * 
 * This is what visitors see at the root URL.
 * If already signed in, redirect to dashboard.
 */
export default async function HomePage() {
  // Check if user is already signed in
  const { userId } = await auth();
  const user = await getOrCreateUser();

  const isPro = user?.plan === "pro";

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">

      <HeroHeader />

      <HeroSection />

      <Features />

      <Pricing showbutton={false} />





      <FooterSection />







    </div>
  );
}