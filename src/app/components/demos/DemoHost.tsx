import { lazy, Suspense, useMemo, useState, type ComponentType, type ReactNode } from 'react';

type DemoHostProps = {
  title: string;
  src?: string;
  wrapperClassName?: string;
  iframeClassName?: string;
  allow?: string;
  allowFullScreen?: boolean;
  loading?: 'lazy' | 'eager';
  autoMount?: boolean;
  buttonLabel?: string;
  importComponent?: () => Promise<{ default: ComponentType<any> }>;
  componentProps?: Record<string, unknown>;
  fallback?: ReactNode;
};

export function DemoHost({
  title,
  src,
  wrapperClassName,
  iframeClassName,
  allow = 'fullscreen; clipboard-read; clipboard-write; autoplay; microphone; camera',
  allowFullScreen = true,
  loading = 'lazy',
  autoMount = true,
  buttonLabel = 'Load demo',
  importComponent,
  componentProps,
  fallback = null,
}: DemoHostProps) {
  const [isMounted, setIsMounted] = useState(autoMount);
  const LazyComponent = useMemo(() => {
    if (!importComponent) return null;
    return lazy(importComponent);
  }, [importComponent]);

  if (!isMounted) {
    return (
      <div className={wrapperClassName}>
        <div className="h-full w-full flex items-center justify-center">
          <button type="button" onClick={() => setIsMounted(true)} className="type-meta uppercase text-accent">
            {buttonLabel}
          </button>
        </div>
      </div>
    );
  }

  if (LazyComponent) {
    return (
      <div className={wrapperClassName}>
        <Suspense fallback={fallback}>
          <LazyComponent {...(componentProps ?? {})} />
        </Suspense>
      </div>
    );
  }

  if (!src) return null;

  return (
    <div className={wrapperClassName}>
      <iframe
        title={title}
        src={src}
        className={iframeClassName}
        loading={loading}
        allow={allow}
        allowFullScreen={allowFullScreen}
      />
    </div>
  );
}
