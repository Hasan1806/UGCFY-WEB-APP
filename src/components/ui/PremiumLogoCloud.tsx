"use client";

import React from "react";

export default function PremiumLogoCloud() {
  const logos = [
    "ACME Corp", "GlobalTech", "Nexus", "Stark Ind.", "Umbrella", "Initech", "Soylent", "Massive Dynamic"
  ];

  return (
    <div className="py-12 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 mb-6 text-center">
        <p className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Trusted by forward-thinking brands worldwide</p>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-4">
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <span key={idx} className="text-2xl font-black text-slate-300 opacity-60">
              {logo}
            </span>
          ))}
        </div>
        
        {/* Gradients to fade edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
      </div>
    </div>
  );
}
