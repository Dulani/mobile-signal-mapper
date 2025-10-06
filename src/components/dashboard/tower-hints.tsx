'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getTowerHints } from '@/lib/actions';
import type { SignalData } from '@/lib/data';
import { Lightbulb } from 'lucide-react';

interface TowerHintsProps {
  signalData: SignalData[];
}

export function TowerHints({ signalData }: TowerHintsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hints, setHints] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetHints = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const heatmapData = JSON.stringify(
        signalData.map((d) => ({
          lat: d.latitude,
          lng: d.longitude,
          strength: d.strength,
        }))
      );
      
      if (signalData.length < 3) {
          setHints("Please log at least 3 data points to get meaningful hints about tower locations.");
          setIsLoading(false);
          return;
      }
      
      const result = await getTowerHints(heatmapData);
      setHints(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    setHints(null);
    setError(null);
  };

  return (
    <>
      <Button
        onClick={handleGetHints}
        disabled={isLoading}
        className="w-full"
        variant="outline"
      >
        <Lightbulb className="mr-2 h-4 w-4" />
        {isLoading ? 'Analyzing...' : 'Get Tower Hints'}
      </Button>

      <AlertDialog open={!!hints || !!error} onOpenChange={closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {error ? 'Error' : 'Tower Proximity Hints'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error
                ? `Could not generate hints: ${error}`
                : hints}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeDialog}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
