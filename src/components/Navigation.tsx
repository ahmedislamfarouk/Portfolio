'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Constants ─────────────────────────────────────────────

const NAV_LINKS = ['Work', 'Experience', 'About', 'Contact'] as const;
const SCROLL_THRESHOLD = 40;

// ── Smooth scroll helper using Lenis ──────────────────────

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  // Try Lenis first, fallback to native
  const lenis = (window as unknown as Record<string, unknown>).__lenis as
    | { scrollTo: (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => void }
    | undefined;

  if (lenis) {
    lenis.scrollTo(el, { offset: -80, duration: 1.5 });
  } else {
    const offset = 80;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

// ── Navigation ────────────────────────────────────────────

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section via ScrollTrigger
  useEffect(() => {
    const sections = ['home', 'projects', 'experience', 'about', 'contact'];
    const triggers: ScrollTrigger[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  // Body lock when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Escape to close
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const handleNavClick = useCallback((label: string) => {
    setMobileOpen(false);
    const sectionId =
      label === 'Work' ? 'projects' : label === 'Home' ? 'home' : label.toLowerCase();
    scrollToSection(sectionId);
  }, []);

  const handleLogoClick = useCallback(() => {
    setMobileOpen(false);
    const lenis = (window as unknown as Record<string, unknown>).__lenis as
      | { scrollTo: (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => void }
      | undefined;

    if (lenis) {
      lenis.scrollTo(0 as unknown as string, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[400] transition-all duration-500 ${
        scrolled
          ? 'bg-base-950/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20">
        <nav
          className="flex items-center justify-between h-14 md:h-16"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer group"
            aria-label="Scroll to top"
          >
            <span className="w-7 h-7 flex items-center justify-center border border-border group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300 text-xs font-mono font-bold text-text-primary">
              B
            </span>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="status-indicator" />
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-accent">
                ONLINE
              </span>
            </div>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => {
              const sectionId =
                item === 'Work'
                  ? 'projects'
                  : item.toLowerCase();
              const isActive = activeSection === sectionId;

              return (
                <a
                  key={item}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 cursor-pointer relative ${
                    isActive
                      ? 'text-accent'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {item}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/Ahmed_Badr_CV.pdf"
              download
              className="font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-1.5 border border-border text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-all duration-300 cursor-pointer"
              aria-label="Download resume"
            >
              RESUME
            </a>
            <a
              href="mailto:ahmed@nomeda.ai"
              className="font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-1.5 bg-white text-base-950 font-medium transition-all duration-300 hover:bg-accent cursor-pointer"
              aria-label="Get in touch"
            >
              CONTACT
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span
              className={`w-4 h-px bg-text-primary transition-all duration-300 ${
                mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''
              }`}
            />
            <span
              className={`w-4 h-px bg-text-primary transition-all duration-300 ${
                mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
              }`}
            />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-14 bg-base-950/98 backdrop-blur-xl z-[300] flex flex-col items-center justify-center pointer-events-auto md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col items-center gap-6">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href={`#${item === 'Work' ? 'projects' : item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
                className="font-sans font-bold text-4xl uppercase tracking-tight text-text-primary hover:text-accent transition-colors duration-300 cursor-pointer"
                aria-label={`Navigate to ${item}`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-4 px-6">
            <a
              href="/Ahmed_Badr_CV.pdf"
              download
              onClick={() => setMobileOpen(false)}
              className="font-mono text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 border border-border text-text-secondary hover:text-text-primary transition-all duration-300 cursor-pointer"
              aria-label="Download resume"
            >
              RESUME
            </a>
            <a
              href="mailto:ahmed@nomeda.ai"
              onClick={() => setMobileOpen(false)}
              className="font-mono text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 bg-white text-base-950 font-medium transition-all duration-300"
              aria-label="Get in touch"
            >
              CONTACT
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
