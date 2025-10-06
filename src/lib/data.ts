export type SignalData = {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  strength: number; // e.g., 1 to 4
  network: 'T-Mobile' | 'Verizon' | 'AT&T' | 'Other';
  timestamp: number;
};

// Mock data for development
export const mockSignalData: SignalData[] = [
  {
    id: '1',
    userId: 'mock-user',
    latitude: 34.052235,
    longitude: -118.243683,
    strength: 4,
    network: 'Verizon',
    timestamp: new Date('2023-10-27T10:00:00Z').getTime(),
  },
  {
    id: '2',
    userId: 'mock-user',
    latitude: 34.053235,
    longitude: -118.244683,
    strength: 2,
    network: 'T-Mobile',
    timestamp: new Date('2023-10-27T10:05:00Z').getTime(),
  },
  {
    id: '3',
    userId: 'mock-user',
    latitude: 34.054235,
    longitude: -118.245683,
    strength: 1,
    network: 'AT&T',
    timestamp: new Date('2023-10-27T10:10:00Z').getTime(),
  },
    {
    id: '4',
    userId: 'mock-user',
    latitude: 34.051235,
    longitude: -118.242683,
    strength: 3,
    network: 'Verizon',
    timestamp: new Date('2023-10-27T09:55:00Z').getTime(),
  },
];
