'use client';

// Pure CSS background — no WebGL, no Canvas, no frame loops
export default function HeroScene() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-base-950" />

      {/* Animated gradient orbs */}
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

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-20" />
    </div>
  );
}
