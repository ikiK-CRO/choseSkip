import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface MapBackgroundProps {
  children: React.ReactNode;
}

const LOWESTOFT_STREET = { lat: 52.4751, lng: 1.7516 }; // Use the same Lowestoft location

const MapBackground: React.FC<MapBackgroundProps> = ({ children }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey || '' });

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
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={LOWESTOFT_STREET}
          zoom={20}
          options={{ disableDefaultUI: true, gestureHandling: 'none', draggable: false }}
        >
          <Marker position={LOWESTOFT_STREET} />
        </GoogleMap>
      )}
      {/* Lighter, more transparent overlay for better street name visibility */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
        {children}
      </div>
    </div>
  );
};

export default MapBackground;
