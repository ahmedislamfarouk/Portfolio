'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Steve Colors ──────────────────────────────────────────

const STEVE_COLORS = {
  skin: '#D4A574',
  hair: '#3E2723',
  shirt: '#1565C0',
  pants: '#1A237E',
  shoes: '#212121',
  eyes: '#FFFFFF',
  pupils: '#1a1a1a',
} as const;

// ── Steve Component ───────────────────────────────────────

interface SteveProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Steve({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: SteveProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);

  // Idle bob animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Idle bob
    groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.03;

    // Arm swing when "walking"
    const walkSpeed = 4;
    const walkAmount = Math.sin(t * walkSpeed) * 0.4;

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = walkAmount;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -walkAmount;
    }
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = -walkAmount * 0.8;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = walkAmount * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Head */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={STEVE_COLORS.skin} roughness={0.8} />
      </mesh>

      {/* Hair (top of head) */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[0.82, 0.1, 0.82]} />
        <meshStandardMaterial color={STEVE_COLORS.hair} roughness={0.9} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 1.65, 0.41]}>
        <boxGeometry args={[0.12, 0.12, 0.02]} />
        <meshStandardMaterial color={STEVE_COLORS.eyes} />
      </mesh>
      <mesh position={[0.15, 1.65, 0.41]}>
        <boxGeometry args={[0.12, 0.12, 0.02]} />
        <meshStandardMaterial color={STEVE_COLORS.eyes} />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.15, 1.65, 0.42]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color={STEVE_COLORS.pupils} />
      </mesh>
      <mesh position={[0.15, 1.65, 0.42]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color={STEVE_COLORS.pupils} />
      </mesh>

      {/* Body (shirt) */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.8, 0.9, 0.45]} />
        <meshStandardMaterial color={STEVE_COLORS.shirt} roughness={0.8} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.55, 1.3, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.3, 0.7, 0.35]} />
          <meshStandardMaterial color={STEVE_COLORS.shirt} roughness={0.8} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.65, 0]}>
          <boxGeometry args={[0.28, 0.15, 0.33]} />
          <meshStandardMaterial color={STEVE_COLORS.skin} roughness={0.8} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.55, 1.3, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.3, 0.7, 0.35]} />
          <meshStandardMaterial color={STEVE_COLORS.shirt} roughness={0.8} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.65, 0]}>
          <boxGeometry args={[0.28, 0.15, 0.33]} />
          <meshStandardMaterial color={STEVE_COLORS.skin} roughness={0.8} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.2, 0.5, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.35, 0.5, 0.4]} />
          <meshStandardMaterial color={STEVE_COLORS.pants} roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.5, 0.05]}>
          <boxGeometry args={[0.36, 0.12, 0.45]} />
          <meshStandardMaterial color={STEVE_COLORS.shoes} roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.2, 0.5, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.35, 0.5, 0.4]} />
          <meshStandardMaterial color={STEVE_COLORS.pants} roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.5, 0.05]}>
          <boxGeometry args={[0.36, 0.12, 0.45]} />
          <meshStandardMaterial color={STEVE_COLORS.shoes} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
