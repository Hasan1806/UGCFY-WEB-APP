"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHero from "@/components/ui/PremiumHero";
import PremiumStats from "@/components/ui/PremiumStats";
import PremiumAlternatingFeatures from "@/components/ui/PremiumAlternatingFeatures";
import { useCookieConsent } from "@/context/CookieConsentProvider";
import CookieSettingsButton from "@/components/cookies/CookieSettingsButton";

export default function Page() {
  const { openSettings } = useCookieConsent();

  useEffect(() => {
    // Open settings modal automatically when arriving at this page
    openSettings();
  }, [openSettings]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar theme="dark" />
      
      <main className="flex-1">
        <PremiumHero 
          title="Privacy &"
          highlight="Cookies"
          description="Manage your data preferences and understand how we use cookies to improve your experience."
          icon={null}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Your Data, Your Control",
              description: "We believe in complete transparency. Review exactly what data we collect, why we collect it, and easily toggle your tracking preferences at any time.",
              bullets: ["Granular controls","Clear explanations","Easy opt-outs"],
              imagePlaceholderText: "Cookie Preferences UI"
            },
            {
              title: "Enterprise-Grade Security",
              description: "Your preferences are stored securely. We comply with all major global privacy regulations including GDPR and CCPA to ensure your data is always protected.",
              bullets: ["GDPR compliance","Encrypted storage","Regular audits"],
              imagePlaceholderText: "Security Badges"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"100%","label":"Transparent"},{"value":"GDPR","label":"Compliant"},{"value":"CCPA","label":"Ready"},{"value":"Total","label":"Control"}]} />
        
        <div className="py-24 bg-white text-center flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Update your preferences.</h2>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg">Take control of your data today by updating your cookie preferences.</p>
          <CookieSettingsButton className="px-8 py-4 rounded-xl bg-[#E11D48] text-white font-semibold text-lg hover:bg-[#BE123C] transition shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#E11D48]/30">
            Open Cookie Settings
          </CookieSettingsButton>
        </div>
      </main>

      <Footer />
    </div>
  );
}
