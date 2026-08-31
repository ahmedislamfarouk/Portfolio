'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { Trophy, Bot, Clock, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => null,
});

// ═════════════════════════════════════════════════════════════════════
//  Reduced motion helpers
// ═════════════════════════════════════════════════════════════════════

function subscribeToReducedMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function getReducedMotionServer() {
  return false;
}

// ═════════════════════════════════════════════════════════════════════
//  useTypewriter
// ═════════════════════════════════════════════════════════════════════

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

  return displayed;
};

// ═════════════════════════════════════════════════════════════════════
//  useCountUp
// ═════════════════════════════════════════════════════════════════════

const useCountUp = (end: number, duration = 2200) => {
  const prefersReduced = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
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
//  CSS Particle Starfield — GPU-only, no JS frame loop
// ═════════════════════════════════════════════════════════════════════

const CSSStarfield = () => {
  const [stars] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.05,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
    })),
  );

  return (
    <div className="fixed inset-0 pointer-events-none select-none" style={{ zIndex: 1 }} aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `pulse-glow ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════
//  StatCard
// ═════════════════════════════════════════════════════════════════════

interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  suffix: string;
  label: string;
}

const StatCard = ({ icon: Icon, value, suffix, label }: StatCardProps) => {
  const { count, ref } = useCountUp(value);

  return (
    <div
      ref={ref}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm cursor-default"
    >
      <div className="p-2 rounded-lg bg-accent-cyan/5 border border-accent-cyan/10">
        <Icon size={14} className="text-accent-cyan" />
      </div>
      <div>
        <div className="text-xl font-black tracking-ultra text-white tabular-nums">
          {count}
          <span className="text-accent-cyan/60">{suffix}</span>
        </div>
        <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/40 whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
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
            <span className="text-accent-cyan/40 text-xs">&middot;</span>
          </span>
        ))}
      </motion.div>
    </div>
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
//  HERO — editorial, minimal, instant
// ═════════════════════════════════════════════════════════════════════

const HERO_ROLES = [
  'AI Researcher',
  'Robotics Engineer',
  'Vision Systems',
  'Champion Athlete',
];

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { x: mouseX, y: mouseY } = useMouseParallax(0.025);
  const mouseXOpposite = useTransform(mouseX, (v) => -v);
  const mouseYOpposite = useTransform(mouseY, (v) => -v);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const role = useTypewriter(HERO_ROLES, 80, 2200);

  const stats = [
    { icon: Trophy, value: 43, suffix: '+', label: 'Global Honors' },
    { icon: Bot, value: 9, suffix: '', label: 'AI Projects' },
    { icon: Clock, value: 2, suffix: '+', label: 'Yrs Research' },
  ] as const;

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex items-center overflow-hidden min-h-dvh"
    >
      {/* 3D Background */}
      <HeroScene />

      {/* CSS starfield fallback */}
      <CSSStarfield />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950/60" />

      {/* Parallax orbs */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ x: mouseX, y: mouseY }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]"
        />
        <motion.div
          style={{ x: mouseXOpposite, y: mouseYOpposite }}
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-[100px]"
        />
      </motion.div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10 pt-32 pb-16">
        <div className="space-y-8 max-w-3xl">
          {/* Location label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <span className="section-label">Cairo, Egypt &middot; Available Globally</span>
            <span className="tag bg-accent-cyan/5 border-accent-cyan/25 text-accent-cyan">
              <span className="status-dot inline mr-2" aria-hidden="true" />
              Building: SkyVision Swarm
            </span>
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[clamp(3.5rem,12vw,11rem)] tracking-ultra leading-ultra glitch-text select-none">
              Ahmed
              <br />
              <span className="text-gradient">Badr</span>
            </h1>
          </motion.div>

          {/* Typewriter role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2 text-2xl md:text-3xl font-light text-white/75 h-8"
          >
            <span>{role}</span>
            <span className="cursor" aria-hidden="true" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/60 text-lg max-w-lg leading-relaxed"
          >
            Engineering the nexus of sentient vision and autonomous control.
            SOTA research meets championship-level execution.
          </motion.p>

          {/* CTA */}
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

          {/* Featured institutions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/15 pt-2">
              <span className="text-white/8">Featured:</span>
              {['UofL', 'JMU', 'Virginia Tech', 'AIU'].map((inst, i) => (
                <span key={inst}>
                  <span className="text-white/50 hover:text-accent-cyan/70 transition-colors duration-200 cursor-default">
                    {inst}
                  </span>
                  {i < 3 && <span className="text-white/8 ml-2.5">&middot;</span>}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 pt-4"
          >
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <ChevronDown
          size={16}
          className="text-white/30 animate-bounce"
          style={{ animationDuration: '1.5s' }}
        />
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/[0.15]">
          Scroll
        </span>
      </motion.div>
    </section>
  );
};

// ═════════════════════════════════════════════════════════════════════
//  Exports
// ═════════════════════════════════════════════════════════════════════

export { Hero, ScrollProgress, MarqueeTicker };
