'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { projects, type Project } from '@/data/projects';

// Custom Github Icon
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
  </svg>
);

// Project Card Component
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
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.title}`}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan border border-white/[0.06] hover:border-white/20 transition-all duration-500 ${featured ? 'aspect-[16/9]' : 'aspect-square'}`}
    >
      {/* Image */}
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="w-full h-full object-cover grayscale brightness-40 group-hover:grayscale-0 group-hover:brightness-60 transition-all duration-700 scale-105 group-hover:scale-100"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
        <span className="tag">{project.status}</span>
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <ArrowUpRight size={16} strokeWidth={2.5} className="text-white" />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-2">{project.category}</div>
        <div className="flex justify-between items-end gap-4">
          <h3 className={`font-black uppercase tracking-ultra leading-ultra text-white ${featured ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
            {project.title}
          </h3>
          <span className="text-white/20 font-bold text-sm whitespace-nowrap group-hover:text-accent-cyan transition-colors duration-300 hidden sm:block">
            {project.stats}
          </span>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(6,182,212,0.06)' }} />
    </motion.article>
  );
};

// Project Modal Component
const ProjectModal = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-base-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Image panel */}
          <div className="md:w-2/5 h-56 md:h-auto relative flex-shrink-0">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale brightness-50" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-base-900 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:right-0">
              <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2">
                {project.year} · {project.category}
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-ultra leading-ultra text-white">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Content panel */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost !py-2 !text-[10px]"
                >
                  <GithubIcon size={14} />
                  Code
                </a>
              )}
              {project.status === 'Deployed' && (
                <span className="tag bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan">
                  <ExternalLink size={12} className="inline mr-1" />
                  Live
                </span>
              )}
            </div>

            <p className="text-white/60 text-base leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="space-y-4 mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Key Achievements</h4>
              <ul className="space-y-2">
                {project.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/50 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white/60">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Projects Section Component
const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const featuredProject = projects[0];
  const gridProjects = projects.slice(1, 5);

  return (
    <section id="projects" className="py-28 md:py-40 relative">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="section-label">Portfolio</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </motion.div>

        {/* Featured Project */}
        <div className="mb-8">
          <ProjectCard
            project={featuredProject}
            index={0}
            featured
            onClick={() => setSelectedProject(featuredProject)}
          />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index + 1}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a href="https://github.com/ahmedislamfarouk" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <GithubIcon size={14} />
            View All on GitHub
          </a>
        </motion.div>
      </div>

      {/* Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

export default Projects;
