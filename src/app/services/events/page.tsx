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
          title="Exclusive Creator"
          highlight="Events"
          description="Connect with top-tier creators in person at our exclusive, invite-only brand activation events around the globe."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Intimate VIP Activations",
              description: "Skip the cold emails and build real relationships. We host curated, high-end events in major cities where your brand can mingle directly with top creators in your niche.",
              bullets: ["Curated guest lists","High-end venues","Relationship building"],
              imagePlaceholderText: "Event Photography"
            },
            {
              title: "Live Content Generation",
              description: "Don't just network—create. Our events feature designed activation zones where creators can shoot authentic, high-quality content with your products live on site.",
              bullets: ["Custom activation zones","On-site production","Immediate asset delivery"],
              imagePlaceholderText: "Live Activation Setup"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Global","label":"Locations"},{"value":"Top 1%","label":"Creators"},{"value":"Live","label":"Content"},{"value":"VIP","label":"Networking"}]} />
        
        <PremiumCtaSection 
          title="Build real relationships."
          description="Sponsor our next creator event."
        />
      </main>

      <Footer />
    </div>
  );
}
