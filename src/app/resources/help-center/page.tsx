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
          title="UGC FY"
          highlight="Help Center"
          description="Everything you need to know about using the platform, managing campaigns, and resolving issues."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Comprehensive Knowledge Base",
              description: "Find answers instantly. Our extensive library of articles covers everything from setting up your first campaign to handling complex tax compliance issues.",
              bullets: ["Searchable database","Step-by-step tutorials","Troubleshooting guides"],
              imagePlaceholderText: "Help Center Search"
            },
            {
              title: "Expert Human Support",
              description: "When articles aren't enough, our dedicated customer success team is available 24/7 via live chat to help you resolve issues and optimize your campaigns.",
              bullets: ["Live chat support","Dedicated account managers","Strategic advice"],
              imagePlaceholderText: "Support Chat Interface"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"24/7","label":"Support"},{"value":"<5m","label":"Response Time"},{"value":"100+","label":"Articles"},{"value":"Video","label":"Guides"}]} />
        
        <PremiumCtaSection 
          title="Need assistance?"
          description="We're here to ensure your success on the platform."
        />
      </main>

      <Footer />
    </div>
  );
}
