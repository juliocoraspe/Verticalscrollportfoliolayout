import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useIsMobile } from '../ui/use-mobile';

type FigmaEmbedProps = {
  title: string;
  src: string;
  wrapperClassName?: string;
  iframeClassName?: string;
  allow?: string;
  allowFullScreen?: boolean;
  loading?: 'lazy' | 'eager';
  buttonLabel?: string;
  placeholderClassName?: string;
  unmountOnExit?: boolean;
  rootMargin?: string;
};

export function FigmaEmbed({
  title,
  src,
  wrapperClassName,
  iframeClassName,
  allow = 'fullscreen',
  allowFullScreen = true,
  loading = 'lazy',
  buttonLabel = 'Load prototype',
  placeholderClassName,
  unmountOnExit = false,
  rootMargin = '200px',
}: FigmaEmbedProps) {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const prefersInteraction = isMobile || shouldReduceMotion;
  const [isMounted, setIsMounted] = useState(!prefersInteraction);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersInteraction) return;
    const element = wrapperRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMounted(true);
        } else if (unmountOnExit) {
          setIsMounted(false);
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersInteraction, rootMargin, unmountOnExit]);

  return (
    <div ref={wrapperRef} className={wrapperClassName}>
      {isMounted ? (
        <iframe
          title={title}
          src={src}
          className={iframeClassName}
          loading={loading}
          allow={allow}
          allowFullScreen={allowFullScreen}
        />
      ) : (
        <div className={placeholderClassName ?? 'h-full w-full flex items-center justify-center'}>
          <button
            type="button"
            onClick={() => setIsMounted(true)}
            className="type-meta uppercase text-accent"
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
