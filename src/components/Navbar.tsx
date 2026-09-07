"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import RequestAccessModal from "./RequestAccessModal";
import { MegaMenuPanel, PLATFORM_DATA, ECOSYSTEM_DATA, RESOURCES_DATA, SERVICES_DATA, COMPANY_DATA } from "./MegaMenu";

interface NavbarProps {
  theme?: "transparent-to-dark" | "dark";
  hideOnScroll?: boolean;
}

export default function Navbar({ theme = "transparent-to-dark", hideOnScroll = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [scrolled, setScrolled] = useState(theme === "dark");
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

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
      
      // Background logic
      if (theme !== "dark") {
        setScrolled(currentScrollY > 20);
      }

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
  }, [theme, hideOnScroll, isMobileMenuOpen]);

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

  const headerBg = scrolled || theme === "dark" || isMobileMenuOpen ? "bg-[#000000] shadow-xl" : "bg-transparent backdrop-blur-md";
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
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${transformStyle} py-1.5 ${headerBg} border-b border-white/10`}>
        <div className="max-w-[1280px] mx-auto px-6 h-[76px] flex items-center justify-between">
          <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={140} height={40} className="h-8 w-auto object-contain brightness-0 invert" priority />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-[15px] text-white h-full">
            {/* PLATFORM MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Platform <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={PLATFORM_DATA} />
            </div>

            {/* ECOSYSTEM MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Ecosystem <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={ECOSYSTEM_DATA} />
            </div>

            {/* RESOURCES MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Resources <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={RESOURCES_DATA} />
            </div>

            {/* SERVICES MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Services <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={SERVICES_DATA} />
            </div>

            {/* COMPANY MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Company <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={COMPANY_DATA} />
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-white border-white/20 hover:bg-white hover:text-black">I am a Brand</Link>
            {!loadingAuth && (
              isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary ml-2 shadow-lg shadow-[var(--shadow-cta)]">
                  Brand Portal
                </Link>
              ) : (
                <Link href="/get-started" className="btn-primary ml-2 shadow-lg shadow-[var(--shadow-cta)]">
                  Get Started
                </Link>
              )
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 text-white hover:text-[var(--color-primary)] transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
            </button>
          </div>
        </div>
      </header>

      {/* FULL SCREEN MOBILE OVERLAY (Rendered outside header to avoid transform containing block) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#050505] lg:hidden flex flex-col h-[100dvh] w-screen overflow-hidden animate-in fade-in duration-150">
          {/* Top Bar matching header */}
          <div className="h-[88px] px-6 flex items-center justify-between border-b border-white/10 shrink-0 bg-[#000000]">
            <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={140} height={40} className="h-8 w-auto object-contain brightness-0 invert" priority />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-2 text-white hover:text-[var(--color-primary)] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Nav Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 pb-12 flex flex-col justify-between">
            {/* Nav Menu Links */}
            <div className="flex flex-col text-white divide-y divide-white/5">
              {mobileNavSections.map((section) => {
                const isExpanded = expandedSection === section.key;
                return (
                  <div key={section.key} className="py-2.5">
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="w-full flex items-center justify-between py-2 text-lg font-bold text-left hover:text-[var(--color-primary)] transition-colors"
                    >
                      <span>{section.title}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-[var(--color-primary)]" : ""
                        }`}
                      />
                    </button>

                    {/* Sub-items dropdown */}
                    {isExpanded && (
                      <div className="mt-2 mb-2 pl-2 flex flex-col gap-2 border-l border-white/10 animate-in fade-in slide-in-from-top-1 duration-150">
                        {section.data.cards.map((card, idx) => {
                          const Icon = card.icon;
                          return (
                            <Link
                              key={idx}
                              href={card.href || "#"}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-md bg-white/5 group-hover:bg-[var(--color-primary)]/20 flex items-center justify-center shrink-0 transition-colors">
                                <Icon className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-200 group-hover:text-white">
                                  {card.title}
                                </span>
                                <span className="text-xs text-gray-400 line-clamp-1">
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
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3 shrink-0">
              <Link
                href="/login"
                className="text-center font-semibold text-gray-300 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 hover:text-white transition-colors block text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                I am a Brand
              </Link>
              
              {!loadingAuth && (
                isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="btn-primary w-full py-3 text-center block font-bold text-sm shadow-lg shadow-[var(--shadow-cta)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Brand Portal
                  </Link>
                ) : (
                  <Link
                    href="/get-started"
                    className="btn-primary w-full py-3 text-center block font-bold text-sm shadow-lg shadow-[var(--shadow-cta)]"
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
