'use client';

import { useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTop — A floating glass button that appears when the user scrolls
 * past 300px. Smoothly scrolls to the top on click.
 * Respects prefers-reduced-motion.
 */
const BackToTop = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 300);
  });

  const scrollToTop = useCallback(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'instant' : 'smooth',
    });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 24 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          className={[
            'fixed bottom-8 right-8 z-[500]',
            'w-12 h-12 rounded-full',
            'flex items-center justify-center',
            'border border-white/[0.08]',
            'bg-black/60 backdrop-blur-xl',
            'text-white/60 hover:text-neon-cyan',
            'hover:border-neon-cyan/30',
            'hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
            'transition-colors duration-300',
            'cursor-pointer',
            'group',
          ].join(' ')}
        >
          <ArrowUp
            size={18}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
          {/* Decorative ring */}
          <div className="absolute inset-[-1px] rounded-full border border-white/[0.04] pointer-events-none" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
