'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// ── Lazy-load the NeuralNetwork ───────────────────────────

const NeuralNetwork = dynamic(
  () => import('@/components/three/NeuralNetwork'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 -z-10 bg-base-950" aria-hidden="true" />
    ),
  },
);

// ── Typewriter hook ───────────────────────────────────────

function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplayed(current.slice(0, displayed.length + 1));
          if (displayed.length === current.length) {
            setTimeout(() => setDeleting(true), pause);
          }
        } else {
          setDisplayed(current.slice(0, displayed.length - 1));
          if (displayed.length === 0) {
            setDeleting(false);
            setWordIdx((i) => (i + 1) % words.length);
          }
        }
      },
      deleting ? speed / 2 : speed,
    );
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

// ── Hero Section ──────────────────────────────────────────

const HERO_ROLES = [
  'AI Researcher',
  'Robotics Engineer',
  'Vision Systems',
  'Champion Athlete',
];

const Hero = () => {
  const role = useTypewriter(HERO_ROLES, 80, 2200);
  const [hasMounted, setHasMounted] = useState(false);
  const mountRef = useRef(false);

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    requestAnimationFrame(() => setHasMounted(true));
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-center min-h-dvh overflow-hidden"
    >
      {/* 3D Neural Network Background */}
      <NeuralNetwork
        onNodeClick={(node) => {
          console.log('Clicked:', node.label);
        }}
        onNodeHover={(node) => {
          if (node) {
            document.body.style.cursor = 'pointer';
          } else {
            document.body.style.cursor = 'default';
          }
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-950/70 via-base-950/40 to-base-950/80 pointer-events-none z-[1]" />

      {/* Content */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10 py-24 md:py-32">
        {/* Top bar: status + coordinates */}
        <div
          className={`flex items-center justify-between mb-16 md:mb-24 transition-opacity duration-700 ${hasMounted ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex items-center gap-3">
            <span className="status-indicator" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
              STATUS: ONLINE
            </span>
          </div>
          <span className="font-mono text-[11px] text-text-tertiary hidden sm:block">
            [30.0444, 31.2357]
          </span>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-12 md:mb-16" />

        {/* Name — huge type */}
        <div
          className={`mb-8 transition-all duration-700 delay-100 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h1
            className="font-sans font-black uppercase leading-tight-display tracking-tight"
            style={{ fontSize: 'clamp(4rem, 12vw, 11rem)' }}
          >
            AHMED
            <br />
            BADR
          </h1>
        </div>

        {/* Role + tagline */}
        <div
          className={`mb-6 transition-all duration-700 delay-200 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="flex items-center gap-2 font-mono text-lg md:text-xl text-text-secondary h-7">
            <span>{role}</span>
            <span className="terminal-cursor" aria-hidden="true" />
          </div>
        </div>

        <div
          className={`mb-12 md:mb-16 transition-all duration-700 delay-300 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="text-text-secondary text-base md:text-lg max-w-lg">
            Building autonomous systems that see. Explore the neural network
            above — each node represents a skill or domain.
          </p>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-12 md:mb-16" />

        {/* Bottom row: CTA + meta */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-700 delay-[400ms] ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-3 font-mono text-sm font-medium text-text-primary hover:text-accent transition-colors duration-300"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 border border-border group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300">
              <span className="text-xs">&rarr;</span>
            </span>
            <span className="uppercase tracking-[0.15em] text-[11px]">
              VIEW WORK
            </span>
          </a>
          <span className="font-mono text-[11px] text-text-tertiary">
            Last updated: 2026
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-5 h-8 border border-border rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export { Hero };
export default Hero;
