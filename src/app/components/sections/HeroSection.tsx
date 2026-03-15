import { Fragment } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type HeroSectionProps = {
  isMobile: boolean;
};

export function HeroSection({ isMobile }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const heroLines = [
    'I design with the precision of someone who builds.',
    'because I know where every decision lands.',
  ];
  const heroText = heroLines.join(' ');
  const heroContainerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };
  const heroWordVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.2, 0.7, 0.2, 1],
      },
    },
  };

  return (
    <section className="min-h-[100svh] flex items-center px-4 pt-20 pb-4 sm:px-6 sm:pt-24 sm:pb-6">
      <div className="w-full hero-breakout mx-auto space-y-14 min-w-0">
        <p className="type-subhead text-dark uppercase">Julio Coraspe - UX/UI Designer</p>

        <motion.h1
          className="type-display-xl text-ink break-words hero-title min-w-0"
          variants={heroContainerVariants}
          initial="hidden"
          animate="show"
          aria-label={heroText}
        >
          {isMobile
            ? heroLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))
            : heroLines.map((line, lineIndex) => {
                const words = line.split(' ');
                return (
                  <span key={line} className="block">
                    {words.map((word, wordIndex) => (
                      <Fragment key={`${lineIndex}-${wordIndex}`}>
                        <motion.span variants={heroWordVariants} className="inline-block" aria-hidden="true">
                          {word}
                        </motion.span>
                        {wordIndex < words.length - 1 ? <span aria-hidden="true"> </span> : null}
                      </Fragment>
                    ))}
                  </span>
                );
              })}
        </motion.h1>

        <motion.p
          className="type-pull-quote text-dark hero-subtitle min-w-0"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.1 : 0.36,
            delay: shouldReduceMotion ? 0 : 0.12,
            ease: [0.19, 1, 0.3, 1],
          }}
        >
          My practice spans the full arc from strategy and research through visual systems, motion, and front-end collaboration — designed to reduce friction between design intent and built reality.
        </motion.p>
      </div>
    </section>
  );
}
