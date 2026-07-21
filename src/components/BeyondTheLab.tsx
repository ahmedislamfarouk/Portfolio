'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Trophy,
  Medal,
  Award,
  Swords,
  Sparkles,
  Crosshair,
  Star,
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { achievementStats } from '@/data/stats';
import SplitText from '@/components/SplitText';

// ─── Types ──────────────────────────────────────────────────────────────

interface MedalItem {
  value: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
}

interface Principle {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}

// ─── Animated Counter Hook ──────────────────────────────────────────────

const useAnimatedCounter = (target: number, duration = 2200) => {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      // Ease-out cubic
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

// ─── Data ───────────────────────────────────────────────────────────────

const medalData: MedalItem[] = [
  {
    value: achievementStats[0].value,
    label: achievementStats[0].label,
    icon: Trophy,
    color: '#F59E0B',
    gradientFrom: '#F59E0B',
    gradientTo: '#D97706',
    glowColor: 'rgba(245, 158, 11, 0.25)',
  },
  {
    value: achievementStats[1].value,
    label: achievementStats[1].label,
    icon: Medal,
    color: '#A1A1AA',
    gradientFrom: '#A1A1AA',
    gradientTo: '#71717A',
    glowColor: 'rgba(161, 161, 170, 0.25)',
  },
  {
    value: achievementStats[2].value,
    label: achievementStats[2].label,
    icon: Award,
    color: '#B45309',
    gradientFrom: '#B45309',
    gradientTo: '#92400E',
    glowColor: 'rgba(180, 83, 9, 0.25)',
  },
  {
    value: achievementStats[3].value,
    label: achievementStats[3].label,
    icon: Star,
    color: '#7C3AED',
    gradientFrom: '#7C3AED',
    gradientTo: '#6D28D9',
    glowColor: 'rgba(124, 58, 237, 0.25)',
  },
];

const principles: Principle[] = [
  {
    icon: Crosshair,
    title: 'Precision',
    description:
      'Every kick and every line of code demands exactness. In Taekwondo, a millimeter decides a match. In AI, a single parameter shift changes everything.',
  },
  {
    icon: Swords,
    title: 'Resilience',
    description:
      'Falling on the mat taught me to rise faster. Failed experiments are not setbacks — they are data points on the path to a breakthrough.',
  },
  {
    icon: Sparkles,
    title: 'Discipline',
    description:
      'Dawn training sessions for 15 years forged a work ethic that now fuels 12-hour research sprints. Excellence is a habit, not an act.',
  },
];

const achievements = [
  { text: '1st Place at African Games', date: 'Mar. 2024' },
  { text: 'Medal of Excellence from Egyptian President', date: 'Jul. 2024' },
  { text: 'Egyptian National Team Member', date: 'Present' },
  { text: '3rd Dan Black Belt', date: 'Certified' },
];

const achievementIcons = [Trophy, Medal, Award, Swords];

// ─── Animated Gradient Border ───────────────────────────────────────────

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

// ─── Stat Card ──────────────────────────────────────────────────────────

const StatCard = ({ item, index }: { item: MedalItem; index: number }) => {
  const isNumeric = item.value !== '3rd';
  const numericTarget = isNumeric ? parseInt(item.value, 10) : 0;
  const { count, ref } = useAnimatedCounter(numericTarget);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.12,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bento-card group relative overflow-hidden cursor-pointer"
    >
      <AnimatedBorder />

      {/* Glow overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit] z-[1]"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${item.glowColor} 0%, transparent 65%)`,
        }}
      />

      {/* Shine sweep on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-[1]"
        aria-hidden
      >
        <motion.div
          className="absolute top-0 -left-[60%] w-[60%] h-full skew-x-[20deg] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
          animate={{ x: ['0%', '300%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center gap-3 p-6 md:p-8">
        {/* Icon with gradient background */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-[4deg] relative"
          style={{
            background: `linear-gradient(135deg, ${item.gradientFrom}18, ${item.gradientTo}06)`,
            border: `1px solid ${item.color}25`,
            color: item.color,
          }}
        >
          {/* Icon glow on hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
            style={{ background: item.color }}
          />
          <item.icon size={26} className="drop-shadow-lg relative z-10" />
        </div>

        {/* Value with neon gradient + drop-shadow glow */}
        <div className="flex items-baseline gap-0.5">
          {isNumeric ? (
            <span
              ref={ref}
              className="text-4xl md:text-5xl font-black tracking-ultra leading-none"
              style={{
                background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `drop-shadow(0 0 8px ${item.glowColor})`,
              }}
            >
              {count}
            </span>
          ) : (
            <span
              className="text-4xl md:text-5xl font-black tracking-ultra leading-none"
              style={{
                background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `drop-shadow(0 0 8px ${item.glowColor})`,
              }}
            >
              {item.value}
            </span>
          )}
        </div>

        {/* Label */}
        <div
          className="text-[9px] font-bold uppercase tracking-[0.3em]"
          style={{ color: `${item.color}CC` }}
        >
          {item.label}
        </div>
      </div>

      {/* Magnetic follow glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]"
        style={{
          boxShadow: `inset 0 0 30px ${item.glowColor}`,
        }}
      />
    </motion.div>
  );
};

// ─── Main Section ───────────────────────────────────────────────────────

const BeyondTheLab = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <section
      id="beyond"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-base-950"
    >
      {/* ── Parallax Background Orbs ────────────────────────────── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute top-[15%] -right-40 w-[32rem] h-[32rem] rounded-full opacity-[0.12]"
          style={{
            background:
              'radial-gradient(circle, rgba(245,158,11,0.20) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        <div
          className="absolute bottom-[20%] -left-40 w-[28rem] h-[28rem] rounded-full opacity-[0.12]"
          style={{
            background:
              'radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute top-[45%] left-1/3 w-72 h-72 rounded-full opacity-[0.08]"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-25" aria-hidden />

      {/* Subtle scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        aria-hidden
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.5) 2px, rgba(6,182,212,0.5) 3px)',
        }}
      />

      <div className="section-container relative z-10">
        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <SplitText animation="fadeUp" delay={0.02} duration={0.5} hoverEffect={null} as="span" className="section-label">Discipline</SplitText>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
            <SplitText animation="fadeUp" delay={0.03} duration={0.6} hoverEffect="sway" as="span" once>
              Beyond
            </SplitText>{' '}
            <SplitText animation="fadeUp" delay={0.05} duration={0.7} hoverEffect="sway" as="span" once className="text-gradient-cyan-violet">
              the Lab
            </SplitText>
          </h2>
        </motion.div>

        {/* ── Main Grid (story left, stats right) ──────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          {/* ═══ Left Column: Story ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Hero quote — enhanced gradient typography */}
            <blockquote className="relative">
              {/* Decorative opening quote mark */}
              <span
                className="absolute -top-6 -left-2 text-6xl font-black leading-none select-none pointer-events-none"
                aria-hidden
                style={{
                  background:
                    'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(124,58,237,0.1))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                &ldquo;
              </span>
              <p className="text-2xl md:text-3xl lg:text-[clamp(1.75rem,3vw,2.5rem)] font-black uppercase tracking-ultra leading-[0.9] text-white pl-4">
                The same discipline that earned{' '}
                <span className="text-gradient-cyan-violet">
                  43 medals
                </span>{' '}
                on the mat, drives breakthrough research in the lab.
              </p>
            </blockquote>

            <p className="text-white/50 text-base md:text-lg leading-relaxed">
              Ahmed Badr is a 3rd Dan Black Belt and Egyptian National Team
              member with 43 international medals. The same precision,
              resilience, and discipline that define his Taekwondo career
              fuel his AI research — because whether you&apos;re breaking
              boards or breaking state-of-the-art, the fundamentals are the
              same.
            </p>

            {/* Principles with neon left-border accent */}
            <div className="space-y-4 pt-2">
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex gap-4 md:gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group"
                >
                  {/* Neon left-border accent */}
                  <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-gradient-to-b from-accent-cyan to-neon-violet opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon with glow */}
                  <div className="relative w-12 h-12 min-w-[3rem] rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                    {/* Glow behind icon on hover */}
                    <div className="absolute inset-0 rounded-xl bg-accent-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <principle.icon
                      size={20}
                      className="text-accent-cyan relative z-10"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black uppercase tracking-wider text-white mb-1 group-hover:text-gradient-cyan-violet transition-all duration-300">
                      {principle.title}
                    </h4>
                    <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/50 transition-colors duration-300">
                      {principle.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ═══ Right Column: Stats + Achievements ═══ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Medal stats grid (2x2) — bento-card style */}
            <div className="grid grid-cols-2 gap-4">
              {medalData.map((item, index) => (
                <StatCard key={item.label} item={item} index={index} />
              ))}
            </div>

            {/* Achievements list — no emojis, all Lucide SVG icons */}
            <div className="bento-card !rounded-2xl p-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-5">
                Top Achievements
              </h4>
              <ul className="space-y-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievementIcons[index];
                  const iconColors = [
                    '#F59E0B', // Trophy — gold
                    '#A1A1AA', // Medal — silver
                    '#B45309', // Award — bronze
                    '#7C3AED', // Swords — violet
                  ];
                  const iconBgColors = [
                    'rgba(245,158,11,0.12)',
                    'rgba(161,161,170,0.12)',
                    'rgba(180,83,9,0.12)',
                    'rgba(124,58,237,0.12)',
                  ];
                  return (
                    <motion.li
                      key={achievement.text}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.4 + index * 0.08,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-center gap-3 group"
                    >
                      {/* Lucide SVG icon replacing emoji */}
                      <div
                        className="w-9 h-9 min-w-[2.25rem] rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-[3deg]"
                        style={{
                          background: iconBgColors[index],
                          color: iconColors[index],
                        }}
                      >
                        <IconComponent size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white/80 group-hover:text-white transition-colors duration-300">
                          {achievement.text}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/40 transition-colors duration-300">
                          {achievement.date}
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ── CTA Bridge — "Champion's Code" with neon border ──── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.5,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-16 md:mt-20 text-center"
        >
          <div className="relative w-full max-w-2xl mx-auto group">
            {/* Animated neon gradient border */}
            <div
              className="absolute inset-0 rounded-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                padding: '1px',
                background:
                  'linear-gradient(90deg, #06B6D4, #7C3AED, #2563EB, #06B6D4)',
                backgroundSize: '300% 100%',
                animation: 'border-dance 4s ease-in-out infinite',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Outer glow behind the card */}
            <div
              className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, transparent 70%)',
              }}
            />

            {/* Content */}
            <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-sm p-8 md:p-10 flex flex-col items-center gap-5">
              <div className="flex items-center gap-3 text-white/50">
                <Swords size={16} className="text-accent-cyan/60" />
                <span className="text-[9px] font-bold uppercase tracking-[0.35em]">
                  The Champion&apos;s Code
                </span>
                <Crosshair size={16} className="text-accent-cyan/60" />
              </div>
              <p className="text-lg md:text-xl text-white/80 font-bold max-w-xl">
                15 years of Taekwondo discipline meet cutting-edge AI
                research.
                <br />
                <span className="text-white/40 font-normal">
                  Same mindset. Different arena.
                </span>
              </p>
              <a
                href="#projects"
                className="btn-primary mt-2 cursor-pointer"
              >
                <Sparkles size={14} />
                See the Research
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeyondTheLab;
