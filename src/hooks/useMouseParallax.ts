'use client';
import { useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export function useMouseParallax(factor = 0.03) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) * factor);
      mouseY.set((e.clientY - cy) * factor);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [factor, mouseX, mouseY]);

  const x = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const y = useSpring(mouseY, { stiffness: 100, damping: 30 });

  return { x, y };
}
