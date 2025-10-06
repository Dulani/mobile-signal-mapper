'use client';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';
import { getSignalPoints } from '@/lib/actions';
import type { SignalData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { LatLngExpression, Map } from 'leaflet';

const getDotColor = (strength: number) => {
  switch (strength) {
    case 1: return 'red';
    case 2: return 'orange';
    case 3: return 'yellow';
    case 4: return 'green';
    default: return 'grey';
  }
};

export default function DashboardPage() {
  const [signalData, setSignalData] = useState<SignalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getSignalPoints();
      setSignalData(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const center: LatLngExpression = [34.0522, -118.2437]; // Default center

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
            <MapContainer
              center={center}
              zoom={10}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              whenCreated={mapInstance => { mapRef.current = mapInstance; }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {signalData.map((point) => (
                <CircleMarker
                  key={point.id}
                  center={[point.latitude, point.longitude]}
                  radius={8}
                  pathOptions={{ 
                    color: getDotColor(point.strength),
                    fillColor: getDotColor(point.strength),
                    fillOpacity: 0.7
                   }}
                >
                  <Tooltip>
                    Strength: {point.strength}/4 <br />
                    Network: {point.network} <br />
                    Logged: {new Date(point.timestamp).toLocaleString()}
                  </Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>
        </CardContent>
      </Card>
    </div>
  );
}
