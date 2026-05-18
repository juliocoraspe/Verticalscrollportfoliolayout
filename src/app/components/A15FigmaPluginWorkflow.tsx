import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ScrollSection } from './ScrollSection';
import { FitToBand } from './MobileSceneBand';
import { useViewportWidth } from '../hooks/use-viewport-width';

// Below this width the desktop multi-column scenes can't be shown at a
// legible size, so we render the dedicated mobile scene layouts instead.
const MOBILE_MAX_WIDTH = 639;

const TECH_LABEL_STYLE: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum"',
};

const A15_ACT_TITLES = [
  '01 — Design File',
  '02 — Design Scan',
  '03 — Design Findings',
  '04 — Design Repair',
  '05 — Local Assist',
  '06 — Focus Order',
  '07 — Resolve',
] as const;

type SceneProps = {
  opacity: MotionValue<number>;
  local: MotionValue<number>;
};

export function A15FigmaPluginWorkflow() {
  const shouldReduceMotion = useReducedMotion();
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth <= MOBILE_MAX_WIDTH;

  // prefers-reduced-motion: fully static stacked fallback (no scroll motion).
  if (shouldReduceMotion) return <A15MobileWorkflow />;
  // Mobile: same scroll-driven scene system, but each scene is re-authored
  // for a single narrow column at full, accessible font sizes (no CSS scale).
  return <A15ScrollWorkflow mobile={isMobile} />;
}

function A15ScrollWorkflow({ mobile }: { mobile: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });

  // Seven scenes split the scroll progress into ~1/7 windows. Each scene
  // fades in over the first ≈0.02, holds at 1 through a long dwell, then
  // cross-fades to the next over ≈0.02 at the boundary. Local progress
  // runs over the first ~0.11 of the window, leaving the rest as a static
  // "look at the result" hold.
  const scene1 = useTransform(p, [0, 0.035, 0.13, 0.15], [0, 1, 1, 0]);
  const scene2 = useTransform(p, [0.138, 0.158, 0.272, 0.292], [0, 1, 1, 0]);
  const scene3 = useTransform(p, [0.28, 0.3, 0.415, 0.435], [0, 1, 1, 0]);
  const scene4 = useTransform(p, [0.423, 0.443, 0.558, 0.578], [0, 1, 1, 0]);
  const scene5 = useTransform(p, [0.566, 0.586, 0.7, 0.72], [0, 1, 1, 0]);
  const scene6 = useTransform(p, [0.708, 0.728, 0.843, 0.863], [0, 1, 1, 0]);
  const scene7 = useTransform(p, [0.851, 0.871, 1, 1], [0, 1, 1, 1]);

  const s1Local = useTransform(p, [0, 0.108], [0, 1]);
  const s2Local = useTransform(p, [0.142, 0.25], [0, 1]);
  const s3Local = useTransform(p, [0.284, 0.392], [0, 1]);
  const s4Local = useTransform(p, [0.427, 0.535], [0, 1]);
  const s5Local = useTransform(p, [0.57, 0.678], [0, 1]);
  const s6Local = useTransform(p, [0.712, 0.82], [0, 1]);
  const s7Local = useTransform(p, [0.855, 0.95], [0, 1]);

  const progressWidth = useTransform(p, [0, 1], ['0%', '100%']);

  return (
    <section
      aria-label="A15 Figma accessibility plugin workflow"
      style={{
        backgroundColor: 'var(--color-base)',
        borderBottom: '1px solid var(--color-pale)',
      }}
    >
      <A15Intro />

      <div
        ref={containerRef}
        className="relative wkf-scroll-container"
        style={{ height: mobile ? '480vh' : '560vh' }}
      >
        <div className="sticky top-0 h-screen overflow-hidden wkf-sticky" style={{ backgroundColor: 'var(--color-base)' }}>
          {!mobile && <div className="wkf-chrome"><A15BlueprintGrid /></div>}
          <A15Hud progress={p} progressWidth={progressWidth} mobile={mobile} />
          {!mobile && <div className="wkf-chrome"><A15CornerMarks /></div>}

          <div className="relative flex h-full w-full items-center justify-center wkf-stage">
            {mobile ? (
              <>
                <A15Scene1Mobile opacity={scene1} local={s1Local} />
                <A15Scene2Mobile opacity={scene2} local={s2Local} />
                <A15Scene3Mobile opacity={scene3} local={s3Local} />
                <A15Scene4Mobile opacity={scene4} local={s4Local} />
                <A15Scene5Mobile opacity={scene5} local={s5Local} />
                <A15Scene6Mobile opacity={scene6} local={s6Local} />
                <A15Scene7Mobile opacity={scene7} local={s7Local} />
              </>
            ) : (
              <>
                <A15Scene1 opacity={scene1} local={s1Local} />
                <A15Scene2 opacity={scene2} local={s2Local} />
                <A15Scene3 opacity={scene3} local={s3Local} />
                <A15Scene4 opacity={scene4} local={s4Local} />
                <A15Scene5 opacity={scene5} local={s5Local} />
                <A15Scene6 opacity={scene6} local={s6Local} />
                <A15Scene7 opacity={scene7} local={s7Local} />
              </>
            )}
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-50 px-6 pb-5 sm:px-8 wkf-bottom-hud">
            <div
              className="flex items-end justify-between border-t pt-3 type-micro uppercase"
              style={{ ...TECH_LABEL_STYLE, color: 'var(--color-pale)', borderColor: 'var(--color-pale)' }}
            >
              {!mobile && (
                <div className="wkf-bottom-meta">
                  <div style={{ opacity: 0.6 }}>DWG · 02</div>
                  <div style={{ color: 'var(--color-dark)' }}>A15-FIGMA-AUDIT</div>
                </div>
              )}
              {!mobile && (
                <div className="text-center wkf-bottom-meta">
                  <div style={{ opacity: 0.6 }}>MODE</div>
                  <div style={{ color: 'var(--color-dark)' }}>PRE-LAUNCH</div>
                </div>
              )}
              <A15ProgressNumber progress={p} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function A15Intro() {
  return (
    <div className="px-6 py-20 sm:px-6 sm:py-24" style={{ borderTop: '1px solid var(--color-pale)' }}>
      <div className="hero-breakout mx-auto">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <ScrollSection entryDirection="bottom" motionRole="case-block" className="md:col-span-6">
            <p className="type-micro uppercase mb-5" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
              First method · design-time accessibility
            </p>
            <h3 className="type-display-m text-ink" style={{ maxWidth: '18ch' }}>
              First, the design is checked inside Figma.
            </h3>
          </ScrollSection>

          <ScrollSection
            entryDirection="bottom"
            motionRole="about-paragraph"
            delay={0.05}
            className="md:col-span-5 md:col-start-8"
          >
            <p className="type-body text-ink">
              A15 is a local Figma plugin I built to check accessibility before handoff. It uses a
              local AI vision model to read the selected frame, generate alt text, review visual
              structure, and surface risks like contrast, readability, and tab navigation. Private
              design work stays on my machine, avoiding unnecessary API cost or disclosure.
            </p>
          </ScrollSection>
        </div>
      </div>
    </div>
  );
}

function A15Hud({
  progress,
  progressWidth,
  mobile,
}: {
  progress: MotionValue<number>;
  progressWidth: MotionValue<string>;
  mobile?: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 top-0 z-50 px-6 sm:px-8"
      style={{ paddingTop: 64 }}
    >
      <div
        className="flex items-center justify-between type-micro uppercase"
        style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
      >
        <span>A15 · Figma</span>
        <A15SceneLabel progress={progress} />
        <span>07 / Acts</span>
      </div>
      <div className="relative mt-3" style={{ height: 1, backgroundColor: 'var(--color-pale)', opacity: 0.4 }}>
        <motion.div className="absolute inset-y-0 left-0" style={{ width: progressWidth, backgroundColor: 'var(--color-ink)' }} />
        {[1, 2, 3, 4, 5, 6].map((n) => n / 7).map((t, i) => (
          <div
            key={i}
            className="absolute top-0"
            style={{ left: `${t * 100}%`, width: 1, height: 8, backgroundColor: 'var(--color-pale)' }}
          />
        ))}
      </div>
      {!mobile && (
        <div className="mt-1.5 flex justify-between type-micro uppercase wkf-hud-subline" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-pale)' }}>
          <span>DESIGN FILE</span>
          <span>LOCAL · PRIVATE · ITERATIVE</span>
          <span>HANDOFF</span>
        </div>
      )}
    </div>
  );
}

function A15SceneLabel({ progress }: { progress: MotionValue<number> }) {
  const [label, setLabel] = useState(A15_ACT_TITLES[0]);

  useMotionValueEvent(progress, 'change', (v) => {
    const idx = Math.min(6, Math.max(0, Math.floor(v * 7)));
    setLabel(A15_ACT_TITLES[idx]);
  });

  return <span>{label}</span>;
}

function A15ProgressNumber({ progress }: { progress: MotionValue<number> }) {
  const [pct, setPct] = useState(0);

  useMotionValueEvent(progress, 'change', (v) => {
    setPct(Math.round(v * 100));
  });

  return (
    <div className="text-right" style={{ ...TECH_LABEL_STYLE }}>
      <div style={{ opacity: 0.6 }}>PROGRESS</div>
      <div style={{ color: 'var(--color-dark)' }}>{pct.toString().padStart(3, '0')}%</div>
    </div>
  );
}

function A15CornerMarks() {
  const base: CSSProperties = {
    position: 'absolute',
    width: 46,
    height: 46,
    borderColor: 'var(--color-pale)',
    opacity: 0.5,
    pointerEvents: 'none',
    zIndex: 40,
  };

  return (
    <>
      <div style={{ ...base, top: 132, left: 32, borderLeft: '1px solid', borderTop: '1px solid' }} />
      <div style={{ ...base, top: 132, right: 32, borderRight: '1px solid', borderTop: '1px solid' }} />
      <div style={{ ...base, bottom: 72, left: 32, borderLeft: '1px solid', borderBottom: '1px solid' }} />
      <div style={{ ...base, bottom: 72, right: 32, borderRight: '1px solid', borderBottom: '1px solid' }} />
    </>
  );
}

function A15BlueprintGrid() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(149,148,146,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(149,148,146,0.07) 1px, transparent 1px)',
        backgroundSize: '42px 42px',
        maskImage: 'radial-gradient(circle at center, black 0%, transparent 72%)',
      }}
    />
  );
}

function A15SceneFrame({
  opacity,
  children,
  mobile,
}: {
  opacity: MotionValue<number>;
  children: ReactNode;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <motion.div
        className="absolute left-0 right-0 wkf-mobile-scene flex items-center justify-center px-5"
        style={{ opacity }}
      >
        <FitToBand>{children}</FitToBand>
      </motion.div>
    );
  }
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[min(1180px,88vw)]"
      style={{
        opacity,
        x: '-50%',
        y: '-50%',
      }}
    >
      {children}
    </motion.div>
  );
}

function A15Scene1Mobile({ opacity, local }: SceneProps) {
  const bridgeHeight = useTransform(local, [0.18, 0.42], ['0%', '100%']);
  const dotY = useTransform(local, [0.18, 0.42], ['0%', '100%']);
  const pluginY = useTransform(local, [0, 0.18], [24, 0]);
  const canvasO = useTransform(local, [0.25, 0.45], [0.35, 1]);
  const canvasY = useTransform(local, [0.25, 0.45], [20, 0]);

  return (
    <A15SceneFrame opacity={opacity} mobile>
      <div className="flex flex-col gap-5">
        <motion.div style={{ y: pluginY }}>
          <PluginWindow title="A15 Plugin" eyebrow="Local audit for the design">
            <div className="space-y-3">
              <A15Metric label="Mode" value="Design-time" />
              <A15Metric label="Scope" value="Selected frame" />
              <A15Metric label="Standard" value="WCAG 2.2 AA" />
            </div>
            <div
              className="mt-6 border px-4 py-3 type-micro uppercase text-center"
              style={{ ...TECH_LABEL_STYLE, borderColor: 'var(--color-ink)', color: 'var(--color-ink)' }}
            >
              Scan this design
            </div>
          </PluginWindow>
        </motion.div>

        <div className="relative mx-auto h-16 w-px">
          <div className="absolute inset-x-0 top-0 bottom-0 w-px mx-auto" style={{ backgroundColor: 'var(--color-pale)' }} />
          <motion.div
            className="absolute top-0 left-1/2 w-px -translate-x-1/2"
            style={{ height: bridgeHeight, backgroundColor: 'var(--color-ink)' }}
          />
          <motion.div
            className="absolute left-1/2 h-3 w-3 rounded-full"
            style={{ top: dotY, x: '-50%', y: '-50%', backgroundColor: 'var(--color-ink)' }}
          />
        </div>

        <motion.div style={{ opacity: canvasO, y: canvasY }}>
          <FigmaCanvas title="Design canvas · Checkout mobile">
            <div
              className="mx-auto mt-5 w-[200px] max-w-full border bg-[var(--color-pure)] p-4"
              style={{ borderColor: 'var(--color-pale)', aspectRatio: '180 / 310' }}
            >
              <div className="mb-4 h-5 w-20" style={{ backgroundColor: 'var(--color-ink)' }} />
              <div className="space-y-3">
                <div className="h-3 w-full" style={{ backgroundColor: 'var(--color-mist)' }} />
                <div className="h-3 w-3/4" style={{ backgroundColor: 'var(--color-mist)' }} />
                <div className="h-16 w-full border" style={{ borderColor: 'var(--color-pale)' }} />
                <div className="h-9 w-full" style={{ backgroundColor: 'var(--color-dark)' }} />
              </div>
            </div>
          </FigmaCanvas>
        </motion.div>
      </div>

      <A15Caption local={local} from={0.7} mobile text="The check starts with the design, before engineering inherits the product interface." />
    </A15SceneFrame>
  );
}

function A15Scene1({ opacity, local }: SceneProps) {
  const bridgeWidth = useTransform(local, [0.18, 0.42], ['0%', '100%']);
  const dotX = useTransform(local, [0.18, 0.42], ['0%', '100%']);
  const pluginY = useTransform(local, [0, 0.18], [30, 0]);
  const canvasO = useTransform(local, [0.25, 0.45], [0.35, 1]);
  const canvasY = useTransform(local, [0.25, 0.45], [24, 0]);

  return (
    <A15SceneFrame opacity={opacity}>
      <div className="grid items-center gap-10 md:grid-cols-[0.85fr_0.55fr_0.9fr]">
        <motion.div style={{ y: pluginY }}>
          <PluginWindow title="A15 Plugin" eyebrow="Local audit for the design">
            <div className="space-y-4">
              <A15Metric label="Mode" value="Design-time" />
              <A15Metric label="Scope" value="Selected design frame" />
              <A15Metric label="Standard" value="WCAG 2.2 AA" />
            </div>
            <div
              className="mt-8 border px-4 py-3 type-micro uppercase"
              style={{ ...TECH_LABEL_STYLE, borderColor: 'var(--color-ink)', color: 'var(--color-ink)' }}
            >
              Scan this design
            </div>
          </PluginWindow>
        </motion.div>

        <div className="relative h-40">
          <div className="absolute left-0 right-0 top-1/2 h-px" style={{ backgroundColor: 'var(--color-pale)' }} />
          <motion.div
            className="absolute left-0 top-1/2 h-px"
            style={{ width: bridgeWidth, backgroundColor: 'var(--color-ink)' }}
          />
          <motion.div
            className="absolute top-1/2 h-3 w-3 rounded-full"
            style={{
              left: dotX,
              y: '-50%',
              x: '-50%',
              backgroundColor: 'var(--color-ink)',
            }}
          />
          <div
            className="absolute left-1/2 top-[calc(50%+22px)] -translate-x-1/2 type-micro uppercase"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            design scan bridge
          </div>
        </div>

        <motion.div style={{ opacity: canvasO, y: canvasY }}>
          <FigmaCanvas title="Design canvas · Checkout mobile">
            <div className="mx-auto mt-6 h-[310px] w-[180px] border bg-[var(--color-pure)] p-4" style={{ borderColor: 'var(--color-pale)' }}>
              <div className="mb-4 h-5 w-20" style={{ backgroundColor: 'var(--color-ink)' }} />
              <div className="space-y-3">
                <div className="h-3 w-full" style={{ backgroundColor: 'var(--color-mist)' }} />
                <div className="h-3 w-3/4" style={{ backgroundColor: 'var(--color-mist)' }} />
                <div className="h-16 w-full border" style={{ borderColor: 'var(--color-pale)' }} />
                <div className="h-9 w-full" style={{ backgroundColor: 'var(--color-dark)' }} />
              </div>
            </div>
          </FigmaCanvas>
        </motion.div>
      </div>

      <A15Caption local={local} from={0.7} text="The check starts with the design, before engineering inherits the product interface." />
    </A15SceneFrame>
  );
}

const A15_STRUCTURE_NODES = [
  { label: 'main', indent: 0, delay: 0.1 },
  { label: 'heading · level 1', indent: 1, delay: 0.22 },
  { label: 'form', indent: 1, delay: 0.34 },
  { label: 'design button · checkout', indent: 2, delay: 0.46 },
  { label: 'image · decorative', indent: 2, delay: 0.58 },
] as const;

function A15Scene2MobileNode({
  node,
  local,
}: {
  node: (typeof A15_STRUCTURE_NODES)[number];
  local: MotionValue<number>;
}) {
  const opacity = useTransform(local, [node.delay, node.delay + 0.08], [0, 1]);
  const x = useTransform(local, [node.delay, node.delay + 0.08], [-16, 0]);
  return (
    <motion.div style={{ paddingLeft: node.indent * 18, opacity, x }}>
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--color-ink)' }} />
        <span className="type-body text-ink">{node.label}</span>
      </div>
    </motion.div>
  );
}

function A15Scene2Mobile({ opacity, local }: SceneProps) {
  return (
    <A15SceneFrame opacity={opacity} mobile>
      <div className="flex flex-col gap-5">
        <PluginWindow title="Design Scan" eyebrow="Figma layer tree">
          <div className="space-y-2">
            {['Design frame / Checkout', 'Design header / Title', 'Design card / Total', 'Design CTA / Pay now', 'Design icon / Lock', 'Design input / Email'].map((label, i) => (
              <ScanRow key={label} label={label} index={i} local={local} />
            ))}
          </div>
        </PluginWindow>

        <div className="border bg-[var(--color-pure)] p-5" style={{ borderColor: 'var(--color-pale)' }}>
          <p className="type-micro uppercase mb-5" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            Accessibility structure from the design
          </p>
          <div className="space-y-3">
            {A15_STRUCTURE_NODES.map((n) => (
              <A15Scene2MobileNode key={n.label} node={n} local={local} />
            ))}
          </div>
        </div>
      </div>

      <A15Caption local={local} from={0.72} mobile text="The design layers become the structure assistive technology will eventually need." />
    </A15SceneFrame>
  );
}

function A15Scene2({ opacity, local }: SceneProps) {
  return (
    <A15SceneFrame opacity={opacity}>
      <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1fr]">
        <PluginWindow title="Design Scan" eyebrow="Figma layer tree">
          <div className="space-y-2">
            {['Design frame / Checkout mobile', 'Design header / Title', 'Design card / Total', 'Design CTA / Pay now', 'Design icon / Lock', 'Design input / Email'].map((label, i) => (
              <ScanRow key={label} label={label} index={i} local={local} />
            ))}
          </div>
        </PluginWindow>

        <div className="relative h-[470px] border bg-[var(--color-pure)] p-8" style={{ borderColor: 'var(--color-pale)' }}>
          <p className="type-micro uppercase mb-10" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            Accessibility structure from the design
          </p>
          <NodeLine label="main" x={60} y={88} delay={0.1} local={local} />
          <NodeLine label="heading · level 1" x={160} y={160} delay={0.22} local={local} />
          <NodeLine label="form" x={160} y={232} delay={0.34} local={local} />
          <NodeLine label="design button · checkout" x={300} y={304} delay={0.46} local={local} />
          <NodeLine label="image · decorative" x={300} y={376} delay={0.58} local={local} />
        </div>
      </div>

      <A15Caption local={local} from={0.72} text="The design layers become the structure assistive technology will eventually need." />
    </A15SceneFrame>
  );
}

function A15Scene3Mobile({ opacity, local }: SceneProps) {
  return (
    <A15SceneFrame opacity={opacity} mobile>
      <div className="flex flex-col gap-5">
        <FigmaCanvas title="Design canvas · scanned frame">
          <div
            className="relative mx-auto w-[220px] max-w-full border bg-[var(--color-pure)] p-4"
            style={{ borderColor: 'var(--color-pale)', aspectRatio: '285 / 420' }}
          >
            <div className="mb-4 h-6 w-28" style={{ backgroundColor: 'var(--color-ink)' }} />
            <div className="space-y-3">
              <div className="h-3.5 w-full" style={{ backgroundColor: 'var(--color-mist)' }} />
              <div className="h-3.5 w-4/5" style={{ backgroundColor: 'var(--color-mist)' }} />
              <div className="h-20 w-full border" style={{ borderColor: 'var(--color-pale)' }} />
              <div className="h-9 w-full" style={{ backgroundColor: 'var(--color-dark)' }} />
              <div className="h-12 w-full border" style={{ borderColor: 'var(--color-pale)' }} />
            </div>
            <IssuePin local={local} x="78%" y="22%" delay={0.18} label="1.4.3" />
            <IssuePin local={local} x="8%" y="58%" delay={0.28} label="2.4.7" />
            <IssuePin local={local} x="76%" y="76%" delay={0.38} label="4.1.2" />
          </div>
        </FigmaCanvas>

        <PluginWindow title="Design Findings" eyebrow="Grouped by standard">
          <div className="space-y-3">
            <FindingRow code="1.4.3" title="Design text contrast below AA" delay={0.2} local={local} />
            <FindingRow code="2.4.7" title="Design focus state missing" delay={0.32} local={local} />
            <FindingRow code="4.1.2" title="Design control name is ambiguous" delay={0.44} local={local} />
          </div>
        </PluginWindow>
      </div>

      <A15Caption local={local} from={0.72} mobile text="The plugin marks the design without leaving the canvas." />
    </A15SceneFrame>
  );
}

function A15Scene3({ opacity, local }: SceneProps) {
  return (
    <A15SceneFrame opacity={opacity}>
      <div className="grid items-center gap-12 md:grid-cols-[1fr_0.85fr]">
        <FigmaCanvas title="Design canvas · scanned frame">
          <div className="relative mx-auto h-[500px] w-[285px] border bg-[var(--color-pure)] p-5" style={{ borderColor: 'var(--color-pale)' }}>
            <div className="mb-5 h-7 w-32" style={{ backgroundColor: 'var(--color-ink)' }} />
            <div className="space-y-4">
              <div className="h-4 w-full" style={{ backgroundColor: 'var(--color-mist)' }} />
              <div className="h-4 w-4/5" style={{ backgroundColor: 'var(--color-mist)' }} />
              <div className="h-28 w-full border" style={{ borderColor: 'var(--color-pale)' }} />
              <div className="h-11 w-full" style={{ backgroundColor: 'var(--color-dark)' }} />
              <div className="h-16 w-full border" style={{ borderColor: 'var(--color-pale)' }} />
            </div>
            <IssuePin local={local} x={236} y={118} delay={0.18} label="1.4.3" />
            <IssuePin local={local} x={30} y={310} delay={0.28} label="2.4.7" />
            <IssuePin local={local} x={240} y={400} delay={0.38} label="4.1.2" />
          </div>
        </FigmaCanvas>

        <PluginWindow title="Design Findings" eyebrow="Grouped by standard">
          <div className="space-y-3">
            <FindingRow code="1.4.3" title="Design text contrast below AA" delay={0.2} local={local} />
            <FindingRow code="2.4.7" title="Design focus state missing" delay={0.32} local={local} />
            <FindingRow code="4.1.2" title="Design control name is ambiguous" delay={0.44} local={local} />
          </div>
        </PluginWindow>
      </div>

      <A15Caption local={local} from={0.72} text="The plugin marks the design without leaving the canvas." />
    </A15SceneFrame>
  );
}

function A15Scene4Mobile({ opacity, local }: SceneProps) {
  const boxShadow = useTransform(local, [0.35, 0.62], ['0 0 0 0 rgba(26,26,26,0)', '0 0 0 1px rgba(26,26,26,0.28)']);
  const btnO = useTransform(local, [0.35, 0.6], [0.65, 1]);
  const ringO = useTransform(local, [0.12, 0.3], [0, 1]);

  return (
    <A15SceneFrame opacity={opacity} mobile>
      <div className="flex flex-col gap-5">
        <PluginWindow title="Design Repair" eyebrow="Human-readable repair">
          <div className="border-t pt-5" style={{ borderColor: 'var(--color-pale)' }}>
            <p className="type-micro uppercase mb-3" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-accent)' }}>
              WCAG 1.4.3 · Contrast
            </p>
            <h4 className="type-display-s text-ink mb-5">The design button label does not survive the background.</h4>
            <div className="grid grid-cols-2 gap-3">
              <TokenCard label="Current" value="2.7 : 1" dim />
              <TokenCard label="Target" value="4.5 : 1" />
            </div>
            <div
              className="mt-6 border px-4 py-3 type-micro uppercase text-center"
              style={{ ...TECH_LABEL_STYLE, borderColor: 'var(--color-ink)', color: 'var(--color-ink)' }}
            >
              Apply accessible token
            </div>
          </div>
        </PluginWindow>

        <motion.div
          className="relative w-full border bg-[var(--color-pure)]"
          style={{ borderColor: 'var(--color-pale)', aspectRatio: '4 / 3', boxShadow }}
        >
          <div className="absolute left-[12%] top-[14%] h-[18%] w-[55%]" style={{ backgroundColor: 'var(--color-mist)' }} />
          <motion.div
            className="absolute left-[12%] top-[44%] h-[16%] w-[62%] flex items-center"
            style={{ backgroundColor: 'var(--color-ink)', opacity: btnO }}
          >
            <span className="pl-3 type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-pure)' }}>
              Confirm order
            </span>
          </motion.div>
          <motion.div
            className="absolute left-[8%] top-[40%] h-[24%] w-[70%] border"
            style={{ borderColor: 'var(--color-accent)', opacity: ringO }}
          />
        </motion.div>
      </div>

      <A15Caption local={local} from={0.72} mobile text="Each finding is attached to a standard and a practical next move." />
    </A15SceneFrame>
  );
}

function A15Scene4({ opacity, local }: SceneProps) {
  const boxShadow = useTransform(local, [0.35, 0.62], ['0 0 0 0 rgba(26,26,26,0)', '0 0 0 1px rgba(26,26,26,0.28)']);
  const btnO = useTransform(local, [0.35, 0.6], [0.65, 1]);
  const ringO = useTransform(local, [0.12, 0.3], [0, 1]);

  return (
    <A15SceneFrame opacity={opacity}>
      <div className="grid items-center gap-12 md:grid-cols-[0.95fr_1fr]">
        <PluginWindow title="Design Repair" eyebrow="Human-readable repair">
          <div className="border-t pt-5" style={{ borderColor: 'var(--color-pale)' }}>
            <p className="type-micro uppercase mb-3" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-accent)' }}>
              WCAG 1.4.3 · Contrast
            </p>
            <h4 className="type-display-s text-ink mb-6">The design button label does not survive the background.</h4>
            <div className="grid grid-cols-2 gap-3">
              <TokenCard label="Current" value="2.7 : 1" dim />
              <TokenCard label="Target" value="4.5 : 1" />
            </div>
            <div
              className="mt-8 border px-4 py-3 type-micro uppercase"
              style={{ ...TECH_LABEL_STYLE, borderColor: 'var(--color-ink)', color: 'var(--color-ink)' }}
            >
              Apply accessible token
            </div>
          </div>
        </PluginWindow>

        <motion.div
          className="relative h-[430px] border bg-[var(--color-pure)]"
          style={{ borderColor: 'var(--color-pale)', boxShadow }}
        >
          <div className="absolute left-16 top-16 h-16 w-48" style={{ backgroundColor: 'var(--color-mist)' }} />
          <motion.div
            className="absolute left-16 h-14 w-56"
            style={{ top: 180, backgroundColor: 'var(--color-ink)', opacity: btnO }}
          />
          <div className="absolute left-24 top-[198px] type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-pure)' }}>
            Confirm order
          </div>
          <motion.div
            className="absolute left-12 top-[156px] h-[86px] w-[248px] border"
            style={{ borderColor: 'var(--color-accent)', opacity: ringO }}
          />
        </motion.div>
      </div>

      <A15Caption local={local} from={0.72} text="Each finding is attached to a standard and a practical next move." />
    </A15SceneFrame>
  );
}

function A15Scene5Mobile({ opacity, local }: SceneProps) {
  const rotate = useTransform(local, [0, 1], [0, 160]);
  return (
    <A15SceneFrame opacity={opacity} mobile>
      <div className="flex flex-col items-center gap-5">
        <FigmaCanvas title="Design canvas · image frame">
          <div
            className="mx-auto w-[200px] max-w-full border p-3"
            style={{ borderColor: 'var(--color-pale)', backgroundColor: 'var(--color-pure)', aspectRatio: '260 / 300' }}
          >
            <div
              className="h-full w-full"
              style={{
                border: '1px solid var(--color-pale)',
                backgroundImage:
                  'linear-gradient(135deg, rgba(33,39,38,0.16) 0%, transparent 55%), linear-gradient(to right, rgba(149,148,146,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(149,148,146,0.2) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 24px 24px, 24px 24px',
              }}
            />
          </div>
        </FigmaCanvas>

        <div className="relative h-24 w-full">
          <motion.div
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ borderColor: 'var(--color-pale)', rotate }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 text-center type-micro uppercase"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            local model
            <br />
            no cloud roundtrip
          </div>
        </div>

        <PluginWindow title="Suggested Alt Text" eyebrow="Assistive draft">
          <div className="min-h-[120px] border p-4" style={{ borderColor: 'var(--color-pale)', backgroundColor: 'var(--color-base)' }}>
            <StreamingText
              local={local}
              from={0.2}
              text="Illustration of a checkout confirmation card with visible order summary and payment button."
            />
          </div>
          <p className="type-body text-ink mt-5">
            The output is a draft for the design review, not an automatic replacement for judgment.
          </p>
        </PluginWindow>
      </div>

      <A15Caption local={local} from={0.72} mobile text="AI is used as a local assistant, with the designer still responsible for the decision." />
    </A15SceneFrame>
  );
}

function A15Scene5({ opacity, local }: SceneProps) {
  const rotate = useTransform(local, [0, 1], [0, 160]);
  return (
    <A15SceneFrame opacity={opacity}>
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_0.55fr_0.85fr]">
        <FigmaCanvas title="Design canvas · image frame">
          <div className="mx-auto h-[380px] w-[260px] border p-4" style={{ borderColor: 'var(--color-pale)', backgroundColor: 'var(--color-pure)' }}>
            <div
              className="h-full w-full"
              style={{
                border: '1px solid var(--color-pale)',
                backgroundImage:
                  'linear-gradient(135deg, rgba(33,39,38,0.16) 0%, transparent 55%), linear-gradient(to right, rgba(149,148,146,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(149,148,146,0.2) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 28px 28px, 28px 28px',
              }}
            />
          </div>
        </FigmaCanvas>

        <div className="relative h-56">
          <motion.div
            className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ borderColor: 'var(--color-pale)', rotate }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-36 -translate-x-1/2 -translate-y-1/2 text-center type-micro uppercase"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            local model
            <br />
            no cloud roundtrip
          </div>
        </div>

        <PluginWindow title="Suggested Design Alt Text" eyebrow="Assistive draft">
          <div className="min-h-[190px] border p-4" style={{ borderColor: 'var(--color-pale)', backgroundColor: 'var(--color-base)' }}>
            <StreamingText
              local={local}
              from={0.2}
              text="Illustration of a checkout confirmation card with visible order summary and payment button."
            />
          </div>
          <p className="type-body text-ink mt-6">
            The output is a draft for the design review, not an automatic replacement for judgment.
          </p>
        </PluginWindow>
      </div>

      <A15Caption local={local} from={0.72} text="AI is used as a local assistant, with the designer still responsible for the decision." />
    </A15SceneFrame>
  );
}

/* ============================================================
   SCENE 6 — FOCUS ORDER
   The same local model that drafts alt text also reads the layout
   and proposes a keyboard focus path. Numbered pins appear in
   sequence on the mockup, connected by a drawn path; a plugin panel
   streams the same order and flags the decorative icon as skipped.
   ============================================================ */

// Each step's position is a % within the mockup box so it scales with
// any canvas size (desktop or mobile). `seq` drives the appearance order.
const A15_FOCUS_STEPS = [
  { n: 1, label: 'Email field', x: '50%', y: '40%', seq: 0.16 },
  { n: 2, label: 'Card field', x: '50%', y: '58%', seq: 0.3 },
  { n: 3, label: 'Secure note', x: '24%', y: '74%', seq: 0.44 },
  { n: 4, label: 'Pay now', x: '50%', y: '86%', seq: 0.58 },
] as const;

// Decorative icon the model deliberately leaves OUT of the focus path.
const A15_FOCUS_SKIP = { x: '82%', y: '12%', seq: 0.66 } as const;

function A15FocusPin({
  n,
  x,
  y,
  seq,
  local,
}: {
  n: number;
  x: string;
  y: string;
  seq: number;
  local: MotionValue<number>;
}) {
  const opacity = useTransform(local, [seq, seq + 0.06], [0, 1]);
  const scale = useTransform(local, [seq, seq + 0.06, seq + 0.1], [0.6, 1.15, 1]);
  return (
    <motion.div
      className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
      style={{
        left: x,
        top: y,
        borderColor: 'var(--color-accent)',
        backgroundColor: 'var(--color-pure)',
        color: 'var(--color-accent)',
        opacity,
        scale,
      }}
    >
      <span className="type-micro" style={{ ...TECH_LABEL_STYLE, fontWeight: 600 }}>
        {n}
      </span>
    </motion.div>
  );
}

// Decorative-icon marker: a dashed ring with a slash, labelled "skip".
function A15FocusSkip({
  x,
  y,
  seq,
  local,
}: {
  x: string;
  y: string;
  seq: number;
  local: MotionValue<number>;
}) {
  const opacity = useTransform(local, [seq, seq + 0.06], [0, 0.85]);
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y, opacity }}
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full"
        style={{ border: '1px dashed var(--color-dark)' }}
      >
        <div
          style={{
            width: 14,
            height: 1,
            backgroundColor: 'var(--color-dark)',
            transform: 'rotate(-45deg)',
          }}
        />
      </div>
      <span
        className="mt-1 block text-center type-micro uppercase"
        style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
      >
        skip
      </span>
    </motion.div>
  );
}

// Progressively-drawn polyline connecting the pins in focus order.
function A15FocusPath({ local }: { local: MotionValue<number> }) {
  // Points mirror A15_FOCUS_STEPS positions as fractions of the viewBox.
  const pts = [
    [0.5, 0.4],
    [0.5, 0.58],
    [0.24, 0.74],
    [0.5, 0.86],
  ];
  const d =
    `M ${pts[0][0] * 100} ${pts[0][1] * 100} ` +
    pts
      .slice(1)
      .map(([px, py]) => `L ${px * 100} ${py * 100}`)
      .join(' ');
  const pathLength = useTransform(local, [0.18, 0.6], [0, 1]);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d={d}
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity={0.5}
        strokeWidth={0.8}
        strokeDasharray="2 2"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength }}
      />
    </svg>
  );
}

// One row of the streamed tab-order plan in the plugin panel.
function A15FocusListRow({
  n,
  label,
  seq,
  local,
}: {
  n: number;
  label: string;
  seq: number;
  local: MotionValue<number>;
}) {
  const opacity = useTransform(local, [seq, seq + 0.06], [0, 1]);
  const x = useTransform(local, [seq, seq + 0.06], [-14, 0]);
  return (
    <motion.div
      className="flex items-center gap-3 border px-3 py-2"
      style={{ borderColor: 'var(--color-pale)', backgroundColor: 'var(--color-pure)', opacity, x }}
    >
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full type-micro"
        style={{
          ...TECH_LABEL_STYLE,
          fontWeight: 600,
          color: 'var(--color-pure)',
          backgroundColor: 'var(--color-ink)',
        }}
      >
        {n}
      </span>
      <span className="type-body text-ink">{label}</span>
    </motion.div>
  );
}

// The mockup the focus overlay sits on — same visual language as the
// Scene 2/3 checkout canvas (header bar, text lines, fields, CTA).
function A15FocusMockup() {
  return (
    <>
      <div className="mb-4 h-6 w-28" style={{ backgroundColor: 'var(--color-ink)' }} />
      <div className="space-y-3">
        <div className="h-3.5 w-full" style={{ backgroundColor: 'var(--color-mist)' }} />
        <div className="h-3.5 w-4/5" style={{ backgroundColor: 'var(--color-mist)' }} />
        <div className="h-10 w-full border" style={{ borderColor: 'var(--color-pale)' }} />
        <div className="h-10 w-full border" style={{ borderColor: 'var(--color-pale)' }} />
        <div className="h-7 w-1/2 border" style={{ borderColor: 'var(--color-pale)' }} />
        <div className="h-9 w-full" style={{ backgroundColor: 'var(--color-dark)' }} />
      </div>
    </>
  );
}

function A15FocusPlanPanel({ local }: { local: MotionValue<number> }) {
  return (
    <PluginWindow title="Tab Order Plan" eyebrow="Local model · keyboard path">
      <div className="space-y-2">
        {A15_FOCUS_STEPS.map((s) => (
          <A15FocusListRow key={s.n} n={s.n} label={s.label} seq={s.seq} local={local} />
        ))}
      </div>
      <motion.div
        className="mt-5 border-l-2 pl-3"
        style={{
          borderColor: 'var(--color-accent)',
          opacity: useTransform(local, [0.62, 0.7], [0, 1]),
        }}
      >
        <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-accent)' }}>
          Decorative icon skipped
        </p>
        <p className="type-body text-ink mt-1">
          Logical order matches the visual order — no override needed.
        </p>
      </motion.div>
    </PluginWindow>
  );
}

function A15Scene6Mobile({ opacity, local }: SceneProps) {
  const rotate = useTransform(local, [0, 1], [0, 160]);
  return (
    <A15SceneFrame opacity={opacity} mobile>
      <div className="flex flex-col items-center gap-5">
        <FigmaCanvas title="Design canvas · focus path">
          <div
            className="relative mx-auto w-[210px] max-w-full border bg-[var(--color-pure)] p-4"
            style={{ borderColor: 'var(--color-pale)', aspectRatio: '285 / 420' }}
          >
            <A15FocusMockup />
            <A15FocusPath local={local} />
            {A15_FOCUS_STEPS.map((s) => (
              <A15FocusPin key={s.n} n={s.n} x={s.x} y={s.y} seq={s.seq} local={local} />
            ))}
            <A15FocusSkip x={A15_FOCUS_SKIP.x} y={A15_FOCUS_SKIP.y} seq={A15_FOCUS_SKIP.seq} local={local} />
          </div>
        </FigmaCanvas>

        <div className="relative h-20 w-full">
          <motion.div
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ borderColor: 'var(--color-pale)', rotate }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 text-center type-micro uppercase"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            local model
            <br />
            no cloud roundtrip
          </div>
        </div>

        <A15FocusPlanPanel local={local} />
      </div>

      <A15Caption
        local={local}
        from={0.72}
        mobile
        text="The same local model proposes a keyboard path, the designer confirms the intent."
      />
    </A15SceneFrame>
  );
}

function A15Scene6({ opacity, local }: SceneProps) {
  const rotate = useTransform(local, [0, 1], [0, 160]);
  return (
    <A15SceneFrame opacity={opacity}>
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_0.55fr_0.85fr]">
        <FigmaCanvas title="Design canvas · focus path">
          <div
            className="relative mx-auto h-[380px] w-[260px] border bg-[var(--color-pure)] p-5"
            style={{ borderColor: 'var(--color-pale)' }}
          >
            <A15FocusMockup />
            <A15FocusPath local={local} />
            {A15_FOCUS_STEPS.map((s) => (
              <A15FocusPin key={s.n} n={s.n} x={s.x} y={s.y} seq={s.seq} local={local} />
            ))}
            <A15FocusSkip x={A15_FOCUS_SKIP.x} y={A15_FOCUS_SKIP.y} seq={A15_FOCUS_SKIP.seq} local={local} />
          </div>
        </FigmaCanvas>

        <div className="relative h-56">
          <motion.div
            className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ borderColor: 'var(--color-pale)', rotate }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-36 -translate-x-1/2 -translate-y-1/2 text-center type-micro uppercase"
            style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}
          >
            local model
            <br />
            no cloud roundtrip
          </div>
        </div>

        <A15FocusPlanPanel local={local} />
      </div>

      <A15Caption
        local={local}
        from={0.72}
        text="The same local model proposes a keyboard path, the designer confirms the intent."
      />
    </A15SceneFrame>
  );
}

const A15_RESOLVE_CARDS: [string, string][] = [
  ['1.4.3', 'Button contrast adjusted'],
  ['2.4.7', 'Focus state documented'],
  ['4.1.2', 'Control name clarified'],
  ['1.1.1', 'Alt text drafted locally'],
];

function A15ResolveCard({
  code,
  title,
  index,
  local,
}: {
  code: string;
  title: string;
  index: number;
  local: MotionValue<number>;
}) {
  const opacity = useTransform(local, [0.42 + index * 0.08, 0.5 + index * 0.08], [0, 1]);
  const y = useTransform(local, [0.42 + index * 0.08, 0.5 + index * 0.08], [10, 0]);
  return (
    <motion.div className="border p-3" style={{ borderColor: 'var(--color-pale)', opacity, y }}>
      <p className="type-micro uppercase mb-2" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-accent)' }}>
        {code}
      </p>
      <p className="type-body text-ink">{title}</p>
    </motion.div>
  );
}

function A15Scene7Mobile({ opacity, local }: SceneProps) {
  const total = useTransform(local, [0.15, 0.45], [0, 6]);
  const resolved = useTransform(local, [0.35, 0.72], [0, 5]);
  const dismissed = useTransform(local, [0.45, 0.78], [0, 1]);
  const progressWidth = useTransform(local, [0.25, 0.82], ['0%', '100%']);

  return (
    <A15SceneFrame opacity={opacity} mobile>
      <div className="flex flex-col gap-6">
        <div>
          <p className="type-micro uppercase mb-4" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            Design file covered
          </p>
          <h3 className="type-display-s text-ink">
            The design audit lives where the design happens.
          </h3>
          <p className="type-body text-ink mt-4">
            Before launch, the file leaves with accessibility decisions documented, not hidden inside
            scattered comments.
          </p>
        </div>

        <div className="border bg-[var(--color-pure)]" style={{ borderColor: 'var(--color-pale)' }}>
          <div className="border-b px-4 py-4" style={{ borderColor: 'var(--color-pale)', backgroundColor: 'var(--color-ink)' }}>
            <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-pure)', opacity: 0.7 }}>
              A15 · Audit Session
            </p>
            <h4 className="type-display-s mt-2" style={{ color: 'var(--color-pure)' }}>
              Design frame / Checkout
            </h4>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b p-3" style={{ borderColor: 'var(--color-pale)' }}>
            <StatCard label="Total" value={total} />
            <StatCard label="Resolved" value={resolved} />
            <StatCard label="Reviewed" value={dismissed} />
          </div>

          <div className="border-b px-4 py-4" style={{ borderColor: 'var(--color-pale)' }}>
            <div className="mb-2 flex justify-between type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
              <span>Resolution</span>
              <span>Handoff</span>
            </div>
            <div className="h-1.5" style={{ backgroundColor: 'var(--color-mist)' }}>
              <motion.div className="h-full" style={{ width: progressWidth, backgroundColor: 'var(--color-ink)' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3">
            {A15_RESOLVE_CARDS.map(([code, title], i) => (
              <A15ResolveCard key={code} code={code} title={title} index={i} local={local} />
            ))}
          </div>
        </div>
      </div>
    </A15SceneFrame>
  );
}

function A15Scene7({ opacity, local }: SceneProps) {
  const total = useTransform(local, [0.15, 0.45], [0, 6]);
  const resolved = useTransform(local, [0.35, 0.72], [0, 5]);
  const dismissed = useTransform(local, [0.45, 0.78], [0, 1]);
  const progressWidth = useTransform(local, [0.25, 0.82], ['0%', '100%']);

  return (
    <A15SceneFrame opacity={opacity}>
      <div className="grid items-center gap-12 md:grid-cols-[0.7fr_1fr]">
        <div>
          <p className="type-micro uppercase mb-6" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            Design file covered
          </p>
          <h3 className="type-display-m text-ink" style={{ maxWidth: '16ch' }}>
            The design audit lives where the design happens.
          </h3>
          <p className="type-body text-ink mt-8" style={{ maxWidth: '35ch' }}>
            Before launch, the file leaves with accessibility decisions documented, not hidden inside
            scattered comments.
          </p>
        </div>

        <div className="border bg-[var(--color-pure)]" style={{ borderColor: 'var(--color-pale)' }}>
          <div className="border-b px-5 py-4" style={{ borderColor: 'var(--color-pale)', backgroundColor: 'var(--color-ink)' }}>
            <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-pure)', opacity: 0.7 }}>
              A15 · Audit Session
            </p>
            <h4 className="type-display-s mt-2" style={{ color: 'var(--color-pure)' }}>
              Design frame / Checkout mobile
            </h4>
          </div>

          <div className="grid grid-cols-3 gap-3 border-b p-4" style={{ borderColor: 'var(--color-pale)' }}>
            <StatCard label="Total" value={total} />
            <StatCard label="Resolved" value={resolved} />
            <StatCard label="Reviewed" value={dismissed} />
          </div>

          <div className="border-b px-4 py-4" style={{ borderColor: 'var(--color-pale)' }}>
            <div className="mb-2 flex justify-between type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
              <span>Resolution Progress</span>
              <span>Ready for handoff</span>
            </div>
            <div className="h-1.5" style={{ backgroundColor: 'var(--color-mist)' }}>
              <motion.div className="h-full" style={{ width: progressWidth, backgroundColor: 'var(--color-ink)' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4">
            {A15_RESOLVE_CARDS.map(([code, title], i) => (
              <A15ResolveCard key={code} code={code} title={title} index={i} local={local} />
            ))}
          </div>
        </div>
      </div>
    </A15SceneFrame>
  );
}

function PluginWindow({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="border bg-[var(--color-pure)] p-6" style={{ borderColor: 'var(--color-pale)' }}>
      <div className="mb-8 flex items-start justify-between border-b pb-4" style={{ borderColor: 'var(--color-pale)' }}>
        <div>
          <p className="type-micro uppercase mb-2" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
            {eyebrow}
          </p>
          <h4 className="type-display-s text-ink">{title}</h4>
        </div>
        <span className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-pale)' }}>
          A15
        </span>
      </div>
      {children}
    </div>
  );
}

function FigmaCanvas({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border bg-[var(--color-pure)] p-5" style={{ borderColor: 'var(--color-pale)' }}>
      <div className="mb-5 flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-pale)' }}>
        <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
          {title}
        </p>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-pale)' }} />
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-pale)' }} />
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-pale)' }} />
        </div>
      </div>
      {children}
    </div>
  );
}

function A15Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-pale)' }}>
      <span className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
        {label}
      </span>
      <span className="type-body text-ink">{value}</span>
    </div>
  );
}

function ScanRow({ label, index, local }: { label: string; index: number; local: MotionValue<number> }) {
  const start = 0.1 + index * 0.09;
  const active = useTransform(local, [start, start + 0.05, start + 0.1], [0, 1, 0.25]);

  return (
    <motion.div
      className="flex items-center justify-between border px-3 py-2"
      style={{
        borderColor: 'var(--color-pale)',
        backgroundColor: 'var(--color-pure)',
        opacity: useTransform(active, (v) => 0.72 + v * 0.28),
      }}
    >
      <span className="type-body text-ink">{label}</span>
      <motion.span
        className="h-2 w-2 rounded-full"
        style={{ opacity: active, backgroundColor: 'var(--color-ink)' }}
      />
    </motion.div>
  );
}

function NodeLine({
  label,
  x,
  y,
  delay,
  local,
}: {
  label: string;
  x: number;
  y: number;
  delay: number;
  local: MotionValue<number>;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        opacity: useTransform(local, [delay, delay + 0.08], [0, 1]),
        x: useTransform(local, [delay, delay + 0.08], [-20, 0]),
      }}
    >
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--color-ink)' }} />
        <span className="type-body text-ink">{label}</span>
      </div>
    </motion.div>
  );
}

function IssuePin({
  local,
  x,
  y,
  delay,
  label,
}: {
  local: MotionValue<number>;
  x: number | string;
  y: number | string;
  delay: number;
  label: string;
}) {
  return (
    <motion.div
      className="absolute flex h-9 w-9 items-center justify-center rounded-full border"
      style={{
        left: x,
        top: y,
        borderColor: 'var(--color-accent)',
        color: 'var(--color-accent)',
        backgroundColor: 'var(--color-pure)',
        opacity: useTransform(local, [delay, delay + 0.08], [0, 1]),
        scale: useTransform(local, [delay, delay + 0.08], [0.65, 1]),
      }}
    >
      <span className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE }}>
        {label}
      </span>
    </motion.div>
  );
}

function FindingRow({
  code,
  title,
  delay,
  local,
}: {
  code: string;
  title: string;
  delay: number;
  local: MotionValue<number>;
}) {
  return (
    <motion.div
      className="border p-4"
      style={{
        borderColor: 'var(--color-pale)',
        opacity: useTransform(local, [delay, delay + 0.08], [0, 1]),
        y: useTransform(local, [delay, delay + 0.08], [12, 0]),
      }}
    >
      <p className="type-micro uppercase mb-2" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-accent)' }}>
        {code}
      </p>
      <p className="type-body text-ink">{title}</p>
    </motion.div>
  );
}

function TokenCard({ label, value, dim = false }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="border p-4" style={{ borderColor: 'var(--color-pale)', opacity: dim ? 0.55 : 1 }}>
      <p className="type-micro uppercase mb-2" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
        {label}
      </p>
      <p className="type-display-s text-ink">{value}</p>
    </div>
  );
}

function StreamingText({ local, from, text }: { local: MotionValue<number>; from: number; text: string }) {
  const [display, setDisplay] = useState('');

  useMotionValueEvent(local, 'change', (v) => {
    const pct = Math.max(0, Math.min(1, (v - from) / 0.45));
    setDisplay(text.slice(0, Math.floor(text.length * pct)));
  });

  return (
    <p className="type-body text-ink">
      {display}
      <motion.span
        aria-hidden="true"
        style={{ opacity: useTransform(local, [from, from + 0.45, from + 0.46], [1, 1, 0]) }}
      >
        |
      </motion.span>
    </p>
  );
}

function StatCard({ label, value }: { label: string; value: MotionValue<number> }) {
  const [v, setV] = useState('0');

  useMotionValueEvent(value, 'change', (val) => {
    setV(Math.floor(val).toString());
  });

  return (
    <div className="border p-4" style={{ borderColor: 'var(--color-pale)' }}>
      <p className="type-micro uppercase mb-2" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-dark)' }}>
        {label}
      </p>
      <p className="type-display-s text-ink">{v}</p>
    </div>
  );
}

function A15Caption({
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
  const opacity = useTransform(local, [from, from + 0.08], [0, 1]);
  const y = useTransform(local, [from, from + 0.08], [12, 0]);

  if (mobile) {
    return (
      <motion.p
        className="mt-6 text-center type-body"
        style={{ color: 'var(--color-dark)', opacity, y }}
      >
        {text}
      </motion.p>
    );
  }
  return (
    <motion.p
      className="absolute left-1/2 top-[calc(100%+34px)] w-[min(640px,70vw)] -translate-x-1/2 text-center type-body"
      style={{ color: 'var(--color-dark)', opacity, y }}
    >
      {text}
    </motion.p>
  );
}

function A15MobileWorkflow() {
  return (
    <section aria-label="A15 Figma accessibility plugin workflow" style={{ backgroundColor: 'var(--color-base)' }}>
      <A15Intro />
      <div className="px-6 py-12" style={{ borderTop: '1px solid var(--color-pale)', borderBottom: '1px solid var(--color-pale)' }}>
        <div className="hero-breakout mx-auto space-y-8">
          {[
            ['Design file', 'A15 runs locally inside Figma before the design reaches engineering.'],
            ['Design scan', 'The plugin converts the selected design frame into a readable accessibility structure.'],
            ['Design findings', 'Risks are grouped by WCAG direction and kept attached to the design.'],
            ['Design repair', 'Each design issue includes a practical next move rather than a vague warning.'],
            ['Local assist', 'AI support stays local and works as a draft for the design review.'],
            ['Focus order', 'The same local model reads the layout and proposes a keyboard path; the decorative icon is left out.'],
            ['Resolve', 'The design file leaves with accessibility decisions documented for handoff.'],
          ].map(([title, body], i) => (
            <ScrollSection key={title} entryDirection="bottom" motionRole="case-block" delay={i * 0.04}>
              <div className="border bg-[var(--color-pure)] p-6" style={{ borderColor: 'var(--color-pale)' }}>
                <p className="type-micro uppercase mb-4" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-accent)' }}>
                  {(i + 1).toString().padStart(2, '0')}
                </p>
                <h3 className="type-display-s text-ink mb-5">{title}</h3>
                <p className="type-body text-ink">{body}</p>
              </div>
            </ScrollSection>
          ))}
        </div>
      </div>
    </section>
  );
}
