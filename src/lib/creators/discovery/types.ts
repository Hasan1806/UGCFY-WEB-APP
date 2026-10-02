import { Creator, CreatorGender, CreatorSearchFilters, PaginationMetadata, SortOption } from "../types";

export interface SearchResultItem {
  title: string;
  link: string;
  snippet?: string;
  displayedLink?: string;
  query: string;
  sourceProvider: string;
  rawItem?: Record<string, unknown>;
}

export interface SearchProviderOptions {
  page?: number;
  num?: number;
  timeoutMs?: number;
}

export interface SearchProvider {
  readonly providerName: string;
  search(query: string, options?: SearchProviderOptions): Promise<SearchResultItem[]>;
}

export interface InstagramSearchEvidence {
  url: string;
  title: string;
  snippet: string;
  query: string;
  sourceProvider: string;
}

export interface InstagramCandidate {
  rawUsername: string;
  normalizedUsername: string;
  profileUrl: string;
  evidenceList: InstagramSearchEvidence[];
}

export interface GeminiEnrichedEvidence {
  identitySupported: boolean;
  locationSupported: boolean;
  nicheSupported: boolean;
  followersSupported: boolean;
  engagementSupported: boolean;
  genderSupported: boolean;
}

export interface GeminiEnrichedCreator {
  instagramUsername: string;
  instagramProfileUrl: string;
  displayName: string | null;
  profileImageUrl: string | null;
  followersCount: number | null;
  followingCount: number | null;
  engagementRate: number | null;
  creatorGender: CreatorGender;
  country: string | null;
  state: string | null;
  city: string | null;
  primaryNiche: string | null;
  niches: string[];
  bio: string | null;
  evidence: GeminiEnrichedEvidence;
  confidence: number;
}

export interface ValidatedCreatorResult {
  creator: Creator;
  isExactMatch: boolean;
  matchReasons: string[];
  unverifiedFields: string[];
  sources: InstagramSearchEvidence[];
}

export interface CreatorDiscoverySuccessResponse {
  success: true;
  exactMatches: Creator[];
  potentialMatches: Creator[];
  creators: Creator[]; // Full combined list for backward compatibility
  pagination: PaginationMetadata;
  meta: {
    queriesExecuted: number;
    searchResults: number;
    instagramCandidates: number;
    candidatesAnalyzed: number;
    exactMatches: number;
    potentialMatches: number;
    durationMs: number;
    cached?: boolean;
    provider: string;
  };
}

export interface CreatorDiscoveryErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

export type CreatorDiscoveryResponse =
  | CreatorDiscoverySuccessResponse
  | CreatorDiscoveryErrorResponse;

export class SearchProviderError extends Error {
  constructor(
    public readonly code: "PROVIDER_QUOTA_EXCEEDED" | "PROVIDER_AUTH_FAILED" | "PROVIDER_TIMEOUT" | "PROVIDER_UNAVAILABLE" | "PROVIDER_NOT_CONFIGURED",
    message: string,
    public readonly providerName: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "SearchProviderError";
  }
}

export class GeminiEnrichmentError extends Error {
  constructor(
    public readonly code: "GEMINI_QUOTA_EXCEEDED" | "GEMINI_AUTH_FAILED" | "GEMINI_TIMEOUT" | "GEMINI_UNAVAILABLE" | "GEMINI_PARSE_FAILED",
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "GeminiEnrichmentError";
  }
}
