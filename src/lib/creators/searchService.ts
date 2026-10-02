import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  Creator,
  CreatorSearchFilters,
  CreatorSearchSuccessResponse,
  RawExternalCreator,
} from "./types";
import { mapDbRowToCreator } from "./ingestion";
import {
  buildInstagramProfileUrl,
  normalizeGender,
  normalizeInstagramUsername,
  normalizeLocation,
  normalizeNiches,
} from "./normalization";
import {
  createCreatorSearchKey,
  getActiveCreatorFilterCount,
  normalizeCreatorSearchFilters,
} from "./searchFilters";
import { ProviderFactory } from "./providers/ProviderFactory";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const DATABASE_TIMEOUT_MS = 8_000;
const PROVIDER_TIMEOUT_MS = 8_000;

export class CreatorSearchError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "CreatorSearchError";
  }
}

function providerCreatorToCreator(raw: RawExternalCreator): Creator {
  const username = normalizeInstagramUsername(raw.rawUsername);
  const location = normalizeLocation({
    country: raw.rawCountry,
    state: raw.rawState,
    city: raw.rawCity,
    locationSource: raw.locationSource,
    locationConfidence: raw.locationConfidence,
  });
  const nicheData = normalizeNiches(raw.rawNiches);
  const now = new Date().toISOString();

  return {
    id: `${raw.providerName}:${raw.providerCreatorId || username}`,
    instagramUsername: raw.rawUsername.replace(/^@/, ""),
    instagramUsernameNormalized: username,
    instagramProfileUrl: buildInstagramProfileUrl(username),
    displayName: raw.displayName || null,
    profileImageUrl: raw.profileImageUrl || null,
    bio: raw.bio || null,
    followersCount: raw.followersCount ?? null,
    followingCount: raw.followingCount ?? null,
    creatorGender: normalizeGender(raw.rawGender),
    country: location.country,
    state: location.state,
    city: location.city,
    countryNormalized: location.countryNormalized,
    stateNormalized: location.stateNormalized,
    cityNormalized: location.cityNormalized,
    locationSource: location.locationSource,
    locationConfidence: location.locationConfidence,
    primaryNiche: nicheData.primaryNiche,
    niches: nicheData.niches,
    engagementRate: raw.engagementRate ?? null,
    avgLikes: raw.avgLikes ?? null,
    avgComments: raw.avgComments ?? null,
    avgReelViews: raw.avgReelViews ?? null,
    verified: Boolean(raw.verified),
    dataSource: raw.providerName,
    sourceCreatorId: raw.providerCreatorId || null,
    rawMetadata: raw.rawPayload || {},
    lastSyncedAt: now,
    createdAt: now,
    updatedAt: now,
    startingPrice:
      typeof raw.rawPayload?.startingPrice === "number"
        ? raw.rawPayload.startingPrice
        : null,
    topReels: Array.isArray(raw.rawPayload?.topReels)
      ? (raw.rawPayload.topReels as NonNullable<Creator["topReels"]>)
      : [],
  };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  code: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new CreatorSearchError(code, "Creator search timed out.")),
      timeoutMs
    );
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export class CreatorSearchService {
  private static cache = new Map<
    string,
    CacheEntry<CreatorSearchSuccessResponse>
  >();
  private static creatorLookupCache = new Map<
    string,
    CacheEntry<Creator>
  >();
  private static readonly SEARCH_CACHE_TTL_MS = 5 * 60 * 1000;
  private static readonly LOOKUP_CACHE_TTL_MS = 15 * 60 * 1000;

  public static generateSearchCacheKey(params: CreatorSearchFilters): string {
    return `creator-search:${createCreatorSearchKey(params)}`;
  }

  public static async search(
    input: CreatorSearchFilters
  ): Promise<CreatorSearchSuccessResponse> {
    const startedAt = Date.now();
    const filters = normalizeCreatorSearchFilters(input);
    const requestKey = createCreatorSearchKey(filters);
    const cacheKey = `creator-search:${requestKey}`;
    const cached = this.cache.get(cacheKey);

    console.info("[creator-search:start]", {
      requestKey,
      city: filters.city?.toLowerCase() || null,
      niches: filters.niches,
      gender: filters.gender,
    });

    if (cached && cached.expiresAt > Date.now()) {
      return {
        ...cached.data,
        dataSource: "cache",
        durationMs: Date.now() - startedAt,
      };
    }

    const page = filters.page;
    const limit = filters.limit;
    const offset = (page - 1) * limit;
    const location = normalizeLocation(filters);
    const databaseAbort = new AbortController();
    const databaseTimer = setTimeout(
      () => databaseAbort.abort(new Error("Database search timed out")),
      DATABASE_TIMEOUT_MS
    );

    let rows: Record<string, unknown>[] = [];
    let total = 0;
    let databaseError: unknown = null;

    try {
      let query = getSupabaseAdmin()
        .from("creators")
        .select("*", { count: "exact" });

      if (filters.minFollowers !== null) {
        query = query.gte("followers_count", filters.minFollowers);
      }
      if (filters.maxFollowers !== null) {
        query = query.lte("followers_count", filters.maxFollowers);
      }
      if (filters.gender) query = query.eq("creator_gender", filters.gender);
      if (location.countryNormalized) {
        query = query.eq("country_normalized", location.countryNormalized);
      }
      if (location.stateNormalized) {
        query = query.eq("state_normalized", location.stateNormalized);
      }
      if (location.cityNormalized) {
        query = query.eq("city_normalized", location.cityNormalized);
      }
      if (filters.minEngagementRate !== null) {
        query = query.gte("engagement_rate", filters.minEngagementRate);
      }
      if (filters.niches.length) {
        query = query.overlaps("niches", normalizeNiches(filters.niches).niches);
      }
      if (filters.query) {
        const safeQuery = filters.query.replace(/[%,()]/g, "");
        query = query.or(
          `display_name.ilike.%${safeQuery}%,instagram_username_normalized.ilike.%${safeQuery}%`
        );
      }

      switch (filters.sort) {
        case "followers_desc":
          query = query.order("followers_count", {
            ascending: false,
            nullsFirst: false,
          });
          break;
        case "followers_asc":
          query = query.order("followers_count", {
            ascending: true,
            nullsFirst: false,
          });
          break;
        case "engagement_desc":
        case "relevance":
          query = query.order("engagement_rate", {
            ascending: false,
            nullsFirst: false,
          });
          break;
      }

      const result = await query
        .range(offset, offset + limit - 1)
        .abortSignal(databaseAbort.signal);
      if (result.error) {
        throw new CreatorSearchError(
          "DATABASE_ERROR",
          "Creator database search failed.",
          result.error
        );
      }
      rows = (result.data || []) as Record<string, unknown>[];
      total = result.count ?? rows.length;
      console.info("[creator-search:local]", {
        requestKey,
        matches: total,
        durationMs: Date.now() - startedAt,
      });
    } catch (error) {
      databaseError = error;
      console.warn("[creator-search:local]", {
        requestKey,
        status: databaseAbort.signal.aborted ? "timeout" : "failed",
        durationMs: Date.now() - startedAt,
      });
    } finally {
      clearTimeout(databaseTimer);
    }

    let creators = rows.map(mapDbRowToCreator);
    let dataSource: CreatorSearchSuccessResponse["dataSource"] = "index";

    // Development data is explicit and can never be selected in production.
    if (process.env.NODE_ENV !== "production" && creators.length === 0) {
      const provider = ProviderFactory.getProvider();
      if (provider) {
        const providerResult = await withTimeout(
          provider.searchCreators(filters),
          PROVIDER_TIMEOUT_MS,
          "PROVIDER_TIMEOUT"
        );
        const allProviderCreators = providerResult.creators.map(
          providerCreatorToCreator
        );
        total = providerResult.totalAvailable ?? allProviderCreators.length;
        creators = allProviderCreators.slice(offset, offset + limit);
        dataSource = "development";
        databaseError = null;
        console.info("[creator-search:provider]", {
          requestKey,
          provider: provider.providerName,
          matches: total,
        });
      }
    } else {
      console.info("[creator-search:provider]", {
        requestKey,
        status: creators.length ? "skipped-local-results" : "skipped",
      });
    }

    if (databaseError && process.env.NODE_ENV === "production") {
      throw new CreatorSearchError(
        databaseAbort.signal.aborted ? "DATABASE_TIMEOUT" : "DATABASE_ERROR",
        "Unable to load creators.",
        databaseError
      );
    }

    const totalPages = Math.ceil(total / limit);
    const response: CreatorSearchSuccessResponse = {
      success: true,
      creators,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
      dataSource,
      durationMs: Date.now() - startedAt,
      activeFilterCount: getActiveCreatorFilterCount(filters),
    };

    this.cache.set(cacheKey, {
      data: response,
      expiresAt: Date.now() + this.SEARCH_CACHE_TTL_MS,
    });
    console.info("[creator-search:complete]", {
      requestKey,
      total,
      durationMs: response.durationMs,
      dataSource,
    });
    return response;
  }

  public static async getCreatorByUsername(
    username: string
  ): Promise<Creator | null> {
    const normalized = normalizeInstagramUsername(username);
    const cached = this.creatorLookupCache.get(normalized);
    if (cached && cached.expiresAt > Date.now()) return cached.data;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DATABASE_TIMEOUT_MS);
    let creator: Creator | null = null;
    try {
      const result = await getSupabaseAdmin()
        .from("creators")
        .select("*")
        .eq("instagram_username_normalized", normalized)
        .abortSignal(controller.signal)
        .maybeSingle();
      if (!result.error && result.data) creator = mapDbRowToCreator(result.data);
    } catch {
      // The development provider below remains isolated from production.
    } finally {
      clearTimeout(timer);
    }

    if (!creator && process.env.NODE_ENV !== "production") {
      const provider = ProviderFactory.getProvider();
      const raw = provider
        ? await withTimeout(
            provider.getCreator(normalized),
            PROVIDER_TIMEOUT_MS,
            "PROVIDER_TIMEOUT"
          )
        : null;
      if (raw) creator = providerCreatorToCreator(raw);
    }

    if (creator) {
      this.creatorLookupCache.set(normalized, {
        data: creator,
        expiresAt: Date.now() + this.LOOKUP_CACHE_TTL_MS,
      });
    }
    return creator;
  }
}
