import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDkdQEKRmZXvUtnCMfgmK3I3P5DVNFuvYE",
  authDomain: "saralsystem.firebaseapp.com",
  projectId: "saralsystem",
  storageBucket: "saralsystem.firebasestorage.app",
  messagingSenderId: "59436472453",
  appId: "1:59436472453:web:62dccc7b08d487770e31ec",
  measurementId: "G-EFM6T9Z91P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
