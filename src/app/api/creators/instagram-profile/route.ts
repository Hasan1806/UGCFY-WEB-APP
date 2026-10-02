import { NextRequest, NextResponse } from "next/server";
import { ApifyInstagramService } from "@/lib/creators/discovery/ApifyInstagramService";

export const dynamic = "force-dynamic";

/**
 * GET /api/creators/instagram-profile?username=thepunefoodie
 * 
 * Fetches real-time Instagram profile, metrics, bio, and recent posts via Apify.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json(
      { success: false, error: "Username query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const profile = await ApifyInstagramService.getSingleProfile(username);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Instagram profile not found or unavailable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("[api:instagram-profile:error]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch Instagram profile" },
      { status: 500 }
    );
  }
}
