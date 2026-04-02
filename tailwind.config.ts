import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Archivo', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'base-950': '#000000',
        'base-900': '#0A0A0A',
        'base-800': '#141414',
        'base-700': '#1F1F1F',
        'accent-primary': '#FFFFFF',
        'accent-muted': '#71717A',
        'accent-subtle': '#27272A',
        'accent-cyan': '#06B6D4',
        'accent-blue': '#2563EB',
        'accent-cyan-dim': '#0891B2',
      },
      borderRadius: {
        'bento': '2rem',
        'inner': '1rem',
      },
      letterSpacing: {
        'ultra': '-0.07em',
      },
      lineHeight: {
        'ultra': '0.82',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'reveal': 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
