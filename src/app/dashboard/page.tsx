'use client';
import { useState, useEffect } from 'react';
import { SignalLogger } from '@/components/dashboard/signal-logger';
import { getSignalPoints, logSignalPoint } from '@/lib/actions';
import type { SignalData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { SimpleHeatmap } from '@/components/dashboard/simple-heatmap';

export default function DashboardPage() {
  const [signalData, setSignalData] = useState<SignalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getSignalPoints();
      setSignalData(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleLogSignal = async (data: Omit<SignalData, 'id' | 'userId' | 'timestamp'>) => {
    try {
      const newPoint = await logSignalPoint(data);
      setSignalData((prevData) => [...prevData, newPoint]);
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
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-full md:w-[320px] md:border-r flex-col hidden md:flex">
        <div className="flex-1 overflow-auto">
            <SidebarGroup>
                <SidebarGroupLabel>Log Signal</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SignalLogger onLogSignal={handleLogSignal} />
                </SidebarGroupContent>
            </SidebarGroup>
        </div>
      </div>
      <div className="flex-1 relative bg-muted/20">
        {isLoading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <SimpleHeatmap signalData={signalData} />
        )}
      </div>
       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t p-4">
          <SignalLogger onLogSignal={handleLogSignal} isMobile={true}/>
        </div>
    </div>
  );
}
