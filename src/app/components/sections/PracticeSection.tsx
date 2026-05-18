import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { ScrollSection } from '../ScrollSection';
import { DESIGN_CYCLE_BUILDING_SLOT_ID } from '../WireframeMesh';

// ── Connector line — anchored to a single glossary level row ────────────────
// Rendered as a position:absolute child of its BpLevel. Origin = right edge
// of the cards container; vertical position = exact vertical center of the
// cards. Width extends to canvas left + endMargin so each line reaches its
// corresponding building feature with a different length. Hidden until the
// panel finishes expanding (delay matches the 0.45s grid-rows animation).
function ConnectorLine({
  levelRef,
  endMargin,
  topOffset = 0,
  isExpanded,
  reducedMotion,
}: {
  levelRef: React.RefObject<HTMLDivElement>;
  endMargin: number;
  topOffset?: number;
  isExpanded: boolean;
  reducedMotion: boolean;
}) {
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const levelEl = levelRef.current;
      const section = document.getElementById('design-cycle');
      if (!levelEl || !section) return;

      // Walk down the panel structure to reach the cards' grid container:
      // panel(role=region) > wrapper(overflow:hidden) > inner(paddingBottom) > cardsContainer
      const panel = levelEl.querySelector('[role="region"]') as HTMLElement | null;
      const wrapper = panel?.firstElementChild as HTMLElement | null;
      const inner = wrapper?.firstElementChild as HTMLElement | null;
      const cardsContainer = inner?.firstElementChild as HTMLElement | null;
      if (!cardsContainer) return;

      const cardsRect = cardsContainer.getBoundingClientRect();
      if (cardsRect.height < 10 || cardsRect.width < 10) return;

      const levelRect = levelEl.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();

      // Vertical center of the cards (relative to level), plus optional offset
      const top = (cardsRect.top + cardsRect.height / 2) - levelRect.top + topOffset;
      // Right edge of the cards (relative to level) — line origin
      const left = cardsRect.right - levelRect.left;
      // Building canvas sits in the right 1/4 column of the 3fr/1fr grid.
      const canvasLeft = sectionRect.left + sectionRect.width * 0.75;
      const width = Math.max(0, (canvasLeft + endMargin) - cardsRect.right);

      setPos({ top, left, width });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (levelRef.current) ro.observe(levelRef.current);
    const section = document.getElementById('design-cycle');
    if (section) ro.observe(section);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [endMargin, topOffset, levelRef]);

  if (!pos) return null;

  // Wait for the panel's grid-rows expansion (0.45s) before fading the line in.
  const fadeInDelay = reducedMotion ? 0 : 0.55;
  const fadeDuration = reducedMotion ? 0 : 0.3;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: 3,
        display: 'flex',
        alignItems: 'center',
        transform: 'translateY(-50%)',
        opacity: isExpanded ? 1 : 0,
        transition: `opacity ${fadeDuration}s ease`,
        transitionDelay: `${isExpanded ? fadeInDelay : 0}s`,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 0,
          borderTop: '1px dashed rgba(26, 26, 26, 0.55)',
        }}
      />
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-dark)',
          opacity: 0.45,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

type PracticeSectionProps = {
  enterMotionGarden: () => void;
};

// ── Blueprint tokens ───────────────────────────────────────────────────────
const BP_INK  = 'var(--color-ink)';
const BP_DARK = 'var(--color-dark)';
const BP_MID  = 'rgba(17, 17, 17, 0.64)';
const BP_LINE = 'rgba(149, 148, 146, 0.55)';
const BP_DASH = 'rgba(149, 148, 146, 0.35)';
const BP_FILL = 'rgba(242, 241, 237, 0.72)';

// ── Data ───────────────────────────────────────────────────────────────────

const toolkits = [
  { title: 'UX Strategy Toolkit',     items: ['SMART goal definition', 'Success metrics frameworks', 'Constraint mapping', 'Stakeholder alignment', 'Product vision framing', 'Opportunity mapping'] },
  { title: 'Research Toolkit',        items: ['User interviews', 'Surveys', 'Analytics platforms', 'Competitor analysis', 'Heuristic evaluation', 'Heatmaps', 'Affinity mapping', 'Thematic analysis'] },
  { title: 'Design Toolkit',          items: ['Visual hierarchy', 'Typography systems', 'Color systems', 'Layout & spacing', 'State transitions', 'Interaction feedback', 'Attention guidance', 'WCAG · Section 508 · ADA'] },
  { title: 'Technical Collaboration', items: ['Git / GitHub', 'HTML · CSS · JavaScript', 'Component architecture', 'Design system implementation', 'Interface debugging'] },
  { title: 'AI-Augmented Workflow',   items: ['Prompt engineering', 'Context engineering', 'Automation workflows', 'MCP integration', 'Figma acceleration'] },
];

const flowStages = [
  { title: 'Discovery', items: ['Foundational research', 'UX strategy definition', 'Research planning', 'Method selection', 'Data collection', 'Insight synthesis', 'Bias mitigation'] },
  { title: 'Design',    items: ['Information architecture', 'User flows', 'Wireframes', 'UI design', 'Motion design', 'Prototyping', 'Usability testing'] },
  { title: 'Delivery',  items: ['Developer handoff', 'Front-end collaboration', 'Implementation support', 'Post-launch validation', 'Feasibility awareness'] },
];

const lenses = [
  { num: '01', category: 'User',       subtitle: 'Desirability', body: 'Understanding human needs and behaviors to ensure products are intuitive, meaningful, and genuinely valuable for the people who use them.' },
  { num: '02', category: 'Business',   subtitle: 'Viability',    body: 'Aligning product decisions with organizational goals so solutions generate measurable value and support long-term sustainability.' },
  { num: '03', category: 'Technology', subtitle: 'Feasibility',  body: 'Evaluating technical possibilities and constraints to ensure solutions can be realistically built, scaled, and maintained. Supported by hands-on front-end development experience.' },
];

// ── Shared primitives ──────────────────────────────────────────────────────

function BpCard({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div style={{ border: `1px solid ${BP_LINE}`, padding: compact ? '14px 14px' : '16px 18px', backgroundColor: BP_FILL }}>
      {children}
    </div>
  );
}

function BpCardTitle({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 14, letterSpacing: '0.08em', color: BP_DARK, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, borderBottom: `1px solid ${BP_DASH}`, paddingBottom: 8, lineHeight: 1.35 }}>
      {children}
    </p>
  );
}

function BpList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item) => (
        <li key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
          <span style={{ color: BP_MID, flexShrink: 0, lineHeight: '22px', fontSize: 14 }}>·</span>
          <span style={{ fontSize: 15, color: BP_DARK, lineHeight: 1.55 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function MobileCardRail({ children }: { children: ReactNode[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ progress: 0, thumb: 1 });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;

    const update = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      const progress = maxScroll > 0 ? rail.scrollLeft / maxScroll : 0;
      const thumb = rail.scrollWidth > 0 ? Math.min(1, Math.max(0.16, rail.clientWidth / rail.scrollWidth)) : 1;
      setScrollState({ progress, thumb });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(rail);
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      rail.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [children.length]);

  const thumbWidth = scrollState.thumb * 100;
  const thumbLeft = scrollState.progress * (100 - thumbWidth);

  return (
    <div style={{ position: 'relative', marginRight: -24 }}>
      <div
        ref={railRef}
        className="mobile-card-rail-scroll"
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingRight: 24,
          paddingBottom: 0,
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            style={{
              flex: '0 0 auto',
              display: 'inline-block',
              width: 'fit-content',
              maxWidth: 'min(74vw, 300px)',
              scrollSnapAlign: 'start',
            }}
          >
            {child}
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          height: 10,
          marginTop: 18,
          marginRight: 24,
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: 5, borderTop: '0.5px solid rgba(149,148,146,0.32)' }} />
        <div
          style={{
            position: 'absolute',
            left: `${thumbLeft}%`,
            top: 4,
            width: `${thumbWidth}%`,
            height: 2,
            backgroundColor: 'rgba(17,17,17,0.28)',
            transition: 'left 0.08s linear',
          }}
        />
      </div>
    </div>
  );
}

// ── Body content ───────────────────────────────────────────────────────────

function CapabilitiesBody({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <MobileCardRail>
        {toolkits.map((tk) => (
          <BpCard compact key={tk.title}>
            <BpCardTitle>{tk.title}</BpCardTitle>
            <BpList items={tk.items} />
          </BpCard>
        ))}
      </MobileCardRail>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
      {toolkits.map((tk) => (
        <BpCard key={tk.title}>
          <BpCardTitle>{tk.title}</BpCardTitle>
          <BpList items={tk.items} />
        </BpCard>
      ))}
    </div>
  );
}

function FlowBody({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <MobileCardRail>
        {flowStages.map((stage) => (
          <BpCard compact key={stage.title}>
            <BpCardTitle>{stage.title}</BpCardTitle>
            <BpList items={stage.items} />
          </BpCard>
        ))}
      </MobileCardRail>
    );
  }

  const items: ReactNode[] = [];
  flowStages.forEach((stage, i) => {
    items.push(
      <BpCard key={stage.title}>
        <BpCardTitle>{stage.title}</BpCardTitle>
        <BpList items={stage.items} />
      </BpCard>,
    );
    if (i < flowStages.length - 1) {
      items.push(
        <div key={`arrow-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px', paddingTop: 18 }}>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
            <line x1="0" y1="6" x2="15" y2="6" stroke={BP_MID} strokeWidth="1" />
            <polyline points="11,2 18,6 11,10" stroke={BP_MID} strokeWidth="1" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>,
      );
    }
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'start' }}>
      {items}
    </div>
  );
}

function PhilosophyBody({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <MobileCardRail>
        {lenses.map((lens) => (
          <BpCard compact key={lens.num}>
            <div style={{ borderBottom: `1px solid ${BP_DASH}`, paddingBottom: 8, marginBottom: 10 }}>
              <p style={{ fontSize: 28, fontWeight: 400, color: BP_MID, lineHeight: 1, marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>{lens.num}</p>
              <p style={{ fontSize: 14, letterSpacing: '0.08em', color: BP_DARK, textTransform: 'uppercase', fontWeight: 600, lineHeight: 1.35 }}>{lens.category}</p>
              <p style={{ fontSize: 14, letterSpacing: '0.04em', color: BP_MID, textTransform: 'uppercase', lineHeight: 1.35 }}>{lens.subtitle}</p>
            </div>
            <p style={{ fontSize: 15, color: BP_DARK, lineHeight: 1.6 }}>{lens.body}</p>
          </BpCard>
        ))}
      </MobileCardRail>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
      {lenses.map((lens) => (
        <BpCard key={lens.num}>
          <div style={{ borderBottom: `1px solid ${BP_DASH}`, paddingBottom: 8, marginBottom: 10 }}>
            <p style={{ fontSize: 28, fontWeight: 400, color: BP_MID, lineHeight: 1, marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>{lens.num}</p>
            <p style={{ fontSize: 14, letterSpacing: '0.08em', color: BP_DARK, textTransform: 'uppercase', fontWeight: 600, lineHeight: 1.35 }}>{lens.category}</p>
            <p style={{ fontSize: 14, letterSpacing: '0.04em', color: BP_MID, textTransform: 'uppercase', lineHeight: 1.35 }}>{lens.subtitle}</p>
          </div>
          <p style={{ fontSize: 15, color: BP_DARK, lineHeight: 1.6 }}>{lens.body}</p>
        </BpCard>
      ))}
    </div>
  );
}

// ── BpLevel — one glossary row ─────────────────────────────────────────────

function BpLevel({
  num,
  title,
  subtitle,
  children,
  isMobile,
  mobileExpanded,
  onMobileToggle,
  reducedMotion,
  onHoverStart,
  onHoverEnd,
  levelRef,
  connectorEndMargin,
  connectorTopOffset = 0,
}: {
  num: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  isMobile: boolean;
  mobileExpanded: boolean;
  onMobileToggle: () => void;
  reducedMotion: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  levelRef: React.RefObject<HTMLDivElement>;
  connectorEndMargin: number;
  connectorTopOffset?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isOpen = isMobile ? mobileExpanded : hovered;
  const panelId = `bp-level-${num}-panel`;
  const btnId = `bp-level-${num}-btn`;

  const expandDuration = reducedMotion ? '0s' : '0.45s';
  const fadeDuration   = reducedMotion ? '0s' : isOpen ? '0.3s' : '0.15s';
  const fadeDelay      = reducedMotion ? '0s' : isOpen ? '0.1s' : '0s';

  return (
    <div
      ref={levelRef}
      onMouseEnter={() => { if (!isMobile) { setHovered(true); onHoverStart?.(); } }}
      onMouseLeave={() => { if (!isMobile) { setHovered(false); onHoverEnd?.(); } }}
      style={{ position: 'relative', borderBottom: `1px solid ${BP_LINE}`, minHeight: isMobile ? '120px' : '140px' }}
    >
      <button
        type="button"
        id={btnId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => isMobile ? onMobileToggle() : setHovered((h) => !h)}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 6 : 22,
          padding: isMobile ? '18px 0 12px' : '48px 0 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top row on mobile: number + title + chevron. Single row on desktop. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 12 : 22,
            width: '100%',
          }}
        >
          <span style={{ fontSize: 14, letterSpacing: '0.1em', color: BP_MID, fontWeight: 600, flexShrink: 0, minWidth: 24, fontVariantNumeric: 'tabular-nums' }}>
            {num}
          </span>
          <span style={{ fontSize: isMobile ? 16 : 19, letterSpacing: '0.06em', color: BP_INK, fontWeight: 600, textTransform: 'uppercase', flexShrink: 0 }}>
            {title}
          </span>
          {!isMobile && (
            <>
              <div style={{ flex: 1, minWidth: 16 }} aria-hidden="true" />
              <span style={{ fontSize: 15, color: BP_DARK, flexShrink: 0, lineHeight: 1.4 }}>
                {subtitle}
              </span>
            </>
          )}
          <div style={{ flex: 1, minWidth: 16 }} aria-hidden="true" />
          <span
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobile ? 18 : 14,
              height: isMobile ? 18 : 14,
              transition: `transform ${reducedMotion ? '0s' : '0.25s'} ease`,
              transform: isMobile
                ? isOpen
                  ? 'rotate(180deg)'
                  : 'rotate(0deg)'
                : isOpen
                  ? 'rotate(45deg)'
                  : 'rotate(0deg)',
            }}
            aria-hidden="true"
          >
            {isMobile ? (
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                <path
                  d="M1 1.5L7 7L13 1.5"
                  stroke={BP_MID}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span style={{ fontSize: 18, color: BP_MID, lineHeight: 1 }}>+</span>
            )}
          </span>
        </div>
        {/* Bottom row on mobile: subtitle, indented to align under title. */}
        {isMobile && (
          <span
            style={{
              fontSize: 13,
              color: BP_DARK,
              lineHeight: 1.4,
              paddingLeft: 36,
              paddingRight: 24,
            }}
          >
            {subtitle}
          </span>
        )}
      </button>

      {!isMobile && (
        <ConnectorLine
          levelRef={levelRef}
          endMargin={connectorEndMargin}
          topOffset={connectorTopOffset}
          isExpanded={isOpen}
          reducedMotion={reducedMotion}
        />
      )}

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: `grid-template-rows ${expandDuration} cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      >
        <div style={{ minHeight: 0, overflow: 'hidden' }}>
          <div
            style={{
              paddingBottom: isMobile ? 12 : 36,
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
              transition: `opacity ${fadeDuration} ease ${fadeDelay}, transform ${fadeDuration} ease ${fadeDelay}`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────

export function PracticeSection({ enterMotionGarden: _enterMotionGarden }: PracticeSectionProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [anchorTopPx, setAnchorTopPx] = useState<number | null>(null);
  const [activeLevel, setActiveLevel] = useState<null | 1 | 2 | 3>(null);
  const [separatorProgress, setSeparatorProgress] = useState(0);
  const anchorParentRef = useRef<HTMLDivElement>(null);
  const levelRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
  };

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const dispatchLevel = (level: null | 1 | 2 | 3) => {
    setActiveLevel(level);
    window.dispatchEvent(new CustomEvent('practice-level-change', { detail: { level } }));
  };

  useEffect(() => {
    if (!isMobile) return;
    const keys = [...expanded];
    if (keys.length === 0) { dispatchLevel(null); return; }
    const last = keys[keys.length - 1];
    dispatchLevel(parseInt(last) as 1 | 2 | 3);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, isMobile]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);


  // Position the building anchor so that the TOP edge of level3 (roof) lands
  // exactly on row 01's top edge. With the top anchored, level2 and level1
  // cascade downward, syncing each building level with its corresponding
  // glossary row. Recomputed on resize.
  useEffect(() => {
    if (isMobile) return;
    let raf = 0;
    const compute = () => {
      const row01Btn = document.getElementById('bp-level-03-btn');
      const parent = anchorParentRef.current;
      if (!row01Btn || !parent) return;
      const row01Rect = row01Btn.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const row01TopInParent = row01Rect.top - parentRect.top;
      const canvasHeight = window.innerHeight - 48; // matches calc(100svh - 48px)
      // Camera framing constant: scaled scene-y of the roof top ≈ 21.95,
      // lookAt y = 12, vertical extent ≈ 54.86 → top edge sits 31.9% from
      // canvas top.
      const BUILDING_TOP_FRACTION = 0.319;
      const buildingTopFromCanvasTop = canvasHeight * BUILDING_TOP_FRACTION;
      setAnchorTopPx(row01TopInParent - buildingTopFromCanvasTop);
    };
    const scheduled = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    scheduled();
    const ro = new ResizeObserver(scheduled);
    if (anchorParentRef.current) ro.observe(anchorParentRef.current);
    const row01Btn = document.getElementById('bp-level-03-btn');
    if (row01Btn) ro.observe(row01Btn);
    window.addEventListener('resize', scheduled);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', scheduled);
    };
  }, [isMobile]);

  // Separator line — draws left-to-right as the building crosses the hero/
  // design-cycle boundary. Progress mirrors WireframeMesh Phase 1: starts
  // when the section enters the viewport, completes when the section top
  // reaches BUILDING_TOP_FRACTION (0.30) from the viewport top — the exact
  // moment the building's top aligns with the glossary row 01 edge.
  useEffect(() => {
    if (isMobile) return;
    let raf = 0;
    const update = () => {
      const section = document.getElementById('design-cycle');
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const startY = vh;                // section top at viewport bottom → 0
      const endY   = vh * 0.10;        // section top at 10% → fully drawn
      const p = Math.max(0, Math.min(1, (startY - sectionTop) / (startY - endY)));
      setSeparatorProgress(p);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { update(); raf = 0; });
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  const levelProps = {
    isMobile,
    reducedMotion: prefersReduced,
  };

  return (
    <section
      id="design-cycle"
      className="practice-section bg-pure px-6 pt-4 pb-12 sm:px-6 sm:pt-20 sm:pb-24"
      style={isMobile ? undefined : { minHeight: 'calc(100svh - 48px)', position: 'relative' }}
    >
      {/* Boundary separator — draws left→right as the building crosses into this section */}
      {!isMobile && separatorProgress > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '1px',
            width: `${separatorProgress * 100}%`,
            background: '#959492',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}
      <div className="hero-breakout mx-auto">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '3fr 1fr',
            position: 'relative',
          }}
        >

          {/* Left 3/4 — content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <ScrollSection
              entryDirection="bottom"
              motionRole="case-intro"
              threshold={isMobile ? 0.05 : 0.3}
            >
              <h2
                id="design-cycle-title"
                className="type-display-l"
                style={{ color: BP_INK, marginBottom: 12, marginTop: isMobile ? 0 : 280 }}
              >
                My Design Cycle
              </h2>
              <p
                className="type-subhead"
                style={{
                  color: BP_DARK,
                  maxWidth: '56ch',
                  marginBottom: isMobile ? 48 : 40,
                  lineHeight: 1.45,
                  fontSize: isMobile ? 16 : 22,
                }}
              >
                Three layers: the base that justifies everything above it, the structure that makes it possible, and the surface the user reaches.
              </p>
            </ScrollSection>

            <ScrollSection
              entryDirection="bottom"
              motionRole="case-block"
              threshold={isMobile ? 0.02 : 0.3}
              disableTransform={isMobile}
            >
              <div
                style={{
                  borderTop: `1px solid ${BP_LINE}`,
                  minHeight: isMobile ? undefined : '44.5rem',
                  width: '100%',
                  maxWidth: isMobile ? undefined : '70rem',
                  margin: isMobile ? undefined : '0 auto',
                }}
              >

                <BpLevel
                  {...levelProps}
                  num="03"
                  title="My Capabilities & Toolkits"
                  subtitle="Strategy · Research · Design · Technical · AI-Augmented"
                  mobileExpanded={expanded.has('01')}
                  onMobileToggle={() => toggle('01')}
                  onHoverStart={() => dispatchLevel(1)}
                  onHoverEnd={() => dispatchLevel(null)}
                  levelRef={levelRefs[1]}
                  connectorEndMargin={40}
                  connectorTopOffset={-60}
                >
                  <CapabilitiesBody isMobile={isMobile} />
                </BpLevel>

                <BpLevel
                  {...levelProps}
                  num="02"
                  title="My Design Flow"
                  subtitle="Discovery → Design → Delivery"
                  mobileExpanded={expanded.has('02')}
                  onMobileToggle={() => toggle('02')}
                  onHoverStart={() => dispatchLevel(2)}
                  onHoverEnd={() => dispatchLevel(null)}
                  levelRef={levelRefs[2]}
                  connectorEndMargin={100}
                  connectorTopOffset={-20}
                >
                  <FlowBody isMobile={isMobile} />
                </BpLevel>

                <BpLevel
                  {...levelProps}
                  num="01"
                  title="My Design Philosophy"
                  subtitle="Three Lenses of Human-Centered Design"
                  mobileExpanded={expanded.has('03')}
                  onMobileToggle={() => toggle('03')}
                  onHoverStart={() => dispatchLevel(3)}
                  onHoverEnd={() => dispatchLevel(null)}
                  levelRef={levelRefs[3]}
                  connectorEndMargin={170}
                  connectorTopOffset={52}
                >
                  <PhilosophyBody isMobile={isMobile} />
                </BpLevel>

              </div>
            </ScrollSection>
          </div>

          {/* Right 1/4 — invisible anchor for the scroll-animated hero building */}
          {!isMobile && (
            <div
              aria-hidden="true"
              className="hidden md:block"
              ref={anchorParentRef}
              style={{
                position: 'relative',
                minHeight: '100%',
                overflow: 'visible',
              }}
            >
              <div
                id={DESIGN_CYCLE_BUILDING_SLOT_ID}
                style={{
                  position: 'absolute',
                  top: anchorTopPx != null ? `${anchorTopPx}px` : '20%',
                  right: '-16vw',
                  width: '90vw',
                  height: 'calc(100svh - 48px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
