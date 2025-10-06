'use client';
import type { SignalData } from '@/lib/data';
import { Vega } from 'react-vega';
import type { VisualizationSpec } from 'vega-lite';

interface HeatmapProps {
  signalData: SignalData[];
}

export default function Heatmap({ signalData }: HeatmapProps) {
  if (!signalData || signalData.length === 0) {
    return <p>No data to display.</p>;
  }

  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'A scatter plot of signal strength readings.',
    width: "container",
    height: "container",
    data: {
      values: signalData,
    },
    mark: {
      type: 'circle',
      size: 100,
      opacity: 0.7,
    },
    encoding: {
      x: {
        field: 'longitude',
        type: 'quantitative',
        title: 'Longitude',
        axis: {
          labelColor: 'hsl(var(--muted-foreground))',
          titleColor: 'hsl(var(--foreground))',
          gridColor: 'hsl(var(--border))',
        },
      },
      y: {
        field: 'latitude',
        type: 'quantitative',
        title: 'Latitude',
        axis: {
          labelColor: 'hsl(var(--muted-foreground))',
          titleColor: 'hsl(var(--foreground))',
          gridColor: 'hsl(var(--border))',
        },
      },
      color: {
        field: 'strength',
        type: 'ordinal',
        title: 'Signal Strength',
        scale: {
          domain: [1, 2, 3, 4],
          range: ['hsl(var(--chart-1))', 'hsl(var(--chart-4))', 'hsl(var(--chart-2))', 'hsl(var(--chart-2))'],
        },
        legend: {
          labelColor: 'hsl(var(--muted-foreground))',
          titleColor: 'hsl(var(--foreground))',
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
  };

  return <Vega spec={spec} />;
}
