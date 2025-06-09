import React from 'react';
import type { Skip } from '../../hooks/useSkips';

interface CarouselCardProps {
  skip: Skip;
  isCenter: boolean;
  isMobile: boolean;
  cardScale: number;
  imgScale: number;
  cardSize: number;
  cardPadding: number;
}

export const CarouselCard: React.FC<CarouselCardProps> = ({
  skip,
  isCenter,
  isMobile,
  cardScale,
  imgScale,
  cardSize,
  cardPadding,
}) => {
  const scaledCardSize = cardSize * cardScale;
  const imgMax = scaledCardSize - cardPadding * 2;
  const imgSize = imgMax * imgScale;

  // Calculate margin to maintain center alignment
  const baseMargin = isCenter ? (isMobile ? 8 : 24) : (isMobile ? 2 : 8);
  const sizeDiff = scaledCardSize - cardSize;
  const adjustedMargin = baseMargin - (sizeDiff / 2);

  return (
    <div
      className={`flex flex-col items-center justify-center transition-all duration-300 ${isCenter ? 'z-20' : 'z-10'}`}
      style={{
        transform: `scale(${isCenter ? 1 : 0.8}) translateY(${isCenter ? '0px' : '20px'})`,
        opacity: isCenter ? 1 : 0.5,
        margin: `0 ${adjustedMargin}px`,
        width: scaledCardSize,
        height: scaledCardSize,
        boxShadow: isCenter ? '0 8px 32px rgba(0,0,0,0.18)' : 'none',
        background: isCenter ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
        borderRadius: 16,
        transition: 'transform 0.3s, opacity 0.3s, width 0.3s, height 0.3s, margin 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: cardPadding,
        position: 'relative'
      }}
    >
      <div className="flex flex-col items-center relative">
        <img
          src={skip.imageUrl}
          alt={skip.size}
          className="object-contain"
          draggable={false}
          loading="lazy"
          style={{ 
            pointerEvents: 'none', 
            width: imgSize, 
            height: imgSize, 
            transition: 'width 0.3s, height 0.3s' 
          }}
        />
        <div 
          className="font-semibold text-center absolute"
          style={{
            fontSize: isCenter ? (isMobile ? '1rem' : '1.25rem') : (isMobile ? '0.75rem' : '0.875rem'),
            color: isCenter ? '#1a1a1a' : '#4a4a4a',
            transition: 'all 0.3s',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)'
          }}
        >
          {skip.size}
        </div>
      </div>
    </div>
  );
}; 