import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Globe,
  ExternalLink,
  Rocket,
  Award,
  ChevronRight,
  Microscope,
  Star,
  Mail,
  ArrowDown,
  Sparkles,
  Target,
  Brain,
  Cpu
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

// Custom SVG Icons for GitHub and LinkedIn
const GithubIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
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
}

const projects: Project[] = [
  {
    title: "Renal Rejection Classification",
    desc: "AI-based non-invasive diagnostic. Awarded 3rd Place @ R!L Bioengineering labs.",
    tech: ["TensorFlow", "Scikit", "Python"],
    path: "projects/renal-rejection-classification/README.md",
    category: "Medical"
  },
  {
    title: "Autonomous Golf Cart",
    desc: "ROS 2 & YOLOv8 perception suite with ZED 2i stereo depth estimation.",
    tech: ["ROS 2", "YOLOv8", "Docker"],
    path: "projects/autonomous-golf-cart/README.md",
    category: "Robotics"
  },
  {
    title: "SkyVision (Drone Swarms)",
    desc: "Aerial swarm monitoring for disaster response and infra analysis.",
    tech: ["SWARM", "Perception", "LLM"],
    path: "projects/skyvision-drone-swarm/README.md",
    category: "Robotics"
  },
  {
    title: "Sobriety Detection",
    desc: "Real-time tracker using Siamese networks, OpenFace and gaze analysis.",
    tech: ["Siamese", "OpenFace", "OpenCV"],
    path: "projects/sobriety-detection/README.md",
    category: "CV"
  }
];

const researchArr = [
  {
    title: "SkyVision: Sensor Fusion",
    status: "Early Preparation",
    desc: "Autonomous drone navigation in disaster scenarios."
  },
  {
    title: "Multimodal Search Engine",
    status: "In Preparation",
    desc: "Intelligent asset retrieval using BERT and FAISS."
  },
  {
    title: "Emotion Recognition",
    status: "In Preparation",
    desc: "Joint audio-visual sentiment analysis (SER & FER)."
  }
];

// --- COMPONENTS ---

const Section = ({ id, children, className = "" }: { id?: string, children: React.ReactNode, className?: string }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className={`py-24 ${className}`}
  >
    {children}
  </motion.section>
);

const GlassCard = ({ children, className = "", delay = 0, hoverScale = true }: { children: React.ReactNode, className?: string, delay?: number, hoverScale?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    whileHover={hoverScale ? { y: -8, scale: 1.02, transition: { duration: 0.3 } } : { y: -8, transition: { duration: 0.3 } }}
    className={`liquid-glass rounded-3xl p-8 border hover:border-amber-600/50 transition-all duration-500 ${className}`}
  >
    {children}
  </motion.div>
);

const BackgroundBlobs = () => (
  <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
    <motion.div 
      className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-gradient-to-br from-amber-900/20 to-stone-900/10 blur-[150px] rounded-full"
      animate={{
        x: [0, 50, 0, -50, 0],
        y: [0, 30, 0, -30, 0],
        scale: [1, 1.1, 1, 1.05, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-gradient-to-tl from-stone-800/20 to-amber-900/10 blur-[120px] rounded-full"
      animate={{
        x: [0, -40, 0, 40, 0],
        y: [0, -50, 0, 30, 0],
        scale: [1, 1.15, 1, 1.08, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute top-[40%] left-[50%] w-[40vw] h-[40vw] bg-gradient-to-r from-amber-800/10 to-stone-700/10 blur-[100px] rounded-full"
      animate={{
        x: [0, 60, 0, -60, 0],
        y: [0, 40, 0, -40, 0],
      }}
      transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="glass-nav rounded-2xl px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.span 
            className="text-xl font-bold tracking-tighter bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            AHMED BADR
          </motion.span>
          
          <div className="hidden md:flex items-center gap-1">
            {['About', 'Research', 'Projects', 'Achievements'].map((item, i) => (
              <motion.a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-all duration-300 relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com/ahmedislamfarouk"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <GithubIcon size={18} className="text-stone-500 hover:text-white transition-colors" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/ahmedbadr"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <LinkedinIcon size={18} className="text-stone-500 hover:text-white transition-colors" />
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe size={18} className="text-stone-500 hover:text-white cursor-pointer transition-colors" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <Section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-screen pt-20">
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="badge-premium px-4 py-2 rounded-full inline-flex items-center gap-2"
        >
          <Sparkles size={12} className="text-amber-500" />
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-500">Available for Research Collaboration</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl lg:text-8xl font-bold leading-[0.95] tracking-tighter"
        >
          Crafting <br /> <span className="gold-gradient-text italic">Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg text-stone-400 leading-relaxed max-w-lg"
        >
          Ahmed Badr is an AI Researcher specializing in the convergence of{" "}
          <strong className="text-white">Computer Vision</strong>,{" "}
          <strong className="text-white">Sensor Fusion</strong>, and{" "}
          <strong className="text-white">Autonomous Robotics</strong>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap items-center gap-6"
        >
          <motion.a 
            href="#projects" 
            className="btn-primary px-10 py-5 rounded-full font-bold flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Discover Research 
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          
          <div className="flex -space-x-3">
            {[
              { text: 'YOLO', color: 'from-blue-600/80 to-blue-400/80' },
              { text: 'ROS2', color: 'from-amber-600/80 to-amber-400/80' },
              { text: 'RAG', color: 'from-purple-600/80 to-purple-400/80' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className={`w-12 h-12 rounded-full border-2 border-[#0c0a09] bg-gradient-to-br ${item.color} flex items-center justify-center text-[9px] font-black text-white backdrop-blur-sm`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
              >
                {item.text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex items-center gap-8 pt-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-amber-600 to-transparent rounded-full" />
            <div>
              <p className="text-2xl font-bold text-white">43+</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500">Medals Won</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-purple-600 to-transparent rounded-full" />
            <div>
              <p className="text-2xl font-bold text-white">4+</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500">Research Areas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-transparent rounded-full" />
            <div>
              <p className="text-2xl font-bold text-white">3+</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500">Projects</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative hidden lg:block"
      >
        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative group shadow-2xl shadow-amber-900/20">
          <motion.img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80"
            alt="AI Research"
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:saturate-100"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/20 to-transparent" />
          
          <motion.div 
            className="absolute bottom-10 left-10 right-10 flex justify-between items-end liquid-glass p-6 rounded-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-tighter text-amber-500 font-black mb-1 flex items-center gap-2">
                <Target size={10} />
                CURRENTLY BUILDING
              </p>
              <h4 className="text-xl font-bold">SkyVision Drone AI</h4>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Rocket className="text-stone-300" size={24} />
            </motion.div>
          </motion.div>

          <div className="absolute top-10 right-10 flex gap-2">
            {[Brain, Cpu, Rocket].map((Icon, i) => (
              <motion.div
                key={i}
                className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.2, backgroundColor: "rgba(202, 138, 4, 0.3)" }}
              >
                <Icon size={16} className="text-amber-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <ArrowDown size={20} className="text-stone-500 anim-float" />
        <span className="text-[9px] uppercase tracking-widest text-stone-600">Scroll to explore</span>
      </motion.div>
    </Section>
  );
};

const AchievementsSection = () => (
  <Section id="achievements">
    <div className="space-y-16">
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Milestones & <span className="gold-gradient-text">Distinction</span></h2>
        <p className="text-stone-500 max-w-xl mx-auto uppercase text-[10px] tracking-widest font-black">Awards, Memberships & Athletic Professionalism</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GlassCard className="border-amber-600/20 bg-amber-600/5 lg:col-span-2" delay={0.1}>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <motion.div 
                className="flex justify-center md:justify-start gap-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    initial={{ rotate: -180, opacity: 0 }}
                    whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                  >
                    <Star size={16} className="fill-amber-600 text-amber-600" />
                  </motion.div>
                ))}
              </motion.div>
              
              <h3 className="text-3xl font-bold leading-tight">Taekwondo Professional Athlete <br /> & Egyptian National Team Member</h3>
              <p className="text-stone-400 text-sm leading-relaxed">Representing Egypt on the international stage. 43 medals earned across diverse championships with 17 Golds.</p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <motion.div 
                  className="px-4 py-2 bg-stone-900/60 rounded-xl border border-white/5 flex items-center gap-2"
                  whileHover={{ scale: 1.05, borderColor: "rgba(202, 138, 4, 0.5)" }}
                >
                  <Award size={14} className="text-amber-500" />
                  <span className="text-xs font-bold">1st Place - African Games</span>
                </motion.div>
                <motion.div 
                  className="px-4 py-2 bg-stone-900/60 rounded-xl border border-white/5 flex items-center gap-2"
                  whileHover={{ scale: 1.05, borderColor: "rgba(202, 138, 4, 0.5)" }}
                >
                  <Award size={14} className="text-amber-500" />
                  <span className="text-xs font-bold">Medal of Excellence</span>
                </motion.div>
              </div>
            </div>
            <motion.div 
              className="text-8xl md:text-9xl opacity-30 select-none"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              🥇
            </motion.div>
          </div>
        </GlassCard>

        <div className="space-y-6 lg:col-span-1">
          <GlassCard className="flex items-center gap-6 py-6" delay={0.2}>
            <motion.div 
              className="w-14 h-14 icon-container rounded-xl flex items-center justify-center text-amber-600"
              whileHover={{ rotate: 5 }}
            >
              <GraduationCap size={28} />
            </motion.div>
            <div>
              <h4 className="font-bold text-lg">Alamein University</h4>
              <p className="text-xs text-stone-500">Major in Artificial Intelligence</p>
            </div>
          </GlassCard>
          
          <GlassCard className="flex items-center gap-6 py-6" delay={0.3}>
            <motion.div 
              className="w-14 h-14 icon-container rounded-xl flex items-center justify-center text-purple-600"
              whileHover={{ rotate: -5 }}
            >
              <Briefcase size={28} />
            </motion.div>
            <div>
              <h4 className="font-bold text-lg">Nomeda Founder</h4>
              <p className="text-xs text-stone-500">AI Venture Incubation</p>
            </div>
          </GlassCard>

          <div className="flex gap-4">
            <GlassCard className="flex-1 py-6 flex flex-col items-center justify-center" delay={0.4}>
              <span className="text-3xl font-bold gold-gradient-text">25+</span>
              <span className="text-[9px] text-stone-600 uppercase font-black tracking-widest mt-1">Courses</span>
            </GlassCard>
            <GlassCard className="flex-1 py-6 flex flex-col items-center justify-center" delay={0.5}>
              <span className="text-3xl font-bold gold-gradient-text">3+</span>
              <span className="text-[9px] text-stone-600 uppercase font-black tracking-widest mt-1">Internships</span>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <Section id="projects">
      <div className="space-y-16">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-end gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Technical <span className="gold-gradient-text">Portfolio</span></h2>
            <p className="text-stone-500 uppercase text-[10px] tracking-widest font-black">Applied AI from Medical Imaging to Robotics</p>
          </div>
          <motion.div 
            className="flex gap-2 p-1.5 liquid-glass rounded-full"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            {['All', 'Robotics', 'NLP', 'Medical'].map(tab => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-600/30' 
                    : 'text-stone-500 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          layout
        >
          <AnimatePresence mode='popLayout'>
            {projects.filter(p => activeTab === 'All' || p.category === activeTab).map((p, index) => (
              <motion.div
                layout
                key={p.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <GlassCard className="relative group overflow-hidden h-full flex flex-col justify-between card-lift" delay={index * 0.1}>
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-2xl font-bold group-hover:text-amber-500 transition-colors uppercase tracking-tight">{p.title}</h3>
                      <span className="px-3 py-1 liquid-glass rounded-full text-[9px] uppercase font-black text-stone-500 tracking-wider">{p.category}</span>
                    </div>
                    <p className="text-stone-400 text-sm leading-relaxed">{p.desc}</p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      {p.tech.map(t => (
                        <motion.span 
                          key={t} 
                          className="px-3 py-1.5 liquid-glass rounded-full text-[9px] uppercase font-bold text-stone-400 tracking-wider"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(202, 138, 4, 0.2)", color: "#fde68a" }}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <motion.a
                    href={p.path}
                    className="mt-8 inline-flex items-center gap-2 text-stone-100 text-xs font-black uppercase tracking-widest hover:text-amber-500 transition-all self-start group/link"
                    whileHover={{ x: 5 }}
                  >
                    Detailed Briefing 
                    <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </motion.a>
                  <div className="absolute top-0 right-0 p-8 opacity-5 -z-1 group-hover:opacity-10 transition-opacity duration-500">
                    <Briefcase size={80} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
};

const ResearchSection = () => (
  <Section id="research">
    <GlassCard className="bg-amber-600/5 border-amber-600/10 overflow-hidden relative" delay={0}>
      <motion.div 
        className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <Microscope size={300} strokeWidth={1} />
      </motion.div>
      
      <div className="relative space-y-16">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Research <span className="gold-gradient-text">Frontiers</span></h2>
          <p className="text-stone-500 uppercase text-[10px] tracking-widest font-black">Published Insights & Active Preparation</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {researchArr.map((res, i) => (
            <motion.div 
              key={i} 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <motion.div 
                className="inline-block px-4 py-1.5 rounded-full badge-premium text-[9px] font-black uppercase tracking-widest"
                whileHover={{ scale: 1.05 }}
              >
                {res.status}
              </motion.div>
              <h4 className="text-xl font-bold tracking-tight">{res.title}</h4>
              <p className="text-stone-500 text-sm leading-relaxed">{res.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  </Section>
);

const ExperienceSection = () => (
  <Section className="pb-40">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <motion.div 
        className="space-y-12"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold">Scientific <span className="gold-gradient-text">Memberships</span></h2>
        <div className="space-y-8">
          {[
            { title: "IEEE Club Member", role: "AI Committee", period: "Dec 2024 - Present" },
            { title: "ICPC Club Member", role: "Competitive Programmer", period: "Nov 2023 - Present" }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              className="flex gap-6 group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 10 }}
            >
              <motion.div 
                className="pt-1.5"
                whileHover={{ scale: 1.2, rotate: 45 }}
              >
                <ChevronRight size={18} className="text-amber-600" />
              </motion.div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg group-hover:text-amber-500 transition-colors">{item.title}</h4>
                <p className="text-stone-500 text-xs font-black uppercase tracking-widest">{item.role} <span className="mx-2 opacity-30">|</span> {item.period}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="space-y-12"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold">Contact & <span className="gold-gradient-text">Synergy</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.a 
            href="mailto:ahmedislamfaroukabbas@gmail.com" 
            className="liquid-glass hover:border-amber-600/50 p-8 flex flex-col gap-4 card-lift rounded-2xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail size={28} className="text-amber-500" />
            <span className="text-sm font-bold">Send Inquiry</span>
          </motion.a>
          <motion.a 
            href="https://linkedin.com/in/ahmedbadr" 
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass hover:border-blue-600/50 p-8 flex flex-col gap-4 card-lift rounded-2xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <LinkedinIcon size={28} className="text-blue-500" />
            <span className="text-sm font-bold">Connect on LinkedIn</span>
          </motion.a>
        </div>
      </motion.div>
    </div>
  </Section>
);

const Footer = () => (
  <motion.footer 
    className="liquid-glass py-16 border-t border-white/5"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
      <motion.div 
        className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
      >
        AHMED BADR
      </motion.div>
      <p className="text-stone-600 text-xs font-black uppercase tracking-widest">
        © 2024 Designed for Excellence
      </p>
      <div className="flex justify-center gap-6 pt-4">
        {[GithubIcon, LinkedinIcon, Mail].map((Icon, i) => (
          <motion.a
            key={i}
            href="#"
            className="w-10 h-10 liquid-glass rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1, y: -3, backgroundColor: "rgba(202, 138, 4, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={18} className="text-stone-400 hover:text-amber-500 transition-colors" />
          </motion.a>
        ))}
      </div>
    </div>
  </motion.footer>
);

const App: React.FC = () => {
  return (
    <div className="bg-[#0c0a09] text-[#fafaf9] selection:bg-amber-600/30 selection:text-amber-200 min-h-screen relative font-archivo page-container">
      <BackgroundBlobs />
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <HeroSection />
        <AchievementsSection />
        <ProjectsSection />
        <ResearchSection />
        <ExperienceSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
