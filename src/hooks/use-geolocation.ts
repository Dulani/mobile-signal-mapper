'use client';

import { useState, useCallback } from 'react';

type GeolocationPosition = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

const getMockPosition = (): GeolocationPosition => {
  // Return a mock position (e.g., downtown Los Angeles)
  return {
    coords: {
      latitude: 34.052235 + (Math.random() - 0.5) * 0.1,
      longitude: -118.243683 + (Math.random() - 0.5) * 0.1,
    },
  };
};


export const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported. Using mock location for testing.');
      setPosition(getMockPosition());
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition(pos as GeolocationPosition);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        setError(`Geolocation failed: ${err.message}. Using mock location for testing.`);
        setPosition(getMockPosition());
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000, // Reduced timeout to fail faster
        maximumAge: 0,
      }
    );
  }, []);

  return { position, error, isLoading, getPosition };
};
