import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { isRazorpayConfigured } from "@/lib/payments/razorpay";
import { isMockPaymentEnabled } from "@/lib/payments/paymentProvider";

function hasPaymentProvider() {
  if (isMockPaymentEnabled()) return true;
  return isRazorpayConfigured();
}

export async function POST(req: NextRequest) {
  try {
    const brandSession = await verifyBrand();
    if (!brandSession.ok) {
      return jsonError("UNAUTHENTICATED", brandSession.message || "Please login to continue.", 401);
    }

    const body = await req.json();
    const paymentId = typeof body.payment_id === "string" ? body.payment_id : "";
    
    // Razorpay fields
    const razorpayOrderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
    const razorpayPaymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
    const razorpaySignature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";

    // Mock fields
    const mockOrderId = typeof body.mock_order_id === "string" ? body.mock_order_id : "";
    const mockPaymentId = typeof body.mock_payment_id === "string" ? body.mock_payment_id : "";

    if (!paymentId) {
      return jsonError("VALIDATION_ERROR", "Payment tracking details are missing.", 400);
    }


    const { data: payment, error } = await supabaseAdmin
      .from("payments")
      .select("id, brand_id, campaign_id, status, provider_order_id, provider, transaction_id")
      .eq("id", paymentId)
      .eq("brand_id", brandSession.brand.id)
      .single();

    if (error || !payment) {
      return jsonError("PAYMENT_NOT_FOUND", "Payment not found for this brand.", 404);
    }

    if (!hasPaymentProvider()) {
      return jsonError(
        "PAYMENT_PROVIDER_NOT_CONFIGURED",
        "Payment gateway setup is required before payment verification can complete.",
        503
      );
    }

    if (isMockPaymentEnabled() && mockOrderId && mockPaymentId) {
      if (payment.provider !== "mock" && !payment.transaction_id) {
        // Allow if no provider is set but transaction_id matches for fallback
      }
      if (payment.provider_order_id !== mockOrderId && payment.transaction_id !== mockOrderId) {
        return jsonError("INVALID_PAYMENT", "Mock order ID mismatch.", 400);
      }

      const { error: mockUpdateError } = await supabaseAdmin
        .from("payments")
        .update({
          status: "paid",
          provider_payment_id: mockPaymentId,
          paid_at: new Date().toISOString(),
          funds_state: "held_for_campaign"
        })
        .eq("id", payment.id);

      if (mockUpdateError && mockUpdateError.code === 'PGRST204') {
        await supabaseAdmin
          .from("payments")
          .update({
            status: "paid"
          })
          .eq("id", payment.id);
      }

      if (payment.campaign_id) {
        const { error: campaignUpdateError } = await supabaseAdmin
          .from("campaigns")
          .update({
            status: "active",
            payment_status: "paid",
            payment_id: payment.id
          })
          .eq("id", payment.campaign_id);
          
        if (campaignUpdateError && campaignUpdateError.code === 'PGRST204') {
           await supabaseAdmin
            .from("campaigns")
            .update({
              status: "active",
              payment_status: "paid"
            })
            .eq("id", payment.campaign_id);
        }
      }

      return jsonSuccess({
        status: "paid",
        campaignStatus: "active",
        mock: true,
        message: "Mock payment verified successfully.",
        payment_id: payment.id,
        campaign_id: payment.campaign_id
      });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return jsonError("VALIDATION_ERROR", "Razorpay payment details are missing.", 400);
    }

    if (payment.provider_order_id !== razorpayOrderId && payment.transaction_id !== razorpayOrderId) {
      return jsonError("INVALID_PAYMENT", "Order ID mismatch.", 400);
    }

    const supabase = await createClient();
    const { data: verifyData, error: invokeError } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
        campaignId: payment.campaign_id,
        paymentIdRecord: payment.id
      }
    });

    if (invokeError || !verifyData || !verifyData.verified) {
      console.error("[payments/verify] Edge Function verification failed:", invokeError || verifyData?.error);
      
      // Mark payment failed
      await supabaseAdmin
        .from("payments")
        .update({ status: "failed" })
        .eq("id", payment.id);
        
      return jsonError("INVALID_SIGNATURE", "Payment signature verification failed.", 400);
    }

    return jsonSuccess({
      message: "Payment verified successfully.",
      payment_id: payment.id,
      campaign_id: payment.campaign_id
    });
  } catch (err) {
    console.error("[payments/verify] unexpected error", err);
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
