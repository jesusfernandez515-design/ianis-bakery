# Firebase release requirements

The admin UI now requires the trusted Firebase Authentication custom claim
`admin: true`. Customer-editable documents never grant administrator access.
Set this claim for the existing verified owner UID using a trusted Firebase
Admin environment, then refresh the owner's session. Do not grant it based
on a submitted email or a customer profile's `role` field.

The UI gate does not replace Firestore rules. Existing production rules could
not be inspected or deployed from the connected GitHub/Vercel tools. Before
calling the shop fully verified:

- restrict catalog writes and order updates/reads to trusted admin claims;
- allow customers to read only orders whose `customerId` matches their UID;
- permit guest order creation only with validated fields and pending status;
- keep customer profile fields such as role/points protected;
- validate prices and coupons on a trusted backend before collecting payments;
- verify survey submission and order acknowledgement against the real database.

Payments remain unconfigured and disabled. No card charge has been introduced.
Local build verification uses isolated Firebase fixture values, never production
credentials. Customer order history only links new orders made while signed in;
legacy guest orders cannot safely be assigned from a phone/name match.
