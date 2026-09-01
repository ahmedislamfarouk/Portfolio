'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Seeded random for deterministic positions ─────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ── Single Cloud ──────────────────────────────────────────

interface CloudProps {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}

function Cloud({ position, scale = 1, speed = 0.1 }: CloudProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const initialX = position[0];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.position.x = initialX + Math.sin(t * speed) * 0.5;
    groupRef.current.position.y = position[1] + Math.sin(t * speed * 0.7) * 0.1;
  });

  // Cloud shape from multiple boxes
  const blocks = useMemo(() => {
    const items: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    // Core block
    items.push({ pos: [0, 0, 0], size: [2, 0.5, 1.2] });
    // Left puff
    items.push({ pos: [-0.8, 0.15, 0], size: [1, 0.4, 1] });
    // Right puff
    items.push({ pos: [0.9, 0.1, 0], size: [1.2, 0.35, 1.1] });
    // Top puff
    items.push({ pos: [0.2, 0.25, 0.1], size: [1, 0.3, 0.8] });
    // Back puff
    items.push({ pos: [0, 0.1, -0.4], size: [1.5, 0.3, 0.6] });
    return items;
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {blocks.map((block, i) => (
        <mesh key={i} position={block.pos} scale={block.size}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            opacity={0.9}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Clouds Collection ─────────────────────────────────────

interface CloudsProps {
  count?: number;
  area?: { x: number; y: number; z: number; width: number; height: number; depth: number };
}

export default function Clouds({
  count = 12,
  area = { x: 0, y: 12, z: -5, width: 40, height: 4, depth: 20 },
}: CloudsProps) {
  const clouds = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        area.x + (seededRandom(i * 3) - 0.5) * area.width,
        area.y + seededRandom(i * 3 + 1) * area.height,
        area.z + (seededRandom(i * 3 + 2) - 0.5) * area.depth,
      ] as [number, number, number],
      scale: 0.8 + seededRandom(i * 5) * 0.6,
      speed: 0.05 + seededRandom(i * 7) * 0.1,
    }));
  }, [count, area]);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <Cloud
          key={i}
          position={cloud.position}
          scale={cloud.scale}
          speed={cloud.speed}
        />
      ))}
    </group>
  );
}
