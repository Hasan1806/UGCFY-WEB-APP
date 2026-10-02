export interface PlaybookAsset {
  id: number;
  token: string;
  title: string;
  media_type: string;
  original_extension: string;
  primary_width?: number;
  primary_height?: number;
  size?: number;
  collection_token?: string;
  collection_sort?: number;
  created_at: string;
  display_url?: string;
  raw_url?: string;
  stream_url?: string | null;
  thumbnails?: Array<{
    url: string;
    width: number;
    height: number;
    format: string;
  }>;
  uploaded_by?: {
    token: string;
    name: string;
  };
}

export interface PlaybookBoard {
  title: string;
  token: string;
  assets_count?: number;
}

const PLAYBOOK_API_KEY = process.env.PLAYBOOK_API_KEY || "gPfbffRiy-6FHUxG5Xm8gBn14BAV9klsjllMTVoHeks";
const PLAYBOOK_ORG_SLUG = process.env.PLAYBOOK_ORG_SLUG || "creator-navigator";
const BASE_URL = "https://api.playbook.com/v1";

// In-memory cache with TTL
const cache: {
  boards?: { data: PlaybookBoard[]; expires: number };
  assetsByBoard: Record<string, { data: PlaybookAsset[]; expires: number }>;
  downloadUrls: Record<string, { url: string; expires: number }>;
} = {
  assetsByBoard: {},
  downloadUrls: {},
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getPlaybookBoards(): Promise<PlaybookBoard[]> {
  const now = Date.now();
  if (cache.boards && cache.boards.expires > now) {
    return cache.boards.data;
  }

  try {
    const res = await fetch(`${BASE_URL}/${PLAYBOOK_ORG_SLUG}/collections`, {
      headers: {
        Authorization: `Bearer ${PLAYBOOK_API_KEY}`,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch boards: ${res.statusText}`);
    }

    const json = await res.json();
    const boards: PlaybookBoard[] = (json.data || []).map((b: any) => ({
      title: b.title,
      token: b.token,
      assets_count: b.assets_count,
    }));

    cache.boards = { data: boards, expires: now + CACHE_TTL_MS };
    return boards;
  } catch (err) {
    console.error("[Playbook] getPlaybookBoards error:", err);
    return [];
  }
}

export async function getPlaybookDownloadUrl(assetToken: string): Promise<string | null> {
  const now = Date.now();
  if (cache.downloadUrls[assetToken] && cache.downloadUrls[assetToken].expires > now) {
    return cache.downloadUrls[assetToken].url;
  }

  try {
    const res = await fetch(`${BASE_URL}/${PLAYBOOK_ORG_SLUG}/assets/${assetToken}/download`, {
      headers: {
        Authorization: `Bearer ${PLAYBOOK_API_KEY}`,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    const rawUrl = json.data?.raw_url || json.data?.display_url || null;

    if (rawUrl) {
      cache.downloadUrls[assetToken] = { url: rawUrl, expires: now + 3600 * 1000 };
    }

    return rawUrl;
  } catch (err) {
    console.error(`[Playbook] getPlaybookDownloadUrl for ${assetToken} error:`, err);
    return null;
  }
}

export async function getPlaybookReels(options?: {
  boardToken?: string;
  limit?: number;
}): Promise<PlaybookAsset[]> {
  const now = Date.now();
  const boardToken = options?.boardToken || "fawvfzAFzUNYskeUnsn8K1Fq"; // default: Video Ads Inspiration By CN

  const cacheKey = `${boardToken}_${options?.limit || 100}`;
  if (cache.assetsByBoard[cacheKey] && cache.assetsByBoard[cacheKey].expires > now) {
    return cache.assetsByBoard[cacheKey].data;
  }

  try {
    let url = `${BASE_URL}/${PLAYBOOK_ORG_SLUG}/assets?collection_token=${boardToken}&nested_assets=true&page_items=${options?.limit || 100}`;
    if (boardToken === "all") {
      url = `${BASE_URL}/${PLAYBOOK_ORG_SLUG}/assets?page_items=${options?.limit || 100}`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${PLAYBOOK_API_KEY}`,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch assets: ${res.statusText}`);
    }

    const json = await res.json();
    const rawAssets = json.data || [];

    // Filter to videos and maintain exact sequence from Playbook
    const videoAssets: PlaybookAsset[] = rawAssets.filter((a: any) =>
      a.media_type?.includes("video") ||
      a.original_extension?.match(/\.(mp4|mov|webm|m4v|ogg)/i) ||
      a.title?.match(/\.(mp4|mov|webm|m4v|ogg)/i)
    );

    // Concurrently pre-resolve download raw_urls for top batch
    await Promise.all(
      videoAssets.slice(0, 30).map(async (v) => {
        if (!v.raw_url) {
          const url = await getPlaybookDownloadUrl(v.token);
          if (url) v.raw_url = url;
        }
      })
    );

    cache.assetsByBoard[cacheKey] = { data: videoAssets, expires: now + CACHE_TTL_MS };
    return videoAssets;
  } catch (err) {
    console.error("[Playbook] getPlaybookReels error:", err);
    return [];
  }
}
