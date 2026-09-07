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
          title="Secure & Global"
          highlight="Payments"
          description="Pay creators globally in their preferred currency with 100% security through our proprietary Escrow Protection system."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Escrow Protection Protocol",
              description: "Your budget is safe. Funds are held in a secure escrow account and are only released to the creator once you explicitly approve the final deliverables.",
              bullets: ["Risk-free transactions","Automated release","Dispute resolution"],
              imagePlaceholderText: "Escrow Dashboard"
            },
            {
              title: "Global Compliance & Tax",
              description: "We handle the regulatory nightmare. From collecting W-9s and W-8BENs to automatically generating 1099s at year-end, your accounting team stays perfectly compliant.",
              bullets: ["Automated W-9 collection","Year-end 1099 generation","Cross-border compliance"],
              imagePlaceholderText: "Tax & Compliance Hub"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"130+","label":"Currencies"},{"value":"0%","label":"Risk"},{"value":"1099","label":"Tax Automation"},{"value":"1-Click","label":"Bulk Payouts"}]} />
        
        <PremiumCtaSection 
          title="Simplify your creator payouts."
          description="Pay securely, globally, and compliantly."
        />
      </main>

      <Footer />
    </div>
  );
}
