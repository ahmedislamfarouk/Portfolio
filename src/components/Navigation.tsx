'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['About', 'Projects', 'Labs', 'Awards', 'Contact'];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[400] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <div className={`flex items-center justify-between transition-all duration-500 rounded-2xl px-6 py-3 ${scrolled ? 'bg-black/80 backdrop-blur-2xl border border-white/[0.06]' : ''}`}>
            {/* Logo */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                <span className="text-black font-black text-base tracking-tighter select-none">B</span>
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-wider">Badr</div>
                <div className="flex items-center gap-1.5 mt-[-2px]">
                  <span className="status-dot" aria-hidden="true" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent-cyan">Online</span>
                </div>
              </div>
            </motion.button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  href={`#${item.toLowerCase()}`}
                  className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* CTA + Burger */}
            <div className="flex items-center gap-3">
              <a
                href="/Ahmed_Badr_CV.pdf"
                download
                className="hidden md:flex btn-ghost !py-2.5 !text-[10px]"
              >
                <Download size={14} />
                Resume
              </a>
              <a href="#contact" className="hidden md:flex btn-primary !py-2.5 !text-[10px]">
                Hire Me
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer md:hidden"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[350] flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <div className="space-y-6 text-center">
              {links.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-5xl font-black uppercase tracking-ultra hover:text-accent-cyan transition-colors duration-300 cursor-pointer"
                  >
                    {item}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
