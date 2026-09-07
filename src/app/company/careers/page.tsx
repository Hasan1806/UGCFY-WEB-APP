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
          title="Join the UGC FY"
          highlight="Team"
          description="We are building the infrastructure for the creator economy. Come help us empower millions of independent creators."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "A Culture of Ownership",
              description: "We don't micromanage. We hire brilliant people, give them significant equity, and get out of their way. You will have the autonomy to ship features that impact thousands of creators.",
              bullets: ["High autonomy","Significant equity","Rapid shipping cycle"],
              imagePlaceholderText: "Team Collaboration"
            },
            {
              title: "Global Remote-First",
              description: "Work from anywhere. Whether you're in New York, London, or Bali, our asynchronous workflows and robust documentation ensure you're always connected without being tied to a desk.",
              bullets: ["Async communication","Flexible hours","Annual retreats"],
              imagePlaceholderText: "Global Team Map"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Remote","label":"First"},{"value":"100%","label":"Healthcare"},{"value":"Equity","label":"Packages"},{"value":"Unlimited","label":"PTO"}]} />
        
        <PremiumCtaSection 
          title="Ready to build the future?"
          description="View our open positions and apply today."
        />
      </main>

      <Footer />
    </div>
  );
}
