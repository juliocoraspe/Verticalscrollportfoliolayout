# Motion Portfolio - Scroll States & Animation Triggers Guide

This document outlines the key scroll states and animation triggers for the continuous scroll portfolio experience.

## Overview
The portfolio features a vertical scroll narrative with scroll-linked animations, parallax effects, and an organic particle guide system. Each section has specific entry/exit animations and timing.

---

## Key Scroll States

### 1. **Hero Section** (0% - 15% scroll)
**Trigger:** Page load  
**Animations:**
- Morphing text entry for headline (0.3s delay)
  - Scales from 50% height, 120% width with blur
  - Eases to normal dimensions
- Subheading slides from bottom (0.6s delay)
- Particle cluster appears and begins floating
- Scroll indicator pulses at bottom

**Exit Behavior:** Parallax fade as user scrolls down

---

### 2. **Philosophy Section** (15% - 25% scroll)
**Trigger:** 30% of section visible (threshold: 0.3)  
**Animations:**
- Text block slides in from left
- Parallax speed: -0.3 (moves slower than scroll)
- Exit: slides out to the right when leaving viewport

**Timing:**
- Duration: 1.2s
- Easing: [0.25, 0.46, 0.45, 0.94] (custom ease-out)

---

### 3. **Intersecting Elements** (25% - 35% scroll)
**Trigger:** 50% of section visible  
**Animations:**
- Circle enters from left (-300px → -50px) - 0s delay
- Square enters from right (300px → 50px) with rotation (45° → 0°) - 0.2s delay
- Center text scales up from 0 - 0.4s delay with elastic easing

**Overlap:** Elements intentionally intersect at z-axis levels  
**Glass Effect:** Both shapes have backdrop-blur and transparency

---

### 4. **First Project Card** (35% - 50% scroll)
**Trigger:** 30% visible  
**Animations:**
- Card scales from 0.8 to 1.0
- Image mask reveals from left (clipPath inset)
- Image zooms from 1.2x to 1.0x (Ken Burns effect)
- Text elements stagger in with 0.1s intervals
- Tags appear sequentially with individual delays

**Masking Timeline:**
1. Card appears (0s)
2. Image mask starts revealing (0.2s)
3. Text fades in (0.4s - 0.6s)
4. Tags animate (0.6s - 1.0s)

---

### 5. **Rhythmic Storytelling** (50% - 60% scroll)
**Trigger:** Section enters viewport  
**Animations:**
- Text slides from right, exits to left
- Parallax speed: 0.5 (moves faster than scroll)
- Creates diagonal motion feel

**Typography:** Large display type (text-7xl) for dramatic effect

---

### 6. **Staggered Projects** (60% - 75% scroll)
**Trigger:** Individual 30% visibility per card  
**Animations:**
- First card: enters from left
- Second card: enters from right
- 32px spacing between cards for breathing room
- Each maintains independent scroll trigger

**Rhythm:** Alternating directions create visual cadence

---

### 7. **Floating Quote** (75% - 82% scroll)
**Trigger:** 50% visible  
**Animations:**
- Morphing text effect (same as hero)
- Parallax: -0.2 (subtle depth)
- Italic styling emphasizes voice

---

### 8. **Selected Works Grid** (82% - 92% scroll)
**Trigger:** Staggered per item  
**Animations:**
- Header: bottom entry
- Cards: alternate left/right based on index
- Vertical layout for cards
- 0.1s delay increment per card

**Layout:** 2-column grid on desktop, responsive to 1-column

---

### 9. **Glass Morphism Cards** (92% - 96% scroll)
**Trigger:** Bottom entry with sequential delays  
**Animations:**
- 3 cards: "Craft", "Precision", "Innovation"
- Each delays by 0.15s increment
- Backdrop blur with 30% white overlay
- Subtle scale on entry (0.95 → 1.0)

**Visual Effect:** Polymorphic glass surfaces

---

### 10. **Final CTA** (96% - 100% scroll)
**Trigger:** Sequential morphing  
**Animations:**
- Headline morphs in (0.2s delay)
- Subtext from bottom (0.4s delay)
- Button scales in (0.6s delay)
- Button has hover scale: 1.05

---

## Particle Guide System

### Behavior
**Position:** Fixed, follows scroll progress  
**Movement Pattern:**
- Horizontal: travels across viewport (85vw → 15vw → 80vw...)
- Vertical: 10vh → 90vh linear with scroll
- Mouse: subtle parallax response

**Cluster Composition:**
- 8 particles
- Random offsets: ±20px x/y
- Scale variance: 0.4 - 1.0
- Individual delay: 0 - 0.3s
- Breathing animation: opacity pulses 0.3 → 0.7

**Visual:** White particles with blur, mix-blend-difference for contrast

---

## Parallax Layers

### Speed Reference
- **Fast forward:** 0.5 (moves faster than scroll)
- **Slow backward:** -0.3 (moves slower, opposite)
- **Subtle:** -0.2 or 0.3

### Opacity Fade
All parallax layers fade:
- 0% opacity at viewport entry
- 100% at 30% visible
- 100% until 70% past
- 0% at viewport exit

---

## Animation Easing Guide

### Primary Easing
**Custom cubic-bezier:** [0.25, 0.46, 0.45, 0.94]  
**Character:** Smooth ease-out with slight elastic feel  
**Usage:** Entry/exit animations, transforms

### Secondary Easing
**easeOut:** Standard ease-out  
**Usage:** Text reveals, subtle movements

### Elastic
**cubic-bezier:** [0.34, 1.56, 0.64, 1]  
**Character:** Bouncy, playful  
**Usage:** Intersecting elements center text

---

## Timing Standards

### Durations
- **Fast:** 0.5s - 0.8s (tags, small elements)
- **Medium:** 1.0s - 1.2s (cards, sections)
- **Slow:** 1.5s+ (large imagery, morphing)

### Delays
- **Sequential items:** 0.1s - 0.15s increment
- **Overlapping animations:** 0.2s - 0.4s offset
- **Section stagger:** 0.3s - 0.6s

---

## Viewport Thresholds

### Standard Triggers
- **Default:** 30% (0.3) - balanced visibility
- **Precise:** 50% (0.5) - center-focused
- **Early:** 10% - anticipatory

### Margin
**-100px:** Triggers slightly before element fully enters viewport for smoother perceived performance

---

## Glass Morphism Implementation

### CSS Properties
```css
backdrop-blur-md       /* 12px blur */
bg-white/40           /* 40% white */
border-white/60       /* 60% white border */
rounded-3xl           /* 24px radius */
shadow-xl             /* Multi-layer shadow */
```

### Custom Shadow
```
0 8px 32px rgba(0,0,0,0.04)
0 2px 8px rgba(0,0,0,0.02)
```

---

## Responsive Behavior

### Breakpoints
- **Mobile:** Single column, reduced text sizes
- **Tablet:** 2-column grid where appropriate
- **Desktop:** Full layout as designed

### Motion Reduction
Respect `prefers-reduced-motion` - consider adding queries to disable animations for accessibility

---

## Performance Notes

- **Intersection Observer:** Used for scroll triggers (efficient)
- **Transform-based animations:** GPU accelerated
- **Will-change:** Applied via Motion for optimized painting
- **Image loading:** Consider lazy loading for images below fold

---

## Future Enhancements

1. **Add cursor trail** that interacts with particle guide
2. **Implement smooth scroll** (locomotive-scroll or lenis)
3. **Add section progress indicators**
4. **Include sound design** for premium experience
5. **WebGL background** for depth enhancement

---

This guide serves as a reference for understanding the scroll choreography and can be used to recreate or extend the motion system.
