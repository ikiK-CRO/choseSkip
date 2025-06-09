import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, useCallback, useMemo } from 'react';
import type { Skip } from '../hooks/useSkips';
import { CarouselCard } from './carousel/CarouselCard';
import { DotIndicator } from './carousel/DotIndicator';

export interface CarouselClassicRef {
  goTo: (index: number) => void;
}

interface CarouselClassicProps {
  skips: Skip[];
  onSelect?: (skipId: string | null) => void;
  isLoading?: boolean;
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

const CarouselClassic = React.memo(forwardRef<CarouselClassicRef, CarouselClassicProps>(({ 
  skips, 
  onSelect,
  isLoading = false 
}, ref) => {
  const isMobile = useIsMobile();
  const [selectedIndex, setSelectedIndex] = useState(() => Math.floor(skips.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);

  // Use refs for mutable drag/touch states that don't trigger re-renders
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const touchDraggingRef = useRef(false);
  const touchStartXRef = useRef(0);

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

  // Memoized navigation functions
  const prev = useCallback(() => setSelectedIndex(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setSelectedIndex(i => Math.min(skips.length - 1, i + 1)), [skips.length]);

  // Drag navigation
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
  }, []);

  const handleDragEnd = useCallback((e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (deltaX > 40) prev();
    else if (deltaX < -40) next();
    draggingRef.current = false;
  }, [prev, next]);

  // Touch navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchDraggingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchDraggingRef.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    if (deltaX > 40) prev();
    else if (deltaX < -40) next();
    touchDraggingRef.current = false;
  }, [prev, next]);

  // Show 3 on mobile, 5 on desktop, always center selected, pad with empty slots
  const getDisplaySlots = useMemo(() => {
    return () => {
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
  }, [isMobile, selectedIndex, skips.length]);

  // Find min/max yard size for scaling
  const [minYard, maxYard] = useMemo(() => {
    const all = skips.map(s => getYardValue(s.size));
    const min = Math.min(...all);
    const max = Math.max(...all);
    return [min, max]; // Only return min and max
  }, [skips]);

  // Base sizes for cards
  const [baseCardSize, baseSideCardSize] = useMemo(() => {
    const base = isMobile ? 160 : 220;
    const side = isMobile ? 90 : 140;
    return [base, side];
  }, [isMobile]);

  // Scale factor for cards based on yard size
  const getCardScale = useCallback((size: string) => {
    const yard = getYardValue(size);
    return 0.8 + 0.4 * ((yard - minYard) / (maxYard - minYard || 1));
  }, [minYard, maxYard]);

  // Scale factor for images within cards
  const getImgScale = useCallback((size: string, isCenter: boolean) => {
    const yard = getYardValue(size);
    if (isCenter) {
      return 0.9 + 0.3 * ((yard - minYard) / (maxYard - minYard || 1));
    } else {
      return 0.7 + 0.2 * ((yard - minYard) / (maxYard - minYard || 1));
    }
  }, [minYard, maxYard]);

  const cardPadding = useMemo(() => (isMobile ? 2 : 6), [isMobile]);

  const [atStart, atEnd] = useMemo(() => {
    const start = selectedIndex === 0;
    const end = selectedIndex === skips.length - 1;
    return [start, end];
  }, [selectedIndex, skips.length]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center" style={{ height: isMobile ? 170 : 260 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        <p className="mt-4 text-gray-600">Loading skips...</p>
      </div>
    );
  }

  if (skips.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center" style={{ height: isMobile ? 170 : 260 }}>
        <p className="text-gray-600">No skips available</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        className="relative w-full select-none" 
        style={{ height: isMobile ? 170 : 260 }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Skip size carousel"
      >
        {/* Carousel items wrapper, flex properties are on this parent now */}
        <div
          className="flex items-center justify-center w-full h-full"
          ref={containerRef}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleTouchStart} 
          onTouchEnd={handleTouchEnd}   
          style={{ cursor: 'grab', userSelect: 'none', maxWidth: isMobile ? 340 : 900, margin: '0 auto' }}
        >
          {/* Left arrow, only show if not at start */}
          {!atStart && (
            <button
              className="z-20 bg-black/60 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 flex items-center justify-center"
              style={{
                width: isMobile ? 36 : 40,
                height: isMobile ? 36 : 40,
                marginRight: isMobile ? 4 : 12, // Adjusted margin
                pointerEvents: 'auto',
              }}
              onClick={prev}
              aria-label="Previous skip"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>
          )}

          {skips.length > 0 ? (
            getDisplaySlots().map((idx: number | null, pos: number) => {
              if (idx === null) {
                // Placeholder slot
                return (
                  <div
                    key={`empty-${pos}`}
                    className="flex flex-col items-center justify-center transition-all duration-300 z-0"
                    style={{
                      margin: isMobile ? '0 2px' : '0 8px',
                      width: baseSideCardSize,
                      height: baseSideCardSize,
                      background: 'transparent',
                    }}
                  />
                );
              }
              const skip = skips[idx];
              const isCenter = idx === selectedIndex;
              const cardScale = getCardScale(skip.size);
              const cardSize = isCenter ? baseCardSize : baseSideCardSize;
              const imgScale = getImgScale(skip.size, isCenter);

              return (
                <CarouselCard
                  key={skip.id}
                  skip={skip}
                  isCenter={isCenter}
                  isMobile={isMobile}
                  cardScale={cardScale}
                  imgScale={imgScale}
                  cardSize={cardSize}
                  cardPadding={cardPadding}
                />
              );
            })
          ) : (
            <p className="text-gray-600">No skips available</p>
          )}

          {/* Right arrow, only show if not at end */}
          {!atEnd && (
            <button
              className="z-20 bg-black/60 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 flex items-center justify-center"
              style={{
                width: isMobile ? 36 : 40,
                height: isMobile ? 36 : 40,
                marginLeft: isMobile ? 4 : 12, // Adjusted margin
                pointerEvents: 'auto',
              }}
              onClick={next}
              aria-label="Next skip"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <DotIndicator
        skips={skips}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
    </div>
  );
}));

export default CarouselClassic;