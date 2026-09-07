"use client";

import React from "react";

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PremiumFeatureSectionProps {
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

export default function PremiumFeatureSection({
  title,
  subtitle,
  features,
}: PremiumFeatureSectionProps) {
  return (
    <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-6">
            {title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-[var(--color-primary)]/30 hover:shadow-lg shadow-sm transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
