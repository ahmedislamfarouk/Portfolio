'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';

// ── Lazy-load the globe ───────────────────────────────────

const InteractiveGlobe = dynamic(
  () => import('@/components/three/InteractiveGlobe'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square max-w-[300px] mx-auto bg-base-900 rounded-full animate-pulse" />
    ),
  },
);

// ── Reduced motion helpers ────────────────────────────────

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

// ── useCountUp ────────────────────────────────────────────

function useCountUp(end: number, duration = 2200) {
  const prefersReduced = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
  const [count, setCount] = useState(prefersReduced ? end : 0);
  const hasStarted = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced || hasStarted.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
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
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [end, duration, prefersReduced]);

  return { count, sectionRef };
}

// ── Tech Stack Data ───────────────────────────────────────

const TECH_STACK = [
  'Python', 'C++', 'TensorFlow', 'PyTorch', 'ROS 2',
  'OpenCV', 'YOLOv8', 'FastAPI', 'React', 'PostgreSQL',
  'Docker', 'FAISS', 'BERT', 'LangChain', 'Git',
];

// ── About Section ─────────────────────────────────────────

const About = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const mountRef = useRef(false);
  const { count: awards, sectionRef: awardsRef } = useCountUp(43, 2200);
  const { count: projectCount, sectionRef: projectsRef } = useCountUp(9, 2200);
  const { count: years, sectionRef: yearsRef } = useCountUp(2, 2200);
  const { count: partners, sectionRef: partnersRef } = useCountUp(4, 2200);

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    requestAnimationFrame(() => setHasMounted(true));
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

        {/* Two-column layout: Info + Globe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left: Bio + Specs */}
          <div
            className={`transition-all duration-700 delay-100 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {/* Specs */}
            <div className="space-y-6 mb-10">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary w-32 shrink-0">
                  ROLE:
                </span>
                <span className="font-mono text-sm text-text-primary">
                  AI Researcher &amp; Robotics Engineer
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary w-32 shrink-0">
                  LOCATION:
                </span>
                <span className="font-mono text-sm text-text-primary">
                  Cairo, Egypt
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary w-32 shrink-0">
                  FOCUS:
                </span>
                <span className="font-mono text-sm text-text-primary">
                  Computer Vision, Autonomous Systems, Deep Learning
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-lg">
              Engineering the nexus of sentient vision and autonomous control.
              SOTA research meets championship-level execution. From building
              medical diagnostic AI to programming autonomous drone swarms, I
              work at the intersection of perception and action.
            </p>

            {/* Tech stack as floating tags */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary block mb-4">
                TECH STACK:
              </span>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech, i) => (
                  <span
                    key={tech}
                    className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-border text-text-secondary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300 cursor-default ${
                      hasMounted
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2'
                    }`}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Globe */}
          <div
            className={`flex items-center justify-center transition-all duration-700 delay-200 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <InteractiveGlobe />
          </div>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-12" />

        {/* Stats row */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 delay-300 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div ref={awardsRef}>
            <div className="font-sans font-black text-4xl md:text-5xl text-text-primary tabular-nums leading-none mb-1">
              {awards}<span className="text-accent">+</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Awards
            </div>
          </div>
          <div ref={projectsRef}>
            <div className="font-sans font-black text-4xl md:text-5xl text-text-primary tabular-nums leading-none mb-1">
              {projectCount}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Projects
            </div>
          </div>
          <div ref={yearsRef}>
            <div className="font-sans font-black text-4xl md:text-5xl text-text-primary tabular-nums leading-none mb-1">
              {years}<span className="text-accent">+</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Years
            </div>
          </div>
          <div ref={partnersRef}>
            <div className="font-sans font-black text-4xl md:text-5xl text-text-primary tabular-nums leading-none mb-1">
              {partners}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Partners
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
