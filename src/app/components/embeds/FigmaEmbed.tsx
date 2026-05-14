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
  /** External URL the mobile static image links to (e.g., Figma / GitHub).
   *  Defaults to `src` when omitted. */
  mobileLinkHref?: string;
  /** CTA label shown in the bar below the mobile static image. When
   *  omitted no CTA bar is rendered and the image alone is clickable. */
  mobileLinkLabel?: string;
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
  mobileLinkHref,
  mobileLinkLabel,
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

  const mobileHref = mobileLinkHref ?? src;
  const mobileAltText = mobileStaticImageAlt ?? `${title} preview`;

  return (
    <div ref={wrapperRef} className={wrapperClassName}>
      {shouldUseMobileStaticImage ? (
        // Mobile fallback: never insert the iframe into the DOM. Wrap the
        // static image in an external link so tapping the card opens the
        // real prototype/repo. Optionally render a CTA bar underneath
        // (e.g., "Open Figma Design", "See full code on GitHub").
        <a
          href={mobileHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={mobileLinkLabel ?? `Open ${title}`}
          className="block h-full w-full"
        >
          <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <img
                src={mobileStaticImageSrc}
                alt={mobileAltText}
                className="h-full w-full"
                style={{ objectFit: mobileStaticImageObjectFit }}
              />
            </div>
            {mobileLinkLabel ? (
              <span className="flex h-12 shrink-0 items-center border-t border-pale bg-pure px-6 type-meta uppercase text-accent">
                {mobileLinkLabel}
              </span>
            ) : null}
          </div>
        </a>
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
