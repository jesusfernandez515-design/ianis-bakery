import { type User } from "firebase/auth";

// Only trusted Firebase custom claims grant administrative access.
// Never trust the customer-editable profile document for authorization.
export async function isAdministrator(user: User): Promise<boolean> {
  const { claims } = await user.getIdTokenResult();
  return claims.admin === true;
}
