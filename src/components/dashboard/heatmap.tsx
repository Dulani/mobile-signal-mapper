'use client';
import type { SignalData } from '@/lib/data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface HeatmapProps {
  signalData: SignalData[];
}

export function Heatmap({ signalData }: HeatmapProps) {
  return (
    <ScrollArea className="h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Strength</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signalData.map((point) => (
            <TableRow key={point.id}>
              <TableCell>{point.latitude.toFixed(5)}</TableCell>
              <TableCell>{point.longitude.toFixed(5)}</TableCell>
              <TableCell>{point.strength}/4</TableCell>
              <TableCell>{point.network}</TableCell>
              <TableCell>{new Date(point.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
