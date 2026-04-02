'use client';

import { motion } from 'framer-motion';
import { Eye, Layers, Brain, Cpu } from 'lucide-react';

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

const Labs = () => {
  return (
    <section id="labs" className="py-28 md:py-40 relative bg-base-900/30">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="section-label">Research Areas</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
            Research <span className="text-gradient">Labs</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="card p-8 card-glow group"
            >
              <div className="flex items-start gap-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${area.accent}15` }}
                >
                  <area.icon size={28} style={{ color: area.accent }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black uppercase tracking-ultra text-white mb-3">
                    {area.title}
                  </h3>
                  <p className="text-white/50 text-base leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Research Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { val: '15+', label: 'Publications' },
            { val: '8', label: 'Research Labs' },
            { val: '4', label: 'Universities' },
            { val: '20+', label: 'Collaborators' },
          ].map((stat) => (
            <div key={stat.label} className="card card-glow p-6 text-center">
              <div className="text-3xl md:text-4xl font-black tracking-ultra text-white">{stat.val}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Labs;
