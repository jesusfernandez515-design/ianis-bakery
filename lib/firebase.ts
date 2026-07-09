import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrCUvH4jDLDIr9pLQcr-fEzPixHmR0jjg",
  authDomain: "ianis-bakery.firebaseapp.com",
  projectId: "ianis-bakery",
  storageBucket: "ianis-bakery.firebasestorage.app",
  messagingSenderId: "1033970694489",
  appId: "1:1033970694489:web:4c8a7bf325f558f1d7f448",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;
