"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Smartphone } from "lucide-react";
import AppComingSoonModal from "./landing/AppComingSoonModal";
import CookieSettingsButton from "./cookies/CookieSettingsButton";

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<"app-store" | "google-play" | "mobile-app">("mobile-app");

  const handleOpenModal = (platform: "app-store" | "google-play") => {
    setModalPlatform(platform);
    setModalOpen(true);
  };
  return (
    <footer className="bg-white text-gray-900 pt-10 pb-10 border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 pr-0 lg:pr-12">
            <div className="flex items-center mb-6">
              <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={140} height={44} className="w-[115px] md:w-[140px] h-auto object-contain" />
            </div>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8 max-w-sm">
              The ultra-premium creator platform for high-converting 9:16 video formats, authentic UGC, and automated influencer marketing.
            </p>
            <div className="flex items-center gap-4">
              {['Tw', 'In', 'Ig'].map((social) => (
                <button key={social} className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#E11D48] hover:text-[#E11D48] transition-colors shadow-sm">
                  <span className="text-xs font-bold">{social}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="lg:col-span-1">
            <h4 className="font-bold tracking-widest uppercase mb-6 text-xs text-gray-900">Platform</h4>
            <ul className="space-y-4 text-gray-500 text-[15px] font-medium">
              <li><Link href="/platform/discover" className="hover:text-[#E11D48] transition-colors">Creator Discovery</Link></li>
              <li><Link href="/platform/manage" className="hover:text-[#E11D48] transition-colors">Campaign Management</Link></li>
              <li><Link href="/platform/reporting" className="hover:text-[#E11D48] transition-colors">Analytics & ROI</Link></li>
              <li><Link href="/ecosystem/creators" className="hover:text-[#E11D48] transition-colors">Creators</Link></li>
              <li><Link href="/ecosystem/brands" className="hover:text-[#E11D48] transition-colors">Brands</Link></li>
              <li><Link href="/ecosystem/download-app" className="hover:text-[#E11D48] transition-colors">Download App</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:col-span-1">
            <h4 className="font-bold tracking-widest uppercase mb-6 text-xs text-gray-900">Resources</h4>
            <ul className="space-y-4 text-gray-500 text-[15px] font-medium">
              <li><Link href="/case-studies" className="hover:text-[#E11D48] transition-colors">Case Studies</Link></li>
              <li><Link href="/blog" className="hover:text-[#E11D48] transition-colors">Blog & Guides</Link></li>
              <li><Link href="/support" className="hover:text-[#E11D48] transition-colors">Help Center</Link></li>
              <li><Link href="/api-docs" className="hover:text-[#E11D48] transition-colors">API Documentation</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="lg:col-span-1">
            <h4 className="font-bold tracking-widest uppercase mb-6 text-xs text-gray-900">Legal</h4>
            <ul className="space-y-4 text-gray-500 text-[15px] font-medium">
              <li><Link href="/legal/privacy-policy" className="hover:text-[#E11D48] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms-and-conditions" className="hover:text-[#E11D48] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/legal/community-guidelines" className="hover:text-[#E11D48] transition-colors">Community Guidelines</Link></li>
              <li><Link href="/legal/security" className="hover:text-[#E11D48] transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Column 5: App Store */}
          <div className="lg:col-span-1">
            <h4 className="font-bold tracking-widest uppercase mb-6 text-xs text-gray-900">Get The App</h4>
            <p className="text-gray-500 text-sm mb-6">Manage your campaigns directly from your phone.</p>
            <div className="flex flex-col gap-3">
              <button 
                type="button" 
                onClick={() => handleOpenModal("app-store")}
                className="flex items-center justify-center gap-3 bg-[#0A0A0A] text-white hover:bg-gray-800 rounded-xl px-4 py-3 transition-colors shadow-md w-full sm:w-auto lg:w-full"
              >
                <Smartphone className="w-6 h-6" /> 
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] leading-none text-gray-300 mb-0.5">Download on the</span>
                  <span className="text-sm font-semibold leading-none">App Store</span>
                </div>
              </button>
              <button 
                type="button" 
                onClick={() => handleOpenModal("google-play")}
                className="flex items-center justify-center gap-3 bg-[#0A0A0A] text-white hover:bg-gray-800 rounded-xl px-4 py-3 transition-colors shadow-md w-full sm:w-auto lg:w-full"
              >
                <Smartphone className="w-6 h-6" /> 
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] leading-none text-gray-300 mb-0.5">GET IT ON</span>
                  <span className="text-sm font-semibold leading-none">Google Play</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500 font-medium">
          <p className="text-gray-400">© {new Date().getFullYear()} UGCFY Inc. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            <Link href="/support" className="hover:text-[#E11D48] transition-colors">Support</Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>

      <AppComingSoonModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        platform={modalPlatform} 
      />
    </footer>
  );
}
