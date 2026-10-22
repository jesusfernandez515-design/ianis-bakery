import "server-only";
import Stripe from "stripe";

export function paymentsConfigured() {
  // This release deliberately supports sandbox payments only.
  return process.env.VERCEL_ENV !== "production" && process.env.PAYMENTS_MODE === "test" &&
    /^(rk|sk)_test_/.test(process.env.STRIPE_SECRET_KEY || "") &&
    Boolean(process.env.STRIPE_ACCOUNT_ID?.startsWith("acct_") && process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_") &&
      process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY);
}
export function stripeClient() {
  if (!paymentsConfigured()) throw new Error("Sandbox payments are not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { maxNetworkRetries: 2, timeout: 15000 });
}
export async function verifiedStripeClient() {
  const stripe = stripeClient();
  const account = await stripe.accounts.retrieveCurrent();
  if (account.id !== process.env.STRIPE_ACCOUNT_ID) throw new Error("Unexpected Stripe account");
  return stripe;
}
