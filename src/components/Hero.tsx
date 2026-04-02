'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Typewriter hook
const useTypewriter = (words: string[], speed = 100, pause = 2000) => {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length === current.length) {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setDeleting(false);
          setWordIdx((i) => (i + 1) % words.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx, words, speed, pause]);

  return displayed;
};

// Wave Light Background
const WaveLight = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const organicY = (
      x: number, w: number, midY: number,
      amp: number, baseFreq: number,
      plL: number, plR: number,
    ) => {
      const xn = x / w;
      const driftRange = amp * 1.1;
      const yLeft = midY + driftRange * Math.sin(t * 0.031 + plL);
      const yRight = midY + driftRange * Math.sin(t * 0.054 + plR);
      const baseline = yLeft + (yRight - yLeft) * xn;
      const ripple =
        amp * 0.40 * Math.sin(xn * Math.PI * 2 * baseFreq + t * 1.00) +
        amp * 0.20 * Math.sin(xn * Math.PI * 2 * baseFreq * 1.73 + t * 1.61) +
        amp * 0.10 * Math.sin(xn * Math.PI * 2 * baseFreq * 3.14 + t * 2.71);
      return baseline + ripple;
    };

    const tracePath = (midY: number, amp: number, freq: number, plL: number, plR: number) => {
      const w = canvas.width;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = organicY(x, w, midY, amp, freq, plL, plR);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    };

    const edgeGradient = (alpha: number) => {
      const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
      g.addColorStop(0, `rgba(255,255,255,0)`);
      g.addColorStop(0.10, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.50, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.90, `rgba(255,255,255,${alpha})`);
      g.addColorStop(1, `rgba(255,255,255,0)`);
      return g;
    };

    const drawWave = (
      midY: number, amp: number, freq: number,
      plL: number, plR: number, brightness: number,
    ) => {
      tracePath(midY, amp, freq, plL, plR);
      ctx.save();
      ctx.shadowColor = `rgba(255,255,255,${0.55 * brightness})`;
      ctx.shadowBlur = 90;
      ctx.strokeStyle = edgeGradient(0.10 * brightness);
      ctx.lineWidth = 38;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      tracePath(midY, amp, freq, plL, plR);
      ctx.save();
      ctx.shadowColor = `rgba(255,255,255,${0.70 * brightness})`;
      ctx.shadowBlur = 24;
      ctx.strokeStyle = edgeGradient(0.22 * brightness);
      ctx.lineWidth = 9;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      tracePath(midY, amp, freq, plL, plR);
      ctx.shadowColor = `rgba(255,255,255,${0.90 * brightness})`;
      ctx.shadowBlur = 6;
      ctx.strokeStyle = edgeGradient(0.70 * brightness);
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const h = canvas.height;
      drawWave(h * 0.38, 85, 1.4, 0.00, 2.39, 1.0);
      drawWave(h * 0.65, 65, 1.9, 1.57, 4.71, 0.55);
      t += 0.014;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, width: '100%', height: '100%' }}
    />
  );
};

// Scroll Progress
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent-cyan z-[600] origin-left"
      style={{ scaleX }}
    />
  );
};

// Marquee Ticker
const MarqueeTicker = () => {
  const items = [
    'Computer Vision', 'ROS 2', 'Sensor Fusion', 'YOLOv8', 'Autonomous Systems',
    'Large Language Models', 'Reinforcement Learning', 'Medical AI', 'RAG Pipelines',
    'Drone Swarms', 'Taekwondo Champion', 'Edge Deployment',
  ];
  const doubled = [...items, ...items];

  return (
    <div className="py-4 border-y border-white/[0.06] overflow-hidden bg-base-900/30 backdrop-blur-sm">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-0 whitespace-nowrap"
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/25 px-6">{item}</span>
            <span className="text-accent-cyan/40 text-xs">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// Hero Section
const Hero = () => {
  const roles = ['AI Researcher', 'Robotics Engineer', 'Vision Systems', 'Champion Athlete'];
  const role = useTypewriter(roles, 80, 2200);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section id="about" ref={ref} className="min-h-screen relative flex items-center overflow-hidden pt-24">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950/40" />

      {/* Animated orbs */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-[100px]" />
      </motion.div>

      <motion.div style={{ opacity }} className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-end min-h-[80vh] py-20">
          {/* Main Text */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <span className="section-label">Cairo, Egypt · Available Globally</span>
              <span className="tag bg-accent-cyan/5 border-accent-cyan/25 text-accent-cyan">
                <span className="status-dot inline mr-2" aria-hidden="true" />
                Building: SkyVision Swarm
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(4rem,14vw,13rem)] tracking-ultra leading-ultra"
            >
              Ahmed
              <br />
              <span className="text-gradient">Badr</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2 text-xl md:text-2xl font-light text-white/60"
            >
              <span>{role}</span>
              <span className="cursor" aria-hidden="true" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/40 text-base max-w-lg leading-relaxed"
            >
              Engineering the nexus of sentient vision and autonomous control.
              SOTA research meets championship-level execution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#projects" className="btn-primary">
                View Work <ArrowUpRight size={14} />
              </a>
              <a href="#contact" className="btn-ghost">
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-row lg:flex-col gap-6 lg:gap-4"
          >
            {[
              { val: '43+', label: 'Global Honors' },
              { val: '9', label: 'AI Projects' },
              { val: '2+', label: 'Yrs Research' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card card-glow px-8 py-6 text-center min-w-[120px]"
              >
                <div className="text-4xl font-black tracking-ultra text-white">{stat.val}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Scroll</span>
      </motion.div>
    </section>
  );
};

export { Hero, WaveLight, ScrollProgress, MarqueeTicker };
