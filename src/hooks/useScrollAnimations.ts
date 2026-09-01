'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the plugin once at module level (client only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ================================================================
   Reduced-motion helper
   ================================================================ */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ================================================================
   Animation factory functions — each returns a GSAP context
   for proper cleanup
   ================================================================ */

export interface ScrollAnimationOptions {
  target: gsap.DOMTarget;
  trigger?: gsap.DOMTarget;
  start?: string;
  end?: string;
  delay?: number;
  duration?: number;
  pin?: boolean;
  scrub?: boolean | number;
  once?: boolean;
  scrollTriggerOverrides?: Record<string, unknown>;
}

/**
 * Pattern 1: Slide + Fade (from left/right/offset)
 */
export function slideAndFade(
  options: ScrollAnimationOptions & {
    fromX?: number;
    fromY?: number;
    rotation?: number;
  },
) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top 85%',
    end = 'top 20%',
    delay = 0,
    duration = 1,
    scrub = false,
    once = false,
    fromX = 0,
    fromY = 60,
    rotation = 0,
    scrollTriggerOverrides,
  } = options;

  gsap.fromTo(
    target,
    { opacity: 0, x: fromX, y: fromY, rotation },
    {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      delay,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: trigger ?? target,
        start,
        end,
        scrub,
        toggleActions: once ? 'play none none none' : undefined,
        ...scrollTriggerOverrides,
      },
    },
  );
}

/**
 * Pattern 2: Parallax — element moves at a different speed
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
 * Pattern 3: Scale Reveal — starts small, scales to full
 */
export function scaleReveal(
  options: ScrollAnimationOptions & {
    fromScale?: number;
    fromRotation?: number;
  },
) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top 85%',
    end = 'top 30%',
    delay = 0,
    duration = 1,
    fromScale = 0.8,
    fromRotation = 0,
    scrub = false,
    scrollTriggerOverrides,
  } = options;

  gsap.fromTo(
    target,
    { opacity: 0, scale: fromScale, rotation: fromRotation },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
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
 * Pattern 4: Stagger Reveal — children animate in sequence
 */
export function staggerReveal(
  options: ScrollAnimationOptions & {
    stagger?: number;
    fromY?: number;
    fromX?: number;
  },
) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top 85%',
    end = 'top 20%',
    delay = 0,
    duration = 0.8,
    scrub = false,
    stagger = 0.1,
    fromY = 50,
    fromX = 0,
    scrollTriggerOverrides,
  } = options;

  gsap.fromTo(
    target,
    { opacity: 0, y: fromY, x: fromX },
    {
      opacity: 1,
      y: 0,
      x: 0,
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
 * Pattern 5: Clip Path Reveal — reveals from one edge
 */
export function clipReveal(
  options: ScrollAnimationOptions & {
    direction?: 'left' | 'right' | 'top' | 'bottom';
  },
) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top 85%',
    end = 'top 30%',
    duration = 1.2,
    scrub = true,
    direction = 'left',
    scrollTriggerOverrides,
  } = options;

  const clipMap = {
    left: { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
    right: { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
    top: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
    bottom: { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
  };

  gsap.fromTo(
    target,
    { clipPath: clipMap[direction].from },
    {
      clipPath: clipMap[direction].to,
      duration,
      ease: 'power3.inOut',
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
 * Pattern 6: Horizontal Scroll — pin and translate horizontally
 */
export function horizontalScroll(
  options: ScrollAnimationOptions & {
    xDistance?: number;
  },
) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top top',
    xDistance = -500,
    scrub = 1,
    pin = true,
    scrollTriggerOverrides,
  } = options;

  gsap.to(target, {
    x: xDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger ?? target,
      start,
      end: `+=${Math.abs(xDistance)}`,
      scrub,
      pin,
      ...scrollTriggerOverrides,
    },
  });
}

/**
 * Pattern 7: Draw SVG Line
 */
export function drawLine(
  options: ScrollAnimationOptions & {
    targetSelector?: string;
  },
) {
  if (prefersReducedMotion()) return;
  const {
    target,
    trigger,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = true,
    scrollTriggerOverrides,
  } = options;

  const lines = gsap.utils.toArray<SVGLineElement | SVGPathElement>(
    typeof target === 'string' ? target : [target as SVGLineElement],
  );

  lines.forEach((line) => {
    const length = line.getTotalLength?.() ?? 0;
    if (length > 0) {
      gsap.set(line, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger ?? line,
          start,
          end,
          scrub,
          ...scrollTriggerOverrides,
        },
      });
    }
  });
}

/**
 * Pattern 8: Counter animation — counts up from 0 to target
 */
export function countUp(
  element: HTMLElement,
  end: number,
  options: { duration?: number; prefix?: string; suffix?: string } = {},
) {
  if (prefersReducedMotion()) {
    element.textContent = `${options.prefix ?? ''}${end}${options.suffix ?? ''}`;
    return;
  }

  const { duration = 2, prefix = '', suffix = '' } = options;
  const obj = { val: 0 };

  gsap.to(obj, {
    val: end,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = `${prefix}${Math.floor(obj.val)}${suffix}`;
    },
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      once: true,
    },
  });
}

/* ================================================================
   useScrollAnimations — main hook for GSAP + Lenis integration
   ================================================================ */

/**
 * Central GSAP setup hook. Call this once in the page component.
 *
 * - Registers ScrollTrigger
 * - Integrates Lenis smooth scroll with GSAP ticker
 * - Returns a containerRef for cleanup
 */
export function useScrollAnimations() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Force ScrollTrigger recalculation after a short delay
    // to account for dynamic content
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Recalculate on images loading
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener('load', handleLoad);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  /** Kill all ScrollTriggers */
  const killAll = useCallback(() => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  /** Force refresh all ScrollTrigger positions */
  const refresh = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  return { containerRef, killAll, refresh } as const;
}

/**
 * Helper to create a GSAP context for proper cleanup in React.
 * Usage:
 *   useEffect(() => {
 *     const ctx = gsap.context(() => { ... }, scopeRef);
 *     return () => ctx.revert();
 *   }, []);
 */
export { gsap, ScrollTrigger };
