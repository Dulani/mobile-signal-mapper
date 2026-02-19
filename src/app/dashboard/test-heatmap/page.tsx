'use client';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { SignalData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Heatmap = dynamic(() => import('@/components/dashboard/heatmap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

const mockData: SignalData[] = [
  { id: '1', userId: 'user1', latitude: 34.0522, longitude: -118.2437, strength: 4, network: 'Verizon', timestamp: Date.now() },
  { id: '2', userId: 'user1', latitude: 34.0622, longitude: -118.2537, strength: 3, network: 'AT&T', timestamp: Date.now() - 1000 },
  { id: '3', userId: 'user1', latitude: 34.0422, longitude: -118.2337, strength: 2, network: 'T-Mobile', timestamp: Date.now() - 2000 },
  { id: '4', userId: 'user1', latitude: 34.0522, longitude: -118.2637, strength: 1, network: 'Other', timestamp: Date.now() - 3000 },
  { id: '5', userId: 'user1', latitude: 34.0722, longitude: -118.2437, strength: 0, network: 'Verizon', timestamp: Date.now() - 4000 },
];

export default function TestHeatmapPage() {
  return (
    <div className="p-4 space-y-8">
      <Card className="w-full h-[500px]">
        <CardHeader>
          <CardTitle>Heatmap Test with Mock Data</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] p-0 relative">
          <Heatmap signalData={mockData} />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Empty Data Test</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] p-0 relative">
          <Heatmap signalData={[]} />
        </CardContent>
      </Card>
    </div>
  );
}
