'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CursorFollower — A small glowing cyan dot that follows the mouse cursor
 * with a soft spring delay. Only activates on desktop (pointer: fine) and
 * respects prefers-reduced-motion.
 */
const CursorFollower = () => {
  const [isActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mqReduced.matches) return false;
    const mqPointer = window.matchMedia('(pointer: fine)');
    return mqPointer.matches;
  });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 250, damping: 20, mass: 0.15 });
  const springY = useSpring(cursorY, { stiffness: 250, damping: 20, mass: 0.15 });

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive, cursorX, cursorY]);

  if (!isActive) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: springX,
        y: springY,
        width: 8,
        height: 8,
        marginLeft: -4,
        marginTop: -4,
      }}
    >
      {/* Core dot */}
      <div className="absolute inset-0 rounded-full bg-neon-cyan" />

      {/* Outer glow layers */}
      <div
        className="absolute inset-[-2px] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-[-6px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
        }}
      />

      {/* Neon box-shadow via pseudo */}
      <style>{`
        .cursor-dot-core {
          box-shadow:
            0 0 6px rgba(6,182,212,0.9),
            0 0 14px rgba(6,182,212,0.5),
            0 0 28px rgba(6,182,212,0.2);
        }
      `}</style>
      <div className="absolute inset-0 rounded-full cursor-dot-core bg-neon-cyan" />
    </motion.div>
  );
};

export default CursorFollower;
