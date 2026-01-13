import { useEffect, useRef, useState } from 'react';

interface DeferredIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  rootMargin?: string;
  once?: boolean;
  wrapperClassName?: string;
}

export function DeferredIframe({
  rootMargin = '1200px 0px',
  once = true,
  wrapperClassName = 'h-full w-full',
  ...props
}: DeferredIframeProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldLoad && once) return;
    const node = wrapperRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          if (once) observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, shouldLoad]);

  return (
    <div ref={wrapperRef} className={wrapperClassName}>
      {shouldLoad ? (
        <iframe
          {...props}
          loading={props.loading ?? 'lazy'}
        />
      ) : null}
    </div>
  );
}
