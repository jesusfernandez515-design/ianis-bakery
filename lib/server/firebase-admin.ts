import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export function adminServices() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) throw new Error("Payment database is not configured");
  // Separate app from the public browser SDK, never trust client-supplied identity.
  const app = getApps().find(app => app.name === "payments") || initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) }, "payments");
  return { db: getFirestore(app), auth: getAuth(app) };
}
