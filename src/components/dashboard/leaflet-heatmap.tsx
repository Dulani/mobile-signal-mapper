'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import type { SignalData } from '@/lib/data';
import { LatLngExpression } from 'leaflet';

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
    // Calculate the center of all points to focus the map
  const centerLat = signalData.reduce((acc, p) => acc + p.latitude, 0) / signalData.length;
  const centerLng = signalData.reduce((acc, p) => acc + p.longitude, 0) / signalData.length;
  const center: LatLngExpression = [centerLat, centerLng];

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
            Carrier: {point.network} <br />
            Logged: {new Date(point.timestamp).toLocaleString()}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
