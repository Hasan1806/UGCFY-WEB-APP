import { z } from "zod";
import { GeminiEnrichedCreator, GeminiEnrichmentError, InstagramCandidate } from "./types";
import { CreatorGender } from "../types";

const UGCFY_NICHE_TAXONOMY = [
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

const GeminiCreatorOutputSchema = z.object({
  instagramUsername: z.string(),
  displayName: z.string().nullable().optional(),
  followersCount: z.number().nullable().optional(),
  rawFollowersString: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  primaryNiche: z.enum(UGCFY_NICHE_TAXONOMY).nullable().optional(),
  niches: z.array(z.enum(UGCFY_NICHE_TAXONOMY)).optional().default([]),
  bio: z.string().nullable().optional(),
  creatorGender: z.enum(["male", "female", "other", "unspecified"]).optional().default("unspecified"),
  identitySupported: z.boolean().default(false),
  locationSupported: z.boolean().default(false),
  nicheSupported: z.boolean().default(false),
  followersSupported: z.boolean().default(false),
  confidence: z.number().min(0).max(1).default(0.5),
});

const GeminiBatchResponseSchema = z.object({
  creators: z.array(GeminiCreatorOutputSchema),
});

const CANDIDATE_ANALYSIS_PROMPT = `You are a strict creator data analysis engine for UGCFY.
Analyze the provided public search evidence (titles, snippets, URLs) for Instagram candidate profiles.

CRITICAL ANTI-HALLUCINATION RULES:
1. ONLY extract information that is explicitly stated or strongly substantiated in the search snippets/titles.
2. DO NOT fabricate or guess follower counts, display names, locations, niches, or genders.
3. If follower count is not mentioned in the text (e.g. "15K followers", "50,000 Followers"), set followersCount to null.
4. If city/state is not explicitly mentioned, set them to null.
5. If gender is not explicitly stated in the text, set creatorGender to "unspecified". NEVER infer gender from appearance, names, or handles.
6. Primary niche MUST be selected strictly from this taxonomy:
   [${UGCFY_NICHE_TAXONOMY.join(", ")}].
   If the evidence doesn't support any specific niche, use "Lifestyle".
7. Return valid JSON adhering strictly to the schema.`;

const CANDIDATE_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
];

export class GeminiCreatorEnrichmentService {
  private static parseFollowersString(raw?: string | null): number | null {
    if (!raw || typeof raw !== "string") return null;
    const clean = raw.trim().toUpperCase().replace(/,/g, "");

    const millionMatch = clean.match(/^([\d.]+)\s*M(?:ILLION)?/);
    if (millionMatch && millionMatch[1]) {
      const num = parseFloat(millionMatch[1]);
      return !isNaN(num) ? Math.round(num * 1_000_000) : null;
    }

    const thousandMatch = clean.match(/^([\d.]+)\s*K/);
    if (thousandMatch && thousandMatch[1]) {
      const num = parseFloat(thousandMatch[1]);
      return !isNaN(num) ? Math.round(num * 1_000) : null;
    }

    const directNum = parseInt(clean.replace(/[^\d]/g, ""), 10);
    return !isNaN(directNum) && directNum > 0 ? directNum : null;
  }

  /**
   * Enriches a batch of Instagram candidates using Gemini structured output.
   */
  static async enrichCandidates(
    candidates: InstagramCandidate[],
    searchContext: { targetLocation?: string; targetNiche?: string }
  ): Promise<GeminiEnrichedCreator[]> {
    if (candidates.length === 0) return [];

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new GeminiEnrichmentError("GEMINI_AUTH_FAILED", "GEMINI_API_KEY is not configured.");
    }

    // Limit batch size to 12 candidates per LLM call for optimal accuracy and speed
    const batch = candidates.slice(0, 12);

    const candidatesPayload = batch.map((c) => ({
      username: c.normalizedUsername,
      instagramUrl: c.profileUrl,
      evidence: c.evidenceList.map((e) => ({
        title: e.title,
        snippet: e.snippet,
        query: e.query,
      })),
    }));

    const userPrompt = `Search Context:
Target Location: ${searchContext.targetLocation || "India"}
Target Niche: ${searchContext.targetNiche || "Any"}

Candidates to analyze:
${JSON.stringify(candidatesPayload, null, 2)}

Return a JSON object with a "creators" array containing structured analysis for each candidate.`;

    let lastError: unknown = null;

    for (const modelName of CANDIDATE_MODELS) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 14_000);

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: CANDIDATE_ANALYSIS_PROMPT }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          }),
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          if (response.status === 429) {
            throw new GeminiEnrichmentError("GEMINI_QUOTA_EXCEEDED", "Gemini API quota exceeded.", errText);
          }
          if (response.status === 401 || response.status === 403) {
            throw new GeminiEnrichmentError("GEMINI_AUTH_FAILED", "Gemini API key is invalid or unauthorized.");
          }
          // If 503 high demand or 404 model not found, try next candidate model
          lastError = new Error(`Gemini ${modelName} returned HTTP ${response.status}: ${errText.substring(0, 150)}`);
          continue;
        }

        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) {
          lastError = new Error(`Gemini ${modelName} returned empty text parts.`);
          continue;
        }

        let parsedJson: unknown;
        try {
          parsedJson = JSON.parse(jsonText);
        } catch {
          lastError = new GeminiEnrichmentError("GEMINI_PARSE_FAILED", "Failed to parse JSON response from Gemini.");
          continue;
        }

        const validation = GeminiBatchResponseSchema.safeParse(parsedJson);
        const creatorsList = validation.success
          ? validation.data.creators
          : Array.isArray(parsedJson)
            ? z.array(GeminiCreatorOutputSchema).catch([]).parse(parsedJson)
            : (parsedJson as Record<string, unknown>)?.creators && Array.isArray((parsedJson as Record<string, unknown>).creators)
              ? z.array(GeminiCreatorOutputSchema).catch([]).parse((parsedJson as Record<string, unknown>).creators)
              : [];

        const enrichedMap = new Map<string, GeminiEnrichedCreator>();

        for (const item of creatorsList) {
          const username = item.instagramUsername.replace(/^@+/, "").toLowerCase();
          const followersParsed = item.followersCount ?? this.parseFollowersString(item.rawFollowersString);

          enrichedMap.set(username, {
            instagramUsername: username,
            instagramProfileUrl: `https://www.instagram.com/${username}/`,
            displayName: item.displayName || null,
            profileImageUrl: null,
            followersCount: followersParsed,
            followingCount: null,
            engagementRate: null,
            creatorGender: (item.creatorGender as CreatorGender) || "unspecified",
            country: item.country || "India",
            state: item.state || null,
            city: item.city || null,
            primaryNiche: item.primaryNiche || null,
            niches: item.niches.length > 0 ? item.niches : item.primaryNiche ? [item.primaryNiche] : [],
            bio: item.bio || null,
            evidence: {
              identitySupported: Boolean(item.identitySupported),
              locationSupported: Boolean(item.locationSupported),
              nicheSupported: Boolean(item.nicheSupported),
              followersSupported: typeof followersParsed === "number",
              engagementSupported: false,
              genderSupported: item.creatorGender !== "unspecified",
            },
            confidence: item.confidence ?? 0.7,
          });
        }

        // Return matched results for candidates
        return batch.map((c): GeminiEnrichedCreator => {
          const found = enrichedMap.get(c.normalizedUsername);
          if (found) return found;

          // Deterministic fallback from candidate evidence if model omitted this item
          return {
            instagramUsername: c.normalizedUsername,
            instagramProfileUrl: c.profileUrl,
            displayName: null,
            profileImageUrl: null,
            followersCount: null,
            followingCount: null,
            engagementRate: null,
            creatorGender: "unspecified",
            country: "India",
            state: null,
            city: null,
            primaryNiche: (searchContext.targetNiche as typeof UGCFY_NICHE_TAXONOMY[number]) || "Lifestyle",
            niches: searchContext.targetNiche ? [searchContext.targetNiche] : ["Lifestyle"],
            bio: null,
            evidence: {
              identitySupported: true,
              locationSupported: false,
              nicheSupported: false,
              followersSupported: false,
              engagementSupported: false,
              genderSupported: false,
            },
            confidence: 0.5,
          };
        });
      } catch (err) {
        if (err instanceof GeminiEnrichmentError) throw err;
        lastError = err;
      } finally {
        clearTimeout(timer);
      }
    }

    if (lastError instanceof GeminiEnrichmentError) throw lastError;
    throw new GeminiEnrichmentError(
      "GEMINI_UNAVAILABLE",
      lastError instanceof Error ? lastError.message : "Gemini service unavailable after attempting all model endpoints."
    );
  }

  /**
   * Direct Gemini Creator Discovery:
   * Used when Search API quota is exhausted or for direct AI creator search across Indian creators.
   */
  static async discoverDirectCreators(filters: import("../types").CreatorSearchFilters): Promise<import("../types").Creator[]> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new GeminiEnrichmentError("GEMINI_AUTH_FAILED", "GEMINI_API_KEY is not configured.");
    }

    const city = filters.city?.trim() || "";
    const state = filters.state?.trim() || "";
    const country = filters.country?.trim() || "India";
    const niches = filters.niches.length > 0 ? filters.niches : ["Lifestyle"];
    const gender = filters.gender && filters.gender !== "unspecified" ? filters.gender : "any";
    const minFollowers = filters.minFollowers ?? 10000;
    const maxFollowers = filters.maxFollowers ?? 1000000;
    const query = filters.query?.trim() || "";

    const prompt = `You are UGCFY's expert Indian Instagram Creator Discovery engine.
Find 10 to 18 real, publicly known Instagram creators based in India that match these criteria:
- Location: City: "${city || "Any"}", State: "${state || "Any"}", Country: "${country}"
- Niches: [${niches.join(", ")}]
- Follower Range: ${minFollowers} to ${maxFollowers}
- Gender: ${gender}
- Additional Keyword / Query: "${query || "None"}"

STRICT RULES:
1. Only return REAL, EXISTING Instagram creators with valid public usernames.
2. Select primaryNiche strictly from: [${UGCFY_NICHE_TAXONOMY.join(", ")}].
3. If exact city is not known with certainty, specify the confirmed city or state.
4. Return a valid JSON object adhering to this schema:
{
  "creators": [
    {
      "instagramUsername": "clean_handle_without_at",
      "displayName": "Full Name",
      "city": "City Name or null",
      "state": "State Name or null",
      "country": "India",
      "followersCount": 45000,
      "primaryNiche": "Fitness",
      "niches": ["Fitness"],
      "creatorGender": "male | female | unspecified",
      "bio": "Short creator description"
    }
  ]
}`;

    const models = ["gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-3.5-flash"];

    for (const model of models) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12_000);

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        });

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) continue;

        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed.creators) ? parsed.creators : Array.isArray(parsed) ? parsed : [];
        const now = new Date().toISOString();

        return list.map((item: Record<string, unknown>, index: number): import("../types").Creator => {
          const username = String(item.instagramUsername || `creator_${index + 1}`).replace(/^@+/, "").toLowerCase();
          const followersParsed = typeof item.followersCount === "number" ? item.followersCount : null;
          const genderRaw = String(item.creatorGender || "unspecified").toLowerCase();
          const creatorGender: CreatorGender = genderRaw === "male" || genderRaw === "female" || genderRaw === "other" ? genderRaw : "unspecified";

          return {
            id: `gemini:${username}`,
            instagramUsername: username,
            instagramUsernameNormalized: username,
            instagramProfileUrl: `https://www.instagram.com/${username}/`,
            displayName: item.displayName ? String(item.displayName) : null,
            profileImageUrl: null,
            bio: item.bio ? String(item.bio) : null,
            followersCount: followersParsed,
            followingCount: null,
            creatorGender,
            country: String(item.country || "India"),
            state: item.state ? String(item.state) : null,
            city: item.city ? String(item.city) : null,
            countryNormalized: "india",
            stateNormalized: item.state ? String(item.state).toLowerCase() : null,
            cityNormalized: item.city ? String(item.city).toLowerCase() : null,
            locationSource: item.city ? "inferred" : "unknown",
            locationConfidence: 0.85,
            primaryNiche: item.primaryNiche ? String(item.primaryNiche) : niches[0] || "Lifestyle",
            niches: Array.isArray(item.niches) && item.niches.length > 0 ? (item.niches as string[]) : [item.primaryNiche ? String(item.primaryNiche) : niches[0] || "Lifestyle"],
            engagementRate: null,
            avgLikes: null,
            avgComments: null,
            avgReelViews: null,
            verified: false,
            dataSource: "gemini_ai_discovery",
            sourceCreatorId: username,
            rawMetadata: item,
            lastSyncedAt: now,
            createdAt: now,
            updatedAt: now,
            startingPrice: null,
            topReels: [],
          };
        });
      } catch {
        continue;
      } finally {
        clearTimeout(timer);
      }
    }

    return [];
  }
}
