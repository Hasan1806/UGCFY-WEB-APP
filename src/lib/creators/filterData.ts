export interface StateCityMap {
  [state: string]: string[];
}

export const INDIAN_STATES_CITIES: StateCityMap = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
  "Delhi": ["Delhi", "New Delhi", "South Delhi", "North Delhi"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  "Uttar Pradesh": ["Noida", "Lucknow", "Kanpur", "Varanasi", "Agra", "Ghaziabad"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
};

export const POPULAR_INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Indore",
  "Bhopal",
  "Jabalpur",
  "Noida",
  "Gurugram",
  "Chandigarh"
];

export const NICHES_LIST = [
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Fitness",
  "Food",
  "Travel",
  "Gaming",
  "Technology",
  "Finance",
  "Education",
  "Entertainment",
  "Comedy",
  "Parenting",
  "Automotive",
  "Sports",
  "Business",
  "Health & Wellness",
  "Home & Decor",
  "Photography",
  "Music",
] as const;

export const ENGAGEMENT_RATE_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "1%+", value: 1 },
  { label: "2%+", value: 2 },
  { label: "3%+", value: 3 },
  { label: "5%+", value: 5 },
  { label: "10%+", value: 10 },
];

export const FOLLOWER_TIERS = [
  { label: "Nano (10K–50K)", min: 10000, max: 50000 },
  { label: "Micro (50K–200K)", min: 50000, max: 200000 },
  { label: "Mid-Tier (200K–500K)", min: 200000, max: 500000 },
  { label: "Macro (500K–1M)", min: 500000, max: 1000000 },
  { label: "Mega (1M+)", min: 1000000, max: 10000000 },
];

export const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Followers: High to Low", value: "followers_desc" },
  { label: "Followers: Low to High", value: "followers_asc" },
  { label: "Engagement: High to Low", value: "engagement_desc" },
] as const;
