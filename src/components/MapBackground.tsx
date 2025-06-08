import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface MapBackgroundProps {
  children: React.ReactNode;
  address: string;
}

const MapBackground: React.FC<MapBackgroundProps> = ({ children, address }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey || '' });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !address || !window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setCoords(results[0].geometry.location.toJSON());
        setError(null);
      } else {
        setError('Address not found');
      }
    });
  }, [isLoaded, address]);

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-200">
        <div className="text-center">
          <p className="text-red-500">Google Maps API key is missing.</p>
          <p>Please add it to your `.env.local` file as `VITE_GOOGLE_MAPS_API_KEY`.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen md:w-full md:h-64 md:h-96 lg:h-full">
      {/* Map is non-interactive */}
      <div style={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        {isLoaded && coords && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={coords}
            zoom={20}
            options={{
              disableDefaultUI: true,
              gestureHandling: 'none',
              draggable: false,
            }}
          >
            <Marker position={coords} />
          </GoogleMap>
        )}
        {!coords && !error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-white bg-black/40">
            Loading map…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-red-400 bg-black/40">
            {error}
          </div>
        )}
      </div>
      {/* Overlay is interactive */}
      <div className="absolute inset-0 flex items-center justify-center z-20" style={{ pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default MapBackground;
