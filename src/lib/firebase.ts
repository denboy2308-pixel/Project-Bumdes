import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJSF9BoNjhQ-ZtYbEIil2CPPHzOLr_4qQ",
  authDomain: "abiding-extension-46rpq.firebaseapp.com",
  projectId: "abiding-extension-46rpq",
  storageBucket: "abiding-extension-46rpq.firebasestorage.app",
  messagingSenderId: "894481508076",
  appId: "1:894481508076:web:72f645542336172a28e7c9",
  firestoreDatabaseId: "ai-studio-bumdeswaskitawij-dfced928-5064-49e4-9c45-517f8559469f"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID and robust long-polling connection settings
let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  // If already initialized, retrieve existing instance
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreInstance;

export default app;
