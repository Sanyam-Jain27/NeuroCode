import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAroYeBAauuoy7RlxlEdRD0Aa88dn2-0XY",
  authDomain: "neurocode-59bb3.firebaseapp.com",
  projectId: "neurocode-59bb3",
  storageBucket: "neurocode-59bb3.firebasestorage.app",
  messagingSenderId: "1046420148566",
  appId: "1:1046420148566:web:58bb44e31abbbf8aa306f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();