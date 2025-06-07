import React from 'react';

interface MapBackgroundProps {
  postcode: string;
  children: React.ReactNode;
}

const MapBackground: React.FC<MapBackgroundProps> = ({ postcode, children }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${postcode}&zoom=17&size=600x400&key=${apiKey}`;

  return (
    <div
      className="relative w-full bg-cover bg-center h-64 md:h-96"
      style={{ backgroundImage: `url(${mapUrl})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default MapBackground;
