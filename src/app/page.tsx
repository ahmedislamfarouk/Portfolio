import Navigation from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import About from '@/components/About';
import Contact from '@/components/Contact';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen">
        {/* Navigation — fixed, smooth scroll links */}
        <Navigation />

        {/* Hero — The Entrance: shrink-on-scroll name, typewriter, gradient */}
        <Hero />

        {/* Marquee — The Flow: scroll-velocity driven expertise tags */}
        <Marquee />

        {/* Projects — The Showcase: sticky stack, parallax, tilt cards */}
        <Projects />

        {/* Experience — The Timeline: self-drawing line, alternating entries */}
        <Experience />

        {/* About — The Reveal: count-up stats, bio reveal, tech tags */}
        <About />

        {/* Contact — The Finale: slide-in links, underline animations */}
        <Contact />
      </main>
    </SmoothScrollProvider>
  );
}
