import { motion } from 'motion/react';

interface IntersectingElementsProps {
  delay?: number;
}

export function IntersectingElements({ delay = 0 }: IntersectingElementsProps) {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Circle from left */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 border border-gray-300/50"
        initial={{ x: -300, opacity: 0 }}
        whileInView={{ x: -50, opacity: 0.8 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{
          duration: 1.5,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          backdropFilter: 'blur(20px)',
        }}
      />

      {/* Square from right */}
      <motion.div
        className="absolute w-56 h-56 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-300/50 shadow-xl"
        initial={{ x: 300, opacity: 0, rotate: 45 }}
        whileInView={{ x: 50, opacity: 0.9, rotate: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{
          duration: 1.5,
          delay: delay + 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          backdropFilter: 'blur(20px)',
        }}
      />

      {/* Text in center */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{
          duration: 1,
          delay: delay + 0.4,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <h2 className="text-6xl">Intersecting</h2>
        <p className="text-gray-600 mt-2">Elements in motion</p>
      </motion.div>
    </div>
  );
}
