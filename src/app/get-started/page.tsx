"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Star, Quote, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GetStartedPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    userType: "Brand",
    firstName: "",
    lastName: "",
    email: "",
    spend: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: "Get Started",
        message: `Type: ${formData.userType}\nSpend: ${formData.spend}\nMessage: ${formData.message}`,
        form_type: "get_started"
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
    <main className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-[#E11D48]/20 selection:text-[#E11D48] relative">

      {/* Light Theme Premium Background */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)', backgroundSize: '4rem 4rem', maskImage: 'radial-gradient(circle at top center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at top center, black, transparent 80%)' }}>
      </div>

      {/* Subtle Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E11D48]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* NAVBAR */}
      <Navbar theme="dark" />

      {/* CONTENT */}
      <div className="flex-1 w-full relative flex justify-center pt-32 pb-12 md:pt-40 md:pb-16 z-10">
        <div className="max-w-[1300px] w-full px-6 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">

          {/* Left Column: Copy & Social Proof (7 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:col-span-7 pr-0 lg:pr-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/20 w-fit mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse"></span>
              <span className="text-[13px] font-bold tracking-wider uppercase text-[#E11D48]">Connect With Us</span>
            </div>

            <h1 className="text-[56px] md:text-[72px] font-extrabold leading-[1.05] tracking-tighter text-black mb-6">
              Scale Your <br /> Influence <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-red-400">Faster.</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg mb-10 font-medium">
              Join top-tier brands utilizing AI to discover perfect creators, automate outreach, and track ROI with pinpoint accuracy.
            </p>

            {/* Premium Light Theme Social Proof */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
              <Quote className="w-12 h-12 text-gray-50 absolute -top-2 -left-2 rotate-180 transform" />

              <div className="flex gap-1 mb-4 relative z-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#E11D48] text-[#E11D48]" />
                ))}
              </div>
              <p className="text-[17px] text-gray-800 leading-relaxed font-medium mb-6 relative z-10 italic">
                &quot;The end-to-end automation provided by UGCFY is unmatched. We scaled our ambassador program from 50 to 500 creators seamlessly.&quot;
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-black tracking-tight">Krishna Asthawani</h4>
                  <p className="text-sm text-gray-500 font-medium">Director of Marketing, TechStyle</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-6 mt-12 opacity-80">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 stroke-[3]" />
                <span className="text-sm font-bold uppercase tracking-widest text-gray-600">No Credit Card</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 stroke-[3]" />
                <span className="text-sm font-bold uppercase tracking-widest text-gray-600">Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 stroke-[3]" />
                <span className="text-sm font-bold uppercase tracking-widest text-gray-600">24/7 Support</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form (5 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-b from-[#E11D48]/10 to-transparent rounded-[2.5rem] blur-2xl opacity-50 z-0"></div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
                  <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-100">
                    <Check className="w-12 h-12 stroke-[3]" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-black tracking-tight">Request Received!</h3>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-[280px]">
                    Thank you! A member of our team will reach out to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 flex items-center gap-2 text-[#E11D48] hover:text-[#BE123C] font-bold text-[15px] transition-colors"
                  >
                    Submit another request <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="mb-2">
                    <h2 className="text-2xl font-extrabold text-black tracking-tight mb-1">Tell us about your needs</h2>
                    <p className="text-[13px] text-gray-500 font-medium">Are you a Creator? <Link href="/creator-contact" className="text-[#E11D48] hover:underline font-bold">Contact us here</Link></p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">What best describes you?*</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative flex flex-col gap-2 p-3.5 rounded-xl border border-gray-200 cursor-pointer transition-all hover:border-[#E11D48]/40 hover:bg-red-50/20 group has-[:checked]:border-[#E11D48] has-[:checked]:bg-red-50/10">
                        <input type="radio" name="userType" value="Marketer" checked={formData.userType === "Marketer"} onChange={(e) => setFormData({...formData, userType: e.target.value})} className="sr-only" />
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[14px] font-bold text-gray-700 group-has-[:checked]:text-[#E11D48] transition-colors">Marketer / Partner</span>
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center group-has-[:checked]:border-[#E11D48] transition-colors">
                            <div className="w-2 h-2 rounded-full bg-[#E11D48] scale-0 group-has-[:checked]:scale-100 transition-transform duration-200"></div>
                          </div>
                        </div>
                      </label>
                      <label className="relative flex flex-col gap-2 p-3.5 rounded-xl border border-gray-200 cursor-pointer transition-all hover:border-[#E11D48]/40 hover:bg-red-50/20 group has-[:checked]:border-[#E11D48] has-[:checked]:bg-red-50/10">
                        <input type="radio" name="userType" value="Brand" checked={formData.userType === "Brand"} onChange={(e) => setFormData({...formData, userType: e.target.value})} className="sr-only" />
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[14px] font-bold text-gray-700 group-has-[:checked]:text-[#E11D48] transition-colors">Brand</span>
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center group-has-[:checked]:border-[#E11D48] transition-colors">
                            <div className="w-2 h-2 rounded-full bg-[#E11D48] scale-0 group-has-[:checked]:scale-100 transition-transform duration-200"></div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">First name*</label>
                      <input required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3 px-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all font-medium" placeholder="John" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Last name*</label>
                      <input required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3 px-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all font-medium" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Work email*</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3 px-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all font-medium" placeholder="john@company.com" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Monthly Spend?*</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["< INR 50K", "50K - 2 Lacs", "2L - 5 Lacs", "> 5 Lacs"].map((opt) => (
                        <label key={opt} className="relative flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-[#E11D48]/40 hover:bg-red-50/20 group has-[:checked]:border-[#E11D48] has-[:checked]:bg-red-50/10">
                          <input type="radio" name="spend" value={opt} checked={formData.spend === opt} onChange={(e) => setFormData({...formData, spend: e.target.value})} className="sr-only" />
                          <div className="w-3.5 h-3.5 shrink-0 rounded-full border-2 border-gray-300 flex items-center justify-center group-has-[:checked]:border-[#E11D48] transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] scale-0 group-has-[:checked]:scale-100 transition-transform duration-200"></div>
                          </div>
                          <span className="text-[12px] font-bold text-gray-600 group-has-[:checked]:text-[#E11D48] transition-colors whitespace-nowrap">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Message*</label>
                    <textarea required rows={3} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3 px-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all resize-none font-medium" placeholder="Tell us about your campaign goals..."></textarea>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-[14px] font-medium flex items-start gap-2">
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></div>
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#E11D48] hover:bg-[#BE123C] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-[15px] py-4 rounded-xl mt-2 flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_-10px_rgba(225,29,72,0.5)] transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
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
