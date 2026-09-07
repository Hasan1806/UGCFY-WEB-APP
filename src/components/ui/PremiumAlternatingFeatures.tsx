"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import AnalyticsMockup from "../landing/visuals/AnalyticsMockup";
import BrandCreatorChatMockup from "../landing/visuals/BrandCreatorChatMockup";

export interface AlternatingFeature {
  title: string;
  description: string;
  bullets: string[];
  imagePlaceholderText: string;
}

interface PremiumAlternatingFeaturesProps {
  features: AlternatingFeature[];
}

export default function PremiumAlternatingFeatures({ features }: PremiumAlternatingFeaturesProps) {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col gap-32">
        {features.map((feature, idx) => {
          const isEven = idx % 2 === 0;
          
          return (
            <div key={idx} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
              
              {/* Text Side */}
              <div className="flex-1 space-y-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {feature.title}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                  {feature.description}
                </p>
                <ul className="space-y-4">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
                      <span className="text-slate-700 font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Side (High-Fidelity Image) */}
              <div className="flex-1 w-full">
                <div className="relative w-full aspect-[4/3] rounded-3xl bg-slate-100 border border-slate-200/50 shadow-2xl overflow-hidden group">
                  {/* Subtle Glow Behind Image */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--color-primary)]/10 blur-[80px] group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
                  
                  {/* The High-Fidelity Image */}
                  <div className="absolute inset-0 w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700">
                    {isEven ? <AnalyticsMockup /> : <BrandCreatorChatMockup />}
                  </div>
                  
                  {/* Glassmorphic Overlay Gradient for Premium Polish */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/10 via-transparent to-white/20 pointer-events-none mix-blend-overlay"></div>
                  
                  {/* Floating Glass Pill for Context */}
                  <div className="absolute bottom-6 left-6 right-6 md:left-8 md:right-auto bg-white/80 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl p-4 flex items-center gap-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{feature.title}</p>
                      <p className="text-xs text-slate-500 font-medium">{feature.imagePlaceholderText}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
