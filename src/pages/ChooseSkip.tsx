import React, { useState } from 'react';
import { useSkips } from '../hooks/useSkips';
import Carousel3D from '../components/Carousel3D';
import MapBackground from '../components/MapBackground';

const ChooseSkip = () => {
  const [selectedSkipId, setSelectedSkipId] = useState<string | null>(null);
  const { data: skips, isLoading, error } = useSkips('LE10 1SH', 'Hinckley');

  const handleSelectSkip = (skipId: string | null) => {
    setSelectedSkipId(skipId);
  };

  return (
    <div className="w-full h-screen">
      <MapBackground postcode="LE10 1SH">
        {isLoading && <p>Loading skips...</p>}
        {error && <p>Error loading skips: {error.message}</p>}
        {skips && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-48 h-48 lg:w-64 lg:h-64">
              <Carousel3D skips={skips} onSelect={handleSelectSkip} />
            </div>
            <button
              className="mt-8 btn btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!selectedSkipId}
            >
              Continue
            </button>
          </div>
        )}
      </MapBackground>
    </div>
  );
};

export default ChooseSkip;
