"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHero from "@/components/ui/PremiumHero";
import PremiumStats from "@/components/ui/PremiumStats";
import PremiumAlternatingFeatures from "@/components/ui/PremiumAlternatingFeatures";
import PremiumCtaSection from "@/components/ui/PremiumCtaSection";

export default function Page() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar theme="dark" />
      
      <main className="flex-1">
        <PremiumHero 
          title="Discover Authentic Creators"
          highlight="At Scale"
          description="Tap into our proprietary AI-driven engine to find, filter, and connect with high-performing UGC creators perfectly aligned with your brand demographics."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Lookalike Audience Matching",
              description: "Stop guessing. Our AI analyzes your best-performing ad sets and matches you with creators whose followers index highest for your specific target demographic and purchasing behavior.",
              bullets: ["Demographic indexing","Purchasing behavior analysis","Lookalike scaling"],
              imagePlaceholderText: "AI Match Dashboard"
            },
            {
              title: "Pre-Vetted Professionalism",
              description: "Every creator on UGC FY passes a 5-point verification check for engagement authenticity, past brand performance, and delivery reliability before they ever show up in your search.",
              bullets: ["Fake follower detection","Historical ROAS tracking","Delivery rate metrics"],
              imagePlaceholderText: "Creator Verification Profile"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"10M+","label":"Creators"},{"value":"4.8/5","label":"Avg Rating"},{"value":"98%","label":"Response Rate"},{"value":"24h","label":"Avg Turnaround"}]} />
        
        <PremiumCtaSection 
          title="Ready to find your next star?"
          description="Join 10,000+ brands scaling their UGC production."
        />
      </main>

      <Footer />
    </div>
  );
}
