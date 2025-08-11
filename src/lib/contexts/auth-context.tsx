'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, AuthContextType } from '@/lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get or create user document in Firestore
        const userDoc = await getUserDocument(firebaseUser);
        setUser(userDoc);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    // Force account selection prompt for multiple Google accounts
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateDisplayName = async (newDisplayName: string) => {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName
      });

      // Update user document in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        displayName: newDisplayName
      }, { merge: true });

      // Update local user state
      if (user) {
        setUser({
          ...user,
          displayName: newDisplayName
        });
      }
    } catch (error) {
      console.error('Update display name error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateDisplayName }}>
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

async function getUserDocument(firebaseUser: FirebaseUser): Promise<User> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: firebaseUser.uid, ...userSnap.data() } as User;
  } else {
    // Create new user document
    const newUser: Omit<User, 'id'> = {
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      createdAt: Timestamp.now(),
    };

    await setDoc(userRef, newUser);
    
    return { id: firebaseUser.uid, ...newUser };
  }
}