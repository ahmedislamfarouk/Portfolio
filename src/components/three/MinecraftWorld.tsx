'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import {
  VoxelBlock,
  NetherPortal,
  GlowingBlock,
  SignBlock,
  CropBlock,
  WaterBlock,
  EnchantingTable,
} from './VoxelBlocks';
import Steve from './Steve';
import Clouds from './Clouds';

// ── Seeded random for deterministic positions ─────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ── Camera Path ───────────────────────────────────────────

const CAMERA_WAYPOINTS = [
  new THREE.Vector3(0, 6, 14),     // Start: looking at spawn
  new THREE.Vector3(2, 4, 6),      // Move toward farm
  new THREE.Vector3(-3, 3, -2),    // Move to mine
  new THREE.Vector3(4, 4, -8),     // Move to enchanting
  new THREE.Vector3(0, 3.5, -14),  // Move to nether portal
];

const LOOK_AHEAD_OFFSET = 0.02;

// ── Sky Gradient ──────────────────────────────────────────

function SkyGradient() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const material = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#1a237e');    // Deep blue top
    gradient.addColorStop(0.3, '#4fc3f7');  // Light blue
    gradient.addColorStop(0.6, '#81d4fa');  // Pale blue
    gradient.addColorStop(0.8, '#b3e5fc');  // Near horizon
    gradient.addColorStop(1, '#e1f5fe');    // Horizon

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;

    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh ref={meshRef} scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 16, 16]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ── Spawn Point (Hero Area) ───────────────────────────────

function SpawnPoint() {
  return (
    <group position={[0, 0, 10]}>
      {/* Main grass platform */}
      {Array.from({ length: 5 }, (_, x) =>
        Array.from({ length: 5 }, (_, z) => (
          <VoxelBlock
            key={`spawn-grass-${x}-${z}`}
            position={[x - 2, 0, z - 2]}
            type="grass"
          />
        ))
      )}

      {/* Dirt layer */}
      {Array.from({ length: 5 }, (_, x) =>
        Array.from({ length: 5 }, (_, z) => (
          <VoxelBlock
            key={`spawn-dirt-${x}-${z}`}
            position={[x - 2, -1, z - 2]}
            type="dirt"
          />
        ))
      )}

      {/* Bedrock bottom */}
      {Array.from({ length: 5 }, (_, x) =>
        Array.from({ length: 5 }, (_, z) => (
          <VoxelBlock
            key={`spawn-bedrock-${x}-${z}`}
            position={[x - 2, -2, z - 2]}
            type="bedrock"
          />
        ))
      )}

      {/* Name sign */}
      <SignBlock
        position={[0, 1.5, 2.5]}
        text="AHMED BADR"
      />

      {/* Decorative tree */}
      <group position={[-2, 0, -2]}>
        {/* Trunk */}
        <VoxelBlock position={[0, 1, 0]} type="wood" />
        <VoxelBlock position={[0, 2, 0]} type="wood" />
        <VoxelBlock position={[0, 3, 0]} type="wood" />
        {/* Leaves */}
        {[
          [0, 4, 0], [1, 4, 0], [-1, 4, 0], [0, 4, 1], [0, 4, -1],
          [1, 3, 1], [-1, 3, -1], [1, 3, -1], [-1, 3, 1],
        ].map((pos, i) => (
          <VoxelBlock key={`leaf-${i}`} position={pos as [number, number, number]} type="leaves" />
        ))}
      </group>

      {/* Torch for light */}
      <group position={[2, 0.5, 2]}>
        <VoxelBlock position={[0, 0, 0]} type="wood" scale={[0.1, 0.3, 0.1]} />
        <GlowingBlock
          position={[0, 0.2, 0]}
          color="#FF6600"
          emissiveColor="#FF4500"
          intensity={2}
          scale={[0.15, 0.15, 0.15]}
        />
        <pointLight color="#FF6600" intensity={3} distance={6} decay={2} position={[0, 0.3, 0]} />
      </group>
    </group>
  );
}

// ── Farm Area (About) ─────────────────────────────────────

function FarmArea() {
  return (
    <group position={[0, -1, 2]}>
      {/* Farm platform */}
      {Array.from({ length: 7 }, (_, x) =>
        Array.from({ length: 5 }, (_, z) => (
          <VoxelBlock
            key={`farm-grass-${x}-${z}`}
            position={[x - 3, 0, z - 2]}
            type="grass"
          />
        ))
      )}

      {/* Dirt under farm */}
      {Array.from({ length: 7 }, (_, x) =>
        Array.from({ length: 5 }, (_, z) => (
          <VoxelBlock
            key={`farm-dirt-${x}-${z}`}
            position={[x - 3, -1, z - 2]}
            type="dirt"
          />
        ))
      )}

      {/* Water channel */}
      {Array.from({ length: 5 }, (_, x) => (
        <WaterBlock key={`farm-water-${x}`} position={[x - 2, -0.1, 0]} />
      ))}

      {/* Crop rows */}
      {Array.from({ length: 3 }, (_, row) => (
        <group key={`crop-row-${row}`}>
          {Array.from({ length: 3 }, (_, col) => (
            <CropBlock
              key={`crop-${row}-${col}`}
              position={[col - 1 + (row % 2) * 0.5, 0, -2 + row * 0.8]}
              growth={0.6 + Math.random() * 0.4}
            />
          ))}
        </group>
      ))}

      {/* Signs with stats */}
      <SignBlock position={[-3, 1.5, 2.5]} text="AI RESEARCHER" rotation={[0, 0.3, 0]} />
      <SignBlock position={[3, 1.5, 2.5]} text="ROBOTICS ENGINEER" rotation={[0, -0.3, 0]} />

      {/* Fence posts */}
      {[-3, -1, 1, 3].map((x) => (
        <VoxelBlock key={`fence-${x}`} position={[x, 0.5, -2.5]} type="wood" scale={[0.15, 0.6, 0.15]} />
      ))}
      {/* Fence rails */}
      <VoxelBlock position={[0, 0.65, -2.5]} type="wood" scale={[6.5, 0.1, 0.1]} />

      {/* Animal pen with a "cow" (simple box) */}
      <group position={[2.5, 0, -1.5]}>
        <VoxelBlock position={[0, 0.4, 0]} type="wood" scale={[0.6, 0.5, 0.8]} /> {/* Body */}
        <VoxelBlock position={[0, 0.8, 0.3]} type="wood" scale={[0.3, 0.3, 0.3]} /> {/* Head */}
      </group>
    </group>
  );
}

// ── Mine Area (Projects) ──────────────────────────────────

function MineArea() {
  const projects = useMemo(() => [
    { name: "Renal Rejection AI", ore: 'diamond_ore' as const, pos: [-1, 1, 0] as [number, number, number] },
    { name: "Autonomous Fleet", ore: 'gold_ore' as const, pos: [1, 0.5, 1] as [number, number, number] },
    { name: "SkyVision Swarm", ore: 'emerald_ore' as const, pos: [0, 1.5, -1] as [number, number, number] },
    { name: "Intelligent Assets", ore: 'iron_ore' as const, pos: [-2, 0.5, 0.5] as [number, number, number] },
    { name: "Emotion Recog", ore: 'coal_ore' as const, pos: [2, 1, -0.5] as [number, number, number] },
    { name: "Sobriety Detection", ore: 'redstone_ore' as const, pos: [0.5, 0.5, 1.5] as [number, number, number] },
  ], []);

  return (
    <group position={[-3, -2, -2]}>
      {/* Cave floor */}
      {Array.from({ length: 8 }, (_, x) =>
        Array.from({ length: 6 }, (_, z) => (
          <VoxelBlock
            key={`mine-stone-${x}-${z}`}
            position={[x - 4, 0, z - 3]}
            type="stone"
          />
        ))
      )}

      {/* Cave walls */}
      {Array.from({ length: 4 }, (_, y) =>
        Array.from({ length: 6 }, (_, z) => (
          <VoxelBlock
            key={`mine-wall-left-${y}-${z}`}
            position={[-4, y + 1, z - 3]}
            type="stone"
          />
        ))
      )}
      {Array.from({ length: 4 }, (_, y) =>
        Array.from({ length: 6 }, (_, z) => (
          <VoxelBlock
            key={`mine-wall-right-${y}-${z}`}
            position={[4, y + 1, z - 3]}
            type="stone"
          />
        ))
      )}

      {/* Cave ceiling */}
      {Array.from({ length: 8 }, (_, x) =>
        Array.from({ length: 6 }, (_, z) => (
          <VoxelBlock
            key={`mine-ceiling-${x}-${z}`}
            position={[x - 4, 5, z - 3]}
            type="stone"
          />
        ))
      )}

      {/* Ore blocks (representing projects) */}
      {projects.map((project, i) => (
        <group key={i}>
          <VoxelBlock position={project.pos} type={project.ore} />
          <SignBlock
            position={[project.pos[0], project.pos[1] + 1.5, project.pos[2]]}
            text={project.name}
          />
        </group>
      ))}

      {/* Minecart track */}
      <VoxelBlock position={[0, 0.05, 2]} type="cobble" scale={[8, 0.1, 0.3]} />

      {/* Torch lighting */}
      <group position={[-3, 3, -2]}>
        <GlowingBlock
          position={[0, 0, 0]}
          color="#FF6600"
          emissiveColor="#FF4500"
          intensity={1.5}
          scale={[0.1, 0.2, 0.1]}
        />
        <pointLight color="#FF6600" intensity={2} distance={5} decay={2} />
      </group>
      <group position={[3, 3, 2]}>
        <GlowingBlock
          position={[0, 0, 0]}
          color="#FF6600"
          emissiveColor="#FF4500"
          intensity={1.5}
          scale={[0.1, 0.2, 0.1]}
        />
        <pointLight color="#FF6600" intensity={2} distance={5} decay={2} />
      </group>
    </group>
  );
}

// ── Enchanting Room (Skills) ──────────────────────────────

function EnchantingRoom() {
  const skills = [
    "Python", "C++", "TensorFlow", "PyTorch", "ROS 2",
    "OpenCV", "Docker", "Computer Vision", "Deep Learning", "RL",
    "NLP", "LLMs", "RAG", "FAISS", "YOLOv8",
  ];

  return (
    <group position={[4, -1, -8]}>
      {/* Room floor */}
      {Array.from({ length: 6 }, (_, x) =>
        Array.from({ length: 6 }, (_, z) => (
          <VoxelBlock
            key={`enchant-floor-${x}-${z}`}
            position={[x - 3, 0, z - 3]}
            type="enchanting"
          />
        ))
      )}

      {/* Room walls */}
      {Array.from({ length: 4 }, (_, y) =>
        Array.from({ length: 6 }, (_, z) => (
          <VoxelBlock
            key={`enchant-wall-back-${y}-${z}`}
            position={[y - 2, 1, -3]}
            type="enchanting"
          />
        ))
      )}
      {Array.from({ length: 4 }, (_, y) =>
        Array.from({ length: 6 }, (_, z) => (
          <VoxelBlock
            key={`enchant-wall-left-${y}-${z}`}
            position={[-3, 1, z - 3]}
            type="enchanting"
          />
        ))
      )}

      {/* Enchanting table in center */}
      <EnchantingTable position={[0, 0, 0]} />

      {/* Bookshelves along walls */}
      {Array.from({ length: 5 }, (_, i) => (
        <group key={`shelf-${i}`} position={[-3, 1.5, -2 + i]}>
          <VoxelBlock position={[0, 0, 0]} type="bookshelf" />
          <VoxelBlock position={[0, 1, 0]} type="bookshelf" />
        </group>
      ))}

      {/* Glowstone ceiling lights */}
      {[[-1, 0], [1, 0], [0, -1], [0, 1]].map(([x, z], i) => (
        <GlowingBlock
          key={`enchant-light-${i}`}
          position={[x, 4, z]}
          color="#FFD700"
          emissiveColor="#FFA500"
          intensity={1}
          scale={[0.5, 0.2, 0.5]}
        />
      ))}

      {/* Magical particles (floating book pages) */}
      {skills.slice(0, 8).map((_, i) => (
        <group key={`particle-${i}`} position={[
          Math.cos(i * 0.8) * 2,
          2 + Math.sin(i * 1.2) * 0.5,
          Math.sin(i * 0.8) * 2,
        ]}>
          <mesh>
            <boxGeometry args={[0.15, 0.02, 0.1]} />
            <meshStandardMaterial
              color="#E1BEE7"
              emissive="#9C27B0"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* Skill signs on walls */}
      {skills.slice(0, 6).map((skill, i) => (
        <SignBlock
          key={`skill-sign-${i}`}
          position={[-2.5, 2.5, -2 + i]}
          text={skill}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}
    </group>
  );
}

// ── Nether Portal (Contact) ───────────────────────────────

function NetherPortalArea() {
  return (
    <group position={[0, -2, -14]}>
      {/* Obsidian frame */}
      {Array.from({ length: 5 }, (_, y) => (
        <group key={`portal-frame-${y}`}>
          <VoxelBlock position={[-1.5, y, 0]} type="obsidian" />
          <VoxelBlock position={[1.5, y, 0]} type="obsidian" />
        </group>
      ))}
      {/* Top bar */}
      <VoxelBlock position={[-0.5, 5, 0]} type="obsidian" />
      <VoxelBlock position={[0.5, 5, 0]} type="obsidian" />

      {/* Portal interior (purple glow) */}
      {Array.from({ length: 3 }, (_, y) =>
        Array.from({ length: 2 }, (_, x) => (
          <NetherPortal
            key={`portal-${x}-${y}`}
            position={[x - 0.5, y + 1, 0]}
          />
        ))
      )}

      {/* Portal light */}
      <pointLight
        color="#9C27B0"
        intensity={4}
        distance={8}
        decay={2}
        position={[0, 2.5, 0.5]}
      />

      {/* Netherrack base */}
      {Array.from({ length: 5 }, (_, x) => (
        <VoxelBlock
          key={`nether-base-${x}`}
          position={[x - 2, -1, 0]}
          type="netherrack"
        />
      ))}

      {/* Lava pools */}
      <WaterBlock position={[-3, -0.8, 1]} />
      <WaterBlock position={[3, -0.8, -1]} />

      {/* Fire particles */}
      {Array.from({ length: 6 }, (_, i) => (
        <GlowingBlock
          key={`fire-${i}`}
          position={[
            Math.cos(i * 1.05) * 2.5,
            0.5 + Math.sin(i * 0.7) * 0.3,
            Math.sin(i * 1.05) * 1.5,
          ]}
          color="#FF4500"
          emissiveColor="#FF0000"
          intensity={1}
          scale={[0.1, 0.2 + seededRandom(i + 700) * 0.2, 0.1]}
        />
      ))}

      {/* Social links signs */}
      <SignBlock position={[-3, 2, 2]} text="GITHUB" rotation={[0, 0.5, 0]} />
      <SignBlock position={[3, 2, 2]} text="LINKEDIN" rotation={[0, -0.5, 0]} />
      <SignBlock position={[0, 2, 3]} text="CONTACT ME" rotation={[0, 0, 0]} />
    </group>
  );
}

// ── Water Base (below island) ─────────────────────────────

function WaterBase() {
  return (
    <group position={[0, -8, -2]}>
      {Array.from({ length: 20 }, (_, x) =>
        Array.from({ length: 20 }, (_, z) => (
          <WaterBlock
            key={`water-${x}-${z}`}
            position={[x - 10, 0, z - 10]}
          />
        ))
      )}
    </group>
  );
}

// ── Connecting Pathways ───────────────────────────────────

function Pathways() {
  return (
    <group>
      {/* Path from spawn to farm */}
      {Array.from({ length: 6 }, (_, i) => (
        <VoxelBlock
          key={`path-spawn-farm-${i}`}
          position={[0, -0.5, 10 - i * 1.5]}
          type="cobble"
          scale={[1.5, 0.2, 1]}
        />
      ))}

      {/* Path from farm to mine */}
      {Array.from({ length: 6 }, (_, i) => (
        <VoxelBlock
          key={`path-farm-mine-${i}`}
          position={[-i * 0.5, -1.5, 2 - i * 0.7]}
          type="cobble"
          scale={[1.2, 0.2, 1]}
        />
      ))}

      {/* Path from mine to enchanting */}
      {Array.from({ length: 6 }, (_, i) => (
        <VoxelBlock
          key={`path-mine-enchant-${i}`}
          position={[-3 + i * 1.2, -1.5, -2 - i * 1]}
          type="cobble"
          scale={[1.2, 0.2, 1]}
        />
      ))}

      {/* Path from enchanting to portal */}
      {Array.from({ length: 6 }, (_, i) => (
        <VoxelBlock
          key={`path-enchant-portal-${i}`}
          position={[4 - i * 0.7, -1.5, -8 - i * 1]}
          type="cobble"
          scale={[1.2, 0.2, 1]}
        />
      ))}
    </group>
  );
}

// ── Camera Controller ─────────────────────────────────────

function CameraController({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  const { camera } = useThree();
  const path = useMemo(
    () => new THREE.CatmullRomCurve3(CAMERA_WAYPOINTS, false, 'catmullrom', 0.5),
    []
  );

  useFrame(() => {
    const t = scrollProgress.current;
    const point = path.getPoint(t);
    const lookAheadT = Math.min(t + LOOK_AHEAD_OFFSET, 1);
    const lookAtPoint = path.getPoint(lookAheadT);

    camera.position.copy(point);
    camera.lookAt(lookAtPoint);
  });

  return null;
}

// ── Steve on Path ─────────────────────────────────────────

function SteveOnPath({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const path = useMemo(
    () => new THREE.CatmullRomCurve3(CAMERA_WAYPOINTS, false, 'catmullrom', 0.5),
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    const t = scrollProgress.current;
    const lookAheadT = Math.min(t + 0.05, 1);
    const lookAtPoint = path.getPoint(lookAheadT);

    // Steve walks slightly ahead of camera
    const steveT = Math.min(t + 0.03, 1);
    const stevePoint = path.getPoint(steveT);

    groupRef.current.position.set(stevePoint.x, stevePoint.y - 1.2, stevePoint.z);

    // Face direction of movement
    const direction = new THREE.Vector3().subVectors(lookAtPoint, stevePoint);
    const angle = Math.atan2(direction.x, direction.z);
    groupRef.current.rotation.y = angle;
  });

  return (
    <group ref={groupRef}>
      <Steve position={[0, 0, 0]} />
    </group>
  );
}

// ── Lighting Setup ────────────────────────────────────────

function Lighting() {
  return (
    <>
      {/* Ambient light (sky) */}
      <ambientLight intensity={0.4} color="#87CEEB" />

      {/* Sun light */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        color="#FFF8E1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill light */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.3}
        color="#B3E5FC"
      />

      {/* Hemisphere light for sky/ground color */}
      <hemisphereLight
        args={['#87CEEB', '#8B6914', 0.5]}
      />
    </>
  );
}

// ── Floating Items (decorative) ───────────────────────────

function FloatingItems() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(t + i) * 0.001;
      child.rotation.y = t * 0.2 + i;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Floating diamonds */}
      {[
        [8, 8, 5],
        [-7, 10, -3],
        [5, 12, -10],
        [-6, 9, 8],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color="#4FC3F7"
            emissive="#4FC3F7"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}

      {/* Floating emeralds */}
      {[
        [9, 11, -6],
        [-8, 7, 4],
        [3, 13, 7],
      ].map((pos, i) => (
        <mesh key={`emerald-${i}`} position={pos as [number, number, number]}>
          <octahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial
            color="#4CAF50"
            emissive="#4CAF50"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Main Scene ────────────────────────────────────────────

function MinecraftScene({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 15, 45]} />

      <Lighting />
      <SkyGradient />

      {/* Stars (visible in distance) */}
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={2}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Camera & Steve */}
      <CameraController scrollProgress={scrollProgress} />
      <SteveOnPath scrollProgress={scrollProgress} />

      {/* World Areas */}
      <SpawnPoint />
      <FarmArea />
      <MineArea />
      <EnchantingRoom />
      <NetherPortalArea />

      {/* Connecting paths */}
      <Pathways />

      {/* Environment */}
      <Clouds count={15} />
      <WaterBase />
      <FloatingItems />
    </>
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
      const windowHeight = window.innerHeight;
      const totalHeight = container.offsetHeight - windowHeight;

      // Calculate progress (0 to 1)
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
      scrollProgress.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Intersection observer for performance
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
    <div
      ref={containerRef}
      style={{ height: '500vh', position: 'relative' }}
    >
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
            camera={{
              fov: 60,
              near: 0.1,
              far: 100,
              position: CAMERA_WAYPOINTS[0].toArray(),
            }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            shadows
            style={{ width: '100%', height: '100%' }}
          >
            <MinecraftScene scrollProgress={scrollProgress} />
          </Canvas>
        )}

        {/* Section labels overlay */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '2rem',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          <div className="flex flex-col gap-4 text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              SCROLL TO EXPLORE
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <ScrollProgressBar scrollProgress={scrollProgress} />
      </div>
    </div>
  );
}

// ── Scroll Progress Bar ───────────────────────────────────

function ScrollProgressBar({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  // Use requestAnimationFrame for DOM updates (outside Canvas)
  useEffect(() => {
    let raf: number;
    const update = () => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleY(${scrollProgress.current})`;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '10%',
        left: '1.5rem',
        width: '2px',
        height: '80%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '1px',
        overflow: 'hidden',
      }}
    >
      <div
        ref={barRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#06B6D4',
          transformOrigin: 'top',
          transform: 'scaleY(0)',
        }}
      />
    </div>
  );
}
