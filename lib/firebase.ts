import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "PEGA_AQUI_LA_API_KEY_EXACTA_DE_FIREBASE",
  authDomain: "PEGA_AQUI_EL_AUTH_DOMAIN",
  projectId: "PEGA_AQUI_EL_PROJECT_ID",
  storageBucket: "PEGA_AQUI_EL_STORAGE_BUCKET",
  messagingSenderId: "PEGA_AQUI_EL_MESSAGING_SENDER_ID",
  appId: "PEGA_AQUI_EL_APP_ID",
};

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
