'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { projects, type Project } from '@/data/projects';
import ScrollReveal from '@/components/ScrollReveal';

// ── Top 4 featured projects ──────────────────────────────

const FEATURED_PROJECTS = projects.slice(0, 4);

// ── Status styles ────────────────────────────────────────

const STATUS_STYLES: Record<Project['status'], { dot: string; label: string }> = {
  Deployed: { dot: 'bg-neon-green', label: 'Deployed' },
  'In Development': { dot: 'bg-yellow-400', label: 'In Development' },
  'Research Phase': { dot: 'bg-neon-violet', label: 'Research Phase' },
};

// ── Shimmer placeholder ──────────────────────────────────

const shimmerBase64 =
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
       <rect fill="#0A0A0A" width="800" height="600"/>
       <defs>
         <linearGradient id="s" x1="0%" y1="0%" x2="100%" y2="0%">
           <stop offset="0%" stop-color="#0A0A0A" />
           <stop offset="50%" stop-color="#1A1A1A" />
           <stop offset="100%" stop-color="#0A0A0A" />
         </linearGradient>
       </defs>
       <rect fill="url(#s)" width="800" height="600"/>
     </svg>`,
  );

// ── Horizontal scroll project card ───────────────────────

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const [loaded, setLoaded] = useState(false);
  const statusStyle = STATUS_STYLES[project.status];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex-shrink-0 w-[340px] md:w-[420px] lg:w-[480px]"
    >
      <div className="bento-card relative overflow-hidden aspect-[16/11] cursor-pointer">
        {/* Image */}
        <div className="absolute inset-0 overflow-hidden">
          {!loaded && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${shimmerBase64})` }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-shimmer"
                style={{ backgroundSize: '200% 100%' }}
              />
            </div>
          )}
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover grayscale brightness-40 group-hover:grayscale-0 group-hover:brightness-60 transition-all duration-[800ms] scale-110 group-hover:scale-100 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/[0.08] rounded-full text-[10px] font-bold uppercase tracking-wider text-white/70">
            <span className={`relative flex w-2 h-2`}>
              <span className={`absolute inset-0 rounded-full ${statusStyle.dot} animate-ping opacity-60`} />
              <span className={`relative inline-block w-2 h-2 rounded-full ${statusStyle.dot}`} />
            </span>
            {statusStyle.label}
          </span>
        </div>

        {/* Hover arrow */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <ArrowUpRight size={16} strokeWidth={2.5} className="text-white" />
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-2 flex items-center gap-3">
            <span>{project.category}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{project.year}</span>
          </div>
          <h3 className="font-black uppercase tracking-ultra leading-ultra text-white text-2xl md:text-3xl mb-2">
            {project.title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Hover scan lines */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.02) 2px, rgba(6,182,212,0.02) 4px)',
          }}
        />
      </div>
    </motion.article>
  );
};

// ── Projects Section ─────────────────────────────────────

const Projects = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -420 : 420;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section id="projects" className="py-28 md:py-40 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header */}
        <ScrollReveal direction="up" distance={30} duration={0.8}>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="section-label">Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
                <span>Selected </span>
                <span className="text-gradient">Work</span>
              </h2>
              <p className="text-white/25 text-sm md:text-base mt-4 max-w-lg leading-relaxed">
                Research-driven AI, robotics, and NLP systems.
              </p>
            </div>

            {/* Scroll arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Scroll left"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Scroll right"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-20 lg:px-20"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {FEATURED_PROJECTS.map((project, i) => (
            <div key={project.title} style={{ scrollSnapAlign: 'start' }}>
              <ProjectCard project={project} index={i} />
            </div>
          ))}

          {/* "View All" card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-[340px] md:w-[420px] lg:w-[480px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <a
              href="https://github.com/ahmedislamfarouk"
              target="_blank"
              rel="noopener noreferrer"
              className="group bento-card flex flex-col items-center justify-center aspect-[16/11] border-dashed hover:border-accent-cyan/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:border-accent-cyan/30 group-hover:scale-110 transition-all duration-300">
                <ArrowUpRight size={20} className="text-white/30 group-hover:text-accent-cyan transition-colors duration-300" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors duration-300">
                View All on GitHub
              </span>
            </a>
          </motion.div>
        </div>

        {/* Scroll fade edges */}
        <div className="relative">
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-base-950 to-transparent pointer-events-none z-10" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-base-950 to-transparent pointer-events-none z-10" />
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
