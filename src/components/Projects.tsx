'use client';

import { useState, useEffect, useRef } from 'react';
import { projects } from '@/data/projects';

// ── Top 3 featured projects ──────────────────────────────

const FEATURED_PROJECTS = projects.slice(0, 3);

// ── Status styles ────────────────────────────────────────

const STATUS_STYLES: Record<string, { label: string }> = {
  Deployed: { label: 'ACTIVE' },
  'In Development': { label: 'DEV' },
  'Research Phase': { label: 'RESEARCH' },
};

// ── Shimmer placeholder ──────────────────────────────────

const shimmerBase64 =
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
       <rect fill="#111111" width="800" height="600"/>
     </svg>`,
  );

// ── Project Card ─────────────────────────────────────────

const ProjectCard = ({
  project,
  index,
}: {
  project: (typeof FEATURED_PROJECTS)[number];
  index: number;
}) => {
  const [loaded, setLoaded] = useState(false);
  const statusStyle = STATUS_STYLES[project.status] || { label: project.status };

  return (
    <article
      className="group grid-card"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-base-900">
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
          className={`w-full h-full object-cover transition-all duration-700 ${
            loaded ? 'opacity-60' : 'opacity-0'
          } group-hover:opacity-80`}
        />

        {/* Top-left: project number */}
        <div className="absolute top-3 left-3 z-10">
          <span className="font-mono text-[10px] text-text-tertiary">
            {String(index + 1).padStart(3, '0')}
          </span>
        </div>

        {/* Top-right: status */}
        <div className="absolute top-3 right-3 z-10">
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-tertiary border border-border px-2 py-0.5">
            {statusStyle.label}
          </span>
        </div>

        {/* Scan line overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[5] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.015) 2px, rgba(6,182,212,0.015) 4px)',
          }}
        />
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
        <h3 className="font-sans font-bold text-base uppercase tracking-tight text-text-primary mb-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>
    </article>
  );
};

// ── Projects Section ─────────────────────────────────────

const Projects = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const mountRef = useRef(false);

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    requestAnimationFrame(() => {
      setHasMounted(true);
    });
  }, []);

  return (
    <section id="projects" className="border-b border-border">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div
          className={`mb-10 flex items-end justify-between gap-6 transition-opacity duration-700 ${hasMounted ? 'opacity-100' : 'opacity-0'}`}
        >
          <div>
            <span className="data-label">MISSION LOG</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tight mt-4">
              SELECTED WORK
            </h2>
          </div>
          <span className="font-mono text-[11px] text-text-tertiary hidden sm:block">
            [{FEATURED_PROJECTS.length} ACTIVE]
          </span>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-10" />

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
