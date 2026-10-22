import { type User } from "firebase/auth";

// Verified against Firebase Authentication in project ianis-bakery.
// Keep this owner UID synchronized with firestore.rules. Profile roles never grant access.
export const OWNER_UID = "cFUbzmlXsvVUDMWPzNiCuOpKjTx1";
export async function isAdministrator(user: User): Promise<boolean> {
  return user.uid === OWNER_UID;
}
