import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrCUvH4jDLDIr9pLQcr-fEzPixHmR0jjg",
  authDomain: "ianis-bakery.firebaseapp.com",
  projectId: "ianis-bakery",
  storageBucket: "ianis-bakery.firebasestorage.app",
  messagingSenderId: "1033970694489",
  appId: "1:1033970694489:web:4c8a7bf325f558f1d7f448",
};

const app =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
