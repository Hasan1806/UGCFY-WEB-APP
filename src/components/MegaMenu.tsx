import React from "react";
import { 
  Search, MessageCircle, LayoutDashboard, CreditCard, PieChart, 
  Bot, Zap, LineChart, Users, Smartphone, Globe, Video, 
  PenTool, Star, Play, MapPin, Info, Phone, Briefcase, HelpCircle, FileText
} from "lucide-react";
import Link from "next/link";

// --------------------------------------------------------
// TYPES
// --------------------------------------------------------

export interface MegaMenuCardData {
  title: string;
  description: string;
  icon: React.ElementType;
  visualWindow: React.ReactNode;
  href?: string;
}

export interface MegaMenuFooterItem {
  label: string;
  icon: React.ElementType;
  href?: string;
}

export interface MegaMenuData {
  cards: MegaMenuCardData[];
  footerItems?: MegaMenuFooterItem[];
  columns?: number; // default is 5
}

// --------------------------------------------------------
// COMPONENTS
// --------------------------------------------------------

export function MegaMenuCard({ data }: { data: MegaMenuCardData }) {
  const Icon = data.icon;
  return (
    <Link href={data.href || "#"} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-[var(--color-primary)] cursor-pointer">
      <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/15 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-[var(--color-primary)]" />
      </div>
      <div>
        <h4 className="text-white font-bold text-[15px] mb-1">{data.title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{data.description}</p>
      </div>
    </Link>
  );
}

export function MegaMenuPanel({ data }: { data: MegaMenuData }) {
  const gridCols = data.columns || 5;
  const gridClass = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  }[gridCols] || "grid-cols-5";

  return (
    <div className="fixed top-[72px] left-0 w-full bg-[#0A0A0A]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top z-40">
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:${gridClass} gap-8`}>
          {data.cards.map((card, i) => (
            <MegaMenuCard key={i} data={card} />
          ))}
        </div>

        {data.footerItems && data.footerItems.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-8 gap-y-4">
             <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Add-ons</span>
             {data.footerItems.map((item, i) => (
               <Link key={i} href={item.href || "#"} className="text-sm font-medium text-gray-300 hover:text-[var(--color-primary)]/80 flex items-center gap-2 transition-colors">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[var(--shadow-cta)]"></div>
                 {item.label}
               </Link>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------
// DATA EXPORTS
// --------------------------------------------------------

export const PLATFORM_DATA: MegaMenuData = {
  columns: 5,
  cards: [
    {
      title: "Discover",
      description: "Discover influential partners aligned with your brand effortlessly.",
      icon: Search,
      href: "/platform/discover",
      visualWindow: (
        <>
          <div className="h-6 w-full bg-white/[0.05] rounded border border-white/10 flex items-center px-2 mb-3">
            <Search className="w-3 h-3 text-white/50 mr-2" />
            <div className="h-2 w-16 bg-white/20 rounded"></div>
          </div>
          <div className="flex gap-2 items-center mb-3">
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary-hover)] shrink-0"></div>
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-16 bg-white/80 rounded"></div>
              <div className="h-1.5 w-10 bg-white/40 rounded"></div>
            </div>
          </div>
          <div className="flex gap-2 items-center opacity-60">
            <div className="w-6 h-6 rounded-full bg-white/20 shrink-0"></div>
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-20 bg-white/60 rounded"></div>
              <div className="h-1.5 w-14 bg-white/30 rounded"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </>
      )
    },
    {
      title: "Outreach",
      description: "Effortlessly enqueue and empower influencers to amplify your brand.",
      icon: MessageCircle,
      href: "/platform/outreach",
      visualWindow: (
        <>
          <div className="flex items-end gap-2 w-full mb-2">
            <div className="w-5 h-5 rounded-full bg-white/20 shrink-0"></div>
            <div className="bg-white/[0.05] p-2 rounded-xl rounded-bl-none border border-white/10 w-[75%] space-y-1">
              <div className="h-1.5 w-full bg-white/60 rounded"></div>
              <div className="h-1.5 w-2/3 bg-white/60 rounded"></div>
            </div>
          </div>
          <div className="flex items-end gap-2 w-full justify-end">
            <div className="bg-[var(--color-primary-hover)] p-2 rounded-xl rounded-br-none border border-[var(--color-primary)] w-[70%] space-y-1 shadow-[var(--shadow-cta)]">
              <div className="h-1.5 w-full bg-white rounded"></div>
              <div className="h-1.5 w-1/2 bg-white/80 rounded"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </>
      )
    },
    {
      title: "Manage",
      description: "Cultivate and optimize influencer relationships for maximum impact.",
      icon: LayoutDashboard,
      href: "/platform/manage",
      visualWindow: (
        <div className="flex flex-col h-full justify-end w-full relative">
          <div className="flex justify-between items-end h-14 w-full gap-1.5 mb-2">
            {[30, 50, 40, 80, 60].map((h, i) => (
              <div key={i} className={`w-full rounded-t-sm transition-all duration-500 ${i === 3 ? 'bg-[var(--color-primary-hover)] shadow-[var(--shadow-cta)] group-hover/card:h-[90%]' : 'bg-white/20'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="h-px w-full bg-white/10 mb-2"></div>
          <div className="flex justify-between w-full">
            <div className="h-1.5 w-8 bg-white/30 rounded"></div>
            <div className="h-1.5 w-12 bg-white/60 rounded"></div>
          </div>
        </div>
      )
    },
    {
      title: "Payments",
      description: "Secure escrow payouts ensuring zero-risk collaboration.",
      icon: CreditCard,
      href: "/platform/payments",
      visualWindow: (
        <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-between items-center border border-white/5 bg-white/[0.02] p-2 rounded-lg">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded bg-white/10"></div>
              <div className="h-1.5 w-12 bg-white/70 rounded"></div>
            </div>
            <div className="h-3 w-8 bg-emerald-500/20 border border-emerald-500/30 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-2 rounded-lg shadow-[var(--shadow-cta)]">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded bg-white/10"></div>
              <div className="h-1.5 w-16 bg-white/70 rounded"></div>
            </div>
            <div className="h-3 w-8 bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 rounded-full"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </div>
      )
    },
    {
      title: "Reporting",
      description: "Advanced analytics to streamline and optimize your campaigns.",
      icon: PieChart,
      href: "/platform/reporting",
      visualWindow: (
        <div className="flex items-center justify-center w-full h-full">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="45" className="text-[var(--color-primary-hover)] drop-shadow-[var(--shadow-cta)] group-hover/card:strokeDashoffset-[30] transition-all duration-700 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">74%</span>
            </div>
          </div>
        </div>
      )
    }
  ],
  footerItems: [
    { label: "AI Integration", icon: Bot },
    { label: "Affiliate Marketing", icon: Zap },
    { label: "WhatsApp Integration", icon: MessageCircle },
    { label: "Competitor Analysis", icon: LineChart },
    { label: "Similar Influencer", icon: Users },
    { label: "IG story amplification", icon: Smartphone },
  ]
};

export const ECOSYSTEM_DATA: MegaMenuData = {
  columns: 3,
  cards: [
    {
      title: "Creators",
      description: "Join UGCFY as a creator, build your portfolio, discover brand campaigns, and apply for paid UGC collaborations directly from the app.",
      icon: Video,
      href: "/ecosystem/creators",
      visualWindow: (
        <div className="w-full flex items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
             <Video className="w-5 h-5 text-white" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-hover)] border border-[var(--color-primary)] shadow-[var(--shadow-cta)] flex items-center justify-center relative group-hover/card:scale-110 transition-transform">
             <Users className="w-5 h-5 text-white" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tl from-white/20 to-transparent"></div>
             <Star className="w-5 h-5 text-white" />
          </div>
        </div>
      )
    },
    {
      title: "Brands",
      description: "Launch campaigns, find vetted creators, manage collaborations, and scale UGC content production with a structured brand workflow.",
      icon: Globe,
      href: "/ecosystem/brands",
      visualWindow: (
        <div className="w-full h-full flex flex-col gap-2">
           <div className="w-full h-6 bg-white/[0.05] rounded border border-white/10 flex items-center px-2 gap-2">
             <div className="w-3 h-3 rounded-sm bg-[var(--color-primary-hover)]"></div>
             <div className="h-1.5 w-1/3 bg-white/40 rounded"></div>
           </div>
           <div className="w-full h-6 bg-white/[0.05] rounded border border-white/10 flex items-center px-2 gap-2">
             <div className="w-3 h-3 rounded-sm bg-white/20"></div>
             <div className="h-1.5 w-1/2 bg-white/40 rounded"></div>
           </div>
           <div className="w-full h-6 bg-white/[0.05] rounded border border-white/10 flex items-center px-2 gap-2">
             <div className="w-3 h-3 rounded-sm bg-white/20"></div>
             <div className="h-1.5 w-1/4 bg-white/40 rounded"></div>
           </div>
        </div>
      )
    },
    {
      title: "Download the App",
      description: "Get the UGCFY mobile app to complete onboarding, manage your profile, access campaigns, and use creator or brand tools on the go.",
      icon: Smartphone,
      href: "/ecosystem/download-app",
      visualWindow: (
        <div className="w-full h-full flex items-center justify-center gap-3 relative">
           <div className="w-12 h-20 bg-white/10 rounded-lg border border-white/20 p-1 flex flex-col gap-1 relative group-hover/card:scale-105 transition-transform duration-300">
             <div className="w-full h-2 bg-[var(--color-primary-hover)] rounded-sm"></div>
             <div className="w-full h-1 bg-white/30 rounded-sm"></div>
             <div className="w-full h-1 bg-white/30 rounded-sm"></div>
             <div className="w-full h-1 bg-white/30 rounded-sm"></div>
             <div className="absolute bottom-1 left-1 right-1 h-3 bg-white/20 rounded-sm flex items-center justify-center">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-hover)]"></div>
             </div>
           </div>
           <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-primary-hover)] flex items-center justify-center shadow-[var(--shadow-cta)]">
             <Smartphone className="w-3 h-3 text-white" />
           </div>
        </div>
      )
    }
  ]
};

export const RESOURCES_DATA: MegaMenuData = {
  columns: 4,
  cards: [
    {
      title: "Blogs",
      description: "Latest strategies and UGC marketing trends.",
      icon: FileText,
      href: "/resources/blogs",
      visualWindow: (
        <div className="w-full flex gap-2">
          <div className="w-1/3 h-16 bg-white/10 rounded overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          <div className="flex-1 space-y-2 py-1">
            <div className="w-full h-2 bg-white/80 rounded"></div>
            <div className="w-2/3 h-2 bg-white/80 rounded"></div>
            <div className="w-1/2 h-1.5 bg-[var(--color-primary)]/60 rounded mt-2"></div>
          </div>
        </div>
      )
    },
    {
      title: "Case Studies",
      description: "See how top brands scaled their ROI effortlessly.",
      icon: LineChart,
      href: "/resources/case-studies",
      visualWindow: (
        <div className="w-full flex flex-col gap-2">
           <div className="w-full h-8 bg-[var(--color-primary-hover)]/20 border border-[var(--color-primary)]/30 rounded flex items-center px-3 justify-between">
             <div className="h-1.5 w-12 bg-[var(--color-primary)] rounded"></div>
             <div className="text-[10px] font-bold text-[var(--color-primary)]">ROI +300%</div>
           </div>
           <div className="w-full h-8 bg-white/5 border border-white/10 rounded flex items-center px-3 justify-between">
             <div className="h-1.5 w-16 bg-white/40 rounded"></div>
             <div className="text-[10px] font-bold text-white/50">CPA -45%</div>
           </div>
        </div>
      )
    },
    {
      title: "Top Influencers",
      description: "Browse our vetted list of top performers and creators.",
      icon: Star,
      href: "/resources/top-influencers",
      visualWindow: (
        <div className="flex items-center gap-[-10px] w-full justify-center group-hover/card:gap-2 transition-all duration-300">
           <div className="w-10 h-10 rounded-full border-2 border-black bg-white/20 z-10"></div>
           <div className="w-12 h-12 rounded-full border-2 border-black bg-[var(--color-primary-hover)] shadow-[var(--shadow-cta)] z-20 -ml-3"></div>
           <div className="w-10 h-10 rounded-full border-2 border-black bg-white/10 z-10 -ml-3"></div>
        </div>
      )
    },
    {
      title: "Free Tools",
      description: "Calculators, templates, and campaign guides.",
      icon: Zap,
      href: "/resources/free-tools",
      visualWindow: (
        <div className="w-full flex flex-wrap gap-2 justify-center">
           <div className="w-[45%] h-8 bg-white/10 rounded border border-white/20 flex items-center justify-center">
             <div className="w-4 h-1.5 bg-white/40 rounded"></div>
           </div>
           <div className="w-[45%] h-8 bg-[var(--color-primary-hover)]/20 rounded border border-[var(--color-primary)]/50 flex items-center justify-center group-hover/card:bg-[var(--color-primary-hover)] transition-colors">
             <div className="w-6 h-1.5 bg-[var(--color-primary)] group-hover/card:bg-white rounded transition-colors"></div>
           </div>
           <div className="w-[95%] h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center">
             <div className="w-12 h-1.5 bg-white/30 rounded"></div>
           </div>
        </div>
      )
    }
  ]
};

export const SERVICES_DATA: MegaMenuData = {
  columns: 4,
  cards: [
    {
      title: "Influencer Marketing",
      description: "End-to-end management of large scale influencer campaigns.",
      icon: Users,
      href: "/services/influencer-marketing",
      visualWindow: (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2">
           <div className="flex gap-2">
             <div className="w-6 h-6 rounded-full bg-white/20"></div>
             <div className="w-6 h-6 rounded-full bg-[var(--color-primary-hover)] shadow-[var(--shadow-cta)] group-hover/card:-translate-y-1 transition-transform"></div>
             <div className="w-6 h-6 rounded-full bg-white/20"></div>
           </div>
           <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
        </div>
      )
    },
    {
      title: "Content Strategy",
      description: "Data-driven content pillars and scripting designed to convert.",
      icon: PenTool,
      href: "/services/content-strategy",
      visualWindow: (
        <div className="w-full h-full relative border border-white/10 rounded bg-white/[0.02] p-2 flex flex-col gap-1.5">
           <div className="w-full h-2 bg-[var(--color-primary)]/80 rounded"></div>
           <div className="w-[80%] h-2 bg-white/40 rounded"></div>
           <div className="w-[90%] h-2 bg-white/40 rounded"></div>
           <div className="w-[60%] h-2 bg-white/20 rounded"></div>
        </div>
      )
    },
    {
      title: "Video Production",
      description: "Professional post-production, editing, and hook variations.",
      icon: Video,
      href: "/services/video-production",
      visualWindow: (
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="w-16 h-10 border-2 border-white/20 rounded flex items-center justify-center bg-black/50 group-hover/card:border-[var(--color-primary)]/50 transition-colors">
             <Play className="w-4 h-4 text-[var(--color-primary-hover)] ml-1" fill="currentColor" />
          </div>
        </div>
      )
    },
    {
      title: "On-site Events",
      description: "Creator events, experiential activations, and media coverage.",
      icon: MapPin,
      href: "/services/events",
      visualWindow: (
        <div className="w-full h-full flex items-center justify-center relative">
           <div className="w-12 h-12 rounded-full border border-[var(--color-primary)]/30 flex items-center justify-center bg-[var(--color-primary)]/10">
             <MapPin className="w-5 h-5 text-[var(--color-primary-hover)] group-hover/card:-translate-y-1 transition-transform" />
           </div>
           <div className="absolute bottom-1 w-8 h-1 bg-black rounded-[50%] blur-[2px] opacity-50"></div>
        </div>
      )
    }
  ]
};

export const COMPANY_DATA: MegaMenuData = {
  columns: 4,
  cards: [
    {
      title: "About Us",
      description: "Learn about our mission, vision, and the team behind UGCFY.",
      icon: Info,
      href: "/about",
      visualWindow: (
        <div className="w-full h-full flex items-center justify-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-hover)] flex items-center justify-center shadow-[var(--shadow-cta)]">
             <div className="text-white font-bold text-xs tracking-tighter">u</div>
           </div>
           <div className="flex flex-col gap-1">
             <div className="w-12 h-2 bg-white/80 rounded"></div>
             <div className="w-8 h-1.5 bg-white/40 rounded"></div>
           </div>
        </div>
      )
    },
    {
      title: "Contact Us",
      description: "Get in touch with our sales and support teams globally.",
      icon: Phone,
      href: "/contact",
      visualWindow: (
        <div className="w-full h-full flex flex-col justify-center gap-2">
           <div className="flex items-center gap-2 border border-white/10 rounded p-1.5 bg-white/[0.05]">
             <MessageCircle className="w-3 h-3 text-[var(--color-primary)]" />
             <div className="h-1.5 w-16 bg-white/50 rounded"></div>
           </div>
           <div className="flex items-center gap-2 border border-white/10 rounded p-1.5 bg-white/[0.05]">
             <Globe className="w-3 h-3 text-white/50" />
             <div className="h-1.5 w-12 bg-white/30 rounded"></div>
           </div>
        </div>
      )
    },
    {
      title: "Careers",
      description: "Join the fastest growing creator economy platform.",
      icon: Briefcase,
      href: "/company/careers",
      visualWindow: (
        <div className="w-full h-full flex items-end justify-center gap-1.5">
           <div className="w-3 h-6 bg-white/20 rounded-t"></div>
           <div className="w-3 h-8 bg-white/20 rounded-t"></div>
           <div className="w-3 h-10 bg-[var(--color-primary-hover)] rounded-t shadow-[var(--shadow-cta)] group-hover/card:h-12 transition-all"></div>
           <div className="w-3 h-4 bg-white/20 rounded-t"></div>
        </div>
      )
    },
    {
      title: "FAQ",
      description: "Answers to the most common questions about UGCFY.",
      icon: HelpCircle,
      href: "/company/faq",
      visualWindow: (
        <div className="w-full h-full flex flex-col justify-center gap-2 p-2">
           <div className="w-full border-b border-white/10 pb-1 flex justify-between items-center group-hover/card:border-[var(--color-primary)]/30 transition-colors">
             <div className="w-1/2 h-1.5 bg-white/60 rounded"></div>
             <div className="w-2 h-2 rounded-full border border-white/30"></div>
           </div>
           <div className="w-full border-b border-white/10 pb-1 flex justify-between items-center group-hover/card:border-[var(--color-primary)]/30 transition-colors">
             <div className="w-2/3 h-1.5 bg-white/60 rounded"></div>
             <div className="w-2 h-2 rounded-full border border-white/30"></div>
           </div>
           <div className="w-full flex justify-between items-center">
             <div className="w-1/3 h-1.5 bg-[var(--color-primary)]/80 rounded"></div>
             <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/50"></div>
           </div>
        </div>
      )
    }
  ]
};
