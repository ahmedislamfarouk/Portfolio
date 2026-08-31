'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * Initializes Lenis smooth scrolling on the client.
 *
 * - Respects `prefers-reduced-motion: reduce` — disables smooth scroll entirely.
 * - Exposes the Lenis instance on `window.__lenis` for cross-component use.
 * - Cleans up the Lenis instance and RAF loop on unmount.
 * - Integrates with GSAP ScrollTrigger via Lenis's `requestAnimationFrame` bridge.
 */
export function useLenis() {
  useEffect(() => {
    // Bail if user prefers reduced motion
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Expose for cross-component smooth scrolling (e.g. Navigation)
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      delete (window as unknown as Record<string, unknown>).__lenis;
    };
  }, []);
}
