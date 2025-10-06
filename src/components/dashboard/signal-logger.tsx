'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Signal, SignalHigh, SignalLow, SignalMedium } from 'lucide-react';
import { useGeolocation } from '@/hooks/use-geolocation';
import type { SignalData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

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

const carriers: SignalData['network'][] = ['T-Mobile', 'Verizon', 'AT&T', 'Other'];

interface SignalLoggerProps {
  onLogSignal: (data: Omit<SignalData, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  isSubmitting: boolean;
}

export function SignalLogger({ onLogSignal, isSubmitting }: SignalLoggerProps) {
  const [carrier, setCarrier] = useState<SignalData['network']>('T-Mobile');
  const [selectedStrength, setSelectedStrength] = useState<SignalStrength | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { position, error, isLoading: isGeoLoading, getPosition } = useGeolocation();
  const { toast } = useToast();

  const handleStrengthClick = (strength: SignalStrength) => {
    setSelectedStrength(strength);
    getPosition();
  };

  useEffect(() => {
    if (position && selectedStrength) {
      onLogSignal({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        strength: selectedStrength,
        network: carrier,
      }).finally(() => {
        setSelectedStrength(null);
      });
    }

    if (error && selectedStrength) {
      toast({
        variant: 'destructive',
        title: 'Location Error',
        description: error,
      });
      setSelectedStrength(null); 
    }
  }, [position, error, selectedStrength, onLogSignal, carrier, toast]);

  const isLoading = isGeoLoading || isSubmitting;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-muted-foreground">Signal Strength</label>
        <p className="text-sm text-muted-foreground/80 mb-2">Tap an icon to log your signal.</p>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {strengthLevels.map((level) => (
            <Button
              key={level.value}
              variant={selectedStrength === level.value && isLoading ? 'default' : 'outline'}
              onClick={() => handleStrengthClick(level.value)}
              disabled={isLoading}
              aria-pressed={selectedStrength === level.value}
              className="h-16 flex-col"
            >
              <level.icon className={cn('h-7 w-7', level.color)} />
              <span className="text-xs mt-1">{level.label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Carrier</span>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-sm">
              {carrier}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <RadioGroup 
                defaultValue={carrier}
                onValueChange={(value: SignalData['network']) => {
                    setCarrier(value);
                    setIsPopoverOpen(false);
                }}
            >
                <div className="space-y-2">
                    {carriers.map((carrierName) => (
                        <div className="flex items-center space-x-2" key={carrierName}>
                            <RadioGroupItem value={carrierName} id={carrierName} />
                            <Label htmlFor={carrierName}>{carrierName}</Label>
                        </div>
                    ))}
                </div>
            </RadioGroup>
          </PopoverContent>
        </Popover>
      </div>

       {isLoading && (
        <div className="text-sm text-center text-muted-foreground">
          {isSubmitting ? 'Submitting...' : 'Getting Location...'}
        </div>
      )}
    </div>
  );
}
