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

// Custom SVG Icons
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

const GradientOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full blur-[100px] opacity-40 ${className}`}
    animate={{
      scale: [1, 1.2, 1],
      x: [0, 30, -30, 0],
      y: [0, -40, 20, 0],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{ duration: 15, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

const SectionDivider = () => (
  <div className="flex items-center justify-center gap-4 py-12">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600/50" />
    <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600/50" />
  </div>
);

const StatCard = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, type: "spring", stiffness: 200 }}
    className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay + 0.2 }}
      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent"
    >
      {value}
    </motion.div>
    <div className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-semibold">{label}</div>
  </motion.div>
);

// --- SECTIONS ---

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Research', 'Projects', 'Achievements', 'Contact'];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`rounded-full transition-all duration-500 ${scrolled ? 'bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-amber-900/20' : 'bg-transparent'}`}>
            <div className="flex items-center justify-between px-8 py-4">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AB</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-white font-bold text-lg tracking-tight">Ahmed Badr</div>
                  <div className="text-stone-500 text-xs uppercase tracking-widest">AI Researcher</div>
                </div>
              </motion.div>

              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-white transition-all duration-300 relative group rounded-full"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -2 }}
                  >
                    {item}
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <motion.a
                  href="https://github.com/ahmedislamfarouk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GithubIcon size={18} />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/ahmedbadr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LinkedinIcon size={18} />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-0 right-0 z-40 lg:hidden px-6"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block py-3 text-stone-400 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const glowX = useTransform(mouseX, [0, window.innerWidth], [-100, window.innerWidth + 100]);
  const glowY = useTransform(mouseY, [0, window.innerHeight], [-100, window.innerHeight + 100]);

  return (
    <section ref={containerRef} id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <GradientOrb className="w-[600px] h-[600px] bg-amber-600/30 top-[-10%] left-[-10%]" delay={0} />
        <GradientOrb className="w-[500px] h-[500px] bg-orange-600/20 bottom-[-10%] right-[-10%]" delay={2} />
        <GradientOrb className="w-[400px] h-[400px] bg-purple-600/20 top-[40%] left-[60%]" delay={4} />
      </div>

      {/* Mouse-follow glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-full blur-[120px] pointer-events-none"
        style={{ x: glowX, y: glowY, translateX: '-50%', translateY: '-50%' }}
      />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center"
      >
        <div className="space-y-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-600/30 backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Available for Research Collaboration</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
              <span className="text-white">Crafting</span>
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">Intelligence</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-stone-400 leading-relaxed max-w-xl"
          >
            AI Researcher specializing in <span className="text-white font-semibold">Computer Vision</span>,{' '}
            <span className="text-white font-semibold">Sensor Fusion</span>, and{' '}
            <span className="text-white font-semibold">Autonomous Robotics</span>.
            Building the future of intelligent systems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <motion.a
              href="#projects"
              className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-full flex items-center gap-3 shadow-lg shadow-amber-900/50 hover:shadow-amber-900/70 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Projects
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#research"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full flex items-center gap-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={18} className="fill-white" />
              Research
            </motion.a>
          </motion.div>

          {/* Tech Stack Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            {['PyTorch', 'TensorFlow', 'ROS 2', 'YOLO', 'Transformers', 'OpenCV'].map((tech, i) => (
              <motion.span
                key={tech}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-stone-400 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.5)', color: '#fbbf24' }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Hero Image/Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative hidden lg:block"
        >
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-amber-900/30">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"
                alt="AI Research"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Floating Cards */}
            <motion.div
              className="absolute -bottom-8 -left-8 px-6 py-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Target size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-stone-500">Currently Building</div>
                  <div className="text-white font-bold">SkyVision AI</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-4 -right-4 px-6 py-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[Brain, Cpu, Zap].map((Icon, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center border-2 border-black">
                      <Icon size={16} className="text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <span className="text-xs uppercase tracking-widest text-stone-500">Scroll</span>
      </motion.div>
    </section>
  );
};

const StatsSection = () => (
  <section className="py-24 relative">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard value="43+" label="Medals Won" delay={0} />
        <StatCard value="4+" label="Research Areas" delay={0.1} />
        <StatCard value="10+" label="Projects" delay={0.2} />
        <StatCard value="3+" label="Years Experience" delay={0.3} />
      </div>
    </div>
  </section>
);

const AchievementsSection = () => (
  <section id="achievements" className="py-32 relative">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/10 border border-amber-600/20 mb-6">
          <Trophy size={16} className="text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Excellence & Recognition</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
          Milestones & <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Distinction</span>
        </h2>
        <p className="text-stone-400 text-lg max-w-2xl mx-auto">
          A journey of excellence spanning both academic research and professional athletics
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Achievement Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <div className="relative h-full p-10 rounded-[2.5rem] bg-gradient-to-br from-amber-600/20 via-amber-600/10 to-transparent border border-amber-600/20 overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-600/30 to-transparent blur-[80px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                    >
                      <Star size={20} className="fill-amber-500 text-amber-500" />
                    </motion.div>
                  ))}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Taekwondo Professional Athlete & Egyptian National Team Member
                </h3>
                
                <p className="text-stone-400 text-lg leading-relaxed">
                  Representing Egypt on the international stage with 43 medals earned across diverse championships, including 17 Gold medals and the prestigious Medal of Excellence from the President.
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="px-5 py-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center gap-3">
                    <Medal size={20} className="text-amber-500" />
                    <span className="text-sm font-bold text-white">1st Place - African Games</span>
                  </div>
                  <div className="px-5 py-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center gap-3">
                    <Award size={20} className="text-amber-500" />
                    <span className="text-sm font-bold text-white">Presidential Award</span>
                  </div>
                </div>
              </div>

              <motion.div
                className="text-9xl opacity-20"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                🥇
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Side Cards */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-amber-600/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-600/5 border border-amber-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap size={28} className="text-amber-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">Alamein University</h4>
                <p className="text-stone-500 text-sm">Major in Artificial Intelligence</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-purple-600/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Briefcase size={28} className="text-purple-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">Nomeda Founder</h4>
                <p className="text-stone-500 text-sm">AI Venture Incubation</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[2rem] bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-600/20 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">25+</div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2">Courses Completed</div>
            </div>
          </motion.div>
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
    <section id="projects" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/10 border border-amber-600/20 mb-6">
              <Rocket size={16} className="text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Technical Portfolio</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
              Featured <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Projects</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            {categories.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-900/50'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <motion.a
                  href={project.path}
                  className="group block rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm hover:border-amber-600/30 transition-all duration-500"
                  whileHover={{ y: -8 }}
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">{project.category}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-stone-400 leading-relaxed">{project.desc}</p>
                    </div>

                    {/* Stats */}
                    {project.stats && (
                      <div className="flex gap-6">
                        {project.stats.map((stat) => (
                          <div key={stat.label}>
                            <div className="text-xl font-bold text-amber-400">{stat.value}</div>
                            <div className="text-xs uppercase tracking-wider text-stone-500">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-stone-400">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Link */}
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider group/link">
                      View Project
                      <ExternalLink size={16} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const ResearchSection = () => (
  <section id="research" className="py-32 relative">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/10 border border-purple-600/20 mb-6">
          <Microscope size={16} className="text-purple-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Research Frontiers</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
          Publications & <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Papers</span>
        </h2>
        <p className="text-stone-400 text-lg max-w-2xl">
          Active research in cutting-edge AI domains
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {researchArr.map((research, index) => (
          <motion.div
            key={research.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-purple-600/30 transition-all duration-500"
            whileHover={{ y: -8 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <research.icon size={28} className="text-purple-500" />
            </div>

            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-600/10 border border-purple-600/20 text-xs font-bold uppercase tracking-wider text-purple-400 mb-4">
              {research.status}
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{research.title}</h3>
            <p className="text-stone-400 leading-relaxed">{research.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="py-32 relative">
    <div className="max-w-7xl mx-auto px-6">
      <div className="relative rounded-[3rem] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-purple-600/20" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 p-12 md:p-20">
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6">
                Let's Build the <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Future</span>
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed">
                Open to research collaborations, speaking opportunities, and innovative AI projects.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-stone-300">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Mail size={20} className="text-amber-500" />
                </div>
                <span>ahmedislamfaroukabbas@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 text-stone-300">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Globe2 size={20} className="text-amber-500" />
                </div>
                <span>Available for Remote Collaboration</span>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.a
                href="mailto:ahmedislamfaroukabbas@gmail.com"
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-full flex items-center gap-3 shadow-lg shadow-amber-900/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
                <ArrowRight size={18} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/ahmedbadr"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full flex items-center gap-3 hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <LinkedinIcon size={18} />
                LinkedIn
              </motion.a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Brain, label: 'Computer Vision', value: 'Expert' },
              { icon: Cpu, label: 'Robotics', value: 'Advanced' },
              { icon: Layers, label: 'NLP', value: 'Advanced' },
              { icon: Zap, label: 'Sensor Fusion', value: 'Expert' },
            ].map((skill, i) => (
              <motion.div
                key={skill.label}
                className="p-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <skill.icon size={24} className="text-amber-500 mb-4" />
                <div className="text-white font-bold mb-1">{skill.label}</div>
                <div className="text-sm text-stone-500">{skill.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AB</span>
          </div>
          <div>
            <div className="text-white font-bold">Ahmed Badr</div>
            <div className="text-stone-500 text-xs">AI Researcher & Professional Athlete</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {[
            { icon: GithubIcon, href: 'https://github.com/ahmedislamfarouk' },
            { icon: LinkedinIcon, href: 'https://linkedin.com/in/ahmedbadr' },
            { icon: Mail, href: 'mailto:ahmedislamfaroukabbas@gmail.com' },
          ].map((social, i) => (
            <motion.a
              key={i}
              href={social.href}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <social.icon size={18} />
            </motion.a>
          ))}
        </div>

        <div className="text-stone-500 text-sm">
          © 2024 Designed for Excellence
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN APP ---

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0908] text-white overflow-x-hidden selection:bg-amber-600/30 selection:text-amber-200">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />
      
      <NavBar />
      
      <main>
        <HeroSection />
        <StatsSection />
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
