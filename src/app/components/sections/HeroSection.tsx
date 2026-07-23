import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { motion, useAnimation, useReducedMotion } from 'motion/react';
import { HeroTileFloor } from '../HeroTileFloor';
import { WireframeMesh } from '../WireframeMesh';

type HeroSectionProps = {
  isMobile: boolean;
};

const OVAL_DURATION_SECONDS = 2;
const CONSTRUCTION_LEAD_SECONDS = 1;
const CONSTRUCTION_DURATION_SECONDS = 1.05;

export function HeroSection({ isMobile }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const heroSectionRef = useRef<HTMLElement>(null);
  const constructionProgressRef = useRef(shouldReduceMotion ? 1 : 0);
  const sequenceStartRef = useRef(0);
  const floorTargetRef = useRef({ x: 0, y: 0 });
  const [contentReady, setContentReady] = useState(Boolean(shouldReduceMotion));

  const startSequence = useCallback(() => {
    if (sequenceStartRef.current !== 0) return;
    sequenceStartRef.current = performance.now();
    heroSectionRef.current?.classList.add('hero-native-reveal--running');
  }, []);

  useLayoutEffect(() => {
    if (shouldReduceMotion) {
      constructionProgressRef.current = 1;
      setContentReady(true);
      return;
    }

    constructionProgressRef.current = 0;
    setContentReady(false);
    let animationFrame = 0;
    // The projected base normally starts the sequence during the same layout
    // pass. This short fallback guarantees that a delayed WebGL measurement can
    // never leave the hero paused after refresh.
    const fallbackStart = window.setTimeout(startSequence, 80);
    const constructionStartSeconds = OVAL_DURATION_SECONDS - CONSTRUCTION_LEAD_SECONDS;

    const advanceConstruction = (timestamp: number) => {
      if (sequenceStartRef.current === 0) {
        animationFrame = requestAnimationFrame(advanceConstruction);
        return;
      }
      const elapsedSeconds = (timestamp - sequenceStartRef.current) / 1000;
      constructionProgressRef.current = Math.min(
        1,
        Math.max(
          0,
          (elapsedSeconds - constructionStartSeconds) / CONSTRUCTION_DURATION_SECONDS,
        ),
      );
      if (constructionProgressRef.current < 1) {
        animationFrame = requestAnimationFrame(advanceConstruction);
      } else {
        setContentReady(true);
      }
    };

    animationFrame = requestAnimationFrame(advanceConstruction);
    return () => {
      window.clearTimeout(fallbackStart);
      cancelAnimationFrame(animationFrame);
    };
  }, [shouldReduceMotion, startSequence]);

  const handleProjectedBaseChange = useCallback(({ x, y }: { x: number; y: number }) => {
    const hero = heroSectionRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const rightOffset = isMobile
      ? Math.min(30, Math.max(16, rect.width * 0.0425))
      : Math.min(114, Math.max(68, rect.width * 0.0525));
    floorTargetRef.current = {
      x: x - rect.left + rightOffset,
      y: y - rect.top,
    };
    startSequence();
  }, [isMobile, startSequence]);

  const heroLines = [
    'I design with the precision of someone who builds.',
    'Form follows function.',
    'I make sure of it.',
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
  const opennessRef = useRef(0);
  const annotationItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const annotationOpenRAFRef = useRef(0);
  const mobileAnnotationItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileAnnotationOpenRAFRef = useRef(0);
  const mobileBuildingRef = useRef<HTMLDivElement>(null);
  const mobileBuildingScrollRAFRef = useRef(0);
  const mobileBuildingAutoExpandedRef = useRef(false);
  const [mobileBuildingAutoExpanded, setMobileBuildingAutoExpanded] = useState(false);

  // Drive annotation translateY from building openness each frame.
  // Top annotation follows level3 (goes up), bottom follows level1 (goes down).
  useEffect(() => {
    if (isMobile || shouldReduceMotion) return;
    const OFFSETS = [-14, 42, 68]; // px at openness=1: up / down / down
    const tick = () => {
      const o = opennessRef.current;
      OFFSETS.forEach((offset, i) => {
        const el = annotationItemRefs.current[i];
        if (el) el.style.transform = `translateY(${(offset * o).toFixed(2)}px)`;
      });
      annotationOpenRAFRef.current = requestAnimationFrame(tick);
    };
    annotationOpenRAFRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(annotationOpenRAFRef.current);
  }, [isMobile, shouldReduceMotion]);

  // Same idea on mobile but scaled down to fit the 320px building wrapper.
  useEffect(() => {
    if (!isMobile || shouldReduceMotion) return;
    const OFFSETS = [-12, 0, 14]; // px at openness=1: top up, mid still, bottom down
    const tick = () => {
      const o = opennessRef.current;
      OFFSETS.forEach((offset, i) => {
        const el = mobileAnnotationItemRefs.current[i];
        if (el) el.style.transform = `translateY(${(offset * o).toFixed(2)}px)`;
      });
      mobileAnnotationOpenRAFRef.current = requestAnimationFrame(tick);
    };
    mobileAnnotationOpenRAFRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(mobileAnnotationOpenRAFRef.current);
  }, [isMobile, shouldReduceMotion]);

  useEffect(() => {
    if (!isMobile || shouldReduceMotion) {
      mobileBuildingAutoExpandedRef.current = false;
      setMobileBuildingAutoExpanded(false);
      return;
    }

    const update = () => {
      const el = mobileBuildingRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const expandLine = viewportHeight * 0.8;
      const retractLine = viewportHeight * 0.2;
      const shouldExpand = rect.top <= expandLine && rect.top > retractLine;

      if (mobileBuildingAutoExpandedRef.current !== shouldExpand) {
        mobileBuildingAutoExpandedRef.current = shouldExpand;
        setMobileBuildingAutoExpanded(shouldExpand);
      }
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(mobileBuildingScrollRAFRef.current);
      mobileBuildingScrollRAFRef.current = requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      cancelAnimationFrame(mobileBuildingScrollRAFRef.current);
    };
  }, [isMobile, shouldReduceMotion]);

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

  // ── Strikethrough / replacement sequence ────────────────────────────────────
  const strikethroughControls = useAnimation();
  const replacementControls = useAnimation();

  useEffect(() => {
    if (shouldReduceMotion || !contentReady) return;
    // Keep the revision close to the first reveal instead of waiting several
    // seconds after the hero has already settled.
    const id = setTimeout(async () => {
      await strikethroughControls.start({
        scaleX: 1,
        transition: { duration: 0.35, ease: [0.25, 0, 0.35, 1] },
      });
      await new Promise<void>((r) => setTimeout(r, 40));
      replacementControls.start({
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        transition: { duration: 0.3, ease: [0.19, 1, 0.3, 1] },
      });
    }, 900);
    return () => clearTimeout(id);
  }, [shouldReduceMotion, contentReady, strikethroughControls, replacementControls]);

  // All three lines are right-anchored so their label edges align vertically
  // along the same column near the viewport's right edge.
  const annotations = [
    { label: 'The what', top: '32%', right: '2%', width: '9.1%',  delay: 0.2  },
    { label: 'The how',  top: '50%', right: '2%', width: '10.5%', delay: 0.35 },
    { label: 'The why',  top: '68%', right: '2%', width: '13.3%', delay: 0.5  },
  ];

  return (
    <section
      ref={heroSectionRef}
      id="main-content"
      className="hero-native-reveal relative min-h-[100svh] flex flex-col items-stretch sm:flex-row sm:items-center px-4 pt-0 pb-0 sm:px-6 sm:pt-24 sm:pb-6 overflow-hidden"
    >
      <HeroTileFloor
        durationSeconds={OVAL_DURATION_SECONDS}
        isMobile={isMobile}
        sequenceStartRef={sequenceStartRef}
        targetRef={floorTargetRef}
      />

      {!isMobile && (
        <WireframeMesh
          isMobile={false}
          opennessRef={opennessRef}
          constructionProgressRef={constructionProgressRef}
          onProjectedBaseChange={handleProjectedBaseChange}
        />
      )}

      {!isMobile && (
        <div ref={annotationsRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
          {annotations.map(({ label, top, right, width, delay }, index) => (
            <div
              key={label}
              className="absolute"
              style={{ top, right, width }}
              ref={(el) => { annotationItemRefs.current[index] = el; }}
            >
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={contentReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : delay, ease: [0.19, 1, 0.3, 1] }}
              >
                <p style={{ fontWeight: 200, fontSize: '0.875rem', letterSpacing: '0.03em', marginBottom: '4px', textAlign: 'right' }} className="text-dark">
                  {label}
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--color-dark)', opacity: 0.45, flexShrink: 0 }} />
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-dark)', opacity: 0.45 }} />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      <motion.div
        className="relative w-full hero-breakout mx-auto min-w-0 mt-12 sm:-mt-16"
        style={{ zIndex: 2, pointerEvents: isMobile ? undefined : 'none' }}
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: contentReady ? 1 : 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.18,
          ease: [0.19, 1, 0.3, 1],
        }}
      >
        <div
          className="hero-meta-lockup"
          aria-label="Julio Coraspe: UX/UI Designer with Front-end Implementation Skills"
          style={{ pointerEvents: isMobile ? undefined : 'auto' }}
        >
          <span className="hero-meta-name" aria-hidden="true">Julio Coraspe</span>
          <span className="hero-meta-divider" aria-hidden="true" />
          <span className="hero-meta-role" aria-hidden="true">
            <span className="hero-meta-role-line">UX/UI Designer</span><span className="hero-meta-role-line">with Front-end Implementation Skills</span>
          </span>
        </div>

        <div className="hero-copy-stack space-y-6 sm:space-y-14" style={{ transform: isMobile ? undefined : 'translateX(-7%)' }}>
          <motion.h1
            className="type-display-xl text-ink break-words hero-title min-w-0"
            style={{ pointerEvents: isMobile ? undefined : 'auto' }}
            variants={heroContainerVariants}
            initial="hidden"
            animate={contentReady ? 'show' : 'hidden'}
            aria-label={heroText}
          >
            {isMobile
              ? heroLines.map((line, lineIndex) => (
                  <span key={line} className="block" style={lineIndex === 0 || lineIndex === 1 ? { marginBottom: '0.45em' } : undefined}>
                    {line}
                  </span>
                ))
              : heroLines.map((line, lineIndex) => {
                  const words = line.split(' ');
                  return (
                    <span key={line} className="block" style={lineIndex === 0 || lineIndex === 1 ? { marginBottom: '0.45em' } : undefined}>
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
            style={{ pointerEvents: isMobile ? undefined : 'auto' }}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={contentReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{
              duration: shouldReduceMotion ? 0.1 : 0.36,
              delay: shouldReduceMotion ? 0 : 0.12,
              ease: [0.19, 1, 0.3, 1],
            }}
          >
            My practice spans the full arc from strategy and research through visual systems, motion, and front-end collaboration, anchored in accessibility and AI-driven workflows. I care about how it looks. I care more about how it works. I care most about{' '}
            <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'baseline' }}>
              <span style={{ position: 'relative' }}>
                pouring the concrete before painting it.
                <motion.span
                  aria-hidden="true"
                  initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                  animate={strikethroughControls}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    marginTop: '-0.5px',
                    height: '1px',
                    width: '100%',
                    backgroundColor: 'currentColor',
                    transformOrigin: 'left center',
                    display: 'block',
                    opacity: 0.8,
                  }}
                />
              </span>
              <motion.span
                initial={
                  shouldReduceMotion
                    ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
                    : { clipPath: 'inset(0 100% 0 0)', opacity: 0 }
                }
                animate={replacementControls}
                style={{ paddingTop: '0.1em' }}
              >
                designing the structure before the surface.
              </motion.span>
            </span>
          </motion.p>
        </div>

      </motion.div>

      {/* Mobile: static building (left half) + 3 right-side pointers between
          hero copy and the next section. No grow/fade — only the 3-level
          separation triggers on tap. Pointers translateY follows opennessRef
          (top up, mid still, bottom down) so they keep tracking each level
          as the building expands. Order matches desktop: The what / The how /
          The why mapped to level3 (roof) / level2 (mid) / level1 (base). */}
      {isMobile && (
        <div className="hero-mobile-animation relative w-full" style={{ zIndex: 2 }}>
          <div className="relative" style={{ width: '100%' }}>
            {/* Building pinned to the left half so the right half is clear for
                the pointer labels. */}
            <div ref={mobileBuildingRef} className="hero-mobile-building" style={{ width: '60%', marginLeft: '-4%' }}>
              <WireframeMesh
                isMobile
                mobileStatic
                opennessRef={opennessRef}
                mobileAutoExpanded={mobileBuildingAutoExpanded}
                constructionProgressRef={constructionProgressRef}
                onProjectedBaseChange={handleProjectedBaseChange}
              />
            </div>

            {/* Pointers anchored right-edge, vertically aligned at the same
                column. Top, middle, bottom map to level3 / level2 / level1.
                Y values match the openness offsets defined above. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 3 }}
            >
              {[
                { label: 'The what', top: '28%' },
                { label: 'The how',  top: '40%' },
                { label: 'The why',  top: '52%' },
              ].map(({ label, top }, i) => (
                <motion.div
                  key={label}
                  className="absolute"
                  style={{ top, right: '4%', width: '36%' }}
                  ref={(el) => { mobileAnnotationItemRefs.current[i] = el; }}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: contentReady ? 1 : 0 }}
                  transition={{
                    duration: 0.5,
                    delay: shouldReduceMotion ? 0 : 0.1 + i * 0.1,
                    ease: [0.19, 1, 0.3, 1],
                  }}
                >
                  <p
                    className="text-dark"
                    style={{
                      fontWeight: 200,
                      fontSize: 13,
                      letterSpacing: '0.03em',
                      marginBottom: 4,
                      textAlign: 'right',
                    }}
                  >
                    {label}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-dark)',
                        opacity: 0.45,
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: 'var(--color-dark)',
                        opacity: 0.45,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
