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
          title="Actionable Campaign"
          highlight="Reporting"
          description="Measure the exact ROI, CPA, and engagement metrics of every creator and piece of content in real-time."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Live ROI & Attribution Tracking",
              description: "Connect your Shopify or CRM to track exactly which creators are driving bottom-line revenue. View CPAs, ROAS, and conversion rates at the individual creator level.",
              bullets: ["Shopify integration","Pixel tracking","Creator-level ROAS"],
              imagePlaceholderText: "ROI Analytics Chart"
            },
            {
              title: "White-Labeled PDF Reports",
              description: "Businesses and teams can automatically generate beautiful, comprehensive PDF reports featuring your brand's logo, colors, and specific KPIs to share with stakeholders.",
              bullets: ["Automated generation","Custom branding","Scheduled delivery"],
              imagePlaceholderText: "Report Builder UI"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Real-Time","label":"Analytics"},{"value":"100%","label":"Attribution"},{"value":"Custom","label":"Dashboards"},{"value":"1-Click","label":"Exports"}]} />
        
        <PremiumCtaSection 
          title="Stop guessing your ROI."
          description="Get the data you need to scale what works."
        />
      </main>

      <Footer />
    </div>
  );
}
