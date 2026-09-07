"use client";

import React from "react";
import Link from "next/link";
import { 
  Video, Smartphone, Globe, Star, Check, ShieldCheck, 
  Play, ArrowRight, ChevronRight, Award
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Reusable local data arrays
const journeyCards = [
  {
    step: "01",
    title: "Create",
    description: "Establish your professional identity in the creator economy.",
    bullets: [
      "Build a high-converting creator profile",
      "Upload and showcase your premium portfolio content",
      "Complete quick KYC verification for verified status"
    ],
    color: "from-[#EF233C]/20 to-transparent",
    borderColor: "group-hover:border-[#EF233C]/40"
  },
  {
    step: "02",
    title: "Apply",
    description: "Discover campaigns and match with premium brands.",
    bullets: [
      "Browse active campaign listings matching your niche",
      "Submit campaign pitches and applications in one tap",
      "Get selected by top brands looking for your style"
    ],
    color: "from-[#FF6B35]/20 to-transparent",
    borderColor: "group-hover:border-[#FF6B35]/40"
  },
  {
    step: "03",
    title: "Grow",
    description: "Scale your creator career with recurring contracts.",
    bullets: [
      "Manage messaging and briefs in the structured app workspace",
      "Submit content deliverables and get direct feedback",
      "Unlock recurring collaborations and direct escrow payouts"
    ],
    color: "from-emerald-500/10 to-transparent",
    borderColor: "group-hover:border-emerald-500/30"
  }
];

const flowSteps = [
  {
    id: 1,
    title: "Discover Campaigns",
    description: "Explore the live marketplace of brand campaigns. Sort by niche, reward tier, and category to find collaborations that fit your creative style perfectly."
  },
  {
    id: 2,
    title: "Apply & Get Reviewed",
    description: "Pitch to campaigns by sharing your portfolio and terms with one tap. Brands review applications and select creators based on style alignment."
  },
  {
    id: 3,
    title: "Chat & Submit Content",
    description: "Use the secure, built-in brand chat to discuss requirements. Shoot, edit, and upload your UGC deliverables directly through the mobile app."
  },
  {
    id: 4,
    title: "Complete & Earn",
    description: "Once your submission is approved by the brand, the secure escrow payment is instantly released to your linked bank account."
  }
];

const featureChips = [
  "No Hidden Cost",
  "Paid & Barter Campaigns",
  "KYC Verified Profiles",
  "In-App Brand Chat",
  "Campaign Workflow"
];

const testimonials = [
  {
    name: "Anjali V.",
    role: "Lifestyle Creator",
    text: "Building my professional portfolio on the UGCFY app has made pitching to brands incredibly easy. I found my first campaign in days!",
    rating: 5
  },
  {
    name: "Gaurav L.",
    role: "Tech Creator",
    text: "The in-app brand chat simplifies everything. I can discuss brief details, get fast feedback, and finalize submissions in minutes.",
    rating: 5
  },
  {
    name: "Muskan B.",
    role: "Fashion Creator",
    text: "Managing deadlines and deliverables inside a structured dashboard keeps me organized. No more lost email chains or missed brand campaigns.",
    rating: 5
  },
  {
    name: "Neha P.",
    role: "Beauty Creator",
    text: "KYC verification gives brands peace of mind, and the escrow system guarantees that my payments are secured from the moment I start creating.",
    rating: 5
  }
];

export default function CreatorsPage() {
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
              <span className="text-[12px] font-bold tracking-widest uppercase text-gray-300">FOR CREATORS</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-tight leading-[1.05]">
              Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF233C] to-[#FF6B35]">creator profile</span>. <br />
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#EF233C]">paid brand campaigns</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl font-medium">
              Join UGCFY as a creator, showcase your portfolio, apply to UGC campaigns, chat with brands, and manage collaborations directly from the mobile app.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/get-started" className="w-full sm:w-auto justify-center bg-gradient-to-r from-[#EF233C] to-[#FF6B35] hover:opacity-90 text-white font-bold rounded-2xl text-lg px-8 py-4 transition-all duration-300 shadow-[0_8px_30px_rgb(239,35,60,0.3)] hover:shadow-[0_8px_35px_rgb(239,35,60,0.5)] flex items-center gap-2 group">
                Join as Creator
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/ecosystem/download-app" className="w-full sm:w-auto justify-center bg-white/5 border border-white/10 hover:border-white/20 text-white hover:bg-white/10 font-bold rounded-2xl text-lg px-8 py-4 transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Download App
              </Link>
            </div>
          </div>

          {/* Right Mockup */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Background Circle */}
            <div className="absolute w-[360px] h-[360px] bg-gradient-to-br from-[#EF233C]/20 to-[#FF6B35]/20 rounded-full blur-[60px] pointer-events-none" />
            
            {/* Phone Wrapper */}
            <div className="relative w-full max-w-[340px] aspect-[9/18.5] rounded-[48px] bg-[#08080A] border-[10px] border-neutral-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9),inset_0_0_4px_rgba(255,255,255,0.2)] overflow-hidden p-3.5 flex flex-col gap-3.5">
              
              {/* Phone Speaker Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-neutral-900 rounded-full" />
              </div>

              {/* Status bar spacer */}
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 px-2 pt-1 z-10">
                <span>10:42</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-2 bg-gray-400 rounded-sm" />
                </div>
              </div>

              {/* Internal Screen Content */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-none pb-4 relative">
                
                {/* 1. Profile Block */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EF233C] to-[#FF6B35] flex items-center justify-center font-bold text-white shadow-md">
                    AS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white block truncate">Ananya Sharma</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    </div>
                    <span className="text-[10px] text-gray-400 block font-medium">Beauty & Lifestyle Creator</span>
                  </div>
                </div>

                {/* 2. Stats Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-md">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-bold">Portfolio Views</span>
                    <span className="text-sm font-black text-white flex items-center gap-1 mt-0.5">
                      14.8k <span className="text-[9px] text-emerald-400 font-bold">+12%</span>
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-md">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-bold">Secure Wallet</span>
                    <span className="text-sm font-black text-white flex items-center gap-1 mt-0.5">
                      ₹38,500 <Check className="w-3 h-3 text-emerald-400" />
                    </span>
                  </div>
                </div>

                {/* 3. Portfolio Showcase Grid */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 px-1">Portfolio Highlights</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2].map((item) => (
                      <div key={item} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10 group/item">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-70 group-hover/item:opacity-100 transition-opacity">
                          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                            <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 z-10">
                          <span className="text-[9px] font-bold text-white block">UGC Review {item}</span>
                          <span className="text-[8px] text-gray-300 block font-medium">8.2k Views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Current Applications */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-2 backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400">Campaign Pitch</span>
                    <span className="text-[9px] font-bold bg-[#EF233C]/20 text-[#EF233C] px-2 py-0.5 rounded-full">Selected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none mb-1">SkinHydrate Oil Launch</h4>
                      <p className="text-[9px] text-gray-400 font-medium">Payout: Paid + Product</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </div>

              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-12 -left-10 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 z-20 animate-bounce duration-[3000ms]">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shrink-0">✓</div>
              <span className="text-xs font-bold text-white whitespace-nowrap">Portfolio Ready</span>
            </div>
            
            <div className="absolute top-36 -right-12 bg-[#EF233C]/10 border border-[#EF233C]/20 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 z-20">
              <Star className="w-4 h-4 text-[#EF233C] fill-[#EF233C] shrink-0 animate-spin duration-10000" />
              <span className="text-xs font-bold text-white whitespace-nowrap">Brand Collab</span>
            </div>

            <div className="absolute bottom-16 -left-12 bg-sky-500/10 border border-sky-500/20 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 z-20">
              <ShieldCheck className="w-4.5 h-4.5 text-sky-400 shrink-0" />
              <span className="text-xs font-bold text-white whitespace-nowrap">KYC Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CREATOR JOURNEY SECTION */}
      <section className="relative py-24 bg-white text-[#08080A] overflow-hidden">
        {/* Subtle Radial Glows for Light Mode */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#EF233C]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#FF6B35]/6 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          
          {/* Header Block */}
          <div className="text-center flex flex-col items-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF233C]/10 border border-[#EF233C]/20">
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#EF233C]">CREATOR ECOSYSTEM</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl leading-tight">
              Create, Apply, and Grow with UGCFY
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
              UGCFY gives creators one structured place to build a profile, discover campaigns, apply to brands, and manage content workflows.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {journeyCards.map((card, idx) => (
              <div 
                key={idx} 
                className={`group relative rounded-[2.5rem] bg-gradient-to-b ${card.color} border border-gray-100 hover:border-transparent transition-all duration-300 p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(239,35,60,0.12)] hover:-translate-y-1 overflow-hidden flex flex-col justify-between min-h-[360px]`}
              >
                {/* Border Hover Effect Layer */}
                <div className={`absolute inset-0 rounded-[2.5rem] border ${card.borderColor} pointer-events-none transition-colors duration-300`} />
                
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-4xl font-black tracking-tighter text-[#08080A]/10 group-hover:text-[#08080A]/20 transition-colors">{card.step}</span>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                      {idx === 0 && <Video className="w-5 h-5 text-[#EF233C]" />}
                      {idx === 1 && <Globe className="w-5 h-5 text-[#FF6B35]" />}
                      {idx === 2 && <Star className="w-5 h-5 text-emerald-500" />}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tight mb-2 text-[#08080A]">{card.title}</h3>
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

          {/* Central Creator Dashboard Mockup */}
          <div className="flex justify-center">
            <div className="w-full max-w-[800px] rounded-[2.5rem] bg-[#08080A] border border-white/10 p-6 md:p-8 shadow-2xl text-white relative group overflow-hidden">
              {/* Inner ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#EF233C]/10 blur-[80px] pointer-events-none" />
              
              <div className="flex flex-col gap-6 relative z-10">
                {/* Mockup Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EF233C] flex items-center justify-center font-bold text-sm">U</div>
                    <div>
                      <h4 className="text-sm font-black text-white leading-none">UGCFY Creator Hub</h4>
                      <span className="text-[10px] text-gray-400 font-medium">Campaign Workspace Dashboard</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white">Active Campaigns (3)</span>
                    <span className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full text-emerald-400">Portfolio Views (+12% Growth)</span>
                  </div>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Active Campaigns List */}
                  <div className="md:col-span-7 flex flex-col gap-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">Current Active Campaigns</span>
                    
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EF233C]/20 border border-[#EF233C]/30 flex items-center justify-center text-sm font-bold text-[#EF233C]">S</div>
                        <div>
                          <h5 className="text-xs font-bold text-white">SkinHydrate Oil Launch</h5>
                          <span className="text-[9px] text-gray-400 font-semibold">Glow Essentials Co.</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#EF233C]/20 text-[#EF233C] px-2.5 py-0.5 rounded-full">In Review</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/30 flex items-center justify-center text-sm font-bold text-[#FF6B35]">A</div>
                        <div>
                          <h5 className="text-xs font-bold text-white">ActiveNoise Pro Review</h5>
                          <span className="text-[9px] text-gray-400 font-semibold">SonicGear India</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">Drafting</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">G</div>
                        <div>
                          <h5 className="text-xs font-bold text-white">GlowSkincare Routine</h5>
                          <span className="text-[9px] text-gray-400 font-semibold">BioFresh Cosmetics</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">Payment Released</span>
                    </div>

                  </div>

                  {/* Right Column: Mini Chats & Stats */}
                  <div className="md:col-span-5 flex flex-col gap-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">Brand Messages</span>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#FF6B35]">Skincare Daily Support</span>
                        <span className="text-[9px] text-gray-400 font-medium">10m ago</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-normal italic">&quot;Brief updated! Please verify the aspect ratio and lighting requirements in the brief tab.&quot;</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400">Fitness Pro India</span>
                        <span className="text-[9px] text-gray-400 font-medium">1h ago</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-normal italic">&quot;Great video! We have approved your initial raw draft. Sending whitelisting request now.&quot;</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CAMPAIGN APPLICATION FLOW SECTION */}
      <section className="relative py-24 bg-[#08080A] text-white overflow-hidden">
        {/* Radial Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#EF233C]/10 blur-[130px] rounded-full pointer-events-none opacity-80" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          
          {/* Header Block */}
          <div className="flex flex-col items-start text-left mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-[11px] font-bold tracking-widest uppercase text-gray-300">COLLABORATIONS</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl leading-tight">
              Apply to brand campaigns that match your niche.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Visual: Premium Campaign Workflow Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[360px] rounded-[2.5rem] bg-neutral-900/60 border border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                {/* Glow accent */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#EF233C]/20 rounded-full blur-[30px]" />
                
                <div className="flex flex-col gap-5 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-black tracking-tight text-white leading-tight mb-1">Skincare Launch Campaign</h4>
                      <p className="text-xs text-gray-400 font-semibold">Glow Essentials Co.</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EF233C] to-[#FF6B35] flex items-center justify-center shrink-0 shadow-md">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">REWARD TIER</span>
                      <span className="text-base font-black text-white block mt-0.5">Paid + Product</span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#EF233C]/20 border border-[#EF233C]/30 text-[#EF233C] px-3 py-1 rounded-full">₹25,000 Payout</span>
                  </div>

                  {/* Status Rows */}
                  <div className="flex flex-col gap-3.5 mt-2 relative pl-6">
                    {/* Vertical line indicator */}
                    <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#EF233C] via-[#FF6B35] to-neutral-800" />
                    
                    <div className="flex items-center justify-between relative">
                      <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#EF233C] flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-[#EF233C]/35">✓</div>
                      <span className="text-xs font-bold text-white">Applied</span>
                      <span className="text-[10px] text-gray-400 font-medium">Completed</span>
                    </div>

                    <div className="flex items-center justify-between relative">
                      <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#EF233C] flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-[#EF233C]/35">✓</div>
                      <span className="text-xs font-bold text-white">Under Review</span>
                      <span className="text-[10px] text-gray-400 font-medium">Completed</span>
                    </div>

                    <div className="flex items-center justify-between relative">
                      <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#EF233C] flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-[#EF233C]/35">✓</div>
                      <span className="text-xs font-bold text-white">Selected</span>
                      <span className="text-[10px] text-gray-400 font-medium">Approved</span>
                    </div>

                    <div className="flex items-center justify-between relative">
                      <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-[#FF6B35] bg-[#08080A] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20 animate-pulse" />
                      <span className="text-xs font-bold text-[#FF6B35]">Brief Shared</span>
                      <span className="text-[10px] font-bold text-[#FF6B35] bg-[#FF6B35]/15 border border-[#FF6B35]/25 px-2 py-0.5 rounded-full">Active Step</span>
                    </div>

                    <div className="flex items-center justify-between relative">
                      <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-neutral-700 bg-[#08080A]" />
                      <span className="text-xs font-bold text-gray-500">Content Submitted</span>
                      <span className="text-[10px] text-gray-600 font-medium">Pending</span>
                    </div>

                    <div className="flex items-center justify-between relative">
                      <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-neutral-700 bg-[#08080A]" />
                      <span className="text-xs font-bold text-gray-500">Payment Released</span>
                      <span className="text-[10px] text-gray-600 font-medium">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Flow Steps */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {flowSteps.map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#EF233C]/40 group-hover:bg-[#EF233C]/5 flex items-center justify-center font-bold text-lg text-[#FF6B35] group-hover:text-white transition-all shrink-0 shadow-lg">
                    {step.id}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-white group-hover:text-[#EF233C] transition-colors tracking-tight">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-2xl font-semibold">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Chips */}
          <div className="mt-20 pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-4">
            {featureChips.map((chip, idx) => (
              <div 
                key={idx} 
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#EF233C]/35 hover:bg-[#EF233C]/5 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-wider text-gray-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#EF233C] shadow-[0_0_10px_#EF233C]" />
                {chip}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. CREATOR STORIES (TESTIMONIALS) SECTION */}
      <section className="relative py-24 bg-white text-[#08080A] overflow-hidden">
        {/* Ambient Radial Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#EF233C]/5 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col items-center">
          
          {/* Header Block */}
          <div className="text-center flex flex-col items-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF233C]/10 border border-[#EF233C]/20">
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#EF233C]">CREATOR STORIES</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl leading-tight">
              Creators grow with UGCFY.
            </h2>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16">
            {testimonials.map((test, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 border border-gray-100 hover:border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Stars Row */}
                  <div className="flex gap-0.5 mb-4 text-[#FF6B35]">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 text-xs font-semibold leading-relaxed italic mb-6">
                    &quot;{test.text}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100/80 pt-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EF233C] to-[#FF6B35] text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#08080A] leading-none mb-1">{test.name}</h4>
                    <span className="text-[9px] font-bold text-[#FF6B35] tracking-widest uppercase">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Big CTA */}
          <Link href="/get-started" className="bg-[#EF233C] hover:bg-[#D90429] text-white font-bold rounded-2xl text-lg px-10 py-5 transition-all duration-300 shadow-[0_8px_30px_rgb(239,35,60,0.3)] hover:shadow-[0_8px_35px_rgb(239,35,60,0.5)] flex items-center gap-2 group">
            Join the Creator Community
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

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
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 relative z-10">
              Don’t just post. <br />Build your creator journey.
            </h2>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-semibold relative z-10 leading-relaxed">
              Create your UGCFY profile, discover brand campaigns, and manage collaborations from one mobile-first creator platform.
            </p>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/get-started" className="w-full sm:w-auto justify-center bg-gradient-to-r from-[#EF233C] to-[#FF6B35] hover:opacity-90 text-white font-bold rounded-2xl text-lg px-8 py-4 transition-all duration-300 shadow-[0_8px_30px_rgb(239,35,60,0.3)] flex items-center gap-2 group">
                Join as Creator
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/ecosystem/download-app" className="w-full sm:w-auto justify-center bg-white/5 border border-white/10 hover:border-white/20 text-white hover:bg-white/10 font-bold rounded-2xl text-lg px-8 py-4 transition-all duration-300 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Download App
              </Link>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
