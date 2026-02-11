'use client';

// This component is now a simple pass-through to FirebaseProvider.
// It ensures that any component importing FirebaseClientProvider
// will now get the self-initializing FirebaseProvider,
// creating a single, clear entry point for client-side Firebase logic.
export { FirebaseProvider as FirebaseClientProvider } from '@/firebase/provider';
