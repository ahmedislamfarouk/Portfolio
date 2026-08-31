'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* ─── Glitch Character Set ──────────────────────────────── */
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>{}[]';

/* ─── Particle Field ────────────────────────────────────── */
function ParticleField({ count = 40 }: { count?: number }) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.05,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20,
      drift1: Math.random() * 20 - 10,
      drift2: Math.random() * -20 + 10,
    })),
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#06B6D4',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            y: [0, -30, -60, -90],
            x: [0, p.drift1, p.drift2, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Scan Line Overlay ─────────────────────────────────── */
function ScanLine() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.15) 20%, rgba(6,182,212,0.4) 50%, rgba(6,182,212,0.15) 80%, transparent 100%)',
        }}
        animate={{ top: ['-2%', '102%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/* ─── Single Glitching Letter ───────────────────────────── */
function GlitchLetter({
  char,
  index,
  isRevealing,
  prefersReduced,
}: {
  char: string;
  index: number;
  isRevealing: boolean;
  prefersReduced: boolean;
}) {
  const [displayed, setDisplayed] = useState(char);
  const [scrambling, setScrambling] = useState(false);

  useEffect(() => {
    if (!isRevealing || prefersReduced) {
      setDisplayed(char);
      return;
    }

    const scrambleDelay = index * 80 + 200;
    const settleDelay = scrambleDelay + 300 + index * 60;

    const startTimer = setTimeout(() => {
      setScrambling(true);
      let frame = 0;
      const interval = setInterval(() => {
        frame++;
        // Slow down as we approach settle
        if (frame > 8 && frame % 3 !== 0) return;
        setDisplayed(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
      }, 40);

      const settleTimer = setTimeout(() => {
        clearInterval(interval);
        setDisplayed(char);
        setScrambling(false);
      }, settleDelay - scrambleDelay);

      return () => {
        clearInterval(interval);
        clearTimeout(settleTimer);
      };
    }, scrambleDelay);

    return () => clearTimeout(startTimer);
  }, [char, index, isRevealing, prefersReduced]);

  return (
    <motion.span
      className="inline-block will-change-transform"
      style={{ fontFamily: 'var(--font-heading)' }}
      initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -60, rotateX: -90 }}
      animate={
        isRevealing
          ? prefersReduced
            ? { opacity: 1, y: 0 }
            : { opacity: 1, y: 0, rotateX: 0 }
          : {}
      }
      transition={
        prefersReduced
          ? { duration: 0.01 }
          : {
              type: 'spring',
              stiffness: 300,
              damping: 18,
              mass: 0.8,
              delay: index * 0.08 + 0.3,
            }
      }
    >
      <span
        className="inline-block transition-colors duration-300"
        style={{
          color: scrambling ? '#06B6D4' : '#FFFFFF',
          textShadow: scrambling
            ? '0 0 12px rgba(6,182,212,0.8), 0 0 30px rgba(6,182,212,0.3)'
            : '0 0 40px rgba(6,182,212,0.15)',
        }}
      >
        {displayed}
      </span>
    </motion.span>
  );
}

/* ─── Progress Bar ──────────────────────────────────────── */
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="relative h-[1px] w-full max-w-[280px] overflow-hidden rounded-full bg-white/[0.08]">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, #06B6D4 0%, #2563EB 40%, #7C3AED 70%, #06B6D4 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          width: `${progress}%`,
          backgroundPosition: ['0% 0%', '200% 0%'],
        }}
        transition={{
          width: { type: 'spring', stiffness: 80, damping: 20 },
          backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
        }}
      />
      {/* Glow behind the bar */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full blur-sm"
        style={{
          background:
            'linear-gradient(90deg, #06B6D4 0%, #2563EB 50%, #06B6D4 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          width: `${progress}%`,
          opacity: 0.6,
          backgroundPosition: ['0% 0%', '200% 0%'],
        }}
        transition={{
          width: { type: 'spring', stiffness: 80, damping: 20 },
          backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 0.5 },
        }}
      />
    </div>
  );
}

/* ─── Main Loading Screen ───────────────────────────────── */
interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const prefersReduced = useReducedMotion();

  const BRAND_NAME = 'AHMED';

  /* Simulate loading progress */
  useEffect(() => {
    const steps = [
      { target: 15, delay: 200 },
      { target: 35, delay: 600 },
      { target: 55, delay: 1000 },
      { target: 72, delay: 1400 },
      { target: 88, delay: 1800 },
      { target: 96, delay: 2200 },
      { target: 100, delay: 2600 },
    ];

    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  /* Start brand reveal after progress settles */
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setIsRevealing(true), 300);
      return () => clearTimeout(t);
    }
  }, [progress]);

  /* Trigger exit after brand reveal settles */
  useEffect(() => {
    if (isRevealing) {
      const t = setTimeout(
        () => setIsExiting(true),
        prefersReduced ? 300 : BRAND_NAME.length * 80 + 800,
      );
      return () => clearTimeout(t);
    }
  }, [isRevealing, prefersReduced, BRAND_NAME.length]);

  /* Unmount after exit animation */
  useEffect(() => {
    if (isExiting) {
      const t = setTimeout(
        () => {
          setShouldRender(false);
          onComplete?.();
        },
        prefersReduced ? 100 : 800,
      );
      return () => clearTimeout(t);
    }
  }, [isExiting, onComplete, prefersReduced]);

  /* Handle scroll lock while loading */
  useEffect(() => {
    if (!shouldRender) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000000]"
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-label="Loading portfolio"
          aria-live="polite"
        >
          {/* Background layers */}
          <ParticleField count={35} />
          <ScanLine />

          {/* Subtle radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-12">
            {/* Brand name */}
            <div className="flex items-center gap-[0.05em] overflow-hidden" aria-label={BRAND_NAME}>
              {BRAND_NAME.split('').map((char, i) => (
                <GlitchLetter
                  key={i}
                  char={char}
                  index={i}
                  isRevealing={isRevealing}
                  prefersReduced={!!prefersReduced}
                />
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30"
              style={{ fontFamily: 'var(--font-heading)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={
                isRevealing
                  ? { opacity: 1, y: 0 }
                  : {}
              }
              transition={{
                duration: prefersReduced ? 0.01 : 0.6,
                delay: prefersReduced ? 0 : BRAND_NAME.length * 0.08 + 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Portfolio
            </motion.p>

            {/* Progress section */}
            <div className="flex flex-col items-center gap-4">
              <ProgressBar progress={progress} />

              {/* Percentage */}
              <motion.span
                className="text-[11px] font-medium tabular-nums text-white/40"
                style={{ fontFamily: 'var(--font-body)', fontVariantNumeric: 'tabular-nums' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {String(progress).padStart(3, '0')}
              </motion.span>
            </div>
          </div>

          {/* Corner accents */}
          <div className="pointer-events-none absolute left-6 top-6" aria-hidden="true">
            <motion.div
              className="h-6 w-px bg-white/10"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'top' }}
            />
            <motion.div
              className="mt-1 h-px w-6 bg-white/10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
          <div className="pointer-events-none absolute bottom-6 right-6" aria-hidden="true">
            <motion.div
              className="h-6 w-px bg-white/10"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'bottom' }}
            />
            <motion.div
              className="mt-auto ml-auto h-px w-6 bg-white/10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'right' }}
            />
          </div>
        </motion.div>
      ) : (
        /* Exit animation — split panels */
        <motion.div
          key="exit-overlay"
          className="fixed inset-0 z-[9999] pointer-events-none flex"
          aria-hidden="true"
        >
          {/* Top half */}
          <motion.div
            className="h-1/2 w-full bg-[#000000]"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{
              duration: prefersReduced ? 0.01 : 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
          />
          {/* Bottom half */}
          <motion.div
            className="absolute bottom-0 h-1/2 w-full bg-[#000000]"
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{
              duration: prefersReduced ? 0.01 : 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
          />
          {/* Cyan line flash at split point */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, #06B6D4 30%, #2563EB 70%, transparent 100%)',
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0, 1, 1.2],
            }}
            transition={{
              duration: prefersReduced ? 0.01 : 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.05,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
