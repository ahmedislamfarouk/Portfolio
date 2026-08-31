'use client';

import { Trophy, Bot, Clock, GraduationCap } from 'lucide-react';
import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

// ── Reduced motion helpers ──────────────────────────────

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

// ── useCountUp ──────────────────────────────────────────

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

// ── Stat Block ──────────────────────────────────────────

interface StatBlockProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  suffix: string;
  label: string;
}

const StatBlock = ({ icon: Icon, value, suffix, label }: StatBlockProps) => {
  const { count, ref } = useCountUp(value);

  return (
    <div ref={ref} className="group">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-accent-cyan/5 border border-accent-cyan/10 group-hover:bg-accent-cyan/10 transition-colors duration-300">
          <Icon size={18} className="text-accent-cyan" />
        </div>
      </div>
      <div className="text-4xl md:text-5xl font-black tracking-ultra text-white tabular-nums">
        {count}
        <span className="text-accent-cyan/50">{suffix}</span>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mt-1">
        {label}
      </div>
    </div>
  );
};

// ── About Section ───────────────────────────────────────

const About = () => {
  const stats = [
    { icon: Trophy, value: 43, suffix: '+', label: 'Global Honors' },
    { icon: Bot, value: 9, suffix: '', label: 'AI Projects Shipped' },
    { icon: Clock, value: 2, suffix: '+', label: 'Years Research' },
    { icon: GraduationCap, value: 4, suffix: '', label: 'University Collaborations' },
  ] as const;

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-accent-cyan/5 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        <ScrollReveal direction="up" distance={30} duration={0.8}>
          <div className="mb-16">
            <span className="section-label">About</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
              <span>The </span>
              <span className="text-gradient">Engineer</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left: Stats grid */}
          <ScrollReveal direction="left" distance={30} duration={0.8} delay={0.1}>
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat) => (
                <StatBlock key={stat.label} {...stat} />
              ))}
            </div>
          </ScrollReveal>

          {/* Right: Bio text */}
          <ScrollReveal direction="right" distance={30} duration={0.8} delay={0.2}>
            <div className="space-y-6">
              <p className="text-white/70 text-lg leading-relaxed">
                I am an AI Researcher and Robotics Engineer based in Cairo, Egypt,
                with a passion for building intelligent systems that bridge the gap
                between perception and action.
              </p>
              <p className="text-white/50 text-base leading-relaxed">
                My work spans computer vision, autonomous systems, and natural language
                processing. From developing non-invasive medical diagnostics with deep
                learning to engineering ROS 2-based perception pipelines for autonomous
                vehicles, I focus on research that translates into real-world impact.
              </p>
              <p className="text-white/50 text-base leading-relaxed">
                Currently building SkyVision Swarm with James Madison University,
                integrating drone swarms with LLM-assisted situational analysis for
                disaster response. Previously interned at the University of Louisville
                bioengineering labs and collaborated with Virginia Tech on semantic
                search platforms.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4">
                {['AI Research', 'Robotics', 'Computer Vision', 'NLP', 'Deep Learning', 'ROS 2'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.07] rounded-full text-[10px] font-bold uppercase tracking-wider text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
