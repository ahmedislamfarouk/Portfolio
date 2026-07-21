'use client';

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
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
import { useState, useEffect, useRef } from 'react';

// ────────────────────────────────────────────────────────────────
// Typewriter hook
// ────────────────────────────────────────────────────────────────
const useTypewriter = (words: string[], speed = 100, pause = 2000) => {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
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
  }, [displayed, deleting, wordIdx, words, speed, pause]);

  return { displayed, wordIdx };
};

// ────────────────────────────────────────────────────────────────
// Animated Counter hook — counts up when element enters viewport
// ────────────────────────────────────────────────────────────────
const useCountUp = (end: number, duration = 2200) => {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [count, setCount] = useState(prefersReduced ? end : 0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReduced) return;
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, end, duration, prefersReduced]);

  return { count, ref };
};

// ────────────────────────────────────────────────────────────────
// GLOWING PARTICLE STARFIELD (replaces WaveLight)
// ────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  isBright: boolean;
  hue: number; // 0 = cyan, 1 = blue-violet
}

const PARTICLE_COUNT = 140;
const CONNECTION_DIST = 140;
const DRIFT_SPEED = 0.25;

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

    /* ── Init particles ─────────────────────────────────── */
    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const particleCount = prefersReduced ? 40 : PARTICLE_COUNT;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * DRIFT_SPEED,
      vy: (Math.random() - 0.5) * DRIFT_SPEED,
      size:
        Math.random() < 0.08
          ? Math.random() * 1.8 + 1.6 // bright stars are bigger
          : Math.random() * 1.2 + 0.3,
      alpha:
        Math.random() < 0.08
          ? Math.random() * 0.4 + 0.6
          : Math.random() * 0.25 + 0.08,
      isBright: Math.random() < 0.08,
      hue: Math.random(), // 0 = cyan → 1 = blue-violet
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
    const draw = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      ctx.clearRect(0, 0, cw, ch);

      const mouse = mouseRef.current;
      const nearMouse = mouse.x > 0 && mouse.y > 0;

      /* ── Update & draw particles ──────────────────────── */
      for (const p of particles) {
        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Subtle tug toward mouse
        if (nearMouse) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250 && dist > 1) {
            const force = (1 - dist / 250) * 0.003;
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        // Velocity damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap around edges
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;
        if (p.y < -10) p.y = ch + 10;
        if (p.y > ch + 10) p.y = -10;

        // Draw particle
        const color = p.isBright
          ? `rgba(255, 255, 255, ${p.alpha})`
          : `rgba(6, 182, 212, ${p.alpha * (1 - p.hue * 0.4)})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.isBright) {
          ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';
          ctx.shadowBlur = 10;
        }

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
            const alpha = (1 - d / CONNECTION_DIST) * 0.12;
            const brightness = a.isBright || b.isBright ? alpha * 1.5 : alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${brightness})`;
            ctx.lineWidth = a.isBright || b.isBright ? 0.7 : 0.4;
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

// ────────────────────────────────────────────────────────────────
// Scroll Progress bar
// ────────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────
// Marquee Ticker — enhanced with gradient edge fades
// ────────────────────────────────────────────────────────────────
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
      {/* Gradient edge fades */}
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

// ────────────────────────────────────────────────────────────────
// Stat Card — bento style with animated counter
// ────────────────────────────────────────────────────────────────
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
      {/* Neon left border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-cyan via-accent-cyan/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Subtle glow on hover */}
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

// ────────────────────────────────────────────────────────────────
// Scroll Indicator — enhanced with rotating ring
// ────────────────────────────────────────────────────────────────
const ScrollIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.5 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
  >
    {/* Animated ring */}
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

// ────────────────────────────────────────────────────────────────
// Floating Decorative Ring
// ────────────────────────────────────────────────────────────────
const FloatingRing = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="absolute top-[18%] right-[6%] pointer-events-none hidden lg:block"
    aria-hidden="true"
  >
    <div className="relative w-44 h-44">
      {/* Outer ring */}
      <div className="absolute inset-0 border border-accent-cyan/[0.07] rounded-full animate-spin-slow" />
      {/* Middle ring — counter-rotating */}
      <div
        className="absolute inset-[18%] border border-accent-cyan/[0.04] rounded-full animate-spin-slow"
        style={{ animationDirection: 'reverse', animationDuration: '14s' }}
      />
      {/* Inner ring */}
      <div
        className="absolute inset-[36%] border border-white/[0.03] rounded-full animate-spin-slow"
        style={{ animationDirection: 'reverse', animationDuration: '22s' }}
      />
      {/* Center sparkle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Sparkles size={18} className="text-accent-cyan/[0.12]" />
      </div>
    </div>
  </motion.div>
);

// ────────────────────────────────────────────────────────────────
// HERO SECTION
// ────────────────────────────────────────────────────────────────
const Hero = () => {
  const roles = [
    'AI Researcher',
    'Robotics Engineer',
    'Vision Systems',
    'Champion Athlete',
  ];
  const { displayed: role } = useTypewriter(roles, 80, 2200);

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const ringY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  const stats = [
    { icon: Trophy, value: 43, suffix: '+', label: 'Global Honors', delay: 0.4 },
    { icon: Bot, value: 9, suffix: '', label: 'AI Projects', delay: 0.5 },
    { icon: Clock, value: 2, suffix: '+', label: 'Yrs Research', delay: 0.6 },
  ] as const;

  return (
    <section
      id="about"
      ref={ref}
      className="relative flex items-center overflow-hidden min-h-dvh pt-28"
    >
      {/* ── Background layers ──────────────────────────────── */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950/40" />

      {/* Parallax orbs */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-[100px]" />
      </motion.div>

      {/* Floating decorative ring with parallax */}
      <motion.div style={{ y: ringY }}>
        <FloatingRing />
      </motion.div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-end min-h-[75vh] py-16 lg:py-24">
          {/* ════ LEFT: Main Text ════════════════════════════ */}
          <div className="space-y-7 lg:space-y-8">
            {/* Section label + tag */}
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

            {/* Massive heading with neon glow + glitch hover */}
            <div className="relative">
              {/* Neon glow behind name */}
              <div className="absolute -left-12 -top-12 -right-12 -bottom-12 bg-accent-cyan/[0.04] blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute -left-8 -top-8 -right-8 -bottom-8 bg-accent-cyan/[0.02] blur-[60px] rounded-full pointer-events-none" />

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-[clamp(3.5rem,14vw,13rem)] tracking-ultra leading-ultra glitch-text relative select-none"
              >
                Ahmed
                <br />
                <span className="text-gradient">Badr</span>
              </motion.h1>
            </div>

            {/* Typewriter role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2 text-xl md:text-2xl font-light text-white/60 h-8"
            >
              <span>{role}</span>
              <span className="cursor" aria-hidden="true" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/40 text-base max-w-lg leading-relaxed"
            >
              Engineering the nexus of sentient vision and autonomous control.
              SOTA research meets championship-level execution.
            </motion.p>

            {/* CTA buttons */}
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

            {/* Social Proof / Trust Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
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
          </div>

          {/* ════ RIGHT: Stats Panel ═════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-row lg:flex-col gap-3"
          >
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={stat.delay}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────── */}
      <ScrollIndicator />
    </section>
  );
};

// ────────────────────────────────────────────────────────────────
// Exports
// ────────────────────────────────────────────────────────────────
export { Hero, WaveLight, ScrollProgress, MarqueeTicker };
