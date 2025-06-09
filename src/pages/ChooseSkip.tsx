import React, { useState, useRef } from 'react';
import { useSkips } from '../hooks/useSkips';
import CarouselClassic from '../components/CarouselClassic';
import type { CarouselClassicRef } from '../components/CarouselClassic';
import MapBackground from '../components/MapBackground';
import Breadcrumbs from '../components/Breadcrumbs';

const ChooseSkip = () => {
  const [selectedSkipId, setSelectedSkipId] = useState<string | null>(null);
  const { data: skips, isLoading, error } = useSkips('NR32', 'Lowestoft');
  const carouselRef = useRef<CarouselClassicRef>(null);

  const handleSelectSkip = (skipId: string | null) => {
    setSelectedSkipId(skipId);
  };

  const selectedSkip = skips?.find(s => s.id === selectedSkipId);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center p-0 md:p-4">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold mt-6 mb-2 md:mb-4">Choose Your Skip</h1>
      <p className="text-base md:text-lg text-gray-300 mb-2 md:mb-8 text-center px-2">Drag, use the arrows, or click the dots to select a skip size.</p>
      <div className="w-full h-full flex-grow relative flex items-center justify-center">
        <div className="w-full h-full absolute left-0 right-0 top-0 bottom-0">
          <MapBackground address="197 Ashby Road, Hinckley, LE10 1SH">
              {isLoading && <p>Loading skips...</p>}
              {error && <p>Error loading skips: {error.message}</p>}
              {skips && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-center">
                  <CarouselClassic
                      ref={carouselRef}
                      skips={skips}
                      onSelect={handleSelectSkip}
                    />
                  </div>
                {/* Selected skip details below the carousel */}
                  {selectedSkip && (
                    <div className="mt-6 bg-gray-800 bg-opacity-80 rounded-lg p-4 flex flex-col items-center shadow-lg">
                      <div className="text-2xl font-semibold mb-1">{selectedSkip.size}</div>
                      <div className="text-blue-400 text-2xl font-bold mb-1">£{selectedSkip.price}</div>
                      <div className="text-gray-300 text-lg mb-1">14 day hire</div>
                      {!selectedSkip.roadLegal && (
                        <div className="text-yellow-400 text-base font-semibold">Not Allowed On Road</div>
                      )}
                    </div>
                  )}
                  <button
                    className="mt-8 btn btn-primary disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedSkipId}
                  >
                    Continue
                  </button>
                </div>
              )}
            </MapBackground>
        </div>
      </div>
    </div>
  );
};

export default ChooseSkip;
