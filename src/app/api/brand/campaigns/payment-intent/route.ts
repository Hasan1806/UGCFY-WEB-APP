import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
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
    const campaignId = typeof body.campaign_id === "string" ? body.campaign_id : "";

    if (!campaignId) {
      return jsonError("VALIDATION_ERROR", "Campaign id is required.", 400);
    }

    const supabase = await createClient();
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id, brand_id, title, budget, currency, status, payment_status")
      .eq("id", campaignId)
      .eq("brand_id", brandSession.brand.id)
      .single();

    if (campaignError || !campaign) {
      return jsonError("CAMPAIGN_NOT_FOUND", "Campaign not found for this brand.", 404);
    }

    if (campaign.payment_status !== "pending") {
      return jsonError("PAYMENT_NOT_REQUIRED", "Campaign payment is not pending.", 400);
    }

    const amount = Number(campaign.budget);
    if (!Number.isFinite(amount) || amount <= 0) {
      return jsonError("VALIDATION_ERROR", "Campaign budget must be greater than zero.", 400);
    }

    let payment = null;

    try {
      const { data: existingPayment } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("brand_id", brandSession.brand.id)
        .eq("campaign_id", campaign.id)
        .eq("status", "pending")
        .maybeSingle();

      if (existingPayment) {
        payment = existingPayment;
      } else {
        const { data: insertedPayment, error: paymentError } = await supabaseAdmin
          .from("payments")
          .insert({
            brand_id: brandSession.brand.id,
            campaign_id: campaign.id,
            amount,
            currency: campaign.currency || "INR",
            purpose: "campaign_funding",
            status: "pending",
            funds_state: "held_for_campaign"
          })
          .select()
          .single();

        if (paymentError) {
          if (paymentError.code === 'PGRST204') {
            const { data: fallbackPayment, error: fallbackError } = await supabaseAdmin
              .from("payments")
              .insert({
                brand_id: brandSession.brand.id,
                campaign_id: campaign.id,
                amount,
                commission: 0,
                currency: campaign.currency || "INR",
                status: "pending",
                transaction_id: `payment_${Date.now()}`
              })
              .select()
              .single();
              
            if (fallbackError) {
              console.error("[payment-intent] fallback payments insert failed:", fallbackError);
              return jsonError("PAYMENT_RECORD_FAILED", "Unable to create campaign payment record.", 500);
            }
            payment = fallbackPayment;
          } else {
            console.error("[payment-intent] payments insert failed:", paymentError);
            return jsonError("PAYMENT_RECORD_FAILED", "Unable to create campaign payment record.", 500);
          }
        } else {
          payment = insertedPayment;
        }
      }
    } catch (err) {
      console.error("[payment-intent] pending payment handled error", err);
      return jsonError("PAYMENT_RECORD_FAILED", "Unable to create campaign payment record.", 500);
    }

    if (!hasPaymentProvider()) {
      return jsonError(
        "PAYMENT_PROVIDER_NOT_CONFIGURED",
        "Payment gateway is not configured yet.",
        503
      );
    }

    try {
      if (isMockPaymentEnabled()) {
        const mockOrderId = `mock_order_${Date.now()}`;
        
        if (payment) {
          const { error: updateError } = await supabaseAdmin
            .from("payments")
            .update({
              provider: "mock",
              provider_order_id: mockOrderId,
            })
            .eq("id", payment.id);
            
          if (updateError && updateError.code === 'PGRST204') {
            await supabaseAdmin
              .from("payments")
              .update({
                transaction_id: mockOrderId,
              })
              .eq("id", payment.id);
          }
            
          payment.provider = "mock";
          payment.provider_order_id = mockOrderId;
        }

        return jsonSuccess(
          {
            provider: "mock",
            campaignId: campaign.id,
            paymentId: payment ? payment.id : undefined,
            orderId: mockOrderId,
            amount,
            currency: campaign.currency || "INR",
            mock: true,
          },
          200
        );
      }

      const amountInPaise = Math.round(amount * 100);
      const receiptId = payment ? `payment_${payment.id}` : `campaign_${campaign.id}`;
      
      const { data: orderData, error: invokeError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: amountInPaise,
          currency: campaign.currency || "INR",
          receipt: receiptId
        }
      });

      if (invokeError || !orderData || orderData.error) {
        console.error("[payment-intent] Edge Function invoke failed:", invokeError || orderData?.error);
        return jsonError("PAYMENT_PROVIDER_ERROR", "Failed to create payment order with provider.", 500);
      }

      const razorpayOrder = orderData;

      // Save the provider details to the payment record
      if (payment) {
        const { error: updateError } = await supabaseAdmin
          .from("payments")
          .update({
            provider: "razorpay",
            provider_order_id: razorpayOrder.id,
          })
          .eq("id", payment.id);
          
        if (updateError && updateError.code === 'PGRST204') {
          await supabaseAdmin
            .from("payments")
            .update({
              transaction_id: razorpayOrder.id,
            })
            .eq("id", payment.id);
        }
          
        payment.provider = "razorpay";
        payment.provider_order_id = razorpayOrder.id;
      }

      return jsonSuccess(
        {
          provider: "razorpay",
          campaignId: campaign.id,
          paymentId: payment ? payment.id : undefined,
          orderId: razorpayOrder.id,
          amount: amountInPaise,
          currency: razorpayOrder.currency || "INR",
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        },
        200
      );
    } catch (err) {
      console.error("[payment-intent] provider error", err);
      return jsonError("PAYMENT_PROVIDER_ERROR", "Failed to create payment order with provider.", 500);
    }
  } catch (err) {
    console.error("[payment-intent] unexpected error", err);
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
