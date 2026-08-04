import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { useRef, useState, type ReactNode } from 'react';
import { ScrollSection } from './ScrollSection';
import { FitToBand } from './MobileSceneBand';
import { useViewportWidth } from '../hooks/use-viewport-width';

// Below this width the desktop multi-column scenes can't be shown at a
// legible size, so we render the dedicated mobile scene layouts instead.
const MOBILE_MAX_WIDTH = 639;

/* ============================================================
   ACCESSIBILITY WORKFLOW — scroll-driven 6-act narrative
   Tokens: Source Serif 4 + Source Sans 3 only
   Palette: --color-ink, --color-dark, --color-pale, --color-accent,
            --color-base, --color-mist, --color-cloud, --color-pure
   No new colors. No monospace font. No severity colors.
   ============================================================ */

const TECH_LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum"',
};

const ACT_TITLES = [
  '01 — Setup & Bridge',
  '02 — The Scan',
  '03 — Full Coverage',
  '04 — Human Check',
  '05 — Remediation',
  '06 — The Report',
] as const;

type WcagWorkflowProps = {
  beforeWorkflow?: ReactNode;
  standardsConnector?: ReactNode;
};

export function WcagWorkflow({ beforeWorkflow, standardsConnector }: WcagWorkflowProps = {}) {
  // Mobile runs the same scroll-driven scene system, but each scene is
  // re-authored for a single narrow column at full, accessible font sizes
  // (no CSS scale). The fully static fallback only fires for
  // prefers-reduced-motion (handled inside WcagWorkflowDesktop).
  return (
    <WcagWorkflowDesktop
      beforeWorkflow={beforeWorkflow}
      standardsConnector={standardsConnector}
    />
  );
}

/* ============================================================
   SCROLL PROGRESS — circular watch-face indicator
   ============================================================ */

function ScrollProgress({ progress }: { progress: MotionValue<number> }) {
  const RADIUS = 14;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const SIZE = 36;

  // strokeDashoffset: full circumference = 0%, 0 = 100%
  const dashOffset = useTransform(progress, [0, 1], [CIRCUMFERENCE, 0]);
  // Percentage label: 0–100
  const [pct, setPct] = useState(0);
  useMotionValueEvent(progress, 'change', (v) => setPct(Math.round(v * 100)));

  return (
    <div className="flex flex-col items-center gap-1" style={{ lineHeight: 1 }}>
      <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
        {/* Track */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
          style={{ display: 'block' }}
        >
          {/* Tick marks at each act boundary (6 acts = every 60°) */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
            const inner = RADIUS - 3;
            const outer = RADIUS - 1;
            return (
              <line
                key={i}
                x1={SIZE / 2 + inner * Math.cos(angle)}
                y1={SIZE / 2 + inner * Math.sin(angle)}
                x2={SIZE / 2 + outer * Math.cos(angle)}
                y2={SIZE / 2 + outer * Math.sin(angle)}
                stroke="var(--color-pale)"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}
          {/* Background ring */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-pale)"
            strokeWidth="1"
            opacity="0.25"
          />
          {/* Progress arc — starts at 12 o'clock */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-pale)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            style={{ strokeDashoffset: dashOffset, rotate: '-90deg', transformOrigin: 'center' }}
          />
        </svg>
        {/* Center percentage */}
        <span
          style={{
            ...TECH_LABEL_STYLE,
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 7,
            color: 'var(--color-pale)',
            letterSpacing: '0.02em',
          }}
        >
          {pct}
        </span>
      </div>
      <span style={{ ...TECH_LABEL_STYLE, fontSize: 7, color: 'var(--color-pale)', opacity: 0.5, letterSpacing: '0.06em' }}>
        PROG
      </span>
    </div>
  );
}

/* ============================================================
   DESKTOP — pinned 600vh scrollytelling
   ============================================================ */

function WcagWorkflowDesktop({ beforeWorkflow, standardsConnector }: WcagWorkflowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth <= MOBILE_MAX_WIDTH;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });

  // Each scene gets a long hold-at-100 plateau so the viewer can absorb the
  // final composition before the next scene fades in. Cross-fades are short
  // (≈2% of total scroll) and happen only at the very edge between scenes.
  const scene1 = useTransform(p, [0.0, 0.04, 0.155, 0.175], [0, 1, 1, 0]);
  const scene2 = useTransform(p, [0.16, 0.18, 0.32, 0.34], [0, 1, 1, 0]);
  const scene3 = useTransform(p, [0.325, 0.345, 0.485, 0.505], [0, 1, 1, 0]);
  const scene4 = useTransform(p, [0.49, 0.51, 0.65, 0.67], [0, 1, 1, 0]);
  const scene5 = useTransform(p, [0.655, 0.675, 0.815, 0.835], [0, 1, 1, 0]);
  const scene6 = useTransform(p, [0.82, 0.84, 1.0, 1.0], [0, 1, 1, 1]);

  // Local progress is compressed so internal animations finish at ~0.75 of
  // the slot, leaving the last 25% as a static "look-at-the-result" hold.
  const s1Local = useTransform(p, [0.0, 0.125], [0, 1]);
  const s2Local = useTransform(p, [0.165, 0.29], [0, 1]);
  const s3Local = useTransform(p, [0.33, 0.455], [0, 1]);
  const s4Local = useTransform(p, [0.495, 0.62], [0, 1]);
  const s5Local = useTransform(p, [0.66, 0.785], [0, 1]);
  const s6Local = useTransform(p, [0.825, 0.95], [0, 1]);

  const progressWidth = useTransform(p, [0, 1], ['0%', '100%']);

  if (shouldReduceMotion) {
    return (
      <WcagWorkflowMobile
        beforeWorkflow={beforeWorkflow}
        standardsConnector={standardsConnector}
      />
    );
  }

  return (
    <section
      aria-label="Accessibility workflow"
      style={{ backgroundColor: 'var(--color-base)' }}
    >
      <WorkflowIntro />
      {beforeWorkflow}
      {standardsConnector}

      <div
        ref={containerRef}
        style={{ height: isMobile ? '480vh' : '600vh', position: 'relative' }}
        className="relative wkf-scroll-container"
      >
        <div
          className="sticky top-0 h-screen overflow-hidden wkf-sticky"
          style={{ backgroundColor: 'var(--color-base)' }}
        >
          {!isMobile && <div className="wkf-chrome"><BlueprintGrid /></div>}

          {/* HUD — paddingTop clears the fixed 48px site navbar so the
              workflow title + progress line are visible on every screen. */}
          <div
            className="absolute top-0 left-0 right-0 z-50 pointer-events-none px-6 sm:px-8"
            style={{ paddingTop: 64 }}
          >
            <div
              className="flex justify-between items-center type-micro uppercase"
              style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
            >
              <span>WCAG Audit</span>
              <SceneLabel scrollProgress={p} />
              <span>06 / Acts</span>
            </div>
            <div
              className="mt-3 relative"
              style={{
                height: 1,
                backgroundColor: 'var(--color-pale)',
                opacity: 0.4,
              }}
            >
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  width: progressWidth,
                  backgroundColor: 'var(--color-ink)',
                }}
              />
              {[0.166, 0.333, 0.5, 0.666, 0.833].map((t, i) => (
                <div
                  key={i}
                  className="absolute top-0"
                  style={{
                    left: `${t * 100}%`,
                    width: 1,
                    height: 8,
                    backgroundColor: 'var(--color-pale)',
                  }}
                />
              ))}
            </div>
            {!isMobile && (
              <div
                className="mt-1.5 type-micro uppercase flex justify-between wkf-hud-subline"
                style={{ ...TECH_LABEL_STYLE, color: 'var(--color-pale)' }}
              >
                <span>00.000</span>
                <DimensionLabel scrollProgress={p} />
                <span>01.000</span>
              </div>
            )}
          </div>

          {!isMobile && <div className="wkf-chrome"><CornerMarks /></div>}

          {/* Stage */}
          <div className="relative w-full h-full flex items-center justify-center wkf-stage">
            {isMobile ? (
              <>
                <Scene1Mobile opacity={scene1} local={s1Local} />
                <Scene2Mobile opacity={scene2} local={s2Local} />
                <Scene3Mobile opacity={scene3} local={s3Local} />
                <Scene4Mobile opacity={scene4} local={s4Local} />
                <Scene5Mobile opacity={scene5} local={s5Local} />
                <Scene6Mobile opacity={scene6} local={s6Local} />
              </>
            ) : (
              <>
                <Scene1 opacity={scene1} local={s1Local} />
                <Scene2 opacity={scene2} local={s2Local} />
                <Scene3 opacity={scene3} local={s3Local} />
                <Scene4 opacity={scene4} local={s4Local} />
                <Scene5 opacity={scene5} local={s5Local} />
                <Scene6 opacity={scene6} local={s6Local} />
              </>
            )}
          </div>

          {/* Bottom drawing-block */}
          <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none px-6 sm:px-8 pb-5 wkf-bottom-hud">
            <div
              className="pt-3 flex justify-between items-end type-micro uppercase"
              style={{
                ...TECH_LABEL_STYLE,
                color: 'var(--color-pale)',
                borderTop: '1px solid var(--color-pale)',
              }}
            >
              {!isMobile && (
                <div className="wkf-bottom-meta">
                  <div style={{ opacity: 0.6 }}>DWG · 01</div>
                  <div style={{ color: 'var(--color-dark)' }}>WCAG-AUDIT-FLOW</div>
                </div>
              )}
              {!isMobile && (
                <div className="text-center wkf-bottom-meta">
                  <div style={{ opacity: 0.6 }}>SCALE</div>
                  <div style={{ color: 'var(--color-dark)' }}>1 : 1</div>
                </div>
              )}
              <ScrollProgress progress={p} />
            </div>
          </div>
        </div>
      </div>

      <WorkflowOutro />
    </section>
  );
}

/* ============================================================
   INTRO + OUTRO
   ============================================================ */

function WorkflowIntro() {
  return (
    <div
      className="px-6 sm:px-6 pt-8 pb-24 sm:pt-20 sm:pb-32"
      style={{ borderBottom: '1px solid var(--color-pale)' }}
    >
      <div className="hero-breakout mx-auto">
        <ScrollSection entryDirection="bottom" motionRole="case-block" delay={0.05}>
          <h2 className="type-display-l text-ink" style={{ maxWidth: '34ch' }}>
            Auditing accessibility, end to end.
          </h2>
        </ScrollSection>

        <div className="mt-16 grid grid-cols-3 md:grid-cols-12 gap-x-4 gap-y-8 md:gap-8 pt-8" style={{ borderTop: '1px solid var(--color-pale)' }}>
          <ScrollSection entryDirection="bottom" motionRole="about-paragraph" delay={0.05} className="col-span-3 md:col-span-8">
            <p className="type-meta uppercase mb-3" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
              Accessibility Systems
            </p>
            <p className="type-subhead text-ink">
              I approach accessibility auditing at two points in the product lifecycle. A11y Audit
              runs locally in Figma to review design files before development. My web audit workflow
              combines several tools to scan and remediate accessibility issues in live sites.
              Together, they form one continuous practice guided by the same WCAG standards.
            </p>
          </ScrollSection>
          <ScrollSection entryDirection="bottom" motionRole="about-paragraph" delay={0.1} className="col-span-3 md:col-span-4">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-x-4 md:gap-8">
              <div className="md:col-span-2">
                <p className="type-meta uppercase mb-3" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
                  Standard
                </p>
                <p className="type-subhead text-ink">
                  WCAG 2.2
                  <br />
                  Level AA
                </p>
              </div>
              <div>
                <p className="type-meta uppercase mb-3" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
                  Modes
                </p>
                <p className="type-subhead text-ink">02</p>
              </div>
              <div>
                <p className="type-meta uppercase mb-3" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
                  Year
                </p>
                <p className="type-subhead text-ink">2026</p>
              </div>
            </div>
          </ScrollSection>
        </div>
      </div>
    </div>
  );
}

function WorkflowOutro() {
  return (
    <div
      className="px-6 sm:px-8 py-24 sm:py-32 relative"
      style={{
        backgroundColor: 'var(--color-base)',
        borderTop: '1px solid var(--color-pale)',
      }}
    >
      <div className="hero-breakout mx-auto relative z-10">
        <ScrollSection entryDirection="bottom" motionRole="case-intro">
          <p className="type-micro uppercase mb-8" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            Outcome
          </p>
        </ScrollSection>
        <ScrollSection entryDirection="bottom" motionRole="case-block" delay={0.05}>
          <h2 className="type-display-m text-ink" style={{ maxWidth: '32ch' }}>
            A site that passes, and a client that understands why.
          </h2>
        </ScrollSection>

        <div
          className="mt-20 grid md:grid-cols-3 gap-12 pt-8"
          style={{ borderTop: '1px solid var(--color-pale)' }}
        >
          {(
            [
              ['Stack', 'Claude Code · Playwright MCP · axe-core · WebAIM'],
              ['Standard', 'WCAG 2.2 AA'],
              ['Deliverable', 'Interactive HTML report with progress tracking'],
            ] as const
          ).map(([k, v], i) => (
            <ScrollSection key={k} entryDirection="bottom" motionRole="about-paragraph" delay={0.05 + i * 0.05}>
              <p className="type-micro uppercase mb-3" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
                {k}
              </p>
              <p className="type-body text-ink">{v}</p>
            </ScrollSection>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MOBILE FALLBACK — 6 acts as vertical stacked sections
   ============================================================ */

function WcagWorkflowMobile({ beforeWorkflow, standardsConnector }: WcagWorkflowProps = {}) {
  return (
    <section aria-label="Accessibility workflow" style={{ backgroundColor: 'var(--color-base)' }}>
      <WorkflowIntro />
      {beforeWorkflow}
      {standardsConnector}
      <div className="px-6 py-12" style={{ borderBottom: '1px solid var(--color-pale)' }}>
        <div className="hero-breakout mx-auto space-y-12">
          <MobileAct
            title={ACT_TITLES[0]}
            heading="The toolbox assembles."
            caption="Bridge connected. The browser is now an instrument."
          >
            <MobileToolboxDiagram />
          </MobileAct>
          <MobileAct
            title={ACT_TITLES[1]}
            heading="The page is read."
            caption="Automated coverage: 30–40% of all issues."
          >
            <MobileScanDiagram />
          </MobileAct>
          <MobileAct
            title={ACT_TITLES[2]}
            heading="One page becomes eleven."
            caption="Issues consolidated by criterion, not by page."
          >
            <MobileCoverageDiagram />
          </MobileAct>
          <MobileAct
            title={ACT_TITLES[3]}
            heading="What machines can't see."
            caption="Three checks no scanner can replicate."
          >
            <MobileHumanCheckDiagram />
          </MobileAct>
          <MobileAct
            title={ACT_TITLES[4]}
            heading="Findings become fixes."
            caption="Patched in the source · re-audited with the same prompt."
          >
            <MobileRemediationDiagram />
          </MobileAct>
          <MobileAct
            title={ACT_TITLES[5]}
            heading="A report the client can use."
            caption="Filterable. Trackable. Self-documenting."
          >
            <MobileReportDiagram />
          </MobileAct>
        </div>
      </div>
      <WorkflowOutro />
    </section>
  );
}

function MobileAct({
  title,
  heading,
  caption,
  children,
}: {
  title: string;
  heading: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <ScrollSection entryDirection="bottom" motionRole="case-block">
      <div className="grid grid-cols-[auto_1fr] gap-4 mb-6">
        <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
          {title}
        </p>
      </div>
      <h3 className="type-display-s text-ink mb-8" style={{ maxWidth: '18ch' }}>
        {heading}
      </h3>
      <div
        className="my-5 py-6 px-4"
        style={{
          border: '1px solid var(--color-pale)',
          backgroundColor: 'var(--color-pure)',
        }}
      >
        {children}
      </div>
      <p className="type-meta" style={{ color: 'var(--color-dark)' }}>
        {caption}
      </p>
    </ScrollSection>
  );
}

/* ============================================================
   SHARED — corner marks, scene labels, captions
   ============================================================ */

function CornerMarks() {
  const dotStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-pale)',
    opacity: 0.6,
  };
  return (
    <>
      <div className="absolute pointer-events-none" style={{ top: 110, left: 24 }}>
        <div className="absolute top-0 left-0" style={{ width: 12, height: 1, ...dotStyle }} />
        <div className="absolute top-0 left-0" style={{ width: 1, height: 12, ...dotStyle }} />
      </div>
      <div className="absolute pointer-events-none" style={{ top: 110, right: 24 }}>
        <div className="absolute top-0 right-0" style={{ width: 12, height: 1, ...dotStyle }} />
        <div className="absolute top-0 right-0" style={{ width: 1, height: 12, ...dotStyle }} />
      </div>
      <div className="absolute pointer-events-none" style={{ bottom: 90, left: 24 }}>
        <div className="absolute bottom-0 left-0" style={{ width: 12, height: 1, ...dotStyle }} />
        <div className="absolute bottom-0 left-0" style={{ width: 1, height: 12, ...dotStyle }} />
      </div>
      <div className="absolute pointer-events-none" style={{ bottom: 90, right: 24 }}>
        <div className="absolute bottom-0 right-0" style={{ width: 12, height: 1, ...dotStyle }} />
        <div className="absolute bottom-0 right-0" style={{ width: 1, height: 12, ...dotStyle }} />
      </div>
    </>
  );
}

function SceneLabel({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const [label, setLabel] = useState<string>(ACT_TITLES[0]);
  useMotionValueEvent(scrollProgress, 'change', (v: number) => {
    if (v < 0.166) setLabel(ACT_TITLES[0]);
    else if (v < 0.333) setLabel(ACT_TITLES[1]);
    else if (v < 0.5) setLabel(ACT_TITLES[2]);
    else if (v < 0.666) setLabel(ACT_TITLES[3]);
    else if (v < 0.833) setLabel(ACT_TITLES[4]);
    else setLabel(ACT_TITLES[5]);
  });
  return (
    <span style={{ ...TECH_LABEL_STYLE, color: 'var(--color-ink)', fontWeight: 500 }}>{label}</span>
  );
}

function DimensionLabel({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const [v, setV] = useState<string>('0.000');
  useMotionValueEvent(scrollProgress, 'change', (val: number) => setV(val.toFixed(3)));
  return <span style={TECH_LABEL_STYLE}>{v}</span>;
}

function BlueprintGrid() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(149,148,146,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(149,148,146,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </>
  );
}

function CaptionWrap({
  local,
  from,
  text,
  mobile,
}: {
  local: MotionValue<number>;
  from: number;
  text: string;
  mobile?: boolean;
}) {
  const opacity = useTransform(local, [from, from + 0.05], [0, 1]);
  const y = useTransform(local, [from, from + 0.05], [8, 0]);

  if (mobile) {
    return (
      <motion.div style={{ opacity, y }} className="mt-6 text-center">
        <div
          className="type-meta uppercase"
          style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
        >
          {text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ opacity, y, bottom: '9%' }}
      className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none"
    >
      <div
        className="type-micro uppercase"
        style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)', maxWidth: '34rem' }}
      >
        {text}
      </div>
    </motion.div>
  );
}

/* Mobile scene wrapper — single narrow column at full accessible font
   sizes. The scene is laid out inside the SAFE BAND between the top HUD
   (~80px) and the bottom HUD (~72px) so it never overlaps or is cropped
   by them. The whole scene is then auto-scaled down (never up) just
   enough to fit the band's height, so every scene shows in ONE screen
   without scrolling and without shrinking the type unless a scene is
   genuinely taller than the viewport allows.
   The act heading is shown inline (desktop hides it via wkf-scene-title). */
function MobileScene({
  opacity,
  act,
  heading,
  children,
}: {
  opacity: MotionValue<number>;
  act: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{ opacity }}
      className="absolute left-0 right-0 wkf-mobile-scene flex items-center justify-center px-5"
    >
      <FitToBand>
        <div
          className="type-micro uppercase mb-2"
          style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
        >
          Act {act}
        </div>
        <h3 className="type-display-s text-ink mb-5">{heading}</h3>
        {children}
      </FitToBand>
    </motion.div>
  );
}


/* ============================================================
   SCENE 1 — SETUP & MCP BRIDGE
   ============================================================ */

function Scene1Mobile({
  opacity,
  local,
}: {
  opacity: MotionValue<number>;
  local: MotionValue<number>;
}) {
  const stepBrain = useTransform(local, [0.05, 0.18], [0, 1]);
  const arrow1Progress = useTransform(local, [0.18, 0.3], [0, 1]);
  const stepBridge = useTransform(local, [0.25, 0.36], [0, 1]);
  const arrow2Progress = useTransform(local, [0.36, 0.48], [0, 1]);
  const stepHands = useTransform(local, [0.42, 0.54], [0, 1]);
  const arrow3Progress = useTransform(local, [0.54, 0.66], [0, 1]);
  const stepInspector = useTransform(local, [0.6, 0.72], [0, 1]);
  const foundation = useTransform(local, [0.72, 0.85], [0, 1]);
  const foundationY = useTransform(foundation, [0, 1], [8, 0]);

  const chain = [
    { appear: stepBrain, variant: 'primary' as const, num: '01', label: 'Claude Code', role: 'the brain', spec: 'cli · anthropic' },
    { appear: stepBridge, variant: 'bridge' as const, num: '02', label: 'MCP', role: 'the bridge', spec: 'model context protocol' },
    { appear: stepHands, variant: 'secondary' as const, num: '03', label: 'Playwright + Chromium', role: 'the hands', spec: 'browser automation' },
    { appear: stepInspector, variant: 'secondary' as const, num: '04', label: 'axe-core', role: 'the inspector', spec: 'wcag rule engine' },
  ];
  const connectors = [arrow1Progress, arrow2Progress, arrow3Progress];

  return (
    <MobileScene opacity={opacity} act="01 / Setup" heading="The toolbox assembles.">
      <div className="flex flex-col">
        {chain.map((node, i) => (
          <div key={node.num}>
            <MobileChainNode {...node} />
            {i < chain.length - 1 && (
              <div className="relative mx-auto h-7 w-px">
                <div className="absolute inset-0 w-px mx-auto" style={{ backgroundColor: 'var(--color-pale)' }} />
                <motion.div
                  className="absolute top-0 left-1/2 w-px -translate-x-1/2 origin-top"
                  style={{ height: '100%', scaleY: connectors[i], backgroundColor: 'var(--color-ink)', opacity: 0.55 }}
                />
              </div>
            )}
          </div>
        ))}

        <motion.div
          style={{ opacity: foundation, y: foundationY }}
          className="mt-5 grid grid-cols-2 gap-3"
        >
          {[
            ['A', 'Node.js', 'runtime · v20'],
            ['B', 'npm', 'pkg manager'],
          ].map(([num, label, detail]) => (
            <div
              key={num}
              className="border p-3"
              style={{ borderColor: 'var(--color-pale)', backgroundColor: 'var(--color-pure)' }}
            >
              <div className="flex items-center gap-2">
                <span className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)', opacity: 0.7 }}>
                  {num}
                </span>
                <span className="type-meta" style={{ color: 'var(--color-ink)', fontWeight: 500 }}>
                  {label}
                </span>
              </div>
              <div className="type-micro uppercase mt-1" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
                {detail}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <CaptionWrap
        local={local}
        from={0.86}
        mobile
        text="Claude orchestrates · MCP carries instructions · the browser performs the audit."
      />
    </MobileScene>
  );
}

function Scene1({ opacity, local }: { opacity: MotionValue<number>; local: MotionValue<number> }) {
  const titleY = useTransform(local, [0, 0.2], [40, 0]);
  const titleO = useTransform(local, [0, 0.15], [0, 1]);

  // Sequence: brain → bridge → hands → inspector, each appearing in turn,
  // with arrows drawing between them as scroll progresses.
  // Foundation row (Node.js + npm) appears last, beneath the chain.
  const stepBrain = useTransform(local, [0.05, 0.18], [0, 1]);
  const arrow1Progress = useTransform(local, [0.18, 0.3], [0, 1]);
  const stepBridge = useTransform(local, [0.25, 0.36], [0, 1]);
  const arrow2Progress = useTransform(local, [0.36, 0.48], [0, 1]);
  const stepHands = useTransform(local, [0.42, 0.54], [0, 1]);
  const arrow3Progress = useTransform(local, [0.54, 0.66], [0, 1]);
  const stepInspector = useTransform(local, [0.6, 0.72], [0, 1]);
  const foundation = useTransform(local, [0.72, 0.85], [0, 1]);

  // Layout: 4 nodes in a horizontal chain. SVG layer underneath draws arrows.
  // Stage width 1040, height 360. Center vertically near y=140 for the chain,
  // y=290 for the foundation row.
  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center">
      <SceneTitle
        act="01 / Setup"
        heading="The toolbox assembles."
        description="Five tools click into place around Claude Code. Each one has a single, clear job in the audit pipeline."
        titleO={titleO}
        titleY={titleY}
      />

      <SideAnnotation
        side="right"
        position="top"
        code="A · CHAIN"
        label="Brain → Bridge → Hands → Inspector"
        detail="four roles, one pipeline"
        local={local}
        from={0.45}
      />
      <SideAnnotation
        side="right"
        position="bottom"
        code="B · FOUNDATION"
        label="Node.js + npm"
        detail="runtime the stack runs on"
        local={local}
        from={0.78}
      />

      <div className="relative" style={{ width: 1040, height: 380, marginTop: 20 }}>
        {/* Arrow layer — solid lines drawn left to right, heads fade in once each line completes */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="1040"
          height="380"
          viewBox="0 0 1040 380"
        >
          {/* arrow 1: Brain → Bridge */}
          <motion.line
            x1={210}
            y1={140}
            x2={350}
            y2={140}
            stroke="var(--color-ink)"
            strokeOpacity={0.55}
            strokeWidth={1.5}
            style={{ pathLength: arrow1Progress }}
          />
          <ArrowHead progress={arrow1Progress} x={350} y={140} />
          {/* arrow 2: Bridge → Hands */}
          <motion.line
            x1={490}
            y1={140}
            x2={620}
            y2={140}
            stroke="var(--color-ink)"
            strokeOpacity={0.55}
            strokeWidth={1.5}
            style={{ pathLength: arrow2Progress }}
          />
          <ArrowHead progress={arrow2Progress} x={620} y={140} />
          {/* arrow 3: Hands → Inspector */}
          <motion.line
            x1={830}
            y1={140}
            x2={960}
            y2={140}
            stroke="var(--color-ink)"
            strokeOpacity={0.55}
            strokeWidth={1.5}
            style={{ pathLength: arrow3Progress }}
          />
          <ArrowHead progress={arrow3Progress} x={960} y={140} />
          {/* foundation bracket — appears beneath the chain */}
          <motion.line
            x1={60}
            y1={250}
            x2={60}
            y2={290}
            stroke="var(--color-pale)"
            strokeWidth={1}
            style={{ pathLength: foundation }}
          />
          <motion.line
            x1={60}
            y1={290}
            x2={520}
            y2={290}
            stroke="var(--color-pale)"
            strokeWidth={1}
            style={{ pathLength: foundation }}
          />
          <motion.line
            x1={520}
            y1={290}
            x2={520}
            y2={250}
            stroke="var(--color-pale)"
            strokeWidth={1}
            style={{ pathLength: foundation }}
          />
        </svg>

        {/* Chain — main row */}
        <ChainNode
          x={20}
          y={50}
          width={190}
          appear={stepBrain}
          variant="primary"
          num="01"
          label="Claude Code"
          role="the brain"
          spec="cli · anthropic"
        />
        <ChainNode
          x={350}
          y={70}
          width={140}
          appear={stepBridge}
          variant="bridge"
          num="02"
          label="MCP"
          role="the bridge"
          spec="model context protocol"
        />
        <ChainNode
          x={620}
          y={50}
          width={210}
          appear={stepHands}
          variant="secondary"
          num="03"
          label="Playwright + Chromium"
          role="the hands"
          spec="browser automation"
        />
        <ChainNode
          x={960}
          y={70}
          width={150}
          appear={stepInspector}
          variant="secondary"
          num="04"
          label="axe-core"
          role="the inspector"
          spec="wcag rule engine"
        />

        {/* Foundation row */}
        <FoundationCell x={60} y={300} appear={foundation} num="A" label="Node.js" detail="runtime · v20" />
        <FoundationCell x={300} y={300} appear={foundation} num="B" label="npm" detail="pkg manager" />
      </div>

      <CaptionWrap
        local={local}
        from={0.86}
        text="Claude orchestrates · MCP carries instructions · the browser performs the audit."
      />
    </motion.div>
  );
}

/* ── Arrow head — appears only after its line is fully drawn ──────── */
function ArrowHead({
  progress,
  x,
  y,
}: {
  progress: MotionValue<number>;
  x: number;
  y: number;
}) {
  // Tail of the head sits 6px to the left of the line's end so it points cleanly.
  const opacity = useTransform(progress, [0.9, 1], [0, 1]);
  return (
    <motion.path
      d={`M ${x - 6} ${y - 4} L ${x} ${y} L ${x - 6} ${y + 4} Z`}
      fill="var(--color-ink)"
      fillOpacity={0.55}
      style={{ opacity }}
    />
  );
}

/* ── Chain node — used for the 4 main steps in Act 01 ───────────────── */
function ChainNode({
  x,
  y,
  width,
  appear,
  variant,
  num,
  label,
  role,
  spec,
}: {
  x: number;
  y: number;
  width: number;
  appear: MotionValue<number>;
  variant: 'primary' | 'bridge' | 'secondary';
  num: string;
  label: string;
  role: string;
  spec: string;
}) {
  const opacity = useTransform(appear, [0, 1], [0, 1]);
  const scale = useTransform(appear, [0, 1], [0.92, 1]);
  const isPrimary = variant === 'primary';
  const isBridge = variant === 'bridge';

  const bg = isPrimary ? 'var(--color-ink)' : 'var(--color-pure)';
  const fg = isPrimary ? 'var(--color-pure)' : 'var(--color-ink)';
  const muted = isPrimary ? 'rgba(255,255,255,0.55)' : 'var(--color-dark)';
  const borderStyle = isBridge ? '1px dashed var(--color-accent)' : '1px solid var(--color-pale)';

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        opacity,
        scale,
      }}
    >
      <div
        style={{
          backgroundColor: bg,
          border: borderStyle,
          color: fg,
        }}
      >
        <div
          className="px-3 py-1.5 flex justify-between items-center type-micro uppercase"
          style={{
            ...TECH_LABEL_STYLE,
            borderBottom: `1px solid ${isPrimary ? 'rgba(255,255,255,0.15)' : 'var(--color-pale)'}`,
            color: muted,
          }}
        >
          <span>{num}</span>
          <span style={{ fontStyle: 'italic', textTransform: 'lowercase', letterSpacing: '0.05em' }}>
            {role}
          </span>
        </div>
        <div className="px-3 py-3">
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: isPrimary ? 22 : 18,
              fontWeight: 400,
              lineHeight: 1.1,
              color: fg,
              letterSpacing: '-0.005em',
            }}
          >
            {label}
          </div>
          <div
            className="type-micro uppercase mt-1"
            style={{ ...TECH_LABEL_STYLE, color: muted }}
          >
            {spec}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Mobile chain node — full-width single-column version of ChainNode ── */
function MobileChainNode({
  appear,
  variant,
  num,
  label,
  role,
  spec,
}: {
  appear: MotionValue<number>;
  variant: 'primary' | 'bridge' | 'secondary';
  num: string;
  label: string;
  role: string;
  spec: string;
}) {
  const opacity = useTransform(appear, [0, 1], [0, 1]);
  const y = useTransform(appear, [0, 1], [12, 0]);
  const isPrimary = variant === 'primary';
  const isBridge = variant === 'bridge';

  const bg = isPrimary ? 'var(--color-ink)' : 'var(--color-pure)';
  const fg = isPrimary ? 'var(--color-pure)' : 'var(--color-ink)';
  const muted = isPrimary ? 'rgba(255,255,255,0.55)' : 'var(--color-dark)';
  const borderStyle = isBridge ? '1px dashed var(--color-accent)' : '1px solid var(--color-pale)';

  return (
    <motion.div style={{ opacity, y }}>
      <div style={{ backgroundColor: bg, border: borderStyle, color: fg }}>
        <div
          className="px-4 py-2 flex justify-between items-center type-micro uppercase"
          style={{
            ...TECH_LABEL_STYLE,
            borderBottom: `1px solid ${isPrimary ? 'rgba(255,255,255,0.15)' : 'var(--color-pale)'}`,
            color: muted,
          }}
        >
          <span>{num}</span>
          <span style={{ fontStyle: 'italic', textTransform: 'lowercase', letterSpacing: '0.05em' }}>
            {role}
          </span>
        </div>
        <div className="px-4 py-3">
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 20,
              fontWeight: 400,
              lineHeight: 1.15,
              color: fg,
              letterSpacing: '-0.005em',
            }}
          >
            {label}
          </div>
          <div className="type-micro uppercase mt-1" style={{ ...TECH_LABEL_STYLE, color: muted }}>
            {spec}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Foundation cell — Node.js / npm at the bottom row ──────────────── */
function FoundationCell({
  x,
  y,
  appear,
  num,
  label,
  detail,
}: {
  x: number;
  y: number;
  appear: MotionValue<number>;
  num: string;
  label: string;
  detail: string;
}) {
  const opacity = useTransform(appear, [0, 1], [0, 1]);
  const yOffset = useTransform(appear, [0, 1], [6, 0]);
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        y: yOffset,
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="type-micro uppercase"
          style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)', opacity: 0.7 }}
        >
          {num}
        </span>
        <div>
          <span
            className="type-meta"
            style={{ color: 'var(--color-ink)', fontWeight: 500 }}
          >
            {label}
          </span>
          <span
            className="type-micro uppercase ml-3"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            {detail}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function SceneTitle({
  act,
  heading,
  description,
  titleO,
  titleY,
}: {
  act: string;
  heading: string;
  description?: string;
  titleO: MotionValue<number>;
  titleY: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ opacity: titleO, y: titleY, top: '13%' }}
      className="absolute left-8 sm:left-12 pointer-events-none wkf-scene-title"
    >
      <div
        className="type-micro uppercase mb-3"
        style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
      >
        Act {act}
      </div>
      <h3 className="type-display-m text-ink" style={{ maxWidth: '12ch' }}>
        {heading}
      </h3>
      {description ? (
        <p
          className="type-meta mt-4"
          style={{ color: 'var(--color-dark)', maxWidth: '28ch', lineHeight: 1.5 }}
        >
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}

/* Side annotations rendered at the stage edges — true blueprint feel */
function SideAnnotation({
  side,
  position,
  code,
  label,
  detail,
  local,
  from,
}: {
  side: 'left' | 'right';
  position: 'top' | 'bottom';
  code: string;
  label: string;
  detail: string;
  local: MotionValue<number>;
  from: number;
}) {
  const opacity = useTransform(local, [from, from + 0.1], [0, 1]);
  const x = useTransform(local, [from, from + 0.1], [side === 'left' ? -8 : 8, 0]);
  const verticalClass = position === 'top' ? 'top-[24%]' : 'bottom-[22%]';
  const sideClass = side === 'left' ? 'left-8 sm:left-12' : 'right-8 sm:right-12';
  return (
    <motion.div
      style={{ opacity, x }}
      className={`absolute ${verticalClass} ${sideClass} pointer-events-none wkf-side-annotation`}
    >
      <div className="flex items-center gap-2 mb-2">
        {side === 'left' ? null : <div style={{ width: 32, height: 1, backgroundColor: 'var(--color-pale)' }} />}
        <span
          className="type-micro uppercase"
          style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)', opacity: 0.6 }}
        >
          {code}
        </span>
        {side === 'left' ? <div style={{ width: 32, height: 1, backgroundColor: 'var(--color-pale)' }} /> : null}
      </div>
      <div
        className="type-meta uppercase"
        style={{ ...TECH_LABEL_STYLE, color: 'var(--color-ink)', fontWeight: 500, maxWidth: 180 }}
      >
        {label}
      </div>
      <div
        className="type-micro uppercase mt-1"
        style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)', maxWidth: 180 }}
      >
        {detail}
      </div>
    </motion.div>
  );
}

/* ============================================================
   SCENE 2 — THE SCAN
   ============================================================ */

const SCAN_ISSUES = [
  { x: 80, y: 60, weight: 'heavy', t: 0.42, code: '1.1.1' },
  { x: 220, y: 110, weight: 'medium', t: 0.5, code: '1.4.3' },
  { x: 140, y: 170, weight: 'light', t: 0.55, code: '1.3.1' },
  { x: 280, y: 220, weight: 'heavy', t: 0.6, code: '4.1.2' },
  { x: 60, y: 270, weight: 'light', t: 0.65, code: '2.4.4' },
  { x: 200, y: 320, weight: 'medium', t: 0.7, code: '2.4.7' },
] as const;

const SCAN_ISSUE_LABELS: Record<string, string> = {
  '1.1.1': 'Non-text content',
  '1.4.3': 'Contrast (minimum)',
  '1.3.1': 'Info & relationships',
  '4.1.2': 'Name, role, value',
  '2.4.4': 'Link purpose',
  '2.4.7': 'Focus visible',
};

function Scene2MobileRow({
  iss,
  local,
}: {
  iss: (typeof SCAN_ISSUES)[number];
  local: MotionValue<number>;
}) {
  const opacity = useTransform(local, [iss.t, iss.t + 0.05], [0, 1]);
  const x = useTransform(local, [iss.t, iss.t + 0.05], [-14, 0]);
  const dim = iss.weight === 'heavy' ? 10 : iss.weight === 'medium' ? 8 : 6;
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: '1px solid var(--color-pale)', opacity, x }}
    >
      <span className="shrink-0" style={{ width: dim, height: dim, backgroundColor: 'var(--color-ink)' }} />
      <span className="type-body text-ink flex-1">{SCAN_ISSUE_LABELS[iss.code]}</span>
      <span className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
        {iss.code}
      </span>
    </motion.div>
  );
}

function Scene2Mobile({
  opacity,
  local,
}: {
  opacity: MotionValue<number>;
  local: MotionValue<number>;
}) {
  const injectO = useTransform(local, [0.25, 0.4], [0, 1]);
  return (
    <MobileScene opacity={opacity} act="02 / Scan" heading="The page is read.">
      <motion.div
        style={{ opacity: injectO }}
        className="mb-4 inline-flex w-fit items-center gap-2 border px-3 py-1.5 type-micro uppercase"
      >
        <span style={{ ...TECH_LABEL_STYLE, color: 'var(--color-accent)' }}>axe.run( )</span>
        <span style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>90+ rules · WCAG 2.2</span>
      </motion.div>

      <div className="border bg-[var(--color-pure)]" style={{ borderColor: 'var(--color-pale)' }}>
        <div
          className="flex justify-between px-4 py-2 type-micro uppercase"
          style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)', borderBottom: '1px solid var(--color-pale)' }}
        >
          <span>Findings</span>
          <span>06 issues</span>
        </div>
        <div>
          {SCAN_ISSUES.map((iss) => (
            <Scene2MobileRow key={iss.code} iss={iss} local={local} />
          ))}
        </div>
      </div>

      <CaptionWrap local={local} from={0.88} mobile text="Automated coverage: 30–40% of all issues." />
    </MobileScene>
  );
}

function Scene2({ opacity, local }: { opacity: MotionValue<number>; local: MotionValue<number> }) {
  const titleO = useTransform(local, [0, 0.15], [0, 1]);
  const titleY = useTransform(local, [0, 0.15], [40, 0]);

  const wireO = useTransform(local, [0.1, 0.25], [0, 1]);
  const injectO = useTransform(local, [0.25, 0.4], [0, 1]);
  const scanY = useTransform(local, [0.35, 0.75], [0, 360]);
  const scanO = useTransform(local, [0.32, 0.4, 0.75, 0.8], [0, 1, 1, 0]);

  const issues = SCAN_ISSUES;

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center">
      <SceneTitle
        act="02 / Scan"
        heading="The page is read."
        description="axe-core sweeps every element on the page, checking it against more than 90 WCAG rules and surfacing the failures."
        titleO={titleO}
        titleY={titleY}
      />

      <SideAnnotation
        side="right"
        position="top"
        code="A · SCAN"
        label="90+ rules · WCAG 2.2"
        detail="injected at runtime"
        local={local}
        from={0.4}
      />
      <SideAnnotation
        side="right"
        position="bottom"
        code="B · OUTPUT"
        label="Findings grouped"
        detail="by severity & criterion"
        local={local}
        from={0.7}
      />

      <motion.div style={{ opacity: wireO }} className="relative">
        <div
          style={{
            backgroundColor: 'var(--color-pure)',
            border: '1px solid var(--color-pale)',
            width: 360,
            height: 400,
            position: 'relative',
          }}
        >
          <div
            className="absolute -top-5 left-0 right-0 flex justify-between type-micro uppercase"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            <span>TARGET · 01</span>
            <span>360 × 400 px</span>
          </div>

          <div
            className="px-3 py-2 flex items-center gap-1.5"
            style={{
              borderBottom: '1px solid var(--color-pale)',
              backgroundColor: 'var(--color-mist)',
            }}
          >
            <div style={{ width: 8, height: 8, border: '1px solid var(--color-pale)' }} />
            <div style={{ width: 8, height: 8, border: '1px solid var(--color-pale)' }} />
            <div style={{ width: 8, height: 8, border: '1px solid var(--color-pale)' }} />
            <div
              className="ml-3 type-micro"
              style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
            >
              client-project.example
            </div>
          </div>

          <div className="p-5 relative" style={{ height: 366 }}>
            <div className="space-y-3 relative z-10">
              <div style={{ height: 12, backgroundColor: 'var(--color-mist)', width: '66%' }} />
              <div style={{ height: 8, backgroundColor: 'var(--color-mist)', width: '100%' }} />
              <div style={{ height: 8, backgroundColor: 'var(--color-mist)', width: '83%' }} />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div style={{ height: 60, border: '1px solid var(--color-pale)' }} />
                <div style={{ height: 60, border: '1px solid var(--color-pale)' }} />
              </div>
              <div style={{ height: 8, backgroundColor: 'var(--color-mist)', width: '75%' }} className="mt-4" />
              <div style={{ height: 8, backgroundColor: 'var(--color-mist)', width: '100%' }} />
              <div style={{ height: 8, backgroundColor: 'var(--color-mist)', width: '66%' }} />
              <div style={{ height: 36, border: '1px solid var(--color-pale)', width: 128 }} className="mt-4" />
              <div style={{ height: 8, backgroundColor: 'var(--color-mist)', width: '100%' }} className="mt-4" />
              <div style={{ height: 8, backgroundColor: 'var(--color-mist)', width: '83%' }} />
            </div>

            <motion.div
              style={{ opacity: injectO, color: 'var(--color-accent)' }}
              className="absolute top-2 right-2 type-micro z-20"
            >
              <span style={TECH_LABEL_STYLE}>axe.run( )</span>
            </motion.div>

            <motion.div
              style={{ y: scanY, opacity: scanO }}
              className="absolute left-0 right-0 top-0 pointer-events-none z-30"
            >
              <div style={{ height: 1, backgroundColor: 'var(--color-accent)' }} />
              <div
                style={{
                  height: 48,
                  marginTop: -48,
                  background:
                    'linear-gradient(to bottom, rgba(52,64,64,0.16), transparent)',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>

            {issues.map((iss, i) => (
              <IssueDot key={i} {...iss} local={local} />
            ))}
          </div>
        </div>
      </motion.div>

      <CaptionWrap local={local} from={0.88} text="Automated coverage: 30–40% of all issues." />
    </motion.div>
  );
}

function IssueDot({
  x,
  y,
  weight,
  t,
  code,
  local,
}: {
  x: number;
  y: number;
  weight: 'heavy' | 'medium' | 'light';
  t: number;
  code: string;
  local: MotionValue<number>;
}) {
  // Hierarchy expressed via opacity + size, not color
  const dim = weight === 'heavy' ? { size: 10, op: 1 } : weight === 'medium' ? { size: 8, op: 0.7 } : { size: 6, op: 0.5 };
  const opacity = useTransform(local, [t, t + 0.04], [0, dim.op]);
  const scale = useTransform(local, [t, t + 0.04, t + 0.08], [0, 1.4, 1]);
  return (
    <motion.div style={{ left: x, top: y, opacity, scale }} className="absolute z-40">
      <div className="relative">
        <div
          style={{
            width: dim.size,
            height: dim.size,
            backgroundColor: 'var(--color-ink)',
            outline: '3px solid var(--color-pure)',
          }}
        />
        <div
          className="absolute type-micro uppercase whitespace-nowrap"
          style={{
            ...TECH_LABEL_STYLE,
            left: dim.size + 6,
            top: 0,
            color: 'var(--color-dark)',
            fontSize: 9,
          }}
        >
          {code}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   SCENE 3 — FULL COVERAGE
   ============================================================ */

function Scene3Mobile({
  opacity,
  local,
}: {
  opacity: MotionValue<number>;
  local: MotionValue<number>;
}) {
  const pages = Array.from({ length: 11 }, (_, i) => i);
  return (
    <MobileScene opacity={opacity} act="03 / Coverage" heading="One page becomes eleven.">
      <div
        className="mb-3 flex justify-between type-micro uppercase"
        style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
      >
        <span>Plate index · 01–11</span>
        <span>Site-wide crawl</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {pages.map((i) => (
          <MiniPage key={i} index={i} local={local} mobile />
        ))}
      </div>
      <CaptionWrap local={local} from={0.85} mobile text="Issues consolidated by criterion, not by page." />
    </MobileScene>
  );
}

function Scene3({ opacity, local }: { opacity: MotionValue<number>; local: MotionValue<number> }) {
  const titleO = useTransform(local, [0, 0.15], [0, 1]);
  const titleY = useTransform(local, [0, 0.15], [40, 0]);

  const pages = Array.from({ length: 11 }, (_, i) => i);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center">
      <SceneTitle
        act="03 / Coverage"
        heading="One page becomes eleven."
        description="The same scan runs across every route reachable from the navbar and footer, building a site-wide picture of what to fix."
        titleO={titleO}
        titleY={titleY}
      />

      <SideAnnotation
        side="right"
        position="top"
        code="A · METHOD"
        label="Crawl from navbar + footer"
        detail="every internal route"
        local={local}
        from={0.4}
      />
      <SideAnnotation
        side="right"
        position="bottom"
        code="B · CONSOLIDATION"
        label="Grouped by criterion"
        detail="not by page"
        local={local}
        from={0.65}
      />

      <div className="relative" style={{ width: 700, height: 440 }}>
        <motion.div
          style={{ opacity: useTransform(local, [0.05, 0.2], [0, 1]) }}
          className="absolute -top-2 left-0 right-0 flex justify-between type-micro uppercase"
        >
          <span style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>PLATE INDEX · 01–11</span>
          <span style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>SITE-WIDE CRAWL</span>
        </motion.div>

        <div className="grid grid-cols-4 gap-5 absolute inset-0 place-items-center pt-4">
          {pages.map((i) => (
            <MiniPage key={i} index={i} local={local} />
          ))}
        </div>
      </div>

      <CaptionWrap local={local} from={0.85} text="Issues consolidated by criterion, not by page." />
    </motion.div>
  );
}

function MiniPage({
  index,
  local,
  mobile,
}: {
  index: number;
  local: MotionValue<number>;
  mobile?: boolean;
}) {
  const t0 = 0.15 + index * 0.025;
  const t1 = t0 + 0.1;
  const opacity = useTransform(local, [t0, t1], [0, 1]);
  const y = useTransform(local, [t0, t1], [10, 0]);

  const dotT = t1 + 0.05;

  return (
    <motion.div style={{ opacity, y }} className="relative w-full">
      <div
        style={{
          width: mobile ? '100%' : 120,
          height: mobile ? undefined : 95,
          aspectRatio: mobile ? '120 / 95' : undefined,
          backgroundColor: 'var(--color-pure)',
          border: '1px solid var(--color-pale)',
          position: 'relative',
        }}
      >
        <div
          className="absolute -top-3 left-0 type-micro uppercase"
          style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
        >
          P/{String(index + 1).padStart(2, '0')}
        </div>
        <div
          style={{
            height: 10,
            borderBottom: '1px solid var(--color-pale)',
            backgroundColor: 'var(--color-mist)',
          }}
        />
        <div className="p-2 space-y-1">
          <div style={{ height: 4, backgroundColor: 'var(--color-mist)', width: '75%' }} />
          <div style={{ height: 4, backgroundColor: 'var(--color-mist)', width: '100%' }} />
          <div style={{ height: 4, backgroundColor: 'var(--color-mist)', width: '83%' }} />
          <div style={{ height: 16, border: '1px solid var(--color-pale)', width: '100%' }} className="mt-1.5" />
          <div style={{ height: 4, backgroundColor: 'var(--color-mist)', width: '66%' }} className="mt-1" />
        </div>
        <MiniPageDot local={local} dotT={dotT} x={12 + (index % 3) * 14} y={18 + (index % 4) * 6} baseOp={1} show />
        <MiniPageDot
          local={local}
          dotT={dotT}
          x={30 + (index % 4) * 8}
          y={38 + (index % 3) * 10}
          baseOp={0.7}
          show={index % 3 >= 1}
        />
        <MiniPageDot local={local} dotT={dotT} x={50} y={55} baseOp={0.5} show={index % 3 >= 2} />
      </div>
    </motion.div>
  );
}

function MiniPageDot({
  local,
  dotT,
  x,
  y,
  baseOp,
  show,
}: {
  local: MotionValue<number>;
  dotT: number;
  x: number;
  y: number;
  baseOp: number;
  show: boolean;
}) {
  const opacity = useTransform(local, [dotT, dotT + 0.05], [0, baseOp]);
  if (!show) return null;
  return (
    <motion.div
      style={{
        left: x,
        top: y,
        backgroundColor: 'var(--color-ink)',
        opacity,
        outline: '2px solid var(--color-pure)',
        width: 6,
        height: 6,
        position: 'absolute',
      }}
    />
  );
}

/* ============================================================
   SCENE 4 — HUMAN CHECK
   ============================================================ */

function Scene4Mobile({
  opacity,
  local,
}: {
  opacity: MotionValue<number>;
  local: MotionValue<number>;
}) {
  return (
    <MobileScene opacity={opacity} act="04 / Manual" heading="What machines can't see.">
      <div className="flex flex-col gap-8">
        <Instrument label="KEYBOARD" code="A" local={local} from={0.1} mobile>
          <TabKeyDemo local={local} />
        </Instrument>
        <Instrument label="SCREEN READER" code="B" local={local} from={0.3} mobile>
          <ScreenReaderDemo local={local} />
        </Instrument>
        <Instrument label="CONTRAST" code="C" local={local} from={0.5} mobile>
          <ContrastDemo local={local} />
        </Instrument>
      </div>
      <CaptionWrap local={local} from={0.88} mobile text="Three checks no scanner can replicate." />
    </MobileScene>
  );
}

function Scene4({ opacity, local }: { opacity: MotionValue<number>; local: MotionValue<number> }) {
  const titleO = useTransform(local, [0, 0.15], [0, 1]);
  const titleY = useTransform(local, [0, 0.15], [40, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center">
      <SceneTitle
        act="04 / Manual"
        heading="What machines can't see."
        description="Three checks no automated scan catches: tabbing through with a keyboard, listening with a screen reader, and verifying contrast by eye."
        titleO={titleO}
        titleY={titleY}
      />

      <SideAnnotation
        side="right"
        position="top"
        code="A · STAGE 5"
        label="Manual verification"
        detail="2.1.1 · 2.4.7 · 1.4.3"
        local={local}
        from={0.5}
      />
      <SideAnnotation
        side="right"
        position="bottom"
        code="B · CRITERIA"
        label="Beyond automation"
        detail="screen readers · contrast"
        local={local}
        from={0.75}
      />

      <div
        className="relative flex items-start justify-center gap-10 lg:gap-16"
        style={{ paddingTop: 50, maxWidth: '70vw' }}
      >
        <Instrument label="KEYBOARD" code="A" local={local} from={0.1}>
          <TabKeyDemo local={local} />
        </Instrument>
        <Instrument label="SCREEN READER" code="B" local={local} from={0.3}>
          <ScreenReaderDemo local={local} />
        </Instrument>
        <Instrument label="CONTRAST" code="C" local={local} from={0.5}>
          <ContrastDemo local={local} />
        </Instrument>
      </div>

      <CaptionWrap local={local} from={0.88} text="Three checks no scanner can replicate." />
    </motion.div>
  );
}

function Instrument({
  label,
  code,
  children,
  local,
  from,
  mobile,
}: {
  label: string;
  code: string;
  children: ReactNode;
  local: MotionValue<number>;
  from: number;
  mobile?: boolean;
}) {
  const opacity = useTransform(local, [from, from + 0.1], [0, 1]);
  const y = useTransform(local, [from, from + 0.1], [20, 0]);
  return (
    <motion.div style={{ opacity, y }} className="relative w-full">
      <div
        style={{
          width: mobile ? '100%' : 200,
          padding: '16px 16px 24px',
          borderLeft: '1px solid var(--color-pale)',
          borderTop: '1px solid var(--color-pale)',
          position: 'relative',
        }}
      >
        <div
          className="absolute type-micro uppercase"
          style={{
            ...TECH_LABEL_STYLE,
            top: -10,
            left: 12,
            backgroundColor: 'var(--color-base)',
            padding: '0 6px',
          }}
        >
          <span style={{ color: 'var(--color-dark)' }}>INSTR · {code}</span>
          <span style={{ color: 'var(--color-ink)', marginLeft: 8 }}>{label}</span>
        </div>
        <div className="flex items-center justify-center" style={{ minHeight: mobile ? 160 : 200 }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function TabKeyDemo({ local }: { local: MotionValue<number> }) {
  const press = useTransform(local, [0.25, 0.3, 0.35, 0.4, 0.45, 0.5], [0, 1, 0, 1, 0, 1]);
  const focusIdx = useTransform(local, [0.25, 0.35, 0.45, 0.55], [0, 1, 2, 3]);
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(focusIdx, 'change', (v: number) => setIdx(Math.floor(v)));

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        style={{
          scale: useTransform(press, [0, 1], [1, 0.92]),
          backgroundColor: 'var(--color-pure)',
          border: '1px solid var(--color-ink)',
        }}
        className="px-4 py-2 type-meta"
      >
        ⇥ Tab
      </motion.div>
      <div className="space-y-1.5">
        {['Skip to content', 'Home', 'About', 'Contact'].map((label, i) => (
          <div
            key={i}
            className="px-3 py-1.5 type-meta"
            style={{
              width: 160,
              border:
                i === idx ? '1px solid var(--color-accent)' : '1px solid var(--color-pale)',
              backgroundColor: i === idx ? 'var(--color-pure)' : 'transparent',
              color: i === idx ? 'var(--color-ink)' : 'var(--color-dark)',
              outline: i === idx ? '1px solid var(--color-accent)' : 'none',
              outlineOffset: 2,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenReaderDemo({ local }: { local: MotionValue<number> }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <rect x="32" y="32" width="16" height="16" fill="var(--color-ink)" />
          <motion.circle
            cx="40"
            cy="40"
            r="22"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="0.75"
            style={{
              opacity: useTransform(local, [0.4, 0.55, 0.7], [0, 0.6, 0]),
              scale: useTransform(local, [0.4, 0.7], [0.7, 1.4]),
              transformOrigin: '40px 40px',
            }}
          />
          <motion.circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="0.5"
            style={{
              opacity: useTransform(local, [0.45, 0.6, 0.75], [0, 0.4, 0]),
              scale: useTransform(local, [0.45, 0.75], [0.6, 1.5]),
              transformOrigin: '40px 40px',
            }}
          />
        </svg>
      </div>
      <div
        className="px-3 py-2 type-meta"
        style={{
          backgroundColor: 'var(--color-ink)',
          color: 'var(--color-pure)',
          ...TECH_LABEL_STYLE,
        }}
      >
        <Typewriter local={local} from={0.5} to={0.75} text='"button, Submit form"' />
      </div>
    </div>
  );
}

function Typewriter({
  local,
  from,
  to,
  text,
}: {
  local: MotionValue<number>;
  from: number;
  to: number;
  text: string;
}) {
  const t = useTransform(local, [from, to], [0, text.length]);
  const [shown, setShown] = useState('');
  useMotionValueEvent(t, 'change', (v: number) => setShown(text.slice(0, Math.floor(v))));
  return <span>{shown}</span>;
}

function ContrastDemo({ local }: { local: MotionValue<number> }) {
  // Sweeps from a failing ratio (2.5:1) up past the 4.5:1 AA threshold to
  // a comfortable AAA-territory ratio (7.2:1).
  const ratio = useTransform(local, [0.55, 0.85], [2.5, 7.2]);
  const [r, setR] = useState('2.5');
  useMotionValueEvent(ratio, 'change', (v: number) => setR(v.toFixed(1)));

  // Background morphs from low-contrast pale to ink (no color)
  const bgLight = useTransform(local, [0.55, 0.85], [1, 0]);
  const [pass, setPass] = useState(false);
  // Passes when the actual ratio crosses 4.5:1 (WCAG AA for normal text)
  useMotionValueEvent(ratio, 'change', (v: number) => setPass(v >= 4.5));

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="flex items-center justify-center"
        style={{
          width: 128,
          height: 80,
          backgroundColor: 'var(--color-ink)',
          opacity: useTransform(bgLight, (v) => 1 - v * 0.7), // morphs darkness
          border: '1px solid var(--color-pale)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 24,
            color: 'var(--color-pure)',
            fontWeight: 500,
          }}
        >
          Aa
        </span>
      </motion.div>
      <div className="type-meta flex items-center gap-2" style={TECH_LABEL_STYLE}>
        <span style={{ color: 'var(--color-dark)' }}>RATIO</span>
        <span
          style={{
            color: pass ? 'var(--color-ink)' : 'var(--color-dark)',
            fontWeight: 500,
          }}
        >
          {r}:1
        </span>
        <span
          className="type-micro uppercase"
          style={{
            color: pass ? 'var(--color-ink)' : 'var(--color-dark)',
            fontWeight: 500,
          }}
        >
          {pass ? 'PASS' : 'FAIL'}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   SCENE 5 — REMEDIATION
   ============================================================ */

const LEDGER_ITEMS: [string, string][] = [
  ['Missing alt text', '1.1.1'],
  ['Form input no label', '4.1.2'],
  ['Contrast fails 4.5:1', '1.4.3'],
  ['Heading skip h1→h3', '1.3.1'],
  ['Focus invisible', '2.4.7'],
  ['Empty link text', '2.4.4'],
];

/* Universal remediation panel — a source-level diff view. Accessibility
   fixes are shown as edits to the markup/styles themselves (alt attribute,
   heading tag, color token), which is how remediation works in ANY stack
   (HTML, JSX, Vue, templating, frameworks) — not tied to any CMS or
   page builder. */
function SourceFixPanel({ local }: { local: MotionValue<number> }) {
  const codeStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
    letterSpacing: '0.01em',
  };
  return (
    <>
      <div
        className="px-3 py-2 type-micro uppercase flex justify-between items-center"
        style={{ ...TECH_LABEL_STYLE, backgroundColor: 'var(--color-ink)', color: 'var(--color-pure)' }}
      >
        <span>Source · Diff</span>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>PATCH · 01</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Fix 1 — add an alt attribute to an image */}
        <div>
          <div className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            1.1.1 · Image alt text
          </div>
          <div
            className="mt-1 px-2.5 py-2 type-meta"
            style={{ border: '1px solid var(--color-pale)', backgroundColor: 'var(--color-base)', ...codeStyle }}
          >
            <span style={{ color: 'var(--color-dark)' }}>&lt;img src="hero.jpg" </span>
            <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
              alt="<Typewriter local={local} from={0.45} to={0.7} text="Counseling session in progress" />"
            </span>
            <span style={{ color: 'var(--color-dark)' }}> /&gt;</span>
          </div>
        </div>
        {/* Fix 2 — correct the heading level */}
        <div>
          <div className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            1.3.1 · Heading level
          </div>
          <div
            className="mt-1 px-2.5 py-2 type-meta flex items-center gap-2"
            style={{ border: '1px solid var(--color-pale)', backgroundColor: 'var(--color-base)', ...codeStyle }}
          >
            <span
              style={{
                color: 'var(--color-dark)',
                textDecoration: 'line-through',
                textDecorationColor: 'var(--color-pale)',
              }}
            >
              &lt;h3&gt;
            </span>
            <span style={{ color: 'var(--color-dark)' }}>→</span>
            <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>&lt;h2&gt;</span>
            <span className="ml-auto type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
              order fixed
            </span>
          </div>
        </div>
        {/* Fix 3 — bump the text color token to a passing contrast */}
        <div>
          <div className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            1.4.3 · Text color token
          </div>
          <div className="mt-1 flex items-center gap-2 type-meta" style={codeStyle}>
            <div
              style={{ width: 18, height: 18, backgroundColor: 'var(--color-ink)', border: '1px solid var(--color-pale)' }}
            />
            <span style={{ color: 'var(--color-dark)' }}>color:</span>
            <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>#111111</span>
            <span className="ml-auto type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-ink)' }}>
              ✓ 12.6:1 PASS
            </span>
          </div>
        </div>
      </div>
      <div
        className="px-3 py-2 type-micro uppercase flex justify-between"
        style={{ ...TECH_LABEL_STYLE, borderTop: '1px solid var(--color-pale)', color: 'var(--color-dark)' }}
      >
        <span>DIFF · 03 EDITS</span>
        <span>COMMIT</span>
      </div>
    </>
  );
}

function Scene5Mobile({
  opacity,
  local,
}: {
  opacity: MotionValue<number>;
  local: MotionValue<number>;
}) {
  const panelO = useTransform(local, [0.2, 0.4], [0, 1]);
  return (
    <MobileScene opacity={opacity} act="05 / Repair" heading="Findings become fixes.">
      <div className="flex flex-col gap-6">
        <div>
          <div
            className="pb-1.5 mb-3 flex justify-between type-micro uppercase"
            style={{ ...TECH_LABEL_STYLE, borderBottom: '1px solid var(--color-pale)', color: 'var(--color-dark)' }}
          >
            <span>Issue Ledger</span>
            <span>06 items</span>
          </div>
          <div className="space-y-2">
            {LEDGER_ITEMS.map(([label, code], i) => (
              <HealingRow key={i} label={label} code={code} index={i} local={local} />
            ))}
          </div>
        </div>

        <motion.div
          style={{
            opacity: panelO,
            backgroundColor: 'var(--color-pure)',
            border: '1px solid var(--color-pale)',
          }}
        >
          <SourceFixPanel local={local} />
        </motion.div>
      </div>

      <CaptionWrap local={local} from={0.88} mobile text="Patched in the source · re-audited with the same prompt." />
    </MobileScene>
  );
}

function Scene5({ opacity, local }: { opacity: MotionValue<number>; local: MotionValue<number> }) {
  const titleO = useTransform(local, [0, 0.15], [0, 1]);
  const titleY = useTransform(local, [0, 0.15], [40, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center">
      <SceneTitle
        act="05 / Repair"
        heading="Findings become fixes."
        description="Each issue is patched at the source—alt attributes, heading levels, contrast tokens—then the audit runs again to confirm the fix. Same approach in any stack."
        titleO={titleO}
        titleY={titleY}
      />

      <SideAnnotation
        side="right"
        position="top"
        code="A · STAGE 6"
        label="Source-level edits"
        detail="markup · styles · tokens"
        local={local}
        from={0.4}
      />
      <SideAnnotation
        side="right"
        position="bottom"
        code="B · LOOP"
        label="Re-audit with axe"
        detail="confirm every patch"
        local={local}
        from={0.7}
      />

      <div className="flex items-start gap-16 lg:gap-24" style={{ paddingTop: 50, maxWidth: '70vw' }}>
        {/* Left — issue ledger */}
        <motion.div
          style={{ opacity: useTransform(local, [0.05, 0.18], [0, 1]), width: 280 }}
        >
          <div
            className="pb-1.5 mb-3 flex justify-between type-micro uppercase"
            style={{
              ...TECH_LABEL_STYLE,
              borderBottom: '1px solid var(--color-pale)',
              color: 'var(--color-dark)',
            }}
          >
            <span>Issue Ledger</span>
            <span>06 ITEMS</span>
          </div>
          <div className="space-y-2">
            {LEDGER_ITEMS.map(([label, code], i) => (
              <HealingRow key={i} label={label} code={code} index={i} local={local} />
            ))}
          </div>
        </motion.div>

        {/* Right — source diff panel */}
        <motion.div
          style={{
            opacity: useTransform(local, [0.2, 0.4], [0, 1]),
            x: useTransform(local, [0.2, 0.4], [30, 0]),
            width: 300,
            backgroundColor: 'var(--color-pure)',
            border: '1px solid var(--color-pale)',
          }}
        >
          <SourceFixPanel local={local} />
        </motion.div>
      </div>

      <CaptionWrap local={local} from={0.88} text="Patched in the source · re-audited with the same prompt." />
    </motion.div>
  );
}

function HealingRow({
  label,
  code,
  index,
  local,
}: {
  label: string;
  code: string;
  index: number;
  local: MotionValue<number>;
}) {
  const t0 = 0.15 + index * 0.07;
  const t1 = t0 + 0.06;

  const rowO = useTransform(local, [t0, t0 + 0.05], [0, 1]);
  const rowX = useTransform(local, [t0, t0 + 0.05], [-15, 0]);
  const healed = useTransform(local, [t1 + 0.05, t1 + 0.1], [0, 1]);

  // Healed state shifts from outline-only square to filled square (no color)
  const dotOpacity = useTransform(healed, [0, 1], [0.3, 1]);
  const lineDecoration = useTransform(healed, [0, 1], [0, 1]);

  return (
    <motion.div style={{ opacity: rowO, x: rowX }} className="flex items-center gap-3 py-0.5">
      <motion.div
        style={{
          width: 8,
          height: 8,
          backgroundColor: 'var(--color-ink)',
          opacity: dotOpacity,
          flexShrink: 0,
        }}
      />
      <div className="flex-1 type-meta relative" style={{ color: 'var(--color-ink)' }}>
        {label}
        <motion.div
          style={{
            scaleX: lineDecoration,
            transformOrigin: 'left',
            backgroundColor: 'var(--color-dark)',
            opacity: 0.5,
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: 1,
          }}
        />
      </div>
      <div
        className="type-micro w-10 text-right"
        style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
      >
        {code}
      </div>
      <motion.div
        style={{
          opacity: healed,
          width: 12,
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          color: 'var(--color-ink)',
        }}
      >
        ✓
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   SCENE 6 — THE REPORT
   ============================================================ */

const REPORT_CARDS = [
  { label: 'Footer CTA contrast', code: '1.4.3', t: 0.55 },
  { label: 'Missing alt on hero', code: '1.1.1', t: 0.62 },
  { label: 'Heading skip in About', code: '1.3.1', t: 0.69 },
  { label: 'Form label missing', code: '4.1.2', t: 0.76 },
  { label: 'Focus indicator hidden', code: '2.4.7', t: 0.82 },
  { label: 'Link text "click here"', code: '2.4.4', t: 0.88 },
] as const;

function Scene6Mobile({
  opacity,
  local,
}: {
  opacity: MotionValue<number>;
  local: MotionValue<number>;
}) {
  const total = useTransform(local, [0.15, 0.4], [0, 47]);
  const found = useTransform(local, [0.18, 0.4], [0, 41]);
  const reviewed = useTransform(local, [0.21, 0.4], [0, 35]);
  const queued = useTransform(local, [0.24, 0.4], [0, 19]);
  const resolved = useTransform(local, [0.5, 0.95], [0, 47]);
  const progressW = useTransform(local, [0.5, 0.95], ['0%', '100%']);
  const cardO = useTransform(local, [0.1, 0.25], [0, 1]);
  const cardY = useTransform(local, [0.1, 0.25], [30, 0]);

  return (
    <MobileScene opacity={opacity} act="06 / Deliverable" heading="A report the client can use.">
      <motion.div
        style={{
          opacity: cardO,
          y: cardY,
          backgroundColor: 'var(--color-pure)',
          border: '1px solid var(--color-pale)',
        }}
      >
        <div className="px-4 py-4" style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-pure)' }}>
          <div className="type-micro uppercase mb-1" style={{ ...TECH_LABEL_STYLE, color: 'rgba(255,255,255,0.55)' }}>
            Consolidated Accessibility Report
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.2, color: 'var(--color-pure)' }}>
            Client Project · WCAG Audit
          </div>
          <div className="type-micro uppercase mt-1" style={{ ...TECH_LABEL_STYLE, color: 'rgba(255,255,255,0.55)' }}>
            WCAG 2.2 LEVEL AA · APR 2026
          </div>
        </div>

        <div
          className="grid grid-cols-3 gap-2 p-4"
          style={{ backgroundColor: 'var(--color-base)', borderBottom: '1px solid var(--color-pale)' }}
        >
          <StatCard label="Total" value={total} />
          <StatCard label="Found" value={found} />
          <StatCard label="Reviewed" value={reviewed} />
          <StatCard label="Queued" value={queued} />
          <StatCard label="Resolved" value={resolved} />
        </div>

        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-pale)' }}>
          <div
            className="flex justify-between type-micro uppercase mb-1.5"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            <span>Remediation Progress</span>
            <ProgressLabel local={local} />
          </div>
          <div style={{ height: 6, backgroundColor: 'var(--color-mist)' }}>
            <motion.div style={{ height: '100%', width: progressW, backgroundColor: 'var(--color-ink)' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 p-4">
          {REPORT_CARDS.map((c, i) => (
            <ReportCard key={i} {...c} local={local} />
          ))}
        </div>

        <div
          className="px-4 py-2 type-micro uppercase flex justify-between"
          style={{ ...TECH_LABEL_STYLE, borderTop: '1px solid var(--color-pale)', color: 'var(--color-dark)' }}
        >
          <span>06 / 06 shown</span>
          <span>Filterable</span>
        </div>
      </motion.div>

      <CaptionWrap local={local} from={0.92} mobile text="Filterable. Trackable. Self-documenting." />
    </MobileScene>
  );
}

function Scene6({ opacity, local }: { opacity: MotionValue<number>; local: MotionValue<number> }) {
  const titleO = useTransform(local, [0, 0.15], [0, 1]);
  const titleY = useTransform(local, [0, 0.15], [40, 0]);

  const total = useTransform(local, [0.15, 0.4], [0, 47]);
  const found = useTransform(local, [0.18, 0.4], [0, 41]);
  const reviewed = useTransform(local, [0.21, 0.4], [0, 35]);
  const queued = useTransform(local, [0.24, 0.4], [0, 19]);
  const resolved = useTransform(local, [0.5, 0.95], [0, 47]);
  const progressW = useTransform(local, [0.5, 0.95], ['0%', '100%']);

  const cardO = useTransform(local, [0.1, 0.25], [0, 1]);
  const cardY = useTransform(local, [0.1, 0.25], [30, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center">
      <SideAnnotation
        side="right"
        position="top"
        code="A · FORMAT"
        label="Self-hosted HTML"
        detail="no external dependencies"
        local={local}
        from={0.35}
      />
      <SideAnnotation
        side="right"
        position="bottom"
        code="B · TRACKING"
        label="Persisted progress"
        detail="filterable · re-auditable"
        local={local}
        from={0.6}
      />

      <motion.div
        style={{ opacity: titleO, y: titleY, top: '11%' }}
        className="absolute left-8 sm:left-12 pointer-events-none wkf-scene-title"
      >
        <div
          className="type-micro uppercase mb-3"
          style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
        >
          Act 06 / Deliverable
        </div>
        <h3 className="type-display-m text-ink" style={{ maxWidth: '12ch' }}>
          A report the client can use.
        </h3>
        <p
          className="type-meta mt-4"
          style={{ color: 'var(--color-dark)', maxWidth: '28ch', lineHeight: 1.5 }}
        >
          Every finding is bundled into a single self-hosted HTML page—filterable, trackable, and easy to share.
        </p>
      </motion.div>

      <motion.div
        style={{
          opacity: cardO,
          y: cardY,
          width: 720,
          maxWidth: '90vw',
          backgroundColor: 'var(--color-pure)',
          border: '1px solid var(--color-pale)',
          marginTop: 80,
          position: 'relative',
        }}
      >
        <div className="absolute left-0 right-0 flex justify-between type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)', top: -20 }}>
          <span>DELIVERABLE · HTML</span>
          <span>CLIENT-RPT-2026.04</span>
        </div>

        <div
          className="px-5 py-4"
          style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-pure)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div
                className="type-micro uppercase mb-1"
                style={{ ...TECH_LABEL_STYLE, color: 'rgba(255,255,255,0.55)' }}
              >
                Consolidated Accessibility Report
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 20,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: 'var(--color-pure)',
                }}
              >
                Client Project · WCAG Audit
              </div>
              <div
                className="type-micro uppercase mt-1"
                style={{ ...TECH_LABEL_STYLE, color: 'rgba(255,255,255,0.55)' }}
              >
                WCAG 2.2 LEVEL AA · APR 2026
              </div>
            </div>
            <div className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'rgba(255,255,255,0.55)' }}>
              <div>RPT</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>02</div>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-5 gap-2 p-4"
          style={{
            backgroundColor: 'var(--color-base)',
            borderBottom: '1px solid var(--color-pale)',
          }}
        >
          <StatCard label="Total" value={total} />
          <StatCard label="Found" value={found} />
          <StatCard label="Reviewed" value={reviewed} />
          <StatCard label="Queued" value={queued} />
          <StatCard label="Resolved" value={resolved} />
        </div>

        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-pale)' }}>
          <div
            className="flex justify-between type-micro uppercase mb-1.5"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            <span>Remediation Progress</span>
            <ProgressLabel local={local} />
          </div>
          <div
            style={{ height: 6, backgroundColor: 'var(--color-mist)', position: 'relative' }}
          >
            <motion.div
              style={{ height: '100%', width: progressW, backgroundColor: 'var(--color-ink)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 p-4">
          {REPORT_CARDS.map((c, i) => (
            <ReportCard key={i} {...c} local={local} />
          ))}
        </div>

        <div
          className="px-4 py-1.5 type-micro uppercase flex justify-between"
          style={{
            ...TECH_LABEL_STYLE,
            borderTop: '1px solid var(--color-pale)',
            color: 'var(--color-dark)',
          }}
        >
          <span>06 / 06 ISSUES SHOWN</span>
          <span>FILTERABLE · TRACKABLE</span>
        </div>
      </motion.div>

      <CaptionWrap local={local} from={0.92} text="Filterable. Trackable. Self-documenting." />
    </motion.div>
  );
}

function StatCard({ label, value }: { label: string; value: MotionValue<number> }) {
  const [v, setV] = useState('0');
  useMotionValueEvent(value, 'change', (val: number) => setV(Math.floor(val).toString()));
  return (
    <div
      className="p-2.5"
      style={{
        backgroundColor: 'var(--color-pure)',
        border: '1px solid var(--color-pale)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: 'var(--color-ink)',
        }}
      />
      <div
        className="type-micro uppercase mb-1"
        style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 28,
          lineHeight: 1,
          color: 'var(--color-ink)',
          ...TECH_LABEL_STYLE,
        }}
      >
        {v}
      </div>
    </div>
  );
}

function ProgressLabel({ local }: { local: MotionValue<number> }) {
  const pct = useTransform(local, [0.5, 0.95], [0, 100]);
  const [v, setV] = useState('0%');
  useMotionValueEvent(pct, 'change', (val: number) => setV(Math.floor(val) + '%'));
  return (
    <span style={{ ...TECH_LABEL_STYLE, color: 'var(--color-ink)', fontWeight: 500 }}>{v}</span>
  );
}

function ReportCard({
  label,
  code,
  t,
  local,
}: {
  label: string;
  code: string;
  t: number;
  local: MotionValue<number>;
}) {
  const enterO = useTransform(local, [0.3, 0.45], [0, 1]);
  const enterY = useTransform(local, [0.3, 0.45], [10, 0]);
  const checkedO = useTransform(local, [t, t + 0.04], [0, 1]);
  const fadeOut = useTransform(local, [t, t + 0.05], [1, 0.5]);

  return (
    <motion.div
      style={{
        opacity: enterO,
        y: enterY,
      }}
      className="p-2.5 relative"
      // Severity expressed via a top stripe in ink (not red/orange/yellow)
      // Healed state via fade-out only (no green checkmark)
    >
      <div
        style={{
          backgroundColor: 'var(--color-base)',
          border: '1px solid var(--color-pale)',
          padding: '10px 10px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'var(--color-ink)',
          }}
        />
        <motion.div style={{ opacity: fadeOut }} className="flex items-start gap-2">
          <div
            style={{
              width: 6,
              height: 6,
              marginTop: 4,
              backgroundColor: 'var(--color-ink)',
              flexShrink: 0,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="type-meta" style={{ color: 'var(--color-ink)', fontWeight: 500, lineHeight: 1.25 }}>
              {label}
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <div
                className="type-micro uppercase"
                style={{ ...TECH_LABEL_STYLE, color: 'var(--color-ink)' }}
              >
                ISSUE
              </div>
              <div
                className="type-micro"
                style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
              >
                {code}
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          style={{
            opacity: checkedO,
            position: 'absolute',
            top: 6,
            right: 6,
            width: 14,
            height: 14,
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-pure)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 9, lineHeight: 1 }}>✓</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   MOBILE DIAGRAMS — simplified static representations of each act
   ============================================================ */

function MobileToolboxDiagram() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="px-4 py-3 text-center"
        style={{
          backgroundColor: 'var(--color-ink)',
          color: 'var(--color-pure)',
          width: 200,
        }}
      >
        <div className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'rgba(255,255,255,0.55)' }}>
          ORCHESTRATOR
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, marginTop: 4 }}>Claude Code</div>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        {['Node.js', 'npm', 'Playwright', 'Chromium', 'axe-core'].map((t, i) => (
          <div
            key={i}
            className="px-3 py-2 type-meta"
            style={{
              border: '1px solid var(--color-pale)',
              backgroundColor: 'var(--color-pure)',
              gridColumn: i === 4 ? 'span 2' : undefined,
              textAlign: i === 4 ? 'center' : 'left',
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileScanDiagram() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-pure)',
        border: '1px solid var(--color-pale)',
        padding: 16,
        position: 'relative',
      }}
    >
      <div className="space-y-2">
        <div style={{ height: 8, backgroundColor: 'var(--color-mist)', width: '60%' }} />
        <div style={{ height: 6, backgroundColor: 'var(--color-mist)', width: '100%' }} />
        <div style={{ height: 6, backgroundColor: 'var(--color-mist)', width: '80%' }} />
        <div style={{ height: 24, border: '1px solid var(--color-pale)', width: 80 }} className="my-3" />
        <div style={{ height: 6, backgroundColor: 'var(--color-mist)', width: '90%' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 20,
          width: 8,
          height: 8,
          backgroundColor: 'var(--color-ink)',
          outline: '3px solid var(--color-pure)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 30,
          width: 8,
          height: 8,
          backgroundColor: 'var(--color-ink)',
          opacity: 0.6,
          outline: '3px solid var(--color-pure)',
        }}
      />
    </div>
  );
}

function MobileCoverageDiagram() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 60,
            backgroundColor: 'var(--color-pure)',
            border: '1px solid var(--color-pale)',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: 8,
              backgroundColor: 'var(--color-mist)',
              borderBottom: '1px solid var(--color-pale)',
            }}
          />
          {i % 2 === 0 && (
            <div
              style={{
                position: 'absolute',
                top: 18,
                right: 10,
                width: 5,
                height: 5,
                backgroundColor: 'var(--color-ink)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function MobileHumanCheckDiagram() {
  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      {[
        ['A', 'KEYBOARD'],
        ['B', 'READER'],
        ['C', 'CONTRAST'],
      ].map(([code, label]) => (
        <div
          key={code}
          className="py-4 px-2"
          style={{
            border: '1px solid var(--color-pale)',
            backgroundColor: 'var(--color-pure)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 24,
              color: 'var(--color-ink)',
            }}
          >
            {code}
          </div>
          <div
            className="type-micro uppercase mt-2"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileRemediationDiagram() {
  return (
    <div className="space-y-2">
      {[
        ['Missing alt text', '1.1.1'],
        ['Form input no label', '4.1.2'],
        ['Contrast fails 4.5:1', '1.4.3'],
      ].map(([label, code], i) => (
        <div key={i} className="flex items-center gap-3 py-1.5">
          <div
            style={{
              width: 8,
              height: 8,
              backgroundColor: 'var(--color-ink)',
              flexShrink: 0,
            }}
          />
          <div
            className="type-meta flex-1 relative"
            style={{ color: 'var(--color-ink)', textDecoration: 'line-through', textDecorationColor: 'var(--color-dark)' }}
          >
            {label}
          </div>
          <div className="type-micro" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            {code}
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileReportDiagram() {
  return (
    <div style={{ backgroundColor: 'var(--color-pure)', border: '1px solid var(--color-pale)' }}>
      <div
        className="px-3 py-2"
        style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-pure)' }}
      >
        <div
          className="type-micro uppercase"
          style={{ ...TECH_LABEL_STYLE, color: 'rgba(255,255,255,0.55)' }}
        >
          Consolidated Report
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, marginTop: 2 }}>
          Client Project · WCAG Audit
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {[
          ['Total', '47'],
          ['Found', '41'],
          ['Resolved', '47'],
        ].map(([k, v]) => (
          <div key={k} className="text-center">
            <div
              className="type-micro uppercase"
              style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
            >
              {k}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 24,
                color: 'var(--color-ink)',
                ...TECH_LABEL_STYLE,
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 pb-3">
        <div style={{ height: 4, backgroundColor: 'var(--color-mist)' }}>
          <div style={{ height: '100%', width: '100%', backgroundColor: 'var(--color-ink)' }} />
        </div>
      </div>
    </div>
  );
}
