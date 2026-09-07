import { NextResponse } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    return NextResponse.json(
      { ok: false, error: brandSession.message },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const conversation_id = searchParams.get("conversation_id");

  if (!conversation_id) {
    return NextResponse.json(
      { ok: false, error: "Missing conversation_id" },
      { status: 400 }
    );
  }


  // Validate conversation belongs to brand
  const { data: conv, error: convError } = await supabaseAdmin
    .from("conversations")
    .select("id")
    .eq("id", conversation_id)
    .eq("brand_id", brandSession.brand.id)
    .single();

  if (convError || !conv) {
    return NextResponse.json(
      { ok: false, error: "Conversation not found" },
      { status: 404 }
    );
  }

  // Fetch messages
  const { data, error } = await supabaseAdmin
    .from("conversation_messages")
    .select("*")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[Messages API] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, data: { messages: data || [] } });
}

export async function POST(req: Request) {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    return NextResponse.json(
      { ok: false, error: brandSession.message },
      { status: 401 }
    );
  }

  try {
    const { conversation_id, body } = await req.json();

    if (!conversation_id || !body || typeof body !== "string" || body.trim() === "") {
      return NextResponse.json(
        { ok: false, error: "Invalid conversation_id or empty body" },
        { status: 400 }
      );
    }

    if (body.length > 2000) {
      return NextResponse.json(
        { ok: false, error: "Message too long (max 2000 chars)" },
        { status: 400 }
      );
    }



    // Validate conversation belongs to brand
    const { data: conv, error: convError } = await supabaseAdmin
      .from("conversations")
      .select("id")
      .eq("id", conversation_id)
      .eq("brand_id", brandSession.brand.id)
      .single();

    if (convError || !conv) {
      return NextResponse.json(
        { ok: false, error: "Conversation not found" },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // Insert message
    const { data: message, error: messageError } = await supabaseAdmin
      .from("conversation_messages")
      .insert({
        conversation_id,
        brand_id: brandSession.brand.id,
        sender_type: "brand",
        sender_id: brandSession.brand.id,
        body: body.trim(),
        created_at: now,
      })
      .select()
      .single();

    if (messageError) {
      console.error("[Messages API] POST insert error:", messageError);
      return NextResponse.json(
        { ok: false, error: "Failed to send message" },
        { status: 500 }
      );
    }

    // Update conversation last_message
    await supabaseAdmin
      .from("conversations")
      .update({
        last_message: body.trim(),
        last_message_at: now,
        updated_at: now,
      })
      .eq("id", conversation_id);

    return NextResponse.json({ ok: true, data: { message } });
  } catch (error) {
    console.error("[Messages API] POST body error:", error);
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
