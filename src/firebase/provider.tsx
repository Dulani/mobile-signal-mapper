'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, type DependencyList } from 'react';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, getAuth, getRedirectResult } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { firebaseConfig } from '@/firebase/config';

// --- 1. Initialize Firebase Services ---
// This code runs once per client session when this module is first imported.
// Because this is a 'use client' file, this will not run on the server.
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// --- 2. Define Context and Provider ---
// The shape of the context value
export interface FirebaseContextState {
  auth: Auth;
  firestore: Firestore;
  firebaseApp: FirebaseApp;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true); // Start loading
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    // Process redirect result first, only needs to happen once.
    getRedirectResult(auth).catch((error) => {
      console.error("[FirebaseProvider] Error processing redirect result:", error);
      setUserError(error);
    });

    // The listener for auth state changes. This is the single source of truth for the user's state.
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsUserLoading(false);
      },
      (error) => {
        console.error("[FirebaseProvider] Auth state error:", error);
        setUser(null);
        setUserError(error);
        setIsUserLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({
    auth,
    firestore,
    firebaseApp,
    user,
    isUserLoading,
    userError,
  }), [user, isUserLoading, userError]);

  return (
    <FirebaseContext.Provider value={value}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};


// --- 3. Define Hooks ---
// Internal hook to get context and ensure it's not undefined
const useFirebaseContext = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
      throw new Error('useFirebase hooks must be used within a FirebaseProvider.');
    }
    return context;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Public hooks for accessing services and state
export const useFirebase = (): FirebaseContextState => useFirebaseContext();
export const useAuth = (): Auth => useFirebaseContext().auth;
export const useFirestore = (): Firestore => useFirebaseContext().firestore;
export const useFirebaseApp = (): FirebaseApp => useFirebaseContext().firebaseApp;
export const useUser = (): UserHookResult => {
    const { user, isUserLoading, userError } = useFirebaseContext();
    return { user, isUserLoading, userError };
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}
