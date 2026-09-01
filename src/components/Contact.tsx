'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Lazy-load 3D element ──────────────────────────────────

const FloatingCube = dynamic(
  () => import('@/components/three/FloatingCube'),
  {
    ssr: false,
    loading: () => <div className="w-32 h-32" />,
  },
);

// ── Data ──────────────────────────────────────────────────

const LINKS = [
  { label: 'ahmed@nomeda.ai', url: 'mailto:ahmed@nomeda.ai', type: 'email' },
  {
    label: 'github.com/ahmedislamfarouk',
    url: 'https://github.com/ahmedislamfarouk',
    type: 'github',
  },
  {
    label: 'linkedin.com/in/ahmedbadr',
    url: 'https://linkedin.com/in/ahmedbadr',
    type: 'linkedin',
  },
] as const;

// ── Contact Section ───────────────────────────────────────

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const hasSetup = useRef(false);

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

    // ── Links: slide in from bottom with stagger ──
    if (linksRef.current) {
      const linkItems = linksRef.current.querySelectorAll('.contact-link');
      gsap.fromTo(
        linkItems,
        { opacity: 0, y: 40, rotation: -2 },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: linksRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── CTA: scale in from 0 ──
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Cube: slide in from right with rotation ──
    if (cubeRef.current) {
      gsap.fromTo(
        cubeRef.current,
        { opacity: 0, x: 60, rotation: 15 },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cubeRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Footer: fade in ──
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        },
      );
    }
  }, []);

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
    <section id="contact" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div ref={headerRef} className="mb-10" style={{ clipPath: 'inset(0 100% 0 0)' }}>
          <span className="data-label">UPLINK</span>
          <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tight mt-4">
            GET IN TOUCH
          </h2>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Links + CTA */}
          <div>
            <div className="space-y-1 mb-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                ESTABLISHED CHANNELS:
              </span>
            </div>

            <div ref={linksRef} className="space-y-4">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target={link.type !== 'email' ? '_blank' : undefined}
                  rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                  className="contact-link group flex items-center gap-4 py-4 border-b border-border hover:border-accent transition-colors duration-300 opacity-0"
                >
                  <span className="w-10 h-10 flex items-center justify-center border border-border group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300 shrink-0">
                    <span className="text-sm text-text-tertiary group-hover:text-accent transition-colors duration-300">
                      {link.type === 'email'
                        ? '@'
                        : link.type === 'github'
                          ? 'G'
                          : 'L'}
                    </span>
                  </span>
                  <div className="flex-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-tertiary block mb-0.5">
                      {link.type}
                    </span>
                    <span className="font-mono text-sm text-text-secondary group-hover:text-accent transition-colors duration-300 hover-underline">
                      {link.label}
                    </span>
                  </div>
                  <span className="link-arrow text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    &rarr;
                  </span>
                </a>
              ))}
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="mt-10 opacity-0">
              <p className="text-text-secondary text-sm leading-relaxed max-w-md mb-6">
                Open to research collaborations, robotics projects, and
                interesting conversations about AI. Based in Cairo, available
                globally.
              </p>
              <a
                href="mailto:ahmed@nomeda.ai"
                className="inline-flex items-center gap-3 font-mono text-sm font-medium text-text-primary hover:text-accent transition-colors duration-300 group"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 border border-border group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300">
                  <span className="text-sm">&rarr;</span>
                </span>
                <span className="uppercase tracking-[0.15em] text-[11px]">
                  SEND MESSAGE
                </span>
              </a>
            </div>
          </div>

          {/* Right: 3D Element */}
          <div
            ref={cubeRef}
            className="flex items-center justify-center opacity-0"
          >
            <FloatingCube />
          </div>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px mt-16 mb-8" />

        {/* Footer */}
        <div
          ref={footerRef}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-0"
        >
          <span className="font-mono text-[11px] text-text-tertiary">
            &copy; 2026 AHMED BADR
          </span>
          <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-[0.2em]">
            Built with Next.js 15 + GSAP ScrollTrigger
          </span>
        </div>
      </div>
    </section>
  );
};

export default Contact;
