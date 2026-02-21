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
  mobileStaticImageSrc?: string;
  mobileStaticImageAlt?: string;
  mobileStaticImageObjectFit?: 'cover' | 'contain';
  mobileFooterBarHeightPx?: number;
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
  mobileStaticImageSrc,
  mobileStaticImageAlt,
  mobileStaticImageObjectFit = 'cover',
  mobileFooterBarHeightPx = 48,
}: FigmaEmbedProps) {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldUseMobileStaticImage = isMobile && Boolean(mobileStaticImageSrc);
  const prefersInteraction = !shouldUseMobileStaticImage && (isMobile || shouldReduceMotion);
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
      {shouldUseMobileStaticImage ? (
        <div className="relative h-full w-full overflow-hidden">
          <iframe
            title={title}
            src={src}
            className={iframeClassName}
            loading={loading}
            allow={allow}
            allowFullScreen={allowFullScreen}
          />
          <img
            src={mobileStaticImageSrc}
            alt={mobileStaticImageAlt ?? `${title} preview`}
            className="absolute inset-0 z-10 h-full w-full"
            style={{
              objectFit: mobileStaticImageObjectFit,
              clipPath: `inset(0 0 ${mobileFooterBarHeightPx}px 0)`,
            }}
          />
        </div>
      ) : isMounted ? (
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
