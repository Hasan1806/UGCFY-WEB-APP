import { Creator, CreatorSearchFilters } from "../types";
import { GeminiEnrichedCreator, InstagramCandidate, ValidatedCreatorResult } from "./types";
import { normalizeInstagramUsername, buildInstagramProfileUrl } from "../normalization";

export class CreatorEvidenceValidator {
  /**
   * Validates enriched creator data against search criteria and strictly partitions
   * into exact matches vs potential matches without hallucination.
   */
  static validateCreator(
    enriched: GeminiEnrichedCreator,
    candidate: InstagramCandidate,
    filters: CreatorSearchFilters
  ): ValidatedCreatorResult {
    const unverifiedFields: string[] = [];
    const matchReasons: string[] = [];

    const username = normalizeInstagramUsername(enriched.instagramUsername);
    const now = new Date().toISOString();

    const creator: Creator = {
      id: `ig:${username}`,
      instagramUsername: username,
      instagramUsernameNormalized: username,
      instagramProfileUrl: buildInstagramProfileUrl(username),
      displayName: enriched.displayName || null,
      profileImageUrl: enriched.profileImageUrl || null,
      bio: enriched.bio || null,
      followersCount: enriched.followersCount,
      followingCount: enriched.followingCount,
      creatorGender: enriched.creatorGender,
      country: enriched.country || "India",
      state: enriched.state,
      city: enriched.city,
      countryNormalized: (enriched.country || "india").toLowerCase(),
      stateNormalized: enriched.state ? enriched.state.toLowerCase() : null,
      cityNormalized: enriched.city ? enriched.city.toLowerCase() : null,
      locationSource: enriched.evidence.locationSupported ? "inferred" : "unknown",
      locationConfidence: enriched.confidence,
      primaryNiche: enriched.primaryNiche,
      niches: enriched.niches,
      engagementRate: enriched.engagementRate,
      avgLikes: null,
      avgComments: null,
      avgReelViews: null,
      verified: false,
      dataSource: "public_search_discovery",
      sourceCreatorId: username,
      rawMetadata: {
        evidence: enriched.evidence,
        sourceCount: candidate.evidenceList.length,
        sources: candidate.evidenceList,
      },
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now,
      startingPrice: null,
      topReels: [],
    };

    let isExactMatch = true;

    // 1. Follower Filter Validation
    if (filters.minFollowers !== null || filters.maxFollowers !== null) {
      if (creator.followersCount === null) {
        isExactMatch = false;
        unverifiedFields.push("followers");
      } else {
        const min = filters.minFollowers ?? 0;
        const max = filters.maxFollowers ?? Infinity;
        if (creator.followersCount < min || creator.followersCount > max) {
          isExactMatch = false;
          unverifiedFields.push("followers_out_of_bounds");
        } else {
          matchReasons.push("followers_verified");
        }
      }
    }

    // 2. City Location Validation
    if (filters.city) {
      const targetCity = filters.city.trim().toLowerCase();
      const creatorCity = (creator.city || "").toLowerCase();
      if (!creatorCity || !creatorCity.includes(targetCity)) {
        isExactMatch = false;
        unverifiedFields.push("city");
      } else {
        matchReasons.push("city_verified");
      }
    }

    // 3. State Location Validation
    if (filters.state) {
      const targetState = filters.state.trim().toLowerCase();
      const creatorState = (creator.state || "").toLowerCase();
      if (!creatorState || !creatorState.includes(targetState)) {
        // If city is verified and city belongs to state, allow it
        if (!matchReasons.includes("city_verified")) {
          isExactMatch = false;
          unverifiedFields.push("state");
        }
      } else {
        matchReasons.push("state_verified");
      }
    }

    // 4. Niche Validation
    if (filters.niches.length > 0) {
      const targetNiches = filters.niches.map((n) => n.toLowerCase());
      const creatorNiches = [creator.primaryNiche, ...creator.niches]
        .filter(Boolean)
        .map((n) => String(n).toLowerCase());

      const hasNicheMatch = targetNiches.some((t) => creatorNiches.some((c) => c.includes(t)));
      if (!hasNicheMatch) {
        isExactMatch = false;
        unverifiedFields.push("niche");
      } else {
        matchReasons.push("niche_verified");
      }
    }

    // 5. Gender Validation
    if (filters.gender && (filters.gender as string) !== "any" && filters.gender !== "unspecified") {
      if (creator.creatorGender !== filters.gender) {
        isExactMatch = false;
        unverifiedFields.push("gender");
      } else {
        matchReasons.push("gender_verified");
      }
    }

    // 6. Engagement Rate Validation
    if (filters.minEngagementRate !== null) {
      if (creator.engagementRate === null || creator.engagementRate < filters.minEngagementRate) {
        isExactMatch = false;
        unverifiedFields.push("engagement");
      } else {
        matchReasons.push("engagement_verified");
      }
    }

    return {
      creator,
      isExactMatch,
      matchReasons,
      unverifiedFields,
      sources: candidate.evidenceList,
    };
  }
}
