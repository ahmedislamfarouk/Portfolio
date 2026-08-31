'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation direction — defaults to 'up' */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Distance in pixels the element slides from */
  distance?: number;
  /** Starting scale for scale-based reveals (0–1) */
  scale?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** Whether to scrub the animation with scroll */
  scrub?: boolean | number;
  /** Additional class names on the wrapper */
  className?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Direction → initial transform mapping
   ═══════════════════════════════════════════════════════════════ */

function getInitialTransform(
  direction: ScrollRevealProps['direction'],
  distance: number,
): gsap.TweenVars {
  switch (direction) {
    case 'up':
      return { y: distance, opacity: 0 };
    case 'down':
      return { y: -distance, opacity: 0 };
    case 'left':
      return { x: distance, opacity: 0 };
    case 'right':
      return { x: -distance, opacity: 0 };
    default:
      return { y: distance, opacity: 0 };
  }
}

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 1,
  distance = 50,
  scale,
  start = 'top 85%',
  scrub = false,
  className = '',
}: ScrollRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Respect user preference
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      // Make visible immediately, skip animation
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const fromVars: gsap.TweenVars = {
      ...getInitialTransform(direction, distance),
    };

    if (scale !== undefined) {
      fromVars.scale = scale;
    }

    const tween = gsap.fromTo(el, fromVars, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      delay,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        ...(typeof scrub === 'boolean' || typeof scrub === 'number'
          ? { scrub }
          : {}),
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [direction, delay, duration, distance, scale, start, scrub]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}
