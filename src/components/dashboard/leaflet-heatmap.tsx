'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import type { SignalData } from '@/lib/data';
import { LatLngExpression } from 'leaflet';
import { useMemo } from 'react';

interface LeafletHeatmapProps {
  signalData: SignalData[];
}

const getDotColor = (strength: number) => {
  switch (strength) {
    case 1: return 'red';
    case 2: return 'orange';
    case 3: return 'yellow';
    case 4: return 'green';
    default: return 'grey';
  }
};

export function LeafletHeatmap({ signalData }: LeafletHeatmapProps) {
  const center = useMemo<LatLngExpression>(() => {
    if (signalData.length === 0) {
      return [34.0522, -118.2437]; // Default to LA if no data
    }
    const centerLat = signalData.reduce((acc, p) => acc + p.latitude, 0) / signalData.length;
    const centerLng = signalData.reduce((acc, p) => acc + p.longitude, 0) / signalData.length;
    return [centerLat, centerLng];
  }, [signalData]);

  // key={center.toString()} is a bit of a hack, but it forces a re-render when the center changes
  // which is what we want when the data changes. This is a common pattern for react-leaflet.
  return (
    <MapContainer key={JSON.stringify(center)} center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
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
            Carrier: {point.network} <br />
            Logged: {new Date(point.timestamp).toLocaleString()}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
