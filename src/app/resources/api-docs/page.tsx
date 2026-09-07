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
          title="Developer"
          highlight="API Docs"
          description="Integrate UGC FY directly into your own internal tools, CRMs, and reporting dashboards."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Robust RESTful Endpoints",
              description: "Build powerful custom integrations. Our deeply documented API allows you to programmatically search creators, manage campaigns, and pull reporting data directly into your ERP.",
              bullets: ["Detailed schemas","Interactive console","Rate limit monitoring"],
              imagePlaceholderText: "API Documentation"
            },
            {
              title: "Real-Time Webhook Events",
              description: "Keep your systems perfectly synced. Subscribe to webhook events for when content is submitted, escrow is released, or a creator sends a message.",
              bullets: ["Event subscriptions","Payload validation","Retry logic"],
              imagePlaceholderText: "Webhook Dashboard"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"99.9%","label":"Uptime"},{"value":"REST","label":"Architecture"},{"value":"Real-time","label":"Webhooks"},{"value":"OAuth2","label":"Security"}]} />
        
        <PremiumCtaSection 
          title="Start building today."
          description="Read the docs and generate your API keys."
        />
      </main>

      <Footer />
    </div>
  );
}
