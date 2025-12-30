import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface MorphingTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function MorphingText({ children, delay = 0, className = '' }: MorphingTextProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.52,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
