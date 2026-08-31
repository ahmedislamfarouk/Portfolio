'use client';
/* eslint-disable react-hooks/purity, react-hooks/immutability */
// Three.js/WebGL code intentionally uses mutable buffers and Math.random() for particle initialization.

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ═════════════════════════════════════════════════════════════════════
//  Theme colors (matching globals.css)
// ═════════════════════════════════════════════════════════════════════

const NEON_CYAN = new THREE.Color('#06B6D4');
const NEON_VIOLET = new THREE.Color('#7C3AED');
const NEON_BLUE = new THREE.Color('#2563EB');
const COLORS = [NEON_CYAN, NEON_VIOLET, NEON_BLUE];

// ═════════════════════════════════════════════════════════════════════
//  Constellation — 300 particles + proximity lines + mouse reaction
// ═════════════════════════════════════════════════════════════════════

function Constellation() {
  const COUNT = 300;
  const SPREAD = 18;

  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const lineRef = useRef<THREE.LineSegments>(null!);

  /* ── Stable random positions + per-particle state ──────── */
  const { positions, velocities, particleColors, baseSizes } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * SPREAD;
      pos[i3 + 1] = (Math.random() - 0.5) * SPREAD;
      pos[i3 + 2] = (Math.random() - 0.5) * SPREAD * 0.5;

      vel[i3] = (Math.random() - 0.5) * 0.004;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.004;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.002;

      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;

      sizes[i] = 0.015 + Math.random() * 0.025;
    }
    return { positions: pos, velocities: vel, particleColors: col, baseSizes: sizes };
  }, []);

  /* ── Reusable geometry objects (avoid GC) ─────────────── */
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colArray = useMemo(() => new THREE.Color(), []);

  /* ── Max possible connections for buffer pre-allocation ── */
  const MAX_LINES = 4000;
  const linePositionsRef = useRef(new Float32Array(MAX_LINES * 6));
  const lineColorsRef = useRef(new Float32Array(MAX_LINES * 6));
  const linePositions = linePositionsRef.current;
  const lineColors = lineColorsRef.current;

  /* ── Mouse raycaster (3D plane intersection) ──────────── */
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const mouseNDC = useRef(new THREE.Vector2(9999, 9999));
  const mouse3D = useRef(new THREE.Vector3());

  const onPointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    mouseNDC.current.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
    );
  }, []);

  /* ── Animation loop ───────────────────────────────────── */
  useFrame(({ camera }) => {
    if (!meshRef.current || !lineRef.current) return;

    // Project mouse NDC → 3D
    raycaster.setFromCamera(mouseNDC.current, camera);
    raycaster.ray.intersectPlane(plane, mouse3D.current);

    const posAttr = meshRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const sizeAttr = meshRef.current.geometry.getAttribute('aSize') as THREE.BufferAttribute;
    const sizeArray = sizeAttr.array as Float32Array;

    const CONNECTION_DIST = 3.2;
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
    let lineIdx = 0;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      // Drift
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      // Mouse attraction
      const dx = mouse3D.current.x - posArray[i3];
      const dy = mouse3D.current.y - posArray[i3 + 1];
      const dz = mouse3D.current.z - posArray[i3 + 2];
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < 36 && distSq > 0.001) {
        const d = Math.sqrt(distSq);
        const force = (1 - d / 6) * 0.0008;
        velocities[i3] += dx * force;
        velocities[i3 + 1] += dy * force;
        velocities[i3 + 2] += dz * force;
      }

      // Damping
      velocities[i3] *= 0.998;
      velocities[i3 + 1] *= 0.998;
      velocities[i3 + 2] *= 0.998;

      // Wrap around boundaries
      const half = SPREAD * 0.5;
      if (posArray[i3] > half) posArray[i3] = -half;
      if (posArray[i3] < -half) posArray[i3] = half;
      if (posArray[i3 + 1] > half) posArray[i3 + 1] = -half;
      if (posArray[i3 + 1] < -half) posArray[i3 + 1] = half;

      // InstancedMesh transform
      dummy.position.set(posArray[i3], posArray[i3 + 1], posArray[i3 + 2]);

      // Proximity → size pulse
      const mouseDist = Math.sqrt(distSq);
      sizeArray[i] = mouseDist < 4
        ? baseSizes[i] * (1 + (1 - mouseDist / 4) * 2.5)
        : baseSizes[i];

      dummy.scale.setScalar(sizeArray[i] * 40);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Constellation connections
      for (let j = i + 1; j < COUNT; j++) {
        const j3 = j * 3;
        const lx = posArray[i3] - posArray[j3];
        const ly = posArray[i3 + 1] - posArray[j3 + 1];
        const lz = posArray[i3 + 2] - posArray[j3 + 2];
        const lDistSq = lx * lx + ly * ly + lz * lz;

        if (lDistSq < CONNECTION_DIST_SQ && lineIdx < MAX_LINES) {
          const lDist = Math.sqrt(lDistSq);
          const alpha = (1 - lDist / CONNECTION_DIST) * 0.22;

          const li6 = lineIdx * 6;
          linePositions[li6] = posArray[i3];
          linePositions[li6 + 1] = posArray[i3 + 1];
          linePositions[li6 + 2] = posArray[i3 + 2];
          linePositions[li6 + 3] = posArray[j3];
          linePositions[li6 + 4] = posArray[j3 + 1];
          linePositions[li6 + 5] = posArray[j3 + 2];

          colArray.setRGB(
            particleColors[i3] * alpha,
            particleColors[i3 + 1] * alpha,
            particleColors[i3 + 2] * alpha,
          );
          lineColors[li6] = colArray.r;
          lineColors[li6 + 1] = colArray.g;
          lineColors[li6 + 2] = colArray.b;
          lineColors[li6 + 3] = colArray.r;
          lineColors[li6 + 4] = colArray.g;
          lineColors[li6 + 5] = colArray.b;

          lineIdx++;
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;

    // Update line buffers
    const linePosAttr = lineRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const lineColAttr = lineRef.current.geometry.getAttribute('color') as THREE.BufferAttribute;
    linePosAttr.array = linePositions;
    lineColAttr.array = lineColors;
    linePosAttr.needsUpdate = true;
    lineColAttr.needsUpdate = true;
    lineRef.current.geometry.setDrawRange(0, lineIdx * 2);
  });

  return (
    <group onPointerMove={onPointerMove}>
      {/* Instanced particle mesh */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <sphereGeometry args={[1, 6, 6]}>
          <instancedBufferAttribute attach="attributes-position" args={[positions, 3]} />
          <instancedBufferAttribute attach="attributes-aSize" args={[baseSizes, 1]} />
          <instancedBufferAttribute attach="attributes-color" args={[particleColors, 3]} />
        </sphereGeometry>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Constellation lines */}
      <lineSegments ref={lineRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

// ═════════════════════════════════════════════════════════════════════
//  GlassShapes — semi-transparent rotating geometric shapes
// ═════════════════════════════════════════════════════════════════════

interface ShapeConfig {
  position: [number, number, number];
  scale: number;
  geometry: 'octahedron' | 'tetrahedron' | 'icosahedron';
  color: THREE.Color;
  rotationSpeed: [number, number, number];
  floatSpeed: number;
  floatRange: number;
}

const SHAPE_CONFIGS: ShapeConfig[] = [
  {
    position: [5, 1, -4],
    scale: 0.55,
    geometry: 'octahedron',
    color: NEON_CYAN,
    rotationSpeed: [0.003, 0.006, 0.002],
    floatSpeed: 0.4,
    floatRange: 0.4,
  },
  {
    position: [-6, -2, -3],
    scale: 0.4,
    geometry: 'tetrahedron',
    color: NEON_VIOLET,
    rotationSpeed: [0.005, 0.003, 0.004],
    floatSpeed: 0.55,
    floatRange: 0.35,
  },
  {
    position: [3, -3, -5],
    scale: 0.35,
    geometry: 'icosahedron',
    color: NEON_BLUE,
    rotationSpeed: [0.002, 0.004, 0.003],
    floatSpeed: 0.35,
    floatRange: 0.5,
  },
  {
    position: [-4, 3, -6],
    scale: 0.45,
    geometry: 'octahedron',
    color: NEON_VIOLET,
    rotationSpeed: [0.004, 0.002, 0.005],
    floatSpeed: 0.5,
    floatRange: 0.3,
  },
  {
    position: [7, -1, -7],
    scale: 0.3,
    geometry: 'tetrahedron',
    color: NEON_CYAN,
    rotationSpeed: [0.003, 0.005, 0.001],
    floatSpeed: 0.45,
    floatRange: 0.4,
  },
];

function GlassShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const cfg = SHAPE_CONFIGS[i];
      if (!cfg) return;

      child.rotation.x += cfg.rotationSpeed[0];
      child.rotation.y += cfg.rotationSpeed[1];
      child.rotation.z += cfg.rotationSpeed[2];

      child.position.y =
        cfg.position[1] + Math.sin(t * cfg.floatSpeed + i * 1.5) * cfg.floatRange;
    });
  });

  return (
    <group ref={groupRef}>
      {SHAPE_CONFIGS.map((cfg, i) => {
        const geo =
          cfg.geometry === 'octahedron' ? (
            <octahedronGeometry args={[1, 0]} />
          ) : cfg.geometry === 'tetrahedron' ? (
            <tetrahedronGeometry args={[1, 0]} />
          ) : (
            <icosahedronGeometry args={[1, 0]} />
          );

        return (
          <group
            key={i}
            position={cfg.position}
            scale={cfg.scale}
          >
            {/* Glass fill — semi-transparent */}
            <mesh>
              {geo}
              <meshPhysicalMaterial
                color={cfg.color}
                transparent
                opacity={0.06}
                roughness={0.1}
                metalness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Neon wireframe edge */}
            <mesh>
              {geo}
              <meshBasicMaterial
                color={cfg.color}
                wireframe
                transparent
                opacity={0.18}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ═════════════════════════════════════════════════════════════════════
//  PostProcessing — bloom for neon glow
// ═════════════════════════════════════════════════════════════════════

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}

// ═════════════════════════════════════════════════════════════════════
//  HeroScene — main exported component
// ═════════════════════════════════════════════════════════════════════

export default function HeroScene() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {/* Re-enable pointer events only on the canvas for mouse tracking */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ pointerEvents: 'auto' }}
        performance={{ min: 0.5 }}
      >
        <Constellation />
        <GlassShapes />
        <Stars
          radius={50}
          depth={40}
          count={1500}
          factor={3}
          saturation={0.1}
          fade
          speed={0.3}
        />
        <PostProcessing />
      </Canvas>
    </div>
  );
}
