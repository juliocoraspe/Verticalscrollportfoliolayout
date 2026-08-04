import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useRef, type CSSProperties, type ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────
// The Monolith — a single solid slab that rotates continuously through depth
// as you scroll. Deliberately NOT the accessibility scrollytelling language
// (no crossfade scenes, no wireframe panels + connector lines, no HUD bars,
// no blueprint grid, no corner ticks). One object, turning in 3D, with
// screenshots mounted on its front face and serif type traveling in the
// foreground.
//
// Mechanic: the slab presents its front face (content) at each act's center,
// then turns edge-on at the act boundaries — the content swap happens hidden
// behind the turn, so it reads as one object being examined from changing
// angles rather than a deck of scenes crossfading.
//
// PROGRESS: Acts 00 (born) · 01 (BEM) · 02 (Auditor) live here. Acts 03–06
// are still legacy beats in AiExperience below until migrated.
// ─────────────────────────────────────────────────────────────────────────

const TECH_LABEL: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum"',
};

// Slab geometry (px). Front face W×H, extruded by DEPTH to fake thickness.
const W = 340;
const H = 460;
const DEPTH = 48;

type FaceKind = 'bem' | 'auditor' | null;

type Act = {
  n: string;
  title: string;
  sub: string;
  face: FaceKind;
  titleSize: string;
};

const ACTS: Act[] = [
  {
    n: '00',
    title: 'Systems that make AI useful.',
    sub: 'Local models. Custom workflows. Measurable results.',
    face: null,
    titleSize: 'clamp(34px, 5vw, 72px)',
  },
  {
    n: '01',
    title: 'BEM Layer Namer.',
    sub: 'Deterministic heuristics, refined by local AI.',
    face: 'bem',
    titleSize: 'clamp(30px, 4.4vw, 60px)',
  },
  {
    n: '02',
    title: 'Accessibility Auditor.',
    sub: 'Six WCAG checks on the canvas, with local vision-model alt text.',
    face: 'auditor',
    titleSize: 'clamp(28px, 4vw, 54px)',
  },
];

const N = ACTS.length;

export function AiMonolith() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  if (shouldReduceMotion) {
    return <MonolithReducedFallback />;
  }

  return (
    <section ref={ref} style={{ height: `${N * 155}vh`, position: 'relative' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D layer — the slab lives here, pushed left of center */}
        <div
          className="absolute inset-0 flex items-center"
          style={{ perspective: 1400, paddingLeft: 'clamp(24px, 8vw, 160px)' }}
        >
          <Slab progress={p} />
        </div>

        {/* Foreground type layer — screen-space, never 3D-transformed */}
        <div
          className="absolute inset-0 flex items-center justify-end pointer-events-none"
          style={{ paddingRight: 'clamp(24px, 7vw, 132px)' }}
        >
          <div className="relative" style={{ width: 'min(46vw, 620px)', height: 'min(60vh, 460px)' }}>
            {ACTS.map((act, i) => (
              <ActText key={act.n} index={i} act={act} progress={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Build the slab's continuous-turn keyframes for N acts: edge-on at boundaries,
// front-facing at each act center, with depth + tilt variation per act.
function buildSlabKeyframes() {
  const inputs: number[] = [0];
  const rotateY: number[] = [-90];
  const rotateX: number[] = [6];
  const z: number[] = [-560];
  const scale: number[] = [0.8];
  const floatY: number[] = [18];

  for (let i = 0; i < N; i += 1) {
    const center = (i + 0.5) / N;
    inputs.push(center);
    rotateY.push(-8);
    rotateX.push(i % 2 === 0 ? -3 : 4);
    z.push(-110 - i * 8);
    scale.push(1 + (i % 2 === 0 ? 0 : 0.02));
    floatY.push(0);

    if (i < N - 1) {
      const boundary = (i + 1) / N;
      inputs.push(boundary);
      rotateY.push(-90);
      rotateX.push(i % 2 === 0 ? 8 : -7);
      z.push(-240);
      scale.push(0.9);
      floatY.push(10);
    }
  }

  inputs.push(1);
  rotateY.push(-90);
  rotateX.push(6);
  z.push(-300);
  scale.push(0.86);
  floatY.push(14);

  return { inputs, rotateY, rotateX, z, scale, floatY };
}

function Slab({ progress }: { progress: MotionValue<number> }) {
  const k = buildSlabKeyframes();
  const rotateY = useTransform(progress, k.inputs, k.rotateY);
  const rotateX = useTransform(progress, k.inputs, k.rotateX);
  const z = useTransform(progress, k.inputs, k.z);
  const scale = useTransform(progress, k.inputs, k.scale);
  const floatY = useTransform(progress, k.inputs, k.floatY);

  return (
    <motion.div
      style={{
        width: W,
        height: H,
        transformStyle: 'preserve-3d',
        rotateY,
        rotateX,
        z,
        scale,
        y: floatY,
      }}
    >
      {/* Right side face — the dark canto that fakes thickness */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: (W - DEPTH) / 2,
          width: DEPTH,
          height: H,
          background: 'var(--color-accent)',
          transform: `rotateY(90deg) translateZ(${W / 2}px)`,
          backfaceVisibility: 'hidden',
        }}
      />
      {/* Front face — light material; content swaps per act (hidden when edge-on) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--color-mist)',
          border: '1px solid var(--color-ink)',
          transform: `translateZ(${DEPTH / 2}px)`,
          backfaceVisibility: 'hidden',
        }}
      >
        {ACTS.map((act, i) =>
          act.face ? <SlabFace key={act.n} index={i} face={act.face} progress={progress} /> : null,
        )}
      </div>
    </motion.div>
  );
}

function SlabFace({
  index,
  face,
  progress,
}: {
  index: number;
  face: Exclude<FaceKind, null>;
  progress: MotionValue<number>;
}) {
  const b = index / N;
  const c = (index + 0.5) / N;
  const nb = (index + 1) / N;
  // Triangular reveal: content visible only while this face is turned forward.
  const opacity = useTransform(progress, [b, c, nb], [0, 1, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex flex-col p-6">
      {face === 'bem' ? <BemFaceContent /> : <AuditorFaceContent />}
    </motion.div>
  );
}

function FaceHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <>
      <p className="type-micro uppercase" style={{ ...TECH_LABEL, color: 'rgba(17,17,17,0.6)' }}>
        {kicker}
      </p>
      <p className="type-meta uppercase mt-1" style={{ color: 'var(--color-ink)' }}>
        {title}
      </p>
    </>
  );
}

// Solid recessed screenshot panel (no dashed frame / corner ticks — that
// vocabulary belongs to the accessibility page). Swap for <img> later.
function ScreenshotSlot({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div
      className="relative mt-4 flex-1"
      style={{ background: 'var(--color-cloud)', border: '1px solid rgba(17,17,17,0.28)' }}
    >
      <span
        className="type-micro uppercase absolute left-3 top-3"
        style={{ ...TECH_LABEL, color: 'rgba(17,17,17,0.45)' }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function BemFaceContent() {
  return (
    <>
      <FaceHeader kicker="Plugin · 01" title="BEM Layer Namer" />
      <ScreenshotSlot label="Plugin UI · screenshot">
        <div className="absolute inset-x-3 bottom-3 space-y-2">
          {['card__media', 'card__title', 'card__cta'].map((name) => (
            <div key={name} className="flex items-center gap-2">
              <span style={{ width: 8, height: 8, background: 'var(--color-accent)', display: 'inline-block' }} />
              <span className="type-micro" style={{ ...TECH_LABEL, color: 'rgba(17,17,17,0.7)' }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </ScreenshotSlot>
    </>
  );
}

function AuditorFaceContent() {
  const issues = [
    ['1.4.3', 'Contrast'],
    ['2.5.5', 'Tap target'],
    ['2.4.7', 'Focus'],
  ];
  return (
    <>
      <FaceHeader kicker="Plugin · 02" title="Accessibility Auditor" />
      <ScreenshotSlot label="Plugin UI · overlays">
        {/* Mock overlay annotations — solid markers on the audited canvas */}
        <div className="absolute right-3 top-9 flex flex-col items-end gap-2">
          <span style={{ width: 26, height: 18, border: '2px solid var(--color-accent)', display: 'block' }} />
          <span style={{ width: 18, height: 18, border: '2px solid var(--color-accent)', display: 'block' }} />
          <span style={{ width: 30, height: 14, background: 'var(--color-accent)', display: 'block' }} />
        </div>
        <div className="absolute inset-x-3 bottom-3 space-y-1.5">
          {issues.map(([code, label]) => (
            <div key={code} className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(17,17,17,0.18)', paddingTop: 4 }}>
              <span className="type-micro uppercase" style={{ ...TECH_LABEL, color: 'rgba(17,17,17,0.7)' }}>{code}</span>
              <span className="type-micro uppercase" style={{ ...TECH_LABEL, color: 'rgba(17,17,17,0.5)' }}>{label}</span>
            </div>
          ))}
        </div>
      </ScreenshotSlot>
    </>
  );
}

function ActText({ index, act, progress }: { index: number; act: Act; progress: MotionValue<number> }) {
  const b = index / N;
  const c = (index + 0.5) / N;
  const nb = (index + 1) / N;

  // Act 00 is visible immediately on landing (no fade-in at scrollY=0), then
  // fades as the slab turns away toward act 01.
  const opacityFirst = useTransform(progress, [0, nb * 0.82, nb], [1, 1, 0]);
  const xFirst = useTransform(progress, [0, nb], [0, -52]);
  // Later acts fade in as their face turns forward, out as it turns away.
  const opacityRest = useTransform(progress, [b, c, nb], [0, 1, 0]);
  const xRest = useTransform(progress, [b, nb], [48, -30]);

  const opacity = index === 0 ? opacityFirst : opacityRest;
  const x = index === 0 ? xFirst : xRest;

  return (
    <motion.div
      style={{ opacity, x, position: 'absolute', top: '50%', right: 0, translateY: '-50%' }}
    >
      <ActNumber n={act.n} />
      <h2
        className="type-display-l mt-3"
        style={{ color: 'var(--color-ink)', fontSize: act.titleSize, lineHeight: 1.06 }}
      >
        {act.title}
      </h2>
      <p className="type-pull-quote mt-6" style={{ color: 'rgba(17,17,17,0.66)', maxWidth: 560 }}>
        {act.sub}
      </p>
    </motion.div>
  );
}

function ActNumber({ n }: { n: string }) {
  return (
    <span
      className="type-micro"
      style={{
        ...TECH_LABEL,
        color: 'rgba(17,17,17,0.4)',
        fontSize: 'clamp(40px, 5vw, 72px)',
        lineHeight: 1,
        display: 'block',
      }}
    >
      {n}
    </span>
  );
}

// Reduced-motion fallback — static stack, no 3D rotation, content preserved.
function MonolithReducedFallback() {
  return (
    <section>
      {ACTS.map((act) => (
        <div key={act.n} className="px-6 py-16 sm:px-8 sm:py-24">
          <div className="hero-breakout mx-auto">
            <ActNumber n={act.n} />
            <h2
              className="type-display-l mt-3"
              style={{ color: 'var(--color-ink)', fontSize: act.titleSize, lineHeight: 1.06 }}
            >
              {act.title}
            </h2>
            <p className="type-pull-quote mt-5" style={{ color: 'rgba(17,17,17,0.66)', maxWidth: 640 }}>
              {act.sub}
            </p>
            {act.face && (
              <div
                className="mt-8"
                style={{
                  maxWidth: 420,
                  background: 'var(--color-cloud)',
                  border: '1px solid rgba(17,17,17,0.28)',
                  padding: 16,
                }}
              >
                <span className="type-micro uppercase" style={{ ...TECH_LABEL, color: 'rgba(17,17,17,0.45)' }}>
                  {act.face === 'bem' ? 'Plugin UI · screenshot' : 'Plugin UI · overlays'}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
