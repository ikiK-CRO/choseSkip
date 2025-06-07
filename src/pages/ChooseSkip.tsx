import React, { useState, useRef, useEffect } from 'react';
import { useSkips } from '../hooks/useSkips';
import Carousel3D from '../components/Carousel3D';
import type { Carousel3DRef } from '../components/Carousel3D';
import MapBackground from '../components/MapBackground';

const ArrowButton = ({ direction, onClick }: { direction: 'left' | 'right', onClick: () => void }) => (
  <button onClick={onClick} className="absolute top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 z-10">
    {direction === 'left' ?
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> :
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    }
  </button>
);

const ChooseSkip = () => {
  const [selectedSkipId, setSelectedSkipId] = useState<string | null>(null);
  const { data: skips, isLoading, error } = useSkips('LE10 1SH', 'Hinckley');
  const carouselRef = useRef<Carousel3DRef>(null);

  const rotateAmount = Math.PI * 2 / (skips?.length || 1);

  const handleRotate = (direction: 'left' | 'right') => {
    carouselRef.current?.rotateBy(direction === 'left' ? -rotateAmount : rotateAmount);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleRotate('left');
      if (e.key === 'ArrowRight') handleRotate('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateAmount]);

  const handleSelectSkip = (skipId: string | null) => {
    setSelectedSkipId(skipId);
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Choose Your Skip</h1>
      <p className="text-lg text-gray-300 mb-8">Drag the wheel or use the arrows to select a skip size.</p>
      <div className="w-full h-full flex-grow relative flex items-center justify-center">
        <ArrowButton direction="left" onClick={() => handleRotate('left')} />
        <div className="w-full h-full absolute left-0 right-0">
            <MapBackground postcode="LE10 1SH">
              {isLoading && <p>Loading skips...</p>}
              {error && <p>Error loading skips: {error.message}</p>}
              {skips && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-80 h-80 lg:w-96 lg:h-96">
                    <Carousel3D ref={carouselRef} skips={skips} onSelect={handleSelectSkip} />
                  </div>
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
        <ArrowButton direction="right" onClick={() => handleRotate('right')} />
      </div>
    </div>
  );
};

export default ChooseSkip;
