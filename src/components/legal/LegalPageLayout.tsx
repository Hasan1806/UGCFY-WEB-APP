"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { ArrowUp } from "lucide-react";
import { LEGAL_CONFIG } from "@/constants/legal";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, lastUpdated = LEGAL_CONFIG.lastUpdated, children }: LegalPageLayoutProps) {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar theme="dark" hideOnScroll />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              {title}
            </h1>
            {lastUpdated && (
              <p className="text-gray-500 font-medium">
                Last Updated: {lastUpdated}
              </p>
            )}
          </div>

          <div className="prose prose-gray max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-a:text-[#E11D48] hover:prose-a:text-[#BE123C]">
            {children}
          </div>
        </div>
      </main>

      <Footer />

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-gray-900 text-white shadow-xl transition-all duration-300 z-50 hover:bg-gray-800 ${
          showTopButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
