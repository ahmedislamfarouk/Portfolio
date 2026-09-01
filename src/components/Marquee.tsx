'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Expertise Tags ────────────────────────────────────────

const EXPERTISE_TAGS = [
  'Computer Vision',
  'Deep Learning',
  'ROS 2',
  'TensorFlow',
  'PyTorch',
  'YOLOv8',
  'Autonomous Systems',
  'Sensor Fusion',
  'NLP',
  'Reinforcement Learning',
  'LLMs',
  'RAG',
  'FastAPI',
  'OpenCV',
  'Docker',
  'FAISS',
  'BERT',
  'Medial AI',
  'Robotics',
  'Edge Computing',
];

// ── Marquee Component ─────────────────────────────────────

const Marquee = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hasSetup = useRef(false);

  useEffect(() => {
    if (hasSetup.current) return;
    hasSetup.current = true;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const track = trackRef.current;
    if (!track) return;

    const currentSection = sectionRef.current;

    // ── Scroll-velocity driven speed ──
    // The marquee speed increases as user scrolls through it
    ScrollTrigger.create({
      trigger: currentSection,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        // getVelocity() returns scroll speed in px/s
        const velocity = Math.abs(self.getVelocity());
        // Map velocity to animation speed: faster scroll = faster marquee
        const speedMultiplier = 1 + Math.min(velocity / 500, 3);
        const baseDuration = 30;
        const newDuration = baseDuration / speedMultiplier;

        track.style.animationDuration = `${newDuration}s`;
      },
    });

    // ── Clip-path reveal on scroll ──
    gsap.fromTo(
      currentSection,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: currentSection,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === currentSection) st.kill();
      });
    };
  }, []);

  // Duplicate tags for seamless loop
  const allTags = [...EXPERTISE_TAGS, ...EXPERTISE_TAGS];

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 border-b border-border overflow-hidden"
    >
      {/* Section label */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 mb-8">
        <span className="data-label">EXPERTISE MATRIX</span>
      </div>

      {/* Marquee track */}
      <div className="marquee-container">
        <div ref={trackRef} className="marquee-track">
          {allTags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-3 mx-4 md:mx-6 font-mono text-sm md:text-base uppercase tracking-wider text-text-secondary hover:text-accent transition-colors duration-300 cursor-default select-none"
            >
              <span className="w-1.5 h-1.5 bg-accent/40 rounded-full shrink-0" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Second row — reverse direction */}
      <div className="marquee-container mt-4">
        <div
          className="marquee-track"
          style={{ animationDirection: 'reverse', animationDuration: '40s' }}
        >
          {[...allTags].reverse().map((tag, i) => (
            <span
              key={`rev-${tag}-${i}`}
              className="inline-flex items-center gap-3 mx-4 md:mx-6 font-mono text-xs md:text-sm uppercase tracking-wider text-text-tertiary hover:text-accent transition-colors duration-300 cursor-default select-none"
            >
              <span className="w-1 h-1 border border-accent/30 rounded-full shrink-0" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marquee;
