import {
  CreatorDiscoveryProvider,
  CreatorFilterParams,
  ProviderSearchResult,
  RawExternalCreator,
} from "../types";
import { MOCK_INSTAGRAM_CREATORS } from "../mockData";
import { normalizeInstagramUsername } from "../normalization";

/**
 * DevMockCreatorProvider
 * 
 * Safe, isolated development adapter using realistic fictional creator records.
 * Used for local testing, integration tests, and fallback environments when no
 * external licensed provider credentials are configured.
 */
export class DevMockCreatorProvider implements CreatorDiscoveryProvider {
  public readonly providerName = "ugcfy_dev_mock";

  private rawCreators: RawExternalCreator[];

  constructor() {
    this.rawCreators = MOCK_INSTAGRAM_CREATORS.map((c) => ({
      rawUsername: c.instagramUsername,
      displayName: c.displayName,
      profileImageUrl: c.profileImageUrl,
      bio: c.bio,
      followersCount: c.followersCount,
      followingCount: c.followingCount,
      rawGender: c.creatorGender,
      rawCountry: c.country,
      rawState: c.state,
      rawCity: c.city,
      locationSource: "provider",
      locationConfidence: 0.95,
      rawNiches: c.niches,
      engagementRate: c.engagementRate,
      avgLikes: c.avgLikes,
      avgComments: c.avgComments,
      avgReelViews: c.avgReelViews,
      verified: c.verified,
      providerName: "ugcfy_dev_mock",
      providerCreatorId: c.id,
      rawPayload: {
        startingPrice: c.startingPrice,
        topReels: c.topReels,
      },
    }));
  }

  async searchCreators(filters: CreatorFilterParams): Promise<ProviderSearchResult> {
    let matches = [...this.rawCreators];

    // Follower boundaries
    if (typeof filters.minFollowers === "number") {
      matches = matches.filter(
        (c) => (c.followersCount ?? 0) >= (filters.minFollowers ?? 0)
      );
    }
    if (filters.maxFollowers !== null) {
      matches = matches.filter(
        (c) => (c.followersCount ?? 0) <= filters.maxFollowers!
      );
    }

    // Gender
    if (filters.gender) {
      matches = matches.filter((c) => c.rawGender === filters.gender);
    }

    // City / State
    if (filters.city) {
      matches = matches.filter(
        (c) => c.rawCity?.toLowerCase() === filters.city?.toLowerCase()
      );
    }
    if (filters.state) {
      matches = matches.filter(
        (c) => c.rawState?.toLowerCase() === filters.state?.toLowerCase()
      );
    }

    // Niches
    if (filters.niches && filters.niches.length > 0) {
      matches = matches.filter((c) =>
        filters.niches!.some((n) =>
          c.rawNiches?.some((rn) => rn.toLowerCase().includes(n.toLowerCase()))
        )
      );
    }

    // Engagement
    if (filters.minEngagementRate && filters.minEngagementRate > 0) {
      matches = matches.filter(
        (c) => (c.engagementRate ?? 0) >= filters.minEngagementRate!
      );
    }

    // Query string
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim().replace(/^@/, "");
      matches = matches.filter(
        (c) =>
          c.displayName?.toLowerCase().includes(q) ||
          c.rawUsername.toLowerCase().includes(q) ||
          c.bio?.toLowerCase().includes(q)
      );
    }

    return {
      creators: matches,
      totalAvailable: matches.length,
      hasMore: false,
    };
  }

  async getCreator(username: string): Promise<RawExternalCreator | null> {
    try {
      const normalized = normalizeInstagramUsername(username);
      const match = this.rawCreators.find(
        (c) => c.rawUsername.toLowerCase() === normalized
      );
      return match || null;
    } catch {
      return null;
    }
  }

  async refreshCreator(username: string): Promise<RawExternalCreator | null> {
    return this.getCreator(username);
  }
}
