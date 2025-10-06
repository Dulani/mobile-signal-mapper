'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Signal, SignalHigh, SignalLow, SignalMedium } from 'lucide-react';
import { useGeolocation } from '@/hooks/use-geolocation';
import type { SignalData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type SignalStrength = 1 | 2 | 3 | 4;

const strengthLevels: {
  value: SignalStrength;
  icon: React.ElementType;
  color: string;
  label: string;
}[] = [
  { value: 1, icon: SignalLow, color: 'text-red-500', label: 'Weak' },
  { value: 2, icon: SignalMedium, color: 'text-yellow-500', label: 'Fair' },
  { value: 3, icon: SignalHigh, color: 'text-green-500', label: 'Good' },
  { value: 4, icon: Signal, color: 'text-green-500', label: 'Excellent' },
];

interface SignalLoggerProps {
  onLogSignal: (data: Omit<SignalData, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  isSubmitting: boolean;
}

export function SignalLogger({ onLogSignal, isSubmitting }: SignalLoggerProps) {
  const [strength, setStrength] = useState<SignalStrength | null>(null);
  const [network, setNetwork] = useState<SignalData['network']>('4G');
  const { position, error, isLoading: isGeoLoading, getPosition } = useGeolocation();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!strength) {
      toast({ variant: 'destructive', title: 'Please select a signal strength.' });
      return;
    }
    // We get the position first. The actual submission is handled in the effect below.
    getPosition();
  };
  
  useEffect(() => {
    // This effect runs when the position is updated
    if (position && isSubmitting) {
      onLogSignal({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        strength: strength!,
        network,
      }).then(() => {
        setStrength(null);
      });
    }

    if (error && isSubmitting) {
      toast({
        variant: 'destructive',
        title: 'Location Error',
        description: error,
      });
      // In case of location error, the parent `isSubmitting` state is reset.
    }
  }, [position, error, isSubmitting, onLogSignal, strength, network, toast]);


  const isLoading = isGeoLoading || isSubmitting;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground">Signal Strength</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {strengthLevels.map((level) => (
            <Button
              key={level.value}
              variant={strength === level.value ? 'default' : 'outline'}
              onClick={() => setStrength(level.value)}
              aria-pressed={strength === level.value}
              className="h-12"
            >
              <level.icon className={cn('h-6 w-6', level.color)} />
              <span className="sr-only">{level.label}</span>
            </Button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="network-select" className="text-sm font-medium text-muted-foreground">Network Type</label>
        <Select value={network} onValueChange={(value) => setNetwork(value as SignalData['network'])}>
          <SelectTrigger id="network-select" className="mt-2">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5G">5G</SelectItem>
            <SelectItem value="4G">4G / LTE</SelectItem>
            <SelectItem value="3G">3G</SelectItem>
            <SelectItem value="WiFi">WiFi</SelectItem>
            <SelectItem value="Unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSubmit} disabled={isLoading || !strength} className="w-full">
        {isLoading ? (isSubmitting ? 'Submitting...' : 'Getting Location...') : 'Log Signal'}
      </Button>
    </div>
  );
}
