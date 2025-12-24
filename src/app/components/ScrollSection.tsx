import { motion, useInView } from 'motion/react';
import { useRef, ReactNode } from 'react';

type AnimationDirection = 'left' | 'right' | 'top' | 'bottom' | 'scale' | 'none';

interface ScrollSectionProps {
  children: ReactNode;
  entryDirection?: AnimationDirection;
  exitDirection?: AnimationDirection;
  delay?: number;
  className?: string;
  threshold?: number;
}

export function ScrollSection({
  children,
  entryDirection = 'bottom',
  exitDirection = 'none',
  delay = 0,
  className = '',
  threshold = 0.3,
}: ScrollSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false, 
    amount: threshold,
    margin: "-100px"
  });

  const getEntryVariants = () => {
    const variants: Record<AnimationDirection, any> = {
      left: { x: -100, opacity: 0 },
      right: { x: 100, opacity: 0 },
      top: { y: -100, opacity: 0 },
      bottom: { y: 100, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
      none: { opacity: 0 },
    };
    return variants[entryDirection];
  };

  const getExitVariants = () => {
    if (exitDirection === 'none') return {};
    
    const variants: Record<AnimationDirection, any> = {
      left: { x: -100, opacity: 0 },
      right: { x: 100, opacity: 0 },
      top: { y: -100, opacity: 0 },
      bottom: { y: 100, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
      none: {},
    };
    return variants[exitDirection];
  };

  return (
    <motion.div
      ref={ref}
      initial={getEntryVariants()}
      animate={isInView ? { x: 0, y: 0, scale: 1, opacity: 1 } : getExitVariants()}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative z-20 ${className}`}
    >
      {children}
    </motion.div>
  );
}