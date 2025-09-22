
// src/hooks/use-auth.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  reload,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface UserProfile extends User {
  referrer?: {
    id: string;
    username: string;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailAndPassword: (email: string, password: string, fullName: string, referrerId?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userDocData = userDocSnap.data();
          let referrerData;

          if (userDocData.referrerId) {
            const referrerDocRef = doc(db, 'users', userDocData.referrerId);
            const referrerDocSnap = await getDoc(referrerDocRef);
            if (referrerDocSnap.exists()) {
              const referrer = referrerDocSnap.data();
              referrerData = {
                id: referrerDocSnap.id,
                username: referrer.displayName,
              };
            }
          }

          setUser({ ...user, ...userDocData, ...(referrerData && { referrer: referrerData }) });
        } else {
          // This case might happen for users created before the users collection was implemented
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await firebaseSignInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email and password:', error);
      throw error;
    }
  };

  const signUpWithEmailAndPassword = async (email: string, password: string, fullName: string, referrerId?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Now, create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        ...(referrerId && { referrerId }),
      });

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName });
        // Manually update the user state after profile update
        await reload(auth.currentUser);
        // onAuthStateChanged will handle setting the user state
      }
    } catch (error) {
       console.error('Error signing up with email and password:', error);
       throw error;
    }
  };


  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, signUpWithEmailAndPassword, signInWithEmailAndPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
