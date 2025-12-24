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

  // Path that exits briefly at section starts then returns to guide
  const x = useTransform(
    smoothScrollProgress,
    [
      0,    // Hero start
      0.05, // Quickly visible
      0.12, // Exit right for Philosophy section
      0.16, // Return immediately
      0.22, // Move through
      0.28, // Exit left for Expertise
      0.32, // Return
      0.38, // Guide through
      0.44, // Exit right for Case Study 1
      0.48, // Return
      0.56, // Navigate
      0.62, // Exit left 
      0.66, // Return for Case Study 2
      0.72, // Move
      0.78, // Exit right for Gallery
      0.82, // Return
      0.88, // Guide to end
      0.94, // Exit for Contact
      0.98, // Return briefly
      1     // Final exit
    ],
    [
      '10vw',  // Start
      '25vw',  // Visible
      '105vw', // Exit right (off screen)
      '20vw',  // Return
      '65vw',  // Center-right
      '-15vw', // Exit left (off screen)
      '30vw',  // Return
      '70vw',  // Right
      '110vw', // Exit right
      '35vw',  // Return
      '55vw',  // Center
      '-10vw', // Exit left
      '40vw',  // Return
      '60vw',  // Right
      '108vw', // Exit right
      '45vw',  // Return
      '50vw',  // Center
      '115vw', // Exit for contact
      '50vw',  // Brief return
      '120vw'  // Final exit
    ]
  );

  const y = useTransform(
    smoothScrollProgress,
    [
      0, 0.08, 0.15, 0.22, 0.3, 0.38, 0.45, 0.52, 0.6, 0.68, 0.75, 0.82, 0.9, 0.95, 1
    ],
    [
      '15vh', '30vh', '20vh', '45vh', '35vh', '55vh', '42vh', '60vh', '48vh', '68vh', '55vh', '75vh', '65vh', '82vh', '90vh'
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
  mouseInfluence 
}: { 
  particle: any; 
  smoothScrollProgress: any; 
  time: any; 
  mouseInfluence: { x: number; y: number }; 
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
      const stretchFactor = 1 + (wave1 + wave2) / 100;
      return swirlX * stretchFactor + turbulence + waveRipple * Math.cos(angle) + mouseInfluence.x * particle.scale * 8;
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
      const stretchFactor = 1 + (pulse1 + pulse2) / 100;
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
      className="absolute rounded-full bg-gray-500"
      style={{
        x: particleX,
        y: particleY,
        rotate: particleRotation,
        width: '5px',
        height: '5px',
        filter: 'blur(0.5px)',
        willChange: 'transform',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.1, 0.2, 0.1],
        scale: particle.scale,
      }}
      transition={{
        opacity: {
          duration: 1.8 + particle.delay,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: particle.layer * 0.03,
        },
        scale: {
          delay: particle.delay,
          duration: 0.6,
        },
      }}
    />
  );
}
