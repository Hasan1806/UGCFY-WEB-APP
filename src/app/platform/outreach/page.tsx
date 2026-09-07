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
          title="Automate Your Creator"
          highlight="Outreach"
          description="Send personalized, high-converting pitches to hundreds of creators simultaneously without losing the human touch."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Drip Campaigns for Creators",
              description: "Set up intelligent, multi-touch email and DM sequences. If a creator doesn't respond to your first pitch, our system automatically follows up at the optimal time to maximize response rates.",
              bullets: ["Multi-step sequences","Smart delay triggers","A/B testing"],
              imagePlaceholderText: "Sequence Builder UI"
            },
            {
              title: "Unified Collaborative Inbox",
              description: "No more sharing passwords or forwarding emails. Your entire team can manage creator communications from a single, collaborative inbox with internal notes and approval workflows.",
              bullets: ["Shared team inbox","Internal tagging","Thread assignment"],
              imagePlaceholderText: "Team Inbox Interface"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"85%","label":"Open Rate"},{"value":"40%","label":"Reply Rate"},{"value":"10x","label":"Faster Sourcing"},{"value":"0","label":"Lost Threads"}]} />
        
        <PremiumCtaSection 
          title="Stop chasing creators manually."
          description="Automate your outreach and close more deals today."
        />
      </main>

      <Footer />
    </div>
  );
}
