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
- validate prices and coupons on a trusted backend before collecting payments;
- verify survey submission and order acknowledgement against the real database.

Payments remain unconfigured and disabled. No card charge has been introduced.
Local build verification uses isolated Firebase fixture values, never production
credentials. Customer order history only links new orders made while signed in;
legacy guest orders cannot safely be assigned from a phone/name match.
