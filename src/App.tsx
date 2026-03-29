import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  Mail,
  Brain,
  Cpu,
  Trophy,
  Medal,
  Menu,
  X,
  Zap,
  ArrowUpRight,
  Eye,
  Layers,
  Bot,
  Download,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { projects, type Project } from './data/projects';

// ── Custom Icons ─────────────────────────────────────────────────────────────
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
const researchAreas = [
  {
    title: "Computer Vision",
    description: "SOTA detection & segmentation for real-world dynamic environments.",
    icon: Eye,
    accent: "#06B6D4",
  },
  {
    title: "Sensor Fusion",
    description: "LiDAR, radar & camera integration for autonomous navigation.",
    icon: Layers,
    accent: "#2563EB",
  },
  {
    title: "Deep NLP",
    description: "LLM fine-tuning and RAG pipelines for specialized knowledge.",
    icon: Brain,
    accent: "#7C3AED",
  },
  {
    title: "Robotics Control",
    description: "ROS 2 low-level control, path planning, and fleet management.",
    icon: Cpu,
    accent: "#06B6D4",
  },
];

// ── Scroll Progress ───────────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent-cyan z-[600] origin-left"
      style={{ scaleX }}
    />
  );
};

// ── Typewriter hook ───────────────────────────────────────────────────────────
const useTypewriter = (words: string[], speed = 100, pause = 2000) => {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length === current.length) {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setDeleting(false);
          setWordIdx((i) => (i + 1) % words.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx, words, speed, pause]);

  return displayed;
};

// ── Navigation ────────────────────────────────────────────────────────────────
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = ['About', 'Projects', 'Labs', 'Awards', 'Contact'];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[400] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-container">
          <div className={`flex items-center justify-between transition-all duration-500 rounded-2xl px-6 py-3 ${scrolled ? 'bg-black/80 backdrop-blur-2xl border border-white/[0.06]' : ''}`}>
            {/* Logo */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                <span className="text-black font-black text-base tracking-tighter select-none">B</span>
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-wider">Badr</div>
                <div className="flex items-center gap-1.5 mt-[-2px]">
                  <span className="status-dot" aria-hidden="true" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent-cyan">Online</span>
                </div>
              </div>
            </motion.button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  href={`#${item.toLowerCase()}`}
                  className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* CTA + Burger */}
            <div className="flex items-center gap-3">
              <a
                href="/Ahmed_Badr_CV.pdf"
                download
                className="hidden md:flex btn-ghost !py-2.5 !text-[10px]"
              >
                <Download size={14} />
                Resume
              </a>
              <a href="#contact" className="hidden md:flex btn-primary !py-2.5 !text-[10px]">
                Hire Me
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer md:hidden"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[350] flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <div className="space-y-6 text-center">
              {links.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-5xl font-black uppercase tracking-ultra hover:text-accent-cyan transition-colors duration-300 cursor-pointer"
                  >
                    {item}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero = () => {
  const roles = ['AI Researcher', 'Robotics Engineer', 'Vision Systems', 'Champion Athlete'];
  const role = useTypewriter(roles, 80, 2200);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section id="about" ref={ref} className="min-h-screen relative flex items-center overflow-hidden pt-24">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      {/* Animated orbs */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-[100px]" />
      </motion.div>

      <motion.div style={{ opacity }} className="max-container relative z-10 w-full">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-end min-h-[80vh] py-20">
          {/* Main Text */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="section-label"
            >
              Cairo, Egypt · Available Globally
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(4rem,14vw,13rem)] tracking-ultra leading-ultra font-black"
            >
              Ahmed
              <br />
              <span className="text-gradient">Badr</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2 text-xl md:text-2xl font-light text-white/60"
            >
              <span>{role}</span>
              <span className="cursor" aria-hidden="true" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/40 text-base max-w-lg leading-relaxed"
            >
              Engineering the nexus of sentient vision and autonomous control.
              SOTA research meets championship-level execution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#projects" className="btn-primary">
                View Work <ArrowUpRight size={14} />
              </a>
              <a href="#contact" className="btn-ghost">
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-row lg:flex-col gap-6 lg:gap-4"
          >
            {[
              { val: '43+', label: 'Global Honors' },
              { val: '9', label: 'AI Projects' },
              { val: '2+', label: 'Yrs Research' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card card-glow px-8 py-6 text-center min-w-[120px]"
              >
                <div className="text-4xl font-black tracking-ultra text-white">{stat.val}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Scroll</span>
      </motion.div>
    </section>
  );
};

// ── Project Card ──────────────────────────────────────────────────────────────
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
          <ArrowUpRight size={16} strokeWidth={2.5} />
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

// ── Project Modal ─────────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-5xl bg-base-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
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
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-ultra leading-ultra">{project.title}</h2>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-12 space-y-8">
          <p className="text-white/60 text-base leading-relaxed">{project.description}</p>

          <div>
            <div className="section-label mb-4">Contributions</div>
            <ul className="space-y-3">
              {project.details.map((d, i) => (
                <li key={i} className="flex gap-4 text-sm text-white/50 hover:text-white/80 transition-colors group">
                  <span className="text-accent-cyan font-black text-xs mt-0.5 flex-shrink-0">0{i + 1}</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="section-label mb-4">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="tag hover:bg-accent-cyan/10 hover:border-accent-cyan/30 hover:text-white transition-all cursor-default">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-2xl font-black italic tracking-ultra">{project.stats}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="status-dot" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">{project.status}</span>
              </div>
            </div>
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View on GitHub <ArrowUpRight size={14} />
              </a>
            ) : (
              <button className="btn-ghost opacity-50 cursor-not-allowed">Restricted Access</button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Projects Section ──────────────────────────────────────────────────────────
const ProjectsSection = ({ onSelect }: { onSelect: (p: Project) => void }) => {
  return (
    <section id="projects" className="section-spacing relative">
      <div className="max-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <div className="section-label mb-4">Project Synthesis</div>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-ultra leading-ultra">
              Operational<br />
              <span className="text-white/20">Artifacts</span>
            </h2>
          </div>
          <p className="text-white/30 text-sm max-w-xs leading-relaxed md:text-right">
            Advanced neural architectures across medical, robotic, and multi-agent domains.
          </p>
        </div>

        {/* Featured top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <ProjectCard project={projects[0]} index={0} featured onClick={() => onSelect(projects[0])} />
          </div>
          <div className="space-y-4">
            <ProjectCard project={projects[1]} index={1} onClick={() => onSelect(projects[1])} />
            <ProjectCard project={projects[2]} index={2} onClick={() => onSelect(projects[2])} />
          </div>
        </div>

        {/* Remaining grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {projects.slice(3).map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i + 3}
              onClick={() => onSelect(project)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Labs / Research Section ───────────────────────────────────────────────────
const LabsSection = () => {
  return (
    <section id="labs" className="section-spacing relative">
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="max-container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <div className="section-label mb-4">Core Expertise</div>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-ultra leading-ultra">
              Research<br />
              <span className="text-gradient">Nodes</span>
            </h2>
          </div>
          <p className="text-white/30 text-sm max-w-xs leading-relaxed md:text-right">
            Domains where algorithmic depth meets real-world deployment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {researchAreas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="card card-glow group p-8 space-y-6 cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-transparent transition-all duration-300"
                style={{ background: `${area.accent}15` }}
              >
                <area.icon size={22} style={{ color: area.accent }} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-3">{area.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{area.description}</p>
              </div>
              <div
                className="w-full h-px opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${area.accent}60, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Skills bar */}
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          {[
            { label: 'Computer Vision & Object Detection', pct: 95 },
            { label: 'ROS 2 & Autonomous Systems', pct: 90 },
            { label: 'NLP & Large Language Models', pct: 85 },
            { label: 'Sensor Fusion (LiDAR / Radar / Camera)', pct: 88 },
          ].map((skill, i) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">{skill.label}</span>
                <span className="text-xs font-black text-accent-cyan">{skill.pct}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #06B6D4, #2563EB)' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Achievements Section ──────────────────────────────────────────────────────
const AchievementsSection = () => {
  return (
    <section id="awards" className="section-spacing relative overflow-hidden">
      <div className="max-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div className="space-y-12">
            <div>
              <div className="section-label mb-4">Distinction & Legacy</div>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-ultra leading-ultra">
                Elite<br />
                <span className="text-white/20 italic font-light">Pedigree</span>
              </h2>
            </div>

            <p className="text-white/40 text-lg leading-relaxed max-w-md">
              The bridge between algorithmic rigor and physical mastery — a champion's mindset applied to the frontiers of AI.
            </p>

            <div className="space-y-3">
              {[
                { Icon: Trophy, title: 'Medal of Excellence', sub: 'Presidential Honor — Egypt' },
                { Icon: Medal, title: 'Continental Champion', sub: 'African Games Gold' },
                { Icon: Bot, title: 'R!L Research Award', sub: '3rd Place — University of Louisville' },
              ].map((award, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card group flex items-center gap-5 p-5 hover:border-white/20 cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-cyan/10 transition-colors">
                    <award.Icon size={18} className="text-white/40 group-hover:text-accent-cyan transition-colors" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wider">{award.title}</div>
                    <div className="text-[11px] text-white/30 mt-0.5 uppercase tracking-widest">{award.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/[0.06] group">
              <img
                src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200"
                alt="Athletic excellence"
                loading="lazy"
                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-70 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 card p-6 min-w-[160px]"
            >
              <div className="text-5xl font-black tracking-ultra text-white">43+</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-1">Global Honors</div>
            </motion.div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-accent-cyan/5 blur-3xl rounded-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ── Contact Section ───────────────────────────────────────────────────────────
const ContactSection = () => {
  return (
    <section id="contact" className="section-spacing relative">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="max-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <div className="space-y-10">
            <div>
              <div className="section-label mb-4">Get in Touch</div>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-ultra leading-ultra">
                Let's<br />
                <span className="text-gradient">Connect</span>
              </h2>
            </div>
            <p className="text-white/40 text-base max-w-sm leading-relaxed">
              Open to research collaborations, AI engineering roles, and impactful projects.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:ahmedislamfaroukabbas@gmail.com"
                className="card flex items-center gap-4 p-5 hover:border-white/20 group transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/10 transition-colors">
                  <Mail size={18} className="text-white/40 group-hover:text-accent-cyan transition-colors" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Email</div>
                  <div className="text-sm font-medium text-white/80">ahmedislamfaroukabbas@gmail.com</div>
                </div>
                <ArrowUpRight size={16} className="ml-auto text-white/20 group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://linkedin.com/in/ahmedbadr"
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-4 p-5 hover:border-white/20 group transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/10 transition-colors">
                  <LinkedinIcon size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">LinkedIn</div>
                  <div className="text-sm font-medium text-white/80">Ahmed Badr</div>
                </div>
                <ArrowUpRight size={16} className="ml-auto text-white/20 group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://github.com/ahmedislamfarouk"
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-4 p-5 hover:border-white/20 group transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/10 transition-colors">
                  <GithubIcon size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">GitHub</div>
                  <div className="text-sm font-medium text-white/80">ahmedislamfarouk</div>
                </div>
                <ArrowUpRight size={16} className="ml-auto text-white/20 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onSubmit={(e) => e.preventDefault()}
            className="card p-8 md:p-10 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="Research Collaboration / Job Inquiry / Project"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors resize-none placeholder:text-white/20"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full justify-center"
            >
              Send Message <Zap size={14} />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-white/[0.06] py-12 relative">
    <div className="max-container">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-black text-sm">B</span>
          </div>
          <span className="text-sm font-black uppercase tracking-wider text-white/60">Ahmed Badr</span>
        </div>

        <div className="flex items-center gap-4">
          {[
            { Icon: GithubIcon, href: 'https://github.com/ahmedislamfarouk', label: 'GitHub' },
            { Icon: LinkedinIcon, href: 'https://linkedin.com/in/ahmedbadr', label: 'LinkedIn' },
            { Icon: Mail, href: 'mailto:ahmedislamfaroukabbas@gmail.com', label: 'Email' },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-200 cursor-pointer"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/20">
          © 2026 Ahmed Badr
        </div>
      </div>
    </div>
  </footer>
);

// ── App ───────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="bg-base-950 min-h-screen selection:bg-accent-cyan/30 selection:text-white">
      <ScrollProgress />
      <Navigation />

      <main>
        <Hero />
        <ProjectsSection onSelect={setSelectedProject} />
        <LabsSection />
        <AchievementsSection />
        <ContactSection />
      </main>

      <Footer />

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
