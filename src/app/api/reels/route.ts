import { NextRequest, NextResponse } from "next/server";
import { getPlaybookReels, getPlaybookBoards, getPlaybookDownloadUrl } from "@/lib/playbook/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 100;
    const needBoards = searchParams.get("include_boards") === "true";

    const options: { boardToken?: string; limit?: number } = { limit };
    const boardParam = searchParams.get("board");
    if (boardParam) {
      options.boardToken = boardParam;
    }

    const [reels, boards] = await Promise.all([
      getPlaybookReels(options),
      needBoards ? getPlaybookBoards() : Promise.resolve([]),
    ]);

    return NextResponse.json({
      success: true,
      count: reels.length,
      data: reels,
      boards: needBoards ? boards : undefined,
    });
  } catch (error: any) {
    console.error("[API /api/reels] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reels" },
      { status: 500 }
    );
  }
}
