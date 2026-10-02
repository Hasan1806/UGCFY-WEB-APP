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
    id: "real:masoomminawala",
    full_name: "Masoom Minawala Mehta",
    display_name: "Masoom Minawala",
    niche: ["Fashion", "Luxury", "Lifestyle"],
    avatar_url: "",
    location: "Mumbai, Maharashtra, India",
    instagram_handle: "@masoomminawala",
    instagram_url: "https://www.instagram.com/masoomminawala/",
    rate_card: { video_15s: 60000, video_30s: 120000, photoshoot: 85000 },
    bio: "Global Fashion Influencer & Entrepreneur. Championing Indian design on world stages.",
    availability: "Available"
  },
  {
    id: "real:thepunefoodie",
    full_name: "The Pune Foodie",
    display_name: "The Pune Foodie",
    niche: ["Food", "Lifestyle", "Travel"],
    avatar_url: "",
    location: "Pune, Maharashtra, India",
    instagram_handle: "@thepunefoodie",
    instagram_url: "https://www.instagram.com/thepunefoodie/",
    rate_card: { video_15s: 18000, video_30s: 28000 },
    bio: "Pune's #1 Food, Cafe & Lifestyle guide. Exploring authentic Maharashtrian misal to fine dining.",
    availability: "Available"
  },
  {
    id: "real:tarinipeshawaria",
    full_name: "Tarini Peshawaria",
    display_name: "Tarini Peshawaria",
    niche: ["Beauty", "Skincare", "Lifestyle"],
    avatar_url: "",
    location: "Delhi NCR, India",
    instagram_handle: "@tarinipeshawaria",
    instagram_url: "https://www.instagram.com/tarinipeshawaria/",
    rate_card: { video_15s: 30000, video_30s: 45000 },
    bio: "Skincare nerd & beauty educator. Scientific breakdowns, ingredient guides & honest UGC reviews.",
    availability: "Available"
  },
  {
    id: "real:techburner",
    full_name: "Shlok Srivastava",
    display_name: "Tech Burner",
    niche: ["Tech", "Gadgets", "Lifestyle"],
    avatar_url: "",
    location: "Delhi NCR, India",
    instagram_handle: "@techburner",
    instagram_url: "https://www.instagram.com/techburner/",
    youtube_handle: "@techburner",
    youtube_url: "https://youtube.com/@techburner",
    rate_card: { video_15s: 120000, video_30s: 200000 },
    bio: "Tech entertainer, gadget teardowns, innovative storytelling & smartphone reviews.",
    availability: "Available"
  },
  {
    id: "real:saranshgoila",
    full_name: "Saransh Goila",
    display_name: "Saransh Goila",
    niche: ["Food", "Lifestyle", "Travel"],
    avatar_url: "",
    location: "Mumbai, Maharashtra, India",
    instagram_handle: "@saranshgoila",
    instagram_url: "https://www.instagram.com/saranshgoila/",
    rate_card: { video_15s: 55000, video_30s: 95000 },
    bio: "Chef & Founder @goilabutterchicken. Author & TV host. Quick comfort food hacks.",
    availability: "Available"
  },
  {
    id: "real:curly.tales",
    full_name: "Kamiya Jani",
    display_name: "Curly Tales",
    niche: ["Travel", "Food", "Lifestyle"],
    avatar_url: "",
    location: "Mumbai, Maharashtra, India",
    instagram_handle: "@curly.tales",
    instagram_url: "https://www.instagram.com/curly.tales/",
    rate_card: { video_15s: 120000, video_30s: 220000 },
    bio: "Sunday Brunch with celebrities, travel destinations & mouthwatering food experiences.",
    availability: "Limited"
  },
  {
    id: "real:pranit_shilimkar",
    full_name: "Pranit Shilimkar",
    display_name: "Pranit Shilimkar",
    niche: ["Fitness", "Health & Wellness", "Lifestyle"],
    avatar_url: "",
    location: "Pune, Maharashtra, India",
    instagram_handle: "@pranit_shilimkar",
    instagram_url: "https://www.instagram.com/pranit_shilimkar/",
    rate_card: { video_15s: 18000, video_30s: 30000 },
    bio: "Celebrity Fitness Coach from Pune. 37-day challenge pioneer. Transform your lifestyle.",
    availability: "Available"
  },
  {
    id: "real:beerbiceps",
    full_name: "Ranveer Allahbadia",
    display_name: "BeerBiceps",
    niche: ["Fitness", "Business", "Lifestyle"],
    avatar_url: "",
    location: "Mumbai, Maharashtra, India",
    instagram_handle: "@beerbiceps",
    instagram_url: "https://www.instagram.com/beerbiceps/",
    rate_card: { video_15s: 140000, video_30s: 250000 },
    bio: "Podcaster, Fitness & Entrepreneurship. The Ranveer Show. Monk Entertainment co-founder.",
    availability: "Available"
  },
  {
    id: "real:tanmaybhat",
    full_name: "Tanmay Bhat",
    display_name: "Tanmay Bhat",
    niche: ["Comedy", "Finance", "Gaming"],
    avatar_url: "",
    location: "Mumbai, Maharashtra, India",
    instagram_handle: "@tanmaybhat",
    instagram_url: "https://www.instagram.com/tanmaybhat/",
    rate_card: { video_15s: 130000, video_30s: 230000 },
    bio: "Comedian, YouTuber, Angel Investor. Meme reactions, money talks & humor.",
    availability: "Available"
  }
];

export const MOCK_USER = {
  id: "mock-brand-user-id",
  email: "demo@brand.com",
  user_metadata: {
    name: "Acme Brand",
  },
  created_at: new Date().toISOString(),
};

export const MOCK_BRAND_PROFILE = {
  id: "mock-brand-profile-id",
  user_id: "mock-brand-user-id",
  company_name: "Acme Brands Inc.",
  website: "https://acmebrands.com",
  brand_name: "Acme Brands",
  contact_person: "John Doe",
  email: "demo@brand.com",
  industry: "E-commerce & D2C",
  access_status: "approved",
  status: "approved",
  verification_status: "approved",
  kyc_status: "approved",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_CAMPAIGNS = [
  {
    id: "camp-1",
    title: "Summer Hydration Serum Launch",
    brand_name: "GlowAura D2C",
    niche: "Beauty & Skincare",
    status: "active",
    budget: 150000,
    creators_count: 8,
    deadline: "2026-04-15",
    description: "UGC video campaign featuring morning glow wear tests and hydration routines.",
    fundsState: "funded",
    currency: "INR",
    platforms: ["instagram"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "camp-2",
    title: "Wireless ANC Earbuds Unboxing Blitz",
    brand_name: "SonicSound Audio",
    niche: "Technology & Gadgets",
    status: "in_review",
    budget: 220000,
    creators_count: 12,
    deadline: "2026-04-20",
    description: "Hands-on tech reviews, unboxing ASMR, and sound check reels.",
    fundsState: "funded",
    currency: "INR",
    platforms: ["instagram"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "camp-3",
    title: "Plant Protein Morning Routine",
    brand_name: "NutriPure Health",
    niche: "Fitness & Nutrition",
    status: "draft",
    budget: 80000,
    creators_count: 4,
    deadline: "2026-05-01",
    description: "Short-form reels demonstrating healthy shake prep and workout energy.",
    fundsState: "unfunded",
    currency: "INR",
    platforms: ["instagram"],
    createdAt: new Date().toISOString(),
  }
];
