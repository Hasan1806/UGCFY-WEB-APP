import { CreatorSearchFilters } from "../types";

export const NICHE_SYNONYMS: Record<string, string[]> = {
  Fitness: ["fitness", "gym", "workout", "fitness coach", "health and fitness"],
  Fashion: ["fashion", "style", "fashion creator", "fashion blogger", "outfits"],
  Beauty: ["beauty", "makeup", "skincare", "beauty creator", "cosmetics"],
  Food: ["food", "foodie", "food blogger", "food creator", "recipes"],
  Gaming: ["gaming", "gamer", "gaming creator", "streamer", "esports"],
  Technology: ["technology", "tech", "gadgets", "tech creator", "tech reviewer"],
  Travel: ["travel", "traveller", "travel blogger", "travel creator"],
  Lifestyle: ["lifestyle", "lifestyle creator", "lifestyle blogger", "daily vlog"],
  Finance: ["personal finance", "investing", "money tips", "stock market"],
  Education: ["education", "study tips", "educator", "learning"],
  Entertainment: ["entertainment", "entertainer", "reels creator"],
  Comedy: ["comedy", "comedian", "funny sketches", "humor creator"],
  Parenting: ["parenting", "mom blogger", "dad creator", "parenting tips"],
  Automotive: ["automotive", "cars", "car reviewer", "biker"],
  Sports: ["sports", "athlete", "cricket", "sports training"],
  Business: ["business", "entrepreneur", "startup founder", "marketing"],
  "Health & Wellness": ["health & wellness", "yoga", "nutritionist", "wellness coach"],
  "Home & Decor": ["home decor", "interior design", "home styling"],
  Photography: ["photography", "photographer", "cinematographer"],
  Music: ["music", "singer", "musician", "music artist"],
};

export class SearchQueryBuilder {
  /**
   * Generates 4 to 8 high-signal Google Search queries specifically formatted
   * to discover authentic public Instagram creator accounts.
   */
  static buildQueries(filters: CreatorSearchFilters): string[] {
    const queries: string[] = [];

    // 1. Explicit user search string takes priority
    const userQuery = filters.query.trim().replace(/^@+/, "");
    if (userQuery) {
      queries.push(`site:instagram.com "${userQuery}"`);
      queries.push(`site:instagram.com ${userQuery} creator`);
      if (filters.city || filters.state) {
        const loc = filters.city || filters.state || "";
        queries.push(`site:instagram.com ${userQuery} ${loc}`);
      }
      return queries.slice(0, 6);
    }

    const city = filters.city?.trim() || "";
    const state = filters.state?.trim() || "";
    const country = filters.country?.trim() || "India";
    const niches = filters.niches.length > 0 ? filters.niches : ["Lifestyle"];
    const primaryNiche = niches[0] || "Lifestyle";
    const synonyms = NICHE_SYNONYMS[primaryNiche] || [primaryNiche.toLowerCase()];
    const synonymAlt = synonyms[1] || synonyms[0] || primaryNiche.toLowerCase();

    // Location Hierarchy Strategy (Nagpur -> Nagpur Maharashtra -> India)
    if (city) {
      // Query 1: Site-specific exact city + niche creator
      queries.push(`site:instagram.com ${city} ${primaryNiche.toLowerCase()} creator`);
      // Query 2: Site-specific city + influencer
      queries.push(`site:instagram.com ${city} ${synonymAlt} influencer`);
      // Query 3: Quoted location for precision
      queries.push(`site:instagram.com "${city}" "${primaryNiche.toLowerCase()}"`);
      // Query 4: Combined state context
      if (state) {
        queries.push(`site:instagram.com ${city} ${state} ${primaryNiche.toLowerCase()} Instagram`);
      } else {
        queries.push(`site:instagram.com ${city} ${country} ${primaryNiche.toLowerCase()} Instagram`);
      }
      // Query 5: Natural search query
      queries.push(`${city} ${primaryNiche.toLowerCase()} content creator Instagram profile`);
    } else if (state) {
      // Query 1: State site-specific
      queries.push(`site:instagram.com ${state} ${primaryNiche.toLowerCase()} creator`);
      queries.push(`site:instagram.com ${state} ${synonymAlt} influencer`);
      queries.push(`site:instagram.com "${state}" "${primaryNiche.toLowerCase()}" Instagram`);
      queries.push(`${state} ${country} ${primaryNiche.toLowerCase()} Instagram content creator`);
    } else {
      // National / Country level
      queries.push(`site:instagram.com ${country} ${primaryNiche.toLowerCase()} creator`);
      queries.push(`site:instagram.com ${country} ${synonymAlt} influencer`);
      queries.push(`site:instagram.com "${primaryNiche.toLowerCase()}" creator ${country}`);
      queries.push(`${country} top ${primaryNiche.toLowerCase()} Instagram creators`);
    }

    // Additional niche combination if multi-niche
    if (niches.length > 1 && niches[1]) {
      const secondNiche = niches[1].toLowerCase();
      const loc = city || state || country;
      queries.push(`site:instagram.com ${loc} ${primaryNiche.toLowerCase()} ${secondNiche}`);
    }

    // Deduplicate and cap to 6 high-yield queries
    return Array.from(new Set(queries)).slice(0, 6);
  }
}
