"use client";

import { useState } from "react";
import { Check, ArrowRight, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CreatorContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    email: "",
    name: "",
    phone: "",
    profileLink: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: `Profile: ${formData.profileLink}\nMessage: ${formData.message}`,
        form_type: "creator_contact"
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
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* NAVBAR */}
      <Navbar theme="dark" />

      {/* CONTENT */}
      <div className="flex-1 w-full relative flex justify-center pt-32 pb-12 md:pt-40 md:pb-16 z-10">
        <div className="max-w-[1300px] w-full px-6 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Social Proof (6 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:col-span-6 pr-0 lg:pr-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E11D48]/10 border border-[#E11D48]/20 w-fit mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse"></span>
              <span className="text-[13px] font-bold tracking-wider uppercase text-[#E11D48]">Creator Support</span>
            </div>

            <h1 className="text-[56px] md:text-[64px] font-extrabold leading-[1.05] tracking-tighter text-black mb-6">
              Contact & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-red-400">Support.</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg mb-10 font-medium">
              We&apos;re here to help you grow. Whether you&apos;re facing technical issues or want to learn how to land more brand deals, our team is ready to assist.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8 opacity-90">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)]">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <Instagram className="w-5 h-5 text-[#E11D48]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Brand Collabs</h4>
                <p className="text-[13px] text-gray-500 font-medium">Connect with top tier brands globally.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)]">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-[#E11D48]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Fast Support</h4>
                <p className="text-[13px] text-gray-500 font-medium">Priority help for our verified creators.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form (6 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-b from-[#E11D48]/10 to-transparent rounded-[2.5rem] blur-2xl opacity-50 z-0"></div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
                  <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-100">
                    <Check className="w-12 h-12 stroke-[3]" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-black tracking-tight">Query Received!</h3>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-[280px]">
                    Thank you! Our creator support team will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 flex items-center gap-2 text-[#E11D48] hover:text-[#BE123C] font-bold text-[15px] transition-colors"
                  >
                    Submit another query <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="mb-2">
                    <h2 className="text-2xl font-extrabold text-black tracking-tight mb-1">Submit your details</h2>
                    <p className="text-[13px] text-gray-500 font-medium">Please fill out the details. We will get back to you soon.</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Select Category*</label>
                    <select required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all font-medium appearance-none">
                      <option value="" disabled>Choose a category...</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Payment & Billing</option>
                      <option value="collab">Brand Collaborations</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Email Id*</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3 px-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all font-medium" placeholder="creator@example.com" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Your Name*</label>
                      <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3 px-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all font-medium" placeholder="Alex Johnson" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Mobile No*</label>
                      <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3 px-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all font-medium" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Profile Link*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Instagram className="h-4 w-4 text-gray-400" />
                      </div>
                      <input required type="url" value={formData.profileLink} onChange={(e) => setFormData({...formData, profileLink: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all font-medium" placeholder="instagram.com/username" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Message*</label>
                    <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-[#F9FAFB] hover:bg-white border border-gray-200 rounded-xl py-3 px-4 text-[15px] text-black focus:bg-white focus:outline-none focus:border-[#E11D48] focus:ring-[3px] focus:ring-[#E11D48]/10 transition-all resize-none font-medium" placeholder="Enter your message here or in case you are facing any issue, please elaborate..."></textarea>
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
                    {isSubmitting ? "Submitting..." : "Submit your Query"}
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
