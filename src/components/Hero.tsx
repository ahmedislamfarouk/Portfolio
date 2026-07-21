'use client';

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  Trophy,
  Bot,
  Clock,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';

// ═════════════════════════════════════════════════════════════════════
//  Constants
// ═════════════════════════════════════════════════════════════════════

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#ABCXYZabcxyz0123456789';
const randomChar = (): string =>
  GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

type CinematicPhase =
  | 'intro'
  | 'letter-A'
  | 'letter-H'
  | 'letter-M'
  | 'letter-E'
  | 'letter-D'
  | 'shockwave'
  | 'badr'
  | 'typewriter'
  | 'complete';

const PHASE_ORDER: CinematicPhase[] = [
  'intro',
  'letter-A',
  'letter-H',
  'letter-M',
  'letter-E',
  'letter-D',
  'shockwave',
  'badr',
  'typewriter',
  'complete',
];

const LETTERS = ['A', 'H', 'M', 'E', 'D'] as const;
const LETTER_PHASES: CinematicPhase[] = [
  'letter-A',
  'letter-H',
  'letter-M',
  'letter-E',
  'letter-D',
];

// ═════════════════════════════════════════════════════════════════════
//  useCinematicSequence — timeline-based phase state machine
// ═════════════════════════════════════════════════════════════════════

function useCinematicSequence(prefersReduced: boolean) {
  const [phase, setPhase] = useState<CinematicPhase>(
    prefersReduced ? 'complete' : 'intro',
  );

  useEffect(() => {
    if (prefersReduced) return;

    const timeline: [number, CinematicPhase][] = [
      [500, 'letter-A'],
      [800, 'letter-H'],
      [1100, 'letter-M'],
      [1400, 'letter-E'],
      [1700, 'letter-D'],
      [2200, 'shockwave'],
      [2500, 'badr'],
      [3200, 'typewriter'],
      [4200, 'complete'],
    ];

    const timeouts = timeline.map(
      ([time, p]) => setTimeout(() => setPhase(p), time),
    );

    return () => timeouts.forEach(clearTimeout);
  }, [prefersReduced]);

  return phase;
}

// ═════════════════════════════════════════════════════════════════════
//  useTypewriter — with start guard for cinematic timing
// ═════════════════════════════════════════════════════════════════════

const useTypewriter = (
  words: string[],
  speed = 100,
  pause = 2000,
  start = false,
) => {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!start) return;

    const current = words[wordIdx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplayed(current.slice(0, displayed.length + 1));
          if (displayed.length === current.length) {
            setTimeout(() => setDeleting(true), pause);
          }
        } else {
          setDisplayed(current.slice(0, displayed.length - 1));
          if (displayed.length === 0) {
            setDeleting(false);
            setWordIdx((i) => (i + 1) % words.length);
          }
        }
      },
      deleting ? speed / 2 : speed,
    );
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx, words, speed, pause, start]);

  return displayed;
};

// ═════════════════════════════════════════════════════════════════════
//  useCountUp — animated counter (enters on mount)
// ═════════════════════════════════════════════════════════════════════

const useCountUp = (end: number, duration = 2200) => {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [count, setCount] = useState(prefersReduced ? end : 0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReduced) return;
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, prefersReduced]);

  return { count, ref };
};

// ═════════════════════════════════════════════════════════════════════
//  ParticleBurst — radial scatter of tiny glowing dots
// ═════════════════════════════════════════════════════════════════════

interface ParticleBurstProps {
  count?: number;
  spread?: number;
  color?: string;
}

const ParticleBurst = ({
  count = 18,
  spread = 1,
  color = '#06B6D4',
}: ParticleBurstProps) => {
  // Stable particle generation via lazy ref (single init, not during render)
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => {
      const angle =
        (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = (25 + Math.random() * 65) * spread;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: 1.5 + Math.random() * 3.5,
        delay: Math.random() * 0.1,
        duration: 0.5 + Math.random() * 0.4,
      };
    }),
  );

  const glow = useMemo(() => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},0.6)`;
  }, [color]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 30 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 4}px ${glow}`,
          }}
        />
      ))}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════
//  LetterDrop — single character with drop spring + glitch scramble
// ═════════════════════════════════════════════════════════════════════

interface LetterDropProps {
  char: string;
  isActive: boolean;
  onLand: () => void;
  prefersReduced: boolean;
}

const LetterDrop = ({
  char,
  isActive,
  onLand,
  prefersReduced,
}: LetterDropProps) => {
  const [displayChar, setDisplayChar] = useState(char);
  const [showBurst, setShowBurst] = useState(false);
  const landedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Glitch scramble when letter starts dropping
  useEffect(() => {
    if (!isActive || landedRef.current || prefersReduced) return;

    let count = 0;
    intervalRef.current = setInterval(() => {
      count++;
      if (count >= 6) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayChar(char);
      } else {
        setDisplayChar(randomChar());
      }
    }, 45 + Math.random() * 25);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, char, prefersReduced]);

  // Reduced motion — static fallback
  if (prefersReduced) {
    return (
      <span className="inline-block text-[clamp(3.5rem,14vw,13rem)] font-black tracking-ultra leading-ultra select-none text-white">
        {char}
      </span>
    );
  }

  return (
    <span className="relative inline-block">
      <motion.span
        initial={{ y: -200, opacity: 0, scale: 0.5 }}
        animate={
          isActive
            ? { y: 0, opacity: 1, scale: 1 }
            : { y: -200, opacity: 0, scale: 0.5 }
        }
        transition={{
          type: 'spring',
          stiffness: 80,
          damping: 10,
          mass: 0.9,
        }}
        onAnimationComplete={() => {
          if (isActive && !landedRef.current) {
            landedRef.current = true;
            setShowBurst(true);
            onLand();
            setTimeout(() => setShowBurst(false), 1200);
          }
        }}
        className="inline-block text-[clamp(3.5rem,14vw,13rem)] font-black tracking-ultra leading-ultra select-none text-white"
        style={{ willChange: 'transform, opacity' }}
      >
        {displayChar}
      </motion.span>
      {showBurst && <ParticleBurst count={14} spread={0.8} />}
    </span>
  );
};

// ═════════════════════════════════════════════════════════════════════
//  BadrReveal — explosive spring reveal with neon glow bloom
// ═════════════════════════════════════════════════════════════════════

const BadrReveal = ({
  show,
  prefersReduced,
}: {
  show: boolean;
  prefersReduced: boolean;
}) => {
  const [intensity, setIntensity] = useState(1);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    if (!show || prefersReduced) return;
    const t1 = setTimeout(() => setIntensity(0.35), 1500);
    const t2 = setTimeout(() => setShowBurst(true), 300);
    const t3 = setTimeout(() => setShowBurst(false), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [show, prefersReduced]);

  if (prefersReduced) {
    return (
      <span className="text-gradient inline-block text-[clamp(3.5rem,14vw,13rem)] font-black tracking-ultra leading-ultra">
        BADR
      </span>
    );
  }

  const glowIntense =
    '0 0 20px rgba(6,182,212,0.8), 0 0 40px rgba(6,182,212,0.6), 0 0 80px rgba(6,182,212,0.4), 0 0 120px rgba(6,182,212,0.2)';
  const glowSettled =
    '0 0 12px rgba(6,182,212,0.35), 0 0 24px rgba(6,182,212,0.2), 0 0 48px rgba(6,182,212,0.1)';

  return (
    <span className="relative inline-block">
      {/* Ambient glow aura behind text */}
      {show && intensity > 0.3 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: intensity === 1 ? 0.5 : 0.15,
            scale: 1.15,
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 text-gradient font-black blur-xl pointer-events-none select-none"
          aria-hidden="true"
          style={{
            fontSize: 'inherit',
            filter: 'blur(30px)',
            WebkitTextFillColor: 'transparent',
            background:
              'radial-gradient(ellipse, rgba(6,182,212,0.4) 0%, transparent 70%)',
          }}
        >
          BADR
        </motion.span>
      )}

      {/* Main BADR text */}
      <motion.span
        initial={{ scale: 0, opacity: 0, filter: 'blur(20px)' }}
        animate={
          show
            ? {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
              }
            : { scale: 0, opacity: 0, filter: 'blur(20px)' }
        }
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 16,
          mass: 1.1,
        }}
        className="text-gradient inline-block text-[clamp(3.5rem,14vw,13rem)] font-black tracking-ultra leading-ultra relative"
        style={{
          textShadow: show
            ? intensity === 1
              ? glowIntense
              : glowSettled
            : 'none',
          transition: 'text-shadow 1s ease',
        }}
      >
        BADR
      </motion.span>

      {/* Radial particle burst */}
      {showBurst && <ParticleBurst count={32} spread={1.8} color="#7C3AED" />}
    </span>
  );
};

// ═════════════════════════════════════════════════════════════════════
//  ShockwaveRing — expanding ring that fills viewport
// ═════════════════════════════════════════════════════════════════════

const ShockwaveRing = () => (
  <motion.div
    initial={{ width: 0, height: 0, opacity: 0.7, borderRadius: '50%' }}
    animate={{
      width: '300vw',
      height: '300vw',
      opacity: 0,
    }}
    transition={{ duration: 0.9, ease: [0.11, 0, 0.1, 1] }}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    style={{
      border: '1.5px solid rgba(6,182,212,0.45)',
      boxShadow:
        '0 0 40px rgba(6,182,212,0.3), inset 0 0 60px rgba(6,182,212,0.04)',
      zIndex: 25,
    }}
  />
);

// ═════════════════════════════════════════════════════════════════════
//  PARTICLE STARFIELD (WaveLight) — canvas-based
// ═════════════════════════════════════════════════════════════════════

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  isBright: boolean;
  hue: number;
}

const PARTICLE_COUNT = 200;
const CONNECTION_DIST = 150;
const DRIFT_SPEED = 0.22;

const WaveLight = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    /* ── Resize handler ─────────────────────────────────── */
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Helpers ─────────────────────────────────────────── */
    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    /* ── Init particles ─────────────────────────────────── */
    const count = prefersReduced ? 50 : PARTICLE_COUNT;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * DRIFT_SPEED,
      vy: (Math.random() - 0.5) * DRIFT_SPEED,
      size:
        Math.random() < 0.06
          ? Math.random() * 2 + 1.8
          : Math.random() * 1.4 + 0.3,
      alpha:
        Math.random() < 0.06
          ? Math.random() * 0.5 + 0.5
          : Math.random() * 0.3 + 0.06,
      isBright: Math.random() < 0.06,
      hue: Math.random(),
    }));
    particlesRef.current = particles;

    /* ── Mouse tracking ─────────────────────────────────── */
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseleave', onMouseLeave);

    /* ── Draw loop ──────────────────────────────────────── */
    let fadeProgress = 0;
    const draw = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      ctx.clearRect(0, 0, cw, ch);

      // Slowly fade particles in on first load
      fadeProgress = Math.min(fadeProgress + 0.003, 1);
      const fadeAlpha = fadeProgress;

      const mouse = mouseRef.current;
      const nearMouse = mouse.x > 0 && mouse.y > 0;

      /* ── Update & draw particles ──────────────────────── */
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle mouse attraction
        if (nearMouse) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 260 && dist > 1) {
            const force = (1 - dist / 260) * 0.004;
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        // Damping
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Wrap edges
        if (p.x < -15) p.x = cw + 15;
        if (p.x > cw + 15) p.x = -15;
        if (p.y < -15) p.y = ch + 15;
        if (p.y > ch + 15) p.y = -15;

        // Draw
        const color = p.isBright
          ? `rgba(255, 255, 255, ${p.alpha * fadeAlpha})`
          : `rgba(6, 182, 212, ${p.alpha * fadeAlpha * (1 - p.hue * 0.4)})`;

        if (p.isBright) {
          ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
          ctx.shadowBlur = 12;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      /* ── Constellation connections ────────────────────── */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = dx * dx + dy * dy;

          if (dist < CONNECTION_DIST * CONNECTION_DIST) {
            const d = Math.sqrt(dist);
            const alpha =
              (1 - d / CONNECTION_DIST) * 0.12 * fadeAlpha;
            const brightness =
              a.isBright || b.isBright ? alpha * 1.6 : alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${brightness})`;
            ctx.lineWidth = a.isBright || b.isBright ? 0.7 : 0.35;
            ctx.stroke();
          }
        }
      }

      if (!prefersReduced) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    /* ── Cleanup ────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 1 }}
    />
  );
};

// ═════════════════════════════════════════════════════════════════════
//  ScrollProgress — thin cyan bar at top
// ═════════════════════════════════════════════════════════════════════

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent-cyan z-[600] origin-left"
      style={{ scaleX }}
    />
  );
};

// ═════════════════════════════════════════════════════════════════════
//  MarqueeTicker — scrolling expertise tags
// ═════════════════════════════════════════════════════════════════════

const MarqueeTicker = () => {
  const items = [
    'Computer Vision',
    'ROS 2',
    'Sensor Fusion',
    'YOLOv8',
    'Autonomous Systems',
    'Large Language Models',
    'Reinforcement Learning',
    'Medical AI',
    'RAG Pipelines',
    'Drone Swarms',
    'Taekwondo Champion',
    'Edge Deployment',
  ];
  const doubled = [...items, ...items];

  return (
    <div className="relative py-4 border-y border-white/[0.06] overflow-hidden bg-base-900/30 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-base-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-base-950 to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-0 whitespace-nowrap"
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/25 px-6">
              {item}
            </span>
            <span className="text-accent-cyan/40 text-xs">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════
//  StatCard — bento card with animated count-up
// ═════════════════════════════════════════════════════════════════════

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

const StatCard = ({ icon: Icon, value, suffix, label, delay }: StatCardProps) => {
  const { count, ref } = useCountUp(value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bento-card relative overflow-hidden group px-5 py-5 min-w-[130px] flex-1 lg:flex-none cursor-default"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-cyan via-accent-cyan/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -left-4 -top-4 w-20 h-20 bg-accent-cyan/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex items-start gap-3 relative z-[1]">
        <div className="p-2 rounded-lg bg-accent-cyan/5 border border-accent-cyan/10 group-hover:bg-accent-cyan/10 transition-colors duration-300">
          <Icon size={16} className="text-accent-cyan" />
        </div>
        <div>
          <div className="text-3xl font-black tracking-ultra text-white tabular-nums">
            {count}
            <span className="text-accent-cyan/60">{suffix}</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-0.5 whitespace-nowrap">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ═════════════════════════════════════════════════════════════════════
//  ScrollIndicator — bouncing chevron with rotating rings
// ═════════════════════════════════════════════════════════════════════

const ScrollIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
  >
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 border border-white/[0.07] rounded-full animate-spin-slow" />
      <div
        className="absolute inset-[3px] border border-white/[0.04] rounded-full animate-spin-slow"
        style={{ animationDirection: 'reverse', animationDuration: '12s' }}
      />
      <ChevronDown
        size={16}
        className="text-white/30 animate-bounce"
        style={{ animationDuration: '1.5s' }}
      />
    </div>
    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/[0.15]">
      Scroll
    </span>
  </motion.div>
);

// ═════════════════════════════════════════════════════════════════════
//  FloatingRing — decorative rotating rings
// ═════════════════════════════════════════════════════════════════════

const FloatingRing = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="absolute top-[18%] right-[6%] pointer-events-none hidden lg:block"
    aria-hidden="true"
  >
    <div className="relative w-44 h-44">
      <div className="absolute inset-0 border border-accent-cyan/[0.07] rounded-full animate-spin-slow" />
      <div
        className="absolute inset-[18%] border border-accent-cyan/[0.04] rounded-full animate-spin-slow"
        style={{ animationDirection: 'reverse', animationDuration: '14s' }}
      />
      <div
        className="absolute inset-[36%] border border-white/[0.03] rounded-full animate-spin-slow"
        style={{ animationDirection: 'reverse', animationDuration: '22s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Sparkles size={18} className="text-accent-cyan/[0.12]" />
      </div>
    </div>
  </motion.div>
);

// ═════════════════════════════════════════════════════════════════════
//  HERO — cinematic entrance centerpiece
// ═════════════════════════════════════════════════════════════════════

const Hero = () => {
  /* ── Reduced motion detection ─────────────────────────────── */
  const [prefersReduced, setPrefersReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ── Cinematic phase ─────────────────────────────────────── */
  const phase = useCinematicSequence(prefersReduced);

  /* ── Typewriter ───────────────────────────────────────────── */
  const roles = [
    'AI Researcher',
    'Robotics Engineer',
    'Vision Systems',
    'Champion Athlete',
  ];
  const typewriterStart = phase === 'typewriter' || phase === 'complete' || prefersReduced;
  const role = useTypewriter(roles, 80, 2200, typewriterStart);

  /* ── Scroll / parallax ────────────────────────────────────── */
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const ringY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  /* ── Phase helpers (numeric index for reliable comparison) ── */
  const currentIdx = PHASE_ORDER.indexOf(phase);
  const typewriterIdx = PHASE_ORDER.indexOf('typewriter');
  const isComplete = phase === 'complete';
  const isAtOrAfterTypewriter = currentIdx >= typewriterIdx;
  const showLabel = isComplete || prefersReduced;
  const showTypewriter = isAtOrAfterTypewriter || prefersReduced;
  const showCTA = isAtOrAfterTypewriter || prefersReduced;
  const showDescription = isComplete || prefersReduced;
  const showSocial = isComplete || prefersReduced;
  const showStats = isComplete || prefersReduced;
  const showScrollIndicator = isComplete || prefersReduced;
  const showFloatingRing = isComplete || prefersReduced;

  /* ── Stats config ─────────────────────────────────────────── */
  const stats = [
    { icon: Trophy, value: 43, suffix: '+', label: 'Global Honors', delay: 0.4 },
    { icon: Bot, value: 9, suffix: '', label: 'AI Projects', delay: 0.5 },
    { icon: Clock, value: 2, suffix: '+', label: 'Yrs Research', delay: 0.6 },
  ] as const;

  /* ── Reduced motion fast path ─────────────────────────────── */
  if (prefersReduced) {
    return (
      <section
        id="about"
        ref={ref}
        className="relative flex items-center overflow-hidden min-h-dvh pt-28"
      >
        <WaveLight />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950/40" />

        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-[100px]" />
        </motion.div>

        <motion.div style={{ y: ringY }}>
          <FloatingRing />
        </motion.div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-end min-h-[75vh] py-16 lg:py-24">
            <div className="space-y-7 lg:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap items-center gap-4"
              >
                <span className="section-label">Cairo, Egypt · Available Globally</span>
                <span className="tag bg-accent-cyan/5 border-accent-cyan/25 text-accent-cyan">
                  <span className="status-dot inline mr-2" aria-hidden="true" />
                  Building: SkyVision Swarm
                </span>
              </motion.div>

              <div className="relative">
                <div className="absolute -left-12 -top-12 -right-12 -bottom-12 bg-accent-cyan/[0.04] blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -left-8 -top-8 -right-8 -bottom-8 bg-accent-cyan/[0.02] blur-[60px] rounded-full pointer-events-none" />

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[clamp(3.5rem,14vw,13rem)] tracking-ultra leading-ultra glitch-text relative select-none"
                >
                  Ahmed
                  <br />
                  <span className="text-gradient">Badr</span>
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-2 text-xl md:text-2xl font-light text-white/60 h-8"
              >
                <span>{role}</span>
                <span className="cursor" aria-hidden="true" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-white/40 text-base max-w-lg leading-relaxed"
              >
                Engineering the nexus of sentient vision and autonomous control.
                SOTA research meets championship-level execution.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <a href="#projects" className="btn-primary cursor-pointer">
                  View Work <ArrowUpRight size={14} />
                </a>
                <a href="#contact" className="btn-ghost cursor-pointer">
                  Get in Touch
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/15 pt-2">
                  <span className="text-white/8">Featured:</span>
                  <span className="text-white/30 hover:text-accent-cyan/70 transition-colors duration-200 cursor-default">UofL</span>
                  <span className="text-white/8">·</span>
                  <span className="text-white/30 hover:text-accent-cyan/70 transition-colors duration-200 cursor-default">JMU</span>
                  <span className="text-white/8">·</span>
                  <span className="text-white/30 hover:text-accent-cyan/70 transition-colors duration-200 cursor-default">Virginia Tech</span>
                  <span className="text-white/8">·</span>
                  <span className="text-white/30 hover:text-accent-cyan/70 transition-colors duration-200 cursor-default">AIU</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-row lg:flex-col gap-3"
            >
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </motion.div>
          </div>
        </div>

        <ScrollIndicator />
      </section>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     FULL CINEMATIC RENDER
     ══════════════════════════════════════════════════════════════ */

  return (
    <section
      id="about"
      ref={ref}
      className="relative flex items-center overflow-hidden min-h-dvh pt-28"
    >
      {/* ── Background layers ─────────────────────────────────── */}
      <WaveLight />

      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950/40" />

      {/* Dark intro overlay — fades out over 1.2s revealing particles */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="fixed inset-0 bg-base-950 pointer-events-none"
        style={{ zIndex: 40 }}
      />

      {/* Parallax orbs */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-[100px]" />
      </motion.div>

      {/* Decorative rings */}
      {showFloatingRing && (
        <motion.div style={{ y: ringY }}>
          <FloatingRing />
        </motion.div>
      )}

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-end min-h-[75vh] py-16 lg:py-24">
          {/* ════ LEFT ═══════════════════════════════════════════ */}
          <div className="space-y-7 lg:space-y-8">
            {/* Section label */}
            {showLabel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-4"
              >
                <span className="section-label">
                  Cairo, Egypt · Available Globally
                </span>
                <span className="tag bg-accent-cyan/5 border-accent-cyan/25 text-accent-cyan">
                  <span className="status-dot inline mr-2" aria-hidden="true" />
                  Building: SkyVision Swarm
                </span>
              </motion.div>
            )}

            {/* ════ CINEMATIC HEADING ════════════════════════════ */}
            <div className="relative">
              {/* Subtle ambient glow behind heading — only after complete */}
              {isComplete && (
                <div className="absolute -left-12 -top-12 -right-12 -bottom-12 bg-accent-cyan/[0.04] blur-[80px] rounded-full pointer-events-none" />
              )}

              <h1 className="text-[clamp(3.5rem,14vw,13rem)] tracking-ultra leading-ultra relative select-none">
                {/* AHMED — letter drops */}
                <span className="flex items-center gap-1 sm:gap-2 lg:gap-4 mb-1 sm:mb-2">
                  {LETTERS.map((char, i) => {
                    const letterPhaseIdx = PHASE_ORDER.indexOf(
                      LETTER_PHASES[i],
                    );
                    const isLetterActive = currentIdx >= letterPhaseIdx;

                    return (
                      <LetterDrop
                        key={char}
                        char={char}
                        isActive={isLetterActive}
                        onLand={() => {}}
                        prefersReduced={false}
                      />
                    );
                  })}
                </span>

                <br />

                {/* BADR — explosive reveal */}
                <BadrReveal
                  show={currentIdx >= PHASE_ORDER.indexOf('badr')}
                  prefersReduced={false}
                />
              </h1>

              {/* Shockwave ring — appears after AHMED fully lands */}
              {phase === 'shockwave' && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ zIndex: 25 }}
                >
                  <ShockwaveRing />
                </div>
              )}
            </div>

            {/* Typewriter role */}
            {showTypewriter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: phase === 'typewriter' ? 0 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-2 text-xl md:text-2xl font-light text-white/60 h-8"
              >
                <span>{role}</span>
                <span className="cursor" aria-hidden="true" />
              </motion.div>
            )}

            {/* Description */}
            {showDescription && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-white/40 text-base max-w-lg leading-relaxed"
              >
                Engineering the nexus of sentient vision and autonomous
                control. SOTA research meets championship-level execution.
              </motion.p>
            )}

            {/* CTA buttons */}
            {showCTA && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: isComplete ? 0.3 : phase === 'typewriter' ? 0.8 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-wrap gap-4"
              >
                <a href="#projects" className="btn-primary cursor-pointer">
                  View Work <ArrowUpRight size={14} />
                </a>
                <a href="#contact" className="btn-ghost cursor-pointer">
                  Get in Touch
                </a>
              </motion.div>
            )}

            {/* Social proof */}
            {showSocial && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/15 pt-2">
                  <span className="text-white/8">Featured:</span>
                  <span className="text-white/30 hover:text-accent-cyan/70 transition-colors duration-200 cursor-default">
                    UofL
                  </span>
                  <span className="text-white/8">·</span>
                  <span className="text-white/30 hover:text-accent-cyan/70 transition-colors duration-200 cursor-default">
                    JMU
                  </span>
                  <span className="text-white/8">·</span>
                  <span className="text-white/30 hover:text-accent-cyan/70 transition-colors duration-200 cursor-default">
                    Virginia Tech
                  </span>
                  <span className="text-white/8">·</span>
                  <span className="text-white/30 hover:text-accent-cyan/70 transition-colors duration-200 cursor-default">
                    AIU
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* ════ RIGHT: Stats Panel ════════════════════════════ */}
          {showStats && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-row lg:flex-col gap-3"
            >
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────── */}
      {showScrollIndicator && <ScrollIndicator />}
    </section>
  );
};

// ═════════════════════════════════════════════════════════════════════
//  Exports
// ═════════════════════════════════════════════════════════════════════

export { Hero, WaveLight, ScrollProgress, MarqueeTicker };
