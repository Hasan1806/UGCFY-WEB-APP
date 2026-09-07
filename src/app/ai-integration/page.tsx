import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "AI Integration — UGC FY Creator Marketing Intelligence",
};
import Link from 'next/link';
import { Check, Target, Zap, Bot, ShieldCheck, LineChart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const aiServices = [
  {
    id: 'discover-ai',
    title: 'Discover AI',
    icon: Target,
    theme: 'light',
    whatItDoes: 'Discover AI is built to remove guesswork from creator selection. Instead of manually browsing profiles, brands can use AI-assisted signals to identify creators who match campaign goals, audience demographics, niche relevance, content style, and performance potential.',
    useCases: [
      'Finding creators for a new product launch',
      'Shortlisting niche creators for targeted campaigns',
      'Matching creators based on audience and content fit',
      'Reducing manual research time for brand teams',
    ],
    benefits: [
      'Faster creator discovery',
      'Better audience-brand alignment',
      'Reduced manual shortlisting effort',
      'More confident campaign planning',
    ],
    workflow: [
      'Brand defines campaign objective',
      'AI analyzes creator fit and relevance',
      'Best-matched creators are surfaced',
      'Brand reviews and shortlists creators',
    ]
  },
  {
    id: 'scripting-ai',
    title: 'Scripting AI',
    icon: Bot,
    theme: 'dark',
    whatItDoes: 'Scripting AI helps brands convert campaign goals into creator-ready content direction. It assists with script structures, hooks, tone, product mentions, platform-specific formats, and brand-safe messaging so creators can produce content that stays aligned with the brief.',
    useCases: [
      'Creating creator briefs for reels and shorts',
      'Maintaining brand tone across multiple creators',
      'Generating hooks and content angles',
      'Adapting messaging for different platforms',
    ],
    benefits: [
      'Stronger content consistency',
      'Faster brief preparation',
      'Better creator execution',
      'Reduced revision cycles',
    ],
    workflow: [
      'Brand enters campaign objective and key message',
      'AI suggests content angles and script structure',
      'Brand reviews and finalizes guidelines',
      'Creators receive clearer execution direction',
    ]
  },
  {
    id: 'negotiation-ai',
    title: 'Negotiation AI',
    icon: Zap,
    theme: 'light',
    whatItDoes: 'Negotiation AI supports smarter creator collaboration decisions by comparing expected creator value with campaign budget, historical performance, deliverable scope, audience quality, and estimated campaign impact.',
    useCases: [
      'Evaluating creator pricing before approval',
      'Comparing creators for the same campaign',
      'Planning budget allocation across creators',
      'Supporting fair and transparent negotiations',
    ],
    benefits: [
      'More informed negotiation decisions',
      'Better budget control',
      'Reduced overpaying risk',
      'Improved creator collaboration quality',
    ],
    workflow: [
      'Brand reviews creator proposal',
      'AI evaluates pricing and performance signals',
      'Brand receives decision support',
      'Final collaboration terms are confirmed',
    ]
  },
  {
    id: 'content-audit-ai',
    title: 'Content Audit AI',
    icon: ShieldCheck,
    theme: 'dark',
    whatItDoes: 'Content Audit AI helps brands review creator submissions before approval. It checks whether the content follows the campaign brief, includes required talking points, avoids restricted claims, and aligns with the approved script and brand guidelines.',
    useCases: [
      'Checking creator submissions before posting',
      'Reviewing script and guideline compliance',
      'Reducing manual content approval workload',
      'Maintaining brand safety across campaigns',
    ],
    benefits: [
      'Faster content review',
      'Better brand guideline compliance',
      'Reduced approval errors',
      'Stronger content quality control',
    ],
    workflow: [
      'Creator submits content',
      'AI checks content against the brief',
      'Brand receives audit signals',
      'Brand approves, rejects, or requests changes',
    ]
  },
  {
    id: 'performance-ai',
    title: 'Performance AI',
    icon: LineChart,
    theme: 'light',
    whatItDoes: 'Performance AI helps brands monitor and improve campaign outcomes by analyzing performance signals, engagement quality, creator contribution, deliverable progress, and optimization opportunities across active and completed campaigns.',
    useCases: [
      'Tracking live campaign performance',
      'Comparing creator output quality',
      'Identifying campaign optimization opportunities',
      'Planning future campaigns using past performance',
    ],
    benefits: [
      'Clearer campaign visibility',
      'Better optimization decisions',
      'Improved creator partnership planning',
      'More data-backed reporting',
    ],
    workflow: [
      'Campaign performance data is collected',
      'AI identifies trends and weak points',
      'Brand receives optimization insights',
      'Future campaigns improve based on learnings',
    ]
  }
];

export default function AiIntegrationPage() {
  return (
    <div className="min-h-screen bg-[#FDFBFB] flex flex-col font-sans text-[#0A0A0A]">
      <Navbar theme="transparent-to-dark" />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative px-6 pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#000000]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#E11D48]/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] rounded-full bg-white/5 blur-[100px] pointer-events-none" />

          <div className="max-w-[1024px] mx-auto text-center relative z-10">

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md mb-6 mx-auto">
              
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D90429]">
                Intelligent Marketing
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-extrabold tracking-tight leading-[1.05] text-white mb-8 drop-shadow-2xl">
              AI Integration By UGCFY
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10 font-medium drop-shadow-md">
              UGCFY integrates AI to bring precision to your influencer marketing campaigns by delivering data-backed strategies, superior targeting, and real-time adjustments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-started" className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-[#E11D48]/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                Start with UGCFY
              </Link>
            </div>
          </div>
        </section>

        {/* OVERVIEW SECTION */}
        <section className="px-6 py-16 bg-white border-y border-gray-100">
          <div className="max-w-[1024px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">How AI Supports Influencer Marketing</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              In an increasingly crowded digital landscape, finding the right creators and ensuring high-quality content can be challenging. Our bespoke AI integrations work cohesively across the entire lifecycle of a campaign—from discovering the perfect influencer to auditing scripts, negotiating terms, and tracking real-time performance—empowering brands to make confident, data-driven decisions.
            </p>
          </div>
        </section>

        {/* AI SERVICES DETAIL SECTIONS */}
        <div className="max-w-[1240px] mx-auto px-6 py-20 flex flex-col gap-24">
          {aiServices.map((service) => {
            const Icon = service.icon;
            const isDark = service.theme === 'dark';

            return (
              <section
                key={service.id}
                id={service.id}
                className={`rounded-[40px] p-8 md:p-12 lg:p-16 border transition-all ${isDark
                  ? 'bg-[#0A0A0A] text-white border-white/10 shadow-2xl shadow-black/20'
                  : 'bg-white text-[#0A0A0A] border-gray-200 shadow-xl shadow-black/5'
                  }`}
              >
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                  {/* Left Column: Title & What it does */}
                  <div className="flex flex-col gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-[#E11D48]/10 text-[#E11D48]'}`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                      {service.title}
                    </h2>

                    <div className="mt-2">
                      <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        What it does
                      </h3>
                      <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {service.whatItDoes}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Use Cases, Benefits, Workflow */}
                  <div className="flex flex-col gap-10">
                    <div>
                      <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Where brands use it
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-4">
                        {service.useCases.map((uc, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className={`mt-1 shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                              <Check className={`w-3 h-3 stroke-[3] ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
                            </div>
                            <span className={`text-sm font-medium leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                              {uc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Key Benefits
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-4">
                        {service.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className={`mt-1 shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${isDark ? 'bg-[#E11D48]' : 'bg-[#E11D48]/10'}`}>
                              <Check className={`w-3 h-3 stroke-[3] ${isDark ? 'text-white' : 'text-[#E11D48]'}`} />
                            </div>
                            <span className={`text-sm font-medium leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Workflow
                      </h3>
                      <div className="flex flex-col gap-5 relative">
                        <div className={`absolute left-[11px] top-3 bottom-3 w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                        {service.workflow.map((step, i) => (
                          <div key={i} className="flex items-start gap-4 relative z-10">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 ${isDark ? 'bg-[#0A0A0A] border-[#E11D48] text-[#E11D48]' : 'bg-white border-[#E11D48] text-[#E11D48]'
                              }`}>
                              <span className="text-[11px] font-bold">{i + 1}</span>
                            </div>
                            <span className={`text-sm font-medium leading-relaxed pt-0.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* FINAL CTA */}
        <section className="px-6 py-20 lg:py-32 bg-[#0A0A0A] text-center">
          <div className="max-w-[800px] mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Ready to elevate your campaigns?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl">
              Join the brands leveraging AI to build smarter, faster, and more effective influencer marketing strategies.
            </p>
            <Link href="/get-started" className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-lg px-10 py-5 rounded-2xl shadow-xl shadow-[#E11D48]/20 transition-all hover:-translate-y-1 active:translate-y-0">
              Start with UGCFY
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
