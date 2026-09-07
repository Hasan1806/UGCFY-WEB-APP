'use client';

import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function RedLanding() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-red-600 via-red-500 to-white pt-20 pb-10 flex flex-col items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-black/10" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-64 bg-gradient-to-t from-white to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-8">
        <div className="px-4 py-1.5 bg-white/20 border border-white/30 rounded-full text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          THE FUTURE OF INFLUENCER MARKETING
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-lg mb-4 max-w-3xl">
          Best AI-Powered UGC & Influencer Marketing Platform
        </h1>
        
        <p className="text-base text-white/90 max-w-2xl font-medium leading-relaxed drop-shadow-md mb-6">
          UGCFY is an AI-powered platform offering comprehensive, end-to-end features from creator discovery and outreach to campaign management, tracking, and reporting—all integrated within a single dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full sm:w-auto">
          <Link href="/get-started" className="btn-primary bg-black hover:bg-gray-900 text-white px-8 py-3.5 text-base rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/request-demo" className="btn-ghost px-8 py-3.5 text-base rounded-xl flex items-center justify-center gap-2 border border-white/50 hover:border-white transition-all bg-white/10 backdrop-blur-md hover:bg-white hover:text-black text-white">
            Book a Demo
          </Link>
        </div>
      </div>

      {/* 3D Rotating Cards Section */}
      <div className="relative z-10 w-full h-[350px] md:h-[450px] flex items-center justify-center my-8 md:my-12 py-10" style={{ perspective: '800px' }}>
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center preserve-3d" style={{ transform: 'rotateX(5deg)' }}>
            <motion.div 
              className="absolute w-full h-full flex items-center justify-center preserve-3d"
              animate={{ rotateY: [0, -360] }}
              transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
            >
              {[
                "http://creatornavigator.in/wp-content/uploads/2025/05/Hammer-Bash-.mp4",
                "http://creatornavigator.in/wp-content/uploads/2025/05/4.mp4",
                "http://creatornavigator.in/wp-content/uploads/2025/05/15.mp4",
                "http://creatornavigator.in/wp-content/uploads/2025/05/43.mp4",
                "http://creatornavigator.in/wp-content/uploads/2025/05/9.mp4",
                "http://creatornavigator.in/wp-content/uploads/2025/05/Hammer-Bash-.mp4",
                "http://creatornavigator.in/wp-content/uploads/2025/05/4.mp4",
                "http://creatornavigator.in/wp-content/uploads/2025/05/15.mp4"
              ].map((src, index) => {
                const rotation = (index * 360) / 8;
                return (
                  <div 
                    key={index} 
                    className="absolute w-[100px] h-[177px] md:w-[140px] md:h-[248px] flex-shrink-0 bg-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden preserve-3d"
                    style={{
                      // Responsive translation: adjusted radius for a balanced gap
                      transform: `rotateY(${rotation}deg) translateZ(calc(min(55vw, 320px)))`,
                    }}
                  >
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      src={src}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </motion.div>
        </div>
      </div>

      {/* Rating */}
      <div className="relative z-10 mt-auto flex flex-col items-center">
        <p className="text-gray-900 text-sm md:text-base font-bold mb-3 drop-shadow-sm">Rated 4.9/5 by 4,900+ clients</p>
        <div className="flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.88203 13.9987L4.96536 9.31536L1.33203 6.16536L6.13203 5.7487L7.9987 1.33203L9.86536 5.7487L14.6654 6.16536L11.032 9.31536L12.1154 13.9987L7.9987 11.5154L3.88203 13.9987Z" fill="#EAB308"/>
            </svg>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}} />
    </section>
  );
}
