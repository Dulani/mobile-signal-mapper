export type SignalData = {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  strength: number; // e.g., 0 to 4
  network: 'T-Mobile' | 'Verizon' | 'AT&T' | 'Other';
  timestamp: number;
};
