export interface MockCreator {
  id: string;
  full_name: string;
  display_name: string;
  niche: string[];
  avatar_url: string;
  location: string;
  instagram_handle?: string;
  instagram_url?: string;
  youtube_handle?: string;
  youtube_url?: string;
  rate_card?: Record<string, number>;
  bio?: string;
  availability?: string;
}

export const MOCK_CREATORS: MockCreator[] = [
  {
    id: "creator-1",
    full_name: "Aanya Sharma",
    display_name: "Aanya Sharma",
    niche: ["Fashion", "Lifestyle"],
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    location: "Mumbai, India",
    instagram_handle: "@aanya.creates",
    instagram_url: "https://instagram.com/aanya.creates",
    rate_card: { video_15s: 12000, video_30s: 18000, photoshoot: 10000 },
    bio: "Fashion and modern lifestyle creator crafting high-converting aesthetic short-form videos.",
    availability: "Available"
  },
  {
    id: "creator-2",
    full_name: "Rohan Mehta",
    display_name: "Rohan Mehta",
    niche: ["Fitness", "Health"],
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    location: "Bangalore, India",
    instagram_handle: "@rohan.fits",
    instagram_url: "https://instagram.com/rohan.fits",
    youtube_handle: "@rohanfitness",
    rate_card: { video_15s: 15000, video_30s: 22000 },
    bio: "Certified fitness trainer creating punchy workout & supplement review reels.",
    availability: "Available"
  },
  {
    id: "creator-3",
    full_name: "Priya Nair",
    display_name: "Priya Nair",
    niche: ["Beauty", "Skincare"],
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    location: "Delhi NCR, India",
    instagram_handle: "@priyanair",
    instagram_url: "https://instagram.com/priyanair",
    rate_card: { video_15s: 14000, video_30s: 20000 },
    bio: "Skincare enthusiast & UGC creator helping D2C brands stand out with authentic reviews.",
    availability: "Available"
  },
  {
    id: "creator-4",
    full_name: "Vikram Sengupta",
    display_name: "Vikram Tech",
    niche: ["Tech", "Gadgets"],
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    location: "Hyderabad, India",
    youtube_handle: "@vikramtech",
    youtube_url: "https://youtube.com/@vikramtech",
    rate_card: { video_15s: 18000, video_30s: 25000 },
    bio: "Tech unboxer, consumer electronics reviewer & viral gadget hook specialist.",
    availability: "Available"
  },
  {
    id: "creator-5",
    full_name: "Kavya Patel",
    display_name: "Kavya Cooks",
    niche: ["Food", "Lifestyle"],
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    location: "Ahmedabad, India",
    instagram_handle: "@kavyacooks",
    instagram_url: "https://instagram.com/kavyacooks",
    rate_card: { video_15s: 10000, video_30s: 15000 },
    bio: "Culinary creator focusing on quick recipes, kitchen product demos & food hacks.",
    availability: "Available"
  },
  {
    id: "creator-6",
    full_name: "Arjun Verma",
    display_name: "Arjun Visuals",
    niche: ["Travel", "Adventure"],
    avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
    location: "Goa, India",
    instagram_handle: "@arjun.visuals",
    instagram_url: "https://instagram.com/arjun.visuals",
    rate_card: { video_15s: 20000, video_30s: 30000 },
    bio: "Cinematic UGC & storytelling for hospitality, travel accessories, and lifestyle brands.",
    availability: "Limited"
  }
];

export const MOCK_CAMPAIGNS = [
  {
    id: "camp-1",
    title: "Summer Glow Skincare Launch",
    description: "Authentic before/after review videos highlighting organic hydration serum.",
    status: "active",
    budget: 45000,
    currency: "INR",
    platforms: ["Instagram"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    fundsState: "Funded"
  },
  {
    id: "camp-2",
    title: "Eco-Friendly Apparel Showcase",
    description: "Try-on hauls and aesthetic styling tips featuring summer capsule collection.",
    status: "in_progress",
    budget: 35000,
    currency: "INR",
    platforms: ["Instagram", "YouTube"],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    fundsState: "Funded"
  },
  {
    id: "camp-3",
    title: "Wireless ANC Earbuds Unboxing",
    description: "Crisp macro unboxing, sound isolation test, and daily gym usage showcase.",
    status: "draft",
    budget: 25000,
    currency: "INR",
    platforms: ["YouTube"],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    fundsState: null
  }
];

export const MOCK_BRAND_PROFILE = {
  id: "mock-brand-1",
  user_id: "mock-user-1",
  email: "partner@brand.com",
  contact_email: "partner@brand.com",
  company_name: "Acme Consumer Brands",
  brand_name: "Acme Lifestyle",
  website: "https://acmebrands.com",
  website_url: "https://acmebrands.com",
  industry: "D2C Beauty & Fashion",
  phone: "+91 98765 43210",
  location: "Mumbai, India",
  business_description: "Premium digital-first consumer goods brand creating delightful everyday lifestyle essentials.",
  kyc_status: "approved",
  access_status: "approved",
  subscription_status: "pro",
  onboarding_completed: true,
  profile_completed: true
};

export const MOCK_USER = {
  id: "mock-user-1",
  email: "partner@brand.com",
  user_metadata: {
    name: "Acme Partner",
    company_name: "Acme Consumer Brands"
  }
};
