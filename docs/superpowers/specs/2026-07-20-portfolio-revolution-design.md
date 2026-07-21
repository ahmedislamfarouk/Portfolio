# Portfolio Revolution — Design Spec

**Date:** 2026-07-20
**Inspiration:** rauno.me × Cyberpunk × Cinematic

## Core Components

### 1. Split-Letter Text System (`<SplitText>`)
Reusable component that splits text into individual `<motion.span>` characters.
- Configurable entrance: drop-in, fade-up, scramble glitch
- Configurable per-letter stagger delay
- Configurable hover effect: sway, glitch, none
- Wraps any heading/text element

### 2. Cinematic Hero Entrance
- "AHMED" — letters drop from above with glitch scramble, staggered 0.3s apart
- Particles burst per letter drop
- Shockwave ring expands after "AHMED" settles
- "BADR" explodes from center with neon glow bloom
- Typewriter role follows after name settles

### 3. Enhanced Particle Starfield
- 200+ particles with mouse attraction
- Constellation connections between nearby particles
- Particle bursts synced with hero entrance milestones

### 4. Section-Reveal System
- All section headings use SplitText with stagger
- Content follows with staggered entrance
- Scroll-driven progress tracking

### 5. 3D Interactive Cards
- Mouse-driven tilt via useMotionValue/useTransform
- Multi-layer depth (image, text, icons)
- Neon glow follows cursor

### 6. Custom Gradient Images
- CSS gradient meshes replacing Unsplash stock
- Per-project color themes
- Animated with subtle motion

### 7. Global Micro-interactions
- Custom cursor glow dot
- Magnetic hover on buttons
- Mouse parallax on decorative elements

## Implementation Order
1. SplitText component
2. Hero rewrite (cinematic entrance + particle field)
3. Section heading animations
4. 3D card tilt
5. Gradient images
6. Global polish
7. Build verification + GitHub push
