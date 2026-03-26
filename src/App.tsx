import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  GraduationCap, 
  Github, 
  Linkedin, 
  ExternalLink, 
  Rocket, 
  Award, 
  ChevronRight, 
  Microscope, 
  Star,
  Mail
} from 'lucide-react';
import React, { useState } from 'react';

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
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className={`py-24 ${className}`}
  >
    {children}
  </motion.section>
);

const GlassCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className={`liquid-glass rounded-3xl p-8 border hover:border-amber-600/50 transition-colors cursor-pointer group ${className}`}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="bg-[#0c0a09] text-[#fafaf9] selection:bg-amber-600/30 selection:text-amber-200 min-h-screen relative font-archivo">
      
      {/* Liquid Elements Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-amber-900/10 blur-[150px] anim-morph opacity-40" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-stone-800/20 blur-[120px] rounded-full opacity-30" />
      </div>

      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
        <GlassCard className="!p-4 bg-stone-900/60 !rounded-2xl">
          <div className="flex items-center justify-between px-4">
            <span className="text-xl font-bold tracking-tighter text-amber-600">AHMED BADR</span>
            <div className="hidden md:flex gap-1">
               {['About', 'Research', 'Projects', 'Achievements'].map(item => (
                 <a key={item} href={`#${item.toLowerCase()}`} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-colors">{item}</a>
               ))}
            </div>
            <div className="flex gap-4">
               <Linkedin size={18} className="text-stone-500 hover:text-white cursor-pointer transition-colors" />
               <Github size={18} className="text-stone-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </GlassCard>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-40 pb-20 space-y-12">
        
        {/* HERO */}
        <Section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-1.5 border border-amber-600/30 bg-amber-600/5 inline-block rounded-full"
            >
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-500">Available for Research Collaboration</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-7xl lg:text-9xl font-bold leading-[0.9] tracking-tighter"
            >
              Crafting <br /> <span className="gold-gradient-text italic">Intelligence</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-stone-400 leading-relaxed font-archivo max-w-lg"
            >
              Ahmed Badr is an AI Researcher specializing in the convergence of <strong>Computer Vision</strong>, <strong>Sensor Fusion</strong>, and <strong>Autonomous Robotics</strong>.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.6 }}
               className="flex items-center gap-6"
            >
              <a href="#projects" className="px-10 py-5 bg-stone-100 text-stone-900 rounded-full font-bold flex items-center gap-3 hover:bg-amber-600 hover:text-white transition-all transform active:scale-95 group">
                Discover Research <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0c0a09] bg-stone-800 flex items-center justify-center text-[10px] font-bold">
                       {i === 1 ? 'YOLO' : i === 2 ? 'ROS2' : 'RAG'}
                    </div>
                 ))}
              </div>
            </motion.div>
          </div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1 }}
             className="relative"
          >
             <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80" 
                  alt="Code" 
                  className="w-full h-full object-cover saturate-0 transition-all duration-700 group-hover:saturate-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] to-transparent pointer-events-none" />
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end backdrop-blur-md bg-stone-900/40 p-6 rounded-2xl border border-white/5">
                   <div>
                      <p className="text-[10px] uppercase tracking-tighter text-amber-500 font-black mb-1">CURRENTLY BUILDING</p>
                      <h4 className="text-xl font-bold">SkyVision Drone AI</h4>
                   </div>
                   <Rocket className="text-stone-300" />
                </div>
             </div>
          </motion.div>Section
        </Section>

        {/* ACHIEVEMENTS / ATHLETICS */}
        <Section id="achievements">
           <div className="space-y-16">
              <div className="text-center space-y-4">
                 <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Milestones & Distinction</h2>
                 <p className="text-stone-500 max-w-xl mx-auto uppercase text-[10px] tracking-widest font-black">Awards, Memberships & Athletic Professionalism</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <GlassCard className="border-amber-600/20 bg-amber-600/5 lg:col-span-2">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                       <div className="flex-1 space-y-6 text-center md:text-left">
                          <div className="flex justify-center md:justify-start gap-3">
                             {[1,2,3].map(i => <Star key={i} size={14} className="fill-amber-600 text-amber-600" />)}
                          </div>
                          <h3 className="text-3xl font-bold leading-tight">Taekwondo Professional Athlete <br /> & Egyptian National Team Member</h3>
                          <p className="text-stone-400 text-sm leading-relaxed">Representing Egypt on the international stage. 43 medals earned across diverse championships with 17 Golds.</p>
                          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                             <div className="px-4 py-2 bg-stone-900/50 rounded-lg border border-white/5 flex items-center gap-2">
                                <Award size={14} className="text-amber-500" />
                                <span className="text-xs font-bold">1st Place - African Games</span>
                             </div>
                             <div className="px-4 py-2 bg-stone-900/50 rounded-lg border border-white/5 flex items-center gap-2">
                                <Award size={14} className="text-amber-500" />
                                <span className="text-xs font-bold">Medal of Excellence</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-9xl opacity-50 select-none font-bold italic text-amber-600/30">🥇</div>
                    </div>
                 </GlassCard>

                 <div className="space-y-6 lg:col-span-1 flex flex-col justify-between">
                    <GlassCard className="flex items-center gap-6 py-6">
                       <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center text-amber-600">
                          <GraduationCap size={24} />
                       </div>
                       <div>
                          <h4 className="font-bold text-lg">Alamein University</h4>
                          <p className="text-xs text-stone-500">Major in Artificial Intelligence</p>
                       </div>
                    </GlassCard>
                    <GlassCard className="flex items-center gap-6 py-6">
                       <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-600">
                          <Briefcase size={24} />
                       </div>
                       <div>
                          <h4 className="font-bold text-lg">Nomeda Founder</h4>
                          <p className="text-xs text-stone-500">AI Venture Incubation</p>
                       </div>
                    </GlassCard>
                    <div className="flex gap-4">
                       <div className="flex-1 p-6 liquid-glass rounded-2xl flex flex-col items-center">
                          <span className="text-2xl font-bold">25+</span>
                          <span className="text-[10px] text-stone-600 uppercase font-black">Courses</span>
                       </div>
                       <div className="flex-1 p-6 liquid-glass rounded-2xl flex flex-col items-center">
                          <span className="text-2xl font-bold">3+</span>
                          <span className="text-[10px] text-stone-600 uppercase font-black">Internships</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </Section>

        {/* PROJECTS */}
        <Section id="projects">
           <div className="space-y-16">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                 <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Technical Portfolio</h2>
                    <p className="text-stone-500 uppercase text-[10px] tracking-widest font-black">Applied AI from Medical Imaging to Robotics</p>
                 </div>
                 <div className="flex gap-2 p-1 bg-white/5 rounded-full backdrop-blur-md">
                    {['All', 'Robotics', 'NLP', 'Medical'].map(tab => (
                       <button 
                         key={tab}
                         onClick={() => setActiveTab(tab)}
                         className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-amber-600 text-white' : 'text-stone-500 hover:text-white'}`}
                       >
                       {tab}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <AnimatePresence mode='popLayout'>
                    {projects.filter(p => activeTab === 'All' || p.category === activeTab).map((p, i) => (
                       <motion.div
                         layout
                         key={p.title}
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.95 }}
                         transition={{ duration: 0.4 }}
                       >
                          <GlassCard className="relative group overflow-hidden h-full flex flex-col justify-between">
                             <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-baseline">
                                   <h3 className="text-2xl font-bold group-hover:text-amber-500 transition-colors uppercase tracking-tight">{p.title}</h3>
                                   <span className="text-[10px] uppercase font-black text-stone-600 tracking-tighter">{p.category}</span>
                                </div>
                                <p className="text-stone-400 text-sm leading-relaxed">{p.desc}</p>
                                <div className="flex flex-wrap gap-2 pt-4">
                                   {p.tech.map(t => (
                                      <span key={t} className="px-3 py-1 bg-stone-900 border border-white/5 rounded-full text-[10px] uppercase font-bold text-stone-500">{t}</span>
                                   ))}
                                </div>
                             </div>
                             <a 
                                href={p.path} 
                                className="mt-8 inline-flex items-center gap-2 text-stone-100 text-xs font-black uppercase tracking-widest hover:text-amber-500 transition-all self-start group/link"
                             >
                                Detailed Briefing <ExternalLink size={14} className="group-hover/link:translate-x-1 transition-transform" />
                             </a>
                             <div className="absolute top-0 right-0 p-8 opacity-5 -z-1 group-hover:opacity-10 transition-opacity">
                                <Briefcase size={80} />
                             </div>
                          </GlassCard>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>
        </Section>

        {/* RESEARCH */}
        <Section id="research">
           <GlassCard className="bg-amber-600/5 border-amber-600/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                 <Microscope size={300} strokeWidth={1} />
              </div>
              <div className="relative space-y-16">
                 <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Research Frontiers</h2>
                    <p className="text-stone-500 uppercase text-[10px] tracking-widest font-black">Published Insights & Active Preparation</p>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {researchArr.map((res, i) => (
                       <div key={i} className="space-y-6">
                          <div className="inline-block px-3 py-1 rounded-full bg-stone-900 border border-amber-600/30 text-[10px] font-black uppercase text-amber-500">{res.status}</div>
                          <h4 className="text-xl font-bold tracking-tight">{res.title}</h4>
                          <p className="text-stone-500 text-sm font-archivo leading-relaxed">{res.desc}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </GlassCard>
        </Section>

        {/* EXPERIENCE / CLUBS */}
        <Section className="pb-40">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                 <h2 className="text-3xl font-bold">Scientific Memberships</h2>
                 <div className="space-y-8">
                    {[
                       { title: "IEEE Club Member", role: "AI Committee", period: "Dec 2024 - Present" },
                       { title: "ICPC Club Member", role: "Competitive Programmer", period: "Nov 2023 - Present" }
                    ].map((item, idx) => (
                       <div key={idx} className="flex gap-8 group">
                          <div className="pt-1.5"><ChevronRight size={16} className="text-amber-600 group-hover:translate-x-1 transition-transform" /></div>
                          <div className="space-y-2">
                             <h4 className="font-bold text-lg">{item.title}</h4>
                             <p className="text-stone-500 text-xs font-black uppercase tracking-widest">{item.role} <span className="mx-2 opacity-30">|</span> {item.period}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-12">
                 <h2 className="text-3xl font-bold">Contact & Synergy</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="mailto:ahmedislamfaroukabbas@gmail.com" className="p-8 liquid-glass hover:border-amber-600/50 flex flex-col gap-4">
                       <Mail size={24} className="text-amber-500" />
                       <span className="text-sm font-bold opacity-80">Send Inquiry</span>
                    </a>
                    <a href="#" className="p-8 liquid-glass hover:border-amber-600/50 flex flex-col gap-4">
                       <Linkedin size={24} className="text-blue-500" />
                       <span className="text-sm font-bold opacity-80">Message on LinkedIn</span>
                    </a>
                 </div>
              </div>
           </div>
        </Section>

      </main>

      <footer className="bg-stone-900/40 py-20 border-t border-white/5 text-center">
         <p className="text-stone-600 text-xs font-black uppercase tracking-widest">© 2024 AHMED BADR <span className="mx-4 opacity-10">|</span> DESIGNED FOR EXCELLENCE</p>
      </footer>
    </div>
  );
};

export default App;
