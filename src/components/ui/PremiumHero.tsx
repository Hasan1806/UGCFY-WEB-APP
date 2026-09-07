"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PremiumHeroProps {
  title: string;
  highlight?: string;
  description: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  icon?: React.ReactNode;
}

export default function PremiumHero({
  title,
  highlight,
  description,
  primaryCtaText = "Get Started",
  primaryCtaHref = "/get-started",
  secondaryCtaText = "Book a Demo",
  secondaryCtaHref = "/request-demo",
  icon,
}: PremiumHeroProps) {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--color-primary)]/10 blur-[120px] rounded-full pointer-events-none opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-rose-200/40 blur-[100px] rounded-full pointer-events-none opacity-60"></div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {icon && (
          <div className="mb-6 w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
            {icon}
          </div>
        )}
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter max-w-4xl leading-tight mb-6">
          {title} {highlight && <span className="text-[var(--color-primary)]">{highlight}</span>}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-10">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href={primaryCtaHref} className="btn-primary flex items-center gap-2 group text-lg px-8 py-4 w-full sm:w-auto justify-center">
            {primaryCtaText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href={secondaryCtaHref} className="text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-bold rounded-xl transition-all text-lg px-8 py-4 w-full sm:w-auto justify-center flex items-center shadow-sm">
            {secondaryCtaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
