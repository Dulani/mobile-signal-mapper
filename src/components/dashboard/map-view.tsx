'use client';

import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SignalData } from '@/lib/data';

interface MapViewProps {
  signalData: SignalData[];
  userLocation?: { latitude: number; longitude: number } | null;
}

export default function MapView({ signalData, userLocation }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  // Filter out invalid coordinates
  const validSignalData = useMemo(() => {
    return (signalData || []).filter(
      d => d && typeof d.latitude === 'number' && !isNaN(d.latitude) &&
           typeof d.longitude === 'number' && !isNaN(d.longitude)
    );
  }, [signalData]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current!;

    // Clear existing markers
    layerGroup.clearLayers();

    if (validSignalData.length > 0) {
      const bounds = L.latLngBounds([]);

      validSignalData.forEach(d => {
        const color = ['#1e293b', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'][d.strength] || '#1e293b';
        const marker = L.circleMarker([d.latitude, d.longitude], {
          radius: 8,
          fillColor: color,
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7
        });

        marker.bindPopup(`
          <strong>Strength: ${d.strength}</strong><br>
          Network: ${d.network}<br>
          Time: ${new Date(d.timestamp).toLocaleString()}
        `);

        marker.addTo(layerGroup);
        bounds.extend([d.latitude, d.longitude]);
      });

      // Fit bounds if we have points and not recently moved by user
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

    return () => {
      // Cleanup is handled by the component unmount or mapInstanceRef logic
    };
  }, [validSignalData]);

  // Handle user location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      userMarkerRef.current = L.circleMarker([userLocation.latitude, userLocation.longitude], {
        radius: 10,
        fillColor: '#3b82f6',
        color: 'white',
        weight: 3,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map);

      userMarkerRef.current.bindPopup("You are here").openPopup();
      map.setView([userLocation.latitude, userLocation.longitude], Math.max(map.getZoom(), 13));
    }
  }, [userLocation]);

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Custom Legend */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-background/90 backdrop-blur-sm border rounded-full px-4 py-2 flex items-center gap-4 shadow-lg transition-opacity group-hover:opacity-100">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Signal Strength</span>
        {[0, 1, 2, 3, 4].map(strength => (
          <div key={strength} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: ['#1e293b', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'][strength] }}
            />
            <span className="text-xs font-medium">{strength}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
