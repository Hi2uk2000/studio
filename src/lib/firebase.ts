// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "homehub-h97un",
  "appId": "1:749554713648:web:8da5cda8d910941650d9f5",
  "storageBucket": "homehub-h97un.firebasestorage.app",
  "apiKey": "AIzaSyCovLqzYiqWTMGTfxwI47gi2NQtvzbA2w0",
  "authDomain": "homehub-h97un.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "749554713648"
};

// Initialize Firebase
/**
 * The initialized Firebase app instance.
 * It ensures that Firebase is initialized only once.
 * @type {import('firebase/app').FirebaseApp}
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * The Firebase Auth instance.
 * @type {import('firebase/auth').Auth}
 */
const auth = getAuth(app);

export { app, auth };
