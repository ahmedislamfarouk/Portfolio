'use client';

import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useCallback } from 'react';

interface TiltOptions {
  scale?: number;      // hover scale (default: 1.02)
  rotation?: number;   // max rotation degrees (default: 8)
  springStiffness?: number;  // (default: 250)
  springDamping?: number;    // (default: 20)
}

export function useTiltEffect<T extends HTMLElement>(options: TiltOptions = {}) {
  const {
    scale = 1.02,
    rotation = 8,
    springStiffness = 250,
    springDamping = 20,
  } = options;

  const ref = useRef<T>(null);

  // Respect prefers-reduced-motion — disable tilt when user prefers reduced motion.
  // Check only on the client to avoid SSR issues.
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [rotation, -rotation]),
    { stiffness: springStiffness, damping: springDamping },
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-rotation, rotation]),
    { stiffness: springStiffness, damping: springDamping },
  );
  const scaleVal = useSpring(1, {
    stiffness: springStiffness,
    damping: springDamping,
  });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (prefersReducedMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(px);
      y.set(py);
      scaleVal.set(scale);
    },
    [scale, x, y, scaleVal, prefersReducedMotion],
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    scaleVal.set(1);
  }, [x, y, scaleVal]);

  const style = {
    rotateX,
    rotateY,
    scale: scaleVal,
    transformStyle: 'preserve-3d' as const,
    perspective: 800,
  } as const;

  return { ref, onMouseMove, onMouseLeave, style };
}
