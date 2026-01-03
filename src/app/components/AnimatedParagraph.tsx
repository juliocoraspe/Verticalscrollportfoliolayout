import { motion, useInView, useReducedMotion } from 'motion/react';
import { useMemo, useRef } from 'react';

interface AnimatedParagraphProps {
  text: string;
  className?: string;
  startIndex?: number;
  delay?: number;
  stagger?: number;
  distance?: number;
  inView?: boolean;
}

export function AnimatedParagraph({
  text,
  className = '',
  startIndex = 0,
  delay = 0,
  stagger = 0.045,
  distance = 18,
  inView,
}: AnimatedParagraphProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.35, margin: '-80px' });
  const shouldAnimate = inView ?? isInView;
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => {
        const wordDelay = shouldReduceMotion ? 0 : delay + (startIndex + index) * stagger;
        return (
          <motion.span
            key={`${word}-${index}`}
            className="inline-block"
            aria-hidden="true"
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              x: shouldReduceMotion ? 0 : distance,
            }}
            animate={{
              opacity: shouldAnimate || shouldReduceMotion ? 1 : 0,
              x: shouldAnimate || shouldReduceMotion ? 0 : distance,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.7,
              delay: wordDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        );
      })}
    </p>
  );
}
