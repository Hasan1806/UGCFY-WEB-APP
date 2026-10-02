export type CreatorGender = "male" | "female" | "other" | "unspecified";

export type LocationSource = "creator_provided" | "provider" | "inferred" | "unknown" | "verified_index";

export type SortOption =
  | "relevance"
  | "followers_desc"
  | "followers_asc"
  | "engagement_desc";

export type ViewMode = "grid" | "list";

/**
 * Canonical Creator Entity representing an indexed Instagram creator in UGCFY.
 */
export interface Creator {
  id: string;
  instagramUsername: string;
  instagramUsernameNormalized: string;
  instagramProfileUrl: string;
  displayName: string | null;
  profileImageUrl: string | null;
  bio: string | null;
  followersCount: number | null;
  followingCount: number | null;
  creatorGender: CreatorGender;
  country: string | null;
  state: string | null;
  city: string | null;
  countryNormalized: string | null;
  stateNormalized: string | null;
  cityNormalized: string | null;
  locationSource: LocationSource;
  locationConfidence: number | null; // 0.00 to 1.00
  primaryNiche: string | null;
  niches: string[];
  engagementRate: number | null; // Percentage, e.g. 4.80
  avgLikes: number | null;
  avgComments: number | null;
  avgReelViews: number | null;
  verified: boolean;
  dataSource: string;
  sourceCreatorId: string | null;
  rawMetadata?: Record<string, unknown>;
  lastSyncedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;

  // Frontend compatibility helpers
  startingPrice?: number | null;
  topReels?: Array<{
    title: string;
    views: string;
    likes: string;
  }>;
}

/**
 * Raw external creator payload returned from external data providers or ingestion streams.
 */
export interface RawExternalCreator {
  rawUsername: string;
  displayName?: string | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  followersCount?: number | null;
  followingCount?: number | null;
  rawGender?: string | null;
  rawCountry?: string | null;
  rawState?: string | null;
  rawCity?: string | null;
  locationSource?: LocationSource;
  locationConfidence?: number | null;
  rawNiches?: string[] | null;
  engagementRate?: number | null;
  avgLikes?: number | null;
  avgComments?: number | null;
  avgReelViews?: number | null;
  verified?: boolean | null;
  providerName: string;
  providerCreatorId?: string | null;
  rawPayload?: Record<string, unknown>;
}

/** The single filter contract used by the URL, API, service, and providers. */
export interface CreatorSearchFilters {
  query: string;
  minFollowers: number | null;
  maxFollowers: number | null;
  country: string | null;
  state: string | null;
  city: string | null;
  niches: string[];
  gender: CreatorGender | null;
  minEngagementRate: number | null;
  sort: SortOption;
  page: number;
  limit: number;
}

/** @deprecated Use CreatorSearchFilters. Kept as an import-compatible alias. */
export type CreatorFilterParams = CreatorSearchFilters;

/**
 * Standard Pagination Metadata
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Structured Search Response
 */
export interface CreatorSearchSuccessResponse {
  success: true;
  creators: Creator[];
  exactMatches?: Creator[];
  potentialMatches?: Creator[];
  pagination: PaginationMetadata;
  dataSource?: "index" | "cache" | "development" | "provider_augmented" | "public_search_discovery";
  durationMs?: number;
  activeFilterCount?: number;
  meta?: Record<string, unknown>;
}

export interface CreatorSearchErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type CreatorSearchResponse =
  | CreatorSearchSuccessResponse
  | CreatorSearchErrorResponse;

/**
 * Provider Search Result interface
 */
export interface ProviderSearchResult {
  creators: RawExternalCreator[];
  totalAvailable?: number;
  hasMore?: boolean;
}

/**
 * Provider Abstraction Interface
 */
export interface CreatorDiscoveryProvider {
  readonly providerName: string;
  searchCreators(filters: CreatorSearchFilters): Promise<ProviderSearchResult>;
  getCreator(username: string): Promise<RawExternalCreator | null>;
  refreshCreator(username: string): Promise<RawExternalCreator | null>;
}
