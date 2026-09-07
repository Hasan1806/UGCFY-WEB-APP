import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { messageSchema } from "@/lib/validation/messages";
import { ZodError } from "zod";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const brandSession = await verifyBrand();
    if (!brandSession.ok) {
      return jsonError("UNAUTHENTICATED", brandSession.message || "Please login to continue.", 401);
    }
    if (!brandSession.brand) {
      return jsonError("BRAND_PROFILE_NOT_FOUND", "Brand profile not found.", 404);
    }

    const body = await req.json();
    const validatedData = messageSchema.parse(body);

    const supabase = await createClient();

    let threadId = validatedData.thread_id;

    // Create thread if it doesn't exist
    if (!threadId) {
      if (!validatedData.creator_id) {
        return jsonError("BAD_REQUEST", "creator_id is required if thread_id is missing", 400);
      }
      
      // Check if thread already exists
      const { data: existingThread } = await supabase
        .from("chat_threads")
        .select("id")
        .eq("brand_id", brandSession.brand.id)
        .eq("creator_id", validatedData.creator_id)
        .eq("campaign_id", validatedData.campaign_id || null)
        .limit(1)
        .single();
        
      if (existingThread) {
        threadId = existingThread.id;
      } else {
        const { data: newThread, error: threadError } = await supabase
          .from("chat_threads")
          .insert({
            brand_id: brandSession.brand.id,
            creator_id: validatedData.creator_id,
            campaign_id: validatedData.campaign_id || null,
          })
          .select("id")
          .single();
          
        if (threadError) {
          console.error("[supabase-form-error]", {
            message: threadError.message,
            code: threadError.code,
            details: threadError.details,
            hint: threadError.hint,
          });
          return jsonError("SUPABASE_INSERT_FAILED", threadError.message || "Failed to create thread", 500, {
            code: threadError.code,
            details: threadError.details,
            hint: threadError.hint,
          });
        }
        threadId = newThread.id;
      }
    }

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from("chat_messages")
      .insert({
        thread_id: threadId,
        sender_id: brandSession.user.id,
        sender_type: "brand",
        message: validatedData.message
      })
      .select()
      .single();

    if (messageError) {
      console.error("[supabase-form-error]", {
        message: messageError.message,
        code: messageError.code,
        details: messageError.details,
        hint: messageError.hint,
      });
      return jsonError("SUPABASE_INSERT_FAILED", messageError.message || "Failed to send message", 500, {
        code: messageError.code,
        details: messageError.details,
        hint: messageError.hint,
      });
    }
    
    // Update thread last_message_at
    await supabase
      .from("chat_threads")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", threadId);

    return jsonSuccess(message);
  } catch (err: unknown) {
    console.error("[form-api] unexpected error", err);
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", err.issues[0]?.message || "Validation failed", 400);
    }
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
