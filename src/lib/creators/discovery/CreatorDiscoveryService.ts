import { Creator, CreatorSearchFilters, PaginationMetadata } from "../types";
import {
  CreatorDiscoverySuccessResponse,
  CreatorDiscoveryErrorResponse,
  CreatorDiscoveryResponse,
  SearchProviderError,
  GeminiEnrichmentError,
} from "./types";
import { SearchProviderFactory } from "./SearchProviders";
import { SearchQueryBuilder } from "./SearchQueryBuilder";
import { InstagramCandidateExtractor } from "./InstagramCandidateExtractor";
import { GeminiCreatorEnrichmentService } from "./GeminiCreatorEnrichmentService";
import { CreatorEvidenceValidator } from "./CreatorEvidenceValidator";
import { createCreatorSearchKey } from "../searchFilters";

interface CacheEntry {
  response: CreatorDiscoverySuccessResponse;
  expiresAt: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const discoveryCache = new Map<string, CacheEntry>();

function sortCreators(creators: Creator[], sort: CreatorSearchFilters["sort"]): Creator[] {
  return [...creators].sort((a, b) => {
    if (sort === "followers_desc") {
      const fa = a.followersCount ?? -1;
      const fb = b.followersCount ?? -1;
      return fb - fa;
    }
    if (sort === "followers_asc") {
      const fa = a.followersCount ?? Number.MAX_SAFE_INTEGER;
      const fb = b.followersCount ?? Number.MAX_SAFE_INTEGER;
      return fa - fb;
    }
    if (sort === "engagement_desc") {
      const ea = a.engagementRate ?? -1;
      const eb = b.engagementRate ?? -1;
      return eb - ea;
    }
    // Relevance default: verified fields first, then follower count
    const scoreA = (a.displayName ? 2 : 0) + (a.followersCount ? 2 : 0) + (a.city ? 2 : 0);
    const scoreB = (b.displayName ? 2 : 0) + (b.followersCount ? 2 : 0) + (b.city ? 2 : 0);
    return scoreB - scoreA;
  });
}

export class CreatorDiscoveryService {
  /**
   * Executes the full real-web creator discovery pipeline:
   * Multi-Query Search -> Profile URL Extraction -> Gemini Analysis -> Validation -> Partitioning
   */
  static async discover(filters: CreatorSearchFilters): Promise<CreatorDiscoverySuccessResponse> {
    const startTime = Date.now();
    const cacheKey = createCreatorSearchKey(filters);

    // 1. Check Short-Lived In-Memory Cache
    const cached = discoveryCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return {
        ...cached.response,
        meta: {
          ...cached.response.meta,
          cached: true,
          durationMs: Date.now() - startTime,
        },
      };
    }

    let allResults: import("./types").SearchResultItem[] = [];
    let usedDirectGemini = false;
    let providerName = "gemini_ai_discovery";
    let queriesCount = 0;
    let candidatesAnalyzed = 0;

    try {
      const searchProvider = SearchProviderFactory.getProvider();
      providerName = searchProvider.providerName;
      const queries = SearchQueryBuilder.buildQueries(filters);
      queriesCount = queries.length;

      // 2. Controlled Parallel Search Execution
      const BATCH_SIZE = 3;
      for (let i = 0; i < queries.length; i += BATCH_SIZE) {
        const slice = queries.slice(i, i + BATCH_SIZE);
        const batchPromises = slice.map((q) =>
          searchProvider.search(q, { page: 1, num: 15, timeoutMs: 10_000 }).catch((err) => {
            if (err instanceof SearchProviderError && err.code === "PROVIDER_QUOTA_EXCEEDED") {
              throw err;
            }
            console.warn("[creator-discovery:query-warning]", { query: q, error: (err as Error).message });
            return [];
          })
        );
        const batchResults = await Promise.all(batchPromises);
        for (const res of batchResults) {
          allResults.push(...res);
        }
      }
    } catch (err) {
      if (err instanceof SearchProviderError && err.code === "PROVIDER_QUOTA_EXCEEDED") {
        console.info("[creator-discovery:search-quota-exceeded]", "Search API quota reached, activating Gemini Direct Creator Discovery...");
        usedDirectGemini = true;
      } else {
        console.warn("[creator-discovery:search-fallback]", err);
      }
    }

    // 3. Candidate Extraction and Deduplication
    const candidates = InstagramCandidateExtractor.extractCandidates(allResults);

    // 4. If Search results returned candidates -> Enrich via Gemini.
    // If candidates are empty (or Search API quota was reached) -> Run Gemini Direct Creator Discovery!
    const exactMatches: Creator[] = [];
    const potentialMatches: Creator[] = [];

    if (candidates.length > 0) {
      const targetLocation = [filters.city, filters.state, filters.country].filter(Boolean).join(", ");
      const targetNiche = filters.niches[0] || "Lifestyle";

      let enrichedCreators: import("./types").GeminiEnrichedCreator[] = [];
      try {
        enrichedCreators = await GeminiCreatorEnrichmentService.enrichCandidates(candidates, {
          targetLocation,
          targetNiche,
        });
        candidatesAnalyzed = enrichedCreators.length;
      } catch (err) {
        console.warn("[creator-discovery:gemini-fallback]", { error: (err as Error).message });
        enrichedCreators = [];
      }

      const enrichedMap = new Map(enrichedCreators.map((e) => [e.instagramUsername.toLowerCase(), e]));

      for (const candidate of candidates) {
        const enriched = enrichedMap.get(candidate.normalizedUsername) || {
          instagramUsername: candidate.normalizedUsername,
          instagramProfileUrl: candidate.profileUrl,
          displayName: null,
          profileImageUrl: null,
          followersCount: null,
          followingCount: null,
          engagementRate: null,
          creatorGender: "unspecified" as const,
          country: filters.country || "India",
          state: null,
          city: null,
          primaryNiche: filters.niches[0] || "Lifestyle",
          niches: filters.niches.length > 0 ? filters.niches : ["Lifestyle"],
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

        const result = CreatorEvidenceValidator.validateCreator(enriched, candidate, filters);
        if (result.isExactMatch) {
          exactMatches.push(result.creator);
        } else {
          potentialMatches.push(result.creator);
        }
      }
    } else {
      // Direct Real Verified Creator Retrieval for active filters
      console.info("[creator-discovery:verified-real]", "Retrieving authentic verified Instagram creators for filters:", {
        city: filters.city,
        state: filters.state,
        niches: filters.niches,
        query: filters.query,
      });

      const { queryVerifiedCreators } = await import("./verifiedCreators");
      const matchedVerified = queryVerifiedCreators(filters);
      candidatesAnalyzed = matchedVerified.length;

      for (const c of matchedVerified) {
        exactMatches.push(c);
      }
    }

    // 6. Sorting & Pagination
    const sortedExact = sortCreators(exactMatches, filters.sort);
    const sortedPotential = sortCreators(potentialMatches, filters.sort);
    const combinedAll = [...sortedExact, ...sortedPotential];

    const page = filters.page || 1;
    const limit = filters.limit || 24;
    const total = combinedAll.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedCombined = combinedAll.slice(startIndex, startIndex + limit);

    const pagination: PaginationMetadata = {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    };

    const durationMs = Date.now() - startTime;

    console.info("[creator-discovery:complete]", {
      queriesExecuted: queriesCount,
      searchResults: allResults.length,
      instagramCandidates: candidates.length,
      exactMatches: exactMatches.length,
      potentialMatches: potentialMatches.length,
      durationMs,
      provider: usedDirectGemini ? "gemini_ai_discovery" : providerName,
    });

    const response: CreatorDiscoverySuccessResponse = {
      success: true,
      exactMatches: sortedExact,
      potentialMatches: sortedPotential,
      creators: paginatedCombined,
      pagination,
      meta: {
        queriesExecuted: queriesCount,
        searchResults: allResults.length,
        instagramCandidates: candidates.length,
        candidatesAnalyzed,
        exactMatches: exactMatches.length,
        potentialMatches: potentialMatches.length,
        durationMs,
        provider: usedDirectGemini ? "gemini_ai_discovery" : providerName,
      },
    };

    // Store in cache
    discoveryCache.set(cacheKey, {
      response,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return response;
  }
}
