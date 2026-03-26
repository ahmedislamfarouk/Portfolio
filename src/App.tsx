import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
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
  Layers,
  Globe2,
  Trophy,
  Medal,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Zap,
  Github,
  Linkedin,
  ArrowUpRight
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

// --- DATA ---
const projects = [
  {
    title: "Renal Rejection AI",
    category: "Medical Diagnostics",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200",
    stats: "94.2% Accuracy",
    year: "2024",
    link: "#"
  },
  {
    title: "Autonomous Fleet",
    category: "Robotics / Perception",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200",
    stats: "Real-time @ 30fps",
    year: "2024",
    link: "#"
  },
  {
    title: "SkyVision Swarm",
    category: "Multi-Agent Systems",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200",
    stats: "10+ Drone Mesh",
    year: "2023",
    link: "#"
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
          </div>
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
                 <button className="btn-monochrome">Experience Artifacts</button>
                 <button className="btn-outline-monochrome">The Lab</button>
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
      
      {/* Dynamic Background Element */}
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

const BentoGrid = () => {
  return (
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
          {/* Featured Card */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="lg:col-span-2 bento-card aspect-video lg:aspect-auto min-h-[500px] group cursor-pointer"
          >
            <img src={projects[0].image} className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/20 to-transparent" />
            <div className="absolute inset-0 p-12 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="px-5 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[10px] font-black uppercase tracking-widest">Featured Deployment</div>
                 <ArrowUpRight size={32} className="opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500" />
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-accent-muted">{projects[0].category}</span>
                  <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">{projects[0].title}</h3>
                </div>
                <div className="text-5xl font-black italic text-white/20">{projects[0].stats.split(' ')[0]}</div>
              </div>
            </div>
          </motion.div>

          {/* Secondary Stack */}
          <div className="space-y-8">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bento-card h-[calc(50%-16px)] group cursor-pointer"
            >
              <img src={projects[1].image} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" />
              <div className="absolute inset-0 bg-base-950/40 p-10 flex flex-col justify-end border-t border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent-muted mb-4">{projects[1].category}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter">{projects[1].title}</h3>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bento-card h-[calc(50%-16px)] group cursor-pointer"
            >
               <div className="p-10 flex flex-col justify-between h-full bg-base-800/50 backdrop-blur-sm">
                 <div className="flex justify-between items-start">
                   <Rocket className="text-white group-hover:rotate-12 transition-transform" size={48} />
                   <span className="text-4xl font-black italic text-white/5">03</span>
                 </div>
                 <div className="space-y-4">
                   <h3 className="text-3xl font-black uppercase tracking-tighter">SkyVision AI</h3>
                   <p className="text-accent-muted text-[10px] font-black leading-loose uppercase tracking-widest border-t border-white/5 pt-6">Mesh coordination for autonomous swarm perception.</p>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
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
            <img src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-transparent to-transparent opacity-80" />
          </div>
          <div className="absolute -bottom-12 -left-12 bento-card p-12 bg-base-900 border-white/10 max-w-xs space-y-6 shadow-2xl">
             <div className="text-7xl font-black italic tracking-tighter text-white">43</div>
             <p className="text-[11px] font-black uppercase tracking-[0.3em] leading-loose text-accent-muted">Medals accumulated across global & national competition circuits.</p>
          </div>
          {/* Subtle Glow */}
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
             { Icon: Github, link: "https://github.com/ahmedislamfarouk" },
             { Icon: Linkedin, link: "https://linkedin.com/in/ahmedbadr" },
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
  return (
    <div className="selection:bg-white selection:text-black bg-base-950">
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <BentoGrid />
        <LabsGrid />
        <Achievements />
      </main>
      <Footer />
    </div>
  );
};

export default App;
