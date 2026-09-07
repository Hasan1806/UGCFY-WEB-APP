"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, form_type: "contact" }),
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
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit this form.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col justify-between selection:bg-brand-red-100 font-sans">
      <Navbar theme="dark" />

      {/* Hero Header */}
      <section className="w-full pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-red-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-brand-red-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Get in Touch</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            We&apos;re here to <span className="text-brand-red-500">help.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Have questions about SIYAA&apos;s onboarding, brand access approvals, or creator escrow integrations? Drop us a message.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 w-full max-w-7xl mx-auto pb-32 px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
        
        {/* Left Side: Contact Info */}
        <div className="lg:col-span-5 space-y-12">
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-900">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Email Directory</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-50">
                <span className="font-semibold text-gray-900 text-sm">General Enquiries</span>
                <a href="mailto:hello@ugcfy.com" className="text-brand-red-500 font-medium text-sm hover:text-brand-red-600 transition">hello@ugcfy.com</a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-50">
                <span className="font-semibold text-gray-900 text-sm">Support</span>
                <a href="mailto:support@ugcfy.com" className="text-brand-red-500 font-medium text-sm hover:text-brand-red-600 transition">support@ugcfy.com</a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-50">
                <span className="font-semibold text-gray-900 text-sm">Billing & Payments</span>
                <div className="flex flex-col sm:items-end">
                  <a href="mailto:billing@ugcfy.com" className="text-brand-red-500 font-medium text-sm hover:text-brand-red-600 transition">billing@ugcfy.com</a>
                  <a href="mailto:payments@ugcfy.com" className="text-brand-red-500 font-medium text-sm hover:text-brand-red-600 transition">payments@ugcfy.com</a>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3">
                <span className="font-semibold text-gray-900 text-sm">Tech & Security</span>
                <div className="flex flex-col sm:items-end">
                  <a href="mailto:tech@ugcfy.com" className="text-brand-red-500 font-medium text-sm hover:text-brand-red-600 transition">tech@ugcfy.com</a>
                  <a href="mailto:security@ugcfy.com" className="text-brand-red-500 font-medium text-sm hover:text-brand-red-600 transition">security@ugcfy.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col items-start">
              <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 mb-4">
                <Phone className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Call Us</h3>
              <p className="text-gray-500 text-sm mb-4">Mon-Fri, 9am - 6pm</p>
              <p className="text-gray-900 font-semibold">+91 90001 90001</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col items-start">
              <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 mb-4">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Visit Us</h3>
              <p className="text-gray-500 text-sm mb-4">Our Headquarters</p>
              <p className="text-gray-900 font-semibold">Bhilai, CG 490001</p>
            </div>
          </div>

        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
            <p className="text-gray-500">We aim to respond to all inquiries within 24 hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-[13px] font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sarah Jenkins"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:border-brand-red-500 focus:ring-4 focus:ring-brand-red-500/10 hover:border-gray-300 outline-none transition-all duration-300 font-medium placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-[13px] font-semibold text-gray-700">
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@brand.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:border-brand-red-500 focus:ring-4 focus:ring-brand-red-500/10 hover:border-gray-300 outline-none transition-all duration-300 font-medium placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-[13px] font-semibold text-gray-700">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="How can we help?"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:border-brand-red-500 focus:ring-4 focus:ring-brand-red-500/10 hover:border-gray-300 outline-none transition-all duration-300 font-medium placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-[13px] font-semibold text-gray-700">
                Message Detail
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your details here..."
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:border-brand-red-500 focus:ring-4 focus:ring-brand-red-500/10 hover:border-gray-300 outline-none transition-all duration-300 font-medium placeholder:text-gray-400 resize-none"
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></div>
                <p>{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-4 bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4"
            >
              {status === "sending" ? (
                <span>Sending...</span>
              ) : status === "success" ? (
                <span className="text-emerald-400">✓ Message Sent</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

      </section>

      <Footer />
    </main>
  );
}
