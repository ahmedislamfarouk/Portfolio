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

// --- DATA ---
const projects = [
  {
    title: "Renal Rejection AI",
    category: "Medical Diagnostics / Deep Learning",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200",
    stats: "3rd Place @ R!L",
    year: "2024",
    description: "A non-invasive approach to classify renal rejection grades in kidney transplant patients. Developed during a research internship at the University of Louisville bioengineering labs.",
    details: [
      "Integrated imaging, genomic, and clinical data for multi-modal classification.",
      "Implemented Random Forest, SVM, Neural Networks, XGBoost, and CatBoost.",
      "Performed extensive cross-validation and hyperparameter tuning.",
      "Awarded 3rd Place at the R!L competition for research excellence."
    ],
    tech: ["TensorFlow", "Scikit-learn", "XGBoost", "CatBoost", "OpenCV", "Pandas"]
  },
  {
    title: "Autonomous Fleet",
    category: "Robotics / Perception",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200",
    stats: "YOLOv8 + ROS 2",
    year: "2024",
    description: "Developed a ROS 2–based perception and control system for autonomous golf cart navigation at James Madison University.",
    details: [
      "Implemented YOLOv8 & SSD algorithms for robust real-time object detection.",
      "Utilized ZED 2i stereo camera for depth estimation and obstacle detection.",
      "Designed modular ROS 2 publisher–subscriber nodes for system planning.",
      "Achieved sub-100ms latency for high-performance responsiveness."
    ],
    tech: ["ROS 2", "YOLOv8", "Docker", "ZED SDK", "C++", "Python"]
  },
  {
    title: "SkyVision Swarm",
    category: "Multi-Agent Systems / Fusion",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200",
    stats: "Real-time Fusion",
    year: "2023",
    description: "AI-powered aerial monitoring and vision system designed for real-time environmental analysis using drone swarms.",
    details: [
      "Designing ROS 2-based multi-drone control and CV pipelines.",
      "Implementing collision avoidance with modular perception nodes.",
      "Integrating LLM-assisted situational analysis for anomaly detection.",
      "Building a real-time sensor fusion pipeline for disaster response."
    ],
    tech: ["ROS 2", "Computer Vision", "LLMs", "C++", "Python", "Sensor Fusion"]
  },
  {
    title: "Emotion Recog",
    category: "Multimodal AI (SER & FER)",
    image: "https://images.unsplash.com/photo-1527433270404-21b12746a108?w=1200",
    stats: "SER + FER Fusion",
    year: "2024",
    description: "Comprehensive AI framework focused on Speech Emotion Recognition (SER) and Facial Emotion Recognition (FER) systems.",
    details: [
      "Leveraging deep learning architectures for high-accuracy classification.",
      "Exploring RAG pipelines with vector databases for enhanced reasoning.",
      "Joint analysis of audio and visual cues for robustness.",
      "Collaborating on developing the core emotion monitoring framework."
    ],
    tech: ["PyTorch", "TensorFlow", "OpenCV", "Vector Databases", "RAG", "Multimodal Fusion"]
  },
  {
    title: "Sobriety Detection",
    category: "Computer Vision / Health",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=1200",
    stats: "JMU Research",
    year: "2024",
    description: "Specialized AI platform built to detect intoxication levels through non-invasive facial recognition and behavioral analysis.",
    details: [
      "Built a modular pipeline using Siamese Networks for user profiling.",
      "Developed eye-tracking algorithms with OpenFace (288+ features).",
      "Implemented facial behavior analysis for intoxication detection.",
      "Designed a comprehensive CSV-based data export system for research."
    ],
    tech: ["Python", "OpenCV", "OpenFace", "Siamese Networks", "Deep Learning"]
  },
  {
    title: "Snake Game AI",
    category: "Reinforcement Learning",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200",
    stats: "Q-Learning / DQN",
    year: "2023",
    description: "Enhanced version of the classic Snake game featuring AI-driven opponents and real-time multiplayer gameplay.",
    details: [
      "Implemented Reinforcement Learning algorithms (Q-Learning / DQN).",
      "Designed advanced decision-making systems for AI opponents.",
      "Utilized threading and concurrency for zero-latency interactions.",
      "Integrated networking components for synchronized multiplayer."
    ],
    tech: ["Python", "Pygame", "Reinforcement Learning", "Socket Programming", "Threading"]
  }
];

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

const ProjectModal = ({ project, onClose }: { project: typeof projects[0] | null, onClose: () => void }) => {
  if (!project) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-6 md:p-12"
    >
      <div className="absolute inset-0 bg-base-950/90 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl bg-base-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
        >
          <X size={24} />
        </button>

        <div className="md:w-1/2 h-64 md:h-auto relative">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-base-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-muted">{project.year} // {project.category}</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-4">{project.title}</h2>
          </div>
        </div>

        <div className="md:w-1/2 p-12 md:p-16 overflow-y-auto no-scrollbar">
          <div className="space-y-12">
            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-muted flex items-center gap-4">
                <span className="h-px w-8 bg-accent-subtle" />
                Operational Overview
              </h4>
              <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed">
                {project.description}
              </p>
            </section>

            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-muted flex items-center gap-4">
                <span className="h-px w-8 bg-accent-subtle" />
                Core Contributions
              </h4>
              <ul className="space-y-4">
                {project.details.map((detail, i) => (
                  <li key={i} className="flex gap-4 text-sm font-black uppercase tracking-widest leading-loose text-white/60">
                    <span className="text-white">0{i+1}</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-muted flex items-center gap-4">
                <span className="h-px w-8 bg-accent-subtle" />
                Stack Architecture
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </section>

            <div className="pt-12 border-t border-white/5 flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-3xl font-black italic tracking-tighter">{project.stats}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-accent-muted">Status: Deployed</div>
              </div>
              <button className="px-8 py-3 bg-white text-black font-bold rounded-full text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Access Artifacts
              </button>
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
      className="fixed top-0 left-0 right-0 h-[2px] bg-white z-[200] origin-left"
      style={{ scaleX }}
    />
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
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled ? 'py-4' : 'py-10'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className={`flex items-center justify-between p-2 rounded-full transition-all duration-700 ${scrolled ? 'bg-base-900/80 backdrop-blur-2xl border border-white/5 px-8 shadow-2xl' : 'bg-transparent border-transparent'}`}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <span className="text-2xl font-black tracking-tighter uppercase select-none">Badr</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-12">
              {['About', 'Projects', 'Awards', 'Labs'].map((item, i) => (
                <motion.a 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-muted hover:text-white transition-all duration-300 relative group"
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
              <a href="#contact" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black px-10 py-3.5 rounded-full hover:bg-accent-muted hover:text-white transition-all duration-500 transform hover:scale-105 active:scale-95">
                Sync Project
              </a>
              <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
              animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
              exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
              className="fixed inset-0 bg-base-950 z-[-1] flex flex-col items-center justify-center gap-12 md:hidden"
            >
              {['About', 'Projects', 'Awards', 'Labs', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-6xl font-black tracking-tighter uppercase hover:text-accent-muted transition-colors"
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

const Hero = () => {
  return (
    <section id="about" className="min-h-screen relative flex flex-col justify-center pt-32 overflow-hidden px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10"
        >
          <div className="flex items-center gap-6 text-accent-muted">
            <span className="h-px w-16 bg-accent-subtle" />
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[10px] font-black uppercase tracking-[0.4em]"
            >
              Intelligence // Performance // Discipline
            </motion.span>
          </div>
          
          <h1 className="text-[15vw] md:text-[13rem] leading-[0.75] font-black uppercase tracking-tighter-extra">
            Ahmed <br />
            <span className="text-luxury">Badr</span>
          </h1>

          <div className="grid lg:grid-cols-2 gap-20 pt-10">
            <div className="space-y-8">
              <p className="text-2xl md:text-4xl text-accent-muted font-light leading-[1.1] max-w-3xl">
                Engineering the nexus of <span className="text-white italic">Sentient Vision</span> and <span className="text-white">Autonomous Control</span>. SOTA research engineer and professional champion.
              </p>
              <div className="flex gap-4">
                 <button className="px-10 py-4 bg-white text-black font-bold rounded-full transition-all hover:scale-105 active:scale-95">Experience Artifacts</button>
                 <button className="px-10 py-4 border border-accent-muted text-white font-bold rounded-full transition-all hover:border-white hover:bg-white/5">The Lab</button>
              </div>
            </div>
            
            <div className="flex items-end justify-start lg:justify-end gap-16">
              <div className="space-y-2">
                <div className="text-7xl font-black italic tracking-tighter">43+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-muted">Global Honors</div>
              </div>
              <div className="space-y-2">
                <div className="text-7xl font-black italic tracking-tighter">AI</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-muted">Core Foundation</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 noise-bg opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 z-0"
      />
    </section>
  );
};

const LabsGrid = () => {
  return (
    <section id="labs" className="py-40 px-6 md:px-12 bg-base-950">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-32 space-y-6">
           <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter">Research <span className="text-luxury">Nodes</span></h2>
           <p className="text-accent-muted max-w-xl mx-auto text-[10px] font-black uppercase tracking-[0.4em]">Core domains of algorithmic exploration and optimization.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {labs.map((lab, i) => (
            <motion.div 
              key={lab.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 border border-white/5 hover:border-white/20 transition-all bg-base-900 group relative overflow-hidden"
            >
              <div className="relative z-10 space-y-12">
                <lab.icon size={48} className="text-accent-muted group-hover:text-white transition-colors duration-500" />
                <div className="space-y-4">
                  <h4 className="text-2xl font-black uppercase tracking-tighter">{lab.title}</h4>
                  <p className="text-accent-muted text-xs font-black uppercase tracking-widest leading-loose">{lab.description}</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <lab.icon size={120} />
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
    <section id="awards" className="py-40 px-6 md:px-12 bg-base-950 relative">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-40 items-center">
        <div className="space-y-16">
          <div className="space-y-8">
            <div className="flex items-center gap-6 text-accent-muted">
              <span className="h-px w-16 bg-accent-subtle" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Distinction & Legacy</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-10">Elite <br /><span className="text-luxury">Pedigree</span></h2>
          </div>
          
          <p className="text-2xl md:text-3xl text-accent-muted font-light leading-relaxed max-w-2xl">
            The bridge between algorithmic rigor and physical mastery. A champion's mindset applied to the frontiers of Artificial Intelligence.
          </p>

          <div className="grid gap-6">
            <motion.div 
              whileHover={{ x: 20 }}
              className="flex items-center gap-10 p-10 border border-white/5 hover:border-white/20 bg-base-900 transition-all group"
            >
              <Trophy className="text-white group-hover:scale-125 transition-transform" size={48} />
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tighter">Medal of Excellence</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent-muted mt-2">Presidential Honor of Egypt</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ x: 20 }}
              className="flex items-center gap-10 p-10 border border-white/5 hover:border-white/20 bg-base-900 transition-all group"
            >
              <Medal className="text-white group-hover:scale-125 transition-transform" size={48} />
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tighter">Continental Champion</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent-muted mt-2">African Games Gold Performance</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative group">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out shadow-2xl">
            <img src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200" alt="Athletic Excellence" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-transparent to-transparent opacity-80" />
          </div>
          <div className="absolute -bottom-12 -left-12 bg-base-900 border border-base-700 rounded-[2rem] overflow-hidden p-12 max-w-xs space-y-6 shadow-2xl">
             <div className="text-7xl font-black italic tracking-tighter text-white">43+</div>
             <p className="text-[11px] font-black uppercase tracking-[0.3em] leading-loose text-accent-muted">Accumulated accolades across international & national championship circuits.</p>
          </div>
          <div className="absolute -inset-1 bg-white/5 blur-3xl rounded-[3rem] z-[-1] group-hover:bg-white/10 transition-colors" />
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer id="contact" className="py-40 px-6 md:px-12 bg-base-950 border-t border-white/5 relative overflow-hidden">
    <div className="max-w-[1440px] mx-auto text-center space-y-32 relative z-10">
      <div className="space-y-8">
        <h2 className="text-[12vw] md:text-[18rem] font-black tracking-tighter uppercase leading-[0.7] select-none">
          Build <br /><span className="text-luxury">Together</span>
        </h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-20 items-center">
        <div className="text-left space-y-6">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-muted">Encrypted Communication</div>
          <a href="mailto:ahmedislamfaroukabbas@gmail.com" className="text-3xl font-black hover:text-accent-muted transition-all duration-500 italic block border-b border-white/10 pb-4">Contact Gateway</a>
        </div>
        
        <div className="flex justify-center gap-10">
           {[
             { Icon: GithubIcon, link: "https://github.com/ahmedislamfarouk" },
             { Icon: LinkedinIcon, link: "https://linkedin.com/in/ahmedbadr" },
             { Icon: Mail, link: "mailto:ahmedislamfaroukabbas@gmail.com" }
           ].map((social, i) => (
             <motion.a 
               key={i} 
               href={social.link}
               whileHover={{ scale: 1.2, y: -5 }}
               className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500"
             >
               <social.Icon size={24} />
             </motion.a>
           ))}
        </div>

        <div className="text-right space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-muted">Status: Operational</div>
          <p className="text-accent-muted text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
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
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="selection:bg-white selection:text-black bg-base-950">
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <section id="projects" className="py-40 px-6 md:px-12 bg-base-900/40 relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-32">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85]">
                  Project <br /><span className="text-luxury">Synthesis</span>
                </h2>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-accent-muted max-w-md text-xs font-black uppercase tracking-[0.3em] leading-relaxed border-l border-white/10 pl-10"
              >
                Deployment of advanced neural architectures across medical, robotic, and multi-agent domains. Each system is engineered for maximum operational integrity.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project, idx) => (
                <motion.div 
                  key={project.title}
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ scale: 0.99 }}
                  className={`${idx === 0 ? 'lg:col-span-2' : 'lg:col-span-1'} bg-base-900 border border-base-700 rounded-[2rem] overflow-hidden relative aspect-video lg:aspect-auto min-h-[500px] group cursor-pointer`}
                >
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/20 to-transparent" />
                  <div className="absolute inset-0 p-12 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <div className="px-5 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[10px] font-black uppercase tracking-widest">{idx === 0 ? 'Featured Deployment' : 'Project Node'}</div>
                       <ArrowUpRight size={32} className="opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-4">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-accent-muted">{project.category}</span>
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{project.title}</h3>
                      </div>
                      <div className="text-4xl font-black italic text-white/20">{project.stats}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {projects.slice(3).map((project) => (
                <motion.div 
                  key={project.title}
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ scale: 0.98 }}
                  className="bg-base-900 border border-base-700 rounded-[2rem] overflow-hidden relative aspect-square group cursor-pointer"
                >
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-base-950/40 p-10 flex flex-col justify-end border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-muted mb-4">{project.category}</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{project.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <LabsGrid />
        <Achievements />
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
oject.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <LabsGrid />
        <Achievements />
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
