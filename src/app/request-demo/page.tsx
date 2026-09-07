"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RequestDemoPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName,
        subject: "Demo Request",
        message: "User requested a demo.",
        form_type: "request_demo"
      };
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 160)}`);
      }

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || result.error || "Unable to submit this form.");
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit this form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#000000] text-white flex flex-col selection:bg-[#E11D48]/30 selection:text-white relative">
      
      {/* SaaS Industry Standard Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '4rem 4rem', maskImage: 'radial-gradient(circle at center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)' }}>
      </div>
      
      {/* Subtle Glowing Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#E11D48]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* Global Navbar */}
      <Navbar theme="transparent-to-dark" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center relative z-10 pt-32 pb-12">
        <div className="max-w-[1300px] mx-auto w-full px-6 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Left Side: Copy & Social Proof (7 columns) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8 lg:col-span-7 pr-0 lg:pr-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse"></span>
              <span className="text-[13px] font-semibold tracking-wider uppercase text-gray-300">Dedicated Demo</span>
            </div>
            
            <h1 className="text-[56px] md:text-[72px] font-extrabold leading-[1.05] tracking-tighter">
              See <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500">UGCFY</span> <br/> in Action.
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed max-w-lg font-medium">
              Join thousands of leading brands. Get a personalized walkthrough of our AI-powered influencer marketing platform.
            </p>

            {/* Social Proof Block (Highly SaaS Standard) */}
            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#E11D48] to-transparent"></div>
              <Quote className="w-10 h-10 text-white/10 absolute top-6 right-6" />
              
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#E11D48] text-[#E11D48]" />
                ))}
              </div>
              <p className="text-lg text-gray-200 leading-relaxed font-medium mb-6 relative z-10">
                &quot;UGCFY completely transformed how we discover and manage creators. The AI capabilities saved us over 40 hours a week and doubled our campaign ROI within the first month.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20 flex items-center justify-center text-lg font-bold">
                  S
                </div>
                <div>
                  <h4 className="font-bold text-white tracking-tight">Sarah Jenkins</h4>
                  <p className="text-sm text-gray-400">Head of Growth, Acme Corp</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-4 opacity-60">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-extrabold text-white">200M+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Creators</span>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-extrabold text-white">10x</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Avg. ROI</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Elevated Form (5 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-[#E11D48]/30 to-transparent rounded-[2.5rem] blur-xl opacity-50 z-0"></div>
            
            <div className="bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative z-10">
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center py-20 gap-6">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 text-green-500 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <h3 className="text-3xl font-extrabold tracking-tight">You&apos;re on the list!</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Our product specialists will contact you within 24 hours to coordinate your dedicated session.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="mb-4">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight mb-1">Book your session</h3>
                    <p className="text-[13px] text-gray-400 font-medium">Are you a Creator? <Link href="/creator-contact" className="text-[#E11D48] hover:underline font-bold">Contact us here</Link></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 group">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                      <input required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:bg-white/10 focus:outline-none focus:border-[#E11D48]/50 focus:ring-1 focus:ring-[#E11D48]/50 transition-all text-[15px]" placeholder="John" />
                    </div>
                    <div className="flex flex-col gap-1.5 group">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                      <input required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:bg-white/10 focus:outline-none focus:border-[#E11D48]/50 focus:ring-1 focus:ring-[#E11D48]/50 transition-all text-[15px]" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 group">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Work Email</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:bg-white/10 focus:outline-none focus:border-[#E11D48]/50 focus:ring-1 focus:ring-[#E11D48]/50 transition-all text-[15px]" placeholder="john@acmecorp.com" />
                  </div>

                  <div className="flex flex-col gap-1.5 group">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Company Name</label>
                    <input required type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:bg-white/10 focus:outline-none focus:border-[#E11D48]/50 focus:ring-1 focus:ring-[#E11D48]/50 transition-all text-[15px]" placeholder="Acme Corp" />
                  </div>

                  <div className="flex flex-col gap-1.5 group">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
                    <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:bg-white/10 focus:outline-none focus:border-[#E11D48]/50 focus:ring-1 focus:ring-[#E11D48]/50 transition-all text-[15px]" placeholder="+1 (555) 000-0000" />
                  </div>

                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-[14px] font-medium flex items-start gap-2">
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold text-[15px] py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    {isSubmitting ? "Submitting..." : "Schedule Demo"} <Send className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-gray-500 mt-2 font-medium">
                    By submitting, you agree to our <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
