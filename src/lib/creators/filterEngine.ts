import { Creator, CreatorFilterState } from "@/types/creator";

export function formatFollowerCount(count?: number | null): string {
  if (typeof count !== "number" || isNaN(count) || count < 0) {
    return "N/A";
  }
  if (count >= 1000000) {
    const formatted = (count / 1000000).toFixed(count % 1000000 === 0 ? 0 : 1);
    return `${formatted}M`;
  }
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1);
    return `${formatted}K`;
  }
  return count.toLocaleString("en-IN");
}

export function formatNumberIndian(count?: number | null): string {
  if (typeof count !== "number" || isNaN(count)) return "0";
  return count.toLocaleString("en-IN");
}

export function filterAndSortCreators(
  creators: Creator[],
  filters: CreatorFilterState
): Creator[] {
  const result = creators.filter((creator) => {
    // 1. Search Query (matches username or displayName or bio or niches)
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim().replace(/^@/, "");
      const matchName = creator.displayName?.toLowerCase().includes(q) || false;
      const matchUsername = creator.instagramUsername.toLowerCase().includes(q);
      const matchBio = creator.bio?.toLowerCase().includes(q) || false;
      const matchNiches = creator.niches.some((n) => n.toLowerCase().includes(q));

      if (!matchName && !matchUsername && !matchBio && !matchNiches) {
        return false;
      }
    }

    // 2. Followers range
    const fCount = creator.followersCount ?? 0;
    if (filters.minFollowers !== null && fCount < filters.minFollowers) {
      return false;
    }
    if (filters.maxFollowers !== null && fCount > filters.maxFollowers) {
      return false;
    }

    // 3. Location: State
    if (filters.state) {
      if ((creator.state || "").toLowerCase() !== filters.state.toLowerCase()) {
        return false;
      }
    }

    // 4. Location: City
    if (filters.city) {
      if ((creator.city || "").toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
    }

    // 5. Niches (Multi-select: creator must include at least one selected niche)
    if (filters.niches && filters.niches.length > 0) {
      const hasMatchingNiche = filters.niches.some((selectedNiche) =>
        creator.niches.some(
          (cn) => cn.toLowerCase() === selectedNiche.toLowerCase()
        )
      );
      if (!hasMatchingNiche) {
        return false;
      }
    }

    // 6. Creator Gender
    if (filters.gender) {
      if (creator.creatorGender !== filters.gender) {
        return false;
      }
    }

    // 7. Minimum Engagement Rate
    if (filters.minEngagementRate !== null && filters.minEngagementRate > 0) {
      if ((creator.engagementRate ?? 0) < filters.minEngagementRate) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  result.sort((a, b) => {
    const fCountA = a.followersCount ?? 0;
    const fCountB = b.followersCount ?? 0;
    const erA = a.engagementRate ?? 0;
    const erB = b.engagementRate ?? 0;

    switch (filters.sort) {
      case "followers_desc":
        return fCountB - fCountA;
      case "followers_asc":
        return fCountA - fCountB;
      case "engagement_desc":
        return erB - erA;
      case "relevance":
      default:
        return erB * 0.6 + (fCountB / 100000) * 0.4 - (erA * 0.6 + (fCountA / 100000) * 0.4);
    }
  });

  return result;
}

export function getActiveFilterCount(filters: CreatorFilterState): number {
  let count = 0;
  if (filters.query.trim()) count += 1;
  if (filters.minFollowers !== 10000 || filters.maxFollowers !== null) count += 1;
  if (filters.state) count += 1;
  if (filters.city) count += 1;
  if (filters.niches.length > 0) count += filters.niches.length;
  if (filters.gender !== null) count += 1;
  if (filters.minEngagementRate !== null && filters.minEngagementRate > 0) count += 1;
  return count;
}
