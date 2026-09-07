"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHero from "@/components/ui/PremiumHero";
import PremiumStats from "@/components/ui/PremiumStats";
import PremiumAlternatingFeatures from "@/components/ui/PremiumAlternatingFeatures";
import PremiumCtaSection from "@/components/ui/PremiumCtaSection";

export default function DownloadAppPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar theme="dark" />
      
      <main className="flex-1">
        <PremiumHero 
          title="Access UGCFY Anywhere with"
          highlight="Our Mobile App"
          description="Get the UGCFY mobile app to complete onboarding, manage your profile, access campaigns, and use creator or brand tools on the go."
          primaryCtaText="Download App"
          primaryCtaHref="/get-started"
          secondaryCtaText="Learn More"
          secondaryCtaHref="/about"
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Mobile Onboarding & Secure KYC",
              description: "Complete your verification process, set up secure payouts, and access workflows securely directly from your mobile device. Both creators and brand representatives can get verified in minutes.",
              bullets: ["Secure KYC verification", "Bank integration", "Profile setup"],
              imagePlaceholderText: "KYC Dashboard"
            },
            {
              title: "Collaborate on the Go",
              description: "Whether you are a creator checking briefs or a brand manager reviewing final submissions, manage the entire communication and contract workflow in real-time.",
              bullets: ["Real-time push notifications", "In-app chat and feedback", "Secure contract signatures"],
              imagePlaceholderText: "Mobile Collaboration View"
            }
          ]}
        />
        
        <PremiumStats 
          stats={[
            { value: "4.8★", label: "App Rating" },
            { value: "100k+", label: "Downloads" },
            { value: "iOS & Android", label: "Platform Support" },
            { value: "100%", label: "Secure & Verified" }
          ]} 
        />
        
        <PremiumCtaSection 
          title="The entire UGC ecosystem in your pocket."
          description="Download the UGCFY mobile app today and start collaborating."
          primaryCtaText="Get Started"
        />
      </main>

      <Footer />
    </div>
  );
}
