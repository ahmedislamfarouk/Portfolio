import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Github, Linkedin, ExternalLink, Rocket } from 'lucide-react';
import React from 'react';

interface Project {
  title: string;
  desc: string;
  tech: string[];
  path: string;
}

const projects: Project[] = [
  {
    title: "Renal Rejection Classification",
    desc: "AI-based non-invasive approach for kidney transplant diagnosis. (3rd Place @ R!L)",
    tech: ["TensorFlow", "Scikit-learn", "Python"],
    path: "projects/renal-rejection-classification/README.md"
  },
  {
    title: "Autonomous Golf Cart",
    desc: "ROS 2 & YOLOv8-powered navigation with ZED 2i stereo vision.",
    tech: ["ROS 2", "YOLOv8", "Docker", "PyTorch"],
    path: "projects/autonomous-golf-cart/README.md"
  },
  {
    title: "SkyVision (Drone Swarms)",
    desc: "Aerial monitoring & vision for disaster response.",
    tech: ["Multi-drone Control", "CV", "LLM-Situational Analysis"],
    path: "projects/skyvision-drone-swarm/README.md"
  },
  {
    title: "Sobriety Detection",
    desc: "Real-time intoxication tracking using Siamese networks & eye-tracking.",
    tech: ["Siamese Networks", "OpenFace", "OpenCV"],
    path: "projects/sobriety-detection/README.md"
  }
];

const researchArr = [
  {
    title: "SkyVision: Sensor Fusion for Drone Swarms",
    status: "In Early Preparation",
    desc: "Autonomous drone navigation in disaster scenarios."
  },
  {
    title: "RAG-Based Multimodal Search Engine",
    status: "In Preparation",
    desc: "Intelligent asset retrieval using BERT and FAISS."
  },
  {
    title: "Multimodal Emotion Recognition",
    status: "In Preparation",
    desc: "Joint audio-visual sentiment analysis (SER & FER)."
  }
];

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-inter selection:bg-purple-500 selection:text-white">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/10 blur-[100px] rounded-full" />
      </div>

      <nav className="sticky top-6 z-50 max-w-5xl mx-auto px-6">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl flex items-center justify-between px-8 py-4 px-8">
          <div className="font-outfit font-bold text-xl tracking-tighter text-purple-400">PORTFOLIO</div>
          <div className="flex gap-8 transition-all">
            {['About', 'Projects', 'Achievements'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-purple-400 transition-colors uppercase text-xs font-bold tracking-widest">{item}</a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-32">
        {/* Hero Section */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-6xl lg:text-7xl font-outfit font-bold flex flex-col leading-tight">
              Hi, I'm <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Ahmed Badr</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
              AI Science Student & Researcher. Crafting the future through <strong>Computer Vision</strong>, <strong>NLP</strong>, and <strong>Robotics</strong>.
            </p>
            <div className="flex gap-4">
              <a href="#projects" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20">Explore My Work</a>
              <div className="flex gap-2">
                <a href="#" className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Github size={20} /></a>
                <a href="#" className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Linkedin size={20} /></a>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex justify-end"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80" 
                alt="Code Visualization" 
                className="relative rounded-2xl w-full max-w-md shadow-2xl"
              />
            </div>
          </motion.div>
        </section>

        {/* Education & Achievements */}
        <section id="achievements" className="space-y-12">
          <h2 className="text-4xl font-outfit font-bold text-center">Milestones & Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard>
                <GraduationCap className="text-purple-400 mb-4" />
                <h3 className="text-xl font-bold">Alamein International University</h3>
                <p className="text-sm mt-2 text-slate-400">Major in Artificial Intelligence (2022 - 2026). Specializing in Advanced AI Research.</p>
            </GlassCard>
            <GlassCard className="border-yellow-500/30 bg-yellow-500/5 col-span-1 md:col-span-2 lg:col-span-1">
              <div className="text-4xl mb-4">🥇</div>
              <h3 className="text-xl font-bold text-yellow-400">Taekwondo Professional Athlete</h3>
              <p className="text-sm mt-2 text-slate-300">Third-Dan Black Belt | Egyptian National Team Member</p>
              <div className="mt-4 space-y-2 text-xs text-slate-400">
                <p>• 1st Place - African Games (2024)</p>
                <p>• Medal of Excellence from Egypt's President</p>
                <p>• Total of 43 Competitive Medals</p>
              </div>
            </GlassCard>
            <GlassCard>
              <Briefcase className="text-pink-400 mb-4" />
              <h3 className="text-xl font-bold">Nomeda Founder</h3>
              <p className="text-sm mt-2 text-slate-400">Incubating AI ventures and scalable software architectures.</p>
            </GlassCard>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="space-y-12">
          <h2 className="text-4xl font-outfit font-bold">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <GlassCard key={i} className="group overflow-hidden">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold group-hover:text-purple-400 transition-colors">{p.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.tech.map(t => (
                      <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-slate-500">{t}</span>
                    ))}
                  </div>
                  <a href={p.path} className="inline-flex items-center gap-2 text-purple-400 text-sm font-bold pt-4 hover:gap-4 transition-all">
                    View Details <ExternalLink size={14} />
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Research */}
        <section className="bg-white/[0.02] overflow-hidden rounded-[3rem] p-12 lg:p-20 relative">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Rocket size={200} /></div>
           <div className="relative space-y-12">
             <h2 className="text-4xl font-outfit font-bold">Research Frontiers</h2>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {researchArr.map((r, i) => (
                 <div key={i} className="space-y-4">
                   <div className="px-3 py-1 bg-pink-500 text-[10px] font-black uppercase rounded-full inline-block text-white">{r.status}</div>
                   <h3 className="text-xl font-bold">{r.title}</h3>
                   <p className="text-slate-500 text-sm leading-relaxed">{r.desc}</p>
                 </div>
               ))}
             </div>
           </div>
        </section>

      </main>

      <footer className="py-20 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>&copy; 2024 Ahmed Badr. Engineered with React & Framer Motion.</p>
      </footer>
    </div>
  );
}

export default App;
