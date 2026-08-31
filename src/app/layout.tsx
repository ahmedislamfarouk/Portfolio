import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'Ahmed Badr | AI Researcher & Robotics Engineer',
  description:
    'Engineering the nexus of sentient vision and autonomous control. SOTA research meets championship-level execution. Cyberpunk UI · Neon Aesthetics · Next.js 15.',
  keywords: [
    'Ahmed Badr',
    'AI Researcher',
    'Robotics Engineer',
    'Computer Vision',
    'Deep Learning',
    'ROS 2',
    'Autonomous Systems',
    'Sensor Fusion',
    'Reinforcement Learning',
    'Taekwondo Champion',
    'Portfolio',
    'Cyberpunk',
  ],
  authors: [{ name: 'Ahmed Badr' }],
  openGraph: {
    title: 'Ahmed Badr | AI Researcher & Robotics Engineer',
    description:
      'Engineering the nexus of sentient vision and autonomous control. SOTA research meets championship-level execution.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
