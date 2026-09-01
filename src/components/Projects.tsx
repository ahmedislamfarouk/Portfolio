'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── All projects displayed ────────────────────────────────

const ALL_PROJECTS = projects;

// ── Status styles ─────────────────────────────────────────

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  Deployed: { label: 'ACTIVE', color: '#06B6D4' },
  'In Development': { label: 'DEV', color: '#F59E0B' },
  'Research Phase': { label: 'RESEARCH', color: '#8B5CF6' },
};

// ── Shimmer placeholder ───────────────────────────────────

const shimmerBase64 =
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
       <rect fill="#111111" width="800" height="600"/>
     </svg>`,
  );

// ── Tilt Card ─────────────────────────────────────────────

function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -12;
      const rotateY = (x - 0.5) * 12;
      setTilt({ rotateX, rotateY });
    },
    [],
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`project-card-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
    >
      <div
        className="project-card-inner"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────

const ProjectCard = ({
  project,
  index,
  onClick,
}: {
  project: (typeof ALL_PROJECTS)[number];
  index: number;
  onClick: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statusStyle = STATUS_STYLES[project.status] || {
    label: project.status,
    color: '#06B6D4',
  };

  return (
    <div ref={cardRef} className="project-card-wrapper">
      <TiltCard className="grid-card cursor-pointer">
        <article onClick={onClick}>
          {/* Image container with parallax */}
          <div ref={imageRef} className="relative aspect-[16/10] overflow-hidden bg-base-900">
            {!loaded && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${shimmerBase64})` }}
              />
            )}
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 gsap-will-change ${
                loaded ? 'opacity-60' : 'opacity-0'
              }`}
              style={{
                transform: 'scale(1.2)',
              }}
            />

            {/* Top-left: project number */}
            <div className="absolute top-3 left-3 z-10">
              <span className="font-mono text-[10px] text-text-tertiary">
                {String(index + 1).padStart(3, '0')}
              </span>
            </div>

            {/* Top-right: status */}
            <div className="absolute top-3 right-3 z-10">
              <span
                className="font-mono text-[9px] uppercase tracking-[0.15em] border px-2 py-0.5"
                style={{
                  color: statusStyle.color,
                  borderColor: `${statusStyle.color}40`,
                  backgroundColor: `${statusStyle.color}10`,
                }}
              >
                {statusStyle.label}
              </span>
            </div>

            {/* Scan line overlay on hover */}
            <div
              className="absolute inset-0 pointer-events-none z-[5] opacity-0 hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.015) 2px, rgba(6,182,212,0.015) 4px)',
              }}
            />

            {/* Bottom glow on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-base-950/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Info */}
          <div className="p-5">
            {/* Category + year */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-tertiary">
                {project.category}
              </span>
              <span className="font-mono text-[10px] text-text-tertiary">
                {project.year}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-sans font-bold text-base uppercase tracking-tight text-text-primary mb-2 group-hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.tech.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-border text-text-tertiary"
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 3 && (
                <span className="font-mono text-[9px] text-text-tertiary">
                  +{project.tech.length - 3}
                </span>
              )}
            </div>
          </div>
        </article>
      </TiltCard>
    </div>
  );
};

// ── Project Detail Modal ──────────────────────────────────

function ProjectModal({
  project,
  index,
  onClose,
}: {
  project: (typeof ALL_PROJECTS)[number];
  index: number;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statusStyle = STATUS_STYLES[project.status] || {
    label: project.status,
    color: '#06B6D4',
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    // Animate modal in
    if (backdropRef.current && contentRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' },
      );
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          delay: 0.1,
        },
      );
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (backdropRef.current && contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 10,
        duration: 0.2,
        ease: 'power2.in',
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.05,
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-base-950/90 backdrop-blur-xl"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative bg-base-900 border border-border max-w-3xl w-full max-h-[85vh] overflow-y-auto opacity-0"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border border-border hover:border-accent transition-colors duration-200 cursor-pointer"
          aria-label="Close project details"
        >
          <span className="text-text-secondary text-xs">&times;</span>
        </button>

        {/* Image */}
        <div className="relative aspect-[16/9] bg-base-950">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-900 to-transparent" />
        </div>

        {/* Details */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] text-text-tertiary">
              {String(index + 1).padStart(3, '0')}
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-tertiary">
              {project.category}
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="font-mono text-[10px] text-text-tertiary">
              {project.year}
            </span>
          </div>

          <h2 className="font-sans font-black text-2xl md:text-4xl uppercase tracking-tight text-text-primary mb-4">
            {project.title}
          </h2>

          <p className="text-text-secondary text-base leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Details list */}
          <div className="space-y-3 mb-8">
            {project.details.map((detail, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-accent text-xs mt-1.5 shrink-0">
                  &#x25B8;
                </span>
                <span className="text-text-secondary text-sm leading-relaxed">
                  {detail}
                </span>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary block mb-3">
              TECH STACK:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors duration-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Status + Link */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusStyle.color }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-tertiary">
                {statusStyle.label}
              </span>
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-text-secondary hover:text-accent transition-colors duration-300"
              >
                <span>VIEW SOURCE</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  &rarr;
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Projects Section ──────────────────────────────────────

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const hasSetup = useRef(false);

  const setupAnimations = useCallback(() => {
    if (hasSetup.current) return;
    hasSetup.current = true;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    // ── Section header: clip-path reveal ──
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1,
          },
        },
      );
    }

    // ── Project cards: slide in from alternating sides with rotation ──
    const cards = gsap.utils.toArray<HTMLElement>('.project-card-wrapper');
    cards.forEach((card, i) => {
      const isFromLeft = i % 2 === 0;
      const imageEl = card.querySelector('img');

      // Card: slide in from side + rotation + scale
      gsap.fromTo(
        card,
        {
          opacity: 0,
          x: isFromLeft ? -100 : 100,
          rotation: isFromLeft ? -3 : 3,
          scale: 0.8,
        },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        },
      );

      // Image: parallax (moves slower than card)
      if (imageEl) {
        gsap.to(imageEl, {
          y: -30,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    });

    // ── Counter badge ──
    const counterEl = sectionRef.current?.querySelector('[data-counter]');
    if (counterEl) {
      gsap.fromTo(
        counterEl,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: counterEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setupAnimations();
    });
    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [setupAnimations]);

  return (
    <section id="projects" ref={sectionRef} className="border-b border-border">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-10 flex items-end justify-between gap-6"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          <div>
            <span className="data-label">NEURAL ACTIVITY</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tight mt-4">
              SELECTED WORK
            </h2>
          </div>
          <span
            data-counter
            className="font-mono text-[11px] text-text-tertiary hidden sm:block opacity-0"
          >
            [{ALL_PROJECTS.length} ACTIVE]
          </span>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-10" />

        {/* Project cards — stacked layout */}
        <div ref={cardsContainerRef} className="space-y-16 md:space-y-24">
          {ALL_PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              onClick={() => setSelectedProject(i)}
            />
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject !== null && (
        <ProjectModal
          project={ALL_PROJECTS[selectedProject]}
          index={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default Projects;
