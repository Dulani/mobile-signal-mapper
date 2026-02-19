'use client';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { SignalData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { AuthRequired } from '@/components/auth-required';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const signalPointsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'signalReadings'),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: signalData, isLoading: isDataLoading } = useCollection<SignalData>(signalPointsQuery);

  const Heatmap = useMemo(() => dynamic(() => import('@/components/dashboard/heatmap'), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }), []);

  const isLoading = isUserLoading || (user && isDataLoading);

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <Card className="h-full w-full overflow-hidden">
          <CardContent className="p-0 h-full">
            <Skeleton className="w-full h-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <AuthRequired />;
  }

  if (!signalData || signalData.length === 0) {
    return (
       <div className="h-full w-full p-4">
        <Card className="h-full w-full overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <p className="text-muted-foreground">No signal data logged yet. Start logging to see your heatmap!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100svh-4rem)] w-full p-4 overflow-hidden">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-0 relative min-h-0">
            <Heatmap signalData={signalData} />
        </CardContent>
      </Card>
    </div>
  );
}
