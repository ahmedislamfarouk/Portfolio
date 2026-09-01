'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

// ── Tech Stack Data ───────────────────────────────────────

const TECH_STACK = [
  'Python',
  'C++',
  'TensorFlow',
  'PyTorch',
  'ROS 2',
  'OpenCV',
  'YOLOv8',
  'FastAPI',
  'React',
  'PostgreSQL',
  'Docker',
  'FAISS',
  'BERT',
  'LangChain',
  'Git',
];

// ── About Section ─────────────────────────────────────────

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const hasSetup = useRef(false);

  // Stats data
  const statsData = useMemo(
    () => [
      { value: 43, suffix: '+', label: 'Awards', prefix: '' },
      { value: 9, suffix: '', label: 'Projects', prefix: '' },
      { value: 2, suffix: '+', label: 'Years', prefix: '' },
      { value: 4, suffix: '', label: 'Partners', prefix: '' },
    ],
    [],
  );

  // Refs for stat value elements
  const statValueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const setupAnimations = useCallback(() => {
    if (hasSetup.current) return;
    hasSetup.current = true;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    // ── Section header: clip-path reveal ──
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1,
          },
        },
      );
    }

    // ── Specs: slide in from left ──
    if (specsRef.current) {
      const specItems = specsRef.current.querySelectorAll('.spec-row');
      gsap.fromTo(
        specItems,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: specsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Bio text: line-by-line reveal ──
    if (bioRef.current) {
      // Split text into lines by wrapping each sentence in a span
      const text = bioRef.current.textContent || '';
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      bioRef.current.innerHTML = sentences
        .map(
          (s) =>
            `<span class="bio-line inline-block overflow-hidden"><span class="inline-block">${s.trim()}</span></span>`,
        )
        .join(' ');

      const bioLines = bioRef.current.querySelectorAll('.bio-line span');
      gsap.fromTo(
        bioLines,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Tech stack: pop in one by one ──
    if (techRef.current) {
      const tags = techRef.current.querySelectorAll('.tech-tag');
      gsap.fromTo(
        tags,
        { opacity: 0, scale: 0.5, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: techRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Globe: parallax ──
    if (globeRef.current) {
      gsap.fromTo(
        globeRef.current,
        { opacity: 0, scale: 0.8, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: globeRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );

      // Continuous rotation based on scroll
      gsap.to(globeRef.current, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 3,
        },
      });
    }

    // ── Stats: count up ──
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll('.stat-item');

      // Slide in stat items
      gsap.fromTo(
        statItems,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );

      // Count up each stat
      statsData.forEach((stat, i) => {
        const el = statValueRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${stat.prefix}${Math.floor(obj.val)}${stat.suffix}`;
          },
        });
      });
    }
  }, [statsData]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setupAnimations();
    });
    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [setupAnimations]);

  return (
    <section id="about" ref={sectionRef} className="border-b border-border">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-10"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          <span className="data-label">SYSTEM SPECS</span>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-10" />

        {/* Two-column layout: Info + Globe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left: Bio + Specs */}
          <div>
            {/* Specs */}
            <div ref={specsRef} className="space-y-6 mb-10">
              <div className="spec-row flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary w-32 shrink-0">
                  ROLE:
                </span>
                <span className="font-mono text-sm text-text-primary">
                  AI Researcher &amp; Robotics Engineer
                </span>
              </div>
              <div className="spec-row flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary w-32 shrink-0">
                  LOCATION:
                </span>
                <span className="font-mono text-sm text-text-primary">
                  Cairo, Egypt
                </span>
              </div>
              <div className="spec-row flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary w-32 shrink-0">
                  FOCUS:
                </span>
                <span className="font-mono text-sm text-text-primary">
                  Computer Vision, Autonomous Systems, Deep Learning
                </span>
              </div>
            </div>

            {/* Bio */}
            <p
              ref={bioRef}
              className="text-text-secondary text-base leading-relaxed mb-8 max-w-lg"
            >
              Engineering the nexus of sentient vision and autonomous control.
              SOTA research meets championship-level execution. From building
              medical diagnostic AI to programming autonomous drone swarms, I
              work at the intersection of perception and action.
            </p>

            {/* Tech stack as floating tags */}
            <div ref={techRef}>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary block mb-4">
                TECH STACK:
              </span>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="tech-tag font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-border text-text-secondary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300 cursor-default opacity-0"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Globe */}
          <div
            ref={globeRef}
            className="flex items-center justify-center opacity-0"
          >
            <InteractiveGlobe />
          </div>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-12" />

        {/* Stats row */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, i) => (
            <div key={stat.label} className="stat-item opacity-0">
              <div className="font-sans font-black text-4xl md:text-5xl text-text-primary tabular-nums leading-none mb-1">
                <span
                  ref={(el) => {
                    statValueRefs.current[i] = el;
                  }}
                >
                  0
                </span>
                {stat.suffix && (
                  <span className="text-accent">{stat.suffix}</span>
                )}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
