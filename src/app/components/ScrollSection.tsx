import { motion, useInView, useReducedMotion, type Easing } from 'motion/react';
import { useMemo, useRef, ReactNode } from 'react';

type AnimationDirection = 'left' | 'right' | 'top' | 'bottom' | 'scale' | 'none';
type MotionRole =
  | 'about-title'
  | 'about-paragraph'
  | 'case-intro'
  | 'case-block'
  | 'project-grid'
  | 'project-card'
  | 'contact-title'
  | 'garden-grid';

interface ScrollSectionProps {
  children: ReactNode;
  entryDirection?: AnimationDirection;
  exitDirection?: AnimationDirection;
  delay?: number;
  className?: string;
  threshold?: number;
  motionRole?: MotionRole;
  duration?: number;
  distance?: number;
  ease?: Easing | Easing[];
  once?: boolean;
  disableTransform?: boolean;
}

const MOTION_PRESETS: Record<MotionRole, { distance: number; duration: number; ease: Easing | Easing[] }> = {
  'about-title': { distance: 8, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  'about-paragraph': { distance: 8, duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  'case-intro': { distance: 18, duration: 1.15, ease: [0.2, 0.8, 0.2, 1] },
  'case-block': { distance: 20, duration: 1.25, ease: [0.2, 0.8, 0.2, 1] },
  'project-grid': { distance: 10, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  'project-card': { distance: 10, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  'contact-title': { distance: 8, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  'garden-grid': { distance: 6, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
};

export function ScrollSection({
  children,
  entryDirection = 'bottom',
  exitDirection = 'none',
  delay = 0,
  className = '',
  threshold = 0.3,
  motionRole,
  duration,
  distance,
  ease,
  once = true,
  disableTransform = false,
}: ScrollSectionProps) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const preset = motionRole ? MOTION_PRESETS[motionRole] : undefined;
  const resolvedDistance = distance ?? preset?.distance ?? 12;
  const resolvedDuration = duration ?? preset?.duration ?? 0.5;
  const resolvedEase = ease ?? preset?.ease ?? [0.22, 1, 0.36, 1];

  const inViewOptions = useMemo(
    () => ({
      once,
      amount: threshold,
      margin: '-100px',
    }),
    [once, threshold],
  );
  const isInView = useInView(ref, inViewOptions);

  const getEntryVariants = () => {
    const variants: Record<AnimationDirection, any> = {
      left: { x: -resolvedDistance, opacity: 0 },
      right: { x: resolvedDistance, opacity: 0 },
      top: { y: -resolvedDistance, opacity: 0 },
      bottom: { y: resolvedDistance, opacity: 0 },
      scale: { scale: 0.98, opacity: 0 },
      none: { opacity: 0 },
    };
    return variants[entryDirection];
  };

  const getExitVariants = () => {
    if (exitDirection === 'none') return {};
    
    const variants: Record<AnimationDirection, any> = {
      left: { x: -resolvedDistance, opacity: 0 },
      right: { x: resolvedDistance, opacity: 0 },
      top: { y: -resolvedDistance, opacity: 0 },
      bottom: { y: resolvedDistance, opacity: 0 },
      scale: { scale: 0.98, opacity: 0 },
      none: {},
    };
    return variants[exitDirection];
  };

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : disableTransform
      ? { opacity: 0 }
      : getEntryVariants();
  const animate = shouldReduceMotion
    ? { opacity: 1 }
    : isInView
      ? disableTransform
        ? { opacity: 1 }
        : { x: 0, y: 0, scale: 1, opacity: 1 }
      : disableTransform
        ? { opacity: 0 }
        : getExitVariants();

  return (
    <motion.div
      ref={ref}
      data-motion={motionRole}
      initial={initial}
      animate={animate}
      transition={{
        duration: shouldReduceMotion ? 0.01 : resolvedDuration,
        delay,
        ease: resolvedEase,
      }}
      className={`relative z-20 ${className}`}
    >
      {children}
    </motion.div>
  );
}
