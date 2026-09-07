"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import FreeTrialModal from "./FreeTrialModal";

interface PremiumCtaSectionProps {
  title: string;
  description: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
}

export default function PremiumCtaSection({
  title,
  description,
  primaryCtaText = "Start Free Trial",
}: PremiumCtaSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        <div className="bg-[#0A0A0A] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Inner Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--color-primary)]/20 blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 relative z-10">
            {title}
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
            {description}
          </p>
          
          <div className="relative z-10 flex justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2 group text-lg px-10 py-5"
            >
              {primaryCtaText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      <FreeTrialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
