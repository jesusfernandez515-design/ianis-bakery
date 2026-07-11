import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const requiredEnvironmentVariables = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
};

const missingVariables = Object.entries(requiredEnvironmentVariables)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVariables.length > 0) {
  throw new Error(
    `Faltan variables de Firebase: ${missingVariables.join(", ")}`
  );
}

if (!requiredEnvironmentVariables.apiKey?.startsWith("AIza")) {
  throw new Error(
    "NEXT_PUBLIC_FIREBASE_API_KEY no contiene una Web API Key válida de Firebase."
  );
}

const firebaseConfig = {
  apiKey: requiredEnvironmentVariables.apiKey,
  authDomain: requiredEnvironmentVariables.authDomain,
  projectId: requiredEnvironmentVariables.projectId,
  storageBucket: requiredEnvironmentVariables.storageBucket,
  messagingSenderId:
    requiredEnvironmentVariables.messagingSenderId,
  appId: requiredEnvironmentVariables.appId,
};

export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

function createFirestore() {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    return getFirestore(app);
  }
}

export const db = createFirestore();

export default app;
