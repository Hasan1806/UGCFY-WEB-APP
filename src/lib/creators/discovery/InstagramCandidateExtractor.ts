import { InstagramCandidate, InstagramSearchEvidence, SearchResultItem } from "./types";

const REJECTED_PATH_PREFIXES = new Set([
  "p",
  "reel",
  "reels",
  "stories",
  "explore",
  "accounts",
  "direct",
  "about",
  "developer",
  "tv",
  "tags",
  "share",
  "feed",
  "directory",
  "legal",
  "help",
  "privacy",
  "download",
  "press",
  "blog",
  "terms",
  "login",
  "signup",
]);

export class InstagramCandidateExtractor {
  /**
   * Extracts and normalizes an Instagram profile username from a raw URL.
   * Returns null if the URL is not a valid creator profile page.
   */
  static extractUsernameFromUrl(rawUrl: string): string | null {
    if (!rawUrl || typeof rawUrl !== "string") return null;

    try {
      // Clean leading and trailing artifacts
      const cleaned = rawUrl.trim().replace(/^https?:\/\/(?:www\.)?instagram\.com\/?/i, "https://www.instagram.com/");
      const parsed = new URL(cleaned);

      if (!parsed.hostname.toLowerCase().includes("instagram.com")) {
        return null;
      }

      // Path breakdown: e.g. /rahulfitness/ or /rahulfitness
      const pathParts = parsed.pathname.split("/").map((s) => s.trim()).filter(Boolean);
      if (pathParts.length === 0) return null;

      const firstSegment = pathParts[0]?.toLowerCase();
      if (!firstSegment) return null;

      // Reject non-profile route prefixes
      if (REJECTED_PATH_PREFIXES.has(firstSegment)) {
        return null;
      }

      // Valid Instagram username: 1-30 characters, alphanumeric, underscores, dots
      const cleanUsername = firstSegment.replace(/^@+/, "");
      if (!/^[a-zA-Z0-9._]{1,30}$/.test(cleanUsername)) {
        return null;
      }

      return cleanUsername;
    } catch {
      // Regex fallback for partially malformed links
      const match = rawUrl.match(/(?:instagram\.com\/)([a-zA-Z0-9._]{1,30})/i);
      if (match && match[1]) {
        const user = match[1].toLowerCase();
        if (!REJECTED_PATH_PREFIXES.has(user)) {
          return user;
        }
      }
      return null;
    }
  }

  /**
   * Processes raw search results across all queries, extracts Instagram profile candidates,
   * deduplicates by normalized username, and aggregates search evidence.
   */
  static extractCandidates(searchResults: SearchResultItem[]): InstagramCandidate[] {
    const candidateMap = new Map<string, InstagramCandidate>();

    for (const item of searchResults) {
      const username = this.extractUsernameFromUrl(item.link);
      if (!username) continue;

      const normalized = username.toLowerCase();
      const profileUrl = `https://www.instagram.com/${normalized}/`;

      const evidence: InstagramSearchEvidence = {
        url: item.link,
        title: item.title,
        snippet: item.snippet || "",
        query: item.query,
        sourceProvider: item.sourceProvider,
      };

      const existing = candidateMap.get(normalized);
      if (existing) {
        // Append additional evidence if not already present
        const hasUrl = existing.evidenceList.some((e) => e.url === item.link);
        if (!hasUrl) {
          existing.evidenceList.push(evidence);
        }
      } else {
        candidateMap.set(normalized, {
          rawUsername: username,
          normalizedUsername: normalized,
          profileUrl,
          evidenceList: [evidence],
        });
      }
    }

    return Array.from(candidateMap.values());
  }
}
