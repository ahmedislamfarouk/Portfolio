'use client';

import {
  motion,
  useInView,
  type Variants,
  type Transition,
  type TargetAndTransition,
} from 'framer-motion';
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// ═════════════════════════════════════════════════════════════════════
//  Types
// ═════════════════════════════════════════════════════════════════════

export interface SplitTextProps {
  /** The text to animate */
  children: string;
  /** Class applied to the outer Tag element */
  className?: string;
  /** HTML element to render (default: 'h1') */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  /** Per-letter stagger delay in seconds (default: 0.03) */
  delay?: number;
  /** Per-letter animation duration in seconds (default: 0.5) */
  duration?: number;
  /** Overall delay before animation starts in seconds (default: 0) */
  offset?: number;
  /** Animation preset (default: 'fadeUp') */
  animation?: 'drop' | 'fadeUp' | 'glitch' | 'reveal' | 'random';
  /** Whether letters animate in sequence (default: true) */
  staggerChildren?: boolean;
  /** Stagger direction (default: 'forward') */
  staggerDirection?: 'forward' | 'reverse';
  /** Per-letter hover animation effect (default: null) */
  hoverEffect?: 'glitch' | 'sway' | 'tilt' | null;
  /** Only animate once (default: true) */
  once?: boolean;
  /** Callback when all letters have finished animating */
  onComplete?: () => void;
  /** Class applied to each letter <span> */
  letterClassName?: string;
  /** Class applied to the inner wrapper <span> */
  wrapperClassName?: string;
}

// ═════════════════════════════════════════════════════════════════════
//  Constants & Helpers
// ═════════════════════════════════════════════════════════════════════

/** Symmetric-looking characters for glitch scrambling */
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#ABCXYZabcxyz0123456789';

/**
 * Easing used by all non-spring presets.
 * Smooth acceleration into gentle deceleration — rauno.me style.
 */
const CUSTOM_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pickRandom = (charset: string = GLITCH_CHARS): string =>
  charset[Math.floor(Math.random() * charset.length)];

// ═════════════════════════════════════════════════════════════════════
//  Component
// ═════════════════════════════════════════════════════════════════════

const SplitText = ({
  children: text,
  className = '',
  as: Tag = 'h1',
  delay = 0.03,
  duration = 0.5,
  offset = 0,
  animation = 'fadeUp',
  staggerChildren = true,
  staggerDirection = 'forward',
  hoverEffect = null,
  once = true,
  onComplete,
  letterClassName = '',
  wrapperClassName = '',
}: SplitTextProps) => {
  // ─── Refs ──────────────────────────────────────────────────
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once, margin: '-40px' });
  const onCompleteFired = useRef(false);
  const prevInView = useRef(false);

  // ─── State ─────────────────────────────────────────────────
  const [hasAnimated, setHasAnimated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Glitch character map: index → currently displayed character
  const [glitchedChars, setGlitchedChars] = useState<Record<number, string>>({});
  const glitchTimeouts = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const glitchIntervals = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map());

  // Stable random offsets for the 'random' preset (computed once per input)
  const randomOffsets = useRef<Array<{ x: number; y: number }>>([]);
  const offsetsInitialised = useRef(false);

  // ─── Memoized char array ───────────────────────────────────
  const chars = useMemo(() => [...text], [text]);

  // Compute random offsets eagerly for the 'random' preset
  if (!offsetsInitialised.current || randomOffsets.current.length !== chars.length) {
    randomOffsets.current = chars.map(() => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
    }));
    offsetsInitialised.current = true;
  }

  // ─── Reduced-motion detection ──────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ─── Cleanup glitch timers on unmount ──────────────────────
  useEffect(() => {
    const timeouts = glitchTimeouts.current;
    const intervals = glitchIntervals.current;

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      intervals.forEach((i) => clearInterval(i));
      timeouts.clear();
      intervals.clear();
    };
  }, []);

  // ─── Reset animation when scrolling away (once = false) ───
  useEffect(() => {
    if (once) return;
    if (!isInView && prevInView.current) {
      setHasAnimated(false);
      setGlitchedChars({});
      onCompleteFired.current = false;
      glitchTimeouts.current.forEach((t) => clearTimeout(t));
      glitchIntervals.current.forEach((i) => clearInterval(i));
      glitchTimeouts.current.clear();
      glitchIntervals.current.clear();
    }
    prevInView.current = isInView;
  }, [isInView, once]);

  // ─── Glitch scrambling logic ──────────────────────────────
  const triggerGlitch = useCallback(() => {
    if (reducedMotion) return;

    // Clear any stale timers
    glitchTimeouts.current.forEach((t) => clearTimeout(t));
    glitchIntervals.current.forEach((i) => clearInterval(i));
    glitchTimeouts.current.clear();
    glitchIntervals.current.clear();

    // Seed all letters with random characters
    const seed: Record<number, string> = {};
    chars.forEach((char, i) => {
      if (char === ' ') return;
      seed[i] = pickRandom();
    });
    setGlitchedChars(seed);

    // Staggered resolution — each letter scrambles a few times
    // before settling on the correct character.
    chars.forEach((char, i) => {
      if (char === ' ') return;

      const staggerIndex =
        staggerDirection === 'reverse' ? chars.length - 1 - i : i;
      const startAt = offset + (staggerChildren ? staggerIndex * delay : 0);

      const timeout = setTimeout(() => {
        const scrambles = 4 + Math.floor(Math.random() * 4);
        let count = 0;

        const interval = setInterval(() => {
          count++;
          if (count >= scrambles) {
            clearInterval(interval);
            glitchIntervals.current.delete(i);
            setGlitchedChars((prev) => ({ ...prev, [i]: char }));
          } else {
            setGlitchedChars((prev) => ({ ...prev, [i]: pickRandom() }));
          }
        }, 40 + Math.random() * 30);

        glitchIntervals.current.set(i, interval);
      }, startAt * 1000);

      glitchTimeouts.current.set(i, timeout);
    });
  }, [chars, delay, offset, reducedMotion, staggerChildren, staggerDirection]);

  // ─── Fire animation when element scrolls into view ────────
  useEffect(() => {
    if (!isInView || hasAnimated || reducedMotion) return;

    if (animation === 'glitch') {
      triggerGlitch();
    }

    setHasAnimated(true);
  }, [isInView, animation, hasAnimated, reducedMotion, triggerGlitch]);

  // ─── onComplete callback timing ───────────────────────────
  useEffect(() => {
    if (!isInView || onCompleteFired.current || !onComplete) return;

    const lastIndex = staggerDirection === 'reverse' ? 0 : chars.length - 1;
    const totalMs =
      (offset + (staggerChildren ? lastIndex * delay : 0) + duration + 0.15) *
      1000;

    const timer = setTimeout(() => {
      if (!onCompleteFired.current) {
        onComplete();
        onCompleteFired.current = true;
      }
    }, totalMs);

    return () => clearTimeout(timer);
  }, [
    isInView,
    chars.length,
    delay,
    duration,
    offset,
    onComplete,
    staggerChildren,
    staggerDirection,
  ]);

  // ─── Hover glitch handler ─────────────────────────────────
  const handleHoverGlitch = useCallback(
    (index: number) => {
      if (hoverEffect !== 'glitch' || reducedMotion) return;
      const char = chars[index];
      if (!char || char === ' ') return;

      // Kill any existing scramble on this letter
      if (glitchIntervals.current.has(index)) {
        clearInterval(glitchIntervals.current.get(index)!);
      }

      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count >= 6) {
          clearInterval(interval);
          glitchIntervals.current.delete(index);
          setGlitchedChars((prev) => ({ ...prev, [index]: char }));
        } else {
          setGlitchedChars((prev) => ({ ...prev, [index]: pickRandom() }));
        }
      }, 40);

      glitchIntervals.current.set(index, interval);
    },
    [hoverEffect, chars, reducedMotion],
  );

  // ═══════════════════════════════════════════════════════════
  //  Animation Variants
  // ═══════════════════════════════════════════════════════════

  const variants: Variants = useMemo(() => {
    switch (animation) {
      case 'drop':
        return {
          hidden: { y: '-120%', opacity: 0 },
          visible: { y: 0, opacity: 1 },
        };
      case 'fadeUp':
        return {
          hidden: { y: 40, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        };
      case 'reveal':
        return {
          hidden: { clipPath: 'inset(0 100% 0 0)' },
          visible: { clipPath: 'inset(0 0% 0 0)' },
        };
      case 'random':
        return {
          hidden: (i: number) => {
            const o = randomOffsets.current[i];
            if (!o) return { opacity: 0 };
            return { x: o.x, y: o.y, opacity: 0 };
          },
          visible: { x: 0, y: 0, opacity: 1 },
        };
      case 'glitch':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      default:
        return {
          hidden: { y: 40, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        };
    }
  }, [animation]);

  // ─── Hover animation targets ──────────────────────────────
  const hoverTargets: TargetAndTransition | undefined = useMemo(() => {
    switch (hoverEffect) {
      case 'sway':
        return {
          rotate: [0, -6, 6, -3, 3, 0],
          transition: { duration: 0.4 },
        };
      case 'tilt':
        return {
          rotateY: 12,
          transition: { type: 'spring', stiffness: 300, damping: 18 },
        };
      default:
        return undefined;
    }
  }, [hoverEffect]);

  // ─── Per-letter transition generator ──────────────────────
  const getTransition = useCallback(
    (index: number): Transition => {
      const staggerIndex =
        staggerDirection === 'reverse' ? chars.length - 1 - index : index;
      const baseDelay = offset + (staggerChildren ? staggerIndex * delay : 0);

      switch (animation) {
        case 'drop':
          return {
            delay: baseDelay,
            type: 'spring',
            stiffness: 100,
            damping: 12,
            mass: 0.8,
          };
        case 'random':
          return {
            delay: baseDelay,
            type: 'spring',
            stiffness: 60,
            damping: 16,
            mass: 0.6,
          };
        case 'glitch':
          return {
            delay: baseDelay,
            ease: CUSTOM_EASE,
            duration: duration * 0.5,
          };
        case 'reveal':
          return {
            delay: baseDelay,
            ease: CUSTOM_EASE,
            duration,
          };
        default:
          // fadeUp
          return {
            delay: baseDelay,
            ease: CUSTOM_EASE,
            duration,
          };
      }
    },
    [animation, chars.length, delay, duration, offset, staggerChildren, staggerDirection],
  );

  // ═══════════════════════════════════════════════════════════
  //  Render
  // ═══════════════════════════════════════════════════════════

  // ─── Reduced motion: plain visible text (no animation) ────
  if (reducedMotion) {
    const TagComponent = Tag as React.ElementType;
    return <TagComponent className={className}>{text}</TagComponent>;
  }

  // Decide which state each letter should be in.
  // Before the viewport is reached we keep them "hidden" so they're
  // invisible but in-the-DOM, ready to animate.  Once `hasAnimated`
  // flips, they transition to "visible".
  const animateState = hasAnimated ? 'visible' : ('hidden' as const);

  // ─── Build letter spans ───────────────────────────────────
  const letterSpans = chars.map((char, index) => {
    // Spaces → non-breaking space to preserve inline word flow
    if (char === ' ') {
      return (
        <span
          key={`space-${index}`}
          className={`inline-block select-none ${letterClassName}`}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: '&nbsp;' }}
        />
      );
    }

    const isGlitchActive = animation === 'glitch' && hasAnimated;
    const displayChar =
      isGlitchActive && glitchedChars[index] !== undefined
        ? glitchedChars[index]
        : char;

    return (
      <motion.span
        key={`char-${index}`}
        custom={index}
        variants={variants}
        initial="hidden"
        animate={animateState}
        transition={getTransition(index)}
        whileHover={hoverTargets}
        onMouseEnter={() => handleHoverGlitch(index)}
        className={`inline-block will-change-transform select-none ${letterClassName}`}
        aria-hidden="true"
      >
        {displayChar}
      </motion.span>
    );
  });

  const TagComponent = Tag as React.ElementType;

  return (
    <TagComponent
      ref={containerRef as React.Ref<HTMLElement>}
      className={className}
    >
      <span className={`inline-block ${wrapperClassName}`.trim()}>
        {letterSpans}
      </span>
    </TagComponent>
  );
};

export default SplitText;
