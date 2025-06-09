import React from 'react';
import type { Skip } from '../../hooks/useSkips';

interface DotIndicatorProps {
  skips: Skip[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const DotIndicator: React.FC<DotIndicatorProps> = ({
  skips,
  selectedIndex,
  onSelect,
}) => {
  return (
    <div 
      className="flex items-center justify-center mt-4 gap-2"
      role="tablist"
      aria-label="Skip size navigation"
    >
      {skips.map((skip, idx) => (
        <button
          key={skip.id}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            idx === selectedIndex ? 'bg-blue-500 scale-125' : 'bg-gray-400 scale-100'
          }`}
          onClick={() => onSelect(idx)}
          aria-label={`Go to ${skip.size} skip`}
          aria-selected={idx === selectedIndex}
          role="tab"
          style={{ outline: 'none', border: 'none' }}
        />
      ))}
    </div>
  );
}; 