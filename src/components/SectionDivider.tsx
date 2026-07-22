'use client';

import { motion } from 'framer-motion';

/**
 * SectionDivider — A thin animated gradient line between major sections.
 * The gradient scrolls slowly from cyan → violet → blue → cyan.
 */
const SectionDivider = () => (
  <div className="relative w-full h-8 flex items-center justify-center overflow-hidden">
    {/* Outer glow layer */}
    <div
      className="absolute w-full h-[1px] opacity-40"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, #06B6D4 20%, #7C3AED 40%, #2563EB 60%, #06B6D4 80%, transparent 100%)',
        backgroundSize: '200% 100%',
        filter: 'blur(4px)',
      }}
      aria-hidden
    />

    {/* Animated gradient line */}
    <motion.div
      className="relative w-full h-[1px]"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, #06B6D4 15%, #7C3AED 35%, #2563EB 55%, #06B6D4 75%, transparent 100%)',
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '200% 50%'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      }}
      aria-hidden
    />

    {/* Center glow dot */}
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-neon-cyan"
      animate={{
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.5, 1],
        boxShadow: [
          '0 0 4px rgba(6,182,212,0.3)',
          '0 0 12px rgba(6,182,212,0.6)',
          '0 0 4px rgba(6,182,212,0.3)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-hidden
    />
  </div>
);

export default SectionDivider;
