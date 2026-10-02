export interface ApifyInstagramProfile {
  id?: string | undefined;
  username: string;
  fullName?: string | undefined;
  biography?: string | undefined;
  externalUrl?: string | undefined;
  followersCount?: number | undefined;
  followsCount?: number | undefined;
  postsCount?: number | undefined;
  highlightReelCount?: number | undefined;
  isBusinessAccount?: boolean | undefined;
  isVerified?: boolean | undefined;
  profilePicUrl?: string | undefined;
  profilePicUrlHD?: string | undefined;
  latestPosts?: Array<{
    id?: string | undefined;
    type?: string | undefined;
    caption?: string | undefined;
    likesCount?: number | undefined;
    commentsCount?: number | undefined;
    videoViewCount?: number | undefined;
    url?: string | undefined;
    displayUrl?: string | undefined;
    timestamp?: string | undefined;
  }> | undefined;
  calculatedEngagementRate?: number | undefined;
}

interface CacheEntry {
  profile: ApifyInstagramProfile;
  expiresAt: number;
}

const profileCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export class ApifyInstagramService {
  private static getApiToken(): string | null {
    return (
      process.env.APIFY_API_TOKEN?.trim() ||
      process.env.APIFY_TOKEN?.trim() ||
      null
    );
  }

  /**
   * Checks if Apify is configured with a valid API token
   */
  static isConfigured(): boolean {
    return Boolean(this.getApiToken());
  }

  /**
   * Scrapes live Instagram profiles via Apify actor (apify/instagram-profile-scraper)
   */
  static async getProfiles(usernames: string[]): Promise<ApifyInstagramProfile[]> {
    const token = this.getApiToken();
    if (!token) {
      console.warn("[apify:instagram] APIFY_API_TOKEN is not configured.");
      return [];
    }

    const cleanUsernames = usernames
      .map((u) => u.replace(/^@/, "").trim().toLowerCase())
      .filter(Boolean);

    if (cleanUsernames.length === 0) return [];

    // Check cached items
    const uncachedUsernames: string[] = [];
    const results: ApifyInstagramProfile[] = [];

    for (const u of cleanUsernames) {
      const cached = profileCache.get(u);
      if (cached && Date.now() < cached.expiresAt) {
        results.push(cached.profile);
      } else {
        uncachedUsernames.push(u);
      }
    }

    if (uncachedUsernames.length === 0) {
      return results;
    }

    const actorId = process.env.APIFY_ACTOR_ID || "apify~instagram-profile-scraper";
    const endpoint = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?token=${token}&timeout=60`;

    try {
      console.info("[apify:instagram] Scraping live profiles for:", uncachedUsernames);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 65_000);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          usernames: uncachedUsernames,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.warn(`[apify:instagram] Failed HTTP ${response.status}:`, errorText.slice(0, 300));
        return results;
      }

      const items = await response.json();
      if (!Array.isArray(items)) {
        return results;
      }

      for (const item of items) {
        const username = (item.username || item.input?.username || "").toLowerCase();
        if (!username) continue;

        const followers = item.followersCount ?? item.followers ?? null;
        const posts = Array.isArray(item.latestPosts) ? item.latestPosts : [];
        
        // Calculate dynamic engagement rate if available
        let calculatedEngagementRate: number | undefined;
        if (followers && followers > 0 && posts.length > 0) {
          const totalInteractions = posts.slice(0, 12).reduce((acc: number, p: any) => {
            return acc + (p.likesCount || 0) + (p.commentsCount || 0);
          }, 0);
          const avgPerPost = totalInteractions / Math.min(posts.length, 12);
          calculatedEngagementRate = Number(((avgPerPost / followers) * 100).toFixed(2));
        }

        const profile: ApifyInstagramProfile = {
          id: item.id,
          username,
          fullName: item.fullName || item.name || "",
          biography: item.biography || item.bio || "",
          externalUrl: item.externalUrl || item.website || "",
          followersCount: followers,
          followsCount: item.followsCount ?? item.following,
          postsCount: item.postsCount ?? item.posts,
          highlightReelCount: item.highlightReelCount,
          isBusinessAccount: item.isBusinessAccount,
          isVerified: item.isVerified ?? item.verified,
          profilePicUrl: item.profilePicUrlHD || item.profilePicUrl,
          profilePicUrlHD: item.profilePicUrlHD,
          latestPosts: posts.map((p: any) => ({
            id: p.id,
            type: p.type,
            caption: p.caption,
            likesCount: p.likesCount,
            commentsCount: p.commentsCount,
            videoViewCount: p.videoViewCount,
            url: p.url,
            displayUrl: p.displayUrl,
            timestamp: p.timestamp,
          })),
          calculatedEngagementRate,
        };

        profileCache.set(username, {
          profile,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });

        results.push(profile);
      }

      return results;
    } catch (err: any) {
      console.warn("[apify:instagram:error]", err?.message || err);
      return results;
    }
  }

  /**
   * Scrapes a single profile by username
   */
  static async getSingleProfile(username: string): Promise<ApifyInstagramProfile | null> {
    const profiles = await this.getProfiles([username]);
    return profiles[0] || null;
  }
}
