'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const hr1Ref = useRef<HTMLDivElement>(null);
  const hr2Ref = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const setupAnimations = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    // ── Name: starts HUGE (18vw), shrinks to normal on scroll ──
    if (nameRef.current) {
      gsap.fromTo(
        nameRef.current,
        {
          fontSize: '18vw',
          opacity: 0,
          y: 40,
        },
        {
          fontSize: 'clamp(4rem, 12vw, 11rem)',
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=400',
            scrub: 1,
          },
        },
      );
    }

    // ── Role typewriter: slide up + fade in ──
    if (roleRef.current) {
      gsap.fromTo(
        roleRef.current,
        { opacity: 0, y: 20, clipPath: 'inset(0 100% 0 0)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power3.out',
          delay: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Tagline: fade in from left ──
    if (taglineRef.current) {
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── CTA button: scale in from 0 ──
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Status bar: slide in from left ──
    if (statusRef.current) {
      gsap.fromTo(
        statusRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Coordinates: slide in from right ──
    if (coordsRef.current) {
      gsap.fromTo(
        coordsRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Horizontal rules: clip-path reveal ──
    [hr1Ref, hr2Ref].forEach((ref, i) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1,
            ease: 'power3.inOut',
            delay: 0.2 + i * 0.3,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          },
        );
      }
    });

    // ── Gradient background: parallax shift ──
    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        backgroundPosition: '100% 50%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      });
    }

    // ── Scroll indicator: parallax fade out on scroll ──
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '10% top',
          end: '30% top',
          scrub: true,
        },
      });
    }
  }, []);

  useEffect(() => {
    // Delay setup to ensure DOM is ready
    const raf = requestAnimationFrame(() => {
      setupAnimations();
    });
    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [setupAnimations]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex items-center min-h-[150vh] overflow-hidden"
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

      {/* Animated gradient background */}
      <div
        ref={gradientRef}
        className="absolute inset-0 hero-gradient opacity-40 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-950/70 via-base-950/40 to-base-950/80 pointer-events-none z-[1]" />

      {/* Content — pinned within first 100vh */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10 py-24 md:py-32">
          {/* Top bar: status + coordinates */}
          <div className="flex items-center justify-between mb-16 md:mb-24">
            <div ref={statusRef} className="flex items-center gap-3 opacity-0">
              <span className="status-indicator" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                STATUS: ONLINE
              </span>
            </div>
            <span
              ref={coordsRef}
              className="font-mono text-[11px] text-text-tertiary hidden sm:block opacity-0"
            >
              [30.0444, 31.2357]
            </span>
          </div>

          {/* Horizontal rule 1 */}
          <div
            ref={hr1Ref}
            className="w-full h-px bg-border mb-12 md:mb-16"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          />

          {/* Name — huge type that shrinks on scroll */}
          <div className="mb-8">
            <h1
              ref={nameRef}
              className="hero-name font-display font-bold uppercase leading-none"
              style={{
                fontSize: '18vw',
                opacity: 0,
              }}
            >
              AHMED
              <br />
              BADR
            </h1>
          </div>

          {/* Role typewriter */}
          <div ref={roleRef} className="mb-6 opacity-0">
            <div className="flex items-center gap-2 font-mono text-lg md:text-xl text-text-secondary h-7">
              <span>{role}</span>
              <span className="terminal-cursor" aria-hidden="true" />
            </div>
          </div>

          {/* Tagline */}
          <p
            ref={taglineRef}
            className="text-text-secondary text-base md:text-lg max-w-lg mb-12 md:mb-16 opacity-0"
          >
            Building autonomous systems that see. Exploring the intersection of
            perception, intelligence, and action.
          </p>

          {/* Horizontal rule 2 */}
          <div
            ref={hr2Ref}
            className="w-full h-px bg-border mb-12 md:mb-16"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          />

          {/* Bottom row: CTA + meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <a
              ref={ctaRef}
              href="#projects"
              className="group inline-flex items-center gap-3 font-mono text-sm font-medium text-text-primary hover:text-accent transition-colors duration-300 opacity-0"
              style={{ transformOrigin: 'left center' }}
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
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div
          className="w-5 h-8 border border-border rounded-full flex justify-center pt-1.5"
          style={{ animation: 'scroll-indicator 2s ease-in-out infinite' }}
        >
          <div className="w-1 h-1.5 bg-accent rounded-full" />
        </div>
      </div>
    </section>
  );
};

export { Hero };
export default Hero;
