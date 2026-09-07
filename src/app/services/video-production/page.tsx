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
          title="Professional"
          highlight="Video Editing"
          description="Transform raw creator footage into high-converting, polished ads optimized for paid social."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Direct Response Editing",
              description: "Raw UGC is great, but edited UGC converts better. Our editors add dynamic captions, fast-paced cuts, and motion graphics designed specifically to stop the scroll and lower CPA.",
              bullets: ["Pacing optimization","Dynamic captions","Sound design"],
              imagePlaceholderText: "Video Editing Suite"
            },
            {
              title: "Iterative Testing Variations",
              description: "We don't just deliver one video. For every raw asset, we provide 3 different hook variations and aspect ratios so your media buying team can test and scale the winner.",
              bullets: ["Hook variations","Multi-platform sizing","Iterative refinement"],
              imagePlaceholderText: "A/B Test Variations"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Direct","label":"Response"},{"value":"48h","label":"Turnaround"},{"value":"A/B","label":"Testing"},{"value":"Motion","label":"Graphics"}]} />
        
        <PremiumCtaSection 
          title="Upgrade your ad creatives."
          description="Turn raw footage into high-performing ads."
        />
      </main>

      <Footer />
    </div>
  );
}
