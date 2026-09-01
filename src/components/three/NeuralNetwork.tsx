'use client';

import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ── Types ─────────────────────────────────────────────────

interface NodeData {
  id: number;
  position: [number, number, number];
  label: string;
  color: string;
  scale: number;
  category: string;
}

interface NeuralNetworkProps {
  onNodeClick?: (node: NodeData) => void;
  onNodeHover?: (node: NodeData | null) => void;
}

// ── Network node data ─────────────────────────────────────

const NETWORK_NODES: NodeData[] = [
  { id: 0, position: [0, 0, 0], label: 'Ahmed Badr', color: '#06B6D4', scale: 1.4, category: 'core' },
  { id: 1, position: [3.2, 1.8, -1.5], label: 'Computer Vision', color: '#06B6D4', scale: 1.0, category: 'skill' },
  { id: 2, position: [-2.8, 2.1, -0.8], label: 'Deep Learning', color: '#06B6D4', scale: 1.0, category: 'skill' },
  { id: 3, position: [2.0, -2.2, -1.0], label: 'Robotics', color: '#06B6D4', scale: 1.0, category: 'skill' },
  { id: 4, position: [-3.0, -1.5, -2.0], label: 'ROS 2', color: '#22D3EE', scale: 0.8, category: 'tool' },
  { id: 5, position: [4.5, 0.5, -2.5], label: 'TensorFlow', color: '#22D3EE', scale: 0.7, category: 'tool' },
  { id: 6, position: [-1.5, 3.5, -1.2], label: 'PyTorch', color: '#22D3EE', scale: 0.7, category: 'tool' },
  { id: 7, position: [1.0, 3.0, -2.0], label: 'NLP', color: '#67E8F9', scale: 0.6, category: 'skill' },
  { id: 8, position: [-4.2, 0.8, -1.8], label: 'Sensor Fusion', color: '#22D3EE', scale: 0.7, category: 'skill' },
  { id: 9, position: [3.5, -1.0, -3.0], label: 'YOLOv8', color: '#67E8F9', scale: 0.6, category: 'tool' },
  { id: 10, position: [-2.0, -3.0, -1.5], label: 'RL', color: '#67E8F9', scale: 0.6, category: 'skill' },
  { id: 11, position: [0.5, -3.5, -2.2], label: 'Docker', color: '#0E7490', scale: 0.5, category: 'tool' },
  { id: 12, position: [-4.5, -2.5, -2.8], label: 'OpenCV', color: '#67E8F9', scale: 0.6, category: 'tool' },
  { id: 13, position: [4.8, 2.5, -2.0], label: 'LLMs', color: '#06B6D4', scale: 0.8, category: 'skill' },
  { id: 14, position: [-1.0, -1.5, -3.5], label: 'Autonomous Systems', color: '#22D3EE', scale: 0.7, category: 'skill' },
  { id: 15, position: [2.5, 3.5, -3.0], label: 'RAG', color: '#67E8F9', scale: 0.5, category: 'tool' },
  { id: 16, position: [-3.5, 3.5, -2.5], label: 'FAISS', color: '#0E7490', scale: 0.5, category: 'tool' },
  { id: 17, position: [5.0, -2.0, -3.5], label: 'Edge Detection', color: '#0E7490', scale: 0.5, category: 'skill' },
  { id: 18, position: [-5.0, 0.0, -3.0], label: 'Medical AI', color: '#06B6D4', scale: 0.8, category: 'domain' },
  { id: 19, position: [0.0, 4.5, -2.8], label: 'Drone Systems', color: '#06B6D4', scale: 0.7, category: 'domain' },
  { id: 20, position: [3.0, -3.5, -2.5], label: 'Siamese Nets', color: '#0E7490', scale: 0.5, category: 'tool' },
  { id: 21, position: [-2.5, -4.0, -3.2], label: 'Q-Learning', color: '#0E7490', scale: 0.5, category: 'tool' },
  { id: 22, position: [5.5, 1.0, -4.0], label: 'Stereo Vision', color: '#0E7490', scale: 0.5, category: 'skill' },
  { id: 23, position: [-5.5, -1.5, -4.0], label: 'Genomics', color: '#0E7490', scale: 0.5, category: 'domain' },
  { id: 24, position: [1.5, -4.5, -3.8], label: 'DQN', color: '#0E7490', scale: 0.45, category: 'tool' },
  { id: 25, position: [-4.0, 2.5, -3.5], label: 'XGBoost', color: '#0E7490', scale: 0.45, category: 'tool' },
];

// ── Connections between nodes ─────────────────────────────

const CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 13], [0, 18], [0, 19],
  [1, 5], [1, 9], [1, 12], [1, 17], [1, 22],
  [2, 6], [2, 10], [2, 13],
  [3, 4], [3, 9], [3, 14],
  [4, 11], [4, 14],
  [5, 13], [5, 15],
  [6, 7], [6, 16],
  [7, 13], [7, 15],
  [8, 12], [8, 18],
  [9, 17], [9, 20],
  [10, 21], [10, 24],
  [11, 14],
  [12, 18], [12, 23],
  [13, 15], [13, 16],
  [14, 19],
  [18, 23],
  [20, 22],
  [21, 24],
  [25, 2],
  [19, 4],
];

// ── Seeded random for deterministic particle positions ─────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ── Single Node Mesh ──────────────────────────────────────

function NetworkNode({
  node,
  onClick,
  onHover,
}: {
  node: NodeData;
  onClick: (node: NodeData) => void;
  onHover: (node: NodeData | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.PointLight>(null!);
  const [hovered, setHovered] = useState(false);

  const baseScale = node.scale;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Spring-based hover scale
    const targetScale = hovered ? baseScale * 1.5 : baseScale;
    const current = meshRef.current.scale.x;
    const newScale = current + (targetScale - current) * Math.min(delta * 8, 1);
    meshRef.current.scale.setScalar(newScale);

    // Gentle floating motion
    const time = Date.now() * 0.001;
    meshRef.current.position.y =
      node.position[1] + Math.sin(time + node.id * 0.5) * 0.08;

    // Glow intensity
    if (glowRef.current) {
      glowRef.current.intensity = hovered ? 2.5 : 0.3;
    }
  });

  const handlePointerOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
      onHover(node);
      document.body.style.cursor = 'pointer';
    },
    [node, onHover],
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = 'default';
  }, [onHover]);

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onClick(node);
    },
    [node, onClick],
  );

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : node.color}
          emissive={hovered ? '#06B6D4' : node.color}
          emissiveIntensity={hovered ? 2.0 : 0.5}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.95}
        />
      </mesh>
      <pointLight
        ref={glowRef}
        color={node.color}
        intensity={0.3}
        distance={3}
        decay={2}
      />
    </group>
  );
}

// ── Connection Lines ──────────────────────────────────────

function NetworkConnections({
  nodes,
  hoveredNodeId,
}: {
  nodes: NodeData[];
  hoveredNodeId: number | null;
}) {
  const linesRef = useRef<THREE.LineSegments>(null!);
  const materialRef = useRef<THREE.LineBasicMaterial>(null!);

  const { positions, colors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];

    CONNECTIONS.forEach(([a, b]) => {
      const nodeA = nodes[a];
      const nodeB = nodes[b];
      if (!nodeA || !nodeB) return;

      pos.push(...nodeA.position, ...nodeB.position);

      const isHighlighted =
        hoveredNodeId !== null && (a === hoveredNodeId || b === hoveredNodeId);
      const c = isHighlighted
        ? new THREE.Color('#06B6D4')
        : new THREE.Color('#06B6D4').multiplyScalar(0.15);

      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    });

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    };
  }, [nodes, hoveredNodeId]);

  useFrame(() => {
    if (!materialRef.current) return;
    const time = Date.now() * 0.0005;
    materialRef.current.opacity = 0.3 + Math.sin(time) * 0.1;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        vertexColors
        transparent
        opacity={0.4}
        linewidth={1}
      />
    </lineSegments>
  );
}

// ── Floating particles around the network ─────────────────

function FloatingParticles({ count = 200 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null!);

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3) - 0.5) * 16;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * 12;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 10 - 2;
    }

    return { positions: pos };
  }, [count]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#06B6D4"
        size={0.02}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Camera Rig (follows mouse) ───────────────────────────

function CameraRig({ mousePosition }: { mousePosition: React.RefObject<THREE.Vector2> }) {
  const cameraRef = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(({ camera }) => {
    if (!mousePosition.current) return;
    const targetX = mousePosition.current.x * 1.2;
    const targetY = mousePosition.current.y * 0.8;

    cameraRef.current.x += (targetX - cameraRef.current.x) * 0.02;
    cameraRef.current.y += (targetY - cameraRef.current.y) * 0.02;

    camera.position.set(cameraRef.current.x, cameraRef.current.y, 6);
    camera.lookAt(0, 0, -2);
  });

  return null;
}

// ── Post Processing ───────────────────────────────────────

function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0005, 0.0005)}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

// ── Scene (everything inside Canvas) ──────────────────────

function NetworkScene({
  onNodeClick,
  onNodeHover,
}: {
  onNodeClick: (node: NodeData) => void;
  onNodeHover: (node: NodeData | null) => void;
}) {
  const mousePosition = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const { size } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = (e.clientX / size.width) * 2 - 1;
      mousePosition.current.y = -(e.clientY / size.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  const handleNodeHover = useCallback(
    (node: NodeData | null) => {
      setHoveredNodeId(node?.id ?? null);
      onNodeHover(node);
    },
    [onNodeHover],
  );

  return (
    <>
      <CameraRig mousePosition={mousePosition} />
      <color attach="background" args={['#0A0A0A']} />

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#06B6D4" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#7C3AED" />
      <pointLight position={[0, -5, -2]} intensity={0.2} color="#22D3EE" />

      {/* Stars in background */}
      <Stars
        radius={50}
        depth={60}
        count={2500}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Floating particles */}
      <FloatingParticles count={150} />

      {/* Network connections */}
      <NetworkConnections
        nodes={NETWORK_NODES}
        hoveredNodeId={hoveredNodeId}
      />

      {/* Network nodes */}
      {NETWORK_NODES.map((node) => (
        <NetworkNode
          key={node.id}
          node={node}
          onClick={onNodeClick}
          onHover={handleNodeHover}
        />
      ))}

      {/* Post-processing */}
      <PostProcessing />
    </>
  );
}

// ── Node Info Overlay ─────────────────────────────────────

function NodeInfoOverlay({
  hoveredNode,
  clickedNode,
}: {
  hoveredNode: NodeData | null;
  clickedNode: NodeData | null;
}) {
  if (!hoveredNode && !clickedNode) return null;

  const node = clickedNode || hoveredNode;
  if (!node) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div className="bg-base-950/90 backdrop-blur-xl border border-border-accent px-6 py-3 rounded-sm">
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: node.color }}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
            {node.category}
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="font-mono text-sm text-text-primary">
            {node.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Mobile Fallback (CSS-only) ────────────────────────────

function MobileFallback() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-base-950" />
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-8"
        style={{
          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />
      <div className="absolute inset-0 dot-grid opacity-20" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────

export default function NeuralNetwork({
  onNodeClick,
  onNodeHover,
}: NeuralNetworkProps) {
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);
  const [clickedNode, setClickedNode] = useState<NodeData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const checkReducedMotion = () => {
      setReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      );
    };

    checkMobile();
    checkReducedMotion();
    window.addEventListener('resize', checkMobile);
    window
      .matchMedia('(prefers-reduced-motion: reduce)')
      .addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window
        .matchMedia('(prefers-reduced-motion: reduce)')
        .removeEventListener('change', checkReducedMotion);
    };
  }, []);

  const handleNodeClick = useCallback(
    (node: NodeData) => {
      setClickedNode(node);
      onNodeClick?.(node);
    },
    [onNodeClick],
  );

  const handleNodeHover = useCallback(
    (node: NodeData | null) => {
      setHoveredNode(node);
      onNodeHover?.(node);
    },
    [onNodeHover],
  );

  if (isMobile || reducedMotion) {
    return <MobileFallback />;
  }

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          style={{ background: '#0A0A0A' }}
        >
          <NetworkScene
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
          />
        </Canvas>
      </div>
      <NodeInfoOverlay
        hoveredNode={hoveredNode}
        clickedNode={clickedNode}
      />
    </>
  );
}
