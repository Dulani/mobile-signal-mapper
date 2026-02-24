'use client';
import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { SignalData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { AuthRequired } from '@/components/auth-required';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Heatmap = dynamic(() => import('@/components/dashboard/heatmap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

const MapView = dynamic(() => import('@/components/dashboard/map-view'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

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

  const [showLocation, setShowLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { position, getPosition } = useGeolocation();

  useEffect(() => {
    if (showLocation) {
      getPosition();
      const interval = setInterval(getPosition, 10000);
      return () => clearInterval(interval);
    }
  }, [showLocation, getPosition]);

  const userCoords = useMemo(() => {
    if (showLocation && position) {
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    }
    return null;
  }, [showLocation, position]);

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
      <div className="flex items-center justify-end space-x-4 mb-2">
          <div className="flex items-center space-x-2">
              <Switch
                id="show-map"
                checked={showMap}
                onCheckedChange={setShowMap}
              />
              <Label htmlFor="show-map" className="text-sm font-medium">Map Background</Label>
          </div>
          <div className="flex items-center space-x-2">
              <Switch
                id="show-location"
                checked={showLocation}
                onCheckedChange={setShowLocation}
              />
              <Label htmlFor="show-location" className="text-sm font-medium">Show My Location</Label>
          </div>
      </div>
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-0 relative min-h-0">
            {showMap ? (
                <MapView key="map-view" signalData={signalData} userLocation={userCoords} />
            ) : (
                <Heatmap key="chart-view" signalData={signalData} userLocation={userCoords} />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
