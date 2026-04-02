'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import React from 'react';

const awards = [
  {
    title: "3rd Place @ R!L Competition",
    organization: "Research!Louisville",
    year: "2024",
    level: "International",
    icon: "trophy",
  },
  {
    title: "Best AI Innovation",
    organization: "Virginia Tech Capstone",
    year: "2024",
    level: "University",
    icon: "award",
  },
  {
    title: "Hackathon 3rd Place",
    organization: "Egyptian Museum Challenge",
    year: "2024",
    level: "National",
    icon: "medal",
  },
  {
    title: "Taekwondo National Champion",
    organization: "Egyptian Taekwondo Federation",
    year: "2023",
    level: "National",
    icon: "star",
  },
  {
    title: "Outstanding Research Award",
    organization: "James Madison University",
    year: "2024",
    level: "University",
    icon: "trophy",
  },
  {
    title: "AI Excellence Recognition",
    organization: "University of Louisville",
    year: "2024",
    level: "Research Lab",
    icon: "medal",
  },
];

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  trophy: Trophy,
  medal: Medal,
  award: Award,
  star: Star,
};

const Awards = () => {
  return (
    <section id="awards" className="py-28 md:py-40 relative">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="section-label">Recognition</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
            Awards & <span className="text-gradient">Honors</span>
          </h2>
        </motion.div>

        {/* Main Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 card card-glow p-8 md:p-12"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl md:text-7xl font-black tracking-ultra text-gradient mb-2">43+</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Global Honors</div>
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-black tracking-ultra text-gradient mb-2">15+</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Competitions</div>
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-black tracking-ultra text-gradient mb-2">8</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Research Awards</div>
            </div>
          </div>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => {
            const IconComponent = iconMap[award.icon] || Trophy;
            return (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="card p-6 card-glow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-accent-cyan">
                    <IconComponent size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{award.year}</span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-ultra text-white mb-2 line-clamp-2">
                  {award.title}
                </h3>
                <div className="text-sm text-white/40 mb-3">{award.organization}</div>
                <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-wider text-white/30">
                  {award.level}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Awards;
