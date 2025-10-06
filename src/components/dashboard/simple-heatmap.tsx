'use client';
import type { SignalData } from '@/lib/data';

interface SimpleHeatmapProps {
  signalData: SignalData[];
}

const getDotColor = (strength: number) => {
  switch (strength) {
    case 1: return 'bg-red-500';
    case 2: return 'bg-yellow-500';
    case 3: return 'bg-lime-500';
    case 4: return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

export function SimpleHeatmap({ signalData }: SimpleHeatmapProps) {
  if (signalData.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">No signal data logged yet. Start logging to see your heatmap!</p>
      </div>
    );
  }

  // Find bounding box of all points
  const latitudes = signalData.map(p => p.latitude);
  const longitudes = signalData.map(p => p.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  
  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;
  const maxRange = Math.max(latRange, lngRange);

  return (
    <div className="relative h-full w-full p-4">
        <div className="relative h-full w-full border-2 border-dashed rounded-lg overflow-hidden">
            {signalData.map((point) => {
                // Normalize coordinates to fit within the view, with padding
                const x = ((point.longitude - minLng) / maxRange) * 90 + 5;
                const y = ((maxLat - point.latitude) / maxRange) * 90 + 5;

                return (
                    <div
                        key={point.id}
                        className={`absolute w-3 h-3 rounded-full ${getDotColor(point.strength)} transform -translate-x-1/2 -translate-y-1/2`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        title={`Strength: ${point.strength}/4, Network: ${point.network}`}
                    />
                );
            })}
        </div>
    </div>
  );
}
