import { NextRequest, NextResponse } from "next/server";
import { CreatorSearchQuerySchema } from "@/lib/creators/validation";
import { CreatorDiscoveryService } from "@/lib/creators/discovery/CreatorDiscoveryService";
import { SearchProviderError, GeminiEnrichmentError } from "@/lib/creators/discovery/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/creators/search
 * 
 * Main creator search route routing to real-web discovery pipeline.
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const rawBody = await req.json().catch(() => ({}));

    // 1. Strict Request Validation
    const parseResult = CreatorSearchQuerySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_SEARCH_FILTERS",
            message: "Invalid creator search filters.",
          },
        },
        { status: 400 }
      );
    }

    const filters = parseResult.data;

    // 2. Discover real creators
    const searchResponse = await CreatorDiscoveryService.discover(filters);

    return NextResponse.json(searchResponse, {
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
              message: "Search API monthly limit reached. Please upgrade your plan.",
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
    }

    if (error instanceof GeminiEnrichmentError && error.code === "GEMINI_QUOTA_EXCEEDED") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "GEMINI_QUOTA_EXCEEDED",
            message: "AI analysis quota reached. Please try again shortly.",
          },
        },
        { status: 429 }
      );
    }

    console.error("[creator-search:error]", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CREATOR_SEARCH_FAILED",
          message: error instanceof Error ? error.message : "Unable to load creators.",
        },
      },
      { status: 500 }
    );
  }
}
