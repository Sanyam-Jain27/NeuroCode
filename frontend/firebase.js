import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider
} from "firebase/auth";

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

// Avoid IndexedDB bug (Database is closing/hidden) by using browserLocalPersistence
// and provide browserPopupRedirectResolver to prevent auth/argument-error
export const auth = initializeAuth(app, {
  persistence: [browserLocalPersistence, browserSessionPersistence, inMemoryPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });