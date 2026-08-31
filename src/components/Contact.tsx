'use client';

import { useState, useEffect, useRef } from 'react';

// ── Data ─────────────────────────────────────────────────

const LINKS = [
  { label: 'ahmed@nomeda.ai', url: 'mailto:ahmed@nomeda.ai' },
  { label: 'github.com/ahmedislamfarouk', url: 'https://github.com/ahmedislamfarouk' },
  { label: 'linkedin.com/in/ahmedbadr', url: 'https://linkedin.com/in/ahmedbadr' },
] as const;

// ── Contact Section ──────────────────────────────────────

const Contact = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const mountRef = useRef(false);

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    requestAnimationFrame(() => {
      setHasMounted(true);
    });
  }, []);

  return (
    <section id="contact">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className={`mb-10 transition-opacity duration-700 ${hasMounted ? 'opacity-100' : 'opacity-0'}`}>
          <span className="data-label">UPLINK</span>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-10" />

        {/* Links */}
        <div
          className={`mb-16 transition-all duration-700 delay-100 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="space-y-1 mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
              ESTABLISHED CHANNELS:
            </span>
          </div>

          <div className="space-y-3">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 font-mono text-sm text-text-secondary hover:text-accent transition-colors duration-300 py-2"
              >
                <span className="link-arrow text-xs">&rarr;</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mb-8" />

        {/* Footer */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-700 delay-200 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="font-mono text-[11px] text-text-tertiary">
            &copy; 2026 AHMED BADR
          </span>
          <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-[0.2em]">
            Built with Next.js 15
          </span>
        </div>
      </div>
    </section>
  );
};

export default Contact;
