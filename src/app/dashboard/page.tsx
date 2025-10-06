'use client';
import { useState, useEffect } from 'react';
import { getSignalPoints } from '@/lib/actions';
import type { SignalData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { SimpleHeatmap } from '@/components/dashboard/simple-heatmap';

export default function DashboardPage() {
  const [signalData, setSignalData] = useState<SignalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getSignalPoints();
      setSignalData(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="relative h-full">
      {isLoading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Skeleton className="w-full h-full" />
        </div>
      ) : (
        <SimpleHeatmap signalData={signalData} />
      )}
    </div>
  );
}
