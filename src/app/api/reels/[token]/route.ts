import { NextRequest, NextResponse } from "next/server";
import { getPlaybookDownloadUrl } from "@/lib/playbook/client";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const rawUrl = await getPlaybookDownloadUrl(token);
    if (!rawUrl) {
      return NextResponse.json({ error: "Video url not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, url: rawUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
