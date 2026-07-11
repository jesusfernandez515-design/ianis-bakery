import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "PEGA_AQUI_LA_API_KEY_REAL",

  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "PEGA_AQUI_EL_AUTH_DOMAIN_REAL",

  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    "PEGA_AQUI_EL_PROJECT_ID_REAL",

  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "PEGA_AQUI_EL_STORAGE_BUCKET_REAL",

  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    "PEGA_AQUI_EL_MESSAGING_SENDER_ID_REAL",

  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "PEGA_AQUI_EL_APP_ID_REAL",
};

const missingFirebaseConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value || value.includes("PEGA_AQUI"))
  .map(([key]) => key);

if (missingFirebaseConfig.length > 0) {
  throw new Error(
    `Faltan valores reales de Firebase: ${missingFirebaseConfig.join(", ")}`
  );
}

export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export default app;
