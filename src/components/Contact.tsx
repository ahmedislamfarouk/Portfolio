'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// ── Lazy-load 3D element ──────────────────────────────────

const FloatingCube = dynamic(
  () => import('@/components/three/FloatingCube'),
  {
    ssr: false,
    loading: () => <div className="w-32 h-32" />,
  },
);

// ── Data ──────────────────────────────────────────────────

const LINKS = [
  { label: 'ahmed@nomeda.ai', url: 'mailto:ahmed@nomeda.ai', type: 'email' },
  { label: 'github.com/ahmedislamfarouk', url: 'https://github.com/ahmedislamfarouk', type: 'github' },
  { label: 'linkedin.com/in/ahmedbadr', url: 'https://linkedin.com/in/ahmedbadr', type: 'linkedin' },
] as const;

// ── Contact Section ───────────────────────────────────────

const Contact = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const mountRef = useRef(false);

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    requestAnimationFrame(() => setHasMounted(true));
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Links */}
          <div
            className={`transition-all duration-700 delay-100 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="space-y-1 mb-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                ESTABLISHED CHANNELS:
              </span>
            </div>

            <div className="space-y-4">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target={link.type !== 'email' ? '_blank' : undefined}
                  rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 py-3 border-b border-border hover:border-accent transition-colors duration-300"
                >
                  <span className="w-8 h-8 flex items-center justify-center border border-border group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300 shrink-0">
                    <span className="text-xs text-text-tertiary group-hover:text-accent transition-colors duration-300">
                      {link.type === 'email' ? '@' : link.type === 'github' ? 'G' : 'L'}
                    </span>
                  </span>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-tertiary block mb-0.5">
                      {link.type}
                    </span>
                    <span className="font-mono text-sm text-text-secondary group-hover:text-accent transition-colors duration-300">
                      {link.label}
                    </span>
                  </div>
                  <span className="ml-auto link-arrow text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    &rarr;
                  </span>
                </a>
              ))}
            </div>

            {/* Additional info */}
            <div className="mt-10">
              <p className="text-text-secondary text-sm leading-relaxed max-w-md">
                Open to research collaborations, robotics projects, and
                interesting conversations about AI. Based in Cairo, available
                globally.
              </p>
            </div>
          </div>

          {/* Right: 3D Element */}
          <div
            className={`flex items-center justify-center transition-all duration-700 delay-200 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <FloatingCube />
          </div>
        </div>

        {/* Horizontal rule */}
        <div className="w-full h-px bg-border mt-16 mb-8" />

        {/* Footer */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-700 delay-300 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="font-mono text-[11px] text-text-tertiary">
            &copy; 2026 AHMED BADR
          </span>
          <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-[0.2em]">
            Built with Next.js 15 + React Three Fiber
          </span>
        </div>
      </div>
    </section>
  );
};

export default Contact;
