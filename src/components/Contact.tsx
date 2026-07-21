'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Send, ArrowUpRight, Sparkles } from 'lucide-react';
import { staggerContainer, fadeSlideLeft, fadeSlideRight } from '@/components/animations';
import SplitText from '@/components/SplitText';

// ── Custom Social Icons (preserved from original) ─────────────

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

const socialLinks: SocialLink[] = [
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

// ── Sub-components ────────────────────────────────────────────

/** Animated neon border overlay for the contact CTA card */
const NeonBorderOverlay = () => (
  <div className="absolute inset-0 rounded-[2rem] pointer-events-none z-0" aria-hidden>
    <div
      className="absolute inset-0 rounded-[2rem] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        padding: '1px',
        background:
          'linear-gradient(135deg, #06B6D4, #7C3AED, #2563EB, #06B6D4)',
        backgroundSize: '300% 100%',
        animation: 'border-dance 4s ease-in-out infinite',
        WebkitMask:
          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    />
    {/* Outer glow */}
    <div
      className="absolute -inset-4 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
      }}
    />
  </div>
);

/** Single social link card with neon border glow on hover */
const SocialLinkCard = ({ link, index }: { link: SocialLink; index: number }) => {
  const IconComponent = link.icon;

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.2 + index * 0.08,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] bg-base-900 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Neon border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow:
            'inset 0 0 0 1px rgba(6, 182, 212, 0.3), 0 0 24px rgba(6, 182, 212, 0.08)',
        }}
      />

      {/* Subtle background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Icon container */}
      <div className="relative z-10 w-10 h-10 min-w-[2.5rem] rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 group-hover:border-accent-cyan/30 transition-all duration-300">
        <div className="text-white/50 group-hover:text-accent-cyan transition-colors duration-300">
          <IconComponent size={18} />
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10 flex-1 min-w-0">
        <div className="text-sm font-bold text-white/80 group-hover:text-white transition-colors duration-300">
          {link.name}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/40 transition-colors duration-300">
          {link.label}
        </div>
      </div>

      {/* Arrow on hover */}
      <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
        <ArrowUpRight size={14} className="text-accent-cyan/60" />
      </div>
    </motion.a>
  );
};

// ── Main Section ──────────────────────────────────────────────

const Contact = () => {
  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-base-950">
      {/* ── Background decorative orbs ─────────────────────── */}
      <div
        className="absolute top-[10%] -left-40 w-[30rem] h-[30rem] rounded-full opacity-[0.08] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(6,182,212,0.20) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-[15%] -right-40 w-[28rem] h-[28rem] rounded-full opacity-[0.08] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        aria-hidden
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-[0.05] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden
      />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-20" aria-hidden />

      <div className="section-container relative z-10">
        {/* ── Header ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <SplitText animation="fadeUp" delay={0.02} duration={0.5} hoverEffect={null} as="span" className="section-label">Get in Touch</SplitText>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-ultra mt-6">
            <SplitText animation="fadeUp" delay={0.03} duration={0.6} hoverEffect="sway" as="span" once>
              Let&apos;s
            </SplitText>{' '}
            <SplitText animation="fadeUp" delay={0.05} duration={0.7} hoverEffect="sway" as="span" once className="text-gradient">
              Connect
            </SplitText>
          </h2>
        </motion.div>

        {/* ── Two-column layout ─────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-start"
        >
          {/* ═══ LEFT: Info + Social Links ════════════════════ */}
          <motion.div
            variants={fadeSlideLeft}
            className="space-y-8"
          >
            {/* Description */}
            <p className="text-white/60 text-lg leading-relaxed">
              Open to research collaborations, internship opportunities, and
              innovative projects at the intersection of AI and robotics.
            </p>

            {/* Location — with animated pulse pin */}
            <div className="flex items-center gap-4 group">
              <div className="relative w-12 h-12 min-w-[3rem] rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center transition-all duration-300 group-hover:border-accent-cyan/25 group-hover:bg-accent-cyan/5">
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-accent-cyan/30" />
                <MapPin size={20} className="text-white/50 group-hover:text-accent-cyan transition-colors duration-300 relative z-10" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                  Location
                </div>
                <div className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                  Cairo, Egypt &middot; Available Globally
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 flex items-center gap-3">
                <span className="w-5 h-px bg-white/10" />
                Connect
              </div>
              <div className="space-y-3">
                {socialLinks.map((link, i) => (
                  <SocialLinkCard key={link.name} link={link} index={i} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ═══ RIGHT: Contact CTA Card ═══════════════════════ */}
          <motion.div
            variants={fadeSlideRight}
          >
            <div className="bento-card group relative overflow-hidden p-8 md:p-10 lg:p-12">
              <NeonBorderOverlay />

              {/* Inner glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[inherit] z-[1]"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.06) 0%, transparent 60%)',
                }}
              />

              <div className="relative z-10 text-center space-y-6">
                {/* Icon */}
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-accent-cyan/15 to-accent-blue/10 border border-accent-cyan/20 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:-rotate-[4deg] group-hover:border-accent-cyan/40">
                  <Send size={32} className="text-accent-cyan drop-shadow-lg" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-ultra text-white mb-3">
                    Ready to Collaborate?
                  </h3>
                  <p className="text-white/40 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
                    Let&apos;s discuss how we can work together on groundbreaking
                    AI research.
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-2">
                  <a
                    href="mailto:ahmed@nomeda.ai"
                    className="btn-primary w-full justify-center group/btn cursor-pointer"
                  >
                    <Mail size={14} />
                    <span>Send Message</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300"
                    />
                  </a>
                  <a
                    href="/Ahmed_Badr_CV.pdf"
                    download
                    className="btn-ghost w-full justify-center group/btn cursor-pointer"
                  >
                    <Sparkles size={12} />
                    <span>Download CV</span>
                  </a>
                </div>

                {/* Subtle hint */}
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/10 pt-2">
                  No spam. Just research.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
