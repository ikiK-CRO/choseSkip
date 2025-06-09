import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { Skip } from '../hooks/useSkips';

export interface CarouselClassicRef {
  goTo: (index: number) => void;
}

interface CarouselClassicProps {
  skips: Skip[];
  onSelect?: (skipId: string | null) => void;
}

function getYardValue(size: string) {
  const match = size.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const CarouselClassic = forwardRef<CarouselClassicRef, CarouselClassicProps>(({ skips, onSelect }, ref) => {
  const isMobile = useIsMobile();
  const [selectedIndex, setSelectedIndex] = useState(() => Math.floor(skips.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    goTo: (index: number) => {
      setSelectedIndex(index);
    },
  }));

  useEffect(() => {
    if (onSelect) onSelect(skips[selectedIndex]?.id ?? null);
  }, [selectedIndex, skips, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Drag navigation
  let dragStartX = 0;
  let dragging = false;
  const handleDragStart = (e: React.MouseEvent) => {
    dragging = true;
    dragStartX = e.clientX;
  };
  const handleDragEnd = (e: React.MouseEvent) => {
    if (!dragging) return;
    const deltaX = e.clientX - dragStartX;
    if (deltaX > 40) prev();
    else if (deltaX < -40) next();
    dragging = false;
  };

  const prev = () => setSelectedIndex(i => Math.max(0, i - 1));
  const next = () => setSelectedIndex(i => Math.min(skips.length - 1, i + 1));

  // Show 3 on mobile, 5 on desktop, always center selected, pad with empty slots
  const getDisplaySlots = () => {
    const count = isMobile ? 3 : 5;
    const offset = Math.floor(count / 2);
    const slots = [];
    for (let i = -offset; i <= offset; i++) {
      const idx = selectedIndex + i;
      if (idx < 0 || idx >= skips.length) {
        slots.push(null); // placeholder
      } else {
        slots.push(idx);
      }
    }
    return slots;
  };

  // Find min/max yard size for scaling
  const yardSizes = skips.map(s => getYardValue(s.size));
  const minYard = Math.min(...yardSizes);
  const maxYard = Math.max(...yardSizes);
  function getImgScale(size: string, isCenter: boolean) {
    const yard = getYardValue(size);
    if (isCenter) {
      return 1.2 + 1.0 * ((yard - minYard) / (maxYard - minYard || 1));
    } else {
      return 0.5 + 0.7 * ((yard - minYard) / (maxYard - minYard || 1));
    }
  }

  const cardBase = isMobile ? 160 : 220;
  const cardSide = isMobile ? 90 : 140;
  const cardPadding = isMobile ? 2 : 6;

  const atStart = selectedIndex === 0;
  const atEnd = selectedIndex === skips.length - 1;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative flex items-center justify-center w-full select-none" style={{ height: isMobile ? 170 : 260 }}>
        {/* Left arrow, only show if not at start */}
        {!atStart && (
          <button
            className="z-20 bg-black/60 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 flex items-center justify-center"
            style={{ position: 'relative', left: isMobile ?  35 : 0, width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, marginRight: isMobile ? 2 : 8 }}
            onClick={prev}
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        {/* Carousel items */}
        <div
          className="flex items-center justify-center w-full"
          ref={containerRef}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          style={{ cursor: 'grab', userSelect: 'none', maxWidth: isMobile ? 340 : 900 }}
        >
          {getDisplaySlots().map((idx, pos) => {
            if (idx === null) {
              // Placeholder slot
              return (
                <div
                  key={`empty-${pos}`}
                  className="flex flex-col items-center justify-center transition-all duration-300 z-0"
                  style={{
                    margin: isMobile ? '0 2px' : '0 8px',
                    width: cardSide,
                    height: cardSide,
                    background: 'transparent',
                  }}
                />
              );
            }
            const skip = skips[idx];
            const isCenter = idx === selectedIndex;
            const scale = isCenter ? 1 : 0.8;
            const imgScale = getImgScale(skip.size, isCenter);
            const imgMax = isCenter ? cardBase - cardPadding * 2 : cardSide - cardPadding * 2;
            const imgSize = Math.max(imgMax * 0.85, Math.min(imgMax, imgScale * imgMax));
            return (
              <div
                key={skip.id}
                className={`flex flex-col items-center justify-center transition-all duration-300 ${isCenter ? 'z-20' : 'z-10'}`}
                style={{
                  transform: `scale(${scale}) translateY(${isCenter ? '0px' : '20px'})`,
                  opacity: isCenter ? 1 : 0.5,
                  margin: isCenter ? (isMobile ? '0 8px' : '0 24px') : (isMobile ? '0 2px' : '0 8px'),
                  width: isCenter ? cardBase : cardSide,
                  height: isCenter ? cardBase : cardSide,
                  boxShadow: isCenter ? '0 8px 32px rgba(0,0,0,0.18)' : 'none',
                  background: isCenter ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
                  borderRadius: 16,
                  transition: 'transform 0.3s, opacity 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: cardPadding,
                }}
              >
                <img
                  src={skip.imageUrl}
                  alt={skip.size}
                  className="object-contain"
                  draggable={false}
                  style={{ pointerEvents: 'none', width: imgSize, height: imgSize, transition: 'width 0.3s, height 0.3s' }}
                />
              </div>
            );
          })}
        </div>
        {/* Right arrow, only show if not at end */}
        {!atEnd && (
          <button
            className="z-20 bg-black/60 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 flex items-center justify-center"
            style={{ position: 'relative', right: isMobile ?  35 : 0, width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, marginLeft: isMobile ? 2 : 8 }}
            onClick={next}
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>
      {/* Dot indicator */}
      <div className="flex items-center justify-center mt-4 gap-2">
        {skips.map((skip, idx) => (
          <button
            key={skip.id}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${idx === selectedIndex ? 'bg-blue-500 scale-125' : 'bg-gray-400 scale-100'}`}
            onClick={() => setSelectedIndex(idx)}
            aria-label={`Go to skip ${skip.size}`}
            style={{ outline: 'none', border: 'none' }}
          />
        ))}
      </div>
    </div>
  );
});

export default CarouselClassic;