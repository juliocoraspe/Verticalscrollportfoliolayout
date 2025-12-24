import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className = '', delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.4, ease: 'easeOut' },
      }}
      className={`relative bg-[#fafcfc] rounded-lg overflow-hidden z-20 ${className}`}
      style={{
        boxShadow: '-5px -5px 10px 0px white, 5px 5px 10px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      {children}
    </motion.div>
  );
}