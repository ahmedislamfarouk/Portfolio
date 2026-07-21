'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ExternalLink } from 'lucide-react';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { projects, type Project } from '@/data/projects';
import { useTiltEffect } from '@/hooks/useTiltEffect';
import { staggerContainer, fadeSlideUp } from '@/components/animations';
import SplitText from '@/components/SplitText';

/* ─────────────────────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────────────────────── */

const STATUS_STYLES: Record<Project['status'], { dot: string; ping: string; label: string }> = {
  Deployed: {
    dot: 'bg-neon-green',
    ping: 'bg-neon-green',
    label: 'Deployed',
  },
  'In Development': {
    dot: 'bg-yellow-400',
    ping: 'bg-yellow-400',
    label: 'In Development',
  },
  'Research Phase': {
    dot: 'bg-neon-violet',
    ping: 'bg-neon-violet',
    label: 'Research Phase',
  },
};

const CATEGORY_FILTERS = ['All', 'AI/ML', 'Robotics', 'NLP', 'Research'] as const;

/** Map a project's category string to one of the filter groups. */
const getProjectFilter = (project: Project): string => {
  const cat = project.category.toLowerCase();
  if (
    cat.includes('robotics') ||
    cat.includes('multi-agent') ||
    cat.includes('perception') ||
    cat.includes('drone') ||
    cat.includes('autonomous') ||
    cat.includes('fusion')
  ) {
    return 'Robotics';
  }
  if (
    cat.includes('nlp') ||
    cat.includes('llm') ||
    cat.includes('semantic') ||
    cat.includes('edtech') ||
    cat.includes('chatbot')
  ) {
    return 'NLP';
  }
  if (
    cat.includes('research') ||
    cat.includes('reinforcement') ||
    cat.includes('startup')
  ) {
    return 'Research';
  }
  return 'AI/ML';
};

/** Tiny shimmer SVG placeholder (base64-encoded). */
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

/* ─────────────────────────────────────────────────────────────
   Custom Github Icon (preserved from original)
   ───────────────────────────────────────────────────────────── */

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   Shimmer Image — lazy loads with blur placeholder
   ───────────────────────────────────────────────────────────── */

const ShimmerImage = ({
  src,
  alt,
  imgClassName = '',
}: {
  src: string;
  alt: string;
  imgClassName?: string;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Placeholder shimmer */}
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

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`${imgClassName} transition-all duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ProjectCard — bento card with 3D tilt, neon glow, status dot
   ───────────────────────────────────────────────────────────── */

const ProjectCard = ({
  project,
  index,
  featured,
  onClick,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  onClick: () => void;
}) => {
  const { ref, onMouseMove, onMouseLeave, style } = useTiltEffect<HTMLDivElement>({
    scale: 1.02,
    rotation: 10,
  });

  const statusStyle = STATUS_STYLES[project.status];

  return (
    <motion.article
      variants={fadeSlideUp}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={featured ? 'md:col-span-2' : ''}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`View project: ${project.title}`}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={style}
        className={`bento-card group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan ${
          featured ? 'aspect-[16/9]' : 'aspect-square'
        }`}
      >
        {/* ── Inner glow overlay ─────────────────────────── */}
        <div className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: 'inset 0 0 80px rgba(6, 182, 212, 0.08), inset 0 0 160px rgba(6, 182, 212, 0.04)',
          }}
        />

        {/* ── Neon border glow on hover ──────────────────── */}
        <div
          className="absolute -inset-[1px] rounded-[calc(2rem+1px)] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: '0 0 24px rgba(6, 182, 212, 0.25), 0 0 48px rgba(6, 182, 212, 0.10)',
          }}
        />

        {/* ── Image ──────────────────────────────────────── */}
        <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
          <ShimmerImage
            src={project.image}
            alt={project.title}
            imgClassName="w-full h-full object-cover grayscale brightness-40 group-hover:grayscale-0 group-hover:brightness-60 transition-all duration-[800ms] scale-105 group-hover:scale-100"
          />
        </div>

        {/* ── Gradient overlays ──────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-[2rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* ── Status badge (top-left) ────────────────────── */}
        <div className="absolute top-5 left-5 z-20">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/[0.08] rounded-full text-[10px] font-bold uppercase tracking-wider text-white/70">
            <span className="relative flex w-2 h-2">
              <span className={`absolute inset-0 rounded-full ${statusStyle.ping} animate-ping opacity-60`} />
              <span className={`relative inline-block w-2 h-2 rounded-full ${statusStyle.dot}`} />
            </span>
            {statusStyle.label}
          </span>
        </div>

        {/* ── Open icon (top-right, visible on hover) ────── */}
        <div className="absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group/open-btn">
            <ArrowUpRight
              size={16}
              strokeWidth={2.5}
              className="text-white group-hover/open-btn:text-neon-cyan transition-colors duration-300"
            />
          </div>
        </div>

        {/* ── Bottom info ────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 z-20">
          <div
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2 flex items-center gap-3"
            style={{ transform: 'translateZ(30px)' }}
          >
            <span>{project.category}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{project.year}</span>
          </div>

          <div className="flex justify-between items-end gap-4">
            <h3
              className={`font-black uppercase tracking-ultra leading-ultra text-white ${
                featured ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'
              }`}
              style={{ transform: 'translateZ(40px)' }}
            >
              {project.title}
            </h3>
            <span className="text-white/20 font-bold text-sm whitespace-nowrap group-hover:text-neon-cyan transition-colors duration-300 hidden sm:block">
              {project.stats}
            </span>
          </div>
        </div>

        {/* ── Scan line decorative overlay ────────────────── */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.015) 2px, rgba(6,182,212,0.015) 4px)',
          }}
        />
      </motion.div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   ProjectModal — enhanced with staggered achievements,
   interactive tech pills, spring animations
   ───────────────────────────────────────────────────────────── */

const ProjectModal = ({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Focus the close button when the modal opens
  useEffect(() => {
    if (project) {
      // Small delay to let the animation start
      const id = setTimeout(() => closeRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [project]);

  // Close on Escape
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const statusStyle = STATUS_STYLES[project.status];

  // Stagger variants for achievements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 200, damping: 24 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Project details: ${project.title}`}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal panel */}
        <motion.div
          key="modal-panel"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{
            type: 'spring',
            damping: 28,
            stiffness: 280,
            mass: 0.8,
          }}
          className="relative w-full max-w-5xl bg-base-900 border border-white/[0.08] rounded-[2rem] overflow-hidden flex flex-col md:flex-row max-h-[90vh] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Close button ──────────────────────────────── */}
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute top-5 right-5 z-30 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-neon-cyan"
            aria-label="Close modal"
            autoFocus
          >
            <X size={18} />
          </button>

          {/* ── Image panel (left) ────────────────────────── */}
          <div className="md:w-2/5 h-56 md:h-auto relative flex-shrink-0 overflow-hidden">
            {/* Placeholder shimmer */}
            {!imgLoaded && (
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
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover grayscale brightness-40 transition-all duration-700 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Gradient edge blend */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-base-900/95 via-base-900/40 to-transparent" />

            {/* Title overlay on image */}
            <div className="absolute bottom-6 left-6 right-6 md:right-0 z-20">
              <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2 flex items-center gap-2">
                <span>{project.year}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{project.category}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-ultra leading-ultra text-white">
                {project.title}
              </h2>
            </div>

            {/* Decorative scan line */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
              }}
            />
          </div>

          {/* ── Content panel (right) ─────────────────────── */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            {/* Action bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex items-center gap-3 mb-6 flex-wrap"
            >
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-2 px-5 py-2.5 border border-white/15 text-white font-bold uppercase tracking-widest text-[10px] rounded-full transition-all duration-300 hover:border-white/30 hover:bg-white/[0.05]"
                >
                  <GithubIcon size={14} />
                  <span>Source Code</span>
                  <ExternalLink
                    size={12}
                    className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300"
                  />
                </a>
              )}

              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  project.status === 'Deployed'
                    ? 'bg-neon-green/10 border-neon-green/25 text-neon-green'
                    : project.status === 'In Development'
                      ? 'bg-yellow-400/10 border-yellow-400/25 text-yellow-400'
                      : 'bg-neon-violet/10 border-neon-violet/25 text-neon-violet'
                }`}
              >
                <span className="relative flex w-2 h-2">
                  <span
                    className={`absolute inset-0 rounded-full ${
                      statusStyle.ping
                    } animate-ping opacity-60`}
                  />
                  <span
                    className={`relative inline-block w-2 h-2 rounded-full ${statusStyle.dot}`}
                  />
                </span>
                {project.status === 'Deployed' && (
                  <ExternalLink size={12} className="inline" />
                )}
                {project.status}
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-white/50 text-sm md:text-base leading-relaxed mb-6"
            >
              {project.description}
            </motion.p>

            {/* Key Achievements (staggered) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="mb-6"
            >
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4 flex items-center gap-2">
                <span className="w-5 h-px bg-white/10" />
                Key Achievements
              </h4>
              <ul className="space-y-2.5">
                {project.details.map((detail, i) => (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    className="flex items-start gap-3 text-white/40 text-sm group/li"
                  >
                    <span className="relative flex-shrink-0 mt-1.5">
                      <span className="block w-2 h-2 rounded-full border border-neon-cyan/40 group-hover/li:bg-neon-cyan/30 transition-colors duration-300" />
                    </span>
                    <span className="group-hover/li:text-white/60 transition-colors duration-300">
                      {detail}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4 flex items-center gap-2">
                <span className="w-5 h-px bg-white/10" />
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.04, duration: 0.3 }}
                    className="group/pill relative px-3.5 py-1.5 bg-white/[0.03] border border-white/[0.07] rounded-full text-[10px] font-bold uppercase tracking-wider text-white/40 transition-all duration-300 hover:bg-neon-cyan/10 hover:border-neon-cyan/30 hover:text-neon-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.12)] cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────────────────────
   Filter Tabs
   ───────────────────────────────────────────────────────────── */

const FilterTabs = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (filter: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
      {CATEGORY_FILTERS.map((filter) => {
        const isActive = active === filter;
        return (
          <button
            key={filter}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter)}
            className={`relative px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-neon-cyan ${
              isActive
                ? 'text-white border border-neon-cyan/40 bg-neon-cyan/10'
                : 'text-white/30 border border-white/[0.06] bg-transparent hover:text-white/60 hover:border-white/20'
            }`}
          >
            {filter}
            {/* Active indicator line */}
            {isActive && (
              <motion.div
                layoutId="filter-active"
                className="absolute -bottom-px left-2 right-2 h-[2px] rounded-full bg-neon-cyan"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Projects Section
   ───────────────────────────────────────────────────────────── */

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => getProjectFilter(p) === activeFilter);
  }, [activeFilter]);

  const featuredProject = filteredProjects[0];
  const gridProjects = filteredProjects.slice(1);

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  return (
    <section id="projects" className="py-28 md:py-40 relative">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-neon-violet/5 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
        {/* ── Header ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <SplitText animation="fadeUp" delay={0.02} duration={0.5} hoverEffect={null} as="span" className="section-label">Portfolio</SplitText>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
            <SplitText animation="fadeUp" delay={0.03} duration={0.6} hoverEffect="sway" as="span" once>
              Featured
            </SplitText>{' '}
            <SplitText animation="fadeUp" delay={0.05} duration={0.7} hoverEffect="sway" as="span" once className="text-gradient">
              Projects
            </SplitText>
          </h2>
          <p className="text-white/25 text-sm md:text-base mt-4 max-w-lg leading-relaxed">
            Research-driven AI, robotics, and NLP systems — from conception
            through deployment.
          </p>
        </motion.div>

        {/* ── Filter Tabs ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-10"
        >
          <FilterTabs active={activeFilter} onChange={handleFilterChange} />
        </motion.div>

        {/* ── Bento Grid ────────────────────────────────────── */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-white/20 text-sm uppercase tracking-[0.3em]">
                No projects in this category yet.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="project-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Featured (spans 2 cols on desktop) */}
              {featuredProject && (
                <ProjectCard
                  key={featuredProject.title}
                  project={featuredProject}
                  index={0}
                  featured
                  onClick={() => setSelectedProject(featuredProject)}
                />
              )}

              {/* Grid projects */}
              {gridProjects.map((project, i) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={i + 1}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── View All CTA ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/ahmedislamfarouk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost group/cta"
          >
            <GithubIcon size={14} />
            <span>View All on GitHub</span>
            <ArrowUpRight
              size={12}
              className="opacity-0 -translate-x-1 group-hover/cta:opacity-100 group-hover/cta:translate-x-0 transition-all duration-300"
            />
          </a>
        </motion.div>
      </div>

      {/* ── Modal ──────────────────────────────────────────── */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;
