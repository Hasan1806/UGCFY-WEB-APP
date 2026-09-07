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
          title="Free Creator"
          highlight="Tools"
          description="Calculators, templates, and generators to help you streamline your influencer marketing."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Campaign ROI Calculator",
              description: "Plug in your estimated creator costs, product margins, and historical conversion rates to instantly project whether an influencer campaign will be profitable.",
              bullets: ["Break-even analysis","ROAS projection","Margin calculation"],
              imagePlaceholderText: "ROI Calculator Tool"
            },
            {
              title: "Creative Brief Generator",
              description: "Stop writing briefs from scratch. Use our dynamic template generator to create comprehensive, idiot-proof briefs that ensure you get exactly the content you need.",
              bullets: ["Hook suggestions","Do's and Don'ts","Visual references"],
              imagePlaceholderText: "Brief Generator UI"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"100%","label":"Free"},{"value":"No","label":"Signup"},{"value":"Instant","label":"Results"},{"value":"Pro","label":"Level"}]} />
        
        <PremiumCtaSection 
          title="Optimize your workflow."
          description="Use our free tools to run better campaigns today."
        />
      </main>

      <Footer />
    </div>
  );
}
