// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
