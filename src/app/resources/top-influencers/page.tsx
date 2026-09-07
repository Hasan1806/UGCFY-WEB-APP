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
          title="Meet the Top"
          highlight="Creators"
          description="Browse our curated list of the highest-performing, vetted creators across every major niche."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "The Best of the Best",
              description: "We constantly monitor performance data across our platform. This curated directory features creators who consistently deliver high ROAS, hit deadlines, and require zero hand-holding.",
              bullets: ["Performance ranked","Reliability scores","Niche categorization"],
              imagePlaceholderText: "Top Creator Directory"
            },
            {
              title: "Transparent Pricing",
              description: "No more guessing games. View standard rates, bundle discounts, and past brand collaborations directly on their public profiles.",
              bullets: ["Upfront rates","Portfolio access","Availability status"],
              imagePlaceholderText: "Creator Profile Example"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Top 1%","label":"Vetted"},{"value":"All","label":"Niches"},{"value":"Verified","label":"Metrics"},{"value":"Ready","label":"To Work"}]} />
        
        <PremiumCtaSection 
          title="Work with proven winners."
          description="Start browsing the top creators in your niche."
        />
      </main>

      <Footer />
    </div>
  );
}
