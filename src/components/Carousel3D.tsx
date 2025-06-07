import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Skip } from '../hooks/useSkips';

export interface Carousel3DRef {
  rotateBy: (radians: number) => void;
}

interface Carousel3DProps {
  skips: Skip[];
  text3d?: boolean;
  onSelect?: (skipId: string | null) => void;
}

const CYLINDER_RADIUS = 6;
const TILT_X = Math.PI / 10;
const WHEEL_X_OFFSET = -CYLINDER_RADIUS * Math.sin(TILT_X) + 1.5;
const WHEEL_Y_EXTRA_TILT = 0.40 * Math.PI;

interface SkipPlaneProps {
  skip: Skip;
  index: number;
  totalSkips: number;
  selected: boolean;
  text3d?: boolean;
}

const SkipPlane: React.FC<SkipPlaneProps> = ({ skip, index, totalSkips, selected, text3d }) => {
  const angle = (index / totalSkips) * Math.PI * 2;
  const x = CYLINDER_RADIUS * Math.cos(angle);
  const z = CYLINDER_RADIUS * Math.sin(angle);
  const rotationY = -angle + Math.PI / 2;

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.9}
        color={text3d ? 'black' : selected ? '#fff' : '#ccc'}
        anchorX="center"
        anchorY="middle"
        fontWeight={selected ? 'bold' : 'normal'}
        outlineColor={text3d ? 'white' : undefined}
        outlineWidth={text3d ? 0.08 : 0}
      >
        {skip.size}
      </Text>
      {selected && (
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[4.3, 1.2]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.18} />
        </mesh>
      )}
    </group>
  );
};

interface CarouselProps {
  skips: Skip[];
  groupRef: React.RefObject<THREE.Group>;
  text3d?: boolean;
  lastSelectedIndexRef: React.MutableRefObject<number>;
  onSelect?: (skipId: string | null) => void;
}

const Carousel: React.FC<CarouselProps> = ({ skips, groupRef, text3d, lastSelectedIndexRef, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const totalSkips = skips.length;
  // Update parent and ref when selectedIndex changes
  React.useEffect(() => {
    if (lastSelectedIndexRef) lastSelectedIndexRef.current = selectedIndex;
    if (onSelect) onSelect(skips[selectedIndex]?.id ?? null);
  }, [selectedIndex, skips, lastSelectedIndexRef, onSelect]);

  // Calculate the rotation so selectedIndex is always at the front
  const baseRotation = -selectedIndex * (2 * Math.PI / totalSkips) + WHEEL_Y_EXTRA_TILT;

  // Drag logic
  const [isDragging, setIsDragging] = useState(false);
  const [previousMouseX, setPreviousMouseX] = useState(0);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    setIsDragging(true);
    setPreviousMouseX(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    if (Math.abs(deltaX) > 10) {
      if (deltaX > 0) {
        setSelectedIndex((prev) => (prev - 1 + totalSkips) % totalSkips);
      } else {
        setSelectedIndex((prev) => (prev + 1) % totalSkips);
      }
      setIsDragging(false);
    }
    setPreviousMouseX(e.clientX);
  };

  return (
    <group
      ref={groupRef}
      position={[WHEEL_X_OFFSET, 0, 0]}
      rotation={[TILT_X, baseRotation, 0]}
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
          selected={index === selectedIndex}
          text3d={text3d}
        />
      ))}
    </group>
  );
};

const Carousel3D = forwardRef<Carousel3DRef, Carousel3DProps>(({ skips, text3d, onSelect }, ref) => {
  const lastSelectedIndexRef = React.useRef<number>(0);
  const groupRef = useRef<THREE.Group>(null!);

  useImperativeHandle(ref, () => ({
    rotateBy: (radians: number) => {
      if (groupRef.current) {
        groupRef.current.rotation.y += radians;
      }
    },
  }));

  return (
    <Canvas camera={{ position: [0, 0, 16], fov: 50 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {/* Render the spinning wheel without the selected item */}
      <Carousel skips={skips} groupRef={groupRef} text3d={text3d} lastSelectedIndexRef={lastSelectedIndexRef} onSelect={onSelect} />
    </Canvas>
  );
});

export default Carousel3D;
