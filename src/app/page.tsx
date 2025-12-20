// src/app/page.tsx

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {HeroHeader} from "@/components/header";
import HeroSection from "@/components/hero-section-one";
import ContentSection from "@/components/content-four";
import FooterSection from "@/components/footer-four";
/**
 * Landing Page
 * 
 * This is what visitors see at the root URL.
 * If already signed in, redirect to dashboard.
 */
export default async function HomePage() {
  // Check if user is already signed in
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
   
      <HeroHeader />

      <HeroSection />


      <ContentSection />


      <FooterSection />

      

     

     
  
    </div>
  );
}