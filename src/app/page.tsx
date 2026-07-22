import Navigation from '@/components/Navigation';
import { Hero, MarqueeTicker } from '@/components/Hero';
import Projects from '@/components/Projects';
import ResearchTimeline from '@/components/ResearchTimeline';
import Labs from '@/components/Labs';
import BeyondTheLab from '@/components/BeyondTheLab';
import Awards from '@/components/Awards';
import Contact from '@/components/Contact';
import BackToTop from '@/components/BackToTop';
import SectionDivider from '@/components/SectionDivider';
import { Mail } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Marquee Ticker */}
      <MarqueeTicker />
      
      <SectionDivider />
      
      {/* Projects Section */}
      <Projects />
      
      <SectionDivider />
      
      {/* Research Journey Timeline */}
      <ResearchTimeline />
      
      <SectionDivider />
      
      {/* Research Labs Section */}
      <Labs />
      
      <SectionDivider />
      
      {/* Beyond the Lab — Taekwondo Champion Narrative */}
      <BeyondTheLab />
      
      <SectionDivider />
      
      {/* Awards Section */}
      <Awards />
      
      <SectionDivider />
      
      {/* Contact Section */}
      <Contact />
      
      {/* Animated gradient line above footer */}
      <div className="relative w-full h-px overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #06B6D4 25%, #7C3AED 50%, #2563EB 75%, transparent 100%)',
            backgroundSize: '200% 100%',
            filter: 'blur(2px)',
          }}
          aria-hidden
        />
      </div>

      {/* Enhanced Footer */}
      <footer className="py-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-neon-cyan/3 blur-[100px] rounded-full pointer-events-none"
          aria-hidden
        />

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="text-sm font-black uppercase tracking-wider text-white mb-1">Ahmed Badr</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em]">AI Researcher &amp; Robotics Engineer</div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/ahmedislamfarouk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/5 hover:shadow-[0_0_16px_rgba(6,182,212,0.12)] transition-all duration-300 group"
                aria-label="GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="transition-transform duration-300 group-hover:scale-110">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/ahmedbadr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/5 hover:shadow-[0_0_16px_rgba(6,182,212,0.12)] transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="transition-transform duration-300 group-hover:scale-110">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="mailto:ahmed@nomeda.ai"
                className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/5 hover:shadow-[0_0_16px_rgba(6,182,212,0.12)] transition-all duration-300 group"
                aria-label="Email"
              >
                <Mail size={16} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span>Built with Next.js 15</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <BackToTop />
    </main>
  );
}
