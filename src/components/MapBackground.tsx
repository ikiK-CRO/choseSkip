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
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoaded || !address || !window.google) {
      if (!address) {
        setError('Please provide an address to search.');
      }
      return;
    }

    setIsLoadingGeocoding(true);
    setError(null); // Clear previous errors when a new geocoding request starts
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      setIsLoadingGeocoding(false);
      if (status === 'OK' && results && results[0]) {
        setCoords(results[0].geometry.location.toJSON());
      } else {
        let errorMessage = 'Error finding address.';
        switch (status) {
          case 'ZERO_RESULTS':
            errorMessage = 'No results found for the given address.';
            break;
          case 'OVER_QUERY_LIMIT':
            errorMessage = 'Daily query limit exceeded. Please try again tomorrow or check your API key.';
            break;
          case 'REQUEST_DENIED':
            errorMessage = 'Request denied. Ensure Geocoding API is enabled and API key is correct.';
            break;
          case 'INVALID_REQUEST':
            errorMessage = 'Invalid request. Please check the address format.';
            break;
          default:
            errorMessage = `Geocoding failed with status: ${status}.`;
        }
        setError(errorMessage);
        setCoords(null); // Clear previous coordinates on error
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
              mapId: 'DEMO_DARK_MAP_ID', // Ensure dark mode is used
            }}
        >
            <Marker position={coords} />
        </GoogleMap>
      )}
        {(!coords && !error && isLoaded && isLoadingGeocoding) && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-white bg-black/40">
            Geocoding address...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-red-400 bg-black/40">
            {error}
          </div>
        )}
        {(!isLoaded && !apiKey) && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-400 bg-black/40">
            Loading Google Maps API...
          </div>
        )}
      </div>
      {/* Overlay is interactive */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20" style={{ pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default MapBackground;
