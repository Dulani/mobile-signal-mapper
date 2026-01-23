'use client';

import { useState, useCallback } from 'react';

type GeolocationPosition = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPosition = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition(pos as GeolocationPosition);
        setIsLoading(false);
      },
      (err) => {
        setError(`Geolocation failed: ${err.message}. Please enable location services.`);
        setPosition(null);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { position, error, isLoading, getPosition };
};
