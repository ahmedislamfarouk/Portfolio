import Navigation from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero — Neural Network Explorer */}
      <Hero />

      {/* Work — Neural Activity */}
      <Projects />

      {/* About — System Specs */}
      <About />

      {/* Contact — Uplink */}
      <Contact />
    </main>
  );
}
