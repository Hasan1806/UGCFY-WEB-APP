import { SearchProvider, SearchProviderOptions, SearchResultItem, SearchProviderError } from "./types";

/**
 * SearchApi.io Provider Implementation (https://www.searchapi.io)
 */
export class SearchApiProvider implements SearchProvider {
  readonly providerName = "searchapi";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, options: SearchProviderOptions = {}): Promise<SearchResultItem[]> {
    const timeoutMs = options.timeoutMs || 10_000;
    const page = options.page || 1;
    const num = options.num || 20;

    const url = new URL("https://www.searchapi.io/api/v1/search");
    url.searchParams.set("engine", "google");
    url.searchParams.set("q", query);
    url.searchParams.set("num", String(num));
    url.searchParams.set("page", String(page));
    url.searchParams.set("api_key", this.apiKey);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        if (response.status === 429) {
          throw new SearchProviderError(
            "PROVIDER_QUOTA_EXCEEDED",
            "Search API monthly search limit reached. Please upgrade your SearchApi.io plan.",
            this.providerName
          );
        }
        if (response.status === 401 || response.status === 403) {
          throw new SearchProviderError(
            "PROVIDER_AUTH_FAILED",
            "Search API authentication failed. Please check SEARCH_API_KEY.",
            this.providerName
          );
        }
        throw new SearchProviderError(
          "PROVIDER_UNAVAILABLE",
          `Search API returned HTTP ${response.status}: ${errorText.substring(0, 200)}`,
          this.providerName
        );
      }

      const data = await response.json();
      const organic = Array.isArray(data.organic_results) ? data.organic_results : [];

      return organic.map((item: Record<string, unknown>): SearchResultItem => ({
        title: typeof item.title === "string" ? item.title : "",
        link: typeof item.link === "string" ? item.link : "",
        snippet: typeof item.snippet === "string" ? item.snippet : "",
        displayedLink: typeof item.displayed_link === "string" ? item.displayed_link : "",
        query,
        sourceProvider: this.providerName,
        rawItem: item,
      }));
    } catch (error) {
      if (error instanceof SearchProviderError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new SearchProviderError("PROVIDER_TIMEOUT", `Search query timed out after ${timeoutMs}ms`, this.providerName);
      }
      throw new SearchProviderError("PROVIDER_UNAVAILABLE", error instanceof Error ? error.message : "Search provider network failure", this.providerName, error);
    } finally {
      clearTimeout(timer);
    }
  }
}

/**
 * Serper.dev Provider Implementation (https://serper.dev)
 */
export class SerperSearchProvider implements SearchProvider {
  readonly providerName = "serper";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, options: SearchProviderOptions = {}): Promise<SearchResultItem[]> {
    const timeoutMs = options.timeoutMs || 10_000;
    const page = options.page || 1;
    const num = options.num || 20;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "X-API-KEY": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: query,
          page,
          num,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new SearchProviderError("PROVIDER_QUOTA_EXCEEDED", "Serper API search limit reached.", this.providerName);
        }
        if (response.status === 401 || response.status === 403) {
          throw new SearchProviderError("PROVIDER_AUTH_FAILED", "Serper API authentication failed.", this.providerName);
        }
        throw new SearchProviderError("PROVIDER_UNAVAILABLE", `Serper returned HTTP ${response.status}`, this.providerName);
      }

      const data = await response.json();
      const organic = Array.isArray(data.organic) ? data.organic : [];

      return organic.map((item: Record<string, unknown>): SearchResultItem => ({
        title: typeof item.title === "string" ? item.title : "",
        link: typeof item.link === "string" ? item.link : "",
        snippet: typeof item.snippet === "string" ? item.snippet : "",
        displayedLink: typeof item.displayedLink === "string" ? item.displayedLink : "",
        query,
        sourceProvider: this.providerName,
        rawItem: item,
      }));
    } catch (error) {
      if (error instanceof SearchProviderError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new SearchProviderError("PROVIDER_TIMEOUT", `Search query timed out after ${timeoutMs}ms`, this.providerName);
      }
      throw new SearchProviderError("PROVIDER_UNAVAILABLE", error instanceof Error ? error.message : "Search provider network failure", this.providerName, error);
    } finally {
      clearTimeout(timer);
    }
  }
}

/**
 * SerpApi.com Provider Implementation (https://serpapi.com)
 */
export class SerpApiSearchProvider implements SearchProvider {
  readonly providerName = "serpapi";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, options: SearchProviderOptions = {}): Promise<SearchResultItem[]> {
    const timeoutMs = options.timeoutMs || 10_000;
    const page = options.page || 1;
    const num = options.num || 20;

    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google");
    url.searchParams.set("q", query);
    url.searchParams.set("num", String(num));
    url.searchParams.set("start", String((page - 1) * num));
    url.searchParams.set("api_key", this.apiKey);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new SearchProviderError("PROVIDER_QUOTA_EXCEEDED", "SerpApi search limit reached.", this.providerName);
        }
        if (response.status === 401 || response.status === 403) {
          throw new SearchProviderError("PROVIDER_AUTH_FAILED", "SerpApi authentication failed.", this.providerName);
        }
        throw new SearchProviderError("PROVIDER_UNAVAILABLE", `SerpApi returned HTTP ${response.status}`, this.providerName);
      }

      const data = await response.json();
      const organic = Array.isArray(data.organic_results) ? data.organic_results : [];

      return organic.map((item: Record<string, unknown>): SearchResultItem => ({
        title: typeof item.title === "string" ? item.title : "",
        link: typeof item.link === "string" ? item.link : "",
        snippet: typeof item.snippet === "string" ? item.snippet : "",
        displayedLink: typeof item.displayed_link === "string" ? item.displayed_link : "",
        query,
        sourceProvider: this.providerName,
        rawItem: item,
      }));
    } catch (error) {
      if (error instanceof SearchProviderError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new SearchProviderError("PROVIDER_TIMEOUT", `Search query timed out after ${timeoutMs}ms`, this.providerName);
      }
      throw new SearchProviderError("PROVIDER_UNAVAILABLE", error instanceof Error ? error.message : "Search provider network failure", this.providerName, error);
    } finally {
      clearTimeout(timer);
    }
  }
}

/**
 * Factory for creating the active search provider based on environment configuration.
 */
export class SearchProviderFactory {
  static getProvider(): SearchProvider {
    const apiKey = process.env.SEARCH_API_KEY?.trim();
    if (!apiKey) {
      throw new SearchProviderError(
        "PROVIDER_NOT_CONFIGURED",
        "SEARCH_API_KEY environment variable is not configured.",
        "unconfigured"
      );
    }

    const providerType = (process.env.SEARCH_API_PROVIDER?.trim().toLowerCase()) || "searchapi";

    if (providerType === "serper") {
      return new SerperSearchProvider(apiKey);
    }
    if (providerType === "serpapi") {
      return new SerpApiSearchProvider(apiKey);
    }
    // Default to SearchApi.io
    return new SearchApiProvider(apiKey);
  }
}
