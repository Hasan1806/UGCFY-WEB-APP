"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "brand" | "creator";

export interface Campaign {
  id: string;
  brand_id: string;
  brand_name: string;
  brand_logo?: string;
  brand_handle?: string;
  title: string;
  slug?: string;
  description: string;
  category: string;
  platforms: string[];
  creatorRequirements: {
    minFollowers?: number;
    maxFollowers?: number;
    niche: string[];
    location?: string;
    creatorsCount: number;
    gender?: string;
    minEngagement?: string;
  };
  deliverables: {
    format: string; // e.g. "Reels", "Stories", "UGC Video", "Dedicated Post"
    quantity: number;
    guidelines: string;
  }[];
  budget: number;
  creatorCompensation: number; // per creator or total
  currency: string;
  applicationDeadline: string;
  startDate?: string;
  endDate?: string;
  status: "draft" | "active" | "paused" | "completed" | "in_review";
  payment_status?: "pending" | "paid" | "not_required";
  createdAt: string;
  updatedAt?: string;
  cover_image?: string;
}

export interface CampaignApplication {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar?: string;
  creatorNiche: string[];
  creatorLocation: string;
  creatorFollowers?: string;
  creatorEngagement?: string;
  pitch: string;
  selectedWork?: string[];
  availability?: string;
  notes?: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  submittedAt: string;
}

export interface Transaction {
  id: string;
  campaignId?: string;
  campaignTitle?: string;
  brandId: string;
  brandName?: string;
  creatorId?: string;
  creatorName?: string;
  type: "campaign_funding" | "creator_payout" | "platform_fee" | "refund";
  amount: number;
  currency: string;
  status: "paid" | "pending" | "processing" | "failed";
  providerReference?: string;
  date: string;
  method?: string;
}

export interface ActivityEvent {
  id: string;
  type:
    | "campaign_created"
    | "application_received"
    | "application_accepted"
    | "application_rejected"
    | "deliverable_submitted"
    | "campaign_completed"
    | "payment_completed";
  title: string;
  description: string;
  timestamp: string;
  role: "brand" | "creator" | "both";
  link?: string;
}

export interface BrandProfileData {
  id: string;
  name: string;
  handle: string;
  logo: string;
  coverImage: string;
  bio: string;
  industry: string;
  website: string;
  location: string;
  joinedDate: string;
  verified: boolean;
  totalSpent: number;
  activeCampaignsCount: number;
  creatorsWorkedWith: number;
  walletBalance?: number;
  socials?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface CreatorProfileData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  joinedDate: string;
  verified: boolean;
  niches: string[];
  followersCount: string;
  avgEngagement: string;
  completedCampaignsCount: number;
  ratePerReel: number;
  walletBalance?: number;
  socials?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export interface ReelItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorNiche: string;
  views?: string;
  likes?: string;
  category: string;
  brandRelevance?: string;
  campaignId?: string;
  compensation?: string;
  deadline?: string;
}

interface DashboardContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  brandProfile: BrandProfileData;
  updateBrandProfile: (data: Partial<BrandProfileData>) => void;
  creatorProfile: CreatorProfileData;
  updateCreatorProfile: (data: Partial<CreatorProfileData>) => void;
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, "id" | "createdAt" | "brand_id" | "brand_name">) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  applications: CampaignApplication[];
  applyToCampaign: (app: Omit<CampaignApplication, "id" | "submittedAt" | "status">) => CampaignApplication;
  updateApplicationStatus: (id: string, status: "accepted" | "rejected" | "withdrawn") => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => Transaction;
  activities: ActivityEvent[];
  addActivity: (activity: Omit<ActivityEvent, "id" | "timestamp">) => void;
  reels: ReelItem[];
}

const INITIAL_BRAND_PROFILE: BrandProfileData = {
  id: "brand-1",
  name: "GlowAura D2C",
  handle: "glowauraskin",
  logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80",
  coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80",
  bio: "Clean, science-backed skincare crafted for radiant, everyday beauty. Collaborating with authentic creators worldwide.",
  industry: "Beauty & Personal Care",
  website: "https://glowaura.example.com",
  location: "Mumbai, India",
  joinedDate: "October 2024",
  verified: true,
  totalSpent: 420000,
  activeCampaignsCount: 3,
  creatorsWorkedWith: 24,
  socials: {
    instagram: "https://instagram.com/glowauraskin",
    twitter: "https://twitter.com/glowauraskin",
    linkedin: "https://linkedin.com/company/glowaura",
  },
};

const INITIAL_CREATOR_PROFILE: CreatorProfileData = {
  id: "creator-1",
  name: "Tarini Peshawaria",
  handle: "tarinipeshawaria",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80",
  bio: "Skincare nerd & beauty educator. Scientific ingredient breakdowns, honest product wear tests, and aesthetic UGC storytelling.",
  location: "Delhi NCR, India",
  website: "https://tarini.me",
  joinedDate: "January 2025",
  verified: true,
  niches: ["Beauty", "Skincare", "Wellness", "Lifestyle"],
  followersCount: "340K",
  avgEngagement: "4.8%",
  completedCampaignsCount: 18,
  ratePerReel: 35000,
  socials: {
    instagram: "https://instagram.com/tarinipeshawaria",
    youtube: "https://youtube.com/@tarinipeshawaria",
  },
};

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    brand_id: "brand-1",
    brand_name: "GlowAura D2C",
    brand_logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80",
    brand_handle: "glowauraskin",
    title: "Summer Hydration Serum Launch 2026",
    slug: "summer-hydration-serum",
    description:
      "Looking for passionate skincare and lifestyle creators to showcase our new 2% Hyaluronic + Ceramide Morning Glow Serum. Highlight effortless morning routine, skin texture before/after, and hydration wear-test.",
    category: "Beauty & Skincare",
    platforms: ["instagram", "youtube"],
    creatorRequirements: {
      minFollowers: 10000,
      maxFollowers: 500000,
      niche: ["Beauty", "Skincare", "Lifestyle"],
      location: "India",
      creatorsCount: 8,
      minEngagement: "3.5%",
    },
    deliverables: [
      {
        format: "Instagram Reel (30-60s)",
        quantity: 1,
        guidelines: "Show morning application, texture close-up, and 8-hour wear test with natural lighting.",
      },
      {
        format: "Instagram Stories (3 frames)",
        quantity: 1,
        guidelines: "Unboxing + swipe-up link to exclusive brand discount code.",
      },
    ],
    budget: 160000,
    creatorCompensation: 20000,
    currency: "INR",
    applicationDeadline: "2026-05-15",
    startDate: "2026-05-01",
    endDate: "2026-05-30",
    status: "active",
    payment_status: "paid",
    createdAt: "2026-04-01T10:00:00Z",
    cover_image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "camp-2",
    brand_id: "brand-1",
    brand_name: "SonicSound Audio",
    brand_logo: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=80",
    brand_handle: "sonicsound",
    title: "Wireless ANC Earbuds Sound Check & ASMR",
    slug: "wireless-anc-earbuds",
    description:
      "Authentic hands-on reviews showcasing noise cancellation in crowded urban areas, gym workouts, and commute. Focus on audio fidelity, microphone quality, and bass test.",
    category: "Tech & Gadgets",
    platforms: ["instagram", "youtube"],
    creatorRequirements: {
      minFollowers: 25000,
      niche: ["Tech", "Gaming", "Lifestyle", "Fitness"],
      location: "India",
      creatorsCount: 6,
      minEngagement: "3.0%",
    },
    deliverables: [
      {
        format: "Dedicated UGC Review Reel",
        quantity: 1,
        guidelines: "Noise cancellation test in transit + voice clarity comparison.",
      },
    ],
    budget: 210000,
    creatorCompensation: 35000,
    currency: "INR",
    applicationDeadline: "2026-05-20",
    startDate: "2026-05-10",
    endDate: "2026-06-10",
    status: "active",
    payment_status: "paid",
    createdAt: "2026-04-05T14:30:00Z",
    cover_image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "camp-3",
    brand_id: "brand-1",
    brand_name: "NutriPure Health",
    brand_logo: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80",
    brand_handle: "nutripure",
    title: "Plant Protein Morning Routine & Energy Boost",
    slug: "plant-protein-morning-routine",
    description:
      "Short-form aesthetic reels demonstrating daily shake prep, digestibility highlights, and clean ingredient breakdown. No artificial sweeteners, 25g plant protein.",
    category: "Fitness & Nutrition",
    platforms: ["instagram"],
    creatorRequirements: {
      minFollowers: 15000,
      niche: ["Fitness", "Health & Wellness", "Food"],
      location: "India",
      creatorsCount: 4,
    },
    deliverables: [
      {
        format: "Instagram Reel (15-30s)",
        quantity: 1,
        guidelines: "Smoothie recipe prep with product integration.",
      },
    ],
    budget: 90000,
    creatorCompensation: 22500,
    currency: "INR",
    applicationDeadline: "2026-06-01",
    startDate: "2026-05-15",
    endDate: "2026-06-15",
    status: "draft",
    payment_status: "pending",
    createdAt: "2026-04-10T09:15:00Z",
    cover_image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80",
  },
];

const INITIAL_APPLICATIONS: CampaignApplication[] = [
  {
    id: "app-1",
    campaignId: "camp-1",
    campaignTitle: "Summer Hydration Serum Launch 2026",
    brandId: "brand-1",
    brandName: "GlowAura D2C",
    creatorId: "creator-1",
    creatorName: "Tarini Peshawaria",
    creatorHandle: "tarinipeshawaria",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    creatorNiche: ["Beauty", "Skincare"],
    creatorLocation: "Delhi NCR",
    creatorFollowers: "340K",
    creatorEngagement: "4.8%",
    pitch:
      "I love science-backed skincare formulations! I'd love to create an aesthetic 4K macro video detailing the ceramide barrier benefit and a genuine 12-hour wear test.",
    selectedWork: ["https://instagram.com/p/example1", "https://instagram.com/p/example2"],
    availability: "Available immediately for May release",
    status: "accepted",
    submittedAt: "2026-04-03T11:20:00Z",
  },
  {
    id: "app-2",
    campaignId: "camp-1",
    campaignTitle: "Summer Hydration Serum Launch 2026",
    brandId: "brand-1",
    brandName: "GlowAura D2C",
    creatorId: "creator-2",
    creatorName: "Masoom Minawala",
    creatorHandle: "masoomminawala",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    creatorNiche: ["Fashion", "Luxury", "Lifestyle"],
    creatorLocation: "Mumbai",
    creatorFollowers: "1.2M",
    creatorEngagement: "3.9%",
    pitch:
      "Integrating the serum into high-glam travel routines and morning fashion prep. High aesthetic production value guaranteed.",
    availability: "Available mid-May",
    status: "pending",
    submittedAt: "2026-04-04T15:45:00Z",
  },
  {
    id: "app-3",
    campaignId: "camp-2",
    campaignTitle: "Wireless ANC Earbuds Sound Check & ASMR",
    brandId: "brand-1",
    brandName: "SonicSound Audio",
    creatorId: "creator-3",
    creatorName: "Tech Burner",
    creatorHandle: "techburner",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    creatorNiche: ["Tech", "Gadgets"],
    creatorLocation: "Delhi NCR",
    creatorFollowers: "4.1M",
    creatorEngagement: "6.2%",
    pitch:
      "High energy unboxing with sound waveform visualization and metro train ANC test.",
    availability: "Next week",
    status: "pending",
    submittedAt: "2026-04-06T08:30:00Z",
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1001",
    campaignId: "camp-1",
    campaignTitle: "Summer Hydration Serum Launch 2026",
    brandId: "brand-1",
    brandName: "GlowAura D2C",
    creatorId: "creator-1",
    creatorName: "Tarini Peshawaria",
    type: "campaign_funding",
    amount: 160000,
    currency: "INR",
    status: "paid",
    providerReference: "pay_RAZORPAY_889123",
    date: "2026-04-01T10:05:00Z",
    method: "UPI / Netbanking",
  },
  {
    id: "tx-1002",
    campaignId: "camp-2",
    campaignTitle: "Wireless ANC Earbuds Sound Check & ASMR",
    brandId: "brand-1",
    brandName: "SonicSound Audio",
    type: "campaign_funding",
    amount: 210000,
    currency: "INR",
    status: "paid",
    providerReference: "pay_RAZORPAY_889441",
    date: "2026-04-05T14:35:00Z",
    method: "Corporate Card",
  },
  {
    id: "tx-1003",
    campaignId: "camp-1",
    campaignTitle: "Summer Hydration Serum Launch 2026",
    brandId: "brand-1",
    brandName: "GlowAura D2C",
    creatorId: "creator-1",
    creatorName: "Tarini Peshawaria",
    type: "creator_payout",
    amount: 20000,
    currency: "INR",
    status: "processing",
    providerReference: "payout_BANK_44210",
    date: "2026-04-08T16:20:00Z",
    method: "Direct Bank Transfer (IMPS)",
  },
];

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-1",
    type: "application_received",
    title: "New application received",
    description: "Tarini Peshawaria applied for 'Summer Hydration Serum Launch 2026'",
    timestamp: "2026-04-03T11:20:00Z",
    role: "brand",
    link: "/dashboard/campaigns/camp-1",
  },
  {
    id: "act-2",
    type: "application_accepted",
    title: "Application accepted",
    description: "GlowAura D2C approved your application for 'Summer Hydration Serum Launch 2026'",
    timestamp: "2026-04-04T09:10:00Z",
    role: "creator",
    link: "/dashboard/campaigns/camp-1",
  },
  {
    id: "act-3",
    type: "campaign_created",
    title: "Campaign created",
    description: "Campaign 'Wireless ANC Earbuds Sound Check' published to discovery feed",
    timestamp: "2026-04-05T14:30:00Z",
    role: "both",
    link: "/dashboard/campaigns/camp-2",
  },
  {
    id: "act-4",
    type: "payment_completed",
    title: "Campaign Escrow Funded",
    description: "₹1,60,000 escrow secured for Summer Hydration campaign",
    timestamp: "2026-04-01T10:05:00Z",
    role: "brand",
    link: "/dashboard/wallet",
  },
];

const INITIAL_REELS: ReelItem[] = [
  {
    id: "reel-1",
    title: "Morning Barrier Glow Routine",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    caption: "The secret to all-day glow is hydration layering with clean ceramides ✨ No filter texture test!",
    creatorId: "creator-1",
    creatorName: "Tarini Peshawaria",
    creatorHandle: "tarinipeshawaria",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    creatorNiche: "Beauty & Skincare",
    views: "245K",
    likes: "32.4K",
    category: "Skincare",
    brandRelevance: "D2C Beauty, Serum launches, Hydration products",
  },
  {
    id: "reel-2",
    title: "Street Sound Test: ANC vs Metro Noise",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    caption: "Can these $99 earbuds block the Mumbai local train screech? Real mic audio check 🎧",
    creatorId: "creator-3",
    creatorName: "Tech Burner",
    creatorHandle: "techburner",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    creatorNiche: "Tech & Audio",
    views: "890K",
    likes: "94.1K",
    category: "Tech",
    brandRelevance: "Earbuds, Microphones, Commute accessories",
  },
  {
    id: "reel-3",
    title: "30-Second Protein Shake Meal Prep",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80",
    caption: "Quickest high-protein breakfast before early morning workout 💪 Smooth, no clumps.",
    creatorId: "creator-4",
    creatorName: "Pranit Shilimkar",
    creatorHandle: "pranit_shilimkar",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    creatorNiche: "Fitness & Nutrition",
    views: "410K",
    likes: "45.2K",
    category: "Fitness",
    brandRelevance: "Plant protein, Superfoods, Gym nutrition",
  },
  {
    id: "reel-4",
    title: "Milan Fashion Week Minimalist Lookbook",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    caption: "Styling sustainable Indian textiles on international runways 🇮🇳 Classic silhouettes.",
    creatorId: "creator-2",
    creatorName: "Masoom Minawala",
    creatorHandle: "masoomminawala",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    creatorNiche: "Fashion & Luxury",
    views: "1.4M",
    likes: "180K",
    category: "Fashion",
    brandRelevance: "Apparel, Handcrafted luxury, Footwear",
  },
];

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({
  children,
  initialRole = "brand",
}: {
  children: React.ReactNode;
  initialRole?: UserRole;
}) {
  const [role, setRoleState] = useState<UserRole>(initialRole);
  const [brandProfile, setBrandProfile] = useState<BrandProfileData>(INITIAL_BRAND_PROFILE);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfileData>(INITIAL_CREATOR_PROFILE);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [applications, setApplications] = useState<CampaignApplication[]>(INITIAL_APPLICATIONS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [reels] = useState<ReelItem[]>(INITIAL_REELS);

  // Sync state from localStorage after client mounts to avoid hydration mismatch
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("ugcfy_user_role");
      if (storedRole === "brand" || storedRole === "creator") setRoleState(storedRole);

      const storedBrand = localStorage.getItem("ugcfy_brand_profile");
      if (storedBrand) setBrandProfile(JSON.parse(storedBrand));

      const storedCreator = localStorage.getItem("ugcfy_creator_profile");
      if (storedCreator) setCreatorProfile(JSON.parse(storedCreator));

      const storedCamps = localStorage.getItem("ugcfy_campaigns");
      if (storedCamps) setCampaigns(JSON.parse(storedCamps));

      const storedApps = localStorage.getItem("ugcfy_applications");
      if (storedApps) setApplications(JSON.parse(storedApps));

      const storedTx = localStorage.getItem("ugcfy_transactions");
      if (storedTx) setTransactions(JSON.parse(storedTx));

      const storedActs = localStorage.getItem("ugcfy_activities");
      if (storedActs) setActivities(JSON.parse(storedActs));
    } catch {
      // ignore JSON parse or storage errors
    }
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("ugcfy_user_role", newRole);
    }
  }, []);

  const updateBrandProfile = useCallback((data: Partial<BrandProfileData>) => {
    setBrandProfile((prev) => {
      const updated = { ...prev, ...data };
      if (typeof window !== "undefined") {
        localStorage.setItem("ugcfy_brand_profile", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const updateCreatorProfile = useCallback((data: Partial<CreatorProfileData>) => {
    setCreatorProfile((prev) => {
      const updated = { ...prev, ...data };
      if (typeof window !== "undefined") {
        localStorage.setItem("ugcfy_creator_profile", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const addCampaign = useCallback(
    (newCampData: Omit<Campaign, "id" | "createdAt" | "brand_id" | "brand_name">) => {
      const id = `camp-${Date.now()}`;
      const newCampaign: Campaign = {
        ...newCampData,
        id,
        brand_id: brandProfile.id,
        brand_name: brandProfile.name,
        brand_logo: brandProfile.logo,
        brand_handle: brandProfile.handle,
        createdAt: new Date().toISOString(),
      };
      setCampaigns((prev) => {
        const updated = [newCampaign, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem("ugcfy_campaigns", JSON.stringify(updated));
        }
        return updated;
      });

      // Add activity
      const activity: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: "campaign_created",
        title: "Campaign created",
        description: `Created campaign "${newCampaign.title}"`,
        timestamp: new Date().toISOString(),
        role: "brand",
        link: `/dashboard/campaigns/${id}`,
      };
      setActivities((prev) => {
        const updated = [activity, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem("ugcfy_activities", JSON.stringify(updated));
        }
        return updated;
      });

      return newCampaign;
    },
    [brandProfile]
  );

  const updateCampaign = useCallback((id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
      if (typeof window !== "undefined") {
        localStorage.setItem("ugcfy_campaigns", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setCampaigns((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("ugcfy_campaigns", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const applyToCampaign = useCallback(
    (appData: Omit<CampaignApplication, "id" | "submittedAt" | "status">) => {
      const id = `app-${Date.now()}`;
      const newApp: CampaignApplication = {
        ...appData,
        id,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      setApplications((prev) => {
        const updated = [newApp, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem("ugcfy_applications", JSON.stringify(updated));
        }
        return updated;
      });

      // Add activity
      const act: ActivityEvent = {
        id: `act-${Date.now()}`,
        type: "application_received",
        title: "Application Submitted",
        description: `${appData.creatorName} applied to "${appData.campaignTitle}"`,
        timestamp: new Date().toISOString(),
        role: "both",
        link: `/dashboard/campaigns/${appData.campaignId}`,
      };
      setActivities((prev) => {
        const updated = [act, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem("ugcfy_activities", JSON.stringify(updated));
        }
        return updated;
      });

      return newApp;
    },
    []
  );

  const updateApplicationStatus = useCallback((id: string, status: "accepted" | "rejected" | "withdrawn") => {
    setApplications((prev) => {
      const updated = prev.map((app) => (app.id === id ? { ...app, status } : app));
      if (typeof window !== "undefined") {
        localStorage.setItem("ugcfy_applications", JSON.stringify(updated));
      }
      return updated;
    });

    // Notify activity
    setApplications((curr) => {
      const target = curr.find((a) => a.id === id);
      if (target) {
        const act: ActivityEvent = {
          id: `act-${Date.now()}`,
          type: status === "accepted" ? "application_accepted" : "application_rejected",
          title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          description: `Application for "${target.campaignTitle}" was marked ${status}.`,
          timestamp: new Date().toISOString(),
          role: "both",
          link: `/dashboard/campaigns/${target.campaignId}`,
        };
        setActivities((prevAct) => {
          const updated = [act, ...prevAct];
          if (typeof window !== "undefined") {
            localStorage.setItem("ugcfy_activities", JSON.stringify(updated));
          }
          return updated;
        });
      }
      return curr;
    });
  }, []);

  const addTransaction = useCallback((txData: Omit<Transaction, "id" | "date">) => {
    const id = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...txData,
      id,
      date: new Date().toISOString(),
    };
    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem("ugcfy_transactions", JSON.stringify(updated));
      }
      return updated;
    });
    return newTx;
  }, []);

  const addActivity = useCallback((actData: Omit<ActivityEvent, "id" | "timestamp">) => {
    const id = `act-${Date.now()}`;
    const newAct: ActivityEvent = {
      ...actData,
      id,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => {
      const updated = [newAct, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem("ugcfy_activities", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        role,
        setRole,
        brandProfile,
        updateBrandProfile,
        creatorProfile,
        updateCreatorProfile,
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        applications,
        applyToCampaign,
        updateApplicationStatus,
        transactions,
        addTransaction,
        activities,
        addActivity,
        reels,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
