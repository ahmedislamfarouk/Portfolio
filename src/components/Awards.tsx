'use client';

import { motion, useInView } from 'framer-motion';
import { Trophy, Medal, Award, Star, Sparkles } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// ── Animated Counter — counts up when element enters viewport ──
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

// ── Data ──────────────────────────────────────────────────────

const awards = [
  {
    title: '3rd Place @ R!L Competition',
    organization: 'Research!Louisville',
    year: '2024',
    level: 'International',
    icon: 'trophy',
  },
  {
    title: 'Best AI Innovation',
    organization: 'Virginia Tech Capstone',
    year: '2024',
    level: 'University',
    icon: 'award',
  },
  {
    title: 'Hackathon 3rd Place',
    organization: 'Egyptian Museum Challenge',
    year: '2024',
    level: 'National',
    icon: 'medal',
  },
  {
    title: 'Taekwondo National Champion',
    organization: 'Egyptian Taekwondo Federation',
    year: '2023',
    level: 'National',
    icon: 'star',
  },
  {
    title: 'Outstanding Research Award',
    organization: 'James Madison University',
    year: '2024',
    level: 'University',
    icon: 'trophy',
  },
  {
    title: 'AI Excellence Recognition',
    organization: 'University of Louisville',
    year: '2024',
    level: 'Research Lab',
    icon: 'medal',
  },
] as const;

const iconMap = {
  trophy: Trophy,
  medal: Medal,
  award: Award,
  star: Star,
} as const;

type AwardLevel = (typeof awards)[number]['level'];

const levelStyles: Record<
  AwardLevel,
  { bg: string; border: string; text: string; glow: string }
> = {
  International: {
    bg: 'bg-neon-cyan/10',
    border: 'border-neon-cyan/25',
    text: 'text-neon-cyan',
    glow: 'rgba(6, 182, 212, 0.2)',
  },
  National: {
    bg: 'bg-neon-violet/10',
    border: 'border-neon-violet/25',
    text: 'text-neon-violet',
    glow: 'rgba(124, 58, 237, 0.2)',
  },
  University: {
    bg: 'bg-accent-blue/10',
    border: 'border-accent-blue/25',
    text: 'text-accent-blue',
    glow: 'rgba(37, 99, 235, 0.2)',
  },
  'Research Lab': {
    bg: 'bg-neon-green/10',
    border: 'border-neon-green/25',
    text: 'text-neon-green',
    glow: 'rgba(16, 185, 129, 0.2)',
  },
};

const iconGradients: Record<string, string> = {
  trophy: 'from-yellow-500/20 to-amber-600/10',
  medal: 'from-neon-cyan/20 to-neon-blue/10',
  award: 'from-neon-violet/20 to-accent-blue/10',
  star: 'from-amber-400/20 to-yellow-500/10',
};

const iconColors: Record<string, string> = {
  trophy: 'text-yellow-400',
  medal: 'text-neon-cyan',
  award: 'text-neon-violet',
  star: 'text-amber-300',
};

const statsData = [
  { value: 43, suffix: '+', label: 'Global Honors' },
  { value: 15, suffix: '+', label: 'Competitions' },
  { value: 8, suffix: '', label: 'Research Awards' },
];

// ── Sub-components ────────────────────────────────────────────

/** Animated border overlay that appears on card hover */
const AnimatedCardBorder = () => (
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

/** Single stat card with animated count-up */
const StatCard = ({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) => {
  const { count, ref } = useCountUp(value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bento-card group relative overflow-hidden cursor-default"
    >
      <AnimatedCardBorder />

      {/* Subtle inner glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit] z-[1]">
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(6,182,212,0.12) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 p-8 md:p-10">
        <div
          className="text-5xl md:text-7xl font-black tracking-ultra tabular-nums leading-none text-gradient"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.25))',
          }}
        >
          {count}
          {suffix && (
            <span className="bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent">
              {suffix}
            </span>
          )}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-1">
          {label}
        </div>
      </div>

      {/* Magnetic follow glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]"
        style={{
          boxShadow: 'inset 0 0 30px rgba(6,182,212,0.08)',
        }}
      />
    </motion.div>
  );
};

/** Single award card in the bento grid */
const AwardCard = ({
  award,
  index,
}: {
  award: (typeof awards)[number];
  index: number;
}) => {
  const IconComponent = iconMap[award.icon as keyof typeof iconMap] || Trophy;
  const levelStyle = levelStyles[award.level];
  const gradient = iconGradients[award.icon] || iconGradients.trophy;
  const iconColor = iconColors[award.icon] || iconColors.trophy;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group cursor-pointer"
    >
      <div className="bento-card relative overflow-hidden h-full p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_rgba(6,182,212,0.15)]">
        <AnimatedCardBorder />

        {/* Glow overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit] z-[1]"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${levelStyle.glow} 0%, transparent 65%)`,
          }}
        />

        {/* Shine sweep on hover */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden
        >
          <div
            className="absolute top-0 -left-[60%] w-[60%] h-full skew-x-[20deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
            style={{
              animation: 'shimmer 2s linear infinite',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          {/* Icon + Year row */}
          <div className="flex items-start justify-between">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} border border-white/[0.06] flex items-center justify-center group-hover:scale-110 group-hover:-rotate-[3deg] transition-all duration-300 ${iconColor}`}
            >
              <IconComponent size={22} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1">
              {award.year}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-black uppercase tracking-ultra text-white leading-tight">
            {award.title}
          </h3>

          {/* Organization */}
          <div className="text-sm text-white/40 leading-relaxed">
            {award.organization}
          </div>

          {/* Level tag */}
          <div className="mt-auto pt-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${levelStyle.bg} ${levelStyle.border} ${levelStyle.text}`}
            >
              {award.level}
            </span>
          </div>
        </div>

        {/* Bottom neon accent line on hover */}
        <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] rounded-full bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-0 group-hover:scale-x-100 origin-center" />
      </div>
    </motion.article>
  );
};

// ── Main Section ──────────────────────────────────────────────

const Awards = () => {
  return (
    <section id="awards" className="section-padding relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-neon-cyan/5 blur-[140px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-violet/5 blur-[100px] pointer-events-none"
        aria-hidden
      />

      <div className="section-container relative z-10">
        {/* ── Header ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <span className="section-label">Recognition</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
            Awards & <span className="text-gradient">Honors</span>
          </h2>
        </motion.div>

        {/* ── Stats Row ───────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {statsData.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={0.2 + i * 0.12}
            />
          ))}
        </div>

        {/* ── Awards Bento Grid ───────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {awards.map((award, index) => (
            <AwardCard key={`${award.title}-${award.year}`} award={award} index={index} />
          ))}
        </div>

        {/* ── Bottom decorative spacer ────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="flex items-center gap-3 text-white/10">
            <span className="w-12 h-px bg-white/10" />
            <Sparkles size={12} />
            <span className="w-12 h-px bg-white/10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Awards;
