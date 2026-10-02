'use client';

import { Sparkles, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function RedLanding() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFEDF0] via-[#FFF5F7] to-[#FFFFFF] md:from-[#FFE4E8] md:via-[#FFF0F3] md:to-[#FFFFFF] pt-24 sm:pt-28 pb-12 flex flex-col items-center justify-between select-none">
      
      {/* 1. TOP AMBIENT CRIMSON RADIANCE (Essence of Red) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1200px] h-[520px] rounded-full pointer-events-none z-0 opacity-50 md:opacity-100"
        style={{
          background: 'radial-gradient(circle, rgba(239, 35, 60, 0.28) 0%, rgba(225, 29, 72, 0.18) 36%, rgba(255, 107, 53, 0.08) 60%, transparent 80%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 2. CENTER STAGE GLOW BEHIND 3D ROTATING CARDS */}
      <div 
        className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] rounded-full pointer-events-none z-0 opacity-40 md:opacity-100"
        style={{
          background: 'radial-gradient(circle, rgba(239, 35, 60, 0.24) 0%, rgba(225, 29, 72, 0.12) 48%, transparent 75%)',
          filter: 'blur(60px)',
        }}
      />

      {/* 3. SIDE AMBIENT LIGHT LEAKS */}
      <div className="hidden md:block absolute -left-20 top-40 w-96 h-96 rounded-full bg-rose-500/12 blur-3xl pointer-events-none z-0" />
      <div className="hidden md:block absolute -right-20 top-40 w-96 h-96 rounded-full bg-red-500/12 blur-3xl pointer-events-none z-0" />

      {/* 4. TACTILE DOT-MATRIX TEXTURE (Balanced rose dots on mobile, full on desktop) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-45 md:opacity-75"
        style={{
          backgroundImage: 'radial-gradient(rgba(225, 29, 72, 0.22) 1.35px, transparent 1.35px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, #000 45%, transparent 92%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, #000 45%, transparent 92%)',
        }}
      />

      {/* 5. SUBTLE ARCHITECTURAL GRID LINES (Rose Tinted) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-30 md:opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(225, 29, 72, 0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(225, 29, 72, 0.045) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 35%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 35%, transparent 88%)',
        }}
      />

      {/* 6. CONCENTRIC FAINT ORBITAL RINGS */}
      <div className="hidden md:block absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] rounded-full border border-rose-500/15 pointer-events-none z-0" />
      <div className="hidden md:block absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[740px] sm:w-[940px] h-[740px] sm:h-[940px] rounded-full border border-rose-500/10 pointer-events-none z-0" />

      {/* HERO CONTENT */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-2 sm:mt-4">
        {/* Eyebrow Badge */}
        <div 
          className="px-4 py-1.5 bg-white/90 border border-rose-200/90 rounded-full text-brand-red-600 text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md mb-5 shadow-[0_2px_12px_rgba(239,35,60,0.08)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red-600 animate-pulse shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
          <Sparkles className="w-3.5 h-3.5 text-brand-red-500" />
          <span>The Future of Influencer Marketing</span>
        </div>
        
        {/* Main Headline */}
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 leading-[1.08] tracking-tight mb-5 max-w-4xl"
        >
          Best AI-Powered <span className="bg-gradient-to-r from-brand-red-600 via-[#EF233C] to-rose-500 bg-clip-text text-transparent drop-shadow-xs">UGC &amp; Influencer</span> Marketing Platform
        </h1>
        
        {/* Subtitle */}
        <p 
          className="text-base sm:text-lg text-gray-600 max-w-2xl font-normal leading-relaxed mb-7 sm:mb-8"
        >
          UGCFY is an AI-powered platform offering comprehensive, end-to-end features from creator discovery and outreach to campaign management, tracking, and reporting—all integrated within a single dashboard.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 mb-4 sm:mb-6 w-full sm:w-auto"
        >
          <Link 
            href="/get-started" 
            className="bg-gradient-to-r from-brand-red-600 to-[#EF233C] hover:from-[#BE123C] hover:to-brand-red-600 text-white font-bold px-8 py-3.5 text-base rounded-xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(239,35,60,0.28)] hover:shadow-[0_15px_40px_rgba(239,35,60,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/request-demo" 
            className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3.5 text-base rounded-xl flex items-center justify-center gap-2 border border-gray-200/90 shadow-xs hover:border-gray-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Book a Demo
          </Link>
        </div>
      </div>

      {/* 3D ROTATING VIDEO CAROUSEL */}
      <div className="relative z-10 w-full h-[320px] sm:h-[370px] md:h-[440px] flex items-center justify-center my-4 sm:my-6 md:my-8 py-6" style={{ perspective: '850px' }}>
        {/* Stage Underglow Reflection */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[580px] md:w-[720px] h-[100px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="relative w-full max-w-6xl h-full flex items-center justify-center preserve-3d" style={{ transform: 'rotateX(5deg)' }}>
            <div 
              className="absolute w-full h-full flex items-center justify-center carousel-3d-track"
            >
              {[
                "/videos/card-1.mp4",
                "/videos/card-2.mp4",
                "/videos/card-3.mp4",
                "/videos/card-4.mp4",
                "/videos/card-5.mp4",
                "/videos/card-6.mp4",
                "/videos/card-7.mp4",
                "/videos/card-8.mp4"
              ].map((src, index) => {
                const rotation = (index * 360) / 8;
                return (
                  <div 
                    key={index} 
                    className="absolute w-[100px] h-[177px] md:w-[140px] md:h-[248px] flex-shrink-0 bg-gray-950 rounded-xl md:rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.16)] overflow-hidden preserve-3d border-2 border-white ring-1 ring-black/5 hover:ring-rose-500/40 transition-all"
                    style={{
                      transform: `rotateY(${rotation}deg) translateZ(calc(min(55vw, 320px)))`,
                    }}
                  >
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      preload="none"
                      src={src}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
        </div>
      </div>

      {/* SOCIAL PROOF & RATING BADGE */}
      <div className="relative z-10 mt-2 sm:mt-4 flex flex-col items-center px-4">
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-2xl sm:rounded-full border border-gray-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-300">
          {/* Creator & Brand Avatars */}
          <div className="flex items-center -space-x-2.5 overflow-hidden">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-white overflow-hidden shadow-sm bg-gray-100">
              <Image 
                src="/images/avatars/avatar-1.jpg" 
                alt="Verified Creator Pooja" 
                width={32} 
                height={32} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-white overflow-hidden shadow-sm bg-gray-100">
              <Image 
                src="/images/avatars/avatar-2.jpg" 
                alt="Verified Creator Rohan" 
                width={32} 
                height={32} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-white overflow-hidden shadow-sm bg-gray-100">
              <Image 
                src="/images/avatars/avatar-3.jpg" 
                alt="Verified Creator Priya" 
                width={32} 
                height={32} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-white overflow-hidden shadow-sm bg-gray-100">
              <Image 
                src="/images/avatars/avatar-4.jpg" 
                alt="Verified Creator Aditya" 
                width={32} 
                height={32} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-white overflow-hidden shadow-sm bg-gray-100">
              <Image 
                src="/images/avatars/avatar-5.jpg" 
                alt="Verified Creator Vikram" 
                width={32} 
                height={32} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          {/* Ratings & Verification Copy */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-extrabold text-gray-950 text-sm">4.72/5</span>
              <span className="text-xs text-gray-500 font-medium">(1000+ reviews)</span>
            </div>

            <span className="text-gray-300 text-xs hidden sm:inline">•</span>

            <span className="text-xs sm:text-sm text-gray-700 font-medium">
              Trusted by <span className="font-bold text-gray-950">250+ Brands</span> &amp; <span className="font-bold text-gray-950">150+ Creators</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              Verified Customers
            </span>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .preserve-3d {
          transform-style: preserve-3d;
        }
        @keyframes rotate3dCarousel {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(-360deg);
          }
        }
        .carousel-3d-track {
          transform-style: preserve-3d;
          animation: rotate3dCarousel 35s linear infinite;
          will-change: transform;
        }
      `}} />
    </section>
  );
}
