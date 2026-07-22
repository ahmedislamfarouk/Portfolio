'use client';

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useRef } from 'react';
import { useTiltEffect } from '@/hooks/useTiltEffect';
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
import SplitText from '@/components/SplitText';

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
  hidden: { opacity: 0, y: 40, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 14,
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

/* ------------------------------------------------------------------ */
/*  Content stagger variants (inside each card)                        */
/* ------------------------------------------------------------------ */

const contentStaggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const contentItemSlideLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_OUT_QUART },
  },
};

const contentItemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_QUART },
  },
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
  const prefersReduced = useReducedMotion();

  /* ── 3D perspective on scroll ─────────────────────────── */
  const { scrollYProgress: cardScrollProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const cardRotateX = useTransform(
    cardScrollProgress,
    [0, 0.25, 0.5, 0.75, 1],
    prefersReduced
      ? [0, 0, 0, 0, 0]
      : [6, 2.5, 0.5, -0.5, -1],
  );

  const {
    ref: glassRef,
    onMouseMove: glassMouseMove,
    onMouseLeave: glassMouseLeave,
    style: glassStyle,
  } = useTiltEffect<HTMLDivElement>({
    scale: 1,
    rotation: 3,
  });

  return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative flex items-start gap-5 md:gap-8 group"
        ref={cardRef}
        style={
          prefersReduced
            ? {}
            : ({
                rotateX: cardRotateX,
                perspective: 1000,
                transformStyle: 'preserve-3d',
              } as React.CSSProperties)
        }
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
          <div className="flex items-center gap-1.5 text-white/55">
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
        <motion.div
          ref={glassRef}
          onMouseMove={glassMouseMove}
          onMouseLeave={glassMouseLeave}
          style={glassStyle}
          className="glass-card group/card relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.25)]"
        >
          {/* Neon left-border accent */}
          <span
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-all duration-300 group-hover/card:top-0.5 group-hover/card:bottom-0.5"
            style={{
              backgroundColor: style.accent,
              boxShadow: `0 0 8px ${style.glow}, 0 0 20px ${style.glow}`,
            }}
            aria-hidden="true"
          />

          {/* Chasing light — bright spot travels down the border on hover */}
          <span
            className="absolute left-[-1px] w-[5px] h-6 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundColor: style.accent,
              boxShadow: `0 0 12px ${style.glow}, 0 0 30px ${style.glow}`,
              animation: 'chase-light 1.5s ease-in-out infinite',
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
          <motion.div
            variants={contentStaggerVariants}
            className="relative z-10"
          >
            {/* Top row: icon */}
            <motion.div
              variants={contentItemSlideLeft}
              className="flex items-start justify-between mb-4"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover/card:scale-110 group-hover/card:-rotate-[4deg]"
                style={{ backgroundColor: style.bg }}
              >
                <IconComponent size={18} style={{ color: style.accent }} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h3
              variants={contentItemSlideLeft}
              className="text-xl md:text-2xl font-black uppercase tracking-ultra text-white mb-1 leading-[0.9]"
            >
              {entry.title}
            </motion.h3>

            {/* Organisation + location */}
            <motion.div
              variants={contentItemFadeUp}
              className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1"
            >
              <span className="text-sm font-semibold text-white/70">
                {entry.organization}
              </span>
              <span className="hidden sm:inline text-white/15" aria-hidden="true">
                ·
              </span>
              <div className="flex items-center gap-1 text-white/60">
                <MapPin size={10} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                  {entry.location}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={contentItemFadeUp}
              className="mb-4 text-base leading-relaxed text-white/65"
            >
              {entry.description}
            </motion.p>

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
                    className="flex items-start gap-3 text-base text-white/60"
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
                    className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/55 transition-all duration-200 hover:scale-105 hover:border-accent-cyan/30 hover:text-accent-cyan/70 hover:shadow-[0_0_12px_rgba(6,182,212,0.15)] cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
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

  /* ── Glow trail ─────────────────────────────────────────── */
  const glowTrailOpacity = useTransform(
    lineScrollProgress,
    [0, 0.05, 0.2, 0.5, 0.9, 1],
    prefersReducedMotion
      ? [0, 0, 0, 0, 0, 0]
      : [0, 0.25, 0.15, 0.2, 0.1, 0],
  );

  /* ── Traveling data nodes ──────────────────────────────── */
  const node1Opacity = useTransform(
    lineScrollProgress,
    [0, 0.06, 0.3, 1],
    [0, 1, 1, 0],
  );
  const node1Y = useTransform(
    lineScrollProgress,
    [0, 0.3],
    ['2%', '33%'],
  );
  const node1Scale = useTransform(
    lineScrollProgress,
    [0, 0.06, 0.3],
    [0, 1, 1],
  );

  const node2Opacity = useTransform(
    lineScrollProgress,
    [0, 0.25, 0.35, 0.65, 1],
    [0, 0, 1, 1, 0],
  );
  const node2Y = useTransform(
    lineScrollProgress,
    [0.25, 0.65],
    ['33%', '66%'],
  );
  const node2Scale = useTransform(
    lineScrollProgress,
    [0, 0.25, 0.35, 0.65],
    [0, 0, 1, 1],
  );

  const node3Opacity = useTransform(
    lineScrollProgress,
    [0, 0.55, 0.7, 1],
    [0, 0, 1, 1],
  );
  const node3Y = useTransform(
    lineScrollProgress,
    [0.55, 1],
    ['66%', '100%'],
  );
  const node3Scale = useTransform(
    lineScrollProgress,
    [0, 0.55, 0.7, 1],
    [0, 0, 1, 1],
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

      {/* Floating decorative dots along the timeline path */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute w-1.5 h-1.5 rounded-full opacity-30 animate-float-dot"
            style={{ left: '7%', top: '12%', backgroundColor: '#06B6D4', animationDelay: '0s', animationDuration: '6s' }}
          />
          <div
            className="absolute w-1 h-1 rounded-full opacity-20 animate-float-dot"
            style={{ left: '4%', top: '28%', backgroundColor: '#2563EB', animationDelay: '1.2s', animationDuration: '7.5s' }}
          />
          <div
            className="absolute w-2 h-2 rounded-full opacity-25 animate-float-dot"
            style={{ left: '9%', top: '42%', backgroundColor: '#7C3AED', animationDelay: '0.6s', animationDuration: '8s' }}
          />
          <div
            className="absolute w-1 h-1 rounded-full opacity-20 animate-float-dot"
            style={{ left: '5%', top: '55%', backgroundColor: '#06B6D4', animationDelay: '2s', animationDuration: '6.5s' }}
          />
          <div
            className="absolute w-1.5 h-1.5 rounded-full opacity-25 animate-float-dot"
            style={{ left: '8%', top: '70%', backgroundColor: '#10B981', animationDelay: '1.5s', animationDuration: '7s' }}
          />
          <div
            className="absolute w-1 h-1 rounded-full opacity-15 animate-float-dot"
            style={{ left: '3%', top: '85%', backgroundColor: '#7C3AED', animationDelay: '0.3s', animationDuration: '9s' }}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="section-container relative z-10"
      >
        {/* ---- Section header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUART }}
          className="mb-16 md:mb-20"
        >
          <SplitText animation="fadeUp" delay={0.02} duration={0.5} hoverEffect={null} as="span" className="section-label">Timeline</SplitText>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-ultra md:text-6xl">
            <SplitText animation="fadeUp" delay={0.03} duration={0.6} hoverEffect="sway" as="span" once>
              Research
            </SplitText>{' '}
            <SplitText animation="fadeUp" delay={0.05} duration={0.7} hoverEffect="sway" as="span" once className="text-gradient">
              Journey
            </SplitText>
          </h2>
          <p className="mt-4 max-w-xl text-sm md:text-base text-white/50 font-medium tracking-wide leading-relaxed">
            From academic foundations to cutting-edge research — a chronology of
            discovery and impact.
          </p>
        </motion.div>

        {/* ---- Timeline entries with animated line ---- */}
        <div className="relative mx-auto max-w-3xl" ref={timelineRef}>
          {/* Glow trail — blurred neon pulse that follows the drawn line */}
          <motion.div
            className="absolute left-[5px] top-0 w-[6px] origin-top z-0 pointer-events-none"
            style={{
              scaleY: lineScaleY,
              opacity: glowTrailOpacity,
              background:
                'linear-gradient(to bottom, #06B6D4, #2563EB, #7C3AED, #10B981)',
              filter: 'blur(8px)',
            }}
            aria-hidden="true"
          />

          {/* Animated timeline line — draws on scroll */}
          <motion.div
            className="absolute left-[7px] top-0 w-[2px] origin-top z-[1]"
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

          {/* Traveling data nodes — tiny glowing dots that ride the line */}
          {!prefersReducedMotion && (
            <>
              {/* Node 1 — cyan (early entries) */}
              <motion.span
                className="absolute left-[3px] w-[10px] h-[10px] rounded-full z-[2] pointer-events-none"
                style={{
                  backgroundColor: '#06B6D4',
                  boxShadow:
                    '0 0 16px rgba(6,182,212,0.7), 0 0 40px rgba(6,182,212,0.3)',
                  top: node1Y,
                  opacity: node1Opacity,
                  scale: node1Scale,
                }}
                aria-hidden="true"
              />
              {/* Node 2 — violet (middle entries) */}
              <motion.span
                className="absolute left-[3px] w-[10px] h-[10px] rounded-full z-[2] pointer-events-none"
                style={{
                  backgroundColor: '#7C3AED',
                  boxShadow:
                    '0 0 16px rgba(124,58,237,0.7), 0 0 40px rgba(124,58,237,0.3)',
                  top: node2Y,
                  opacity: node2Opacity,
                  scale: node2Scale,
                }}
                aria-hidden="true"
              />
              {/* Node 3 — green (later entries) */}
              <motion.span
                className="absolute left-[3px] w-[10px] h-[10px] rounded-full z-[2] pointer-events-none"
                style={{
                  backgroundColor: '#10B981',
                  boxShadow:
                    '0 0 16px rgba(16,185,129,0.7), 0 0 40px rgba(16,185,129,0.3)',
                  top: node3Y,
                  opacity: node3Opacity,
                  scale: node3Scale,
                }}
                aria-hidden="true"
              />
            </>
          )}

          {timeline.map((entry, index) => (
            <TimelineEntryCard
              key={`${entry.title}-${entry.date}-${index}`}
              entry={entry}
              index={index}
              isLast={index === timeline.length - 1}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ResearchTimeline;
