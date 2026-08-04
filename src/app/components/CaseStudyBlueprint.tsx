import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type BlueprintSection = {
  id: string;
  label: string;
  body: ReactNode;
  layout?: 'standard' | 'vsplit';
};

type CaseStudyBlueprintProps = {
  isMobile: boolean;
  isOpen: boolean;
  cover: ReactNode;
  sections: BlueprintSection[];
  onClose: () => void;
  ariaTitle: string;
  /** Id of the panel the cover's toggle button points at with
   *  `aria-controls`. Rendered on the layer that slides in, so the
   *  reference resolves to a real element. */
  contentId: string;
};

const SLIDE_DURATION = 0.42;
const SLIDE_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export function CaseStudyBlueprint({
  isMobile,
  isOpen,
  cover,
  sections,
  onClose,
  ariaTitle,
  contentId,
}: CaseStudyBlueprintProps) {
  // Mobile uses the same slide-in blueprint pattern as desktop.
  return (
    <div className="cs-bp-stage" aria-live="polite">
      <motion.div
        className="cs-bp-cover-layer"
        animate={{ x: isOpen ? '-110%' : '0%', opacity: isOpen ? 0 : 1 }}
        transition={{ duration: SLIDE_DURATION, ease: SLIDE_EASE }}
        style={{
          pointerEvents: isOpen ? 'none' : 'auto',
          position: isOpen ? 'absolute' : 'relative',
          inset: isOpen ? 0 : undefined,
        }}
        aria-hidden={isOpen}
      >
        {cover}
      </motion.div>

      <motion.div
        id={contentId}
        className="cs-bp-blueprint-layer"
        initial={false}
        animate={{ x: isOpen ? '0%' : '110%', opacity: isOpen ? 1 : 0 }}
        transition={{ duration: SLIDE_DURATION, ease: SLIDE_EASE }}
        style={{
          pointerEvents: isOpen ? 'auto' : 'none',
          position: isOpen ? 'relative' : 'absolute',
          inset: isOpen ? undefined : 0,
        }}
        aria-hidden={!isOpen}
      >
        <BlueprintShell
          sections={sections}
          onClose={onClose}
          ariaTitle={ariaTitle}
          isOpen={isOpen}
          isMobile={isMobile}
        />
      </motion.div>
    </div>
  );
}

type BlueprintShellProps = {
  sections: BlueprintSection[];
  onClose: () => void;
  ariaTitle: string;
  isOpen: boolean;
  isMobile: boolean;
};

function BlueprintShell({ sections, onClose, ariaTitle, isOpen, isMobile }: BlueprintShellProps) {
  const reactId = useId();
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const [glossaryScroll, setGlossaryScroll] = useState({ progress: 0, thumb: 1 });
  const displayBodyRef = useRef<HTMLDivElement>(null);
  const glossaryListRef = useRef<HTMLUListElement>(null);
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  // Reset to first section when card closes (so reopening starts fresh)
  useEffect(() => {
    if (!isOpen && sections[0]) {
      setActiveId(sections[0].id);
    }
  }, [isOpen, sections]);

  // Every section should open at its own beginning. This also prevents embedded
  // documents from inheriting or changing the scroll position of the panel.
  useEffect(() => {
    if (displayBodyRef.current) displayBodyRef.current.scrollTop = 0;
  }, [activeId]);

  // Match the always-visible mobile rail indicator used in My Design Cycle.
  // The native horizontal scrollbar is intentionally hidden; this compact
  // track communicates both overflow and the current position without adding
  // a second, detached line beneath the index.
  useEffect(() => {
    if (!isMobile) return undefined;
    const rail = glossaryListRef.current;
    if (!rail) return undefined;

    const updateGlossaryScroll = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      const progress = maxScroll > 0 ? rail.scrollLeft / maxScroll : 0;
      const thumb = rail.scrollWidth > 0
        ? Math.min(1, Math.max(0.16, rail.clientWidth / rail.scrollWidth))
        : 1;
      setGlossaryScroll({ progress, thumb });
    };

    updateGlossaryScroll();
    const resizeObserver = new ResizeObserver(updateGlossaryScroll);
    resizeObserver.observe(rail);
    rail.addEventListener('scroll', updateGlossaryScroll, { passive: true });
    window.addEventListener('resize', updateGlossaryScroll);

    return () => {
      resizeObserver.disconnect();
      rail.removeEventListener('scroll', updateGlossaryScroll);
      window.removeEventListener('resize', updateGlossaryScroll);
    };
  }, [isMobile, isOpen, sections.length]);

  const glossaryThumbWidth = glossaryScroll.thumb * 100;
  const glossaryThumbLeft = glossaryScroll.progress * (100 - glossaryThumbWidth);

  if (!active) return null;

  return (
    <div className="cs-bp-shell" role="region" aria-label={`${ariaTitle} blueprint`}>
      <button
        type="button"
        className="cs-bp-close"
        onClick={onClose}
        aria-label="Close case study"
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M5 5L15 15M15 5L5 15"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="cs-bp-grid-bg" aria-hidden="true" />

      <div className="cs-bp-meta">
        <span className="cs-bp-meta-label">Case Study</span>
        <span className="cs-bp-meta-divider" aria-hidden="true" />
        <span className="cs-bp-meta-title">{ariaTitle}</span>
      </div>

      <aside className="cs-bp-glossary" aria-label="Section index">
        <p className="cs-bp-glossary-heading">Index</p>
        <ul ref={glossaryListRef} className="cs-bp-glossary-list">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id} className="cs-bp-glossary-row">
                <button
                  type="button"
                  className={`cs-bp-glossary-item ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveId(section.id)}
                  onFocus={() => setActiveId(section.id)}
                  onClick={() => setActiveId(section.id)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="cs-bp-glossary-num" aria-hidden="true">
                    {section.id}
                  </span>
                  <span className="cs-bp-glossary-label">{section.label}</span>
                </button>
                <span className="cs-bp-connector" aria-hidden="true">
                  <span className="cs-bp-connector-line" />
                  <span className="cs-bp-connector-arrow" />
                </span>
              </li>
            );
          })}
        </ul>
        <div className="cs-bp-glossary-scroll-indicator" aria-hidden="true">
          <span className="cs-bp-glossary-scroll-track" />
          <span
            className="cs-bp-glossary-scroll-thumb"
            style={{
              left: `${glossaryThumbLeft}%`,
              width: `${glossaryThumbWidth}%`,
            }}
          />
        </div>
      </aside>

      <main
        className={`cs-bp-display ${active.layout === 'vsplit' ? 'is-vsplit' : ''}`}
        aria-labelledby={`${reactId}-active`}
      >
        {active.layout !== 'vsplit' ? (
          <div className="cs-bp-display-header">
            <span className="cs-bp-display-num" aria-hidden="true">
              {active.id}
            </span>
            <h4 id={`${reactId}-active`} className="cs-bp-display-title">
              {active.label}
            </h4>
          </div>
        ) : null}
        <motion.div
          ref={displayBodyRef}
          key={active.id}
          className="cs-bp-display-body"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {active.body}
        </motion.div>
      </main>
    </div>
  );
}
