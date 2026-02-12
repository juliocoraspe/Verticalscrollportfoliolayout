import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { animate } from 'motion';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type UIEvent,
} from 'react';
import { ScrollSection } from './ScrollSection';
import { RESUME_URL } from '../data/about';

type MotionGardenProps = {
  onExit: () => void;
};

type NavigationState = 'Home' | 'Favorites' | 'Cart' | 'Settings';
type FeedbackState = 'idle' | 'loading' | 'success';

const NAVIGATION_STATES: NavigationState[] = ['Home', 'Favorites', 'Cart', 'Settings'];

const depthGridStyle: CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, var(--color-pale) 1px, transparent 1px), linear-gradient(to bottom, var(--color-pale) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
};

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const getStage = (progress: number, start: number, end: number) => {
  if (start === end) return 0;
  return clamp((progress - start) / (end - start));
};

interface MotionCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  onCta: () => void;
  children: ReactNode;
}

function MotionCard({ title, description, ctaLabel, onCta, children }: MotionCardProps) {
  return (
    <article className="border border-pale bg-pure p-8 sm:p-10 h-auto sm:h-[486px] lg:h-[504px] overflow-visible sm:overflow-hidden">
      <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-14">
        <div className="space-y-4">
          <div className="space-y-5">
            <h3 className="type-display-m text-ink">{title}</h3>
            <div className="h-px bg-pale" />
            <p className="type-body text-dark">{description}</p>
          </div>
          <button
            type="button"
            onClick={onCta}
            className="type-subhead text-dark text-left transition-colors hover:text-accent"
          >
            {ctaLabel}
          </button>
        </div>
        <div className="border border-pale bg-base p-5 sm:p-6 h-full min-h-[260px]">{children}</div>
      </div>
    </article>
  );
}

export function MotionGarden({ onExit }: MotionGardenProps) {
  const shouldReduceMotion = useReducedMotion();

  const [navigationState, setNavigationState] = useState<NavigationState>('Favorites');
  const [depthProgress, setDepthProgress] = useState(0);
  const depthScrollerRef = useRef<HTMLDivElement | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const pendingScrollProgressRef = useRef(0);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  const feedbackTimeoutRef = useRef<number | null>(null);
  const feedbackResetRef = useRef<number | null>(null);
  const feedbackResetCompleteRef = useRef<number | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isFeedbackResetting, setIsFeedbackResetting] = useState(false);
  const navigationStageRef = useRef<HTMLDivElement | null>(null);
  const [detailRect, setDetailRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    containerWidth: number;
    containerHeight: number;
  } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const swipeItemRef = useRef<HTMLDivElement | null>(null);
  const swipePointerIdRef = useRef<number | null>(null);
  const swipeStartXRef = useRef(0);
  const swipeStartOffsetRef = useRef(0);
  const swipeOffsetRef = useRef(0);
  const swipeAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const [actionState, setActionState] = useState<'default' | 'saved' | 'removed'>('default');
  const [isSaved, setIsSaved] = useState(false);
  const [swipeOpacity, setSwipeOpacity] = useState(1);
  const swipeResetTimeoutRef = useRef<number | null>(null);

  const getFeedbackErrorMessage = (value: string) => {
    if (!value) return '';
    if (value === 'Love') return '';
    if (/[l]/.test(value) && !/[L]/.test(value)) {
      return "Use a capital L: type 'Love'.";
    }
    return "Please type 'Love'.";
  };

  const isFeedbackValid = feedbackInput === 'Love';
  const feedbackError = getFeedbackErrorMessage(feedbackInput);
  const showFeedbackError = Boolean(feedbackError);

  const cycleNavigationState = useCallback(() => {
    setNavigationState((current) => {
      const currentIndex = NAVIGATION_STATES.indexOf(current);
      const nextIndex = (currentIndex + 1) % NAVIGATION_STATES.length;
      return NAVIGATION_STATES[nextIndex];
    });
  }, []);

  const handleDepthScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const maxScroll = event.currentTarget.scrollHeight - event.currentTarget.clientHeight;
    const nextProgress = maxScroll <= 0 ? 0 : event.currentTarget.scrollTop / maxScroll;
    pendingScrollProgressRef.current = Math.min(Math.max(nextProgress, 0), 1);
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = requestAnimationFrame(() => {
      setDepthProgress(pendingScrollProgressRef.current);
      scrollFrameRef.current = null;
    });
  }, []);

  const openDetailView = useCallback((event: ReactPointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    const container = navigationStageRef.current;
    if (!container) return;
    const target = event.currentTarget;
    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setDetailRect({
      x: targetRect.left - containerRect.left,
      y: targetRect.top - containerRect.top,
      width: targetRect.width,
      height: targetRect.height,
      containerWidth: containerRect.width,
      containerHeight: containerRect.height,
    });
    setIsDetailOpen(true);
  }, []);

  const closeDetailView = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isDetailOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDetailOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isDetailOpen]);

  const setSwipeOffsetValue = useCallback((value: number) => {
    swipeOffsetRef.current = value;
    setSwipeOffset(value);
  }, []);

  const getSwipeMetrics = useCallback(() => {
    const width = swipeItemRef.current?.offsetWidth ?? 0;
    const maxReveal = Math.min(width * 0.6, Math.max(160, width * 0.55));
    const threshold = Math.min(maxReveal * 0.6, width * 0.4);
    return { maxReveal, threshold };
  }, []);

  const handleSwipeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const metrics = getSwipeMetrics();
      if (swipeAnimationRef.current) {
        swipeAnimationRef.current.stop();
      }
      event.preventDefault();
      swipePointerIdRef.current = event.pointerId;
      swipeStartXRef.current = event.clientX;
      swipeStartOffsetRef.current = isSwipeOpen ? -metrics.maxReveal : swipeOffsetRef.current;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [getSwipeMetrics, isSwipeOpen]
  );

  const handleSwipeMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (swipePointerIdRef.current !== event.pointerId) return;
      const { maxReveal } = getSwipeMetrics();
      const delta = event.clientX - swipeStartXRef.current;
      const nextOffset = Math.min(Math.max(swipeStartOffsetRef.current + delta, -maxReveal), 0);
      setSwipeOffsetValue(nextOffset);
    },
    [getSwipeMetrics, setSwipeOffsetValue]
  );

  const handleSwipeEnd = useCallback(() => {
    if (swipePointerIdRef.current === null) return;
    swipePointerIdRef.current = null;
    const { maxReveal, threshold } = getSwipeMetrics();
    const shouldOpen = Math.abs(swipeOffsetRef.current) > threshold && swipeOffsetRef.current < 0;
    const target = shouldOpen ? -maxReveal : 0;
    setIsSwipeOpen(shouldOpen);
    if (swipeAnimationRef.current) {
      swipeAnimationRef.current.stop();
    }
    swipeAnimationRef.current = animate(swipeOffsetRef.current, target, {
      duration: shouldReduceMotion ? 0.01 : 0.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setSwipeOffsetValue,
    });
  }, [getSwipeMetrics, setSwipeOffsetValue, shouldReduceMotion]);

  const triggerSwipeHint = useCallback(() => {
    const { maxReveal } = getSwipeMetrics();
    if (swipeAnimationRef.current) {
      swipeAnimationRef.current.stop();
    }
    if (isSwipeOpen) {
      swipeAnimationRef.current = animate(swipeOffsetRef.current, 0, {
        duration: shouldReduceMotion ? 0.01 : 0.26,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: setSwipeOffsetValue,
      });
      setIsSwipeOpen(false);
      return;
    }
    swipeAnimationRef.current = animate(swipeOffsetRef.current, -maxReveal, {
      duration: shouldReduceMotion ? 0.01 : 0.32,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setSwipeOffsetValue,
    });
    setIsSwipeOpen(true);
    swipeAnimationRef.current.finished.then(() => {
      if (shouldReduceMotion) return;
      swipeAnimationRef.current = animate(-maxReveal, 0, {
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: setSwipeOffsetValue,
      });
      setIsSwipeOpen(false);
    });
  }, [getSwipeMetrics, isSwipeOpen, setSwipeOffsetValue, shouldReduceMotion]);

  const closeSwipe = useCallback(
    (duration = 0.3) => {
      if (swipeAnimationRef.current) {
        swipeAnimationRef.current.stop();
      }
      swipeAnimationRef.current = animate(swipeOffsetRef.current, 0, {
        duration: shouldReduceMotion ? 0.01 : duration,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: setSwipeOffsetValue,
      });
      setIsSwipeOpen(false);
    },
    [setSwipeOffsetValue, shouldReduceMotion]
  );

  const handleSaveAction = useCallback(() => {
    setActionState('saved');
    setIsSaved(true);
    closeSwipe(0.28);
  }, [closeSwipe]);

  const handleRemoveAction = useCallback(() => {
    setActionState('removed');
    setIsSaved(false);
    setIsSwipeOpen(false);
    closeSwipe(0.2);
    setSwipeOpacity(0);
    if (swipeResetTimeoutRef.current !== null) {
      window.clearTimeout(swipeResetTimeoutRef.current);
    }
    swipeResetTimeoutRef.current = window.setTimeout(() => {
      setActionState('default');
      setSwipeOpacity(1);
    }, shouldReduceMotion ? 0 : 1800);
  }, [closeSwipe, shouldReduceMotion]);

  const nudgeDepthScroll = useCallback(() => {
    const scroller = depthScrollerRef.current;
    if (!scroller) return;
    const maxScroll = Math.max(scroller.scrollHeight - scroller.clientHeight, 0);
    const nextTop = Math.min(scroller.scrollTop + scroller.clientHeight * 0.45, maxScroll);
    scroller.scrollTo({ top: nextTop, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  }, [shouldReduceMotion]);

  const triggerFeedback = useCallback(() => {
    if (!isFeedbackValid) return;
    if (feedbackState === 'loading') return;
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    if (feedbackResetRef.current !== null) {
      window.clearTimeout(feedbackResetRef.current);
    }
    if (feedbackResetCompleteRef.current !== null) {
      window.clearTimeout(feedbackResetCompleteRef.current);
    }
    setFeedbackState('loading');
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedbackState('success');
      feedbackTimeoutRef.current = null;
      feedbackResetRef.current = window.setTimeout(() => {
        setIsFeedbackResetting(true);
        feedbackResetCompleteRef.current = window.setTimeout(() => {
          setFeedbackInput('');
          setFeedbackState('idle');
          setIsFeedbackResetting(false);
          feedbackResetCompleteRef.current = null;
        }, shouldReduceMotion ? 0 : 360);
        feedbackResetRef.current = null;
      }, shouldReduceMotion ? 0 : 850);
    }, shouldReduceMotion ? 0 : 1050);
  }, [feedbackState, isFeedbackValid, shouldReduceMotion]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current !== null) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
      if (feedbackResetRef.current !== null) {
        window.clearTimeout(feedbackResetRef.current);
      }
      if (feedbackResetCompleteRef.current !== null) {
        window.clearTimeout(feedbackResetCompleteRef.current);
      }
      if (swipeAnimationRef.current) {
        swipeAnimationRef.current.stop();
      }
      if (swipeResetTimeoutRef.current !== null) {
        window.clearTimeout(swipeResetTimeoutRef.current);
      }
    };
  }, []);

  const heroStage = getStage(depthProgress, 0.05, 0.2);
  const rightStage = getStage(depthProgress, 0.25, 0.4);
  const secondStage = getStage(depthProgress, 0.4, 0.55);
  const footerStage = getStage(depthProgress, 0.6, 0.75);
  const footerInnerStage = getStage(depthProgress, 0.68, 0.84);

  const navigationPanel = (
    <AnimatePresence mode="wait">
      <motion.div
        key={navigationState}
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-2"
      >
        {navigationState === 'Favorites' && (
          <div className="grid grid-cols-3 gap-2">
            {['Shoe', 'Watch', 'Bottle'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={openDetailView}
                className="border border-pale bg-base p-2 text-left motion-garden-hover-card"
              >
                <div className="aspect-square border border-pale bg-pure flex items-center justify-center">
                  <div className="h-5 w-9 border border-pale" />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-4/5 bg-pale" />
                  <div className="h-1.5 w-2/3 bg-pale" />
                </div>
              </button>
            ))}
          </div>
        )}
        {navigationState === 'Home' && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={openDetailView}
              className="h-14 w-full border border-pale bg-base motion-garden-hover-card"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={openDetailView}
                className="h-16 border border-pale bg-base motion-garden-hover-card"
              />
              <button
                type="button"
                onClick={openDetailView}
                className="h-16 border border-pale bg-base motion-garden-hover-card"
              />
            </div>
          </div>
        )}
        {navigationState === 'Cart' && (
          <div className="space-y-2">
            {['Item A', 'Item B'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={openDetailView}
                className="flex w-full items-center justify-between border border-pale bg-base px-3 py-2 motion-garden-hover-card"
              >
                <span className="type-meta uppercase text-dark">{item}</span>
                <span className="type-meta text-dark">x1</span>
              </button>
            ))}
            <div className="border-t border-pale pt-2 flex items-center justify-between">
              <span className="type-meta uppercase text-dark">Total</span>
              <span className="type-meta text-dark">$129</span>
            </div>
          </div>
        )}
        {navigationState === 'Settings' && (
          <div className="space-y-2">
            {['Notifications', 'Shipping', 'Payment'].map((label) => (
              <div key={label} className="flex items-center justify-between border border-pale bg-base px-3 py-2">
                <span className="type-meta uppercase text-dark">{label}</span>
                <span className="h-2.5 w-2.5 border border-pale bg-pure" />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-pure text-ink">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-0 sm:px-8 sm:pt-24 sm:pb-0">
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onExit();
          }}
          className="type-meta text-accent uppercase"
        >
          ← Return to Portfolio
        </a>

        <div className="mt-16 space-y-16 sm:space-y-20">
          <header className="border-t border-pale pt-10 space-y-6">
            <h1 className="type-display-l text-ink">Motion Garden</h1>
            <p className="type-subhead text-dark max-w-3xl">
              Motion is part of interface language. It explains change, confirms intent, and helps users stay oriented
              without adding visual noise.
            </p>
          </header>

          <ScrollSection entryDirection="bottom" motionRole="garden-grid">
            <section className="relative left-1/2 right-1/2 w-screen -mx-[50vw] border-y border-pale bg-base">
              <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-14">
                <div className="space-y-8">
                  <h2 className="type-display-m text-ink">Why Motion Matters</h2>
                  <div className="grid gap-8 md:grid-cols-3">
                    {[{
                      title: 'Provide feedback.',
                      body:
                        'Motion communicates system status and helps prevent errors during critical actions such as form validation and transaction confirmation.',
                    },
                    {
                      title: 'Create seamless experiences.',
                      body:
                        'Motion reduces friction by connecting interaction states, including direct gestures like swiping. The less effort users need to invest in interaction, the better the usability of the product.',
                    },
                    {
                      title: 'Guide attention.',
                      body:
                        'Motion directs focus, clarifies what changed, and helps users understand what matters next.',
                    }].map((item, index) => (
                      <motion.p
                        key={item.title}
                        className="type-body text-dark"
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{
                          duration: shouldReduceMotion ? 0.01 : 1.2,
                          delay: shouldReduceMotion ? 0 : index * 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <span className="text-ink">{item.title}</span> {item.body}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollSection>

          <section className="space-y-12 sm:space-y-16">
            <ScrollSection entryDirection="bottom" motionRole="garden-grid">
              <MotionCard
                title="State & Navigation"
                description="Motion preserves context as states change, keeping wayfinding clear across views."
                ctaLabel="Explore states →"
                onCta={cycleNavigationState}
              >
                <div className="relative border border-pale bg-pure h-full overflow-hidden" ref={navigationStageRef}>
                  <div className="border-b border-pale grid grid-cols-4">
                    {NAVIGATION_STATES.map((item, index) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setNavigationState(item)}
                        className={`type-meta uppercase px-2 py-2 border-r border-pale text-center transition-colors text-[11px] sm:text-[12px] flex items-center justify-center leading-none ${
                          navigationState === item ? 'text-ink bg-base' : 'text-dark'
                        } ${index === NAVIGATION_STATES.length - 1 ? 'border-r-0' : ''}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between pb-2">
                      <p className="type-subhead text-dark">{navigationState}</p>
                      <span className="h-2.5 w-2.5 border border-pale bg-pure" />
                    </div>
                    {navigationPanel}
                  </div>
                  <AnimatePresence
                    onExitComplete={() => {
                      setDetailRect(null);
                    }}
                  >
                    {isDetailOpen && detailRect && (
                      <motion.div
                        className="absolute inset-0 z-20 border border-pale bg-pure"
                        style={{ transformOrigin: 'top left' }}
                        initial={{
                          x: detailRect.x,
                          y: detailRect.y,
                          scaleX: detailRect.width / detailRect.containerWidth,
                          scaleY: detailRect.height / detailRect.containerHeight,
                          opacity: 0.6,
                        }}
                        animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }}
                        exit={{
                          x: detailRect.x,
                          y: detailRect.y,
                          scaleX: detailRect.width / detailRect.containerWidth,
                          scaleY: detailRect.height / detailRect.containerHeight,
                          opacity: 0,
                        }}
                        transition={{
                          duration: shouldReduceMotion ? 0.01 : 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <div className="h-full w-full p-5 sm:p-6 flex flex-col">
                          <div className="flex items-center justify-between">
                            <p className="type-subhead text-ink">Item</p>
                            <button
                              type="button"
                              onClick={closeDetailView}
                              className="type-meta uppercase text-dark border border-pale bg-base h-8 w-8 inline-flex items-center justify-center"
                              aria-label="Close detail"
                            >
                              ×
                            </button>
                          </div>
                          <div className="mt-5 border border-pale bg-base h-32" />
                          <div className="mt-5 space-y-3">
                            <div className="h-2 w-4/5 bg-pale" />
                            <div className="h-2 w-3/5 bg-pale" />
                            <div className="h-2 w-2/3 bg-pale" />
                          </div>
                          <div className="mt-5 border-t border-pale pt-4 space-y-3">
                            <div className="h-2 w-3/5 bg-pale" />
                            <div className="h-2 w-1/2 bg-pale" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </MotionCard>
            </ScrollSection>

            <ScrollSection entryDirection="bottom" motionRole="garden-grid">
              <MotionCard
                title="Scroll & Depth"
                description="Scroll-driven motion preserves hierarchy while guiding attention through layers of depth as content unfolds."
                ctaLabel="Scroll to explore →"
                onCta={nudgeDepthScroll}
              >
                <div className="border border-pale bg-pure h-full">
                  <div className="px-4 py-3 border-b border-pale flex items-center justify-between">
                    <p className="type-meta uppercase text-dark">Nested Scroll</p>
                    <div className="h-1.5 w-20 bg-pale overflow-hidden">
                      <div
                        className="h-full origin-left transition-transform duration-200"
                        style={{ transform: `scaleX(${Math.max(depthProgress, 0.06)})`, backgroundColor: 'var(--color-dark)' }}
                      />
                    </div>
                  </div>
                  <div
                    ref={depthScrollerRef}
                    className="h-72 sm:h-80 overflow-y-auto no-scrollbar"
                    onScroll={handleDepthScroll}
                  >
                    <div className="relative h-[1400px]">
                      <div className="absolute inset-6 border border-pale" style={depthGridStyle} />
                      <div className="sticky top-0 h-72 sm:h-80 z-10 pointer-events-none">
                        <div className="relative h-full px-6">
                          <div
                            className="absolute left-1/2 top-0 h-24 sm:h-32 w-[85%] border border-pale bg-pure"
                            style={{
                              opacity: heroStage,
                              transform: `translateX(-50%) translateY(${(1 - heroStage) * 10}px)`,
                            }}
                          />
                          <div
                            className="absolute left-1/2 top-[48%] sm:top-[52%] h-16 sm:h-20 w-40 sm:w-44 border border-pale bg-pure"
                            style={{
                              opacity: rightStage,
                              transform: `translate(-50%, -50%) translateX(${(1 - rightStage) * 160}px)`,
                            }}
                          />
                          <div
                            className="absolute left-1/2 top-[62%] sm:top-[66%] h-16 sm:h-20 w-40 sm:w-44 border border-pale bg-base"
                            style={{
                              opacity: secondStage,
                              transform: `translate(-50%, -50%) translateX(${(1 - secondStage) * -160}px)`,
                            }}
                          />
                          <div
                            className="absolute left-1/2 top-[82%] sm:top-[86%] h-20 sm:h-24 w-[85%] border border-pale bg-pure"
                            style={{
                              opacity: footerStage,
                              transform: `translate(-50%, -50%) translateY(${(1 - footerStage) * 24}px)`,
                            }}
                          >
                            <div
                              className="absolute left-1/2 top-1/2 h-10 w-40 sm:w-48 border border-pale bg-base"
                              style={{
                                opacity: footerInnerStage,
                                transform: `translate(-50%, -50%) translateY(${(1 - footerInnerStage) * 18}px)`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MotionCard>
            </ScrollSection>

            <ScrollSection entryDirection="bottom" motionRole="garden-grid">
              <MotionCard
                title="Gesture-based Motion"
                description="Gestures surface contextual actions, enabling state changes without interrupting flow."
                ctaLabel="Swipe to reveal actions →"
                onCta={triggerSwipeHint}
              >
                <div className="border border-pale bg-pure p-5 sm:p-7 h-full">
                  <div className="space-y-3">
                    <p className="type-meta uppercase text-dark">List of items</p>
                    <motion.div
                      className="relative overflow-hidden border border-pale bg-base"
                      animate={{ opacity: swipeOpacity }}
                      transition={{ duration: shouldReduceMotion ? 0.01 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="absolute inset-y-0 right-0 w-36 border-l border-pale bg-pure z-0">
                        <div className="grid h-full grid-cols-2">
                          <button
                            type="button"
                            onClick={handleSaveAction}
                            className="flex items-center justify-center border-r border-pale type-meta uppercase text-dark"
                          >
                            {actionState === 'saved' ? 'Saved' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveAction}
                            className="flex items-center justify-center type-meta uppercase text-dark"
                          >
                            {actionState === 'removed' ? 'Removed' : 'Remove'}
                          </button>
                        </div>
                      </div>
                      <motion.div
                        ref={swipeItemRef}
                        className="relative z-10 bg-base px-5 py-4 touch-none select-none"
                        style={{ x: swipeOffset }}
                        onPointerDown={handleSwipeStart}
                        onPointerMove={handleSwipeMove}
                        onPointerUp={handleSwipeEnd}
                        onPointerCancel={handleSwipeEnd}
                        onPointerLeave={handleSwipeEnd}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4 text-dark"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M19 12H5" />
                              <path d="M9 8l-4 4 4 4" />
                            </svg>
                            <div>
                              <p className="type-subhead text-ink">Minimal Chair</p>
                              <p className="type-meta uppercase text-dark">{isSaved ? 'Saved item' : 'Item'}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </MotionCard>
            </ScrollSection>

            <ScrollSection entryDirection="bottom" motionRole="garden-grid">
              <MotionCard
                title="Feedback & Microinteractions"
                description="Microinteractions provide immediate feedback—guiding users through errors, success, and recovery without breaking flow."
                ctaLabel="Test feedback →"
                onCta={triggerFeedback}
              >
                <motion.div
                  className="space-y-4 h-full"
                  animate={{ opacity: isFeedbackResetting ? 0 : 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="space-y-2">
                    <input
                      value={feedbackInput}
                      onChange={(event) => setFeedbackInput(event.target.value)}
                      placeholder="Type: Love"
                      className="w-full border border-pale bg-pure px-5 py-3 type-body text-ink"
                      aria-invalid={showFeedbackError}
                    />
                    {showFeedbackError && <p className="type-meta text-dark">{feedbackError}</p>}
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={triggerFeedback}
                      disabled={!isFeedbackValid}
                      className="border border-pale bg-pure px-6 py-3 text-left type-section-title text-ink disabled:cursor-not-allowed disabled:opacity-40 inline-flex items-center gap-2"
                    >
                      {feedbackState === 'success' ? 'Sent' : feedbackState === 'loading' ? 'Sending…' : 'Send'}
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                  <div className="border border-pale bg-pure px-5 py-4 min-h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="type-subhead text-dark">
                        {feedbackState === 'loading'
                          ? 'Sending…'
                          : feedbackState === 'success'
                            ? 'Sent'
                            : 'Awaiting input...'}
                      </span>
                      {feedbackState === 'loading' && !shouldReduceMotion && (
                        <div className="flex gap-2" aria-hidden="true">
                          {[0, 1, 2].map((dot) => (
                            <motion.span
                              key={dot}
                              className="h-1.5 w-1.5"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 0.75,
                                delay: dot * 0.1,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                              style={{ backgroundColor: 'var(--color-dark)' }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </MotionCard>
            </ScrollSection>
          </section>

          <section className="border-t border-pale pt-10 sm:pt-12">
            <p className="type-body text-dark">
              Design decisions become durable when they are built as systems. Timing, state, and transition rules
              create patterns that can be reused, scaled, and implemented beyond any single tool. This work explores
              movement not as an output, but as a set of principles that translate naturally from design intent to
              production logic.
            </p>
          </section>

          <section className="relative left-1/2 right-1/2 w-screen -mx-[50vw] border-t border-pale bg-base">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
              <div className="space-y-6">
                <ScrollSection entryDirection="bottom" motionRole="contact-title" disableAnimation>
                  <h2 className="type-display-m text-ink">Contact</h2>
                </ScrollSection>
                <ScrollSection entryDirection="bottom" motionRole="contact-title" disableAnimation>
                  <p className="type-subhead text-dark">
                    I’m open to junior UX/UI roles, collaborations, and focused design work. If you’re exploring new
                    ideas, complex systems, or thoughtful interfaces, I’d love to connect.
                  </p>
                </ScrollSection>
                <div className="space-y-3 border-t border-pale pt-6">
                  <p className="type-meta text-dark uppercase">Email</p>
                  <a className="type-body text-ink" href="mailto:juliocoraspe@gmail.com">
                    juliocoraspe@gmail.com
                  </a>
                </div>
                <div className="space-y-3 border-t border-pale pt-6">
                  <p className="type-meta text-dark uppercase">Links</p>
                  <div className="flex flex-wrap gap-6">
                    <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="type-meta uppercase text-ink">
                      Resume
                    </a>
                    <a
                      href="https://www.linkedin.com/in/juliocoraspe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-meta uppercase text-ink"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://github.com/juliocoraspe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-meta uppercase text-accent"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.behance.net/juliocoraspe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-meta uppercase text-ink"
                    >
                      Behance
                    </a>
                    <button type="button" onClick={onExit} className="type-meta uppercase text-accent cursor-pointer">
                      Portfolio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
