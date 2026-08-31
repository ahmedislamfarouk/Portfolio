'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';

// ── Reduced motion helpers ──────────────────────────────

function subscribeToReducedMotion(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
function getReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function getReducedMotionServer() {
  return false;
}

// ── useCountUp ─────────────────────────────────────────

function useCountUp(end: number, duration = 2200) {
  const prefersReduced = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
  const [count, setCount] = useState(prefersReduced ? end : 0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (prefersReduced || hasStarted.current) return;
    hasStarted.current = true;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, prefersReduced]);

  return count;
}

// ── About Section ───────────────────────────────────────

const About = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const mountRef = useRef(false);
  const awards = useCountUp(43, 2200);
  const projectCount = useCountUp(9, 2200);
  const years = useCountUp(2, 2200);
  const partners = useCountUp(4, 2200);

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    requestAnimationFrame(() => {
      setHasMounted(true);
    });
  }, []);

  return (
    <section id="about" className="border-b border-border">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className={`mb-10 transition-opacity duration-700 ${hasMounted ? 'opacity-100' : 'opacity-0'}`}>
          <span className="data-label">SYSTEM SPECS</span>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-10" />

        {/* Specs grid — left-aligned, terminal-style */}
        <div
          className={`mb-16 transition-all duration-700 delay-100 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="space-y-6 max-w-xl">
            {/* ROLE */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary w-32 shrink-0">
                ROLE:
              </span>
              <span className="font-mono text-sm text-text-primary">
                AI Researcher &amp; Robotics Engineer
              </span>
            </div>

            {/* LOCATION */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary w-32 shrink-0">
                LOCATION:
              </span>
              <span className="font-mono text-sm text-text-primary">
                Cairo, Egypt
              </span>
            </div>

            {/* FOCUS */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary w-32 shrink-0">
                FOCUS:
              </span>
              <span className="font-mono text-sm text-text-primary">
                Computer Vision, Autonomous Systems, Deep Learning
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-12" />

        {/* Stats row — large numbers */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 transition-all duration-700 delay-200 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div>
            <div className="font-sans font-black text-4xl md:text-5xl text-text-primary tabular-nums leading-none mb-1">
              {awards}<span className="text-accent">+</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Awards
            </div>
          </div>
          <div>
            <div className="font-sans font-black text-4xl md:text-5xl text-text-primary tabular-nums leading-none mb-1">
              {projectCount}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Projects
            </div>
          </div>
          <div>
            <div className="font-sans font-black text-4xl md:text-5xl text-text-primary tabular-nums leading-none mb-1">
              {years}<span className="text-accent">+</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Years
            </div>
          </div>
          <div>
            <div className="font-sans font-black text-4xl md:text-5xl text-text-primary tabular-nums leading-none mb-1">
              {partners}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Partners
            </div>
          </div>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-12" />

        {/* Bio — plain text */}
        <div
          className={`max-w-2xl transition-all duration-700 delay-300 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="text-text-secondary text-base leading-relaxed">
            Engineering the nexus of sentient vision and autonomous control.
            SOTA research meets championship-level execution.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
