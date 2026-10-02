import { NextRequest, NextResponse } from "next/server";
import { CreatorSearchQuerySchema } from "@/lib/creators/validation";
import { CreatorDiscoveryService } from "@/lib/creators/discovery/CreatorDiscoveryService";
import { SearchProviderError, GeminiEnrichmentError } from "@/lib/creators/discovery/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/creators/discover
 * 
 * Real Instagram Creator Discovery via Public Web Search + Gemini Analysis.
 * Decoupled from database/mock stores. Returns verified exact matches and potential matches.
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const rawBody = await req.json().catch(() => ({}));

    // 1. Strict Request Validation via Zod
    const parseResult = CreatorSearchQuerySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_SEARCH_FILTERS",
            message: "Invalid creator search filters.",
            details: parseResult.error.issues.map((i) => i.message).join(", "),
          },
        },
        { status: 400 }
      );
    }

    const filters = parseResult.data;

    // 2. Execute Real Web Creator Discovery
    const result = await CreatorDiscoveryService.discover(filters);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Response-Time-Ms": `${Date.now() - startTime}`,
      },
    });
  } catch (error: unknown) {
    if (error instanceof SearchProviderError) {
      if (error.code === "PROVIDER_QUOTA_EXCEEDED") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "SEARCH_QUOTA_EXCEEDED",
              message: "Search API monthly limit reached. Please upgrade or configure a fresh SEARCH_API_KEY.",
            },
          },
          { status: 429 }
        );
      }
      if (error.code === "PROVIDER_AUTH_FAILED" || error.code === "PROVIDER_NOT_CONFIGURED") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "SEARCH_PROVIDER_AUTH_ERROR",
              message: "Search API key is unconfigured or unauthorized.",
            },
          },
          { status: 401 }
        );
      }
      if (error.code === "PROVIDER_TIMEOUT") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "SEARCH_TIMEOUT",
              message: "Public web search timed out. Please try again.",
            },
          },
          { status: 504 }
        );
      }
    }

    if (error instanceof GeminiEnrichmentError) {
      if (error.code === "GEMINI_QUOTA_EXCEEDED") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "GEMINI_QUOTA_EXCEEDED",
              message: "AI analysis quota exceeded. Please try again in a moment.",
            },
          },
          { status: 429 }
        );
      }
    }

    console.error("[creator-discover:error]", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CREATOR_DISCOVERY_FAILED",
          message: error instanceof Error ? error.message : "Unable to discover creators.",
        },
      },
      { status: 500 }
    );
  }
}
