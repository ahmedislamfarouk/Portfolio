import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  ExternalLink,
  Rocket,
  Award,
  Microscope,
  Star,
  Mail,
  Sparkles,
  Target,
  Brain,
  Cpu,
  Zap,
  Layers,
  Globe2,
  Trophy,
  Medal,
  ArrowRight,
  Play
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

// Custom SVG Icons for Github/Linkedin
const GithubIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// --- DATA ---
interface Project {
  title: string;
  desc: string;
  tech: string[];
  path: string;
  category: "CV" | "Robotics" | "NLP" | "Medical";
  image: string;
  stats?: { label: string; value: string }[];
}

const projects: Project[] = [
  {
    title: "Renal Rejection Classification",
    desc: "AI-based non-invasive diagnostic system using deep learning for early detection of transplant rejection.",
    tech: ["TensorFlow", "Scikit-learn", "Python", "Medical Imaging"],
    path: "projects/renal-rejection-classification/README.md",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800",
    stats: [{ label: "Accuracy", value: "94.2%" }, { label: "Award", value: "3rd Place" }]
  },
  {
    title: "Autonomous Golf Cart",
    desc: "ROS 2 & YOLOv8 perception suite with ZED 2i stereo depth estimation for autonomous navigation.",
    tech: ["ROS 2", "YOLOv8", "Docker", "ZED 2i"],
    path: "projects/autonomous-golf-cart/README.md",
    category: "Robotics",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    stats: [{ label: "Objects", value: "15+" }, { label: "FPS", value: "30" }]
  },
  {
    title: "SkyVision (Drone Swarms)",
    desc: "Aerial swarm monitoring system for disaster response and infrastructure analysis using multi-agent coordination.",
    tech: ["SWARM", "Perception", "LLM", "Multi-Agent"],
    path: "projects/skyvision-drone-swarm/README.md",
    category: "Robotics",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800",
    stats: [{ label: "Drones", value: "10+" }, { label: "Coverage", value: "5km²" }]
  },
  {
    title: "Sobriety Detection",
    desc: "Real-time impairment tracker using Siamese networks, OpenFace embeddings and gaze analysis.",
    tech: ["Siamese Networks", "OpenFace", "OpenCV", "Real-time"],
    path: "projects/sobriety-detection/README.md",
    category: "CV",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800",
    stats: [{ label: "Latency", value: "<50ms" }, { label: "Accuracy", value: "91%" }]
  }
];

const researchArr = [
  {
    title: "SkyVision: Sensor Fusion",
    status: "Early Preparation",
    desc: "Autonomous drone navigation in disaster scenarios using multi-modal sensor fusion.",
    icon: Rocket
  },
  {
    title: "Multimodal Search Engine",
    status: "In Preparation",
    desc: "Intelligent asset retrieval using BERT embeddings and FAISS vector search.",
    icon: Layers
  },
  {
    title: "Emotion Recognition",
    status: "In Preparation",
    desc: "Joint audio-visual sentiment analysis combining SER and FER models.",
    icon: Brain
  }
];

// --- UTILITY COMPONENTS ---

const MorphingBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-10]">
    <div className="blob w-[900px] h-[900px] bg-accent-blue/15 top-[-300px] left-[-200px]" style={{ animationDelay: '0s' }} />
    <div className="blob w-[800px] h-[800px] bg-accent-emerald/10 bottom-[-200px] right-[-300px]" style={{ animationDelay: '-5s' }} />
    <div className="blob w-[700px] h-[700px] bg-accent-cyan/10 top-[20%] left-[40%]" style={{ animationDelay: '-10s' }} />
  </div>
);

const SectionDivider = () => (
  <div className="flex items-center justify-center gap-4 py-20">
    <div className="h-px w-32 bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent" />
    <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse" />
    <div className="h-px w-32 bg-gradient-to-l from-transparent via-accent-blue/40 to-transparent" />
  </div>
);

const StatCard = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="glass-panel p-10 rounded-4xl text-center group hover:border-accent-blue/50"
  >
    <div className="text-5xl md:text-7xl font-black text-intel-gradient mb-3 tracking-tighter-extra">
      {value}
    </div>
    <div className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-black">{label}</div>
  </motion.div>
);

// --- SECTIONS ---

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Research', 'Projects', 'Achievements', 'Contact'];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'py-4' : 'py-10'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass-panel rounded-full px-10 py-5 flex items-center justify-between ${scrolled ? 'bg-obsidian-900/90' : 'bg-transparent border-transparent'}`}>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center shadow-xl shadow-accent-blue/30">
              <span className="text-white font-black text-sm">AB</span>
            </div>
            <div>
              <div className="text-white font-black tracking-tighter text-lg leading-none mb-1">Ahmed Badr</div>
              <div className="text-accent-emerald text-[10px] uppercase font-black tracking-[0.2em] leading-none">Quantum AI Research</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-white transition-all relative group"
              >
                {item}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com/ahmedislamfarouk"
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-stone-400 hover:text-accent-cyan hover:border-accent-cyan transition-all"
              whileHover={{ y: -2, scale: 1.1 }}
            >
              <GithubIcon size={18} />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/ahmedbadr"
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-stone-400 hover:text-accent-blue hover:border-accent-blue transition-all"
              whileHover={{ y: -2, scale: 1.1 }}
            >
              <LinkedinIcon size={18} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const HeroSection = () => {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="status-badge"
          >
            <Sparkles size={14} className="text-accent-cyan" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-blue">SOTA Research Pipeline Active</span>
          </motion.div>

          <div className="space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-8xl md:text-[10rem] font-black tracking-tighter-extra leading-[0.8]"
            >
              <span className="text-white">Quantum</span>
              <br />
              <span className="text-intel-gradient">Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-2xl text-stone-400 leading-relaxed max-w-xl font-medium"
            >
              Ahmed Badr — Senior Research Engineer focused on <span className="text-white">Computer Vision</span> and{' '}
              <span className="text-accent-emerald">Autonomous Perception</span> systems for high-stakes environments.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            <a href="#projects" className="btn-quantum px-10">
              View Architecture
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#research" className="btn-outline-quantum px-10">
              <Play size={18} className="fill-white" />
              Whitepapers
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          <div className="glass-panel p-5 rounded-5xl border-white/5 bg-white/5 transform perspective-2000 hover:rotate-y-12 transition-all duration-1000">
            <div className="aspect-[4/5] rounded-4xl overflow-hidden grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"
                alt="Ahmed Badr AI Research"
                className="w-full h-full object-cover scale-125 hover:scale-100 transition-transform duration-1000"
              />
            </div>
            
            <div className="absolute -bottom-10 -left-10 glass-panel p-8 rounded-3xl space-y-3 max-w-[280px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/40">
                  <Cpu size={24} className="text-accent-blue" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-500">Core Focus</div>
                  <div className="text-white font-black text-sm">Sensor Fusion v4.2</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AchievementsSection = () => (
  <section id="achievements" className="py-40 relative">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-24">
        <div className="status-badge mb-8 border-accent-emerald/20 bg-accent-emerald/5">
          <Trophy size={16} className="text-accent-emerald" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-emerald">Distinction & Excellence</span>
        </div>
        <h2 className="text-7xl md:text-9xl font-black tracking-tighter-extra text-white">
          Competitive <br />
          <span className="text-intel-gradient">Dominance</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass-panel p-12 md:p-20 rounded-5xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/10 blur-[150px] pointer-events-none" />
          
          <div className="relative z-10 space-y-12">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={28} className="fill-accent-cyan text-accent-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
              ))}
            </div>

            <div className="space-y-8">
              <h3 className="text-5xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter">
                National Champion <br />
                <span className="text-accent-emerald">Elite Athlete</span>
              </h3>
              <p className="text-stone-400 text-2xl leading-relaxed max-w-3xl font-medium">
                Professional Taekwondo athlete representing Egypt with <span className="text-white font-black">43 Major Championship Medals</span>. 
                Awarded the <span className="text-accent-blue font-black underline decoration-accent-blue/30 underline-offset-[12px]">Presidential Medal of Excellence</span> for athletic achievement.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="glass-panel px-8 py-5 rounded-2xl flex items-center gap-6 border-accent-emerald/30 bg-accent-emerald/5">
                <Medal size={40} className="text-accent-emerald" />
                <div>
                  <div className="text-white font-black text-xl">Gold Medalist</div>
                  <div className="text-[10px] uppercase text-stone-500 tracking-[0.2em] font-black">African Games Championship</div>
                </div>
              </div>
              <div className="glass-panel px-8 py-5 rounded-2xl flex items-center gap-6 border-accent-blue/30 bg-accent-blue/5">
                <Award size={40} className="text-accent-blue" />
                <div>
                  <div className="text-white font-black text-xl">Presidential Order</div>
                  <div className="text-[10px] uppercase text-stone-500 tracking-[0.2em] font-black">National Medal of Honor</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-panel p-10 rounded-4xl group glass-panel-hover border-accent-blue/10">
            <GraduationCap size={48} className="text-accent-blue mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all" />
            <h4 className="text-3xl font-black text-white mb-2 tracking-tight">AI Engineering</h4>
            <p className="text-stone-500 font-black uppercase text-[10px] tracking-[0.3em]">Alamein International University</p>
          </div>
          <div className="glass-panel p-10 rounded-4xl group glass-panel-hover border-accent-emerald/10">
            <Layers size={48} className="text-accent-emerald mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all" />
            <h4 className="text-3xl font-black text-white mb-2 tracking-tight">Venture Lab</h4>
            <p className="text-stone-500 font-black uppercase text-[10px] tracking-[0.3em]">Founder @ Nomeda AI</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState('All');
  const categories = ['All', 'Robotics', 'NLP', 'Medical', 'CV'];

  const filteredProjects = activeTab === 'All' ? projects : projects.filter(p => p.category === activeTab);

  return (
    <section id="projects" className="py-40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
          <div>
            <div className="status-badge mb-8">
              <Rocket size={16} className="text-accent-blue" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-blue">Engineering Portfolio</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter-extra text-white leading-none">
              Technical <span className="text-intel-gradient">Systems</span>
            </h2>
          </div>

          <div className="glass-panel p-2 rounded-full flex flex-wrap gap-1 border-white/5 bg-white/5">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${
                  activeTab === tab
                    ? 'bg-accent-blue text-white shadow-2xl shadow-accent-blue/40'
                    : 'text-stone-500 hover:text-stone-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer"
              >
                <div className="glass-panel rounded-5xl overflow-hidden glass-panel-hover border-white/5 bg-obsidian-900/40">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />
                    
                    <div className="absolute top-8 right-8 glass-panel px-5 py-2.5 rounded-full border-white/20">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{project.category}</span>
                    </div>
                  </div>

                  <div className="p-12 space-y-10">
                    <div>
                      <h3 className="text-4xl font-black text-white mb-5 group-hover:text-accent-cyan transition-colors tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-stone-400 font-medium text-lg leading-relaxed">
                        {project.desc}
                      </p>
                    </div>

                    <div className="flex gap-10 border-t border-white/5 pt-10">
                      {project.stats?.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-accent-emerald text-2xl font-black tracking-tight">{stat.value}</div>
                          <div className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 group-hover:border-accent-blue/30 group-hover:text-accent-blue transition-all">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ResearchSection = () => (
  <section id="research" className="py-40 relative">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-24">
        <div className="status-badge mb-8 border-accent-emerald/20 bg-accent-emerald/5">
          <Microscope size={16} className="text-accent-emerald" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-emerald">Quantum Research Lab</span>
        </div>
        <h2 className="text-7xl md:text-9xl font-black tracking-tighter-extra text-white leading-none">
          Active <br />
          <span className="bg-gradient-to-br from-accent-emerald via-accent-cyan to-accent-blue bg-clip-text text-transparent">Whitepapers</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {researchArr.map((research, index) => (
          <motion.div
            key={research.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="glass-panel p-12 rounded-4xl group glass-panel-hover border-white/5 bg-obsidian-900/40"
          >
            <div className="w-20 h-20 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <research.icon size={40} className="text-accent-emerald" />
            </div>

            <div className="inline-block px-5 py-2 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent-emerald mb-8">
              {research.status}
            </div>

            <h3 className="text-3xl font-black text-white mb-5 tracking-tight">{research.title}</h3>
            <p className="text-stone-400 font-medium text-lg leading-relaxed">{research.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="py-40 relative">
    <div className="max-w-7xl mx-auto px-6">
      <div className="glass-panel p-16 md:p-32 rounded-5xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/15 via-transparent to-accent-emerald/15 pointer-events-none" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-16">
            <div className="space-y-8">
              <h2 className="text-7xl font-black tracking-tighter-extra text-white leading-[0.85]">
                Initiate <br />
                <span className="text-intel-gradient">Sync</span>
              </h2>
              <p className="text-2xl text-stone-400 font-medium leading-relaxed max-w-md">
                Deploying intelligent solutions for next-generation industries. Available for select research initiatives.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center border-accent-blue/30 group-hover:border-accent-blue group-hover:scale-110 transition-all">
                  <Mail size={28} className="text-accent-blue" />
                </div>
                <span className="text-white font-black text-xl tracking-tight">ahmedislamfaroukabbas@gmail.com</span>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center border-accent-emerald/30 group-hover:border-accent-emerald group-hover:scale-110 transition-all">
                  <Globe2 size={28} className="text-accent-emerald" />
                </div>
                <span className="text-stone-400 font-black text-xl tracking-tight">Distributed Research Node</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <a href="mailto:ahmedislamfaroukabbas@gmail.com" className="btn-quantum px-12 py-5 text-lg">Send Signal</a>
              <a href="https://linkedin.com/in/ahmedbadr" className="btn-outline-quantum px-12 py-5 text-lg">
                <LinkedinIcon size={24} />
                LinkedIn
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {[
              { icon: Brain, label: 'Vision AI', value: 'SOTA' },
              { icon: Cpu, label: 'Robotics', value: 'Nexus' },
              { icon: Zap, label: 'Sensor Fusion', value: 'Core' },
              { icon: Award, label: 'Strategy', value: 'Elite' },
            ].map((skill) => (
              <div key={skill.label} className="glass-panel p-10 rounded-4xl text-center group hover:border-accent-blue/40 transition-all duration-500">
                <skill.icon size={40} className="text-accent-cyan mx-auto mb-6 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
                <div className="text-white font-black text-lg mb-2 tracking-tight">{skill.label}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">{skill.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-24 border-t border-white/5 bg-obsidian-950/50 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center shadow-2xl shadow-accent-blue/20">
          <span className="text-white font-black text-lg">AB</span>
        </div>
        <div>
          <div className="text-white font-black tracking-tight text-xl">Ahmed Badr</div>
          <div className="text-accent-emerald text-[10px] uppercase font-black tracking-[0.3em]">Quantum Intelligence Architect</div>
        </div>
      </div>

      <div className="text-stone-600 text-[10px] font-black uppercase tracking-[0.4em]">
        © 2026 AHMED BADR // ALL SYSTEMS OPERATIONAL
      </div>

      <div className="flex gap-8">
        {[GithubIcon, LinkedinIcon, Mail].map((Icon, i) => (
          <a key={i} href="#" className="text-stone-500 hover:text-accent-cyan transition-all duration-300 transform hover:scale-125">
            <Icon size={22} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

// --- MAIN APP ---

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-obsidian-950 text-white selection:bg-accent-blue/30 selection:text-accent-cyan selection:backdrop-blur-md">
      <MorphingBlobs />
      
      {/* Dynamic Grid Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100px_100px] opacity-[0.05] pointer-events-none" />
      
      {/* Subtle Noise Texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <NavBar />
      
      <main className="relative z-10">
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="43" label="Elite Medals" delay={0} />
            <StatCard value="12" label="Research Nodes" delay={0.1} />
            <StatCard value="05" label="Active Swarms" delay={0.2} />
            <StatCard value="SOTA" label="Performance" delay={0.3} />
          </div>
        </div>

        <SectionDivider />
        <AchievementsSection />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <ResearchSection />
        <SectionDivider />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
