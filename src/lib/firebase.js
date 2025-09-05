import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDkdQEKRmZXvUtnCMfgmK3I3P5DVNFuvYE",
  authDomain: "saralsystem.firebaseapp.com",
  projectId: "saralsystem",
  storageBucket: "saralsystem.appspot.com",
  messagingSenderId: "59436472453",
  appId: "1:59436472453:web:62dccc7b08d487770e31ec",
  measurementId: "G-EFM6T9Z91P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics and expose helper only in the browser
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);

  // Optional: ensure local persistence for auth state
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Ignore persistence errors (e.g., private mode)
  });

  // Expose a helper to fetch the ID token from DevTools: await window.getIdToken()
  // Default forceRefresh=true to ensure the latest token is returned
  window.getIdToken = async (forceRefresh = true) => {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  };
}

export { analytics };
export default app;
