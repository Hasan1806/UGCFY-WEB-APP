import "server-only";
import Razorpay from "razorpay";
import crypto from "crypto";

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

let razorpayInstance: Razorpay | null = null;

function getRazorpay() {
  if (!isRazorpayConfigured()) {
    throw new Error("Razorpay is not configured on the server.");
  }
  
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return razorpayInstance;
}

export async function createRazorpayOrder(amountInPaise: number, receiptId: string) {
  const instance = getRazorpay();
  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: receiptId,
  };

  return await instance.orders.create(options);
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!isRazorpayConfigured()) return false;
  
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}
