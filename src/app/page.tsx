import Navigation from '@/components/Navigation';
import { Hero, WaveLight, ScrollProgress, MarqueeTicker } from '@/components/Hero';
import Projects from '@/components/Projects';
import Labs from '@/components/Labs';
import Awards from '@/components/Awards';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Background Effects */}
      <WaveLight />
      <ScrollProgress />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Marquee Ticker */}
      <MarqueeTicker />
      
      {/* Projects Section */}
      <Projects />
      
      {/* Research Labs Section */}
      <Labs />
      
      {/* Awards Section */}
      <Awards />
      
      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-sm font-black uppercase tracking-wider text-white mb-1">Ahmed Badr</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em]">AI Researcher & Robotics Engineer</div>
            </div>
            <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
              © 2024 · Built with Next.js 15
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
