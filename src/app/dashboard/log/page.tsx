'use client';
import { useState } from 'react';
import { SignalLogger } from '@/components/dashboard/signal-logger';
import { logSignalPoint } from '@/lib/actions';
import type { SignalData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LogSignalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleLogSignal = async (data: Omit<SignalData, 'id' | 'userId' | 'timestamp'>) => {
    setIsSubmitting(true);
    try {
      await logSignalPoint(data);
      toast({
        title: 'Success',
        description: 'Signal point logged successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error logging signal',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start p-4 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log a Signal Point</CardTitle>
          <CardDescription>
            Select the current signal strength and network type, then log your reading. Your location will be automatically recorded.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <SignalLogger onLogSignal={handleLogSignal} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
