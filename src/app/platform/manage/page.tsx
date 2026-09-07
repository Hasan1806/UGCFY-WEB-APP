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
          title="Complete Campaign"
          highlight="Management"
          description="Track deliverables, manage content approvals, and oversee your entire creator pipeline from a single dashboard."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Visual Kanban Pipeline",
              description: "Drag and drop creators through your custom pipeline stages. Instantly see who is in negotiation, who is shooting content, and whose assets are ready for review.",
              bullets: ["Customizable stages","Drag-and-drop UI","Status alerts"],
              imagePlaceholderText: "Kanban Board UI"
            },
            {
              title: "Frame-Accurate Approvals",
              description: "Review video drafts directly in the platform. Leave time-stamped comments and visual annotations so creators know exactly what needs to be changed before final delivery.",
              bullets: ["Time-stamped feedback","Version control","Direct messaging"],
              imagePlaceholderText: "Video Review Tool"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"50%","label":"Less Admin Work"},{"value":"100%","label":"Visibility"},{"value":"0","label":"Missed Deadlines"},{"value":"10k+","label":"Assets Managed"}]} />
        
        <PremiumCtaSection 
          title="Take control of your campaigns."
          description="Bring order to the chaos of influencer marketing."
        />
      </main>

      <Footer />
    </div>
  );
}
