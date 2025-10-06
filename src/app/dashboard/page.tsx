'use client';
import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getSignalPoints } from '@/lib/actions';
import type { SignalData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const [signalData, setSignalData] = useState<SignalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamically import the Heatmap component only on the client side
  const Heatmap = useMemo(() => dynamic(() => import('@/components/dashboard/heatmap').then(mod => mod.Heatmap), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }), []);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getSignalPoints();
      setSignalData(data);
      setIsLoading(false);
    }
    loadData();
  }, []);


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

  if (signalData.length === 0) {
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
    <div className="h-full w-full p-4">
      <Card className="h-full w-full overflow-hidden">
        <CardContent className="p-0 h-full">
            <Heatmap signalData={signalData} />
        </CardContent>
      </Card>
    </div>
  );
}
