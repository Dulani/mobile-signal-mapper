'use client';

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';
import type { SignalData } from '@/lib/data';

interface MapViewProps {
  signalData: SignalData[];
}

const getPinColor = (strength: number) => {
  switch (strength) {
    case 1: return '#ef4444'; // red-500
    case 2: return '#f59e0b'; // amber-500
    case 3: return '#84cc16'; // lime-500
    case 4: return '#22c55e'; // green-500
    default: return '#6b7280'; // gray-500
  }
};

export function MapView({ signalData }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-lg font-semibold">Google Maps API Key is missing.</p>
          <p className="text-sm text-muted-foreground">
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
          </p>
        </div>
      </div>
    );
  }

  const center = signalData.length > 0 
    ? { lat: signalData[0].latitude, lng: signalData[0].longitude }
    : { lat: 34.0522, lng: -118.2437 };

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={13}
        mapId="signalmapper-map"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        className="h-full w-full"
      >
        {signalData.map((point) => (
          <AdvancedMarker
            key={point.id}
            position={{ lat: point.latitude, lng: point.longitude }}
            title={`Strength: ${point.strength}/4\nNetwork: ${point.network}`}
          >
            <Pin 
                background={getPinColor(point.strength)} 
                borderColor={'#fff'} 
                glyphColor={'#fff'} 
            />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
