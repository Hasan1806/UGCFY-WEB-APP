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
          title="Creative Content"
          highlight="Strategy"
          description="Need ideas? Our creative directors will build a comprehensive viral video strategy for your brand."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Algorithmic Hook Engineering",
              description: "We don't just guess. Our creative team analyzes what is currently trending on YouTube and Reels to reverse-engineer high-retention hooks specifically for your product.",
              bullets: ["Trend analysis","Retention optimization","Visual hook design"],
              imagePlaceholderText: "Hook Strategy Document"
            },
            {
              title: "Comprehensive Competitor Audits",
              description: "We break down the paid social strategies of your top 3 competitors, analyzing their winning ads to identify creative gaps your brand can exploit.",
              bullets: ["Ad library analysis","Messaging tear-downs","Opportunity mapping"],
              imagePlaceholderText: "Competitor Audit Report"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Viral","label":"Concepts"},{"value":"Hook","label":"Engineering"},{"value":"Competitor","label":"Tear-downs"},{"value":"Custom","label":"Briefs"}]} />
        
        <PremiumCtaSection 
          title="Win with better creative."
          description="Get a custom content strategy tailored to your brand."
        />
      </main>

      <Footer />
    </div>
  );
}
