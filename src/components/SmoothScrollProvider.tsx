'use client';

import { useLenis } from '@/hooks/useLenis';

/**
 * Client-side provider that initialises Lenis smooth scrolling
 * and integrates with GSAP ScrollTrigger.
 * Mounted inside the root layout (which is a Server Component).
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis();
  return <>{children}</>;
}
