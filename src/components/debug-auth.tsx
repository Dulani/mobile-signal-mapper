'use client';

import { useUser, useAuth } from '@/firebase/provider';
import { useEffect, useState } from 'react';

export function DebugAuth() {
  const { user, isUserLoading, userError } = useUser();
  const auth = useAuth();
  const [realtimeUser, setRealtimeUser] = useState<string | null>('init');

  useEffect(() => {
    // Poll the direct auth instance to see if it disagrees with our React state
    const interval = setInterval(() => {
      setRealtimeUser(auth?.currentUser ? auth.currentUser.email : 'null');
    }, 1000);
    return () => clearInterval(interval);
  }, [auth]);

  if (process.env.NODE_ENV === 'production') return null; // Only show in dev

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-green-400 font-mono text-xs rounded border border-green-500 z-50 pointer-events-none">
      <h3 className="font-bold border-b border-green-500 mb-2">Auth Debugger</h3>
      <p>React State User: {user ? user.email : 'NULL'}</p>
      <p>React Loading: {isUserLoading ? 'YES' : 'NO'}</p>
      <p>React Error: {userError ? userError.message : 'NONE'}</p>
      <div className="h-px bg-gray-700 my-2"></div>
      <p>SDK Direct User: {realtimeUser}</p>
      <p>Auth Initialized: {auth ? 'YES' : 'NO'}</p>
    </div>
  );
}
