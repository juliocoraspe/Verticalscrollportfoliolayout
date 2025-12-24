import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface MorphingTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function MorphingText({ children, delay = 0, className = '' }: MorphingTextProps) {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        scaleY: 0.5, 
        scaleX: 1.2,
        filter: 'blur(10px)' 
      }}
      whileInView={{ 
        opacity: 1, 
        scaleY: 1, 
        scaleX: 1,
        filter: 'blur(0px)' 
      }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
