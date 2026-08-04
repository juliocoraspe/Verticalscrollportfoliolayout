import { ReactNode, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

type DocumentModalProps = {
  /** Imported asset URL — an image or a PDF. */
  src: string;
  kind: 'image' | 'pdf';
  /** Announced as the dialog title and shown in its header. */
  title: string;
  /** Alt text for images. Ignored for PDFs. */
  alt?: string;
  /** Optional line under the title, e.g. "9 pages". */
  meta?: string;
  /** Class applied to the trigger, so it keeps the styling it had as a link. */
  className?: string;
  /** Accessible name for the trigger when its children are not text. */
  triggerLabel?: string;
  children: ReactNode;
};

/**
 * Opens a static case study artifact in place instead of a new tab, so the
 * reader never leaves the study they are in.
 *
 * Radix handles the parts that are easy to get wrong — focus trap, Escape,
 * scroll lock, restoring focus to the trigger — and the portal matters here
 * for a second reason: `.cs-bp-stage` clips its overflow, so a dialog
 * rendered in place would be cut off by the card.
 */
export function DocumentModal({
  src,
  kind,
  title,
  alt,
  meta,
  className,
  triggerLabel,
  children,
}: DocumentModalProps) {
  const [open, setOpen] = useState(false);
  const [actualSize, setActualSize] = useState(false);

  // Every open starts fitted, otherwise reopening inherits the last zoom.
  useEffect(() => {
    if (!open) setActualSize(false);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`doc-modal-trigger ${className ?? ''}`.trim()}
          aria-label={triggerLabel}
        >
          {children}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="doc-modal-overlay" />
        {/* Radix does not always mark the page behind as inert here, so state
            it explicitly — without it a screen reader can walk out of the
            dialog into the case study underneath. */}
        <Dialog.Content className="doc-modal" aria-modal="true" aria-describedby={undefined}>
          <header className="doc-modal-header">
            <div className="doc-modal-heading">
              <Dialog.Title className="doc-modal-title">{title}</Dialog.Title>
              {meta ? <span className="doc-modal-meta">{meta}</span> : null}
            </div>
            <div className="doc-modal-actions">
              {kind === 'image' ? (
                <button
                  type="button"
                  className="doc-modal-zoom"
                  onClick={() => setActualSize((v) => !v)}
                  aria-pressed={actualSize}
                >
                  {actualSize ? 'Fit to screen' : 'Actual size'}
                </button>
              ) : (
                <a className="doc-modal-zoom" href={src} target="_blank" rel="noopener noreferrer">
                  Open PDF
                  <span aria-hidden="true"> ↗</span>
                </a>
              )}
              <Dialog.Close className="doc-modal-close" aria-label="Close document">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </Dialog.Close>
            </div>
          </header>

          <div className={`doc-modal-body ${actualSize ? 'is-actual-size' : ''}`}>
            {kind === 'image' ? (
              <img src={src} alt={alt ?? title} className="doc-modal-image" decoding="async" />
            ) : (
              <iframe className="doc-modal-pdf" src={src} title={title} />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
