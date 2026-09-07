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
          title="Managed Influencer"
          highlight="Marketing"
          description="Let our expert in-house team run your entire creator strategy from discovery to deployment."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "White-Glove Campaign Execution",
              description: "Don't have the bandwidth? Our seasoned campaign managers will handle everything: creator sourcing, negotiation, shipping logistics, and content review.",
              bullets: ["Dedicated account manager","End-to-end logistics","Quality assurance"],
              imagePlaceholderText: "Managed Services Process"
            },
            {
              title: "Guaranteed Deliverables",
              description: "We eliminate the risk. With our managed service, you are guaranteed a set number of high-quality, approved assets every month, or we source replacements for free.",
              bullets: ["Volume guarantees","Quality checks","Replacement sourcing"],
              imagePlaceholderText: "Deliverables Dashboard"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Done","label":"For You"},{"value":"Dedicated","label":"Strategist"},{"value":"Guaranteed","label":"Results"},{"value":"End-to-End","label":"Execution"}]} />
        
        <PremiumCtaSection 
          title="Scale without the headache."
          description="Talk to our managed services team today."
        />
      </main>

      <Footer />
    </div>
  );
}
