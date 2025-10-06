'use client';
import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import type { SignalData } from '@/lib/data';

interface HeatmapProps {
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

export function Heatmap({ signalData }: HeatmapProps) {
  const center: LatLngExpression = useMemo(() => {
    if (signalData && signalData.length > 0) {
      const avgLat = signalData.reduce((sum, p) => sum + p.latitude, 0) / signalData.length;
      const avgLng = signalData.reduce((sum, p) => sum + p.longitude, 0) / signalData.length;
      return [avgLat, avgLng];
    }
    return [34.0522, -118.2437]; // Default center
  }, [signalData]);

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
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
  );
}
