'use client';

import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { useAuth, useUser } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function getInitials(name: string | null | undefined): string {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}


export function AuthButton() {
  const auth = useAuth(); // Can be null on initial render
  const { user, isUserLoading } = useUser();

  const handleSignIn = () => {
    if (!auth) {
        console.error("[AuthButton] Auth service not available yet.");
        return;
    }
    console.log("[AuthButton] Initiating sign-in with Google Redirect");
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch((error) => {
      console.error('[AuthButton] Error initiating sign-in with Google Redirect', error);
    });
  };

  const handleSignOut = async () => {
    if (!auth) {
        console.error("[AuthButton] Auth service not available yet.");
        return;
    }
    try {
      console.log("[AuthButton] Signing out");
      await signOut(auth);
    } catch (error) {
      console.error('[AuthButton] Error signing out', error);
    }
  };

  // Wait until both user state is determined AND auth service is initialized
  if (isUserLoading || !auth) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (!user) {
    return (
      <Button onClick={handleSignIn} variant="outline">
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
