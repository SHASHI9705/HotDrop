import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOk8dYHQjap02V3WMkdx0Fq1iSQwukOXg",
  authDomain: "on-time-f0c31.firebaseapp.com",
  projectId: "on-time-f0c31",
  storageBucket: "on-time-f0c31.firebasestorage.app",
  messagingSenderId: "287950873372",
  appId: "1:287950873372:web:94e06b62f36028b4c2d0d9",
  measurementId: "G-E6019W85SQ"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
