'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// ── Lazy-load the 3D world ────────────────────────────────

const MinecraftWorld = dynamic(
  () => import('@/components/three/MinecraftWorld'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-gradient-to-b from-sky-900 to-sky-600 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 mb-4">
            LOADING WORLD
          </div>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{
                animation: 'loading-bar 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    ),
  }
);

// ── Section Labels ────────────────────────────────────────

const SECTIONS = [
  { name: 'SPAWN POINT', subtitle: 'Hero', progress: 0 },
  { name: 'FARM', subtitle: 'About', progress: 0.25 },
  { name: 'MINE', subtitle: 'Projects', progress: 0.5 },
  { name: 'ENCHANTING ROOM', subtitle: 'Skills', progress: 0.75 },
  { name: 'NETHER PORTAL', subtitle: 'Contact', progress: 1 },
];

// ── MinecraftSection Component ────────────────────────────

export default function MinecraftSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = container.offsetHeight - windowHeight;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
      setScrollProgress(progress);

      // Determine current section
      const sectionIndex = Math.min(
        4,
        Math.floor(progress * 5)
      );
      setCurrentSection(sectionIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      id="minecraft-world"
      className="relative"
      style={{ height: '500vh' }}
    >
      {/* Sticky canvas container */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ zIndex: 10 }}
      >
        {/* 3D World */}
        <MinecraftWorld />

        {/* Section indicator overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-base-950/80 backdrop-blur-xl border border-border px-6 py-3 rounded-sm">
            <div className="flex items-center gap-4">
              {/* Section dots */}
              <div className="flex gap-2">
                {SECTIONS.map((section, i) => (
                  <div
                    key={i}
                    className="relative"
                  >
                    <div
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i === currentSection
                            ? '#06B6D4'
                            : i < currentSection
                            ? '#06B6D480'
                            : 'rgba(255,255,255,0.2)',
                        transform: i === currentSection ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                    {i === currentSection && (
                      <div
                        className="absolute -inset-1 rounded-full animate-ping"
                        style={{ backgroundColor: '#06B6D420' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-border" />

              {/* Section name */}
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                {SECTIONS[currentSection]?.name}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar on left */}
        <div className="absolute top-[10%] left-4 w-0.5 h-[80%] bg-white/10 rounded-full overflow-hidden z-20">
          <div
            className="w-full bg-cyan-400 rounded-full transition-transform duration-100"
            style={{
              transform: `scaleY(${scrollProgress})`,
              transformOrigin: 'top',
            }}
          />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div
            className="flex flex-col items-center gap-2 transition-opacity duration-500"
            style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              SCROLL TO EXPLORE
            </span>
            <div className="w-4 h-6 border border-white/20 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading animation */}
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
