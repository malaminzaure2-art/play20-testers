import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// User's dedicated Firebase configuration (play20-testers)
export const DEFAULT_FIREBASE_CONFIG: FirebaseClientConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyB006b8CW5xpmtFs2pr6eNoHUUGs9upONg",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "play20-testers.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "play20-testers",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "play20-testers.firebasestorage.app",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "863559981616",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:863559981616:web:fe54d954e1a646c67debf5",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let isFirebaseLive = false;

export function initFirebase(customConfig?: Partial<FirebaseClientConfig>) {
  const config = {
    ...DEFAULT_FIREBASE_CONFIG,
    ...customConfig,
  };

  try {
    // Only initialize if we have actual valid-looking keys or to allow fallback
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    isFirebaseLive = true;
    return { app, auth, db, googleProvider, isLive: true };
  } catch (error) {
    console.warn("Running in enhanced client storage mode (Firebase fallback ready):", error);
    isFirebaseLive = false;
    return { app: null, auth: null, db: null, googleProvider: null, isLive: false };
  }
}

export function getFirebaseInstance() {
  if (!app) {
    return initFirebase();
  }
  return { app, auth, db, googleProvider, isLive: isFirebaseLive };
}

export const EXPORTED_FIREBASE_CONFIG_JS = `// firebase-config.js - Production Firebase 10+ Setup
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDocs, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "${DEFAULT_FIREBASE_CONFIG.apiKey}",
  authDomain: "${DEFAULT_FIREBASE_CONFIG.authDomain}",
  projectId: "${DEFAULT_FIREBASE_CONFIG.projectId}",
  storageBucket: "${DEFAULT_FIREBASE_CONFIG.storageBucket}",
  messagingSenderId: "${DEFAULT_FIREBASE_CONFIG.messagingSenderId}",
  appId: "${DEFAULT_FIREBASE_CONFIG.appId}"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut, collection, doc, setDoc, getDocs, updateDoc };
`;

export const EXPORTED_FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection rules
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Apps submitted for closed testing
    match /apps/{appId} {
      allow read: if true; // Publicly readable for testing explore grid
      allow create: if request.auth != null;
      allow update: if request.auth != null && (resource.data.ownerId == request.auth.uid || request.resource.data.currentTesters == resource.data.currentTesters + 1);
      allow delete: if request.auth != null && resource.data.ownerId == request.auth.uid;
    }
    
    // Testing tasks and daily proof submissions
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && (resource.data.userId == request.auth.uid || resource.data.appOwnerId == request.auth.uid);
    }
    
    // Feedback and anti-cheat proof submissions
    match /proofs/{proofId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null;
    }
  }
}
`;
