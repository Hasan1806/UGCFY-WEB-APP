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
          title="Proven"
          highlight="Results"
          description="See exactly how top brands use UGC FY to drop their CPAs by 40% and scale their ad spend."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "E-Commerce Success Stories",
              description: "Read how leading beauty, apparel, and CPG brands overhauled their paid social strategy by replacing studio shoots with high-volume UGC sourcing.",
              bullets: ["Before & After CPAs","Creative strategy","Scaling tactics"],
              imagePlaceholderText: "Case Study Data"
            },
            {
              title: "B2B & SaaS Applications",
              description: "UGC isn't just for lip gloss. See how enterprise software companies are using authentic creator voices to humanize their brand and drive B2B leads.",
              bullets: ["Lead gen strategies","LinkedIn UGC","Complex product explainers"],
              imagePlaceholderText: "B2B SaaS Metrics"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"40%","label":"CPA Reduction"},{"value":"10x","label":"Volume"},{"value":"50+","label":"Case Studies"},{"value":"Real","label":"Metrics"}]} />
        
        <PremiumCtaSection 
          title="See the data for yourself."
          description="Read our extensive library of success stories."
        />
      </main>

      <Footer />
    </div>
  );
}
