export type SignalData = {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  strength: number; // e.g., 0 to 4
  network: 'T-Mobile' | 'Verizon' | 'AT&T' | 'Other';
  timestamp: number;
};

const generateMockData = (
  baseLat: number,
  baseLon: number,
  count: number,
  idStart: number
): SignalData[] => {
  const data: SignalData[] = [];
  const networks: SignalData['network'][] = ['T-Mobile', 'Verizon', 'AT&T', 'Other'];
  for (let i = 0; i < count; i++) {
    data.push({
      id: (idStart + i).toString(),
      userId: 'mock-user',
      latitude: baseLat + (Math.random() - 0.5) * 0.05,
      longitude: baseLon + (Math.random() - 0.5) * 0.05,
      strength: Math.floor(Math.random() * 5),
      network: networks[Math.floor(Math.random() * networks.length)],
      timestamp: new Date().getTime() - Math.random() * 1000 * 60 * 60 * 24 * 7,
    });
  }
  return data;
};

// Mock data for development
export const mockSignalData: SignalData[] = [
  // Original Downtown LA points
  {
    id: '0',
    userId: 'mock-user',
    latitude: 34.050235,
    longitude: -118.241683,
    strength: 0,
    network: 'Other',
    timestamp: new Date('2023-10-27T09:50:00Z').getTime(),
  },
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
  // New mock data clusters
  ...generateMockData(34.01, -118.49, 50, 5), // Santa Monica cluster
  ...generateMockData(34.118, -118.3, 50, 55), // Griffith Observatory cluster
  ...generateMockData(33.9425, -118.408, 40, 105), // LAX cluster
  ...generateMockData(34.07, -118.44, 30, 145), // Westwood/UCLA cluster
];
