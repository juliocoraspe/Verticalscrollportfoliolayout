import type { KeyboardEvent } from 'react';

interface ExternalPreviewLinkProps {
  helperText?: string;
  href?: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
}

const DEFAULT_HELPER_TEXT = 'View the full report';
const DEFAULT_THUMBNAIL_ALT = 'Report preview';

export function ExternalPreviewLink({
  helperText = DEFAULT_HELPER_TEXT,
  href,
  thumbnailSrc,
  thumbnailAlt = DEFAULT_THUMBNAIL_ALT,
}: ExternalPreviewLinkProps) {
  const isActive = Boolean(href);

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const previewContent = thumbnailSrc ? (
    <img src={thumbnailSrc} alt={thumbnailAlt} className="h-full w-full object-cover" />
  ) : (
    <span className="type-micro text-dark">{DEFAULT_THUMBNAIL_ALT}</span>
  );

  if (!isActive) {
    return (
      <div className="space-y-3 opacity-70">
        <p className="type-micro text-dark">{helperText}</p>
        <div
          aria-disabled="true"
          className="flex aspect-[4/3] w-full items-center justify-center border border-pale bg-pure text-center"
        >
          {previewContent}
        </div>
        <span className="type-micro uppercase text-dark">Coming soon</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="type-micro text-accent"
      >
        {helperText}
      </a>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onKeyDown={handleKeyDown}
        className="flex aspect-[4/3] w-full cursor-pointer items-center justify-center border border-pale bg-pure text-center transition-colors hover:border-accent hover:bg-cloud focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent focus-visible:outline-offset-4"
      >
        {previewContent}
      </a>
    </div>
  );
}
