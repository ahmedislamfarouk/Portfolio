'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin, Send } from 'lucide-react';

// Custom Social Icons
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Contact = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/ahmedislamfarouk',
      icon: GithubIcon,
      label: '@ahmedislamfarouk',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/ahmedbadr',
      icon: LinkedinIcon,
      label: 'Connect',
    },
    {
      name: 'Email',
      url: 'mailto:ahmed@nomeda.ai',
      icon: Mail,
      label: 'ahmed@nomeda.ai',
    },
  ];

  return (
    <section id="contact" className="py-28 md:py-40 relative bg-base-900/30">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="section-label">Get in Touch</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-white/60 text-lg leading-relaxed">
              Open to research collaborations, internship opportunities, and innovative projects
              at the intersection of AI and robotics.
            </p>

            {/* Location */}
            <div className="flex items-center gap-4 text-white/40">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Location</div>
                <div className="text-white/60">Cairo, Egypt · Available Globally</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Connect</div>
              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-accent-cyan/50 hover:bg-accent-cyan/5 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <social.icon size={18} className="text-white/60 group-hover:text-accent-cyan" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white/80">{social.name}</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">{social.label}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card card-glow p-8 md:p-12"
          >
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 flex items-center justify-center mx-auto">
                <Send size={32} className="text-accent-cyan" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-ultra text-white mb-2">
                  Ready to Collaborate?
                </h3>
                <p className="text-white/40 text-sm">
                  Let&apos;s discuss how we can work together on groundbreaking AI research.
                </p>
              </div>
              <a
                href="mailto:ahmed@nomeda.ai"
                className="btn-primary w-full justify-center"
              >
                <Mail size={14} />
                Send Message
              </a>
              <a
                href="/Ahmed_Badr_CV.pdf"
                download
                className="btn-ghost w-full justify-center"
              >
                <Mail size={14} />
                Download CV
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
