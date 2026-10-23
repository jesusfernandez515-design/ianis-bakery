# Ianis Bakery payment integration

This release is **sandbox only**. No merchant account, credentials, real charges,
or tax registration is created by installing the code. RoadLink is not used.
Firebase Admin is pinned to 13.10.0 to avoid the jwks-rsa 4 / jose ESM loading
failure observed in the Vercel Node runtime with Admin 14.5.0. Its modules load
only for enabled payment operations, not the public availability check.

## Implemented

- Hosted Stripe Checkout; card details go directly to Stripe.
- Signed-in Firebase customer required, revoked/expired tokens rejected.
- Same-origin POST, bounded request/cart sizes, five new attempts per user per
  ten minutes, persisted idempotency across retries and back navigation.
- Server loads the Firestore catalog (seed fallback only when it is empty),
  calculates quantities, box flavors/premium extras and IANIS10 in cents.
  The current service is pickup only in Holiday, Florida, with no delivery fee;
  altered/legacy delivery requests are rejected by both Checkout and Firestore.
  Mismatched displayed totals are rejected rather than charged silently.
- Private checkoutAttempts documents bind server-quoted amount, order and session.
  Existing Firestore catch-all denies all client access to these and checkoutLimits.
- Raw-body signed webhook handles checkout.session.completed and
  checkout.session.async_payment_succeeded, plus checkout.session.expired and
  checkout.session.async_payment_failed, gated on status, exact amount,
  currency, session and environment. Transaction makes repeated events harmless.
- Test orders are clearly prefixed NO PREPARAR, status Cancelado, paymentStatus
  Prueba pendiente/Prueba pagada. They do not count as sales or active preparation.
  The return page subscribes to the customer's protected order record and shows
  verified pending/paid/failed/expired state. Cached data cannot confirm a payment.
  URL parameters never mark an order paid. Already-paid attempts cannot be reused;
  expired/failed attempts offer a fresh idempotent attempt on the next click.
  Admin preparation controls are disabled for sandbox orders; revenue/customer
  metrics exclude them independently of their delivery or payment labels.

## Connect the owner's sandbox later

The actual business owner creates/controls Stripe and supplies credentials via
the hosting platform's secure environment settings, never chat or source code.
Use a separate Ianis sandbox, not RoadLink's shared test environment.

Server-only variables (none use NEXT_PUBLIC):

| Variable | Purpose |
| --- | --- |
| PAYMENTS_MODE | Set to test only when the sandbox is ready |
| STRIPE_SECRET_KEY | Prefer restricted rk_test_ key with Checkout Session create/read, account read and inline product/price permissions required by Checkout |
| STRIPE_ACCOUNT_ID | Expected Ianis sandbox acct_ ID; API verifies the key targets it |
| STRIPE_WEBHOOK_SECRET | Signing secret for this endpoint and sandbox |
| FIREBASE_ADMIN_PROJECT_ID | Firebase project used by this deployment |
| FIREBASE_ADMIN_CLIENT_EMAIL | Server service account email |
| FIREBASE_ADMIN_PRIVATE_KEY | Server service account private key, least privilege for Auth token verification and Firestore |

Use a separate Firebase test project and preview deployment for sandbox exercises;
set its browser Firebase variables to the same project. Do not enable the sandbox
on the public production shop (VERCEL_ENV=production is explicitly blocked). Without every required variable, the button stays
disabled and the checkout/webhook routes return 503. Live keys are rejected even
if PAYMENTS_MODE is changed to live.

Webhook URL: https://YOUR-PREVIEW-HOST/api/stripe/webhook. Subscribe to all four events
above using the SDK API version (stripe-node 23.0.1: 2026-09-30.endive).
Verify valid/declined test cards, duplicate requests/events, delayed success,
expired sessions, changed catalog prices, cancellation and cross-user access.
Never use real card details for sandbox tests.

## Still required before live launch

This is not a live-payments launch. The owner must finish identity/bank verification,
confirm eligible home-bakery products, labeling, service area and tax obligations.
Then implement explicit live-mode order lifecycle and refunds/disputes;
separate real sales from unpaid checkout attempts.
Review transfer of the current site admin UID to the actual owner separately.
Configure and verify live webhook delivery and alerting, and perform the full
payment-to-order test in the owner's sandbox before approving live activation.
No automatic tax collection is enabled without verified registration/configuration.

## Local verification

With Node 22.6+ (Node 24 used during implementation):

```
node --conditions=react-server --experimental-strip-types --test tests/*.test.mjs
npx tsc --noEmit
npm run lint
npm run build
```

These tests use offline fixtures, not a connected Stripe sandbox. A real hosted
Checkout and webhook delivery exercise remains pending the owner's sandbox.
