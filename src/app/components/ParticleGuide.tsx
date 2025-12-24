import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { useEffect, useState, useRef, useMemo } from 'react';

export function ParticleGuide() {
  const { scrollYProgress } = useScroll();
  const [mouseInfluence, setMouseInfluence] = useState({ x: 0, y: 0 });
  const time = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create 300 particles with multi-layered organic distribution - memoized to ensure consistency
  const particles = useMemo(() => {
    return Array.from({ length: 300 }, (_, i) => {
      // Create layers of particles for organic depth
      const layer = Math.floor(i / 20);
      const angleInLayer = (i % 20 / 20) * Math.PI * 2;
      const radiusBase = 15 + layer * 12;
      const radiusVariation = Math.random() * 15;
      
      // Add turbulence offsets for each particle
      const turbulencePhase = Math.random() * Math.PI * 2;
      const turbulenceAmplitude = 5 + Math.random() * 15;
      
      return {
        id: i,
        baseX: Math.cos(angleInLayer) * (radiusBase + radiusVariation),
        baseY: Math.sin(angleInLayer) * (radiusBase + radiusVariation),
        scale: 0.4 + Math.random() * 0.5,
        delay: Math.random() * 0.4,
        layer: layer,
        speed: 0.7 + Math.random() * 0.6,
        turbulencePhase,
        turbulenceAmplitude,
        wavePhase: Math.random() * Math.PI * 2,
        spiralOffset: Math.random() * 0.3,
      };
    });
  }, []); // Empty dependency array - only create once

  // Smooth spring physics for organic movement
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
    mass: 0.8,
  });

  // Scroll-based positioning: Guide attention to reading start points (titles, subtitles, bullet headers)
  const x = useTransform(
    smoothScrollProgress,
    [
      0.01,     // Hero - start hidden
      0.03,  // Hero title (left edge)
      0.10,  // Hero text ends - fade out
      0.13,  // Philosophy title enters
      0.18,  // Philosophy paragraph - fade out
      0.22,  // Expertise section title
      0.26,  // Expertise cards (left align with first card title)
      0.32,  // Expertise ends - fade out
      0.35,  // Case Study 1 title enters
      0.38,  // Case Study 1 hero image - stay left
      0.41,  // Problem section title
      0.44,  // Research section title
      0.47,  // Research insights (bullet points) - vertical guide
      0.51,  // Strategy section title
      0.54,  // Design section title
      0.58,  // Prototype section title
      0.61,  // Implementation section title
      0.64,  // Outcome section - fade out
      0.67,  // Case Study 2 title enters
      0.70,  // Case Study 2 sections begin
      0.75,  // Mid case study - guiding through sections
      0.80,  // Case study ends - fade out
      0.83,  // Exploratory Gallery title
      0.87,  // Gallery grid - fade out
      0.90,  // How I Work section title
      0.94,  // Process steps (bullet-style sections)
      0.97,  // Footer "Let's Collaborate" - reposition for impact
      0.985, // Impact moment
      1      // Disperse and disappear
    ],
    [
      '-1vw', // Start off-screen
      '8vw',   // Hero title left edge
      '8vw',   // Stay during hero text
      '8vw',   // Philosophy title
      '-50vw', // Fade out during philosophy text
      '8vw',   // Expertise title left edge
      '10vw',  // Align with expertise cards
      '-50vw', // Exit during text-heavy area
      '8vw',   // Case Study 1 title
      '8vw',   // Stay left during hero image
      '8vw',   // Problem title
      '8vw',   // Research title
      '10vw',  // Research bullet points (slightly right)
      '8vw',   // Strategy title
      '8vw',   // Design title
      '8vw',   // Prototype title
      '8vw',   // Implementation title
      '-50vw', // Exit outcome
      '8vw',   // Case Study 2 title
      '5vw',   // Guide through sections
      '1vw',   // Continue guiding
      '-50vw', // Exit case study
      '8vw',   // Gallery title
      '-50vw', // Exit during gallery grid
      '8vw',   // How I Work title
      '10vw',  // Process step bullets
      '50vw',  // Center for footer impact
      '50vw',  // Hold center for impact
      '50vw'   // Disperse from center
    ]
  );

  const y = useTransform(
    smoothScrollProgress,
    [
      0.01,     // Hero start
      0.03,  // Hero title top
      0.10,  // Hero end
      0.13,  // Philosophy title
      0.18,  // Philosophy end
      0.22,  // Expertise title
      0.26,  // Expertise cards top
      0.32,  // Expertise end
      0.35,  // Case Study 1 title
      0.38,  // CS1 hero
      0.41,  // Problem
      0.44,  // Research
      0.47,  // Research bullets
      0.51,  // Strategy
      0.54,  // Design
      0.58,  // Prototype
      0.61,  // Implementation
      0.64,  // Outcome
      0.67,  // Case Study 2
      0.70,  // CS2 sections
      0.75,  // CS2 mid
      0.80,  // CS2 end
      0.83,  // Gallery
      0.87,  // Gallery grid
      0.90,  // How I Work
      0.94,  // Process steps
      0.97,  // Footer title top
      0.985, // Impact drop
      1      // Final
    ],
    [
      '50vh', // Start center
      '25vh', // Hero title position
      '40vh', // Rise during hero
      '30vh', // Philosophy title
      '45vh', // Philosophy end
      '30vh', // Expertise title
      '35vh', // Expertise cards
      '50vh', // Rise out
      '58vh', // CS1 title
      '32vh', // CS1 hero
      '26vh', // Problem
      '40vh', // Research
      '45vh', // Research bullets - guide down
      '50vh', // Strategy
      '54vh', // Design
      '58vh', // Prototype
      '62vh', // Implementation
      '70vh', // Outcome rise
      '28vh', // CS2 title
      '35vh', // CS2 sections
      '45vh', // CS2 mid
      '60vh', // CS2 end rise
      '30vh', // Gallery title
      '50vh', // Gallery grid
      '30vh', // How I Work title
      '40vh', // Process steps
      '25vh', // Footer title top
      '50vh', // Drop to center for impact
      '80vh'  // Disperse downward
    ]
  );

  // Opacity control: Fade out in text-heavy areas, reappear for titles
  const opacity = useTransform(
    smoothScrollProgress,
    [
      0.01,     // Hidden at start
      0.03,  // Fade in for hero
      0.10,  // Fade out during hero text
      0.13,  // Reappear for philosophy title
      0.18,  // Fade out during philosophy text
      0.22,  // Reappear for expertise
      0.32,  // Fade out after expertise
      0.35,  // Reappear for CS1
      0.64,  // Fade out after CS1
      0.67,  // Reappear for CS2
      0.80,  // Fade out after CS2
      0.83,  // Reappear for gallery title
      0.87,  // Fade out during gallery
      0.90,  // Reappear for How I Work
      0.97,  // Full opacity for footer
      0.985, // Hold during impact
      1      // Fade out completely
    ],
    [
      0,    // Hidden
      1,    // Visible
      0,    // Hidden in text
      1,    // Visible
      0,    // Hidden in text
      1,    // Visible
      0,    // Hidden
      1,    // Visible
      0,    // Hidden
      1,    // Visible
      0,    // Hidden
      1,    // Visible
      0,    // Hidden
      0.5,    // Visible
      0.6,    // Full for footer
      0.7,    // Hold
      0     // Final disappear
    ]
  );

  // Continuous time update for organic animation
  useEffect(() => {
    let lastTime = Date.now();
    let animationFrame: number;
    
    const animate = () => {
      const currentTime = Date.now();
      const delta = currentTime - lastTime;
      time.set(time.get() + delta);
      lastTime = currentTime;
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [time]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Subtle mouse influence on flock
      const dx = (e.clientX - window.innerWidth / 2) / 250;
      const dy = (e.clientY - window.innerHeight / 2) / 250;
      setMouseInfluence({ x: dx, y: dy });
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-10"
      style={{ 
        x, 
        y,
        position: 'fixed' 
      }}
      ref={containerRef}
    >
      <div className="relative">
        {particles.map((particle) => {
          return (
            <Particle
              key={particle.id}
              particle={particle}
              smoothScrollProgress={smoothScrollProgress}
              time={time}
              mouseInfluence={mouseInfluence}
              opacity={opacity}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

// Separate component for each particle to avoid hooks in loops
function Particle({ 
  particle, 
  smoothScrollProgress, 
  time, 
  mouseInfluence,
  opacity
}: { 
  particle: any; 
  smoothScrollProgress: any; 
  time: any; 
  mouseInfluence: { x: number; y: number }; 
  opacity: any;
}) {
  // Create dynamic transforms based on time and scroll
  const particleX = useTransform(
    [smoothScrollProgress, time],
    ([scroll, t]: any) => {
      // Multiple wave frequencies for complex movement
      const wave1 = Math.sin(scroll * Math.PI * 15 + t * 0.001) * 50;
      const wave2 = Math.cos(scroll * Math.PI * 8 + t * 0.0015) * 30;
      
      // Individual turbulence
      const turbulence = Math.sin(t * 0.002 + particle.turbulencePhase) * particle.turbulenceAmplitude;
      
      // Wave ripple
      const waveRipple = Math.sin(scroll * Math.PI * 20 + t * 0.002 + particle.wavePhase) * 15;
      
      // Swirl effect
      const swirl = Math.sin(scroll * Math.PI * 14 + t * 0.001) * 0.8;
      const distance = Math.sqrt(particle.baseX ** 2 + particle.baseY ** 2);
      const angle = Math.atan2(particle.baseY, particle.baseX);
      const swirlAngle = angle + swirl * particle.spiralOffset;
      const swirlX = Math.cos(swirlAngle) * distance;
      
      // Combine deformations
      const stretchFactor = 1 + (wave1 + wave2) / 90;
      return swirlX * stretchFactor + turbulence + waveRipple * Math.cos(angle) + mouseInfluence.x * particle.scale * 10;
    }
  );

  const particleY = useTransform(
    [smoothScrollProgress, time],
    ([scroll, t]: any) => {
      // Vertical pulsing
      const pulse1 = Math.sin(scroll * Math.PI * 12 + t * 0.0012) * 35;
      const pulse2 = Math.cos(scroll * Math.PI * 18 + t * 0.0008) * 25;
      
      // Individual turbulence
      const turbulence = Math.cos(t * 0.0025 + particle.turbulencePhase) * particle.turbulenceAmplitude;
      
      // Wave ripple
      const waveRipple = Math.sin(scroll * Math.PI * 20 + t * 0.002 + particle.wavePhase) * 15;
      
      // Swirl effect
      const swirl = Math.sin(scroll * Math.PI * 14 + t * 0.001) * 0.8;
      const distance = Math.sqrt(particle.baseX ** 2 + particle.baseY ** 2);
      const angle = Math.atan2(particle.baseY, particle.baseX);
      const swirlAngle = angle + swirl * particle.spiralOffset;
      const swirlY = Math.sin(swirlAngle) * distance;
      
      // Combine deformations
      const stretchFactor = 5 + (pulse1 + pulse2) / 60;
      return swirlY * stretchFactor + turbulence + waveRipple * Math.sin(angle) + mouseInfluence.y * particle.scale * 8;
    }
  );

  const particleRotation = useTransform(
    smoothScrollProgress,
    (scroll) => {
      const rotate1 = Math.sin(scroll * Math.PI * 10) * 20;
      const rotate2 = Math.cos(scroll * Math.PI * 6) * 12;
      return rotate1 + rotate2;
    }
  );

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        x: particleX,
        y: particleY,
        rotate: particleRotation,
        opacity: opacity,
        width: '2.5px',
        height: '2.5px',
        backgroundColor: '#6b7280',
        filter: 'blur(2px)',
        willChange: 'transform',
      }}
      initial={{ scale: 0 }}
      animate={{
        scale: particle.scale,
      }}
      transition={{
        scale: {
          delay: particle.delay,
          duration: 0.9,
        },
      }}
    />
  );
}