'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useSyncExternalStore } from 'react';
import { useTiltEffect } from '@/hooks/useTiltEffect';
import { staggerContainer, scaleIn } from '@/components/animations';
import {
  Eye,
  Layers,
  Brain,
  Cpu,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Users,
} from 'lucide-react';
import SplitText from '@/components/SplitText';

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

// ─── Types ──────────────────────────────────────────────────────────────

interface ResearchArea {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
}

interface StatItem {
  target: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// ─── Data ───────────────────────────────────────────────────────────────

const researchAreas: ResearchArea[] = [
  {
    title: 'Computer Vision',
    description:
      'SOTA detection & segmentation for real-world dynamic environments.',
    icon: Eye,
    accent: '#06B6D4',
  },
  {
    title: 'Sensor Fusion',
    description:
      'LiDAR, radar & camera integration for autonomous navigation.',
    icon: Layers,
    accent: '#2563EB',
  },
  {
    title: 'Deep NLP',
    description:
      'LLM fine-tuning and RAG pipelines for specialized knowledge.',
    icon: Brain,
    accent: '#7C3AED',
  },
  {
    title: 'Robotics Control',
    description:
      'ROS 2 low-level control, path planning, and fleet management.',
    icon: Cpu,
    accent: '#06B6D4',
  },
];

const researchStats: StatItem[] = [
  { target: 15, suffix: '+', label: 'Publications', icon: BookOpen },
  { target: 8, suffix: '', label: 'Research Labs', icon: FlaskConical },
  { target: 4, suffix: '', label: 'Universities', icon: GraduationCap },
  { target: 20, suffix: '+', label: 'Collaborators', icon: Users },
];

// ─── Animated Counter Hook ──────────────────────────────────────────────

const useAnimatedCounter = (target: number, duration = 2200) => {
  const prefersReduced = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
  const [count, setCount] = useState(prefersReduced ? target : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (prefersReduced) return;
    if (!inView) return;

    let startTime: number | null = null;
    let raf: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, prefersReduced]);

  return { count, ref };
};

// ─── Animated Border Gradient Component ─────────────────────────────────

const AnimatedBorder = () => (
  <div
    className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
    aria-hidden
  >
    <div
      className="absolute inset-0 rounded-[2rem]"
      style={{
        padding: '1px',
        background:
          'linear-gradient(135deg, #06B6D4, #7C3AED, #2563EB, #06B6D4)',
        backgroundSize: '300% 100%',
        animation: 'shimmer 3s linear infinite',
        WebkitMask:
          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    />
  </div>
);

// ─── Research Area Card ─────────────────────────────────────────────────

const ResearchAreaCard = ({ area, index }: { area: ResearchArea; index: number }) => {
  const Icon = area.icon;
  const { ref, onMouseMove, onMouseLeave, style } = useTiltEffect<HTMLDivElement>({
    scale: 1,
    rotation: 5,
  });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      variants={scaleIn}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bento-card group relative"
    >
      {/* Animated gradient border on hover */}
      <AnimatedBorder />

      {/* Inner glow overlay on hover */}
      <div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[1]"
        aria-hidden
        style={{
          background: `linear-gradient(135deg, ${area.accent}08, transparent 60%, ${area.accent}04)`,
          boxShadow: `inset 0 0 40px -12px ${area.accent}18`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 flex items-start gap-6">
        {/* Icon with larger container */}
        <div
          className="w-16 h-16 min-w-[4rem] rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-[3deg]"
          style={{
            background: `linear-gradient(135deg, ${area.accent}18, ${area.accent}06)`,
            border: `1px solid ${area.accent}25`,
            color: area.accent,
          }}
        >
          <Icon
            size={30}
            className="drop-shadow-lg transition-all duration-300"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black uppercase tracking-ultra text-white mb-3 group-hover:text-gradient transition-all duration-300">
            {area.title}
          </h3>
          <p className="text-white/65 text-lg leading-relaxed group-hover:text-white/75 transition-colors duration-300">
            {area.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Stat Card ──────────────────────────────────────────────────────────

const ResearchStatCard = ({
  stat,
  index,
}: {
  stat: StatItem;
  index: number;
}) => {
  const { count, ref } = useAnimatedCounter(stat.target);
  const Icon = stat.icon;
  const { ref: tiltRef, onMouseMove, onMouseLeave, style } = useTiltEffect<HTMLDivElement>({
    scale: 1,
    rotation: 5,
  });

  return (
    <motion.div
      ref={tiltRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      variants={scaleIn}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bento-card p-6 md:p-8 text-center group relative"
    >
      <AnimatedBorder />
      <div className="relative z-10">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent-cyan/15 transition-all duration-300">
          <Icon size={22} className="text-accent-cyan" />
        </div>

        <span
          ref={ref}
          className="text-4xl md:text-5xl font-black tracking-ultra leading-none text-gradient"
        >
          {count}
          {stat.suffix}
        </span>

        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mt-2">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Section ───────────────────────────────────────────────────────

const Labs = () => {
  return (
    <motion.section
      id="labs"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="section-padding relative overflow-hidden bg-base-950"
    >
      {/* ── Background Decorative Elements ──────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-[0.12]" />

        {/* Floating decorative dots */}
        <div className="absolute w-1.5 h-1.5 rounded-full bg-neon-cyan/5 top-[15%] left-[12%] animate-float-dot" style={{ animationDelay: '0s', animationDuration: '7s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-neon-violet/4 top-[30%] right-[18%] animate-float-dot" style={{ animationDelay: '1.2s', animationDuration: '9s' }} />
        <div className="absolute w-1 h-1 rounded-full bg-neon-blue/5 bottom-[25%] left-[25%] animate-float-dot" style={{ animationDelay: '2.5s', animationDuration: '8s' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-neon-cyan/4 bottom-[35%] right-[30%] animate-float-dot" style={{ animationDelay: '0.8s', animationDuration: '10s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/3 top-[60%] left-[8%] animate-float-dot" style={{ animationDelay: '3.2s', animationDuration: '6.5s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-neon-violet/3 top-[10%] right-[35%] animate-float-dot" style={{ animationDelay: '1.8s', animationDuration: '8.5s' }} />

        {/* Gradient orbs with hue-shift animation */}
        <div
          className="absolute top-[10%] -right-32 w-[30rem] h-[30rem] rounded-full opacity-[0.10]"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'hue-shift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[15%] -left-32 w-[24rem] h-[24rem] rounded-full opacity-[0.08]"
          style={{
            background:
              'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'hue-shift 15s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute top-[40%] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-[0.06]"
          style={{
            background:
              'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'hue-shift 10s ease-in-out infinite',
          }}
        />

        {/* Tech grid lines (subtle decorative) */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(#06B6D4 1px, transparent 1px), linear-gradient(90deg, #06B6D4 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(#7C3AED 1px, transparent 1px), linear-gradient(90deg, #7C3AED 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <SplitText animation="fadeUp" delay={0.02} duration={0.5} hoverEffect={null} as="span" className="section-label">Research Areas</SplitText>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
            <SplitText animation="fadeUp" delay={0.03} duration={0.6} hoverEffect="sway" as="span" once>
              Research
            </SplitText>{' '}
            <SplitText animation="fadeUp" delay={0.05} duration={0.7} hoverEffect="sway" as="span" once className="text-gradient">
              Labs
            </SplitText>
          </h2>
        </motion.div>

        {/* ── Bento Grid: Research Areas ─────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid md:grid-cols-2 gap-6"
        >
          {researchAreas.map((area, index) => (
            <ResearchAreaCard key={area.title} area={area} index={index} />
          ))}
        </motion.div>

        {/* ── Research Stats Grid ────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {researchStats.map((stat, index) => (
            <ResearchStatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Labs;
