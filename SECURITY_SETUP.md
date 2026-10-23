# Firebase release requirements

The admin UI and firestore.rules grant access only to the owner UID
verified in Firebase Authentication: cFUbzmlXsvVUDMWPzNiCuOpKjTx1.
Keep both files synchronized. Customer-editable documents never grant access.

The UI gate does not replace Firestore rules. The existing rules were inspected in the Firebase console. Replacement rules
passed 23 local emulator checks and were published with owner confirmation on 2026-10-22. Before
calling the shop fully verified:

- restrict catalog writes and order updates/reads to trusted admin claims;
- allow customers to read only orders whose `customerId` matches their UID;
- permit guest order creation only with validated fields and pending status;
- keep customer profile fields such as role/points protected;
- the new sandbox Checkout endpoint validates prices/coupons on the server;
  manual pending orders still originate in the browser and must never be charged
  by trusting their client-supplied totals;
- verify survey submission and order acknowledgement against the real database.

Payments remain unconfigured and disabled. The sandbox-only Stripe integration
is prepared; see PAYMENTS_SETUP.md for secure configuration and launch gaps.
No live charge capability has been enabled. New checkoutAttempts/checkoutLimits
collections are server-only under the existing catch-all deny rule.
Local build verification uses isolated Firebase fixture values, never production
credentials. Customer order history only links new orders made while signed in;
legacy guest orders cannot safely be assigned from a phone/name match.

# Password recovery

Customers and administrators can request a Firebase-hosted password reset from
/forgot-password. Existing and unknown addresses receive the same generic notice.
The form never collects passwords and does not log addresses or recovery links.
There is a duplicate-request guard and a 60-second resend cooldown in the UI;
Firebase's server-side quotas remain responsible for abuse protection.

Local Auth emulator verification (no real email or production account changed):

```
firebase emulators:exec --only auth --project demo-ianis-auth --config tests/firebase-auth-emulator.json "node --experimental-strip-types --test tests/password-recovery.emulator.mjs"
```

The test creates a fixture user, requests a reset, checks that a missing address
gets the same notice, applies the emulator-only code, and verifies the old
password fails and the new one works. Real inbox delivery/template appearance
still require a separately authorized check with the business owner's account.
