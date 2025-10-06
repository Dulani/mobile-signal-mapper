'use client';
import { useState, useEffect } from 'react';
import { getSignalPoints } from '@/lib/actions';
import type { SignalData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { LeafletHeatmap } from '@/components/dashboard/leaflet-heatmap';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="h-full w-full p-4">
      <Card className="h-full w-full overflow-hidden">
        <CardContent className="p-0 h-full">
            {isLoading ? (
                <Skeleton className="w-full h-full" />
            ) : (
                <LeafletHeatmap signalData={signalData} />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
