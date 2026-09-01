'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Seeded random for deterministic textures ──────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ── Block Types & Colors ──────────────────────────────────

const BLOCK_COLORS = {
  grass: { top: '#4CAF50', side: '#8B6914', bottom: '#8B6914' },
  dirt: { top: '#8B6914', side: '#8B6914', bottom: '#8B6914' },
  stone: { top: '#808080', side: '#808080', bottom: '#808080' },
  wood: { top: '#A0522D', side: '#8B4513', bottom: '#A0522D' },
  leaves: { top: '#228B22', side: '#228B22', bottom: '#228B22' },
  water: { top: '#1E90FF', side: '#1E90FF', bottom: '#1E90FF' },
  bedrock: { top: '#333333', side: '#333333', bottom: '#333333' },
  sand: { top: '#F4D03F', side: '#F4D03F', bottom: '#F4D03F' },
  cobble: { top: '#696969', side: '#696969', bottom: '#696969' },
  planks: { top: '#DEB887', side: '#D2B48C', bottom: '#DEB887' },
  glass: { top: '#87CEEB', side: '#87CEEB', bottom: '#87CEEB' },
  glowstone: { top: '#FFD700', side: '#FFA500', bottom: '#FFD700' },
  netherrack: { top: '#8B0000', side: '#8B0000', bottom: '#8B0000' },
  obsidian: { top: '#1a0a2e', side: '#1a0a2e', bottom: '#1a0a2e' },
  enchanting: { top: '#1a0a3e', side: '#0f0628', bottom: '#1a0a3e' },
  diamond_ore: { top: '#808080', side: '#808080', bottom: '#808080', dots: '#4FC3F7' },
  gold_ore: { top: '#808080', side: '#808080', bottom: '#808080', dots: '#FFD700' },
  iron_ore: { top: '#808080', side: '#808080', bottom: '#808080', dots: '#FFB74D' },
  coal_ore: { top: '#808080', side: '#808080', bottom: '#808080', dots: '#424242' },
  redstone_ore: { top: '#808080', side: '#808080', bottom: '#808080', dots: '#F44336' },
  emerald_ore: { top: '#808080', side: '#808080', bottom: '#808080', dots: '#4CAF50' },
  wheat: { top: '#DAA520', side: '#8B6914', bottom: '#8B6914' },
  bookshelf: { top: '#A0522D', side: '#8B4513', bottom: '#A0522D' },
} as const;

type BlockType = keyof typeof BLOCK_COLORS;

interface VoxelBlockProps {
  position: [number, number, number];
  type: BlockType;
  scale?: [number, number, number];
  opacity?: number;
}

// ── Single Voxel Block ────────────────────────────────────

export function VoxelBlock({
  position,
  type,
  scale = [1, 1, 1],
  opacity = 1,
}: VoxelBlockProps) {
  const colors = BLOCK_COLORS[type];
  const isTransparent = type === 'water' || type === 'glass';
  const hasOreDots = 'dots' in colors;

  const materials = useMemo(() => {
    if (hasOreDots && 'dots' in colors) {
      // Create ore texture with dots
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d')!;

      // Base stone color
      ctx.fillStyle = colors.top;
      ctx.fillRect(0, 0, 16, 16);

      // Add noise using seeded random
      for (let i = 0; i < 64; i++) {
        const px = Math.floor(seededRandom(i * 3 + 100) * 16);
        const py = Math.floor(seededRandom(i * 3 + 200) * 16);
        const shade = Math.floor(seededRandom(i * 3 + 300) * 30) - 15;
        const r = parseInt(colors.top.slice(1, 3), 16) + shade;
        const g = parseInt(colors.top.slice(3, 5), 16) + shade;
        const b = parseInt(colors.top.slice(5, 7), 16) + shade;
        ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, r))},${Math.max(0, Math.min(255, g))},${Math.max(0, Math.min(255, b))})`;
        ctx.fillRect(px, py, 1, 1);
      }

      // Add ore dots
      const dotColor = colors.dots;
      const dotPositions = [
        [3, 3], [10, 4], [6, 9], [12, 11], [2, 13], [8, 2], [14, 7],
      ];
      dotPositions.forEach(([dx, dy]) => {
        ctx.fillStyle = dotColor;
        ctx.fillRect(dx, dy, 2, 2);
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      return new THREE.MeshStandardMaterial({
        map: texture,
        transparent: isTransparent,
        opacity: isTransparent ? 0.6 : opacity,
        roughness: 0.8,
        metalness: 0.1,
      });
    }

    // Standard block with different face colors
    const createFaceMaterial = (color: string, seedOffset: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 16, 16);

      // Add subtle noise using seeded random
      for (let i = 0; i < 32; i++) {
        const px = Math.floor(seededRandom(seedOffset + i * 3 + 100) * 16);
        const py = Math.floor(seededRandom(seedOffset + i * 3 + 200) * 16);
        const shade = Math.floor(seededRandom(seedOffset + i * 3 + 300) * 20) - 10;
        const r = parseInt(color.slice(1, 3), 16) + shade;
        const g = parseInt(color.slice(3, 5), 16) + shade;
        const b = parseInt(color.slice(5, 7), 16) + shade;
        ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, r))},${Math.max(0, Math.min(255, g))},${Math.max(0, Math.min(255, b))})`;
        ctx.fillRect(px, py, 1, 1);
      }

      // Add grid lines for pixelated look
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 0.5;
      for (let gi = 0; gi <= 16; gi += 4) {
        ctx.beginPath();
        ctx.moveTo(gi, 0);
        ctx.lineTo(gi, 16);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, gi);
        ctx.lineTo(16, gi);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    };

    const topTex = createFaceMaterial(colors.top, 0);
    const sideTex = createFaceMaterial(colors.side, 1000);
    const bottomTex = createFaceMaterial(colors.bottom, 2000);

    return [
      new THREE.MeshStandardMaterial({ map: sideTex, transparent: isTransparent, opacity: isTransparent ? 0.6 : opacity, roughness: 0.8 }),   // +X
      new THREE.MeshStandardMaterial({ map: sideTex, transparent: isTransparent, opacity: isTransparent ? 0.6 : opacity, roughness: 0.8 }),   // -X
      new THREE.MeshStandardMaterial({ map: topTex, transparent: isTransparent, opacity: isTransparent ? 0.6 : opacity, roughness: 0.8 }),    // +Y
      new THREE.MeshStandardMaterial({ map: bottomTex, transparent: isTransparent, opacity: isTransparent ? 0.6 : opacity, roughness: 0.8 }), // -Y
      new THREE.MeshStandardMaterial({ map: sideTex, transparent: isTransparent, opacity: isTransparent ? 0.6 : opacity, roughness: 0.8 }),   // +Z
      new THREE.MeshStandardMaterial({ map: sideTex, transparent: isTransparent, opacity: isTransparent ? 0.6 : opacity, roughness: 0.8 }),   // -Z
    ];
  }, [opacity, isTransparent, hasOreDots, colors]);

  return (
    <mesh position={position} scale={scale} material={materials} receiveShadow castShadow>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

// ── Nether Portal Block ───────────────────────────────────

interface NetherPortalProps {
  position: [number, number, number];
  scale?: [number, number, number];
}

export function NetherPortal({ position, scale = [1, 1, 1] }: NetherPortalProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const t = clock.elapsedTime;
    materialRef.current.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#7B1FA2"
        emissive="#9C27B0"
        emissiveIntensity={1.5}
        transparent
        opacity={0.8}
        roughness={0.2}
        metalness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Glowing Block (for enchanting table, glowstone) ───────

interface GlowingBlockProps {
  position: [number, number, number];
  color?: string;
  emissiveColor?: string;
  intensity?: number;
  scale?: [number, number, number];
}

export function GlowingBlock({
  position,
  color = '#FFD700',
  emissiveColor = '#FFA500',
  intensity = 1,
  scale = [1, 1, 1],
}: GlowingBlockProps) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const t = clock.elapsedTime;
    materialRef.current.emissiveIntensity = intensity + Math.sin(t * 1.5) * 0.3;
  });

  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={emissiveColor}
        emissiveIntensity={intensity}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
}

// ── Sign Block (for stats display) ────────────────────────

interface SignBlockProps {
  position: [number, number, number];
  text: string;
  rotation?: [number, number, number];
}

export function SignBlock({ position, text, rotation = [0, 0, 0] }: SignBlockProps) {
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Wooden background
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(0, 0, 128, 64);

    // Wood grain using seeded random
    ctx.strokeStyle = '#C4A882';
    ctx.lineWidth = 1;
    for (let y = 0; y < 64; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y + seededRandom(y * 7 + 50) * 2);
      ctx.lineTo(128, y + seededRandom(y * 7 + 150) * 2);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 124, 60);

    // Text
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > 110) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = 16;
    const startY = 32 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, 64, startY + i * lineHeight);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }, [text]);

  return (
    <group position={position} rotation={rotation}>
      {/* Sign post */}
      <mesh position={[0, -0.75, 0]}>
        <boxGeometry args={[0.15, 1.5, 0.15]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      {/* Sign board */}
      <mesh>
        <boxGeometry args={[1.2, 0.6, 0.08]} />
        <meshStandardMaterial map={canvasTexture} roughness={0.7} />
      </mesh>
    </group>
  );
}

// ── Crop Block (for farm area) ────────────────────────────

interface CropBlockProps {
  position: [number, number, number];
  growth?: number; // 0-1
}

export function CropBlock({ position, growth = 0.8 }: CropBlockProps) {
  const stalks = useMemo(() => {
    const items: { pos: [number, number, number]; height: number }[] = [];
    let idx = 0;
    for (let x = -0.3; x <= 0.3; x += 0.15) {
      for (let z = -0.3; z <= 0.3; z += 0.15) {
        items.push({
          pos: [x, growth * 0.4, z],
          height: growth * 0.5 + seededRandom(idx + 500) * 0.1,
        });
        idx++;
      }
    }
    return items;
  }, [growth]);

  return (
    <group position={position}>
      {/* Farmland base */}
      <mesh position={[0, -0.45, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#5D4037" roughness={0.95} />
      </mesh>
      {/* Wheat stalks */}
      {stalks.map((stalk, i) => (
        <mesh key={i} position={stalk.pos}>
          <boxGeometry args={[0.05, stalk.height, 0.05]} />
          <meshStandardMaterial
            color={growth > 0.7 ? '#DAA520' : '#7CB342'}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Water Block (animated) ────────────────────────────────

interface WaterBlockProps {
  position: [number, number, number];
  scale?: [number, number, number];
}

export function WaterBlock({ position, scale = [1, 1, 1] }: WaterBlockProps) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const t = clock.elapsedTime;
    materialRef.current.opacity = 0.5 + Math.sin(t * 1.2 + position[0] * 0.5) * 0.1;
  });

  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 0.8, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#1E90FF"
        transparent
        opacity={0.5}
        roughness={0.1}
        metalness={0.3}
      />
    </mesh>
  );
}

// ── Enchanting Table ──────────────────────────────────────

interface EnchantingTableProps {
  position: [number, number, number];
}

export function EnchantingTable({ position }: EnchantingTableProps) {
  const bookRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    if (!bookRef.current) return;
    const t = clock.elapsedTime;
    bookRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
    bookRef.current.position.y = 1.2 + Math.sin(t * 0.8) * 0.1;

    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(t * 1.5) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Table base */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#1a0a3e" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Table top */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.3, 0.1, 1.3]} />
        <meshStandardMaterial color="#0f0628" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Diamond corners */}
      {[[-0.55, 0.9, -0.55], [0.55, 0.9, -0.55], [-0.55, 0.9, 0.55], [0.55, 0.9, 0.55]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
          <meshStandardMaterial color="#4FC3F7" emissive="#4FC3F7" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* Floating book */}
      <group ref={bookRef}>
        <mesh>
          <boxGeometry args={[0.4, 0.05, 0.3]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        {/* Book pages */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.35, 0.02, 0.25]} />
          <meshStandardMaterial color="#FFFFF0" roughness={0.9} />
        </mesh>
      </group>
      {/* Enchanting glow */}
      <pointLight
        ref={glowRef}
        color="#7B1FA2"
        intensity={2}
        distance={5}
        decay={2}
        position={[0, 1.5, 0]}
      />
    </group>
  );
}

// ── Export ore types for use in other components ───────────

export const ORE_TYPES = [
  'diamond_ore',
  'gold_ore',
  'iron_ore',
  'coal_ore',
  'redstone_ore',
  'emerald_ore',
] as const;

export type OreType = (typeof ORE_TYPES)[number];
