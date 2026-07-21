'use client';

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useRef } from 'react';
import type { Easing } from 'framer-motion';
import {
  Brain,
  FlaskConical,
  Code2,
  Trophy,
  GraduationCap,
  MapPin,
  Calendar,
} from 'lucide-react';
import { timeline } from '@/data/timeline';
import type { TimelineEntry } from '@/data/timeline';

/* ------------------------------------------------------------------ */
/*  Shared easing                                                      */
/* ------------------------------------------------------------------ */

const EASE_OUT_QUART: Easing = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TimelineEntryType = TimelineEntry['type'];
type TimelineIcon = NonNullable<TimelineEntry['icon']>;

/* ------------------------------------------------------------------ */
/*  Colour configuration per entry type                                */
/* ------------------------------------------------------------------ */

interface TypeStyle {
  accent: string;
  glow: string;
  bg: string;
  border: string;
  label: string;
}

const TYPE_STYLES: Record<TimelineEntryType, TypeStyle> = {
  research: {
    accent: '#06B6D4',
    glow: 'rgba(6,182,212,0.35)',
    bg: 'rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.25)',
    label: 'Research',
  },
  education: {
    accent: '#2563EB',
    glow: 'rgba(37,99,235,0.35)',
    bg: 'rgba(37,99,235,0.1)',
    border: 'rgba(37,99,235,0.25)',
    label: 'Education',
  },
  work: {
    accent: '#7C3AED',
    glow: 'rgba(124,58,237,0.35)',
    bg: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.25)',
    label: 'Work',
  },
  achievement: {
    accent: '#10B981',
    glow: 'rgba(16,185,129,0.35)',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
    label: 'Achievement',
  },
};

/* ------------------------------------------------------------------ */
/*  Icon mapping                                                       */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<
  TimelineIcon,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  brain: Brain,
  microscope: FlaskConical,
  code: Code2,
  trophy: Trophy,
  graduation: GraduationCap,
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.05,
    },
  },
};

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 250,
      damping: 14,
      duration: 0.5,
    },
  },
};

const dotGlowVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 2.5,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: EASE_OUT_QUART,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: EASE_OUT_QUART,
    },
  },
};

const highlightItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + i * 0.08,
      duration: 0.4,
      ease: EASE_OUT_QUART,
    },
  }),
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.4 + i * 0.04,
      duration: 0.3,
      ease: EASE_OUT_QUART,
    },
  }),
};

/* ================================================================== */
/*  TimelineEntryCard                                                  */
/* ================================================================== */

interface TimelineEntryCardProps {
  entry: TimelineEntry;
  index: number;
  isLast: boolean;
}

const TimelineEntryCard = ({ entry, index, isLast }: TimelineEntryCardProps) => {
  const style = TYPE_STYLES[entry.type];
  const IconComponent = entry.icon ? ICON_MAP[entry.icon] : Code2;
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative flex items-start gap-5 md:gap-8 group"
      ref={cardRef}
    >
      {/* ================================================================ */}
      {/* Timeline column – line + dot                                     */}
      {/* ================================================================ */}
      <div className="relative flex flex-col items-center pt-1.5">
        {/* Dot */}
        <motion.div variants={dotVariants} className="relative z-10">
          {/* Glow ring */}
          <motion.span
            variants={dotGlowVariants}
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: style.accent,
              filter: 'blur(6px)',
              opacity: 0.3,
            }}
            aria-hidden="true"
          />
          {/* Animated pulse ring — breathes continuously once in view */}
          <motion.span
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.15,
            }}
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: style.accent,
              filter: 'blur(4px)',
            }}
            aria-hidden="true"
          />
          {/* Core dot */}
          <span
            className="relative block h-4 w-4 rounded-full border-2"
            style={{
              backgroundColor: style.bg,
              borderColor: style.accent,
              boxShadow: `0 0 14px ${style.glow}, 0 0 40px ${style.glow}`,
            }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Vertical connector line (hidden for last entry) */}
        {!isLast && (
          <div
            className="w-px flex-1 min-h-[24px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ================================================================ */}
      {/* Content column                                                  */}
      {/* ================================================================ */}
      <motion.div
        variants={cardVariants}
        className="flex-1 min-w-0 pb-10 md:pb-14"
        data-cursor="magnetic"
      >
        {/* Date + type badge row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-white/35">
            <Calendar size={11} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              {entry.date}
            </span>
          </div>

          <span
            className="text-[8px] font-bold uppercase tracking-[0.25em] px-2.5 py-0.5 rounded-full border transition-shadow duration-300"
            style={{
              color: style.accent,
              borderColor: style.border,
              backgroundColor: style.bg,
              boxShadow: `0 0 6px ${style.glow}`,
            }}
          >
            {style.label}
          </span>
        </div>

        {/* Glass card with neon left-border accent */}
        <div className="glass-card group/card relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
          {/* Neon left-border accent */}
          <span
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-all duration-300 group-hover/card:top-0.5 group-hover/card:bottom-0.5"
            style={{
              backgroundColor: style.accent,
              boxShadow: `0 0 8px ${style.glow}, 0 0 20px ${style.glow}`,
            }}
            aria-hidden="true"
          />

          {/* Hover glow overlay — radial gradient spot */}
          <div
            className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${style.glow} 0%, transparent 65%)`,
            }}
          />

          {/* Content (relative to sit above overlays) */}
          <div className="relative z-10">
            {/* Top row: icon */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover/card:scale-110 group-hover/card:-rotate-[4deg]"
                style={{ backgroundColor: style.bg }}
              >
                <IconComponent size={18} style={{ color: style.accent }} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-ultra text-white mb-1 leading-[0.9]">
              {entry.title}
            </h3>

            {/* Organisation + location */}
            <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-semibold text-white/70">
                {entry.organization}
              </span>
              <span className="hidden sm:inline text-white/15" aria-hidden="true">
                ·
              </span>
              <div className="flex items-center gap-1 text-white/40">
                <MapPin size={10} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                  {entry.location}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-white/50">
              {entry.description}
            </p>

            {/* Highlights — animated staggered list */}
            {entry.highlights.length > 0 && (
              <ul className="mb-4 space-y-2">
                {entry.highlights.map((highlight, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={highlightItemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex items-start gap-3 text-sm text-white/40"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: style.accent,
                        boxShadow: `0 0 4px ${style.glow}`,
                      }}
                    />
                    {highlight}
                  </motion.li>
                ))}
              </ul>
            )}

            {/* Tags — glow on hover */}
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    custom={i}
                    variants={tagVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/35 transition-all duration-200 hover:scale-105 hover:border-accent-cyan/30 hover:text-accent-cyan/70 hover:shadow-[0_0_12px_rgba(6,182,212,0.15)] cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ================================================================== */
/*  ResearchTimeline (section-level)                                   */
/* ================================================================== */

const ResearchTimeline = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  /* ── Parallax scroll for background orbs ───────────────────── */
  const { scrollYProgress: bgScrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(bgScrollProgress, [0, 1], ['-12%', '12%']);

  /* ── Animated timeline line ────────────────────────────────── */
  const { scrollYProgress: lineScrollProgress } = useScroll({
    target: timelineRef,
    offset: ['start end', 'end start'],
  });

  const lineScaleY = useTransform(
    lineScrollProgress,
    [0, 0.85],
    prefersReducedMotion ? [1, 1] : [0, 1],
  );
  const lineOpacity = useTransform(
    lineScrollProgress,
    [0, 0.08, 0.9, 1],
    [0, 1, 1, 0],
  );

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* ── Parallax Background Orbs ────────────────────────────── */}
      <motion.div
        style={{ y: prefersReducedMotion ? 0 : bgY }}
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-[10%] -left-40 w-[30rem] h-[30rem] rounded-full opacity-[0.10]"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-[15%] -right-40 w-[28rem] h-[28rem] rounded-full opacity-[0.08]"
          style={{
            background:
              'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute top-[50%] left-1/3 w-60 h-60 rounded-full opacity-[0.06]"
          style={{
            background:
              'radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </motion.div>

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-20" aria-hidden />

      <div className="section-container relative z-10">
        {/* ---- Section header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUART }}
          className="mb-16 md:mb-20"
        >
          <span className="section-label">Timeline</span>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-ultra md:text-6xl">
            Research <span className="text-gradient">Journey</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm md:text-base text-white/30 font-medium tracking-wide leading-relaxed">
            From academic foundations to cutting-edge research — a chronology of
            discovery and impact.
          </p>
        </motion.div>

        {/* ---- Timeline entries with animated line ---- */}
        <div className="relative mx-auto max-w-3xl" ref={timelineRef}>
          {/* Animated timeline line — draws on scroll */}
          <motion.div
            className="absolute left-[7px] top-0 w-[2px] origin-top z-0"
            style={{
              scaleY: lineScaleY,
              opacity: lineOpacity,
              background:
                'linear-gradient(to bottom, #06B6D4, #2563EB, #7C3AED, #10B981)',
              boxShadow:
                '0 0 12px rgba(6,182,212,0.25), 0 0 30px rgba(37,99,235,0.10)',
            }}
            aria-hidden="true"
          />

          {timeline.map((entry, index) => (
            <TimelineEntryCard
              key={`${entry.title}-${entry.date}-${index}`}
              entry={entry}
              index={index}
              isLast={index === timeline.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchTimeline;
