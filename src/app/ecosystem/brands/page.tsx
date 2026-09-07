"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Video, Check, ShieldCheck, 
  ArrowRight, ChevronRight, Award, MessageSquare, 
  Search, Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Local static data
const valueCards = [
  {
    title: "All-in-One Control",
    description: "Manage the complete creator lifecycle without jumping between scattered tools.",
    bullets: [
      "Create detailed campaign briefs",
      "Review creator applicants in one tab",
      "Chat with creators & approve content",
      "Manage secure payment releases"
    ],
    borderColor: "group-hover:border-[#EF233C]/40"
  },
  {
    title: "Faster Creator Applications",
    description: "Relevant creators discover your briefs and apply directly with their portfolios.",
    bullets: [
      "Creators discover open briefs matching their profile",
      "Filter applicants by niche, location, and style",
      "Easily shortlist and chat with strong matches"
    ],
    borderColor: "group-hover:border-[#FF6B35]/40"
  },
  {
    title: "Scale UGC Production",
    description: "Build a repeatable creator pipeline for continuous organic and ad content.",
    bullets: [
      "Run campaigns across multiple categories",
      "Organize and manage multiple briefs simultaneously",
      "Save and re-hire high-performing creators"
    ],
    borderColor: "group-hover:border-emerald-500/30"
  }
];

const hireFeatures = [
  {
    title: "Smart Filters",
    description: "Find creators by niche, city, state, audience, and campaign type."
  },
  {
    title: "Fast Shortlisting",
    description: "Review creator applications and quickly decide who fits your brand."
  },
  {
    title: "Campaign Chat",
    description: "Discuss deliverables, timelines, posting details, and approvals inside UGCFY."
  },
  {
    title: "Paid or Barter",
    description: "Launch campaigns with money, products, services, or a mix of both."
  }
];

const stepsData = [
  { id: "Create", label: "Create" },
  { id: "Launch", label: "Launch" },
  { id: "Select", label: "Select" },
  { id: "Complete", label: "Complete" }
];

export default function BrandsPage() {
  const [activeStep, setActiveStep] = useState("Select");

  return (
    <div className="min-h-screen bg-[#08080A] text-white overflow-hidden selection:bg-[#EF233C]/20 selection:text-white">
      <Navbar theme="dark" />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
        {/* Background Radial Glows */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-[#EF233C]/20 blur-[130px] rounded-full pointer-events-none opacity-80" />
        <div className="absolute top-1/4 right-1/4 translate-x-1/2 w-[600px] h-[400px] bg-[#FF6B35]/15 blur-[120px] rounded-full pointer-events-none opacity-60" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#EF233C] animate-pulse" />
              <span className="text-[12px] font-bold tracking-widest uppercase text-gray-300">FOR BRANDS</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-tight leading-[1.05]">
              Launch <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF233C] to-[#FF6B35]">UGC campaigns</span>. <br />
              Work with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#EF233C]">verified creators</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl font-medium">
              UGCFY helps brands create campaigns, discover relevant creators, manage applications, approve content, and track collaborations from one structured dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/get-started" className="w-full sm:w-auto justify-center bg-gradient-to-r from-[#EF233C] to-[#FF6B35] hover:opacity-90 text-white font-bold rounded-2xl text-lg px-8 py-4 transition-all duration-300 shadow-[0_8px_30px_rgb(239,35,60,0.3)] hover:shadow-[0_8px_35px_rgb(239,35,60,0.5)] flex items-center gap-2 group">
                Start as Brand
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto justify-center bg-white/5 border border-white/10 hover:border-white/20 text-white hover:bg-white/10 font-bold rounded-2xl text-lg px-8 py-4 transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
                See How It Works
              </Link>
            </div>
          </div>

          {/* Right Visual: Orbit / Campaign card */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[400px]">
            {/* Ambient Background Circle */}
            <div className="absolute w-[360px] h-[360px] bg-gradient-to-br from-[#EF233C]/20 to-[#FF6B35]/20 rounded-full blur-[60px] pointer-events-none" />
            
            {/* Central Campaign Card */}
            <div className="relative w-full max-w-[320px] rounded-[2.5rem] bg-neutral-900/80 border border-white/10 p-6 shadow-2xl backdrop-blur-xl z-10 flex flex-col gap-4">
              
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">Reviewing Creators</span>
                <span className="text-[10px] text-gray-400 font-bold">Step 3 of 4</span>
              </div>

              <div>
                <h4 className="text-lg font-black tracking-tight text-white leading-tight mb-1">Skincare Launch</h4>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">UGC Video Campaign</span>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-white/5 py-4 my-1">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Applications</span>
                  <span className="text-xl font-black text-white block mt-0.5">24</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Shortlisted</span>
                  <span className="text-xl font-black text-[#FF6B35] block mt-0.5">6</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">✓</div>
                  <span className="text-[11px] font-bold text-gray-200">Creative Brief Shared</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>

            {/* Orbit rings */}
            <div className="absolute w-[360px] h-[360px] border border-white/5 rounded-full pointer-events-none" />
            <div className="absolute w-[440px] h-[440px] border border-white/[0.03] rounded-full pointer-events-none hidden sm:block" />

            {/* Floating Badges */}
            <div className="absolute -top-6 -left-4 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-1.5 z-20">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">Verified Creators</span>
            </div>

            <div className="absolute top-16 -right-12 bg-[#EF233C]/10 border border-[#EF233C]/20 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-1.5 z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF233C] animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">Campaign Live</span>
            </div>

            <div className="absolute bottom-28 -right-8 bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-1.5 z-20">
              <Video className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">Content Review</span>
            </div>

            <div className="absolute bottom-6 -left-12 bg-sky-500/10 border border-sky-500/20 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-1.5 z-20">
              <Award className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">Escrow Ready</span>
            </div>

          </div>
        </div>
      </section>

      {/* 2. BUSINESS VALUE SECTION */}
      <section className="relative py-24 bg-white text-[#08080A] overflow-hidden">
        {/* Radial Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#EF233C]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#FF6B35]/6 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          
          {/* Header Block */}
          <div className="text-center flex flex-col items-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF233C]/10 border border-[#EF233C]/20">
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#EF233C]">WHY UGCFY</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl leading-tight">
              Increase content output. <br />Improve campaign control. Scale faster.
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
              Everything your brand needs to run creator campaigns without scattered spreadsheets, manual follow-ups, or disconnected approval workflows.
            </p>
          </div>

          {/* Value Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {valueCards.map((card, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-[2.5rem] bg-gradient-to-b from-slate-50 to-transparent border border-gray-100 hover:border-transparent transition-all duration-300 p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(239,35,60,0.12)] hover:-translate-y-1 overflow-hidden flex flex-col justify-between min-h-[380px]"
              >
                {/* Border Hover Effect Layer */}
                <div className={`absolute inset-0 rounded-[2.5rem] border ${card.borderColor} pointer-events-none transition-colors duration-300`} />
                
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                      {idx === 0 && <Users className="w-5 h-5 text-[#EF233C]" />}
                      {idx === 1 && <Search className="w-5 h-5 text-[#FF6B35]" />}
                      {idx === 2 && <Video className="w-5 h-5 text-emerald-500" />}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tight mb-3 text-[#08080A]">{card.title}</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">{card.description}</p>
                </div>
                
                <ul className="space-y-3.5 border-t border-gray-100/80 pt-6">
                  {card.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#EF233C]" />
                      </div>
                      <span className="text-gray-600 font-semibold text-xs leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. HIRE CREATORS SECTION */}
      <section className="relative py-24 bg-[#08080A] text-white overflow-hidden">
        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#EF233C]/10 blur-[130px] rounded-full pointer-events-none opacity-80" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          
          {/* Header Block */}
          <div className="flex flex-col items-center text-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-[11px] font-bold tracking-widest uppercase text-gray-300">HIRE CREATORS</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl leading-tight">
              Find creators for your next campaign faster.
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-medium leading-relaxed">
              Set your niche, location, budget, content type, and campaign goals to discover creators who match your brand requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column: Feature lists */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hireFeatures.map((feat, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#EF233C]/35 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#EF233C]/10 border border-[#EF233C]/20 flex items-center justify-center text-[#EF233C] mb-4">
                    {idx === 0 && <Search className="w-4 h-4" />}
                    {idx === 1 && <Users className="w-4 h-4" />}
                    {idx === 2 && <MessageSquare className="w-4 h-4" />}
                    {idx === 3 && <Award className="w-4 h-4" />}
                  </div>
                  <h4 className="text-lg font-black text-white mb-2">{feat.title}</h4>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>

            {/* Right Column: Readiness circular progress mockup */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-[380px] rounded-[2.5rem] bg-neutral-900/60 border border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col gap-6">
                
                {/* Circular ring in the middle */}
                <div className="flex justify-center my-4">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                      <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="402" strokeDashoffset="80" className="text-[#EF233C] drop-shadow-[0_0_12px_rgba(239,35,60,0.5)]" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Ready in</span>
                      <span className="text-2xl font-black text-white my-1 leading-none">10 min</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Setup Flow</span>
                    </div>
                  </div>
                </div>

                {/* Shortlist List */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-gray-400 px-1 uppercase tracking-wider">Creator Shortlist Preview</span>
                  
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#EF233C] flex items-center justify-center font-bold text-xs text-white">PS</div>
                      <div>
                        <h5 className="text-[11px] font-bold text-white leading-none mb-0.5">Priya S.</h5>
                        <span className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider">Beauty Creator</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-[#EF233C]/20 text-[#EF233C] px-2 py-0.5 rounded-full">Shortlisted</span>
                  </div>

                  <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#FF6B35] flex items-center justify-center font-bold text-xs text-white">RK</div>
                      <div>
                        <h5 className="text-[11px] font-bold text-white leading-none mb-0.5">Rohit K.</h5>
                        <span className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider">Tech Creator</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-[#EF233C]/20 text-[#EF233C] px-2 py-0.5 rounded-full">Shortlisted</span>
                  </div>

                  <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-xs text-white">AM</div>
                      <div>
                        <h5 className="text-[11px] font-bold text-white leading-none mb-0.5">Anjali M.</h5>
                        <span className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider">Fashion Creator</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-[#EF233C]/20 text-[#EF233C] px-2 py-0.5 rounded-full">Shortlisted</span>
                  </div>

                </div>

              </div>
              <span className="text-xs text-gray-500 font-bold mt-6 text-center leading-relaxed">
                Structured campaign setup • Verified creator applications • In-app collaboration
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CAMPAIGN WORKFLOW SECTION */}
      <section id="how-it-works" className="relative py-24 bg-white text-[#08080A] overflow-hidden">
        {/* Subtle Radial Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#EF233C]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          
          {/* Header Block */}
          <div className="text-center flex flex-col items-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF233C]/10 border border-[#EF233C]/20">
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#EF233C]">CAMPAIGN WORKFLOW</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl leading-tight">
              Create a campaign in 4 clear steps.
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
              Follow one guided flow to brief creators, review applications, approve content, and complete collaborations without operational confusion.
            </p>
          </div>

          {/* Step pills */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 mb-16">
            {stepsData.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button 
                  key={step.id} 
                  onClick={() => setActiveStep(step.id)}
                  className={`px-6 py-3 rounded-full text-sm font-extrabold tracking-wider uppercase border transition-all duration-300 ${isActive ? 'bg-[#EF233C] text-white border-transparent shadow-lg shadow-[#EF233C]/20 scale-105' : 'bg-slate-50 text-gray-400 border-gray-200 hover:border-gray-300 hover:text-[#08080A]'}`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>

          {/* Large Dashboard Mockup */}
          <div className="flex justify-center">
            <div className="w-full max-w-[900px] rounded-[2.5rem] bg-[#08080A] border border-white/10 p-6 md:p-8 shadow-2xl text-white relative overflow-hidden">
              {/* Inner ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#EF233C]/10 blur-[90px] pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
                {/* Left Sidebar Steps representation */}
                <div className="md:col-span-3 flex flex-col gap-2.5 border-r border-white/5 pr-0 md:pr-6">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Guided Flow</span>
                  {stepsData.map((step) => {
                    const isActive = activeStep === step.id;
                    return (
                      <div 
                        key={step.id} 
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${isActive ? 'bg-[#EF233C]/15 border-[#EF233C]/35 text-[#EF233C]' : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'}`}
                        onClick={() => setActiveStep(step.id)}
                      >
                        <span className="text-xs font-bold">{step.label}</span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#EF233C]" />}
                      </div>
                    );
                  })}
                </div>

                {/* Main Active Panel details */}
                <div className="md:col-span-5 flex flex-col gap-5">
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#EF233C]/15 to-[#FF6B35]/15 border border-[#EF233C]/20 px-3 py-1 rounded-full w-fit">
                    <span className="text-[10px] font-bold text-[#EF233C] uppercase tracking-wider">Step Details: {activeStep}</span>
                  </div>
                  
                  {activeStep === "Create" && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-white">Create Your Campaign Brief</h4>
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                        Outline your campaign guidelines, visual examples, budget, product shipping specifications, and exact deliverables.
                      </p>
                    </div>
                  )}

                  {activeStep === "Launch" && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-white">Publish Brief to Marketplace</h4>
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                        Your campaign goes live inside the creator feed instantly. Targeted notifications reach verified profiles matched with your niche.
                      </p>
                    </div>
                  )}

                  {activeStep === "Select" && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-white">Shortlist & Chat</h4>
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                        Creators apply directly with their pitches. Your team shortlists the right profiles and discusses deliverables inside the campaign chat.
                      </p>
                    </div>
                  )}

                  {activeStep === "Complete" && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-white">Approve Content & Complete</h4>
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                        Review raw drafts uploaded by creators. Request revisions or approve them in one click to release the secured payout.
                      </p>
                    </div>
                  )}

                  <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-2.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Features Highlight</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[9px] font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white">Escrow Secured</span>
                      <span className="text-[9px] font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white">100% Usage Rights</span>
                      <span className="text-[9px] font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white">Direct Chat</span>
                    </div>
                  </div>
                </div>

                {/* Right dashboard preview elements */}
                <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block border-b border-white/5 pb-2">Status Tracker</span>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-300">Brief Status</span>
                    <span className="font-bold text-emerald-400">Approved</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-300">Applications</span>
                    <span className="font-bold text-white">24 Submitted</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-300">Active Chats</span>
                    <span className="font-bold text-[#FF6B35]">3 Conversations</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-300">Deliverables</span>
                    <span className="font-bold text-amber-400">2 In Review</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-300">Escrow Payment</span>
                    <span className="font-bold text-sky-400">Secured</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="relative py-28 overflow-hidden bg-gradient-to-b from-[#08080A] to-[#12090B]">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#EF233C]/20 blur-[90px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1000px] mx-auto px-6 relative z-10">
          <div className="bg-[#16090C]/60 border border-white/5 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* Soft inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#FF6B35]/15 blur-[60px] pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <span className="text-[11px] font-bold tracking-widest uppercase text-gray-300">BRAND GROWTH</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 relative z-10">
              Find creators who <br />actually fit your brand.
            </h2>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-semibold relative z-10 leading-relaxed">
              Launch a UGCFY campaign and get matched with creators ready to collaborate through a structured, mobile-first workflow.
            </p>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
              <Link href="/get-started" className="w-full sm:w-auto justify-center bg-gradient-to-r from-[#EF233C] to-[#FF6B35] hover:opacity-90 text-white font-bold rounded-2xl text-lg px-8 py-4 transition-all duration-300 shadow-[0_8px_30px_rgb(239,35,60,0.3)] flex items-center gap-2 group">
                Start as Brand
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/get-started" className="w-full sm:w-auto justify-center bg-white/5 border border-white/10 hover:border-white/20 text-white hover:bg-white/10 font-bold rounded-2xl text-lg px-8 py-4 transition-all duration-300 flex items-center gap-2">
                Post Your First Campaign
              </Link>
            </div>

            <span className="text-xs text-gray-500 font-bold block mb-4">
              Verified creators • Paid & barter campaigns • Campaign chat • Content approval workflow
            </span>

            <Link href="/ecosystem/creators" className="text-xs font-bold text-[#FF6B35] hover:text-[#EF233C] transition-colors hover:underline">
              Explore Creator Ecosystem
            </Link>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
