'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, type DependencyList } from 'react';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, getAuth, getRedirectResult } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { firebaseConfig } from '@/firebase/config';

// Define the shape of the services that will be created
interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// The shape of the context value, including services and auth state
export interface FirebaseContextState {
  services: FirebaseServices | null; // Services are nullable until client-side mount
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // state for the services - they are only initialized on the client.
  const [services, setServices] = useState<FirebaseServices | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after the first render.
    // This is the safe place to initialize Firebase.
    let app: FirebaseApp;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    const authInstance = getAuth(app);
    const firestoreInstance = getFirestore(app);

    // Store the initialized services in state
    setServices({ firebaseApp: app, auth: authInstance, firestore: firestoreInstance });

    // Process redirect result. This is crucial for mobile auth.
    getRedirectResult(authInstance).catch((error) => {
      console.error("[FirebaseProvider] Error processing redirect result:", error);
      setUserError(error);
    });

    // The listener for auth state changes. This is the single source of truth for the user's state.
    const unsubscribe = onAuthStateChanged(
      authInstance,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsUserLoading(false); // Auth state is now determined
      },
      (error) => {
        console.error("[FirebaseProvider] Auth state error:", error);
        setUser(null);
        setUserError(error);
        setIsUserLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  const value = useMemo(() => ({
    services,
    user,
    isUserLoading,
    userError,
  }), [services, user, isUserLoading, userError]);

  return (
    <FirebaseContext.Provider value={value}>
      {/* The error listener should only be active when services are ready */}
      {services && <FirebaseErrorListener />}
      {children}
    </FirebaseContext.Provider>
  );
};


// --- Define Hooks ---
const useFirebaseContext = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
      throw new Error('useFirebase hooks must be used within a FirebaseProvider.');
    }
    return context;
};

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Public hooks for accessing services and state. They can return null on the server.
export const useAuth = (): Auth | null => useFirebaseContext().services?.auth ?? null;
export const useFirestore = (): Firestore | null => useFirebaseContext().services?.firestore ?? null;
export const useFirebaseApp = (): FirebaseApp | null => useFirebaseContext().services?.firebaseApp ?? null;
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
