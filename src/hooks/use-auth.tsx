
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
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailAndPassword: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides an authentication context to its children.
 * It manages the user's authentication state, including the current user and loading status.
 * It also provides functions for signing in, signing up, and signing out.
 *
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The AuthProvider component.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /**
   * Signs in the user with Google.
   * @returns {Promise<void>}
   */
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  /**
   * Signs in the user with email and password.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<void>}
   */
  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await firebaseSignInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email and password:', error);
      throw error;
    }
  };

  /**
   * Signs up the user with email, password, and full name.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} fullName - The user's full name.
   * @returns {Promise<void>}
   */
  const signUpWithEmailAndPassword = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName });
        // Manually update the user state after profile update
        await reload(auth.currentUser);
        setUser({ ...auth.currentUser });
      }
    } catch (error) {
       console.error('Error signing up with email and password:', error);
       throw error;
    }
  };


  /**
   * Signs out the current user.
   * @returns {Promise<void>}
   */
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

/**
 * A custom hook to access the authentication context.
 * It must be used within an AuthProvider.
 * @returns {AuthContextType} The authentication context.
 * @throws {Error} If used outside of an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
