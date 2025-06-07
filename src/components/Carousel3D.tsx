import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Plane, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Skip } from '../hooks/useSkips';

interface Carousel3DProps {
  skips: Skip[];
  onSelect: (skipId: string | null) => void;
}

const CYLINDER_RADIUS = 3;

interface SkipPlaneProps {
  skip: Skip;
  index: number;
  totalSkips: number;
  selected: boolean;
  onSelect: (skipId: string) => void;
}

const SkipPlane: React.FC<SkipPlaneProps> = ({ skip, index, totalSkips, selected, onSelect }) => {
  const angle = (index / totalSkips) * Math.PI * 2;
  const x = CYLINDER_RADIUS * Math.cos(angle);
  const z = CYLINDER_RADIUS * Math.sin(angle);
  const rotationY = -angle + Math.PI / 2;

  const texture = useMemo(() => new THREE.TextureLoader().load(skip.imageUrl), [skip.imageUrl]);

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <Plane args={[2, 2]} onClick={() => onSelect(skip.id)}>
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} transparent opacity={selected ? 1 : 0.7} />
      </Plane>
      <Text position={[0, -1.2, 0.1]} fontSize={0.3} color="white">
        {skip.size}
      </Text>
    </group>
  );
};

interface CarouselProps {
  skips: Skip[];
  onSelect: (skipId: string | null) => void;
  setSelectedSkip: React.Dispatch<React.SetStateAction<string | null>>;
}

const Carousel: React.FC<CarouselProps> = ({ skips, onSelect, setSelectedSkip }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [previousMouseX, setPreviousMouseX] = useState(0);
  const lastSelectedIndexRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent<Element>) => {
    setIsDragging(true);
    setPreviousMouseX(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent<Element>) => {
    if (!isDragging || !groupRef.current) return;
    const deltaX = e.clientX - previousMouseX;
    groupRef.current.rotation.y += deltaX * 0.01;
    setPreviousMouseX(e.clientX);
  };
  
  useFrame(() => {
    if (!groupRef.current || skips.length === 0) return;

    const rotationY = groupRef.current.rotation.y;
    const totalSkips = skips.length;
    
    const normalizedRotation = (rotationY % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI);
    
    let minDistance = Infinity;
    let selectedIndex = 0;
    
    skips.forEach((_, index) => {
      const skipAngle = (index / totalSkips) * Math.PI * 2;
      let distance = Math.abs(normalizedRotation - skipAngle);
      distance = Math.min(distance, 2 * Math.PI - distance);
      
      if (distance < minDistance) {
        minDistance = distance;
        selectedIndex = index;
      }
    });
    
    if (lastSelectedIndexRef.current !== selectedIndex) {
      lastSelectedIndexRef.current = selectedIndex;
      const selected = skips[selectedIndex];
      if (selected) {
        setSelectedSkip(selected.id);
        onSelect(selected.id);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerUp} 
    >
      {skips.map((skip, index) => (
        <SkipPlane
          key={skip.id}
          skip={skip}
          index={index}
          totalSkips={skips.length}
          onSelect={() => onSelect(skip.id)}
          selected={lastSelectedIndexRef.current === index}
        />
      ))}
    </group>
  );
};

const Carousel3D: React.FC<Carousel3DProps> = ({ skips, onSelect }) => {
  const [selectedSkip, setSelectedSkip] = useState<string | null>(null);

  useEffect(() => {
    if(skips.length > 0 && !selectedSkip) {
      onSelect(skips[0].id)
      setSelectedSkip(skips[0].id)
    }
  }, [skips, selectedSkip, onSelect]);

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Carousel skips={skips} onSelect={onSelect} setSelectedSkip={setSelectedSkip} />
    </Canvas>
  );
};

export default Carousel3D;
