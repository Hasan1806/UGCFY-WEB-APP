export function getPaymentProvider() {
  return process.env.PAYMENT_PROVIDER || "razorpay";
}

export function isMockPaymentEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.MOCK_PAYMENTS_ENABLED === "true" &&
    process.env.PAYMENT_PROVIDER === "mock"
  );
}
