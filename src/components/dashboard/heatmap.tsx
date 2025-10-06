'use client';
import type { SignalData } from '@/lib/data';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface HeatmapProps {
  signalData: SignalData[];
}

const getDotColor = (strength: number) => {
  switch (strength) {
    case 1:
      return 'hsl(var(--chart-1))';
    case 2:
      return 'hsl(var(--chart-4))';
    case 3:
      return 'hsl(var(--chart-2))';
    case 4:
      return 'hsl(var(--chart-2))';
    default:
      return 'hsl(var(--muted-foreground))';
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as SignalData;
    return (
      <Card>
        <CardHeader className="p-2">
            <CardTitle className="text-base">Reading Details</CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0 text-sm">
            <p><strong>Strength:</strong> {data.strength}/4</p>
            <p><strong>Network:</strong> {data.network}</p>
            <p><strong>Coords:</strong> {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}</p>
            <p className="text-xs text-muted-foreground pt-1">{new Date(data.timestamp).toLocaleString()}</p>
        </CardContent>
      </Card>
    );
  }
  return null;
};

export function Heatmap({ signalData }: HeatmapProps) {
    if (!signalData || signalData.length === 0) {
        return <p>No data to display.</p>;
    }
    
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 20,
          right: 40,
          bottom: 40,
          left: 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
            type="number" 
            dataKey="longitude" 
            name="longitude" 
            domain={['dataMin', 'dataMax']}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
        >
            <Label value="Longitude" offset={-20} position="insideBottom" fill="hsl(var(--foreground))" />
        </XAxis>
        <YAxis 
            type="number" 
            dataKey="latitude" 
            name="latitude" 
            domain={['dataMin', 'dataMax']}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
        >
            <Label value="Latitude" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="hsl(var(--foreground))" />
        </YAxis>
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Signal Readings" data={signalData} fill="hsl(var(--primary))">
          {signalData.map((entry, index) => (
            <circle key={`cell-${index}`} cx={0} cy={0} r={0} fill={getDotColor(entry.strength)} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
