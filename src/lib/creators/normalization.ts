import { CreatorGender, LocationSource } from "./types";
import { NICHES_LIST } from "./filterData";

/**
 * Validates and normalizes an Instagram handle into a canonical lowercase handle.
 * 
 * Rules:
 * - Trims leading and trailing whitespace
 * - Strips leading '@' symbol
 * - Converts to lower-case
 * - Validates format (1-30 characters, alphanumeric, dots, underscores)
 */
export function normalizeInstagramUsername(rawUsername: string): string {
  if (!rawUsername || typeof rawUsername !== "string") {
    throw new Error("Invalid username: username must be a non-empty string");
  }

  const cleaned = rawUsername.trim().replace(/^@+/, "").toLowerCase();

  const instagramRegex = /^[a-z0-9._]{1,30}$/;
  if (!instagramRegex.test(cleaned)) {
    throw new Error(
      `Invalid Instagram username format: "${rawUsername}". Must be 1-30 chars consisting of letters, numbers, periods, and underscores.`
    );
  }

  return cleaned;
}

/**
 * Constructs a secure public Instagram profile URL from a normalized username.
 */
export function buildInstagramProfileUrl(normalizedUsername: string): string {
  const username = normalizeInstagramUsername(normalizedUsername);
  return `https://www.instagram.com/${username}/`;
}

/**
 * Normalizes Indian and global city aliases to canonical database names.
 */
const CITY_ALIAS_MAP: Record<string, string> = {
  bombay: "Mumbai",
  mumbai: "Mumbai",
  bangalore: "Bengaluru",
  bengaluru: "Bengaluru",
  "bengaluru urban": "Bengaluru",
  calcutta: "Kolkata",
  kolkata: "Kolkata",
  madras: "Chennai",
  chennai: "Chennai",
  "delhi ncr": "Delhi",
  "new delhi": "Delhi",
  "south delhi": "Delhi",
  "north delhi": "Delhi",
  delhi: "Delhi",
  poona: "Pune",
  pune: "Pune",
  nagpur: "Nagpur",
  nashik: "Nashik",
  mysuru: "Mysuru",
  mysore: "Mysuru",
  gurgaon: "Gurugram",
  gurugram: "Gurugram",
  baroda: "Vadodara",
  vadodara: "Vadodara",
  surat: "Surat",
  ahmedabad: "Ahmedabad",
  hyderabad: "Hyderabad",
  jaipur: "Jaipur",
  udaipur: "Udaipur",
  indore: "Indore",
  bhopal: "Bhopal",
  jabalpur: "Jabalpur",
  lucknow: "Lucknow",
  noida: "Noida",
  coimbatore: "Coimbatore",
};

const STATE_ALIAS_MAP: Record<string, string> = {
  maharashtra: "Maharashtra",
  mh: "Maharashtra",
  delhi: "Delhi",
  dl: "Delhi",
  karnataka: "Karnataka",
  ka: "Karnataka",
  "madhya pradesh": "Madhya Pradesh",
  mp: "Madhya Pradesh",
  gujarat: "Gujarat",
  gj: "Gujarat",
  rajasthan: "Rajasthan",
  rj: "Rajasthan",
  "uttar pradesh": "Uttar Pradesh",
  up: "Uttar Pradesh",
  "west bengal": "West Bengal",
  wb: "West Bengal",
  "tamil nadu": "Tamil Nadu",
  tn: "Tamil Nadu",
  telangana: "Telangana",
  ts: "Telangana",
  kerala: "Kerala",
  kl: "Kerala",
  punjab: "Punjab",
  pb: "Punjab",
  haryana: "Haryana",
  hr: "Haryana",
  goa: "Goa",
};

/**
 * Normalizes location metadata while preserving provenance.
 */
export function normalizeLocation(input: {
  country?: string | null | undefined;
  state?: string | null | undefined;
  city?: string | null | undefined;
  locationSource?: LocationSource | undefined;
  locationConfidence?: number | null | undefined;
}) {
  const country = input.country?.trim() || "India";
  let state = input.state?.trim() || null;
  let city = input.city?.trim() || null;

  // Resolve Canonical City
  if (city) {
    const cityKey = city.toLowerCase().trim();
    if (CITY_ALIAS_MAP[cityKey]) {
      city = CITY_ALIAS_MAP[cityKey];
    }
  }

  // Resolve Canonical State
  if (state) {
    const stateKey = state.toLowerCase().trim();
    if (STATE_ALIAS_MAP[stateKey]) {
      state = STATE_ALIAS_MAP[stateKey];
    }
  }

  const countryNormalized = country.toLowerCase().trim();
  const stateNormalized = state ? state.toLowerCase().trim() : null;
  const cityNormalized = city ? city.toLowerCase().trim() : null;

  return {
    country,
    state,
    city,
    countryNormalized,
    stateNormalized,
    cityNormalized,
    locationSource: input.locationSource || "unknown",
    locationConfidence:
      typeof input.locationConfidence === "number"
        ? Math.max(0, Math.min(1, input.locationConfidence))
        : null,
  };
}

/**
 * Niche Taxonomy mapping from raw external tags to UGCFY's 20 canonical categories.
 */
const NICHE_MAPPING_RULES: Record<string, string> = {
  // Fashion
  fashion: "Fashion",
  clothing: "Fashion",
  streetwear: "Fashion",
  style: "Fashion",
  apparel: "Fashion",
  menswear: "Fashion",
  womenswear: "Fashion",
  outfits: "Fashion",

  // Beauty
  beauty: "Beauty",
  skincare: "Beauty",
  makeup: "Beauty",
  cosmetics: "Beauty",
  haircare: "Beauty",
  dermatology: "Beauty",

  // Lifestyle
  lifestyle: "Lifestyle",
  vlogger: "Lifestyle",
  dailyvlog: "Lifestyle",
  living: "Lifestyle",

  // Fitness
  fitness: "Fitness",
  gym: "Fitness",
  workout: "Fitness",
  bodybuilding: "Fitness",
  crossfit: "Fitness",
  trainer: "Fitness",

  // Food
  food: "Food",
  foodie: "Food",
  cooking: "Food",
  recipes: "Food",
  culinary: "Food",
  bakery: "Food",
  chef: "Food",

  // Travel
  travel: "Travel",
  tourism: "Travel",
  backpacking: "Travel",
  wanderlust: "Travel",
  adventure: "Travel",

  // Gaming
  gaming: "Gaming",
  gamer: "Gaming",
  esports: "Gaming",
  streamer: "Gaming",
  pcgaming: "Gaming",

  // Technology
  technology: "Technology",
  tech: "Technology",
  gadgets: "Technology",
  software: "Technology",
  ai: "Technology",
  electronics: "Technology",

  // Finance
  finance: "Finance",
  investing: "Finance",
  crypto: "Finance",
  stocks: "Finance",
  mutualfunds: "Finance",
  personalfinance: "Finance",

  // Education
  education: "Education",
  edtech: "Education",
  tutorials: "Education",
  learning: "Education",
  study: "Education",

  // Entertainment
  entertainment: "Entertainment",
  movies: "Entertainment",
  cinema: "Entertainment",
  popculture: "Entertainment",

  // Comedy
  comedy: "Comedy",
  humour: "Comedy",
  memes: "Comedy",
  standup: "Comedy",
  sketches: "Comedy",

  // Parenting
  parenting: "Parenting",
  motherhood: "Parenting",
  momlife: "Parenting",
  babycare: "Parenting",
  family: "Parenting",

  // Automotive
  automotive: "Automotive",
  cars: "Automotive",
  bikes: "Automotive",
  motorcycles: "Automotive",
  evs: "Automotive",

  // Sports
  sports: "Sports",
  cricket: "Sports",
  football: "Sports",
  badminton: "Sports",
  running: "Sports",

  // Business
  business: "Business",
  startups: "Business",
  entrepreneurship: "Business",
  marketing: "Business",
  d2c: "Business",

  // Health & Wellness
  "health & wellness": "Health & Wellness",
  health: "Health & Wellness",
  wellness: "Health & Wellness",
  yoga: "Health & Wellness",
  nutrition: "Health & Wellness",
  mentalhealth: "Health & Wellness",

  // Home & Decor
  "home & decor": "Home & Decor",
  decor: "Home & Decor",
  interiordesign: "Home & Decor",
  architecture: "Home & Decor",

  // Photography
  photography: "Photography",
  photos: "Photography",
  cinematography: "Photography",

  // Music
  music: "Music",
  singer: "Music",
  musician: "Music",
  dj: "Music",
  audio: "Music",
};

/**
 * Normalizes raw external category tags into UGCFY standard niches.
 */
export function normalizeNiches(rawNiches?: string[] | null): {
  primaryNiche: string | null;
  niches: string[];
} {
  if (!rawNiches || !Array.isArray(rawNiches) || rawNiches.length === 0) {
    return { primaryNiche: null, niches: [] };
  }

  const normalizedSet = new Set<string>();

  for (const raw of rawNiches) {
    if (!raw || typeof raw !== "string") continue;
    const cleanRaw = raw.toLowerCase().trim().replace(/[^a-z0-9&]/g, "");

    // Direct canonical check
    const canonicalMatch = NICHES_LIST.find(
      (n) => n.toLowerCase().replace(/[^a-z0-9&]/g, "") === cleanRaw
    );
    if (canonicalMatch) {
      normalizedSet.add(canonicalMatch);
      continue;
    }

    // Rule-based map check
    if (NICHE_MAPPING_RULES[cleanRaw]) {
      normalizedSet.add(NICHE_MAPPING_RULES[cleanRaw]);
      continue;
    }

    // Partial substring fallback check
    for (const [key, canonical] of Object.entries(NICHE_MAPPING_RULES)) {
      if (cleanRaw.includes(key)) {
        normalizedSet.add(canonical);
        break;
      }
    }
  }

  const niches = Array.from(normalizedSet);
  const primaryNiche: string | null = niches.length > 0 ? (niches[0] ?? null) : null;

  return { primaryNiche, niches };
}

/**
 * Normalizes creator gender.
 * 
 * Strict Constraint: Gender is NEVER inferred from images or names.
 * Allowed values: 'male' | 'female' | 'other' | 'unspecified'
 */
export function normalizeGender(rawGender: unknown): CreatorGender {
  if (typeof rawGender !== "string" || !rawGender.trim()) {
    return "unspecified";
  }

  const cleaned = rawGender.trim().toLowerCase();
  if (["female", "woman", "f"].includes(cleaned)) return "female";
  if (["male", "man", "m"].includes(cleaned)) return "male";
  if (["other", "non-binary", "couple", "group"].includes(cleaned)) return "other";

  return "unspecified";
}

/**
 * Calculates authentic engagement rate percentage.
 * 
 * Formula: ((avgLikes + avgComments) / followersCount) * 100
 * Precision: 2 decimal places.
 * Returns null when insufficient data is available.
 */
export function calculateEngagementRate(metrics: {
  avgLikes?: number | null;
  avgComments?: number | null;
  followersCount?: number | null;
  providerEngagementRate?: number | null;
}): number | null {
  // If provider supplies verified ER, use it bounded
  if (
    typeof metrics.providerEngagementRate === "number" &&
    Number.isFinite(metrics.providerEngagementRate) &&
    metrics.providerEngagementRate >= 0
  ) {
    return Number(metrics.providerEngagementRate.toFixed(2));
  }

  const { avgLikes, avgComments = 0, followersCount } = metrics;

  if (
    typeof avgLikes !== "number" ||
    typeof followersCount !== "number" ||
    followersCount <= 0 ||
    avgLikes < 0
  ) {
    return null; // Return null instead of inventing 0
  }

  const totalInteractions = avgLikes + (avgComments || 0);
  const rate = (totalInteractions / followersCount) * 100;
  return Number(rate.toFixed(2));
}
