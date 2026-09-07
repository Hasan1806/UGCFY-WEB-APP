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
          title="Frequently Asked"
          highlight="Questions"
          description="Everything you need to know about our pricing, platform, and creator network."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Pricing & Platform Access",
              description: "Understand exactly how our subscription tiers work, what features are included, and how our 0% creator fee guarantee ensures your budget goes further.",
              bullets: ["Subscription details","Fee structures","Upgrade processes"],
              imagePlaceholderText: "Pricing Breakdown"
            },
            {
              title: "Legal & Usage Rights",
              description: "Clear explanations of how content ownership, perpetual licensing, and whitelisting rights are handled automatically through our smart contracts.",
              bullets: ["Perpetual licenses","Whitelisting rules","Exclusivity terms"],
              imagePlaceholderText: "Legal Summaries"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Quick","label":"Answers"},{"value":"Transparent","label":"Pricing"},{"value":"Clear","label":"Policies"},{"value":"24/7","label":"Support"}]} />
        
        <PremiumCtaSection 
          title="Still have questions?"
          description="Our support team is ready to help."
        />
      </main>

      <Footer />
    </div>
  );
}
