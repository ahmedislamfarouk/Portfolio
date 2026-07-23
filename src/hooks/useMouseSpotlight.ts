import { useRef, useCallback, type MouseEvent } from 'react';

export function useMouseSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent<T>) => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const element = ref.current || (event.currentTarget as T);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const rawX = ((event.clientX - rect.left) / rect.width) * 100;
    const rawY = ((event.clientY - rect.top) / rect.height) * 100;

    const spotlightX = Math.max(0, Math.min(100, rawX));
    const spotlightY = Math.max(0, Math.min(100, rawY));

    element.style.setProperty('--spotlight-x', `${spotlightX.toFixed(2)}%`);
    element.style.setProperty('--spotlight-y', `${spotlightY.toFixed(2)}%`);
  }, []);

  const handleMouseLeave = useCallback((event: MouseEvent<T>) => {
    const element = ref.current || (event.currentTarget as T);
    if (!element) return;

    element.style.removeProperty('--spotlight-x');
    element.style.removeProperty('--spotlight-y');
  }, []);

  return {
    ref,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
