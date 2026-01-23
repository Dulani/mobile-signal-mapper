'use client';
import { useState } from 'react';
import { SignalLogger } from '@/components/dashboard/signal-logger';
import type { SignalData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { AuthRequired } from '@/components/auth-required';
import { Skeleton } from '@/components/ui/skeleton';

export default function LogSignalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastLoggedPoint, setLastLoggedPoint] = useState<Omit<SignalData, 'id' | 'userId'> | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const handleLogSignal = async (data: Omit<SignalData, 'id' | 'userId' | 'timestamp'>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not signed in',
        description: 'You must be signed in to log a signal point.',
      });
      return;
    }

    setIsSubmitting(true);
    
    const newPoint = {
      ...data,
      userId: user.uid,
      timestamp: new Date().getTime(),
    };

    try {
      const signalReadingsCol = collection(firestore, 'users', user.uid, 'signalReadings');
      addDocumentNonBlocking(signalReadingsCol, newPoint);
      
      setLastLoggedPoint(newPoint);
      toast({
        title: 'Success',
        description: 'Signal point logged successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error logging signal',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
        <div className="flex justify-center items-start p-4 md:p-8">
            <Skeleton className="w-full max-w-md h-96" />
        </div>
    );
  }

  if (!user) {
    return <AuthRequired />;
  }

  return (
    <div className="flex justify-center items-start p-4 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardDescription>
            Select the current signal strength and network type, then log your reading. Your location will be automatically recorded.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <SignalLogger onLogSignal={handleLogSignal} isSubmitting={isSubmitting} />
        </CardContent>
        {lastLoggedPoint && (
          <>
            <Separator className="my-4" />
            <CardFooter className="flex-col items-start gap-2 text-sm text-muted-foreground">
                <CardTitle className="text-lg mb-2">Last Point Logged</CardTitle>
                <p><strong>Date:</strong> {new Date(lastLoggedPoint.timestamp).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(lastLoggedPoint.timestamp).toLocaleTimeString()}</p>
                <p><strong>Location:</strong> {lastLoggedPoint.latitude.toFixed(5)}, {lastLoggedPoint.longitude.toFixed(5)}</p>
                <p><strong>Strength:</strong> {lastLoggedPoint.strength > 0 ? `${lastLoggedPoint.strength} / 4` : 'No Signal'}</p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
