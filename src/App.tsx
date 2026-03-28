import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Rocket,
  Mail,
  Target,
  Brain,
  Cpu,
  Trophy,
  Medal,
  Menu,
  X,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { projects, type Project } from './data/projects';

// Custom SVG Icons for Github/Linkedin since they might be missing in this version
const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const labs = [
  {
    title: "Computer Vision",
    description: "SOTA object detection and segmentation for dynamic environments.",
    icon: Target
  },
  {
    title: "Sensor Fusion",
    description: "Lidar, Radar, and Camera integration for autonomous navigation.",
    icon: Zap
  },
  {
    title: "Deep NLP",
    description: "Large Language Model fine-tuning for specialized knowledge domains.",
    icon: Brain
  },
  {
    title: "Robotics Control",
    description: "ROS2-based low-level control systems and path planning.",
    icon: Cpu
  }
];

// --- COMPONENTS ---

const ProjectModal = ({ project, onClose }: { project: Project | null, onClose: () => void }) => {
  if (!project) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center p-6 md:p-12"
    >
      <div className="absolute inset-0 bg-base-950/95 backdrop-blur-3xl" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-6xl bg-base-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
        >
          <X size={24} />
        </button>

        <div className="md:w-1/2 h-64 md:h-auto relative">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-base-950/90 via-base-950/20 to-transparent" />
          <div className="absolute bottom-12 left-12">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">{project.year} // {project.category}</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-4 leading-none">{project.title}</h2>
          </div>
        </div>

        <div className="md:w-1/2 p-12 md:p-20 overflow-y-auto no-scrollbar bg-base-900">
          <div className="space-y-16">
            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-muted flex items-center gap-4">
                <span className="h-px w-8 bg-accent-subtle" />
                Operational Overview
              </h4>
              <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed">
                {project.description}
              </p>
            </section>

            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-muted flex items-center gap-4">
                <span className="h-px w-8 bg-accent-subtle" />
                Core Contributions
              </h4>
              <ul className="space-y-6">
                {project.details.map((detail, i) => (
                  <li key={i} className="flex gap-6 text-sm font-black uppercase tracking-widest leading-loose text-white/40 group">
                    <span className="text-white group-hover:text-accent-blue transition-colors">0{i+1}</span>
                    <span className="group-hover:text-white transition-colors">{detail}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-muted flex items-center gap-4">
                <span className="h-px w-8 bg-accent-subtle" />
                Stack Architecture
              </h4>
              <div className="flex flex-wrap gap-3">
                {project.tech.map(t => (
                  <span key={t} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all cursor-default">{t}</span>
                ))}
              </div>
            </section>

            <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black italic tracking-tighter text-white">{project.stats}</div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20">
                    <div className="status-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-accent-blue">Active Node</span>
                  </div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-muted flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  Status: {project.status}
                </div>
              </div>
              {project.link ? (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-white text-black font-black uppercase tracking-tighter rounded-full text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-3 w-full sm:w-auto justify-center"
                >
                  Access Artifacts <ArrowUpRight size={16} strokeWidth={3} />
                </a>
              ) : (
                <button className="px-10 py-4 bg-white/5 text-white/20 font-black uppercase tracking-tighter rounded-full text-xs cursor-not-allowed border border-white/5 w-full sm:w-auto">
                  Secure Access
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-white z-[600] origin-left"
      style={{ scaleX }}
    />
  );
};

const ResearchRadar = () => {
  const points = [
    { label: 'Vision', x: 100, y: 20 },
    { label: 'Fusion', x: 180, y: 80 },
    { label: 'NLP', x: 150, y: 170 },
    { label: 'Control', x: 50, y: 170 },
    { label: 'Swarm', x: 20, y: 80 },
  ];

  return (
    <div className="relative w-64 h-64 mx-auto mb-12 group">
      <svg viewBox="0 0 200 200" className="w-full h-full rotate-[-18deg]">
        {/* Background Grids */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((r) => (
          <polygon
            key={r}
            points={points.map(p => `${100 + (p.x - 100) * r},${100 + (p.y - 100) * r}`).join(' ')}
            className="radar-grid"
          />
        ))}
        {/* Axes */}
        {points.map((p, i) => (
          <line key={i} x1="100" y1="100" x2={p.x} y2={p.y} className="radar-grid opacity-20" />
        ))}
        {/* Data Area */}
        <motion.polygon
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          points={points.map(p => `${100 + (p.x - 100) * 0.9},${100 + (p.y - 100) * 0.85}`).join(' ')}
          className="radar-area group-hover:fill-accent-blue/40 transition-colors duration-500"
        />
      </svg>
      {/* Labels */}
      {points.map((p, i) => (
        <div
          key={i}
          className="absolute text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/60 transition-colors"
          style={{ 
            left: `${(p.x / 200) * 100}%`, 
            top: `${(p.y / 200) * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {p.label}
        </div>
      ))}
    </div>
  );
};

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[400] transition-all duration-700 ${scrolled ? 'py-4' : 'py-10'}`}>
        <div className="max-container">
          <div className={`flex items-center justify-between p-2 rounded-full transition-all duration-700 ${scrolled ? 'bg-base-900/80 backdrop-blur-2xl border border-white/5 px-8 shadow-2xl' : 'bg-transparent border-transparent'}`}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-black font-black text-xl tracking-tighter uppercase select-none">B</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-black tracking-tighter uppercase select-none">Badr</span>
                <div className="flex items-center gap-2 mt-[-4px]" aria-live="polite">
                  <div className="status-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-accent-blue">Live System</span>
                </div>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center gap-12">
              {['About', 'Projects', 'Awards', 'Labs', 'Contact'].map((item, i) => (
                <motion.a 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-white transition-all duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <a href="#contact" className="hidden md:block text-[10px] font-black uppercase tracking-[0.4em] bg-white text-black px-10 py-3.5 rounded-full hover:bg-white/90 transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                Sync Project
              </a>
              <button className="text-white p-2 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-base-950/98 backdrop-blur-3xl z-[300] flex flex-col items-center justify-center p-12 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full noise-bg opacity-[0.03] pointer-events-none" />
              <div className="space-y-8 text-center relative z-10">
                {['About', 'Projects', 'Awards', 'Labs', 'Contact'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <a 
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                      className="text-6xl sm:text-8xl font-black tracking-tighter-extra uppercase hover:italic transition-all duration-500 block"
                    >
                      {item}
                    </a>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-12 left-0 w-full px-12 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] text-white/30"
              >
                <div>Ahmed Badr // 2026</div>
                <div className="flex gap-10">
                   <a href="#" className="hover:text-white transition-colors">Github</a>
                   <a href="#" className="hover:text-white transition-colors">Linkedin</a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

const Hero = () => {
  return (
    <section id="about" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/src/assets/hero.png" className="w-full h-full object-cover opacity-10 grayscale brightness-50" alt="Hero Background" />
        <div className="absolute inset-0 bg-gradient-to-b from-base-950/90 via-transparent to-base-950" />
      </div>
      
      <div className="max-container relative z-10 section-spacing">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="backdrop-blur-3xl bg-white/5 border border-white/10 p-8 md:p-24 rounded-[3rem] md:rounded-[4rem] shadow-2xl transition-all duration-700 hover:border-white/20 group relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <span className="h-px w-12 md:w-16 bg-white/20 group-hover:w-24 group-hover:bg-accent-blue transition-all duration-700" />
              <motion.span 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/40 group-hover:text-white transition-colors duration-500"
              >
                Intelligence // Performance // Discipline
              </motion.span>
            </div>

            <h1 className="text-5xl md:text-[12rem] leading-[0.85] md:leading-[0.8] mb-8 md:mb-12 select-none tracking-tighter-extra">
              Ahmed <br />
              <span className="text-white/20 italic font-light transition-all duration-1000 group-hover:text-white group-hover:not-italic">Badr</span>
            </h1>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-end pt-8 md:pt-12">
              <div className="space-y-8 md:space-y-10">
                <p className="text-xl md:text-3xl text-white/60 font-light leading-relaxed max-w-xl">
                  Engineering the nexus of <span className="text-white font-medium">Sentient Vision</span> and <span className="text-white">Autonomous Control</span>. SOTA research engineer and professional champion.
                </p>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <a href="#projects" className="btn-monochrome flex items-center gap-3 !px-8 !py-4 md:!px-10 md:!py-5">
                    Experience Artifacts
                    <ArrowUpRight size={20} strokeWidth={3} />
                  </a>
                  <a href="#labs" className="btn-outline-monochrome !px-8 !py-4 md:!px-10 md:!py-5">
                    The Lab
                  </a>
                </div>
              </div>

              <div className="flex gap-8 md:gap-16 justify-start lg:justify-end pb-4 border-l lg:border-l-0 lg:border-t border-white/10 pt-12 lg:pt-0 lg:pl-0 pl-8">
                <div className="space-y-2 md:space-y-3">
                  <div className="text-5xl md:text-8xl font-black italic tracking-tighter text-white">43+</div>
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Global Honors</div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="text-5xl md:text-8xl font-black italic tracking-tighter text-white">AI</div>
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Core Pillar</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </motion.div>
      </div>
      
      <div className="absolute inset-0 noise-bg opacity-[0.07] pointer-events-none" />
    </section>
  );
};


const LabsGrid = () => {
  return (
    <section id="labs" className="section-spacing bg-base-950">
      <div className="max-container">
        <div className="text-center mb-24 md:mb-40 space-y-6 md:space-y-8">
           <h2 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter-extra leading-none text-white">Research <span className="text-luxury italic">Nodes</span></h2>
           <p className="text-white/40 max-w-xl mx-auto text-[10px] font-black uppercase tracking-[0.6em]">Core domains of algorithmic exploration and optimization.</p>
        </div>

        <ResearchRadar />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {labs.map((lab, i) => (
            <motion.div 
              key={lab.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-12 md:p-16 border border-white/5 hover:border-white/20 transition-all bg-base-900/30 group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-sm"
            >
              <div className="relative z-10 space-y-12 md:space-y-16">
                <lab.icon size={48} md:size={56} strokeWidth={1} className="text-white/30 group-hover:text-white group-hover:scale-110 transition-all duration-700" />
                <div className="space-y-4 md:space-y-6">
                  <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">{lab.title}</h4>
                  <p className="text-white/40 text-xs font-black uppercase tracking-widest leading-loose group-hover:text-white/60 transition-colors">{lab.description}</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-all duration-1000 translate-y-8 group-hover:translate-y-0">
                <lab.icon size={120} md:size={160} strokeWidth={0.5} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Achievements = () => {
  return (
    <section id="awards" className="section-spacing bg-base-950 relative overflow-hidden">
      <div className="max-container grid lg:grid-cols-2 gap-16 lg:gap-40 items-center">
        <div className="space-y-12 md:space-y-24">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-6 md:gap-8 text-white/30">
              <span className="h-px w-12 md:w-20 bg-white/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">Distinction & Legacy</span>
            </div>
            <h2 className="text-6xl md:text-[11rem] font-black tracking-tighter-extra uppercase leading-[0.8] md:leading-[0.75] mb-8 md:mb-12 text-white">Elite <br /><span className="text-luxury italic font-light">Pedigree</span></h2>
          </div>
          
          <p className="text-2xl md:text-4xl text-white/40 font-light leading-relaxed max-w-2xl">
            The bridge between algorithmic rigor and physical mastery. A champion's mindset applied to the frontiers of Artificial Intelligence.
          </p>

          <div className="grid gap-6 md:gap-8">
            {[
              { title: "Medal of Excellence", sub: "Presidential Honor of Egypt", Icon: Trophy },
              { title: "Continental Champion", sub: "African Games Gold Performance", Icon: Medal }
            ].map((award, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 20 }}
                className="flex items-center gap-8 md:gap-12 p-8 md:p-12 border border-white/5 hover:border-white/20 bg-base-900/50 backdrop-blur-md transition-all group rounded-[2rem] md:rounded-[2.5rem]"
              >
                <award.Icon className="text-white/20 group-hover:text-white group-hover:scale-110 transition-all" size={40} md:size={56} strokeWidth={1} />
                <div>
                  <h4 className="text-xl md:text-3xl font-black uppercase tracking-tighter">{award.title}</h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-white/60 transition-colors mt-2 md:mt-3">{award.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative group mt-12 lg:mt-0">
          <div className="aspect-[4/5] rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out shadow-2xl">
            <img src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200" alt="Athletic Excellence" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-transparent to-transparent opacity-80" />
          </div>
          <div className="absolute -bottom-12 md:-bottom-16 -left-6 md:-left-16 bg-base-900 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden p-10 md:p-16 max-w-[240px] md:max-w-xs space-y-6 md:space-y-8 shadow-2xl backdrop-blur-2xl">
             <div className="text-6xl md:text-8xl font-black italic tracking-tighter text-white">43+</div>
             <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] leading-relaxed text-white/40">Accumulated accolades across international & national championship circuits.</p>
          </div>
          <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-[4rem] z-[-1] group-hover:bg-white/10 transition-colors" />
        </div>
      </div>
    </section>
  );
};


const Contact = () => {
  return (
    <section id="contact" className="section-spacing bg-base-950 relative overflow-hidden">
      <div className="max-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-32">
          <div className="space-y-12 md:space-y-20">
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-6xl md:text-[11rem] font-black uppercase tracking-tighter-extra leading-[0.8] md:leading-[0.75] text-white">
                Start <br /><span className="text-luxury italic font-light">Terminal</span>
              </h2>
              <p className="text-2xl md:text-3xl text-white/40 font-light max-w-md leading-relaxed">
                Initiate a secure connection for project inquiries, research collaborations, or architectural consultations.
              </p>
            </div>

            <div className="space-y-8 md:space-y-12">
              <div className="flex items-center gap-6 md:gap-8 group cursor-pointer">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Mail size={20} md:size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Direct Email</div>
                  <div className="text-lg md:text-2xl font-bold group-hover:tracking-wider transition-all duration-500 truncate max-w-[250px] md:max-w-none">ahmedislamfaroukabbas@gmail.com</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 md:gap-8 group cursor-pointer">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Target size={20} md:size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Location</div>
                  <div className="text-lg md:text-2xl font-bold group-hover:tracking-wider transition-all duration-500">Cairo, Egypt // Global Remote</div>
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-6 md:space-y-8 bg-base-900/30 p-8 md:p-20 rounded-[3rem] md:rounded-[4rem] border border-white/5 backdrop-blur-3xl relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-3">
                <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 ml-6">Identity</label>
                <input id="name" type="text" placeholder="Full Name" className="w-full bg-base-950 border border-white/10 rounded-full px-8 md:px-10 py-4 md:py-5 focus:outline-none focus:border-white transition-all text-sm uppercase tracking-widest placeholder:text-white/10" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 ml-6">Gateway</label>
                <input id="email" type="email" placeholder="Email Address" className="w-full bg-base-950 border border-white/10 rounded-full px-8 md:px-10 py-4 md:py-5 focus:outline-none focus:border-white transition-all text-sm uppercase tracking-widest placeholder:text-white/10" />
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 ml-6">Objective</label>
              <input id="subject" type="text" placeholder="Subject / Project Type" className="w-full bg-base-950 border border-white/10 rounded-full px-8 md:px-10 py-4 md:py-5 focus:outline-none focus:border-white transition-all text-sm uppercase tracking-widest placeholder:text-white/10" />
            </div>
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 ml-6">Transmission</label>
              <textarea id="message" rows={4} md:rows={5} placeholder="Detailed Message..." className="w-full bg-base-950 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] px-8 md:px-10 py-6 md:py-8 focus:outline-none focus:border-white transition-all resize-none text-sm uppercase tracking-widest placeholder:text-white/10"></textarea>
            </div>
            <button className="w-full py-5 md:py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-xs shadow-2xl shadow-white/5">
              Transmit Data <Zap size={18} fill="black" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer id="footer" className="section-spacing bg-base-950 border-t border-white/5 relative overflow-hidden">
    <div className="max-container text-center space-y-24 md:space-y-40 relative z-10">
      <div className="space-y-12">
        <h2 className="text-[14vw] md:text-[20rem] font-black tracking-tighter-extra uppercase leading-[0.7] select-none text-white/5">
          Build <br /><span className="text-white/10">Together</span>
        </h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-16 md:gap-24 items-center pt-12 md:pt-24 border-t border-white/5">
        <div className="text-left space-y-4 md:space-y-6">
          <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30">Encrypted Communication</div>
          <a href="mailto:ahmedislamfaroukabbas@gmail.com" className="text-2xl md:text-3xl font-black hover:text-white transition-all duration-500 italic block text-white/60">Contact Gateway</a>
        </div>
        
        <div className="flex justify-center gap-8 md:gap-12">
           {[
             { Icon: GithubIcon, link: "https://github.com/ahmedislamfarouk", label: "GH" },
             { Icon: LinkedinIcon, link: "https://linkedin.com/in/ahmedbadr", label: "LI" },
             { Icon: Mail, link: "mailto:ahmedislamfaroukabbas@gmail.com", label: "ML" }
           ].map((social, i) => (
             <motion.a 
               key={i} 
               href={social.link}
               whileHover={{ scale: 1.2, y: -8 }}
               className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-700 group relative"
             >
               <social.Icon size={24} md:size={28} strokeWidth={1.5} />
               <span className="absolute -bottom-10 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">{social.label}</span>
             </motion.a>
           ))}
        </div>

        <div className="text-right space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30">Status: Operational</div>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed">
            © 2026 // AHMED BADR <br />
            ARCHITECTURE // INTELLIGENCE // PERFORMANCE
          </p>
        </div>
      </div>
    </div>
    <div className="absolute bottom-[-10vw] left-1/2 -translate-x-1/2 text-[30vw] font-black text-white/[0.02] tracking-tighter-extra leading-none pointer-events-none uppercase">BADR</div>
  </footer>
);


const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="selection:bg-white selection:text-black bg-base-950 min-h-screen">
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <section id="projects" className="section-spacing bg-base-900/20 relative overflow-hidden">
          <div className="max-container relative z-10">
            <div className="flex flex-col lg:grid lg:grid-cols-2 justify-between items-end gap-12 lg:gap-24 mb-24 md:mb-48">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8 md:space-y-12"
              >
                <div className="flex items-center gap-6 md:gap-8 text-white/30">
                  <span className="h-px w-12 md:w-20 bg-white/10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.6em]">Project Synthesis</span>
                </div>
                <h2 className="text-6xl md:text-[11rem] font-black tracking-tighter-extra uppercase leading-[0.8] md:leading-[0.75] text-white">
                  Operational <br /><span className="text-luxury italic font-light">Artifacts</span>
                </h2>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8 md:space-y-10 border-l border-white/10 pl-8 md:pl-16 py-4 md:py-8"
              >
                <p className="text-white/40 max-w-md text-sm font-black uppercase tracking-[0.4em] leading-relaxed">
                  Deployment of advanced neural architectures across medical, robotic, and multi-agent domains. Each system is engineered for maximum operational integrity and deterministic performance.
                </p>
                <div className="flex gap-6">
                  <Rocket size={20} md:size={24} className="text-white/20" />
                  <Zap size={20} md:size={24} className="text-white/20" />
                  <Brain size={20} md:size={24} className="text-white/20" />
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
              {projects.slice(0, 3).map((project, idx) => (
                <motion.div 
                  key={project.title}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${project.title}`}
                  whileHover={{ y: -20 }}
                  className={`${idx === 0 ? 'lg:col-span-2' : 'lg:col-span-1'} bg-base-900 border border-white/5 rounded-[3rem] md:rounded-[4rem] overflow-hidden relative aspect-video lg:aspect-auto min-h-[500px] md:min-h-[600px] group cursor-pointer transition-all duration-700 outline-none focus-visible:ring-2 focus-role:ring-accent-blue`}
                >
                  <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[1.5s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/40 to-transparent opacity-80" />
                  <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <div className="px-6 py-2.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.4em] text-white">{idx === 0 ? 'Featured Deployment' : 'Project Node'}</div>
                       <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                          <ArrowUpRight size={24} md:size={32} strokeWidth={3} />
                       </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 md:gap-8">
                      <div className="space-y-4 md:space-y-6">
                        <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-white/40">{project.category}</span>
                        <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white">{project.title}</h3>
                      </div>
                      <div className="text-3xl md:text-5xl font-black italic text-white/10 group-hover:text-white/40 transition-colors whitespace-nowrap">{project.stats}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-8 md:mt-10">
              {projects.slice(3).map((project) => (
                <motion.div 
                  key={project.title}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${project.title}`}
                  whileHover={{ y: -15 }}
                  className="bg-base-900 border border-white/5 rounded-[3rem] md:rounded-[4rem] overflow-hidden relative aspect-square group cursor-pointer transition-all duration-700 shadow-2xl outline-none focus-visible:ring-2 focus-role:ring-accent-blue"
                >
                  <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[1.5s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/20 to-transparent p-10 md:p-12 flex flex-col justify-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-3 md:mb-4">{project.category}</span>
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none text-white">{project.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <LabsGrid />
        <Achievements />
        <Contact />
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
