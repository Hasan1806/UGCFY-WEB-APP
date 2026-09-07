import { NextResponse } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brandSession = await verifyBrand();

    if (!brandSession.ok) {
      return NextResponse.json(
        { ok: false, error: brandSession.message },
        { status: 401 }
      );
    }

    const { data: conversationsData, error } = await supabaseAdmin
      .from("conversations")
      .select("*")
      .eq("brand_id", brandSession.brand.id)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { 
          ok: false, 
          error: { code: "CONVERSATIONS_FETCH_FAILED", message: "Could not load conversations." }
        }, 
        { status: 500 }
      );
    }

    const conversations = conversationsData || [];

    // Fetch campaigns
    const campaignIds = Array.from(new Set(conversations.map(c => c.campaign_id).filter(Boolean))) as string[];
    const campaignsMap: Record<string, { id: string; title: string | null }> = {};
    if (campaignIds.length > 0) {
      const { data: campaigns } = await supabaseAdmin
        .from("campaigns")
        .select("id, title")
        .in("id", campaignIds);
      
      campaigns?.forEach(c => {
        campaignsMap[c.id] = c;
      });
    }

    // Fetch creators
    const creatorIds = Array.from(new Set(conversations.map(c => c.creator_id).filter(Boolean))) as string[];
    const creatorsMap: Record<string, { id: string; full_name: string | null; display_name: string | null; avatar_url: string | null }> = {};
    if (creatorIds.length > 0) {
      const { data: creators } = await supabaseAdmin
        .from("creator_profiles")
        .select("id, full_name, display_name, avatar_url")
        .in("id", creatorIds);
      
      creators?.forEach(c => {
        creatorsMap[c.id] = c;
      });
    }

    // Enrich conversations
    const enriched = conversations.map(c => {
      const campaign = c.campaign_id ? campaignsMap[c.campaign_id] : null;
      const creator = c.creator_id ? creatorsMap[c.creator_id] : null;
      
      const creatorName = creator ? (creator.display_name || creator.full_name) : null;
      const campaignTitle = campaign ? campaign.title : null;

      let computedTitle = c.title;
      if (campaignTitle && creatorName) {
        computedTitle = `${campaignTitle} + ${creatorName}`;
      } else if (campaignTitle) {
        computedTitle = campaignTitle;
      } else if (creatorName) {
        computedTitle = `Creator conversation (${creatorName})`;
      } else if (!computedTitle || computedTitle === "New Collaboration") {
        computedTitle = "Collaboration";
      }

      return {
        id: c.id,
        title: computedTitle,
        campaign_id: c.campaign_id,
        campaign_title: campaignTitle,
        creator_id: c.creator_id,
        creator_name: creatorName,
        creator_avatar_url: creator ? creator.avatar_url : null,
        last_message: c.last_message,
        last_message_at: c.last_message_at,
        status: c.status,
        created_at: c.created_at,
      };
    });

    return NextResponse.json({ ok: true, data: { conversations: enriched } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json({ ok: false, error: "CRASH: " + message, stack: stack }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const body = await request.json().catch(() => ({}));

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : "Test collaboration";

    const { data, error } = await supabaseAdmin
      .from("conversations")
      .insert({
        brand_id: brandSession.brand.id,
        campaign_id: body.campaign_id || null,
        creator_id: body.creator_id || null,
        title,
        status: "active",
      })
      .select("*")
      .single();

    if (error) {
      console.error("[Collaboration] Create conversation failed:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "CONVERSATION_CREATE_FAILED",
            message: "Could not start conversation.",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        conversation: {
          ...data,
          campaign_title: null,
          creator_name: null,
          creator_avatar_url: null,
        },
      },
    });
  } catch (error) {
    console.error("[Collaboration] Create conversation crashed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "CONVERSATION_CREATE_CRASHED",
          message: "Could not start conversation.",
        },
      },
      { status: 500 }
    );
  }
}
