'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { timeline } from '@/data/timeline';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Type color mapping ────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  education: '#06B6D4',
  research: '#8B5CF6',
  work: '#F59E0B',
  achievement: '#10B981',
};

// ── Experience Timeline ───────────────────────────────────

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);
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

    // ── Timeline line: draw itself on scroll ──
    if (lineRef.current && lineContainerRef.current) {
      const line = lineRef.current;
      const length = line.getTotalLength();

      gsap.set(line, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });
    }

    // ── Timeline entries: slide in from alternating sides ──
    const entries = gsap.utils.toArray<HTMLElement>('.timeline-entry');
    entries.forEach((entry, i) => {
      const isLeft = i % 2 === 0;

      gsap.fromTo(
        entry,
        {
          opacity: 0,
          x: isLeft ? -80 : 80,
          rotation: isLeft ? -2 : 2,
        },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: entry,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1,
          },
        },
      );

      // Dot pulse when entry is active
      const dot = entry.querySelector('.timeline-dot');
      if (dot) {
        ScrollTrigger.create({
          trigger: entry,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => dot.classList.add('active'),
          onLeave: () => dot.classList.remove('active'),
          onEnterBack: () => dot.classList.add('active'),
          onLeaveBack: () => dot.classList.remove('active'),
        });
      }
    });
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
    <section
      id="experience"
      ref={sectionRef}
      className="border-b border-border"
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-10"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          <span className="data-label">CAREER PATH</span>
          <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tight mt-4">
            EXPERIENCE
          </h2>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-10" />

        {/* Timeline container */}
        <div ref={timelineRef} className="relative">
          {/* Vertical line (SVG for drawing animation) */}
          <div
            ref={lineContainerRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <line
                ref={lineRef}
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke="#06B6D4"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
            </svg>
          </div>

          {/* Timeline entries */}
          <div className="space-y-12 md:space-y-16">
            {timeline.map((entry, i) => {
              const isLeft = i % 2 === 0;
              const typeColor = TYPE_COLORS[entry.type] || '#06B6D4';

              return (
                <div
                  key={`${entry.date}-${entry.title}`}
                  className={`timeline-entry relative flex flex-col md:flex-row items-start gap-6 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                    <div
                      className="timeline-dot w-3 h-3 rounded-full border-2 border-base-950"
                      style={{ backgroundColor: typeColor }}
                    />
                  </div>

                  {/* Content card — alternating sides */}
                  <div
                    className={`w-full md:w-[calc(50%-2rem)] ml-10 md:ml-0 ${
                      isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                    }`}
                  >
                    {/* Date + type badge */}
                    <div
                      className={`flex items-center gap-3 mb-3 ${
                        isLeft ? 'md:justify-end' : 'md:justify-start'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-text-tertiary">
                        {entry.date}
                      </span>
                      <span
                        className="font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border"
                        style={{
                          color: typeColor,
                          borderColor: `${typeColor}40`,
                          backgroundColor: `${typeColor}10`,
                        }}
                      >
                        {entry.type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-sans font-bold text-lg md:text-xl uppercase tracking-tight text-text-primary mb-1">
                      {entry.title}
                    </h3>

                    {/* Organization + Location */}
                    <div className="font-mono text-[11px] text-text-tertiary mb-3">
                      <span>{entry.organization}</span>
                      <span className="mx-2">|</span>
                      <span>{entry.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {entry.description}
                    </p>

                    {/* Highlights */}
                    <ul
                      className={`space-y-2 mb-4 ${
                        isLeft ? 'md:text-right' : 'md:text-left'
                      }`}
                    >
                      {entry.highlights.map((highlight, j) => (
                        <li key={j} className="flex gap-2 text-text-secondary text-xs leading-relaxed">
                          <span
                            className="text-accent shrink-0 mt-0.5"
                            style={{
                              transform: isLeft
                                ? 'scaleX(-1)'
                                : 'none',
                            }}
                          >
                            &#x25B8;
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tags */}
                    <div
                      className={`flex flex-wrap gap-1.5 ${
                        isLeft ? 'md:justify-end' : 'md:justify-start'
                      }`}
                    >
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 border border-border text-text-tertiary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
