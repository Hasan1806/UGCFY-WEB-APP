import { NextResponse } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ensureConversationForCampaignCreator } from "@/lib/collaboration/ensureConversation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const brandSession = await verifyBrand();

  if (!brandSession?.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Auth session missing.",
        },
      },
      { status: 401 }
    );
  }

  try {
    const { campaign_id, creator_id } = await req.json();

    if (!campaign_id || !creator_id) {
      return NextResponse.json(
        { ok: false, error: "Missing campaign_id or creator_id" },
        { status: 400 }
      );
    }

    // 3. Confirm campaign belongs to verified brand
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from("campaigns")
      .select("id, title")
      .eq("id", campaign_id)
      .eq("brand_id", brandSession.brand.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "CAMPAIGN_NOT_FOUND",
            message: "Campaign not found."
          }
        },
        { status: 404 }
      );
    }

    // 4. Confirm creator exists
    const { data: creator, error: creatorError } = await supabaseAdmin
      .from("creator_profiles")
      .select("id, display_name, full_name")
      .eq("id", creator_id)
      .single();

    if (creatorError || !creator) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "CREATOR_NOT_FOUND",
            message: "Creator not found."
          }
        },
        { status: 404 }
      );
    }

    // Determine fallback title
    const creatorName = creator.display_name || creator.full_name || "Creator";
    const title = `${campaign.title} + ${creatorName}`;

    // 5. Call ensureConversationForCampaignCreator
    const conversation = await ensureConversationForCampaignCreator({
      brandId: brandSession.brand.id,
      campaignId: campaign_id,
      creatorId: creator_id,
      title: title,
    });

    // 6. Return
    return NextResponse.json({
      ok: true,
      data: {
        conversation_id: conversation.id,
      }
    });

  } catch (err: unknown) {
    const error = err as Record<string, unknown>;
    console.error("[Collaboration Start] Failed:", {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      stack: error?.stack,
    });
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to start collaboration" } },
      { status: 500 }
    );
  }
}
