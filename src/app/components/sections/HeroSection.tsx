import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WireframeMesh } from '../WireframeMesh';

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

  const annotationsRef = useRef<HTMLDivElement>(null);
  const annotationsRAFRef = useRef(0);

  useEffect(() => {
    if (isMobile || shouldReduceMotion) return;
    const el = annotationsRef.current;
    if (!el) return;

    const handleScroll = () => {
      cancelAnimationFrame(annotationsRAFRef.current);
      annotationsRAFRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const dcEl = document.getElementById('design-cycle');
        if (!dcEl) return;

        const scrollEnd = dcEl.getBoundingClientRect().top + scrollY + dcEl.offsetHeight * 0.7 - window.innerHeight / 2;
        if (scrollEnd <= 0) return;

        const progress = Math.max(0, Math.min(1, scrollY / scrollEnd));

        if (progress === 0) {
          el.style.transform = '';
          return;
        }

        // Exit to the right — accelerate with ease-in curve
        const tx = Math.pow(progress, 0.6) * 110;
        el.style.transform = `translateX(${tx}vw)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(annotationsRAFRef.current);
    };
  }, [isMobile, shouldReduceMotion]);

  // ── Mobile annotation lines ──────────────────────────────────────────────
  const [mobileCoords, setMobileCoords] = useState<{ vw: number; vh: number; anchorY: number } | null>(null);
  const mobileAnchorMeasureRef = useRef<HTMLDivElement>(null);
  const mobileSVGRef = useRef<SVGSVGElement>(null);
  const mobileAnnotationsRAFRef = useRef(0);

  // Measure anchor — same offset as WireframeMesh mobile wrapper
  useEffect(() => {
    if (!isMobile) return;
    const el = mobileAnchorMeasureRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      const anchorY = el.getBoundingClientRect().top + window.innerHeight * 0.1 - 48;
      setMobileCoords({ vw: window.innerWidth, vh: window.innerHeight, anchorY });
    });
    return () => cancelAnimationFrame(id);
  }, [isMobile]);

  // Fade out with scroll — waits until all entry animations finish (2.5s + buffer)
  useEffect(() => {
    if (!isMobile || shouldReduceMotion || !mobileCoords) return;
    const svg = mobileSVGRef.current;
    if (!svg) return;
    const readyAt = Date.now() + 2100; // last annotation enters at 1.4s + 0.5s duration
    const handleScroll = () => {
      cancelAnimationFrame(mobileAnnotationsRAFRef.current);
      mobileAnnotationsRAFRef.current = requestAnimationFrame(() => {
        if (Date.now() < readyAt) return; // don't interfere with entry animations
        const scrollY = window.scrollY;
        const dcEl = document.getElementById('design-cycle');
        if (!dcEl) return;
        const scrollEnd = dcEl.offsetTop + dcEl.offsetHeight * 0.30 - window.innerHeight * 1 + window.innerHeight * 0.7;
        if (scrollEnd <= 0) return;
        const progress = Math.max(0, Math.min(1, scrollY / scrollEnd));
        svg.style.opacity = progress === 0 ? '1' : String(Math.max(0, 1 - progress * 8));
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(mobileAnnotationsRAFRef.current);
    };
  }, [isMobile, shouldReduceMotion, mobileCoords]);

  const annotations = [
    { label: 'The why',  top: '35%', left: '76%', width: '19%', delay: 2.2  },
    { label: 'The how',  top: '48%', left: '80%', width: '15%', delay: 2.55 },
    { label: 'The what', top: '58%', left: '83%', width: '13%', delay: 2.9  },
  ];

  return (
    <section className="relative min-h-[100svh] flex items-start sm:items-center px-4 pt-0 pb-4 sm:px-6 sm:pt-24 sm:pb-6 overflow-hidden">
      {!isMobile && <WireframeMesh isMobile={false} />}

      {!isMobile && (
        <div ref={annotationsRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
          {annotations.map(({ label, top, left, width, delay }) => (
            <motion.div
              key={label}
              className="absolute"
              style={{ top, left, width }}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : delay, ease: [0.19, 1, 0.3, 1] }}
            >
              {/* Label right-aligned above the right end of the line */}
              <p style={{ fontWeight: 200, fontSize: '0.875rem', letterSpacing: '0.03em', marginBottom: '4px', textAlign: 'right' }} className="text-dark">
                {label}
              </p>
              {/* Dot at left anchor + line */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--color-dark)', opacity: 0.45, flexShrink: 0 }} />
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-dark)', opacity: 0.45 }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Mobile annotation lines — anchored to mountain canvas ──────────── */}
      {/* SVG shares exact position/size as the mountain wrapper so coords are
          relative to the canvas regardless of device width.                  */}
      {isMobile && mobileCoords && (() => {
        const { vw, anchorY } = mobileCoords;
        // Dot sits at the mountain's silhouette edge; line extends outward into clear space.
        // Two lines exit LEFT, one exits RIGHT.
        // x/y are canvas-local: x in [0, vw], y in [0, 500].
        const mobileLines = [
          {
            label: 'The why',
            dotX: vw * 0.44, dotY: 22,               // closer to mountain peak
            x1: vw * 0.44,   x2: vw * 0.20, y: 22,  // extends left into clear space
            textAnchor: 'start' as const,
            delay: 0.7,
          },
          {
            label: 'The how',
            dotX: vw * 0.40, dotY: 90,               // left silhouette of mountain mid-body
            x1: vw * 0.40,   x2: vw * 0.08, y: 90,  // extends left into clear space
            textAnchor: 'start' as const,
            delay: 1.05,
          },
          {
            label: 'The what',
            dotX: vw * 0.76, dotY: 120,              // right silhouette of mountain lower body
            x1: vw * 0.76,   x2: vw * 0.94, y: 120, // extends right into clear space
            textAnchor: 'end' as const,
            delay: 1.4,
          },
        ];
        return (
          <svg
            ref={mobileSVGRef}
            style={{
              position: 'fixed',
              top: anchorY,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100vw',
              height: 500,
              pointerEvents: 'none',
              zIndex: 10,
              overflow: 'visible',
            }}
            viewBox={`0 0 ${vw} 500`}
          >
            {mobileLines.map(({ label, dotX, dotY, x1, x2, y, textAnchor, delay }) => (
              <motion.g
                key={label}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : delay, ease: [0.19, 1, 0.3, 1] }}
              >
                <circle cx={dotX} cy={dotY} r={1.5} fill="#999999" fillOpacity={0.45} />
                <line x1={x1} y1={y} x2={x2} y2={y} stroke="#999999" strokeWidth={1} strokeOpacity={0.55} />
                <text
                  x={textAnchor === 'end' ? x2 - 6 : x2 + 6}
                  y={y - 8}
                  fontSize={13}
                  fontWeight={200}
                  fill="#999999"
                  fillOpacity={0.75}
                  textAnchor={textAnchor}
                  style={{ fontFamily: 'inherit', letterSpacing: '0.03em' }}
                >
                  {label}
                </text>
              </motion.g>
            ))}
          </svg>
        );
      })()}

      <div className="relative w-full hero-breakout mx-auto space-y-6 sm:space-y-14 min-w-0 mt-12 sm:-mt-40" style={{ zIndex: 2, transform: isMobile ? undefined : 'translateX(-7%)' }}>
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
          My practice spans the full arc from strategy and research through visual systems, motion, and front-end collaboration. I care about how it looks. I care more about how it works. I care most about the mountain it takes to solve the right problem.
        </motion.p>

        {isMobile && <div ref={mobileAnchorMeasureRef} style={{ height: 0, width: 0 }} />}
        {isMobile && <WireframeMesh isMobile={true} />}
      </div>
    </section>
  );
}
