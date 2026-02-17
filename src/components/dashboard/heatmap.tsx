'use client';
import type { SignalData } from '@/lib/data';
import { Vega } from 'react-vega';
import type { VisualizationSpec } from 'vega-lite';
import { useMemo } from 'react';

interface HeatmapProps {
  signalData: SignalData[];
}

export default function Heatmap({ signalData }: HeatmapProps) {
  const spec: VisualizationSpec = useMemo(() => ({
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'A scatter plot of signal strength readings.',
    width: 'container',
    height: 'container',
    data: {
      values: signalData,
    },
    mark: {
      type: 'circle',
      size: 100,
      opacity: 0.7,
      tooltip: true,
    },
    encoding: {
      x: {
        field: 'longitude',
        type: 'quantitative',
        title: 'Longitude',
        scale: { zero: false },
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
        scale: { zero: false },
        axis: {
          labelColor: '#94a3b8',
          titleColor: '#f1f5f9',
          gridColor: '#334155',
        },
      },
      color: {
        field: 'strength',
        type: 'ordinal',
        title: 'Signal Strength',
        scale: {
          domain: [0, 1, 2, 3, 4],
          range: ['#1e293b', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'],
        },
        legend: {
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
    },
    background: 'transparent',
    config: {
      view: {
        stroke: 'transparent'
      }
    },
    autosize: {
      type: 'fit',
      contains: 'padding'
    }
  }), [signalData]);

  if (!signalData || signalData.length === 0) {
    return (
        <div className="flex h-full w-full items-center justify-center p-4">
            <p className="text-muted-foreground">No data to display.</p>
        </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
        <Vega spec={spec} renderer="svg" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
