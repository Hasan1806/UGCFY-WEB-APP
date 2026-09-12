"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import RequestAccessModal from "./RequestAccessModal";
import { MegaMenuPanel, PLATFORM_DATA, ECOSYSTEM_DATA, RESOURCES_DATA, SERVICES_DATA, COMPANY_DATA } from "./MegaMenu";

interface NavbarProps {
  theme?: "light" | "dark" | "transparent-to-dark";
  hideOnScroll?: boolean;
}

export default function Navbar({ theme = "light", hideOnScroll = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const isLight = theme === "light";

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 20);

      // Hide on scroll logic (don't hide if mobile menu is open)
      if (hideOnScroll && !isMobileMenuOpen) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false); // Scrolling down
        } else if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);  // Scrolling up
        }
        lastScrollY.current = currentScrollY;
      }
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideOnScroll, isMobileMenuOpen]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, []);

  const headerBg = isLight
    ? scrolled
      ? "bg-[#FFF2F5]/95 md:bg-gradient-to-r md:from-[#FFE0E6]/95 md:via-[#FFF2F5]/95 md:to-[#FFE0E6]/95 backdrop-blur-2xl border-b border-rose-200/90 md:border-rose-300/80 shadow-[0_4px_20px_rgba(225,29,72,0.05)] md:shadow-[0_10px_35px_rgba(225,29,72,0.1)]"
      : "bg-[#FFF8FA]/90 md:bg-gradient-to-r md:from-[#FFE8EC]/90 md:via-[#FFF0F3]/90 md:to-[#FFE8EC]/90 backdrop-blur-xl border-b border-rose-100/90 md:border-rose-200/90 shadow-[0_2px_15px_rgba(225,29,72,0.03)] md:shadow-[0_4px_30px_rgba(225,29,72,0.07)]"
    : scrolled || theme === "dark" || isMobileMenuOpen
    ? "bg-[#000000] shadow-xl border-b border-white/10"
    : "bg-transparent backdrop-blur-md border-b border-white/10";

  const transformStyle = hideOnScroll && !isVisible && !isMobileMenuOpen ? "-translate-y-full" : "translate-y-0";

  const mobileNavSections = [
    { title: "Platform", key: "platform", data: PLATFORM_DATA },
    { title: "Ecosystem", key: "ecosystem", data: ECOSYSTEM_DATA },
    { title: "Resources", key: "resources", data: RESOURCES_DATA },
    { title: "Services", key: "services", data: SERVICES_DATA },
    { title: "Company", key: "company", data: COMPANY_DATA },
  ];

  const toggleSection = (key: string) => {
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${transformStyle} ${headerBg}`}>
        {/* Top & Bottom ambient crimson hairline accents */}
        {isLight && (
          <>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E11D48] to-transparent pointer-events-none opacity-50 md:opacity-80" />
            <div className="hidden md:block absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/50 to-transparent pointer-events-none" />
          </>
        )}

        <div className="max-w-[1280px] mx-auto px-6 h-[74px] flex items-center justify-between">
          <Link href="/" className="flex items-center group/logo py-2" onClick={() => setIsMobileMenuOpen(false)}>
            <Image 
              src="/brand/ugcfy-logo.png" 
              alt="UGCFY" 
              width={145} 
              height={42} 
              className={`h-8 w-auto object-contain transition-transform duration-200 group-hover/logo:scale-[1.03] ${isLight ? '' : 'brightness-0 invert'}`} 
              priority 
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1.5 font-medium text-[14.5px] h-full">
            {/* PLATFORM MEGA MENU */}
            <div className="group px-1.5 py-4 cursor-pointer flex items-center h-full">
              <span className={`flex items-center gap-1.5 font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-200 border ${
                isLight 
                  ? 'text-slate-800 group-hover:text-brand-red-600 group-hover:bg-rose-100/90 border-transparent group-hover:border-rose-200/90 shadow-2xs group-hover:shadow-xs' 
                  : 'text-white/90 group-hover:text-white group-hover:bg-white/5 border-transparent'
              }`}>
                Platform 
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 ${
                  isLight ? 'text-rose-400 group-hover:text-brand-red-600' : 'text-white/70 group-hover:text-white'
                }`} />
              </span>
              <MegaMenuPanel data={PLATFORM_DATA} theme={isLight ? "light" : "dark"} />
            </div>

            {/* ECOSYSTEM MEGA MENU */}
            <div className="group px-1.5 py-4 cursor-pointer flex items-center h-full">
              <span className={`flex items-center gap-1.5 font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-200 border ${
                isLight 
                  ? 'text-slate-800 group-hover:text-brand-red-600 group-hover:bg-rose-100/90 border-transparent group-hover:border-rose-200/90 shadow-2xs group-hover:shadow-xs' 
                  : 'text-white/90 group-hover:text-white group-hover:bg-white/5 border-transparent'
              }`}>
                Ecosystem 
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 ${
                  isLight ? 'text-rose-400 group-hover:text-brand-red-600' : 'text-white/70 group-hover:text-white'
                }`} />
              </span>
              <MegaMenuPanel data={ECOSYSTEM_DATA} theme={isLight ? "light" : "dark"} />
            </div>

            {/* RESOURCES MEGA MENU */}
            <div className="group px-1.5 py-4 cursor-pointer flex items-center h-full">
              <span className={`flex items-center gap-1.5 font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-200 border ${
                isLight 
                  ? 'text-slate-800 group-hover:text-brand-red-600 group-hover:bg-rose-100/90 border-transparent group-hover:border-rose-200/90 shadow-2xs group-hover:shadow-xs' 
                  : 'text-white/90 group-hover:text-white group-hover:bg-white/5 border-transparent'
              }`}>
                Resources 
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 ${
                  isLight ? 'text-rose-400 group-hover:text-brand-red-600' : 'text-white/70 group-hover:text-white'
                }`} />
              </span>
              <MegaMenuPanel data={RESOURCES_DATA} theme={isLight ? "light" : "dark"} />
            </div>

            {/* SERVICES MEGA MENU */}
            <div className="group px-1.5 py-4 cursor-pointer flex items-center h-full">
              <span className={`flex items-center gap-1.5 font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-200 border ${
                isLight 
                  ? 'text-slate-800 group-hover:text-brand-red-600 group-hover:bg-rose-100/90 border-transparent group-hover:border-rose-200/90 shadow-2xs group-hover:shadow-xs' 
                  : 'text-white/90 group-hover:text-white group-hover:bg-white/5 border-transparent'
              }`}>
                Services 
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 ${
                  isLight ? 'text-rose-400 group-hover:text-brand-red-600' : 'text-white/70 group-hover:text-white'
                }`} />
              </span>
              <MegaMenuPanel data={SERVICES_DATA} theme={isLight ? "light" : "dark"} />
            </div>

            {/* COMPANY MEGA MENU */}
            <div className="group px-1.5 py-4 cursor-pointer flex items-center h-full">
              <span className={`flex items-center gap-1.5 font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-200 border ${
                isLight 
                  ? 'text-slate-800 group-hover:text-brand-red-600 group-hover:bg-rose-100/90 border-transparent group-hover:border-rose-200/90 shadow-2xs group-hover:shadow-xs' 
                  : 'text-white/90 group-hover:text-white group-hover:bg-white/5 border-transparent'
              }`}>
                Company 
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 ${
                  isLight ? 'text-rose-400 group-hover:text-brand-red-600' : 'text-white/70 group-hover:text-white'
                }`} />
              </span>
              <MegaMenuPanel data={COMPANY_DATA} theme={isLight ? "light" : "dark"} />
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/login" 
              className={`font-bold text-[13.5px] px-5 py-2.5 rounded-xl border transition-all ${
                isLight 
                  ? 'bg-white/95 hover:bg-white text-slate-900 hover:text-brand-red-600 border-rose-300/90 shadow-[0_2px_10px_rgba(225,29,72,0.08)] hover:shadow-[0_4px_16px_rgba(225,29,72,0.15)] hover:border-rose-400 active:scale-[0.98]' 
                  : 'btn-white hover:bg-neutral-100'
              }`}
            >
              I am a Brand
            </Link>
            {!loadingAuth && (
              isAuthenticated ? (
                <Link 
                  href="/dashboard" 
                  className="bg-gradient-to-r from-[#E11D48] via-[#EF233C] to-[#BE123C] text-white font-bold text-[13.5px] px-6 py-2.5 rounded-xl shadow-[0_4px_18px_rgba(225,29,72,0.36)] hover:shadow-[0_6px_24px_rgba(225,29,72,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all ml-2"
                >
                  Brand Portal
                </Link>
              ) : (
                <Link 
                  href="/get-started" 
                  className="bg-gradient-to-r from-[#E11D48] via-[#EF233C] to-[#BE123C] bg-[length:200%_auto] hover:bg-right text-white font-bold text-[13.5px] px-6 py-2.5 rounded-xl shadow-[0_4px_20px_rgba(225,29,72,0.38)] hover:shadow-[0_6px_28px_rgba(225,29,72,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started
                </Link>
              )
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className={`p-2 rounded-xl transition-all ${
                isLight 
                  ? 'text-slate-800 hover:text-brand-red-600 hover:bg-rose-100 border border-rose-200 shadow-2xs' 
                  : 'text-white hover:text-[var(--color-primary)] bg-white/5'
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
            </button>
          </div>
        </div>
      </header>

      {/* FULL SCREEN MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className={`fixed inset-0 z-[100] lg:hidden flex flex-col h-[100dvh] w-screen overflow-hidden animate-in fade-in duration-200 ${isLight ? 'bg-white/99 backdrop-blur-2xl' : 'bg-[#050505]'}`}>
          {/* Top Bar matching header */}
          <div className={`h-[74px] px-6 flex items-center justify-between border-b shrink-0 ${isLight ? 'bg-white border-rose-100' : 'bg-[#000000] border-white/10'}`}>
            <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <Image 
                src="/brand/ugcfy-logo.png" 
                alt="UGCFY" 
                width={140} 
                height={40} 
                className={`h-8 w-auto object-contain ${isLight ? '' : 'brightness-0 invert'}`} 
                priority 
              />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`p-2 rounded-xl transition-all ${isLight ? 'text-slate-800 hover:text-brand-red-600 hover:bg-rose-50 border border-rose-100' : 'text-white hover:text-[var(--color-primary)]'}`}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Nav Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 pb-12 flex flex-col justify-between">
            {/* Nav Menu Links */}
            <div className={`flex flex-col divide-y ${isLight ? 'text-slate-900 divide-rose-100/80' : 'text-white divide-white/5'}`}>
              {mobileNavSections.map((section) => {
                const isExpanded = expandedSection === section.key;
                return (
                  <div key={section.key} className="py-3">
                    <button
                      onClick={() => toggleSection(section.key)}
                      className={`w-full flex items-center justify-between py-2 text-base font-bold text-left transition-colors ${
                        isExpanded ? 'text-brand-red-600' : isLight ? 'text-slate-900 hover:text-brand-red-600' : 'text-white hover:text-brand-red-400'
                      }`}
                    >
                      <span>{section.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-brand-red-600" : isLight ? "text-slate-400" : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Sub-items dropdown */}
                    {isExpanded && (
                      <div className={`mt-2 mb-2 pl-3 flex flex-col gap-1.5 border-l-2 animate-in fade-in slide-in-from-top-1 duration-150 ${isLight ? 'border-rose-400' : 'border-white/10'}`}>
                        {section.data.cards.map((card, idx) => {
                          const Icon = card.icon;
                          return (
                            <Link
                              key={idx}
                              href={card.href || "#"}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all group ${isLight ? 'hover:bg-rose-100/80 active:bg-rose-200/70' : 'hover:bg-white/5'}`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isLight ? 'bg-rose-100 text-brand-red-600 border border-rose-200' : 'bg-white/5 text-gray-400 group-hover:text-[var(--color-primary)]'}`}>
                                <Icon className="w-4 h-4 text-brand-red-600 transition-colors" />
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-[13.5px] font-bold ${isLight ? 'text-slate-900 group-hover:text-brand-red-600' : 'text-gray-200 group-hover:text-white'}`}>
                                  {card.title}
                                </span>
                                <span className={`text-[11.5px] line-clamp-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                                  {card.description}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Area */}
            <div className={`mt-8 pt-6 border-t flex flex-col gap-3 shrink-0 ${isLight ? 'border-rose-200/90' : 'border-white/10'}`}>
              <Link
                href="/login"
                className={`text-center font-bold py-3 rounded-xl transition-all block text-sm border ${
                  isLight 
                    ? 'bg-white text-slate-900 border-rose-300/90 shadow-[0_2px_8px_rgba(225,29,72,0.06)] hover:bg-rose-50 active:scale-[0.98]' 
                    : 'text-black bg-white hover:bg-neutral-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                I am a Brand
              </Link>
              
              {!loadingAuth && (
                isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-[#E11D48] via-[#EF233C] to-[#BE123C] text-white w-full py-3 text-center block font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(239,35,60,0.28)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Brand Portal
                  </Link>
                ) : (
                  <Link
                    href="/get-started"
                    className="bg-gradient-to-r from-[#E11D48] via-[#EF233C] to-[#BE123C] bg-[length:200%_auto] text-white w-full py-3 text-center block font-bold text-sm rounded-xl shadow-[0_4px_18px_rgba(239,35,60,0.35)] hover:shadow-[0_6px_22px_rgba(239,35,60,0.5)] active:scale-[0.98] transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
