import React, { useState, useRef, useEffect } from 'react';
import { useSkips } from '../hooks/useSkips';
import Carousel3D from '../components/Carousel3D';
import type { Carousel3DRef } from '../components/Carousel3D';
import MapBackground from '../components/MapBackground';

const ArrowButton = ({ direction, onClick }: { direction: 'left' | 'right', onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`z-30 transform -translate-y-1/2 fixed md:absolute top-1/2 ${direction === 'left' ? 'left-2 md:left-1/4' : 'right-2 md:right-1/4'} 
      bg-black/60 hover:bg-blue-600 text-white rounded-full p-3 md:p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200
      md:w-12 md:h-12 w-16 h-16 flex items-center justify-center`}
    style={{ fontSize: 28 }}
    aria-label={direction === 'left' ? 'Spin left' : 'Spin right'}
  >
    {direction === 'left' ?
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> :
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    }
  </button>
);

const ChooseSkip = () => {
  const [selectedSkipId, setSelectedSkipId] = useState<string | null>(null);
  const { data: skips, isLoading, error } = useSkips('NR32', 'Lowestoft');
  const carouselRef = useRef<Carousel3DRef>(null);

  const handleRotate = (direction: 'left' | 'right') => {
    carouselRef.current?.rotateBy(direction === 'left' ? -1 : 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleRotate('left');
      if (e.key === 'ArrowRight') handleRotate('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSkip = (skipId: string | null) => {
    setSelectedSkipId(skipId);
  };

  const selectedSkip = skips?.find(s => s.id === selectedSkipId);

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-0 md:p-4">
      <h1 className="text-3xl font-bold mt-6 mb-2 md:mb-4">Choose Your Skip</h1>
      <p className="text-lg text-gray-300 mb-4 md:mb-8">Drag the wheel or use the arrows to select a skip size.</p>
      <div className="w-full h-full flex-grow relative flex items-center justify-center">
        <ArrowButton direction="left" onClick={() => handleRotate('left')} />
        <div className="w-full h-full absolute left-0 right-0 top-0 bottom-0">
            <MapBackground>
              {isLoading && <p>Loading skips...</p>}
              {error && <p>Error loading skips: {error.message}</p>}
              {skips && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  {/* Selected skip image in the center above the card */}
                  {selectedSkip && (
                    <>
                      {selectedSkip.imageUrl ? (
                        <img
                          src={selectedSkip.imageUrl}
                          alt={selectedSkip.size}
                          className="w-40 h-40 object-contain mb-4 drop-shadow-xl bg-white/80 rounded-lg"
                          style={{ zIndex: 20 }}
                          onError={e => (e.currentTarget.style.display = 'none')}
                        />
                      ) : (
                        <div className="text-5xl font-extrabold text-white mb-4 drop-shadow-xl" style={{ zIndex: 20 }}>
                          {selectedSkip.size}
                        </div>
                      )}
                    </>
                  )}
                  <div className="w-full h-96 md:w-[600px] md:h-[600px] flex items-center justify-center">
                    <Carousel3D
                      ref={carouselRef}
                      skips={skips}
                      onSelect={handleSelectSkip}
                      text3d
                    />
                  </div>
                  {/* Selected skip details below the wheel */}
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
        <ArrowButton direction="right" onClick={() => handleRotate('right')} />
      </div>
    </div>
  );
};

export default ChooseSkip;
