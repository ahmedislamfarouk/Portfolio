'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the plugin once at module level (client only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════
   Reduced-motion helper
   ═══════════════════════════════════════════════════════════════ */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ═══════════════════════════════════════════════════════════════
   Scroll animation factory functions
   ═══════════════════════════════════════════════════════════════ */

export interface ScrollAnimationOptions {
  /** CSS selector or element(s) to animate */
  target: gsap.DOMTarget;
  /** ScrollTrigger trigger element — defaults to `target` */
  trigger?: gsap.DOMTarget;
  /** Where the trigger sits in the viewport (0 = top, 1 = bottom) */
  start?: string;
  /** Scroll position that ends the animation */
  end?: string;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Whether to pin the trigger element */
  pin?: boolean;
  /** scrub — links animation progress to scroll position */
  scrub?: boolean | number;
  /** Additional ScrollTrigger overrides */
  scrollTriggerOverrides?: Record<string, unknown>;
}

/**
 * Fade-in + slide-up from `y` offset.
 */
export function fadeSlideUp(options: ScrollAnimationOptions) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top 85%',
    end = 'top 20%',
    delay = 0,
    duration = 1,
    scrub = false,
    scrollTriggerOverrides,
  } = options;

  gsap.fromTo(
    target,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      delay,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: trigger ?? target,
        start,
        end,
        scrub,
        ...scrollTriggerOverrides,
      },
    },
  );
}

/**
 * Stagger multiple children into view.
 */
export function staggerReveal(options: ScrollAnimationOptions & { stagger?: number }) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top 85%',
    end = 'top 20%',
    delay = 0,
    duration = 0.8,
    scrub = false,
    stagger = 0.12,
    scrollTriggerOverrides,
  } = options;

  gsap.fromTo(
    target,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      delay,
      duration,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: trigger ?? target,
        start,
        end,
        scrub,
        ...scrollTriggerOverrides,
      },
    },
  );
}

/**
 * Parallax — element moves at a different speed than the scroll.
 * `distance` is the total Y translation (positive = moves down, negative = moves up).
 */
export function parallaxMove(
  options: ScrollAnimationOptions & { distance?: number },
) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top bottom',
    end = 'bottom top',
    distance = -80,
    scrub = true,
    scrollTriggerOverrides,
  } = options;

  gsap.fromTo(
    target,
    { y: -distance },
    {
      y: distance,
      ease: 'none',
      scrollTrigger: {
        trigger: trigger ?? target,
        start,
        end,
        scrub,
        ...scrollTriggerOverrides,
      },
    },
  );
}

/**
 * Scale reveal — element starts small and fades in.
 */
export function scaleReveal(options: ScrollAnimationOptions & { fromScale?: number }) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top 85%',
    end = 'top 30%',
    delay = 0,
    duration = 1,
    fromScale = 0.85,
    scrub = false,
    scrollTriggerOverrides,
  } = options;

  gsap.fromTo(
    target,
    { opacity: 0, scale: fromScale },
    {
      opacity: 1,
      scale: 1,
      delay,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: trigger ?? target,
        start,
        end,
        scrub,
        ...scrollTriggerOverrides,
      },
    },
  );
}

/* ═══════════════════════════════════════════════════════════════
   useScrollAnimations — one-shot hook for a container element
   ═══════════════════════════════════════════════════════════════ */

/**
 * Initializes GSAP ScrollTrigger and returns a `containerRef` to attach.
 *
 * Call the exported animation functions (`fadeSlideUp`, `staggerReveal`, …)
 * in a `useEffect` after the component mounts, targeting elements inside
 * `containerRef.current`.
 *
 * Returns a cleanup function that kills all ScrollTrigger instances
 * created within the component lifecycle.
 */
export function useScrollAnimations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggersCreated = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Force ScrollTrigger to recalculate positions
    ScrollTrigger.refresh();

    return () => {
      // Kill only the triggers created in this component scope
      triggersCreated.current.forEach((st) => st.kill());
      triggersCreated.current = [];
    };
  }, []);

  /** Kill all ScrollTriggers (useful on route change in SPA) */
  const killAll = useCallback(() => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return { containerRef, killAll } as const;
}

export { gsap, ScrollTrigger };
