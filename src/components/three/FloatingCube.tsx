'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// ── Rotating Cube ─────────────────────────────────────────

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const edgesRef = useRef<THREE.LineSegments>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      edgesRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 1.5, 1.5));

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        {/* Wireframe cube */}
        <lineSegments
          ref={edgesRef}
          geometry={edges}
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          <lineBasicMaterial
            color={hovered ? '#22D3EE' : '#06B6D4'}
            transparent
            opacity={hovered ? 0.8 : 0.4}
          />
        </lineSegments>

        {/* Inner solid cube */}
        <mesh ref={meshRef}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial
            color="#0A0A0A"
            emissive={hovered ? '#06B6D4' : '#0E7490'}
            emissiveIntensity={hovered ? 0.4 : 0.15}
            roughness={0.3}
            metalness={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Corner spheres */}
        {[[-0.85, -0.85, -0.85], [0.85, 0.85, 0.85], [-0.85, 0.85, -0.85], [0.85, -0.85, 0.85]].map(
          (pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#06B6D4"
                emissiveIntensity={1.5}
              />
            </mesh>
          ),
        )}
      </group>
    </Float>
  );
}

// ── Main Component ────────────────────────────────────────

export default function FloatingCube() {
  return (
    <div className="w-full aspect-square max-w-[300px] mx-auto cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#06B6D4" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#7C3AED" />
        <RotatingCube />
      </Canvas>
    </div>
  );
}
