'use client';
import type { SignalData } from '@/lib/data';
import { Vega } from 'react-vega';
import type { TopLevelSpec } from 'vega-lite';
import { useMemo } from 'react';

interface HeatmapProps {
  signalData: SignalData[];
  userLocation?: { latitude: number; longitude: number } | null;
}

export default function Heatmap({ signalData, userLocation }: HeatmapProps) {
  // Sanitize data to ensure all fields are present and valid
  const sanitizedData = useMemo(() => {
    return (signalData || [])
      .filter(d =>
        d &&
        typeof d.latitude === 'number' && !isNaN(d.latitude) &&
        typeof d.longitude === 'number' && !isNaN(d.longitude)
      )
      .map(d => ({
        ...d,
        strength: typeof d.strength === 'number' ? d.strength : 0,
      }));
  }, [signalData]);

  const spec: TopLevelSpec = useMemo(() => ({
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'A scatter plot of signal strength readings.',
    width: 'container',
    height: 'container',
    layer: [
      {
        data: { values: sanitizedData },
        mark: {
          type: 'circle' as const,
          size: 400, // Increased size for better "coverage"
          opacity: 0.4, // Lower opacity for better "averaging" effect
          tooltip: true,
        },
        encoding: {
          color: {
            field: 'strength',
            type: 'ordinal',
            title: 'Signal Strength',
            scale: {
              domain: [0, 1, 2, 3, 4],
              range: ['#1e293b', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'],
            },
            legend: {
              orient: 'bottom',
              direction: 'horizontal',
              labelColor: '#94a3b8',
              titleColor: '#f1f5f9',
            }
          },
          tooltip: [
            { field: 'strength', type: 'quantitative', title: 'Strength' },
            { field: 'network', type: 'nominal', title: 'Network' },
            { field: 'latitude', type: 'quantitative', title: 'Latitude' },
            { field: 'longitude', type: 'quantitative', title: 'Longitude' },
            { field: 'timestamp', type: 'temporal', title: 'Time', format: '%Y-%m-%d %H:%M' },
          ],
        }
      },
      ...(userLocation ? [{
        data: { values: [userLocation] },
        mark: {
          type: 'point' as const,
          shape: 'circle' as const,
          fill: '#3b82f6', // Google Maps blue
          stroke: 'white',
          strokeWidth: 2,
          size: 200,
          opacity: 1
        },
      }] : [])
    ],
    encoding: {
      x: {
        field: 'longitude',
        type: 'quantitative',
        title: 'Longitude',
        scale: { zero: false, padding: 40 }, // Increased padding for larger dots
        axis: {
          labelColor: '#94a3b8', // slate-400 approx
          titleColor: '#f1f5f9', // slate-50 approx
          gridColor: '#334155', // slate-700 approx
        },
      },
      y: {
        field: 'latitude',
        type: 'quantitative',
        title: 'Latitude',
        scale: { zero: false, padding: 40 }, // Increased padding for larger dots
        axis: {
          labelColor: '#94a3b8',
          titleColor: '#f1f5f9',
          gridColor: '#334155',
        },
      },
    },
    background: '#09090b', // Zinc-950 dark background for better contrast with 0-strength points
    config: {
      view: {
        stroke: 'transparent'
      }
    },
    autosize: {
      type: 'fit',
      contains: 'padding'
    },
    padding: 10
  }), [sanitizedData, userLocation]);

  if ((!sanitizedData || sanitizedData.length === 0) && !userLocation) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4 bg-muted/20">
        <p className="text-muted-foreground">No valid data points to display.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] bg-[#09090b] flex flex-col items-center justify-center">
      <Vega
        spec={spec}
        renderer="canvas"
        actions={false}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
