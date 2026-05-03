import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { ScrollSection } from '../ScrollSection';
import { DESIGN_CYCLE_BUILDING_SLOT_ID } from '../WireframeMesh';

// ── Connector lines between glossary rows and building levels ────────────────
interface LineConfig {
  level: 1 | 2 | 3;
  yFraction: number; // 0 = top, 0.5 = middle, 1 = bottom of row/level
  marginLeft: number;
  marginRight: number;
}

function ConnectorLines({
  isMobile,
  activeLevel,
  levelRefs,
}: {
  isMobile: boolean;
  activeLevel: null | 1 | 2 | 3;
  levelRefs: Record<1 | 2 | 3, React.RefObject<HTMLDivElement>>;
}) {
  const [lines, setLines] = useState<
    Array<{
      level: 1 | 2 | 3;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      isExpanded: boolean;
    }>
  >([]);

  useEffect(() => {
    if (isMobile) return;

    const lineConfigs: Record<1 | 2 | 3, LineConfig> = {
      1: { level: 1, yFraction: 0.25, marginLeft: 120, marginRight: 120 },  // top
      2: { level: 2, yFraction: 0.5, marginLeft: 80, marginRight: 80 },     // middle
      3: { level: 3, yFraction: 0.75, marginLeft: 150, marginRight: 30 },   // bottom
    };

    const updateLines = () => {
      const designCycleSection = document.getElementById('design-cycle');
      if (!designCycleSection) return;

      const sectionRect = designCycleSection.getBoundingClientRect();

      const newLines = (Object.values(lineConfigs) as LineConfig[]).map((config) => {
        const levelRef = levelRefs[config.level];
        const levelDiv = levelRef.current;

        if (!levelDiv) return null;

        const levelRect = levelDiv.getBoundingClientRect();
        const levelButton = levelDiv.querySelector(`#bp-level-0${config.level}-btn`) as HTMLElement | null;

        if (!levelButton) return null;

        const levelBtnRect = levelButton.getBoundingClientRect();

        // Y position within the level: use fraction of level's height
        const y = levelRect.top + levelRect.height * config.yFraction;

        // X coordinates in viewport
        const x1 = levelBtnRect.right - config.marginLeft;
        const canvasLeft = sectionRect.left + sectionRect.width * 0.75;
        const x2 = canvasLeft + config.marginRight;

        const isExpanded = activeLevel === config.level;

        return {
          level: config.level,
          x1,
          y1: y,
          x2,
          y2: y,
          isExpanded,
        };
      });

      setLines(newLines.filter((l) => l !== null));
    };

    const handleScroll = () => {
      requestAnimationFrame(updateLines);
    };

    updateLines();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateLines);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateLines);
    };
  }, [isMobile, activeLevel, levelRefs]);

  if (isMobile) return null;

  return (
    <svg
      width={window.innerWidth}
      height={window.innerHeight}
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {lines.map((line) => (
        <line
          key={line.level}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity={line.isExpanded ? 1 : 0.3}
          style={{
            color: 'rgba(26, 26, 26, 0.4)',
            transition: 'opacity 0.45s ease',
          }}
        />
      ))}
    </svg>
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

function BpCard({ children }: { children: ReactNode }) {
  return (
    <div style={{ border: `1px solid ${BP_LINE}`, padding: '16px 18px', backgroundColor: BP_FILL }}>
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

// ── Body content ───────────────────────────────────────────────────────────

function CapabilitiesBody({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(190px, 1fr))', gap: isMobile ? 10 : 14 }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {flowStages.map((stage) => (
          <BpCard key={stage.title}>
            <BpCardTitle>{stage.title}</BpCardTitle>
            <BpList items={stage.items} />
          </BpCard>
        ))}
      </div>
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
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 10 : 14 }}>
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
  levelRef?: React.RefObject<HTMLDivElement>;
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
      style={{ borderBottom: `1px solid ${BP_LINE}`, minHeight: isMobile ? '120px' : '140px' }}
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
          alignItems: 'center',
          gap: isMobile ? 14 : 22,
          padding: isMobile ? '20px 0 10px' : '36px 0 14px',
          background: 'none',
          border: 'none',
          cursor: isMobile ? 'pointer' : 'default',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 14, letterSpacing: '0.1em', color: BP_MID, fontWeight: 600, flexShrink: 0, minWidth: 24, fontVariantNumeric: 'tabular-nums' }}>
          {num}
        </span>
        <span style={{ fontSize: isMobile ? 16 : 19, letterSpacing: '0.06em', color: BP_INK, fontWeight: 600, textTransform: 'uppercase', flexShrink: 0 }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 0, borderBottom: `1px dashed ${BP_DASH}`, margin: '0 2px', minWidth: 16 }} aria-hidden="true" />
        <span style={{ fontSize: isMobile ? 14 : 15, color: BP_DARK, flexShrink: 0, lineHeight: 1.4 }}>
          {subtitle}
        </span>
        <span
          style={{
            fontSize: 18,
            color: BP_MID,
            flexShrink: 0,
            lineHeight: 1,
            marginLeft: 4,
            display: 'inline-block',
            transition: `transform ${reducedMotion ? '0s' : '0.25s'} ease`,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
          aria-hidden="true"
        >
          +
        </span>
      </button>

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
              paddingBottom: isMobile ? 28 : 36,
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
      const row01Btn = document.getElementById('bp-level-01-btn');
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
    const row01Btn = document.getElementById('bp-level-01-btn');
    if (row01Btn) ro.observe(row01Btn);
    window.addEventListener('resize', scheduled);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', scheduled);
    };
  }, [isMobile]);

  const levelProps = {
    isMobile,
    reducedMotion: prefersReduced,
  };

  return (
    <section
      id="design-cycle"
      className="practice-section bg-pure px-6 pt-8 pb-12 sm:px-6 sm:pt-20 sm:pb-24"
      style={isMobile ? undefined : { minHeight: 'calc(100svh - 48px)' }}
    >
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
            <ScrollSection entryDirection="bottom" motionRole="case-intro">
              <h2 className="type-display-m type-display-m-plus" style={{ color: BP_INK, marginBottom: 12 }}>
                My Design Cycle
              </h2>
              <p
                className="type-subhead"
                style={{
                  color: BP_DARK,
                  maxWidth: '56ch',
                  marginBottom: isMobile ? 48 : 96,
                  lineHeight: 1.45,
                  fontSize: isMobile ? 16 : 22,
                }}
              >
                A human-centered design cycle ensuring solutions are functional, meaningful, and sustainable.
              </p>
            </ScrollSection>

            <ScrollSection entryDirection="bottom" motionRole="case-block">
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
                  num="01"
                  title="My Capabilities & Toolkits"
                  subtitle="Research · Design · Technical · AI-Augmented"
                  mobileExpanded={expanded.has('01')}
                  onMobileToggle={() => toggle('01')}
                  onHoverStart={() => dispatchLevel(1)}
                  onHoverEnd={() => dispatchLevel(null)}
                  levelRef={levelRefs[1]}
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
                >
                  <FlowBody isMobile={isMobile} />
                </BpLevel>

                <BpLevel
                  {...levelProps}
                  num="03"
                  title="My Design Philosophy"
                  subtitle="Three Lenses of Human-Centered Design"
                  mobileExpanded={expanded.has('03')}
                  onMobileToggle={() => toggle('03')}
                  onHoverStart={() => dispatchLevel(3)}
                  onHoverEnd={() => dispatchLevel(null)}
                  levelRef={levelRefs[3]}
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
      <ConnectorLines isMobile={isMobile} activeLevel={activeLevel} levelRefs={levelRefs} />
    </section>
  );
}
