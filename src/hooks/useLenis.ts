'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initializes Lenis smooth scrolling on the client.
 *
 * - Respects `prefers-reduced-motion: reduce` — disables smooth scroll entirely.
 * - Integrates with GSAP ScrollTrigger via Lenis's RAF bridge.
 * - Exposes the Lenis instance on `window.__lenis` for cross-component use.
 * - Cleans up the Lenis instance and RAF loop on unmount.
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

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for RAF — this keeps Lenis and ScrollTrigger in sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable lag smoothing on GSAP ticker for consistent feel
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
      delete (window as unknown as Record<string, unknown>).__lenis;
    };
  }, []);
}
