'use server';

import { towerProximityHints } from '@/ai/flows/tower-proximity-hints';
import { mockSignalData, type SignalData } from './data';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const signalSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  strength: z.number().min(1).max(4),
  network: z.enum(['5G', '4G', '3G', 'WiFi', 'Unknown']),
});

// Mock database
let db: SignalData[] = [...mockSignalData];

export async function getSignalPoints(): Promise<SignalData[]> {
  // In a real app, you'd fetch this from a database like Firestore
  // based on the authenticated user's ID.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return db;
}

export async function logSignalPoint(
  data: Omit<SignalData, 'id' | 'userId' | 'timestamp'>
): Promise<SignalData> {
  const validatedData = signalSchema.parse(data);

  const newPoint: SignalData = {
    ...validatedData,
    id: new Date().getTime().toString(),
    userId: 'mock-user', // In a real app, get this from auth session
    timestamp: new Date().getTime(),
  };

  // Simulate database insert
  db.push(newPoint);
  
  // Revalidate the dashboard path to reflect the new data
  revalidatePath('/dashboard');

  return newPoint;
}

export async function getTowerHints(heatmapData: string): Promise<string> {
  if (!heatmapData || heatmapData === '[]') {
    throw new Error('Not enough data to provide hints.');
  }

  try {
    const result = await towerProximityHints({ heatmapData });
    return result.hints;
  } catch (error) {
    console.error('Error getting tower hints:', error);
    throw new Error('Failed to generate hints from AI model.');
  }
}
