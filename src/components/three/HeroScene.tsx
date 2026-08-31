'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import { Suspense } from 'react';

function Scene() {
  return (
    <>
      <Stars
        radius={50}
        depth={50}
        count={1500}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh>
          <icosahedronGeometry args={[1.5, 1]} />
          <MeshDistortMaterial
            color="#06B6D4"
            transparent
            opacity={0.15}
            distort={0.3}
            speed={2}
          />
        </mesh>
      </Float>
      <ambientLight intensity={0.5} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
