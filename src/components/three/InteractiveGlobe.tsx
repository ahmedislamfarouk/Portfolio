'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Location Pins ─────────────────────────────────────────

const PINS = [
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, primary: true },
  { name: 'Louisville, KY', lat: 38.2527, lng: -85.7585 },
  { name: 'Blacksburg, VA', lat: 37.2296, lng: -80.4139 },
  { name: 'Harrisonburg, VA', lat: 38.4496, lng: -78.8689 },
];

// ── Lat/Lng to 3D position ────────────────────────────────

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// ── Globe Wireframe Sphere ────────────────────────────────

function GlobeWireframe({ radius }: { radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  const wireframeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#06B6D4'),
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      }),
    [],
  );

  return (
    <mesh ref={meshRef} material={wireframeMaterial}>
      <sphereGeometry args={[radius, 32, 32]} />
    </mesh>
  );
}

// ── Globe Meridians & Parallels ───────────────────────────

function GlobeGrid({ radius }: { radius: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  // Build all grid lines as a single LineSegments geometry
  const { positions } = useMemo(() => {
    const pos: number[] = [];

    // Meridians
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      for (let j = 0; j < 64; j++) {
        const phi1 = (j / 64) * Math.PI;
        const phi2 = ((j + 1) / 64) * Math.PI;

        pos.push(
          radius * Math.sin(phi1) * Math.cos(angle),
          radius * Math.cos(phi1),
          radius * Math.sin(phi1) * Math.sin(angle),
        );
        pos.push(
          radius * Math.sin(phi2) * Math.cos(angle),
          radius * Math.cos(phi2),
          radius * Math.sin(phi2) * Math.sin(angle),
        );
      }
    }

    // Parallels
    for (let i = 1; i < 6; i++) {
      const phi = (i / 6) * Math.PI;
      for (let j = 0; j < 64; j++) {
        const a1 = (j / 64) * Math.PI * 2;
        const a2 = ((j + 1) / 64) * Math.PI * 2;

        pos.push(
          radius * Math.sin(phi) * Math.cos(a1),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(a1),
        );
        pos.push(
          radius * Math.sin(phi) * Math.cos(a2),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(a2),
        );
      }
    }

    return { positions: new Float32Array(pos) };
  }, [radius]);

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#06B6D4" transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
}

// ── Location Pin ──────────────────────────────────────────

function LocationPin({
  pin,
  radius,
  isHovered,
  onHover,
}: {
  pin: (typeof PINS)[number];
  radius: number;
  isHovered: boolean;
  onHover: (pin: (typeof PINS)[number] | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.PointLight>(null!);

  const position = useMemo(
    () => latLngToVector3(pin.lat, pin.lng, radius),
    [pin, radius],
  );

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.8 : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );
    }
    if (glowRef.current) {
      glowRef.current.intensity = isHovered ? 3 : 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(pin);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color={pin.primary ? '#06B6D4' : '#22D3EE'}
          emissive={pin.primary ? '#06B6D4' : '#22D3EE'}
          emissiveIntensity={isHovered ? 3 : 0.8}
        />
      </mesh>
      <pointLight
        ref={glowRef}
        color={pin.primary ? '#06B6D4' : '#22D3EE'}
        intensity={0.5}
        distance={1}
        decay={2}
      />
    </group>
  );
}

// ── Globe Scene ───────────────────────────────────────────

function GlobeScene() {
  const [hoveredPin, setHoveredPin] = useState<(typeof PINS)[number] | null>(null);
  const radius = 1.5;

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 5]} intensity={0.6} color="#06B6D4" />
      <pointLight position={[-3, -2, 3]} intensity={0.3} color="#7C3AED" />

      <GlobeWireframe radius={radius} />
      <GlobeGrid radius={radius} />

      {PINS.map((pin) => (
        <LocationPin
          key={pin.name}
          pin={pin}
          radius={radius}
          isHovered={hoveredPin?.name === pin.name}
          onHover={setHoveredPin}
        />
      ))}
    </>
  );
}

// ── Main Component ────────────────────────────────────────

export default function InteractiveGlobe() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <div className="w-full aspect-square max-w-[300px] mx-auto relative">
        <div
          className="w-full h-full rounded-full border border-border opacity-50"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.15), transparent 60%)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary mb-2">
              GLOBAL REACH
            </div>
            <div className="font-mono text-[11px] text-text-secondary">
              Cairo · Louisville · VA
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-square max-w-[350px] mx-auto cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <GlobeScene />
      </Canvas>
    </div>
  );
}
