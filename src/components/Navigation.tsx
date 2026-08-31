'use client';

import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Constants ───────────────────────────────────────────
const NAV_LINKS = ['Home', 'About', 'Projects', 'Labs', 'Awards', 'Contact'] as const;

const SCROLL_THRESHOLD = 40;

// ─── Utility Hooks ────────────────────────────────────────

/** Detects prefers-reduced-motion at runtime */
function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
}

/** Locks body scroll when menu is open */
function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [locked]);
}

/** Closes menu on Escape key */
function useEscape(handler: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, active]);
}

/** Tracks the currently visible section for active nav indicator */
function useActiveSection(): string {
  const [active, setActive] = useState('Home');

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) =>
      link === 'Home' ? '__top' : link.toLowerCase(),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible entry (closest to top)
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (id === '__top') {
            setActive('Home');
          } else {
            // Map section id back to nav link label
            const link = NAV_LINKS.find(
              (l) => l.toLowerCase() === id,
            );
            if (link) setActive(link);
          }
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      },
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const el = id === '__top' ? document.body : document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

/** Smoothly scrolls to a section using Lenis if available, fallback to native */
function smoothScrollTo(targetY: number) {
  // Try Lenis first (global instance)
  const lenis = (window as unknown as Record<string, unknown>).__lenis as
    | { scrollTo: (target: number | string | Element, options?: { offset?: number; duration?: number }) => void }
    | undefined;

  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(targetY, { duration: 1.6 });
    return;
  }

  // Fallback to native smooth scroll
  window.scrollTo({ top: targetY, behavior: 'smooth' });
}

/** Scrolls to a section by ID */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80; // Nav height offset
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    smoothScrollTo(y);
  }
}

// ─── Magnetic Link ───────────────────────────────────────
function MagneticNavLink({
  href,
  onClick,
  children,
  className = '',
  ariaLabel,
  isActive = false,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  isActive?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const prefersReduced = usePrefersReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReduced) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.18);
      y.set((e.clientY - cy) * 0.18);
    },
    [prefersReduced, x, y],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ x, y }}
      transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.94 }}
      className={`relative cursor-pointer inline-flex items-center ${className}`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="nav-active-dot"
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-cyan"
          style={{ boxShadow: '0 0 6px rgba(6,182,212,0.8)' }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
    </motion.a>
  );
}

// ─── Neon Underline ──────────────────────────────────────
function Underline() {
  return (
    <motion.span
      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-accent-cyan rounded-full origin-left pointer-events-none"
      variants={{
        rest: { scaleX: 0, opacity: 0 },
        hover: {
          scaleX: 1,
          opacity: 1,
          transition: { duration: 0.25, ease: 'easeOut' },
        },
      }}
      style={{ boxShadow: '0 0 8px rgba(6,182,212,0.6)' }}
    />
  );
}

// ─── Desktop Link ────────────────────────────────────────
function DesktopNavLink({
  label,
  href,
  onClick,
  index,
  isActive,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.4, ease: 'easeOut' }}
    >
      <MagneticNavLink
        href={href}
        onClick={onClick}
        ariaLabel={`Navigate to ${label}`}
        isActive={isActive}
        className={`text-[11px] font-bold uppercase tracking-[0.28em] transition-colors duration-200 py-1 ${
          isActive ? 'text-white' : 'text-white/60 hover:text-white'
        }`}
      >
        <span>{label}</span>
        <Underline />
      </MagneticNavLink>
    </motion.div>
  );
}

// ─── Mobile Staggered Letter Item ────────────────────────
function MobileNavItem({
  label,
  href,
  onClick,
  linkIndex,
  prefersReduced,
  isActive,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  linkIndex: number;
  prefersReduced: boolean;
  isActive: boolean;
}) {
  const letters = label.split('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.15 + linkIndex * 0.07,
        duration: prefersReduced ? 0.1 : 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="overflow-hidden"
    >
      <a
        href={href}
        onClick={onClick}
        className="block cursor-pointer"
        aria-label={`Navigate to ${label}`}
      >
        <span className="flex">
          {letters.map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className={`inline-block ${isActive ? 'text-accent-cyan' : ''}`}
              initial={prefersReduced ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
              animate={
                prefersReduced
                  ? { y: 0, opacity: 1 }
                  : {
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.25 + linkIndex * 0.08 + charIndex * 0.035,
                        duration: 0.55,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }
              }
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
      </a>
    </motion.div>
  );
}

// ─── Navigation ──────────────────────────────────────────
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const activeSection = useActiveSection();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });
  const progressOpacity = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  // Mobile menu controls
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  useBodyLock(isOpen);
  useEscape(closeMenu, isOpen);

  const handleNavClick = useCallback(
    (item: string) => {
      closeMenu();
      if (item === 'Home') {
        smoothScrollTo(0);
      } else {
        const sectionId = item.toLowerCase();
        scrollToSection(sectionId);
      }
    },
    [closeMenu],
  );

  const handleLogoClick = useCallback(() => {
    smoothScrollTo(0);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[400] pointer-events-none"
      role="banner"
    >
      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent-cyan origin-left z-10 pointer-events-none"
        style={{
          scaleX,
          opacity: progressOpacity,
          boxShadow: '0 0 10px rgba(6,182,212,0.5), 0 0 30px rgba(6,182,212,0.15)',
        }}
      />

      {/* ── Nav Pill ── */}
      <div className="max-w-[1400px] mx-auto w-full px-3 sm:px-5 md:px-8 pt-3 sm:pt-4 md:pt-5">
        <nav
          className={`relative w-full rounded-2xl border pointer-events-auto transition-all duration-500 ease-out will-change-transform ${
            scrolled
              ? 'border-white/[0.10] bg-black/80 backdrop-blur-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(6,182,212,0.04)]'
              : 'border-white/[0.07] bg-black/75 backdrop-blur-2xl shadow-none'
          }`}
          style={{
            padding: scrolled ? '10px 18px' : '14px 22px',
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between">
            {/* ── Logo ── */}
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
              aria-label="Scroll to top"
            >
              {/* Animated "B" logo with neon pulse */}
              <motion.div
                className="relative w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden"
                animate={
                  prefersReduced
                    ? {}
                    : {
                        boxShadow: [
                          '0 0 0px rgba(6,182,212,0)',
                          '0 0 18px rgba(6,182,212,0.45)',
                          '0 0 4px rgba(6,182,212,0.2)',
                          '0 0 0px rgba(6,182,212,0)',
                        ],
                      }
                }
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="text-black font-black text-base tracking-tighter select-none group-hover:scale-110 transition-transform duration-200">
                  B
                </span>
              </motion.div>

              <div className="hidden sm:block">
                <div className="text-sm font-black uppercase tracking-wider leading-none">
                  Badr
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="status-dot" aria-hidden="true" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent-cyan">
                    Online
                  </span>
                </div>
              </div>
            </motion.button>

            {/* ── Desktop Links ── */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-5 lg:gap-8">
              {NAV_LINKS.map((item, i) => {
                const href = item === 'Home' ? undefined : `#${item.toLowerCase()}`;
                return (
                  <DesktopNavLink
                    key={item}
                    label={item}
                    href={href}
                    onClick={() => handleNavClick(item)}
                    index={i}
                    isActive={activeSection === item}
                  />
                );
              })}
            </div>

            {/* ── CTA Buttons & Mobile Toggle ── */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Resume (desktop) */}
              <motion.a
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                href="/Ahmed_Badr_CV.pdf"
                download
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 border border-white/15 text-white font-bold uppercase tracking-widest text-[9px] rounded-full transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Download resume"
              >
                <Download size={12} className="shrink-0" />
                <span>Resume</span>
              </motion.a>

              {/* Hire Me (desktop) */}
              <motion.a
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('Contact');
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 bg-white text-black font-bold uppercase tracking-widest text-[9px] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer"
                aria-label="Get in touch"
              >
                Hire Me
              </motion.a>

              {/* Hamburger (mobile) */}
              <motion.button
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                onClick={toggleMenu}
                className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer md:hidden"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={16} /> : <Menu size={16} />}
              </motion.button>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Mobile Fullscreen Menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex flex-col items-center justify-center pointer-events-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              onClick={closeMenu}
              className="absolute top-5 right-5 sm:top-8 sm:right-8 w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/25 transition-all duration-300 cursor-pointer group"
              aria-label="Close menu"
            >
              <X
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </motion.button>

            {/* Mobile nav items with staggered letter animation */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 -mt-12 sm:-mt-16 [&_a_span_span]:text-5xl sm:[&_a_span_span]:text-7xl md:[&_a_span_span]:text-8xl [&_a_span_span]:font-black [&_a_span_span]:uppercase [&_a_span_span]:tracking-ultra [&_a_span_span]:text-white/90 [&_a_span_span]:hover:text-accent-cyan [&_a_span_span]:transition-colors [&_a_span_span]:duration-300">
              {NAV_LINKS.map((item, i) => {
                const href = item === 'Home' ? undefined : `#${item.toLowerCase()}`;
                return (
                  <MobileNavItem
                    key={item}
                    label={item}
                    href={href}
                    onClick={() => handleNavClick(item)}
                    linkIndex={i}
                    prefersReduced={prefersReduced}
                    isActive={activeSection === item}
                  />
                );
              })}
            </div>

            {/* Mobile CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.25 + NAV_LINKS.length * 0.08 + 0.1,
                duration: 0.5,
                ease: 'easeOut',
              }}
              className="absolute bottom-10 sm:bottom-16 left-0 right-0 flex items-center justify-center gap-3 px-6"
            >
              <a
                href="/Ahmed_Badr_CV.pdf"
                download
                onClick={closeMenu}
                className="flex items-center gap-2 px-6 py-3 border border-white/15 text-white font-bold uppercase tracking-widest text-[10px] rounded-full transition-all duration-300 hover:border-white/40 hover:bg-white/5 cursor-pointer"
                aria-label="Download resume"
              >
                <Download size={14} />
                Resume
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('Contact');
                }}
                className="flex items-center gap-2 px-7 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] cursor-pointer"
                aria-label="Get in touch"
              >
                Hire Me
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
