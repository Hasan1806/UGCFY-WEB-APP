"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FreeTrialModal({ isOpen, onClose }: FreeTrialModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset form state after close animation
      setTimeout(() => setIsSuccess(false), 300);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    website: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        company_name: formData.website,
        subject: "Free Trial Request",
        message: `Requested Free Trial for: ${formData.website}`,
        form_type: "free_trial"
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
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit this form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0A0A0A] p-8 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-primary)]/20 blur-[50px] rounded-full pointer-events-none"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h3 className="text-2xl font-black text-white tracking-tight relative z-10">Start Your Free Trial</h3>
          <p className="text-slate-400 mt-2 relative z-10 text-sm">Join 10,000+ brands scaling with UGC FY.</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Request Received!</h4>
              <p className="text-slate-600">Our team will be in touch with your access credentials shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">First Name</label>
                  <input required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="John" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Last Name</label>
                  <input required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Work Email</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="john@company.com" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Company Website</label>
                <input required type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="https://company.com" />
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></div>
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="pt-4">
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full btn-primary flex items-center justify-center gap-2 group text-lg px-8 py-4 shadow-xl shadow-red-500/20 disabled:opacity-70"
                >
                  {isSubmitting ? "Processing..." : "Get Instant Access"}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
                <p className="text-xs text-center text-slate-500 mt-4">
                  By submitting, you agree to our Terms of Service and Privacy Policy. No credit card required.
                </p>
              </div>
            </form>
          )}
        </div>
        
      </div>
    </div>
  );
}
