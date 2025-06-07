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

interface CarouselHandle {
  setSelectedIndex: (index: number) => void;
}

interface CarouselProps {
  skips: Skip[];
  groupRef: React.RefObject<THREE.Group>;
  text3d?: boolean;
  lastSelectedIndexRef: React.MutableRefObject<number>;
  onSelect?: (skipId: string | null) => void;
}

const Carousel = React.forwardRef<CarouselHandle, CarouselProps>(
  ({ skips, groupRef, text3d, lastSelectedIndexRef, onSelect }, ref) => {
    const totalSkips = skips.length;
    const [rotation, setRotation] = useState(0); // Y rotation in radians (not including extra tilt)
    // Compute the selected index based on the current rotation and extra tilt
    const selectedIndex = ((-Math.round(((rotation + WHEEL_Y_EXTRA_TILT) / (2 * Math.PI)) * totalSkips) % totalSkips) + totalSkips) % totalSkips;

    React.useEffect(() => {
      if (lastSelectedIndexRef) lastSelectedIndexRef.current = selectedIndex;
      if (onSelect) onSelect(skips[selectedIndex]?.id ?? null);
    }, [selectedIndex, skips, lastSelectedIndexRef, onSelect]);

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
        const step = deltaX > 0 ? -1 : 1;
        setRotation((prev) => prev + step * (2 * Math.PI / totalSkips));
        setIsDragging(false);
      }
      setPreviousMouseX(e.clientX);
    };

    React.useImperativeHandle(ref, () => ({
      setSelectedIndex: (index: number) => {
        setRotation(-index * (2 * Math.PI / totalSkips));
      },
    }));

    return (
      <group
        ref={groupRef}
        position={[WHEEL_X_OFFSET, 0, 0]}
        rotation={[TILT_X, rotation + WHEEL_Y_EXTRA_TILT, 0]}
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
  }
);

const Carousel3D = forwardRef<Carousel3DRef, Carousel3DProps>(({ skips, text3d, onSelect }, ref) => {
  const lastSelectedIndexRef = React.useRef<number>(0);
  const groupRef = useRef<THREE.Group>(null!);
  const carouselHandle = useRef<CarouselHandle>(null);

  useImperativeHandle(ref, () => ({
    rotateBy: (radians: number) => {
      if (!skips.length) return;
      // Find the current selected index
      const current = lastSelectedIndexRef.current ?? 0;
      const total = skips.length;
      // Calculate how many steps to rotate
      const step = Math.round(radians / (2 * Math.PI / total));
      const next = (current + step + total) % total;
      // Use the Carousel's setSelectedIndex
      carouselHandle.current?.setSelectedIndex(next);
    },
  }));

  return (
    <Canvas camera={{ position: [0, 0, 16], fov: 50 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {/* Render the spinning wheel without the selected item */}
      <Carousel
        ref={carouselHandle}
        skips={skips}
        groupRef={groupRef}
        text3d={text3d}
        lastSelectedIndexRef={lastSelectedIndexRef}
        onSelect={onSelect}
      />
    </Canvas>
  );
});

export default Carousel3D;
