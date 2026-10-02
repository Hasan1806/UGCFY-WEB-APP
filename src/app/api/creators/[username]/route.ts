import { NextRequest, NextResponse } from "next/server";
import { UsernameParamSchema } from "@/lib/creators/validation";
import { CreatorSearchService } from "@/lib/creators/searchService";
import { normalizeInstagramUsername } from "@/lib/creators/normalization";

export const dynamic = "force-dynamic";

/**
 * GET /api/creators/[username]
 * 
 * Direct creator lookup endpoint.
 * Normalizes username, queries UGCFY index, and returns canonical creator representation.
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const parseResult = UsernameParamSchema.safeParse(resolvedParams);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username parameter",
        },
        { status: 400 }
      );
    }

    const { username } = parseResult.data;
    let normalized: string;

    try {
      normalized = normalizeInstagramUsername(username);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Malformed Instagram username format",
        },
        { status: 400 }
      );
    }

    const creator = await CreatorSearchService.getCreatorByUsername(normalized);

    if (!creator) {
      return NextResponse.json(
        {
          success: false,
          error: `Creator @${normalized} was not found in the UGCFY index`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        creator,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("[API /api/creators/[username]] Unhandled Error:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve creator profile",
      },
      { status: 500 }
    );
  }
}
