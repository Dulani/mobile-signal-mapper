'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Signal, SignalHigh, SignalLow, SignalMedium, Wifi } from 'lucide-react';
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
  onLogSignal: (data: Omit<SignalData, 'id' | 'userId' | 'timestamp'>) => void;
  isMobile?: boolean;
}

export function SignalLogger({ onLogSignal, isMobile = false }: SignalLoggerProps) {
  const [strength, setStrength] = useState<SignalStrength | null>(null);
  const [network, setNetwork] = useState<SignalData['network']>('4G');
  const { position, error, isLoading: isGeoLoading, getPosition } = useGeolocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!strength) {
      toast({ variant: 'destructive', title: 'Please select a signal strength.' });
      return;
    }

    setIsSubmitting(true);
    getPosition();
  };
  
  // This effect runs when the position is updated
  // We check if it was triggered by a submission attempt
  useState(() => {
    if (isSubmitting && position) {
      onLogSignal({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        strength: strength!,
        network,
      });
      setIsSubmitting(false);
      setStrength(null);
    }

    if (isSubmitting && error) {
      toast({
        variant: 'destructive',
        title: 'Location Error',
        description: error,
      });
      setIsSubmitting(false);
    }
  });


  const isLoading = isGeoLoading || isSubmitting;

  if (isMobile) {
    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2">
              {strengthLevels.map((level) => (
                <Button
                  key={level.value}
                  variant={strength === level.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStrength(level.value)}
                  className="flex flex-col h-auto py-2"
                >
                  <level.icon className={cn('h-5 w-5', level.color)} />
                  <span className="text-xs mt-1">{level.label}</span>
                </Button>
              ))}
            </div>
            <Button onClick={handleSubmit} disabled={isLoading || !strength} className="w-full">
              {isLoading ? 'Getting Location...' : 'Log Current Signal'}
            </Button>
        </div>
    )
  }

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
        {isLoading ? 'Getting Location...' : 'Log Signal'}
      </Button>
    </div>
  );
}
