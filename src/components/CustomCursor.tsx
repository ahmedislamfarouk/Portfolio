'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

type CursorVariant = 'default' | 'link' | 'button' | 'text';

// ─── Constants ───────────────────────────────────────────────────
const DOT_SIZE = 6;
const RING_SIZE = 32;
const RING_SIZE_HOVER = 48;
const PARTICLE_COUNT = 3;
const PARTICLE_LIFETIME = 600;
const PARTICLE_SPEED = 0.8;
const THROTTLE_MS = 16; // ~60fps

// ─── Spring configs ──────────────────────────────────────────────
const DOT_SPRING = { stiffness: 500, damping: 28, mass: 0.15 };
const RING_SPRING = { stiffness: 180, damping: 22, mass: 0.3 };

// ─── CustomCursor ────────────────────────────────────────────────
const CustomCursor = () => {
  const [isActive, setIsActive] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isPressed, setIsPressed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Motion values for the dot (tight follow)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const springDotX = useSpring(dotX, DOT_SPRING);
  const springDotY = useSpring(dotY, DOT_SPRING);

  // Motion values for the ring (loose follow)
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  const springRingX = useSpring(ringX, RING_SPRING);
  const springRingY = useSpring(ringY, RING_SPRING);

  // Particle system
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastMouseRef = useRef({ x: -100, y: -100 });
  const lastThrottleRef = useRef(0);
  const particleIdRef = useRef(0);
  const isPressedRef = useRef(false);

  // Keep refs in sync for RAF loop
  useEffect(() => {
    isPressedRef.current = isPressed;
  }, [isPressed]);

  // ─── Capability detection — set active after mount to avoid hydration mismatch ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mqReduced.matches) return;

    const mqPointer = window.matchMedia('(pointer: fine)');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time initialization after mount
    setIsActive(mqPointer.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsActive(e.matches);
    };
    mqPointer.addEventListener('change', handlePointerChange);

    return () => {
      mqPointer.removeEventListener('change', handlePointerChange);
    };
  }, []);

  // ─── Spawn particles ─────────────────────────────────────────
  const spawnParticles = useCallback((x: number, y: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = PARTICLE_SPEED * (0.5 + Math.random() * 0.5);
      particlesRef.current.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: PARTICLE_LIFETIME,
        maxLife: PARTICLE_LIFETIME,
        size: 1 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.4,
      });
    }

    // Cap particle count for performance
    if (particlesRef.current.length > 120) {
      particlesRef.current = particlesRef.current.slice(-80);
    }
  }, []);

  // ─── RAF animation loop for particles ────────────────────────
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const dt = 1; // normalized timestep

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 16 * dt;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Decelerate
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Gravity (subtle upward drift)
        p.vy -= 0.01;

        // Fade based on life
        const lifeRatio = p.life / p.maxLife;
        const alpha = p.opacity * lifeRatio;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.fill();

        // Glow effect
        if (lifeRatio > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * lifeRatio * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.15})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animateParticles);
    };

    rafRef.current = requestAnimationFrame(animateParticles);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isActive]);

  // ─── Mouse events ────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastThrottleRef.current < THROTTLE_MS) return;
      lastThrottleRef.current = now;

      const { clientX: x, clientY: y } = e;

      // Update motion values
      dotX.set(x);
      dotY.set(y);
      ringX.set(x);
      ringY.set(y);

      // Calculate distance for particle spawning
      const dx = x - lastMouseRef.current.x;
      const dy = y - lastMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Emit particles based on movement speed
      if (dist > 5) {
        const count = Math.min(PARTICLE_COUNT, Math.floor(dist / 12));
        spawnParticles(x, y, count);
      }

      lastMouseRef.current = { x, y };
    };

    const handleMouseDown = () => {
      setIsPressed(true);

      // Burst of particles on click
      const { x, y } = lastMouseRef.current;
      spawnParticles(x, y, 8);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
      dotX.set(-200);
      dotY.set(-200);
      ringX.set(-200);
      ringY.set(-200);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    // ─── Interactive element detection ─────────────────────────
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !target.closest) return;

      // Check closest interactive elements
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label, .btn-primary, .btn-ghost, .btn-icon, [data-cursor]'
      );

      if (!interactive) {
        setVariant('default');
        return;

      }

      // Determine variant from data attribute or element type
      const dataCursor = interactive.getAttribute('data-cursor');
      if (dataCursor === 'magnetic' || dataCursor === 'text') {
        setVariant('text');
      } else if (
        interactive.tagName === 'BUTTON' ||
        interactive.getAttribute('role') === 'button' ||
        interactive.classList.contains('btn-primary') ||
        interactive.classList.contains('btn-ghost') ||
        interactive.classList.contains('btn-icon')
      ) {
        setVariant('button');
      } else if (interactive.tagName === 'A') {
        setVariant('link');
      } else {
        setVariant('link');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement;
      if (!related || !related.closest) {
        setVariant('default');
        return;
      }

      // Check if still inside an interactive element
      const stillInteractive = related.closest(
        'a, button, [role="button"], input, textarea, select, label, .btn-primary, .btn-ghost, .btn-icon, [data-cursor]'
      );

      if (!stillInteractive) {
        setVariant('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isActive, dotX, dotY, ringX, ringY, spawnParticles]);

  // ─── Derived sizes from variant ──────────────────────────────
  const dotScale = variant === 'button' ? 1.8 : variant === 'link' ? 1.4 : 1;
  const ringScale = variant === 'button' ? 1.6 : variant === 'link' ? 1.5 : variant === 'text' ? 0.8 : 1;
  const ringOpacity = variant === 'default' ? 0.35 : 0.55;

  // ─── Don't render on mobile / reduced motion ─────────────────
  if (!isActive) return null;

  return (
    <>
      {/* Particle canvas — runs at native res for perf */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 9998,
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* ─── Outer Ring ──────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: springRingX,
          y: springRingY,
          width: RING_SIZE,
          height: RING_SIZE,
          marginLeft: -RING_SIZE / 2,
          marginTop: -RING_SIZE / 2,
          zIndex: 9999,
          willChange: 'transform',
        }}
        animate={{
          scale: isPressed ? 0.7 : ringScale,
          opacity: isHidden ? 0 : ringOpacity,
          width: variant === 'button' ? RING_SIZE_HOVER : RING_SIZE,
          height: variant === 'button' ? RING_SIZE_HOVER : RING_SIZE,
          marginLeft: variant === 'button' ? -RING_SIZE_HOVER / 2 : -RING_SIZE / 2,
          marginTop: variant === 'button' ? -RING_SIZE_HOVER / 2 : -RING_SIZE / 2,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          opacity: { duration: 0.2 },
          width: { type: 'spring', stiffness: 200, damping: 18 },
          height: { type: 'spring', stiffness: 200, damping: 18 },
          marginLeft: { type: 'spring', stiffness: 200, damping: 18 },
          marginTop: { type: 'spring', stiffness: 200, damping: 18 },
        }}
      >
        {/* Border ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1.5px solid rgba(6, 182, 212, ${ringOpacity})`,
            transition: 'border-color 0.3s ease',
          }}
        />
        {/* Glow behind ring */}
        <div
          className="absolute inset-[-4px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(6, 182, 212, ${ringOpacity * 0.15}) 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* ─── Core Dot ────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: springDotX,
          y: springDotY,
          width: DOT_SIZE,
          height: DOT_SIZE,
          marginLeft: -DOT_SIZE / 2,
          marginTop: -DOT_SIZE / 2,
          zIndex: 10000,
          willChange: 'transform',
        }}
        animate={{
          scale: isPressed ? 1.5 : dotScale,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 400, damping: 15 },
          opacity: { duration: 0.15 },
        }}
      >
        {/* Solid dot */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor:
              variant === 'link' ? '#22D3EE' : variant === 'button' ? '#FFFFFF' : '#06B6D4',
            boxShadow:
              variant === 'link'
                ? '0 0 8px rgba(34, 211, 238, 0.9), 0 0 16px rgba(34, 211, 238, 0.4), 0 0 32px rgba(34, 211, 238, 0.15)'
                : variant === 'button'
                  ? '0 0 8px rgba(255, 255, 255, 0.9), 0 0 20px rgba(6, 182, 212, 0.5)'
                  : '0 0 6px rgba(6, 182, 212, 0.9), 0 0 14px rgba(6, 182, 212, 0.5), 0 0 28px rgba(6, 182, 212, 0.2)',
            transition: 'background-color 0.2s ease, box-shadow 0.3s ease',
          }}
        />
        {/* Inner highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: '60%',
            height: '60%',
            top: '20%',
            left: '20%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)',
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
