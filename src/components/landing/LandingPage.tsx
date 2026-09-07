"use client";

import { useState, useRef } from "react";

import CreatorDiscoveryMockup from './visuals/CreatorDiscoveryMockup';
import CampaignWorkflowMockup from './visuals/CampaignWorkflowMockup';
import CampaignDashboardMockup from './visuals/CampaignDashboardMockup';
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles, Check, Globe2, Cpu, Layers, Activity, ShieldCheck,
  Quote, ChevronLeft, ChevronRight, ChevronDown, X,
  User, Briefcase, Download, MessageCircle, ArrowRight, Play, Plus, Minus
} from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import RequestAccessModal from "@/components/RequestAccessModal";
import { RedLanding } from "@/components/ui/redlanding";
import LoginPromptModal from "@/components/auth/LoginPromptModal";
import BrandMarqueeSection from "./BrandMarqueeSection";

const whyChooseData = [
  { title: "200M+ Influencers Database", desc: "Access a global network of over 200 million influencers. Find your perfect match across platforms and boost visibility.", icon: Globe2 },
  { title: "Smart AI Powered Dashboard", desc: "Get real-time insights and smart recommendations to track performance, measure ROI, and optimize your campaigns.", icon: Cpu },
  { title: "End to End Campaign Management", desc: "From influencer discovery to final reporting, manage every step of your campaign in one seamless workflow.", icon: Layers },
  { title: "Realtime Performance Tracking", desc: "Monitor your campaign as it happens with live updates on reach and engagement to modify strategies instantly.", icon: Activity },
  { title: "Expert Support at Every Step", desc: "Our dedicated team is always available to guide you through setup, troubleshooting, and scaling.", icon: ShieldCheck },
];

interface AiFeature {
  title: string;
  theme: "light" | "dark";
  eyebrow: string;
  points: string[];
  description: string;
  details: string[];
  longDescription: string;
  useCases: string[];
  benefits: string[];
  workflow: string[];
}

const aiFeatures: AiFeature[] = [
  {
    title: "Discover AI",
    theme: "light",
    eyebrow: "Creator Intelligence",
    points: [
      "Automated Discovery",
      "Seamless Connection",
      "Efficient Invitation",
      "Intelligent Matching",
    ],
    description:
      "Discover AI helps brands identify the right creators faster by analyzing audience fit, niche relevance, campaign objectives, and creator performance signals.",
    details: [
      "Find creators aligned with your campaign goal.",
      "Reduce manual searching and shortlisting time.",
      "Improve creator-brand matching accuracy.",
      "Support data-backed creator discovery decisions.",
    ],
    longDescription:
      "Discover AI is built to remove guesswork from creator selection. Instead of manually browsing profiles, brands can use AI-assisted signals to identify creators who match campaign goals, audience demographics, niche relevance, content style, and performance potential.",
    useCases: [
      "Finding creators for a new product launch",
      "Shortlisting niche creators for targeted campaigns",
      "Matching creators based on audience and content fit",
      "Reducing manual research time for brand teams",
    ],
    benefits: [
      "Faster creator discovery",
      "Better audience-brand alignment",
      "Reduced manual shortlisting effort",
      "More confident campaign planning",
    ],
    workflow: [
      "Brand defines campaign objective",
      "AI analyzes creator fit and relevance",
      "Best-matched creators are surfaced",
      "Brand reviews and shortlists creators",
    ],
  },
  {
    title: "Scripting AI",
    theme: "dark",
    eyebrow: "Content Direction",
    points: [
      "NLG Integration",
      "Style Analysis",
      "Content Alignment",
      "Dynamic Adaptation",
    ],
    description:
      "Scripting AI supports creator briefs and content direction by generating campaign-aligned script structures, tone guidance, and platform-specific content angles.",
    details: [
      "Generate structured script ideas for creators.",
      "Match brand tone and content style.",
      "Adapt scripts for reels, shorts, stories, and posts.",
      "Keep messaging aligned with campaign objectives.",
    ],
    longDescription:
      "Scripting AI helps brands convert campaign goals into creator-ready content direction. It assists with script structures, hooks, tone, product mentions, platform-specific formats, and brand-safe messaging so creators can produce content that stays aligned with the brief.",
    useCases: [
      "Creating creator briefs for reels and shorts",
      "Maintaining brand tone across multiple creators",
      "Generating hooks and content angles",
      "Adapting messaging for different platforms",
    ],
    benefits: [
      "Stronger content consistency",
      "Faster brief preparation",
      "Better creator execution",
      "Reduced revision cycles",
    ],
    workflow: [
      "Brand enters campaign objective and key message",
      "AI suggests content angles and script structure",
      "Brand reviews and finalizes guidelines",
      "Creators receive clearer execution direction",
    ],
  },
  {
    title: "Negotiation AI",
    theme: "light",
    eyebrow: "Deal Intelligence",
    points: [
      "Data-Driven Negotiations",
      "Performance Metrics",
      "Efficient Collaboration",
      "Predictive Analytics",
    ],
    description:
      "Negotiation AI helps brands make smarter collaboration decisions by evaluating creator value, expected output, performance history, and campaign budget fit.",
    details: [
      "Compare creator pricing with campaign value.",
      "Support fair collaboration decisions.",
      "Use performance indicators in negotiation.",
      "Improve brand-creator collaboration efficiency.",
    ],
    longDescription:
      "Negotiation AI supports smarter creator collaboration decisions by comparing expected creator value with campaign budget, historical performance, deliverable scope, audience quality, and estimated campaign impact.",
    useCases: [
      "Evaluating creator pricing before approval",
      "Comparing creators for the same campaign",
      "Planning budget allocation across creators",
      "Supporting fair and transparent negotiations",
    ],
    benefits: [
      "More informed negotiation decisions",
      "Better budget control",
      "Reduced overpaying risk",
      "Improved creator collaboration quality",
    ],
    workflow: [
      "Brand reviews creator proposal",
      "AI evaluates pricing and performance signals",
      "Brand receives decision support",
      "Final collaboration terms are confirmed",
    ],
  },
  {
    title: "Content Audit AI",
    theme: "dark",
    eyebrow: "Quality Control",
    points: [
      "Thorough Audit",
      "Script Alignment",
      "Guideline Adherence",
      "Real-Time Reporting",
    ],
    description:
      "Content Audit AI checks submitted content against campaign guidelines, brand safety requirements, scripts, and deliverable expectations before approval.",
    details: [
      "Review content against campaign guidelines.",
      "Detect missing script or brand-message alignment.",
      "Support faster approval workflows.",
      "Improve reporting and content quality control.",
    ],
    longDescription:
      "Content Audit AI helps brands review creator submissions before approval. It checks whether the content follows the campaign brief, includes required talking points, avoids restricted claims, and aligns with the approved script and brand guidelines.",
    useCases: [
      "Checking creator submissions before posting",
      "Reviewing script and guideline compliance",
      "Reducing manual content approval workload",
      "Maintaining brand safety across campaigns",
    ],
    benefits: [
      "Faster content review",
      "Better brand guideline compliance",
      "Reduced approval errors",
      "Stronger content quality control",
    ],
    workflow: [
      "Creator submits content",
      "AI checks content against the brief",
      "Brand receives audit signals",
      "Brand approves, rejects, or requests changes",
    ],
  },
  {
    title: "Performance AI",
    theme: "light",
    eyebrow: "Campaign Optimization",
    points: [
      "Optimize Campaigns",
      "Data-Driven Decisions",
      "Automated Partnerships",
      "Predictive Insights",
    ],
    description:
      "Performance AI helps brands understand campaign progress, creator performance, engagement quality, and optimization opportunities across active campaigns.",
    details: [
      "Track campaign performance indicators.",
      "Identify high-performing creator partnerships.",
      "Support data-backed campaign optimization.",
      "Improve future campaign planning.",
    ],
    longDescription:
      "Performance AI helps brands monitor and improve campaign outcomes by analyzing performance signals, engagement quality, creator contribution, deliverable progress, and optimization opportunities across active and completed campaigns.",
    useCases: [
      "Tracking live campaign performance",
      "Comparing creator output quality",
      "Identifying campaign optimization opportunities",
      "Planning future campaigns using past performance",
    ],
    benefits: [
      "Clearer campaign visibility",
      "Better optimization decisions",
      "Improved creator partnership planning",
      "More data-backed reporting",
    ],
    workflow: [
      "Campaign performance data is collected",
      "AI identifies trends and weak points",
      "Brand receives optimization insights",
      "Future campaigns improve based on learnings",
    ],
  },
];
const platformFeatures = [
  {
    id: 1,
    step: "01",
    tag: "DISCOVERY",
    glow: "from-rose-500/10 via-pink-500/5 to-transparent",
    title: "Discover",
    highlight: "Influencers",
    description: "84% of marketers say finding the right influencers is their top challenge. But No Worries, our AI influencer marketing tool is ready to cater this problem with its advanced influencer discovery features. In just few clicks, find perfect match for your campaign by leveraging filters like audience demographics, follower count, target audience details, influencer and audience location, brand collaborations, engagement rate, average likes, average comments, story views, and more all within a high-tech influencer finder tool.",
    buttonText: "Explore More",
    buttonLink: "/platform/discover",
    visual: <CreatorDiscoveryMockup />
  },
  {
    id: 2,
    step: "02",
    tag: "AUTOMATION",
    glow: "from-orange-500/10 via-rose-500/5 to-transparent",
    title: "Outreach",
    highlight: "Made Easy",
    description: "Say goodbye to messy spreadsheets and lost emails. Our platform allows you to automate personalized outreach campaigns at scale. Sync your email, track open rates, and manage negotiations all from a single, unified inbox designed specifically for influencer relations.",
    buttonText: "Start Outreach",
    buttonLink: "/platform/outreach",
    visual: <CampaignWorkflowMockup />
  },
  {
    id: 3,
    step: "03",
    tag: "MANAGEMENT",
    glow: "from-purple-500/10 via-indigo-500/5 to-transparent",
    title: "Manage",
    highlight: "Campaigns",
    description: "Keep your entire team in sync with real-time campaign tracking. Monitor content deliverables, approve drafts, and track live posts automatically. Our comprehensive dashboard gives you a bird's-eye view of your entire influencer marketing ecosystem.",
    buttonText: "View Dashboard",
    buttonLink: "/platform/manage",
    visual: <CampaignDashboardMockup />
  }
];


const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const successCreators = [
  {
    name: "Simran Bakhtiyar",
    handle: "@staycurious_withsimran",
    instagramUrl: "https://www.instagram.com/staycurious_withsimran/",
    niche: "Lifestyle • Travel • Storytelling",
    image: "/images/creators/simran-bakhtiyar.jpg",
    stats: [
      { label: "Audience", value: "120K+" },
      { label: "Brand Reach", value: "8.5M+" },
      { label: "Growth", value: "+42%" }
    ],
    quote: "“Turning authentic storytelling into structured brand opportunities.”"
  },
  {
    name: "Ankit Arora",
    handle: "@ai_ankitarora",
    instagramUrl: "https://www.instagram.com/ai_ankitarora/",
    niche: "AI • Tech • Education",
    image: "/images/creators/ankit-arora.jpg",
    stats: [
      { label: "Audience", value: "95K+" },
      { label: "Brand Reach", value: "6.2M+" },
      { label: "Growth", value: "+38%" }
    ],
    quote: "“Helping education and tech content convert into trusted brand collaborations.”"
  },
  {
    name: "Niharika Singh",
    handle: "@coach.niharika",
    instagramUrl: "https://www.instagram.com/coach.niharika/",
    niche: "Coaching • Growth • Personal Brand",
    image: "/images/creators/niharika-singh.jpg",
    stats: [
      { label: "Audience", value: "80K+" },
      { label: "Brand Reach", value: "4.8M+" },
      { label: "Growth", value: "+31%" }
    ],
    quote: "“Building a stronger personal brand through clearer creator-brand workflows.”"
  }
];

const ctaCards = [
  {
    label: "For Creators",
    title: ["Build.", "Apply.", "Earn."],
    description: "Create your profile, discover paid campaigns, and manage brand collaborations with clarity.",
    buttonText: "Join as a Creator",
    icon: User,
    colorTheme: "rose",
  },
  {
    label: "For Brands",
    title: ["Find.", "Launch.", "Track."],
    description: "Discover verified creators, launch structured UGC campaigns, and review applications from one dashboard.",
    buttonText: "Join as a Brand",
    icon: Briefcase,
    colorTheme: "purple",
  },
  {
    label: "Campaign Workflow",
    title: ["Brief.", "Collaborate.", "Deliver."],
    description: "Move from campaign brief to creator selection, content delivery, and review without scattered follow-ups.",
    buttonText: "Explore Campaigns",
    icon: Layers,
    colorTheme: "orange",
  }
];

export default function LandingPage() {
  const [activeAiIndex, setActiveAiIndex] = useState(0);
  const [selectedAiFeature, setSelectedAiFeature] = useState<AiFeature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [activeCreatorIndex, setActiveCreatorIndex] = useState(0);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const creatorScrollRef = useRef<HTMLDivElement>(null);
  const featureScrollRef = useRef<HTMLDivElement>(null);

  const handleFeatureScroll = () => {
    if (!featureScrollRef.current) return;
    const container = featureScrollRef.current;
    const card = container.firstElementChild as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : 320;
    const scrollPosition = container.scrollLeft;
    const newIndex = Math.round(scrollPosition / (cardWidth + 16));
    const maxIdx = Math.max((platformFeatures?.length ?? 1) - 1, 0);
    setActiveFeatureTab(Math.min(Math.max(newIndex, 0), maxIdx));
  };

  const scrollToFeature = (index: number) => {
    if (!featureScrollRef.current) return;
    const container = featureScrollRef.current;
    const cards = container.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    setActiveFeatureTab(index);
  };

  const handleCreatorScroll = () => {
    if (!creatorScrollRef.current) return;
    const container = creatorScrollRef.current;
    const card = container.firstElementChild as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : 300;
    const scrollPosition = container.scrollLeft;
    const newIndex = Math.round(scrollPosition / (cardWidth + 16));
    const maxIdx = Math.max((successCreators?.length ?? 1) - 1, 0);
    setActiveCreatorIndex(Math.min(Math.max(newIndex, 0), maxIdx));
  };

  const scrollToCreator = (index: number) => {
    if (!creatorScrollRef.current) return;
    const container = creatorScrollRef.current;
    const cards = container.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    setActiveCreatorIndex(index);
  };

  const [openFaq, setOpenFaq] = useState<number>(0);

  const faqData = [
    { question: "What is an Influencer marketing platform?", answer: "An influencer marketing platform is a tool that helps brands, businesses, and companies find influencers, contact them, run campaigns, and track results. It also helps with handling payments and agreements between the brand and the influencer." },
    { question: "What features does your influencer marketing tool offer?", answer: "Our platform offers AI-driven creator discovery, automated campaign workflows, real-time ROI analytics, escrow-protected payments, and an omnichannel dashboard to manage everything in one place." },
    { question: "How UGCFY is an AI powered Self Serve Influencer marketing platform?", answer: "UGCFY leverages advanced AI to automate the entire influencer workflow. From discovering the perfect creators based on your target audience to generating campaign briefs and predicting performance, our self-serve tools do the heavy lifting." },
    { question: "Do you Provide Training and Support for your influencer discovery tool?", answer: "Absolutely. We offer comprehensive onboarding, dedicated account managers for enterprise clients, and a rich library of resources and tutorials to ensure you get the most out of our tools." },
    { question: "How can users get started with UGCFY's influencer management platform?", answer: "Simply click 'Get Started' or 'Request Access', fill out your details, and our team will set up your workspace. You can begin discovering and reaching out to creators on day one." },
    { question: "What are the USP's of UGCFY Influencer Marketing Tool?", answer: "Our main USPs include our proprietary Discovery AI, escrow-based secure payments, a focus on high-converting 9:16 UGC formats, and our deep integration with major social platform APIs for real-time analytics." },
    { question: "Who can use UGCFY's influencer marketing dashboard?", answer: "Our dashboard is built for scaling brands, marketing teams and creator managers, and enterprise companies looking for a highly efficient, automated way to run influencer campaigns." },
    { question: "Do you provide support from influencer marketing experts if required?", answer: "Yes, we offer fully managed campaign services alongside our self-serve platform. If you need hands-on expertise, our in-house strategy and production teams are ready to run your campaigns end-to-end." },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 w-full overflow-x-hidden selection:bg-[var(--color-primary)]/10 selection:text-[var(--color-primary-hover)]">

      {/* NAVBAR */}
      <Navbar theme="transparent-to-dark" />

      {/* 1. HERO SECTION (Red Landing) */}
      <RedLanding />

      {/* 2. INFINITE BRAND MARQUEE */}
      <BrandMarqueeSection />

      {/* 3. CINEMATIC VIDEO SHOWCASE SECTION */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[680px] lg:h-[720px] flex items-center overflow-hidden bg-[#05070A]">
        {/* Full-Bleed Background Video with subtle cinematic grading */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center md:object-[60%_center] opacity-90 transition-opacity duration-1000"
          style={{
            filter: "brightness(0.85) contrast(1.04) saturate(0.95)",
          }}
          src="/hero-bg.mp4"
        />

        {/* Layer 1: Ambient neutral base overlay */}
        <div className="absolute inset-0 bg-black/25 z-[1]" />

        {/* Layer 2: Text-Safe Directional Scrim (Left-to-Right asymmetrical gradient) */}
        <div 
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(5,7,10,0.92) 0%, rgba(5,7,10,0.80) 32%, rgba(5,7,10,0.40) 65%, rgba(5,7,10,0.12) 100%)",
          }}
        />

        {/* Layer 3: Vertical edge fades to softly blend into adjacent sections */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#000000] to-transparent pointer-events-none z-[3]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-bg-light)]/30 via-[#05070A]/40 to-transparent pointer-events-none z-[3]" />

        {/* Layer 4: Ambient Brand Atmosphere Glow */}
        <div className="absolute -top-1/4 -left-1/6 w-[45%] h-[75%] rounded-full bg-[var(--color-primary)]/10 blur-[140px] pointer-events-none z-[3]" />
        <div className="absolute -bottom-1/4 left-1/4 w-[35%] h-[55%] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none z-[3]" />

        {/* Content Container - Editorial Left-Aligned Composition */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10 w-full py-16 sm:py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[560px] sm:max-w-[620px] flex flex-col items-start text-left"
          >
            {/* Cinematic Eyebrow / Live Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold uppercase tracking-widest text-white/90 mb-5 sm:mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]" />
              </span>
              <span>Platform Preview</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-black text-white leading-[1.02] tracking-tight mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              See <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/90">UGCFY</span> in Action
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-[19px] text-white/80 font-medium leading-[1.62] mb-8 sm:mb-9 max-w-[520px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
              Watch how leading brands are automating their entire influencer marketing workflow and scaling UGC content effortlessly.
            </p>

            {/* Watch Full Demo CTA */}
            <Link
              href="/request-demo"
              className="h-[54px] sm:h-[58px] px-7 sm:px-8 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm sm:text-base inline-flex items-center gap-3.5 shadow-xl shadow-rose-500/25 hover:shadow-2xl hover:shadow-rose-500/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
              </div>
              <span className="tracking-wide">Watch Full Demo</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. CORE FEATURES SECTION (ZIG-ZAG) */}
      <section className="pt-10 sm:pt-14 md:pt-16 pb-16 sm:pb-20 md:pb-28 bg-[var(--color-bg-light)] relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Heading */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight leading-tight">
              Core Features of UGCFY
            </h2>
          </div>

          {/* MOBILE VIEW: Touch-Friendly Horizontal Swipe Carousel & Segmented Tabs */}
          <div className="block md:hidden">
            {/* Segmented Feature Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/70 shadow-xs mb-5 w-full">
              {platformFeatures.map((feature, idx) => {
                const isActive = activeFeatureTab === idx;
                return (
                  <button
                    key={feature.id}
                    onClick={() => scrollToFeature(idx)}
                    className={`flex-1 py-2 px-1 text-center rounded-xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white shadow-md shadow-rose-500/20 scale-[1.02]"
                        : "text-gray-600 hover:text-gray-900 bg-transparent"
                    }`}
                  >
                    <span className="block text-[9px] font-extrabold opacity-80 uppercase tracking-widest leading-none mb-1">{feature.step}</span>
                    <span className="truncate block text-xs font-black">{feature.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Native Horizontal Touch-Swipe Track */}
            <div
              ref={featureScrollRef}
              onScroll={handleFeatureScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 gap-4 pb-3 scroll-smooth"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {platformFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="w-[88vw] max-w-[380px] shrink-0 snap-center flex flex-col gap-4 bg-white/80 backdrop-blur-md rounded-[28px] p-4 sm:p-5 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
                >
                  {/* Mockup Frame */}
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                    <div
                      aria-hidden="true"
                      className={`absolute -inset-4 rounded-3xl bg-gradient-to-tr ${feature.glow} blur-xl opacity-60 pointer-events-none`}
                    />
                    <div className="relative">
                      {feature.visual}
                    </div>
                  </div>

                  {/* Feature Content */}
                  <div className="flex flex-col items-start text-left px-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100/70 text-[10px] font-extrabold tracking-widest text-[var(--color-primary)] uppercase mb-2.5 shadow-2xs">
                      <span>{feature.step}</span>
                      <span className="text-rose-300">•</span>
                      <span>{feature.tag}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] mb-2.5 tracking-tight leading-snug">
                      {feature.title} <span className="text-[var(--color-primary)]">{feature.highlight}</span>
                    </h3>

                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 font-normal">
                      {feature.description}
                    </p>

                    <Link
                      href={feature.buttonLink}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3.5 px-6 text-sm rounded-xl shadow-md shadow-rose-500/20 active:scale-[0.98] transition-all duration-200"
                    >
                      <span>{feature.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Navigation Dots & Arrows */}
            <div className="flex items-center justify-between pt-3 px-2 mt-1">
              <button
                onClick={() => scrollToFeature(Math.max(activeFeatureTab - 1, 0))}
                disabled={activeFeatureTab === 0}
                aria-label="Previous feature"
                className={`p-2 rounded-lg border transition-colors ${
                  activeFeatureTab === 0
                    ? "text-gray-300 border-gray-100 cursor-not-allowed"
                    : "text-gray-700 border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {platformFeatures.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => scrollToFeature(dotIdx)}
                    aria-label={`Go to feature ${dotIdx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeFeatureTab === dotIdx
                        ? "w-6 h-1.5 bg-[var(--color-primary)]"
                        : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollToFeature(Math.min(activeFeatureTab + 1, platformFeatures.length - 1))}
                disabled={activeFeatureTab === platformFeatures.length - 1}
                aria-label="Next feature"
                className={`p-2 rounded-lg border transition-colors ${
                  activeFeatureTab === platformFeatures.length - 1
                    ? "text-gray-300 border-gray-100 cursor-not-allowed"
                    : "text-gray-700 border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW: Full Spacious Zig-Zag Layout */}
          <div className="hidden md:flex flex-col gap-20 sm:gap-24 md:gap-32">
            {platformFeatures.map((feature, index) => {
              const isVisuallyReversed = index % 2 !== 0;

              return (
                <div
                  key={feature.id}
                  className={`flex flex-col md:flex-row items-center gap-10 sm:gap-14 lg:gap-20 ${
                    isVisuallyReversed ? "md:flex-row-reverse" : ""
                  } group`}
                >
                  {/* Visual Mockup Container (50-52% width) */}
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.985 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full md:w-1/2 relative"
                  >
                    {/* Ambient Glow behind Mockup */}
                    <div
                      aria-hidden="true"
                      className={`absolute -inset-4 rounded-3xl bg-gradient-to-tr ${feature.glow} blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                    />

                    {/* Elevated Mockup Frame */}
                    <div className="relative rounded-2xl md:rounded-[26px] overflow-hidden bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] group-hover:shadow-[0_28px_60px_-12px_rgba(225,29,72,0.09)] transition-all duration-500 transform group-hover:-translate-y-1">
                      {feature.visual}
                    </div>
                  </motion.div>

                  {/* Content Column (44-48% width) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full md:w-1/2 flex flex-col items-start text-left"
                  >
                    {/* Step Indicator Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100/70 text-[10px] sm:text-[11px] font-extrabold tracking-widest text-[var(--color-primary)] uppercase mb-3.5 shadow-2xs">
                      <span>{feature.step}</span>
                      <span className="text-rose-300">•</span>
                      <span>{feature.tag}</span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#0A0A0A] mb-4 tracking-tight leading-[1.15]">
                      {feature.title} <span className="text-[var(--color-primary)]">{feature.highlight}</span>
                    </h3>

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal">
                      {feature.description}
                    </p>

                    <Link
                      href={feature.buttonLink}
                      className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3.5 px-7 text-sm sm:text-base rounded-xl shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                      <span>{feature.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEW SECTION 4: CREATOR SUCCESS STORIES */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#FFFDFD] via-[#FDFBFB] to-[#FDF8F6] relative overflow-hidden">
        {/* Subtle Background Grid Pattern with Radial Mask */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
          style={{
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
          }}
        />

        {/* Soft radial glows native to UGCFY visual identity */}
        {/* Top-left glow: red/orange */}
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-orange-500/8 blur-[130px] pointer-events-none" />

        {/* Top-right glow: purple/violet */}
        <div className="absolute top-[5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-purple-500/8 to-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* Bottom glow: soft orange/rose */}
        <div className="absolute bottom-[-10%] left-[25%] w-[50%] h-[45%] rounded-full bg-gradient-to-tr from-orange-400/8 via-rose-400/6 to-purple-500/5 blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Centered Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100/60 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              CREATOR GROWTH STORIES
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Creators Building Momentum With <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-600">UGCFY</span>
            </h2>
            <p className="text-lg text-gray-500 font-semibold leading-relaxed">
              UGCFY helps creators turn authentic content, audience trust, and brand fit into structured collaboration opportunities.
            </p>
          </div>

          {/* Creators Swipe Carousel on Mobile / Grid on Desktop */}
          <div
            ref={creatorScrollRef}
            onScroll={handleCreatorScroll}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 gap-4 sm:gap-6 lg:gap-8 pb-3 md:pb-0 scroll-smooth"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {successCreators.map((creator, i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => setIsLoginPromptOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsLoginPromptOpen(true);
                  }
                }}
                className="flex flex-col text-left bg-white/70 backdrop-blur-xl rounded-[28px] sm:rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(225,29,72,0.06)] hover:border-rose-200/60 hover:-translate-y-1 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 w-[82vw] max-w-[340px] sm:max-w-none sm:w-[360px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none cursor-pointer"
                aria-label={`View success story of ${creator.name}`}
              >
                {/* Image Container */}
                <div className="p-4 sm:p-5 pb-0 w-full">
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-tr from-rose-50 to-orange-50/50">
                    <Image
                      src={creator.image}
                      alt={creator.name}
                      fill
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Instagram Badge */}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md py-1.5 px-3.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm text-[10px] font-extrabold text-white tracking-wide">
                      <svg className="w-3 h-3 text-rose-500 fill-rose-500" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>{creator.handle}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 pt-4 sm:pt-5 flex flex-col flex-grow w-full">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-extrabold text-xl text-gray-900 leading-none">{creator.name}</span>
                    <svg className="w-5 h-5 text-blue-500 fill-blue-500 shrink-0" viewBox="0 0 24 24">
                      <path fill="white" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.59l-1.42 1.41-5-5 1.41-1.41 3.59 3.59 7.59-7.59 1.42 1.42-9 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-rose-600/80 mb-4 tracking-wider uppercase">{creator.niche}</span>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 sm:p-3 bg-gray-50/30 group-hover:bg-rose-50/20 rounded-2xl border border-gray-100/60 group-hover:border-rose-100/40 mb-5 transition-all duration-300">
                    {creator.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="text-center relative after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-gray-200/60 last:after:hidden">
                        <div className="text-base font-black text-gray-900 leading-none mb-1 group-hover:text-[var(--color-primary)] transition-colors duration-300">{stat.value}</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-500 transition-colors duration-300">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mt-auto pt-3 sm:pt-4 border-t border-gray-100/50 w-full">
                    <Quote className="w-8 h-8 text-[var(--color-primary)]/10 absolute -top-3.5 -left-2 rotate-180 pointer-events-none" />
                    <p className="text-sm text-gray-600 font-medium italic leading-relaxed text-left relative z-10 pl-6">
                      {creator.quote}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Swipe Pagination Indicator */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-4 pt-1">
            {successCreators.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => scrollToCreator(dotIdx)}
                aria-label={`Go to creator ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  activeCreatorIndex === dotIdx
                    ? "w-6 h-1.5 bg-gradient-to-r from-[var(--color-primary)] to-purple-600"
                    : "w-1.5 h-1.5 bg-gray-300/80 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
            <Link
              href="/ecosystem/download-app"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] via-orange-500 to-purple-600 hover:opacity-95 hover:shadow-lg hover:shadow-rose-500/10 active:scale-[0.98] transition-all duration-300 text-white font-bold text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Download App</span>
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-gray-200/80 hover:border-rose-200/80 hover:bg-white/60 text-gray-800 hover:text-gray-900 font-bold text-sm tracking-wide shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>Contact Us</span>
            </Link>
          </div>

        </div>
      </section>

      {/* NEW SECTION 6: EVERYTHING YOU NEED / CTA + FOUNDER QUOTE */}
      <section className="py-14 sm:py-16 md:py-20 bg-gradient-to-b from-[#FFFFFF] via-[#FFFDFD] to-[#FCF9F8] relative overflow-hidden">
        {/* Soft warm radial glow matching red/orange/purple */}
        <div className="absolute top-1/3 right-1/4 w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[35%] h-[35%] rounded-full bg-[var(--color-primary)]/5 blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Centered Heading */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100/60 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-4 sm:mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              BUILT FOR FOCUSED GROWTH
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3.5">
              Everything You Need.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-600">Nothing You Don’t.</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-500 font-semibold leading-relaxed">
              A focused workspace for creators and brands to move from discovery to collaboration without operational chaos.
            </p>
          </div>

          {/* CTA Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {ctaCards.map((card, i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => setIsLoginPromptOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsLoginPromptOpen(true);
                  }
                }}
                className="relative flex flex-col rounded-[32px] p-6 sm:p-8 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] hover:border-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 w-full h-full"
                aria-label={`Join as ${card.label}`}
              >
                {/* Badge Label & Icon Row */}
                <div className="flex items-center justify-between w-full mb-6 sm:mb-7">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border shadow-2xs ${
                    card.colorTheme === 'rose'
                      ? 'bg-rose-50 border-rose-100/70 text-rose-600'
                      : card.colorTheme === 'purple'
                      ? 'bg-purple-50 border-purple-100/70 text-purple-600'
                      : 'bg-orange-50 border-orange-100/70 text-orange-600'
                  }`}>
                    {card.label}
                  </span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 shadow-2xs ${
                    card.colorTheme === 'rose'
                      ? 'bg-rose-50/70 border-rose-100/60 text-rose-500'
                      : card.colorTheme === 'purple'
                      ? 'bg-purple-50/70 border-purple-100/60 text-purple-500'
                      : 'bg-orange-50/70 border-orange-100/60 text-orange-500'
                  }`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Centered Main Content Area */}
                <div className="flex flex-col items-center text-center my-auto py-1 sm:py-2">
                  {/* Multiline Centered Heading */}
                  <h3 className="text-3xl sm:text-4xl lg:text-[38px] font-black tracking-tight leading-[1.1] mb-3.5 sm:mb-4 flex flex-col items-center text-center text-gray-900">
                    {card.title.map((line, lIdx) => {
                      const isLast = lIdx === card.title.length - 1;
                      if (isLast) {
                        const gradientClass =
                          card.colorTheme === 'rose'
                            ? 'from-[var(--color-primary)] to-pink-500'
                            : card.colorTheme === 'purple'
                            ? 'from-purple-600 to-indigo-600'
                            : 'from-orange-500 to-rose-500';
                        return (
                          <span key={lIdx} className={`text-transparent bg-clip-text bg-gradient-to-r ${gradientClass}`}>
                            {line}
                          </span>
                        );
                      }
                      return <span key={lIdx}>{line}</span>;
                    })}
                  </h3>

                  {/* Centered Description */}
                  <p className="text-gray-500 text-sm sm:text-[14.5px] leading-relaxed font-medium max-w-[280px] sm:max-w-[290px] mx-auto text-center">
                    {card.description}
                  </p>
                </div>

                {/* Pinned Action Button */}
                <div className={`mt-6 sm:mt-7 w-full py-3.5 px-6 rounded-2xl text-center font-bold text-sm tracking-wide transition-all shadow-sm group-hover:shadow-md group-hover:scale-[1.01] active:scale-[0.98] duration-300 flex items-center justify-center gap-2 ${
                  card.colorTheme === 'rose'
                    ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-rose-500/15'
                    : card.colorTheme === 'purple'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/15'
                    : 'bg-gray-950 hover:bg-gray-900 text-white shadow-gray-950/15'
                }`}>
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>

          {/* Founder Quote Row */}
          <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100/90 shadow-[0_6px_30px_rgba(0,0,0,0.02)] p-6 sm:p-7 md:p-8 rounded-[28px] flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 md:gap-7">
              {/* Founder Image */}
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl overflow-hidden border border-gray-100 bg-rose-50 shrink-0 shadow-xs">
                <Image
                  src="/images/team/shubham-mishra.jpg"
                  alt="Shubham Mishra"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Quote Block */}
              <div className="flex flex-col gap-2.5 sm:gap-3 text-left flex-1">
                <div className="flex items-center gap-2">
                  <Quote className="w-5 h-5 text-[var(--color-primary)] fill-[var(--color-primary)]/15 shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[var(--color-primary)] uppercase tracking-wider">Founder&apos;s Perspective</span>
                </div>
                <blockquote className="text-[15px] sm:text-base md:text-lg font-bold text-gray-800 leading-relaxed">
                  UGCFY is built to remove the friction from <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-orange-500">creator-led marketing</span>. Our focus is simple: help brands discover the right creators, help creators access structured opportunities, and make every collaboration easier to manage, measure, and scale.
                </blockquote>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-extrabold text-gray-900 text-sm leading-tight">Shubham Mishra</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">CEO, UGCFY</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8: PROFESSIONAL USP GRID */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-brand-red-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">The UGCFY Advantage</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red-500 to-rose-400">UGCFY?</span>
            </h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Experience the next generation of influencer marketing. Everything you need to discover, manage, and scale your campaigns in one unified platform.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-6 gap-6"
          >
            {whyChooseData.map((usp, idx) => {
              const colSpanClasses = [
                "md:col-span-4",
                "md:col-span-2",
                "md:col-span-2",
                "md:col-span-2",
                "md:col-span-2",
              ];

              const isLarge = idx === 0;

              return (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className={`bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 flex ${isLarge ? 'flex-col sm:flex-row items-center sm:items-start text-center sm:text-left' : 'flex-col items-start text-left'} shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${colSpanClasses[idx]}`}
                >
                  {/* Hover Flare */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-brand-red-500/5 rounded-full translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700 ease-out blur-xl" />

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr from-white to-brand-red-50/50 flex items-center justify-center shadow-sm border border-gray-100/60 relative z-10 shrink-0 group-hover:border-brand-red-100 transition-colors duration-300 ${isLarge ? 'mb-6 sm:mb-0 sm:mr-8 w-20 h-20' : 'mb-6'}`}>
                    <usp.icon className={`${isLarge ? 'w-8 h-8' : 'w-7 h-7'} text-brand-red-500`} strokeWidth={1.5} />
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col justify-center h-full">
                    <h3 className={`font-bold text-gray-900 tracking-tight mb-3 ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{usp.title}</h3>
                    <p className={`text-gray-500 leading-relaxed ${isLarge ? 'text-base md:text-lg max-w-lg' : 'text-sm'}`}>{usp.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 9: AI INTEGRATION CAROUSEL */}
      <section className="relative overflow-hidden bg-[#FDFBFB] py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-center">

            {/* Left Editorial Content */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E11D48]/15 bg-white px-4 py-2 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#E11D48] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#E11D48]">
                    AI Powered
                  </span>
                </div>

                <h2 className="max-w-[520px] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.98] text-[#0A0A0A]">
                  AI Integration By UGCFY
                </h2>

                <div className="flex flex-col gap-4">
                  <p className="text-gray-600 text-lg leading-relaxed max-w-[480px]">
                    When AI is all the rage in the digital sphere, let us bring you on the same page with our bespoke AI integrations.
                  </p>
                  <p className="text-gray-500 text-base leading-relaxed max-w-[480px]">
                    UGCFY integrates AI to bring precision to your influencer marketing campaigns by delivering data-backed strategies, superior targeting, and real-time adjustments.
                  </p>
                </div>
              </div>

              <Link href="/ai-integration" className="group relative inline-flex w-fit items-center justify-center rounded-2xl bg-[#E11D48] px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-[#E11D48]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#BE123C] hover:shadow-2xl hover:shadow-[#E11D48]/25 active:translate-y-0">
                <span>Explore more</span>
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Small understated feature row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2">
                <span className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                  <Check className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>5 AI modules</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                  <Check className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>Campaign precision</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                  <Check className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>Real-time optimization</span>
                </span>
              </div>
            </div>

            {/* Right AI Showcase Card (Single Panel) */}
            <div className="relative w-full flex items-center justify-center lg:justify-end">
              <AnimatePresence mode="wait">
                {(() => {
                  const currentAi = (aiFeatures[activeAiIndex] || aiFeatures[0]) as AiFeature;
                  return (
                    <motion.div
                      key={activeAiIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`relative w-full flex flex-col justify-between p-6 sm:p-8 md:p-10 rounded-[36px] border transition-all duration-500 min-h-[430px] ${currentAi.theme === 'dark'
                        ? 'bg-[#0A0A0A] text-white border-white/10 shadow-2xl shadow-black/20'
                        : 'bg-white text-[#0A0A0A] border-black/5 shadow-2xl shadow-black/5'
                        }`}
                    >
                      <div className="flex flex-col gap-6">

                        {/* Top row */}
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <div className={`inline-flex px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.15em] ${currentAi.theme === 'dark' ? 'bg-white/10 text-white' : 'bg-[#E11D48]/10 text-[#E11D48]'
                            }`}>
                            {currentAi.eyebrow}
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${currentAi.theme === 'dark' ? 'border-white/10 text-gray-300 bg-white/5' : 'border-gray-100 text-gray-500 bg-gray-50'
                            }`}>
                            <Sparkles className="w-3 h-3" />
                            AI Module
                          </div>
                        </div>

                        {/* Main Title & Desc */}
                        <div>
                          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                            {currentAi.title}
                          </h3>
                          <p className={`text-base leading-relaxed ${currentAi.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {currentAi.description}
                          </p>
                        </div>

                        {/* Points grid */}
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 my-2">
                          {currentAi.points.map((point, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#E11D48]">
                                <Check className="w-3 h-3 text-white stroke-[3]" />
                              </div>
                              <span className={`text-[15px] font-bold leading-tight ${currentAi.theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer: Read More & Controls */}
                      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <button
                          type="button"
                          onClick={() => setSelectedAiFeature(currentAi)}
                          aria-label={`Read more about ${currentAi.title}`}
                          className={`group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-xl font-extrabold text-sm border transition-all duration-300 ${currentAi.theme === 'dark'
                            ? 'border-white/15 text-white bg-white/5 hover:bg-white/10'
                            : 'border-gray-200 text-[#0A0A0A] bg-gray-50/50 hover:bg-gray-100'
                            }`}
                        >
                          Read More
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">

                          {/* Progress Dots */}
                          <div className="flex items-center gap-2">
                            {aiFeatures.map((feature, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setActiveAiIndex(i)}
                                aria-label={`Show ${feature.title}`}
                                className={`h-2 rounded-full transition-all duration-300 ${activeAiIndex === i
                                  ? 'w-6 bg-[#E11D48]'
                                  : `w-2 hover:w-3 ${currentAi.theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'}`
                                  }`}
                              />
                            ))}
                          </div>

                          {/* Arrows */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              aria-label="Show previous AI service"
                              onClick={() => setActiveAiIndex(prev => prev === 0 ? aiFeatures.length - 1 : prev - 1)}
                              className={`p-3 rounded-full border transition-all active:scale-95 flex items-center justify-center shadow-sm ${currentAi.theme === 'dark'
                                ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                                : 'border-gray-200 bg-white hover:bg-gray-50 text-[#0A0A0A]'
                                }`}
                            ><ChevronLeft className="w-5 h-5" /></button>
                            <button
                              type="button"
                              aria-label="Show next AI service"
                              onClick={() => setActiveAiIndex(prev => (prev + 1) % aiFeatures.length)}
                              className={`p-3 rounded-full border transition-all active:scale-95 flex items-center justify-center shadow-sm ${currentAi.theme === 'dark'
                                ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                                : 'border-gray-200 bg-white hover:bg-gray-50 text-[#0A0A0A]'
                                }`}
                            ><ChevronRight className="w-5 h-5" /></button>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>      {/* 10. FAQ SECTION */}
      <section id="faq-section" className="relative py-10 sm:py-12 md:py-14 lg:py-16 bg-[#FCFCFD] overflow-hidden border-t border-gray-100/80">
        {/* Atmospheric Ambient Glow */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-rose-500/[0.035] rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
        <div className="absolute bottom-10 right-0 w-[28rem] h-[28rem] bg-gray-200/25 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 xl:gap-20 items-start">
            
            {/* LEFT COLUMN: Premium Designed FAQ Identity Anchor (Sticky on Desktop) */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 self-start">
              <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 lg:p-8 xl:p-9 bg-gradient-to-b from-white via-[#FCF8F9]/70 to-white border border-gray-200/70 shadow-[0_10px_35px_rgba(235,25,72,0.035)] backdrop-blur-sm">
                
                {/* Atmospheric Blush / Rose Glows */}
                <div 
                  className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-rose-500/[0.07] blur-3xl pointer-events-none" 
                  aria-hidden="true" 
                />
                <div 
                  className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-rose-500/[0.05] blur-3xl pointer-events-none" 
                  aria-hidden="true" 
                />

                {/* Subtle Dotted Matrix Pattern Inset */}
                <div 
                  className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.045] pointer-events-none" 
                  aria-hidden="true" 
                />

                {/* Layered Geometric Outline Rings (Bottom-Right Accent) */}
                <div 
                  className="absolute -bottom-14 -right-14 w-44 h-44 rounded-full border border-rose-500/[0.08] pointer-events-none" 
                  aria-hidden="true" 
                />
                <div 
                  className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full border border-rose-500/[0.04] pointer-events-none" 
                  aria-hidden="true" 
                />

                {/* Faint Oversized "?" Symbol Watermark */}
                <div 
                  className="absolute -top-6 -right-2 text-[150px] sm:text-[180px] lg:text-[190px] xl:text-[210px] font-black leading-none text-[#eb1948]/[0.045] select-none pointer-events-none -z-0 font-sans tracking-tighter"
                  aria-hidden="true"
                >
                  ?
                </div>

                {/* Content Structure */}
                <div className="relative z-10">
                  {/* Subtle Red Accent Line + Brand Badge */}
                  <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                    <div className="w-7 h-[3px] bg-[var(--color-primary,#eb1948)] rounded-full" />
                    <span className="text-[11px] font-extrabold tracking-widest text-gray-400 uppercase">
                      Help &amp; Answers
                    </span>
                  </div>

                  {/* Main Section Heading */}
                  <h2 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-[#0A0A0A] tracking-tight leading-[1.0] mb-3 sm:mb-4">
                    FAQs
                  </h2>

                  {/* Concise Contextual Lead Line */}
                  <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed max-w-[280px]">
                    Everything you need to know about UGCFY, our tools, and how creator campaigns work.
                  </p>

                  {/* Subtle Interactive / Assistance Micro-Bar at Bottom */}
                  <div className="mt-7 sm:mt-8 pt-5 border-t border-gray-100/90 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary,#eb1948)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary,#eb1948)]"></span>
                      </span>
                      <span className="text-xs font-semibold text-gray-600">
                        Have more questions?
                      </span>
                    </div>

                    <a
                      href="#cta-section"
                      className="text-xs font-bold text-[var(--color-primary,#eb1948)] hover:text-[var(--color-primary-hover)] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Get in touch</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Full FAQ Accordion */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-3 sm:space-y-3.5">
              {faqData.map((faq, index) => {
                const isOpen = openFaq === index;
                const questionId = `faq-question-${index}`;
                const answerId = `faq-answer-${index}`;

                return (
                  <div
                    key={index}
                    className={`transition-all duration-300 ease-out rounded-2xl ${
                      isOpen
                        ? "bg-[#eb1948]/[0.035] border border-[#eb1948]/15 shadow-[0_2px_16px_-4px_rgba(235,25,72,0.06)]"
                        : "bg-white/70 hover:bg-white border border-transparent hover:border-gray-200/80 border-b-gray-100/90"
                    }`}
                  >
                    <button
                      id={questionId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaq(index)}
                      className="w-full py-5 px-5 sm:py-6 sm:px-6 flex items-center justify-between gap-4 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#eb1948)]/40 focus-visible:ring-offset-2 rounded-2xl transition-colors duration-200"
                    >
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        {isOpen && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary,#eb1948)] mt-2.5 flex-shrink-0" />
                        )}
                        <span
                          className={`text-base sm:text-[18px] lg:text-[19px] font-semibold leading-snug transition-colors duration-200 ${
                            isOpen
                              ? "text-[var(--color-primary,#eb1948)]"
                              : "text-[#0A0A0A] group-hover:text-[var(--color-primary,#eb1948)]"
                          }`}
                        >
                          {faq.question}
                        </span>
                      </div>

                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-[var(--color-primary,#eb1948)]/10 text-[var(--color-primary,#eb1948)]"
                            : "bg-gray-100/70 text-gray-500 group-hover:bg-rose-50/80 group-hover:text-[var(--color-primary,#eb1948)]"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4 stroke-[2.2]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[2.2]" />
                        )}
                      </div>
                    </button>

                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 pb-5 px-5 sm:pb-6 sm:px-6"
                          : "grid-rows-[0fr] opacity-0 pb-0 px-5 sm:px-6"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-gray-600 text-[15px] sm:text-base leading-[1.7] max-w-[95%]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 11. CTA BANNER / CREATOR NETWORK FINALE */}
      <section id="cta-section" className="relative py-[54px] sm:py-16 lg:py-[76px] bg-[#070709] overflow-hidden border-t border-white/[0.08] select-none">
        
        {/* Subtle Background Grid Texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
        />

        {/* Sophisticated Layered Ambient Lighting */}
        <div 
          className="absolute top-1/2 left-0 -translate-y-1/2 w-[480px] h-[480px] bg-slate-800/[0.12] rounded-full blur-[140px] pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute top-1/2 right-[-5%] -translate-y-1/2 w-[580px] h-[580px] bg-[var(--color-primary,#eb1948)]/[0.08] rounded-full blur-[150px] pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute bottom-0 right-[20%] w-[380px] h-[380px] bg-purple-600/[0.05] rounded-full blur-[120px] pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-14 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-10 xl:gap-14">

            {/* LEFT COLUMN: Confident Editorial Copy + Premium CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 w-full max-w-xl lg:max-w-[520px] xl:max-w-[560px] text-left z-20"
            >
              {/* Refined Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs sm:text-[13px] font-semibold tracking-wider text-gray-300 uppercase mb-5 sm:mb-6 shadow-2xs backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary,#eb1948)] animate-pulse" />
                <span>Let&apos;s make something cool</span>
              </div>

              {/* Main Heading with Brand Accent on UGCFY */}
              <h2 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold lg:font-black text-white tracking-tight leading-[1.02] mb-8 sm:mb-9">
                Start your success with{" "}
                <span className="text-[var(--color-primary,#eb1948)] inline-block">
                  UGCFY
                </span>{" "}
                right now!
              </h2>

              {/* Premium CTA Button */}
              <div>
                <Link
                  href="/get-started"
                  className="inline-flex items-center justify-center gap-3.5 h-[56px] sm:h-[60px] px-8 sm:px-9 rounded-2xl bg-white hover:bg-rose-50/95 text-gray-950 font-extrabold text-base sm:text-[17px] tracking-wide shadow-xl shadow-black/60 hover:shadow-2xl hover:shadow-rose-500/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-gray-950 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Creator Constellation Network */}
            <div className="w-full lg:w-[52%] xl:w-[54%] relative flex items-center justify-center min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] xl:min-h-[560px]">
              
              {/* Background Concentric Orbital Rings */}
              <div 
                className="absolute w-[360px] sm:w-[460px] lg:w-[500px] h-[360px] sm:h-[460px] lg:h-[500px] rounded-full border border-white/[0.04] pointer-events-none" 
                aria-hidden="true" 
              />
              <div 
                className="absolute w-[260px] sm:w-[340px] lg:w-[380px] h-[260px] sm:h-[340px] lg:h-[380px] rounded-full border border-dashed border-rose-500/[0.1] pointer-events-none" 
                aria-hidden="true" 
              />

              {/* Central Rose Ambient Focal Glow */}
              <div 
                className="absolute w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[var(--color-primary,#eb1948)]/10 blur-[80px] pointer-events-none" 
                aria-hidden="true" 
              />

              {/* CARD 1: HERO Dominant Creator Portrait (Center / Right Focus) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                animate={{ y: [-3, 3, -3] }}
                style={{ transition: "transform 0.5s ease-out" }}
                className="absolute z-20 top-[26%] sm:top-[28%] left-[45%] sm:left-[46%] -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-[185px] lg:w-[205px] xl:w-[220px] -rotate-2 hover:rotate-0 hover:scale-[1.04] transition-all duration-500 cursor-pointer group"
              >
                <div className="relative aspect-[4/5] rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-gray-900 group-hover:border-white/30 transition-colors">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85"
                    alt="UGC Beauty Creator"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 45vw, 25vw"
                    className="object-cover object-top filter contrast-[1.04] saturate-[1.05]"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                  {/* Micro In-Product Badge: 98% Match */}
                  <div 
                    aria-hidden="true"
                    className="absolute bottom-3 left-3 z-30 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-bold text-white shadow-lg"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>98% Match</span>
                  </div>
                </div>
              </motion.div>

              {/* CARD 2: Upper-Left Medium Creator Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                animate={{ y: [3, -3, 3] }}
                className="absolute z-10 top-[2%] sm:top-[4%] left-[2%] sm:left-[6%] lg:left-[8%] w-[125px] sm:w-[155px] lg:w-[170px] xl:w-[185px] rotate-[3.5deg] hover:rotate-0 hover:scale-[1.04] transition-all duration-500 cursor-pointer group"
              >
                <div className="relative aspect-[4/5.2] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.5)] bg-gray-900 group-hover:border-white/25 transition-colors">
                  <Image
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=85"
                    alt="UGC Fashion Creator"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 35vw, 20vw"
                    className="object-cover object-top filter contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* CARD 3: Upper-Right Medium Creator Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                animate={{ y: [-2, 2.5, -2] }}
                className="absolute z-10 top-[0%] sm:top-[2%] right-[1%] sm:right-[4%] lg:right-[6%] w-[130px] sm:w-[160px] lg:w-[175px] xl:w-[190px] -rotate-[4deg] hover:rotate-0 hover:scale-[1.04] transition-all duration-500 cursor-pointer group"
              >
                <div className="relative aspect-[4/5] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.5)] bg-gray-900 group-hover:border-white/25 transition-colors">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85"
                    alt="UGC Skincare Creator"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 35vw, 20vw"
                    className="object-cover object-top filter contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Micro In-Product Badge: Campaign Live */}
                  <div 
                    aria-hidden="true"
                    className="absolute top-2.5 right-2.5 z-30 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[9px] sm:text-[10px] font-bold text-rose-300 shadow-md"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Campaign Live</span>
                  </div>
                </div>
              </motion.div>

              {/* CARD 4: Lower-Left UGC Creator Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                animate={{ y: [2.5, -2.5, 2.5] }}
                className="absolute z-10 bottom-[2%] sm:bottom-[4%] left-[0%] sm:left-[3%] lg:left-[5%] w-[120px] sm:w-[150px] lg:w-[165px] xl:w-[178px] -rotate-[3deg] hover:rotate-0 hover:scale-[1.04] transition-all duration-500 cursor-pointer group"
              >
                <div className="relative aspect-[4/5] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.5)] bg-gray-900 group-hover:border-white/25 transition-colors">
                  <Image
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=85"
                    alt="UGC Lifestyle Creator"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 35vw, 20vw"
                    className="object-cover object-top filter contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Micro In-Product Badge: Creator Selected */}
                  <div 
                    aria-hidden="true"
                    className="absolute bottom-2.5 left-2.5 z-30 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[9px] sm:text-[10px] font-bold text-white shadow-md"
                  >
                    <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                    <span>Selected</span>
                  </div>
                </div>
              </motion.div>

              {/* CARD 5: Lower-Right Creator Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                animate={{ y: [-3, 3, -3] }}
                className="absolute z-10 bottom-[3%] sm:bottom-[5%] right-[3%] sm:right-[7%] lg:right-[8%] w-[125px] sm:w-[155px] lg:w-[170px] xl:w-[185px] rotate-[3deg] hover:rotate-0 hover:scale-[1.04] transition-all duration-500 cursor-pointer group"
              >
                <div className="relative aspect-[4/5] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.5)] bg-gray-900 group-hover:border-white/25 transition-colors">
                  <Image
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=85"
                    alt="UGC Fitness Creator"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 35vw, 20vw"
                    className="object-cover object-top filter contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* CARD 6: Lower-Center Tech/App UGC Accent Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                animate={{ y: [1.5, -2, 1.5] }}
                className="hidden sm:block absolute z-15 bottom-[0%] left-[48%] -translate-x-1/2 w-[90px] sm:w-[110px] lg:w-[125px] -rotate-1 hover:rotate-0 hover:scale-[1.05] transition-all duration-500 cursor-pointer group"
              >
                <div className="relative aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.6)] bg-gray-900 group-hover:border-white/30 transition-colors">
                  <Image
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80"
                    alt="UGC Campaign Apps & Channels"
                    fill
                    unoptimized
                    sizes="15vw"
                    className="object-cover filter contrast-[1.06]"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>


      {/* 12. FOOTER */}
      <Footer />



      {/* Request Access Intercept Modal */}
      <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Login Prompt Modal */}
      <LoginPromptModal isOpen={isLoginPromptOpen} onClose={() => setIsLoginPromptOpen(false)} />

      {/* AI Feature Modal */}
      <AnimatePresence>
        {selectedAiFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedAiFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] w-full max-w-[720px] p-8 sm:p-10 relative shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <button
                type="button"
                aria-label="Close AI service details"
                onClick={() => setSelectedAiFeature(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E11D48]/10 px-3 py-1.5">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#E11D48]">
                  {selectedAiFeature.eyebrow}
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] mb-4 tracking-tight">{selectedAiFeature.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {selectedAiFeature.longDescription}
                </p>
              </div>

              <div className="h-px w-full bg-gray-100 my-2" />

              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">Use Cases</h4>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {selectedAiFeature.useCases.map((uc, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gray-100">
                          <Check className="w-3 h-3 text-gray-500 stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">
                          {uc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">Benefits</h4>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {selectedAiFeature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#E11D48]/10">
                          <Check className="w-3 h-3 text-[#E11D48] stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">Workflow</h4>
                  <div className="flex flex-col gap-4 relative">
                    <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-200" />
                    {selectedAiFeature.workflow.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4 relative z-10">
                        <div className="w-5 h-5 rounded-full bg-white border-2 border-[#E11D48] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-[#E11D48]">{idx + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAiFeature(null)}
                className="mt-2 w-full sm:w-auto sm:self-end bg-[#0A0A0A] hover:bg-black text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
