'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Simple Voxel Block (instanced for performance) ────────

function VoxelBlocks({
  positions,
  color,
  emissive,
}: {
  positions: [number, number, number][];
  color: string;
  emissive?: string;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    positions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={emissive || '#000000'} emissiveIntensity={emissive ? 0.3 : 0} />
    </instancedMesh>
  );
}

// ── The Skyblock Island ───────────────────────────────────

function SkyblockIsland() {
  // GRASS TOP (5x5 = 25 blocks)
  const grassPositions: [number, number, number][] = [];
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      grassPositions.push([x, 0, z]);
    }
  }

  // DIRT LAYER (5x5 = 25 blocks)
  const dirtPositions: [number, number, number][] = [];
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      dirtPositions.push([x, -1, z]);
    }
  }

  // DIRT LAYER 2 (3x3 = 9 blocks)
  const dirt2Positions: [number, number, number][] = [];
  for (let x = -1; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      dirt2Positions.push([x, -2, z]);
    }
  }

  // BEDROCK (2x2 = 4 blocks)
  const bedrockPositions: [number, number, number][] = [
    [0, -3, 0], [1, -3, 0], [0, -3, 1], [1, -3, 1],
  ];

  // TREE TRUNK (3 blocks)
  const trunkPositions: [number, number, number][] = [
    [-2, 1, -2], [-2, 2, -2], [-2, 3, -2],
  ];

  // TREE LEAVES (9 blocks)
  const leavesPositions: [number, number, number][] = [
    [-2, 4, -2], [-1, 4, -2], [-3, 4, -2],
    [-2, 4, -1], [-2, 4, -3],
    [-1, 4, -1], [-3, 4, -3],
    [-1, 4, -3], [-3, 4, -1],
  ];

  // CHEST (2 blocks)
  const chestPositions: [number, number, number][] = [
    [2, 0.5, 2], [2, 1, 2],
  ];

  // SIGN (showing "AHMED BADR")
  const signPositions: [number, number, number][] = [
    [0, 1.5, 3],
  ];

  // WATER BELOW (4x4 = 16 blocks, transparent)
  const waterPositions: [number, number, number][] = [];
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      if (Math.abs(x) === 2 || Math.abs(z) === 2) {
        waterPositions.push([x, -4, z]);
      }
    }
  }

  // ORE BLOCKS (representing projects)
  const orePositions: [number, number, number][] = [
    [2, 0, -1],  // Diamond ore
    [2, 0, 0],   // Emerald ore
    [-2, 0, 1],  // Gold ore
    [-1, 0, 2],  // Iron ore
  ];

  // TORCH (2 blocks)
  const torchPositions: [number, number, number][] = [
    [1, 0.5, -2], [1, 1, -2],
  ];

  return (
    <group>
      {/* Grass blocks */}
      <VoxelBlocks positions={grassPositions} color="#4CAF50" />

      {/* Dirt blocks */}
      <VoxelBlocks positions={dirtPositions} color="#8B4513" />
      <VoxelBlocks positions={dirt2Positions} color="#8B4513" />

      {/* Bedrock */}
      <VoxelBlocks positions={bedrockPositions} color="#1a1a1a" />

      {/* Tree trunk */}
      <VoxelBlocks positions={trunkPositions} color="#6D4C41" />

      {/* Tree leaves */}
      <VoxelBlocks positions={leavesPositions} color="#2E7D32" />

      {/* Chest */}
      <VoxelBlocks positions={chestPositions} color="#FFD700" />

      {/* Sign post */}
      <VoxelBlocks positions={signPositions} color="#6D4C41" />

      {/* Water ring */}
      <VoxelBlocks positions={waterPositions} color="#2196F3" />

      {/* Ore blocks (projects) */}
      <VoxelBlocks positions={orePositions} color="#607D8B" emissive="#4FC3F7" />

      {/* Torch */}
      <VoxelBlocks positions={torchPositions} color="#6D4C41" />

      {/* Torch light */}
      <pointLight position={[1, 1.5, -2]} color="#FF6600" intensity={5} distance={8} />

      {/* Sign text (HTML overlay handled outside) */}
    </group>
  );
}

// ── Steve Character ───────────────────────────────────────

function Steve() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Gentle bob animation
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#FFCC99" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 1.85, 0.26]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 1.85, 0.26]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Body (blue shirt) */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#0066CC" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.35, 1.1, 0]}>
        <boxGeometry args={[0.2, 0.7, 0.3]} />
        <meshStandardMaterial color="#0066CC" />
      </mesh>
      <mesh position={[0.35, 1.1, 0]}>
        <boxGeometry args={[0.2, 0.7, 0.3]} />
        <meshStandardMaterial color="#0066CC" />
      </mesh>
      {/* Legs (blue pants) */}
      <mesh position={[-0.12, 0.4, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.3]} />
        <meshStandardMaterial color="#0044AA" />
      </mesh>
      <mesh position={[0.12, 0.4, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.3]} />
        <meshStandardMaterial color="#0044AA" />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.12, 0.1, 0.05]}>
        <boxGeometry args={[0.2, 0.15, 0.35]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.12, 0.1, 0.05]}>
        <boxGeometry args={[0.2, 0.15, 0.35]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// ── Floating Clouds ───────────────────────────────────────

function Clouds() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.02;
  });

  const cloudBlocks = useMemo(() => {
    const blocks: [number, number, number][] = [];
    // Cloud 1
    blocks.push([-8, 6, -3], [-7, 6, -3], [-6, 6, -3], [-7, 6.5, -3], [-8, 6, -2], [-6, 6, -2]);
    // Cloud 2
    blocks.push([7, 8, 2], [8, 8, 2], [9, 8, 2], [8, 8.5, 2], [7, 8, 3], [9, 8, 3]);
    // Cloud 3
    blocks.push([-5, 10, 5], [-4, 10, 5], [-3, 10, 5], [-4, 10.5, 5]);
    return blocks;
  }, []);

  return (
    <group ref={groupRef}>
      <instancedMesh args={[undefined, undefined, cloudBlocks.length]}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
      </instancedMesh>
    </group>
  );
}

// ── Stars ─────────────────────────────────────────────────

function Stars() {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      // Seeded pseudo-random for deterministic positions
      const seed = i * 127.1 + 311.7;
      const x = Math.sin(seed) * 43758.5453 % 1;
      const y = Math.sin(seed * 0.7) * 43758.5453 % 1;
      const z = Math.sin(seed * 1.3) * 43758.5453 % 1;
      pos[i * 3] = (x - 0.5) * 100;
      pos[i * 3 + 1] = (y - 0.5) * 100;
      pos[i * 3 + 2] = (z - 0.5) * 100;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.15} sizeAttenuation />
    </points>
  );
}

// ── Main Scene ────────────────────────────────────────────

function Scene({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  const islandRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!islandRef.current) return;
    // Rotate island based on scroll (full 360 degrees)
    islandRef.current.rotation.y = scrollProgress.current * Math.PI * 2;
  });

  return (
    <>
      {/* Sky color */}
      <color attach="background" args={['#1a237e']} />

      {/* Lighting */}
      <ambientLight intensity={0.4} color="#87CEEB" />
      <directionalLight position={[10, 20, 10]} intensity={1.2} color="#FFF8E1" />
      <hemisphereLight args={['#87CEEB', '#8B6914', 0.3]} />

      {/* The rotating island */}
      <group ref={islandRef}>
        <SkyblockIsland />
        <Steve />
      </group>

      {/* Clouds (don't rotate with island) */}
      <Clouds />

      {/* Stars (don't rotate with island) */}
      <Stars />
    </>
  );
}

// ── Progress Bar ──────────────────────────────────────────

function ProgressBar({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (barRef.current) {
        barRef.current.style.width = `${scrollProgress.current * 100}%`;
      }
      requestAnimationFrame(update);
    };
    const raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'rgba(255,255,255,0.1)',
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #06B6D4, #7C3AED)',
          width: '0%',
        }}
      />
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────

export default function MinecraftWorld() {
  const scrollProgress = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalHeight = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      scrollProgress.current = Math.max(0, Math.min(1, scrolled / totalHeight));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(container);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: '300vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {isVisible && (
          <Canvas
            camera={{ fov: 50, near: 0.1, far: 200, position: [0, 5, 15] }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            style={{ width: '100%', height: '100%' }}
          >
            <Scene scrollProgress={scrollProgress} />
          </Canvas>
        )}

        {/* Overlay text */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            SCROLL TO ROTATE THE ISLAND
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar scrollProgress={scrollProgress} />
      </div>
    </div>
  );
}
