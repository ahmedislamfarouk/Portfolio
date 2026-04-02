import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ahmed Badr | AI Researcher & Robotics Engineer',
  description: 'Engineering the nexus of sentient vision and autonomous control. SOTA research meets championship-level execution.',
  keywords: ['AI Researcher', 'Robotics Engineer', 'Computer Vision', 'Deep Learning', 'ROS 2', 'Autonomous Systems'],
  authors: [{ name: 'Ahmed Badr' }],
  openGraph: {
    title: 'Ahmed Badr | AI Researcher & Robotics Engineer',
    description: 'Engineering the nexus of sentient vision and autonomous control.',
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
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
