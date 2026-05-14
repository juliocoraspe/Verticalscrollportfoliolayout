import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const TECH_LABEL_STYLE: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum"',
};

const HERO_TAGS = [
  'WCAG audits automated',
  'Custom Figma plugins',
  'Local AI — no API costs',
  'Full design-to-code cycle',
  'Agentic MCP pipelines',
  'Multimodal vision models',
];

const FIGMA_CHECKS = [
  ['WCAG 1.4.3', 'Text contrast (4.5:1 / 3:1)'],
  ['WCAG 1.4.11', 'UI component contrast (3:1)'],
  ['WCAG 2.5.5 / 2.5.8', 'Tap target size (24px–44px)'],
  ['Best Practice', 'Text size minimum (12px)'],
  ['WCAG 2.4.7', 'Focus state defined'],
  ['WCAG 2.4.11', 'Focus indicator (≥2px / ≥3:1)'],
] as const;

const PIPELINE = [
  'figma.currentPage',
  'walk tree',
  'NodeShape adapter',
  '6 checks parallel',
  'Issue[ ] collect',
  'draw overlays',
  'llama3.2-vision alt text',
  'tab order review',
] as const;

const TOOL_GROUPS = [
  {
    title: 'Development AI',
    items: [
      ['Claude / Claude Code', 'Architecture, coding, agentic workflows'],
      ['Ollama (local)', 'llama3.2-vision, gpt-oss:20b — offline inference'],
      ['OpenAI Codex', 'Code assistance via desktop'],
    ],
  },
  {
    title: 'Design AI',
    items: [
      ['Figma Make', 'AI component & layout prototyping'],
      ['Custom Figma Plugins', 'A11y audits + BEM naming, built in-house'],
      ['Google Stitch · Recraft', 'UI exploration & vector generation'],
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      ['MCP Servers', 'Playwright + Figma-Context — custom pipelines'],
      ['CLAUDE.md + slash cmds', 'Workflow-specific prompts, local LLM routing'],
      ['Anthropic MCP Certified', 'Official MCP course completed'],
    ],
  },
] as const;

const KNOWLEDGE = [
  [
    'Context Windows & Model Limits',
    'I understand how context windows work across models — how much history a model can "see," when to be concise vs. verbose, and how to structure long-running sessions to avoid degradation.',
  ],
  [
    'System Prompts & Custom Modes',
    'Beyond standard chat, I configure Claude with persistent instructions via CLAUDE.md and custom slash commands — creating specialized modes for local LLM routing, project-specific context, and workflow automation.',
  ],
  [
    'Local-First AI Architecture',
    "Running models locally via Ollama isn't just a cost decision — it's a design constraint I build around. Streaming responses via chunked JSON, multimodal inference with vision models, and bridging plugin sandboxes to localhost APIs are practical skills, not theory.",
  ],
  [
    'Agentic Pipelines with MCP',
    "The Model Context Protocol lets AI models use tools programmatically. I've built pipelines where Claude Code autonomously navigates live websites, runs accessibility checks across multiple pages, and generates structured reports.",
  ],
  [
    'Rate Limits, Tiers & Token Economics',
    'I think in terms of token budgets — knowing when a task should run locally, when to batch via API, and when to use a smaller model. This shapes how I design AI-augmented tools.',
  ],
  [
    'AI as a Design Systems Tool',
    "I apply AI to systematize design decisions — automated layer naming via BEM, accessibility checking at the canvas level, and generative UI exploration. AI isn't a replacement for design judgment.",
  ],
] as const;

const STORY_THREAD_LINES: StoryLine[] = [
  { x1: 96, y1: -48, x2: 96, y2: 468, major: true, enterY: -18, exitY: 18, persistent: true },
  { x1: 260, y1: -48, x2: 260, y2: 468, enterY: -28, exitY: 28, persistent: true },
  { x1: 424, y1: -48, x2: 424, y2: 468, major: true, enterY: -22, exitY: 22, persistent: true },
];

const BLUEPRINT_GRID_SIZE = 7;
const BINARY_STATES = ['00', '01', '10', '11'] as const;

export function AiExperience() {
  useEffect(() => {
    document.documentElement.classList.add('ai-experience-route');
    document.body.classList.add('ai-experience-route');

    return () => {
      document.documentElement.classList.remove('ai-experience-route');
      document.body.classList.remove('ai-experience-route');
    };
  }, []);

  return (
    <main
      id="main-content"
      className="relative"
      style={{ backgroundColor: 'var(--color-base)', color: 'var(--color-ink)' }}
    >
      <div className="relative z-10">
        <Beat id="ai-hero" label="AI Practice · 00" align="left" size="hero">
          <h1
            className="type-display-l ai-hero-title"
            style={{ color: 'var(--color-ink)', fontSize: 'clamp(30px, 5.2vw, 68px)', lineHeight: 1.08 }}
          >
            I build the systems that make AI useful.
          </h1>
          <p className="type-pull-quote hero-subtitle mt-8" style={{ maxWidth: 760, color: 'rgba(17,17,17,0.72)' }}>
            I do not treat AI as a trend layer or a generator bolted onto the end of the process. I
            build with it: local models, custom workflows, and automation that reduce cost, protect
            context, and make design and engineering work measurably more effective.
          </p>
          <p className="type-body mt-6" style={{ maxWidth: 680, color: 'rgba(17,17,17,0.6)' }}>
            What follows is the toolkit I have built — two Figma plugins I wrote myself, a pipeline I
            assembled to audit live websites, the stack I deliberately chose, and what I have learned
            running it day to day.
          </p>
          <TagRail tags={HERO_TAGS} />
        </Beat>

        <Beat id="bem-namer" label="Plugin I built · 01 of 02" align="right" intro={<PluginGroupIntro />}>
          <Kicker>Inside the design tool · handoff</Kicker>
          <h3 className="type-display-l" style={{ color: 'var(--color-dark)', fontSize: 'clamp(26px, 3.4vw, 42px)', lineHeight: 1.12 }}>
            Figma BEM Layer Name
          </h3>
          <p className="type-body mt-6" style={{ maxWidth: 'none', color: 'rgba(17,17,17,0.72)' }}>
            It's a plugin that automatically renames Figma layers using BEM methodology, making
            component structure legible for developers and design handoff predictable at scale. A
            deterministic heuristics engine runs first (zero latency, zero dependencies), and a
            local LLM bridge optionally refines ambiguous names with semantic context.
          </p>
          <p className="type-body mt-4" style={{ maxWidth: 'none', color: 'rgba(17,17,17,0.62)' }}>
            TypeScript, Figma Plugin API, esbuild, and a local Express service that proxies to
            Ollama — fully offline, no cloud, no subscriptions.
          </p>
          <BemPluginPhases />
          <TagRail tags={['Figma Plugin API', 'Ollama (local)', 'gpt-oss:20b', 'BEM Methodology', 'TypeScript', 'Localhost Bridge']} />
        </Beat>

        <Beat id="figma-auditor" label="Plugin I built · 02 of 02" align="right">
          <Kicker>Inside the design tool · accessibility</Kicker>
          <h3
            className="type-display-l"
            style={{
              color: 'var(--color-dark)',
              fontSize: 'clamp(26px, 3.4vw, 42px)',
              lineHeight: 1.12,
              maxWidth: 'none',
            }}
          >
            Figma Accessibility Auditor
          </h3>
          <p className="type-body mt-6" style={{ maxWidth: 'none', color: 'rgba(17,17,17,0.72)' }}>
            It's a plugin that checks six WCAG 2.2 AA criteria directly on the Figma canvas:
            contrast ratios, tap target sizes, focus indicator visibility, and structured issue
            reports with overlay annotations. The AI layer uses a locally-running llama3.2-vision
            model via Ollama to generate alt text suggestions and review the order of elements in
            tab navigation. No API keys. No per-token costs.
          </p>
          <UnifiedAuditFlow />
          <TagRail
            tags={[
              'TypeScript 5.x',
              'React 18',
              'Ollama',
              'llama3.2-vision',
              'Figma Plugin API',
              'Vitest (28 tests)',
            ]}
          />
        </Beat>

        <Beat id="wcag-pipeline" label="Pipeline I built · 03" align="left">
          <Kicker>Outside the design tool · live websites</Kicker>
          <h2 className="type-display-l" style={{ color: 'var(--color-ink)', fontSize: 'clamp(26px, 3.4vw, 42px)', lineHeight: 1.12 }}>
            My Automated WCAG Audit Pipeline
          </h2>
          <p className="type-body mt-6" style={{ maxWidth: 720, color: 'rgba(17,17,17,0.72)' }}>
            The plugins live where designs are drawn. This pipeline lives where designs already
            shipped — production websites that need to be diagnosed and fixed. I wired Claude Code
            to drive a real Chromium via the Playwright MCP server, inject axe-core, and run WCAG
            2.1 / 2.2 AA across every page — replacing paid auditing tools end-to-end.
          </p>
          <WcagPipelinePhases />
          <TagRail tags={['Claude Code', 'Playwright MCP', 'axe-core', 'NVDA / VoiceOver', 'WordPress / HTML / CSS / Frameworks']} />
        </Beat>

        <Beat id="tools" label="My stack · 04" align="center">
          <Kicker>The toolkit behind the work</Kicker>
          <h2 className="type-display-l" style={{ color: 'var(--color-ink)', fontSize: 'clamp(26px, 3.4vw, 42px)', lineHeight: 1.12 }}>
            The tools I chose to work with.
          </h2>
          <p className="type-body mt-6 text-center mx-auto" style={{ maxWidth: 720, color: 'rgba(17,17,17,0.68)' }}>
            The plugins and the pipeline are not the goal — they are products of a stack I keep
            curating. These are the instruments I have deliberately picked and put into my workflow,
            grouped by the job each one does.
          </p>
          <ToolsVisualization />
          <ToolSequence />
        </Beat>

        <Beat id="knowledge" label="What I know · 05" align="center">
          <Kicker>The knowledge that holds the stack together</Kicker>
          <h2 className="type-display-l" style={{ color: 'var(--color-ink)', fontSize: 'clamp(26px, 3.4vw, 42px)', lineHeight: 1.12 }}>
            What I have learned running it.
          </h2>
          <p className="type-body mt-6 text-center mx-auto" style={{ maxWidth: 760, color: 'rgba(17,17,17,0.68)' }}>
            Tools alone do not make a system. Context windows, cost, privacy, and runtime behavior
            shape the output — six things I have come to understand from running this stack myself.
          </p>
          <KnowledgeSequence start={0} end={6} />
        </Beat>

      </div>
    </main>
  );
}

function Beat({
  id,
  label,
  align,
  size = 'normal',
  intro,
  children,
}: {
  id: string;
  label: string;
  align: 'left' | 'right' | 'center';
  size?: 'hero' | 'normal' | 'final';
  intro?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const scrollOffset =
    id === 'figma-auditor'
      ? (['start 88%', 'start 10%'] as const)
      : id === 'ai-hero'
      ? (['start start', 'end start'] as const)
      : (['start 88%', 'end 12%'] as const);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: scrollOffset,
  });
  const immediateHeroProgress = useImmediateScrollProgress(id === 'ai-hero');
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.78, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.16, 0.82, 1], [56, 0, 0, -44]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.16, 0.82, 1],
    align === 'right' ? [54, 0, 0, -24] : align === 'left' ? [-54, 0, 0, 24] : [0, 0, 0, 0],
  );
  const textScale = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.97, 1, 1, 0.985]);
  const textBlur = useTransform(scrollYProgress, [0, 0.16, 0.82, 1], ['8px', '0px', '0px', '5px']);
  const visualX = useTransform(
    scrollYProgress,
    [0, 0.16, 0.82, 1],
    align === 'right' ? [-42, 0, 0, 38] : align === 'left' ? [42, 0, 0, -38] : [0, 0, 0, 0],
  );
  const visualScale = useTransform(scrollYProgress, [0, 0.24, 0.78, 1], [0.92, 1, 1, 0.96]);
  const contentRow = intro ? 'md:row-start-2' : 'md:row-start-1';

  const heroOrder = size === 'hero' ? 'order-1 md:order-none' : '';
  const alignClass =
    id === 'figma-auditor'
      ? `md:col-start-6 md:col-span-7 ${contentRow}`
      : id === 'bem-namer'
      ? `md:col-start-6 md:col-span-7 ${contentRow}`
    : id === 'tools' || id === 'knowledge'
      ? `md:col-span-12 ${contentRow}`
      : align === 'right'
      ? `md:col-start-7 md:col-span-6 ${contentRow}`
      : align === 'center'
        ? `md:col-start-3 md:col-span-8 ${contentRow}`
        : `md:col-span-6 ${heroOrder} ${contentRow}`;

  const visualClass =
    size === 'hero'
      ? `order-2 md:order-none block mt-6 mb-10 md:mt-0 md:mb-0 md:col-start-8 md:col-span-5 ${contentRow} md:self-start`
      : id === 'figma-auditor'
        ? `pointer-events-none hidden md:block md:col-start-1 md:col-span-6 ${contentRow} md:self-start`
      : id === 'bem-namer'
      ? `pointer-events-none hidden md:block md:col-start-1 md:col-span-6 ${contentRow} md:self-start`
      : id === 'tools' || id === 'knowledge'
      ? `block md:col-span-12 ${contentRow} mb-12`
      : align === 'right'
      ? `hidden md:block md:col-start-1 md:col-span-5 ${contentRow}`
    : align === 'left'
      ? `hidden md:block md:col-start-8 md:col-span-5 ${contentRow}`
      : `hidden md:block md:col-start-1 md:col-span-2 ${contentRow}`;

  const minHeight =
    size === 'hero'
      ? 'min-h-[calc(74svh-48px)]'
      : size === 'final'
        ? 'min-h-0 md:min-h-[64vh]'
        : id === 'knowledge'
          ? 'min-h-0'
          : id === 'tools'
            ? 'min-h-0'
            : 'min-h-0 md:min-h-[44vh]';
  const sectionSpace =
    size === 'hero'
      ? 'px-6 pt-9 pb-0 sm:px-6 sm:pt-12 sm:pb-2'
      : id === 'figma-auditor'
        ? 'px-6 pt-4 pb-6 sm:px-6 sm:pt-4 sm:pb-8'
      : id === 'bem-namer'
        ? 'px-6 pt-6 pb-6 sm:px-6 sm:pt-6 sm:pb-9'
      : 'px-6 py-6 sm:px-6 sm:py-9';
  const sectionDivider =
    size !== 'hero' && id !== 'figma-auditor'
      ? 'border-t border-pale'
      : '';
  const alignment = 'md:items-start';
  const labelStyle: CSSProperties =
    size === 'hero'
      ? {
          ...TECH_LABEL_STYLE,
          color: 'rgba(17,17,17,0.52)',
          position: 'absolute',
          top: -34,
          left: 0,
        }
      : { ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.52)' };
  const visualStyle =
    id === 'figma-auditor'
      ? {
          opacity: 1,
          marginLeft: 'clamp(-300px, -20vw, -140px)',
          marginTop: 'clamp(8rem, 18vh, 18rem)',
          width: 'min(96vw, 1040px)',
          zIndex: 20,
        }
      : id === 'wcag-pipeline'
      ? (shouldReduceMotion
          ? { marginTop: '8rem' }
          : { opacity, x: visualX, scale: visualScale, marginTop: '8rem' })
      : id === 'bem-namer'
      ? {
          opacity: 1,
          marginLeft: 'clamp(-300px, -20vw, -140px)',
          marginTop: 'clamp(6rem, 12vh, 10rem)',
          width: 'min(96vw, 1040px)',
          zIndex: 20,
        }
      : shouldReduceMotion || id === 'ai-hero'
        ? undefined
        : { opacity, x: visualX, scale: visualScale };
  const textMotionStyle =
    id === 'figma-auditor' || id === 'bem-namer'
      ? { opacity: 1, transform: 'none', filter: 'none' }
      : shouldReduceMotion || size === 'hero'
        ? undefined
        : { opacity, y, x, scale: textScale, filter: textBlur };

  return (
    <section ref={ref} id={id} className={`${minHeight} ${sectionSpace} ${sectionDivider} relative overflow-hidden`}>
      <div className={`hero-breakout relative z-10 mx-auto grid min-h-[inherit] ${intro ? 'gap-y-10 md:gap-y-12' : ''} md:grid-cols-12 ${alignment}`}>
        {intro && (
          <div className="md:col-span-12 md:row-start-1">
            {intro}
          </div>
        )}
        {(id !== 'ai-hero' || size === 'hero') && id !== 'tools' && id !== 'knowledge' && (
          <motion.div
            className={visualClass}
            style={visualStyle}
          >
            {id === 'ai-hero' ? (
              <BlueprintFractureGrid progress={scrollYProgress} />
            ) : id === 'figma-auditor' ? (
              <BlueprintStackedPlates progress={scrollYProgress} />
            ) : id === 'bem-namer' ? (
              <BemAnnotatedLayout progress={scrollYProgress} />
            ) : id === 'wcag-pipeline' ? (
              <LayeredAuditObject progress={scrollYProgress} />
            ) : id === 'knowledge' ? (
              <PathSystemComposite progress={scrollYProgress} scrollDriven />
            ) : (
              <LineStory variant={id} progress={scrollYProgress} />
            )}
          </motion.div>
        )}
        <motion.div
          className={`${alignClass} relative ${id === 'figma-auditor' ? 'z-10' : ''}`}
          style={textMotionStyle}
        >
          {size !== 'hero' && (
            <p className="type-micro uppercase mb-5" style={labelStyle}>
              {label}
            </p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function useImmediateScrollProgress(active: boolean) {
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!active) return undefined;

    const update = () => {
      const hero = document.getElementById('ai-hero');
      const heroShift = hero ? Math.max(0, 48 - hero.getBoundingClientRect().top) : 0;
      const scrollTop = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
        document.scrollingElement?.scrollTop ?? 0,
        heroShift,
      );
      progress.set(Math.min(1, Math.max(0, scrollTop / 72)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    document.addEventListener('scroll', update, { capture: true, passive: true });

    return () => {
      window.removeEventListener('scroll', update);
      document.removeEventListener('scroll', update, { capture: true });
    };
  }, [active, progress]);

  return progress;
}

// ─── Technical blueprint grid ─────────────────────────────────────────────
// Pure orthogonal grid with a single delicate shear along one row, like
// a thin tectonic slip. No bouncing, no scattering, no chaos edges.
const GRID_ORIGIN_X = 118;
const GRID_ORIGIN_Y = 96;
const GRID_CELL = 56;
const GRID_LAST = BLUEPRINT_GRID_SIZE - 1;
const GRID_END_X = GRID_ORIGIN_X + GRID_CELL * GRID_LAST;
const GRID_END_Y = GRID_ORIGIN_Y + GRID_CELL * GRID_LAST;
const GRID_CENTER_OFFSET_X = 46;
// Floating drift: every row drifts vertically away from the grid center, and
// every column drifts horizontally away from the grid center. Movement is
// slow, smooth, and continues throughout the scroll — like the lines are
// floating apart in space. No springs, no bounce.
const DRIFT_PER_STEP = 28; // px each row/column slides away from center per "step" of separation — doubled for a more violent fracture
// Each line spins on its own axis as it floats apart — adds drama to the
// fracture moment. Outer lines spin more than inner lines (proportional to
// distance from grid center). Alternating sign so adjacent lines counter-rotate.
const ROT_PER_STEP = 14; // degrees of rotation per step from center, scaled by drift — sharper twist

function BlueprintFractureGrid({ progress }: { progress: MotionValue<number> }) {
  const phase = useBinaryPhase(progress);

  // Grid is fully present from frame 0 — we only fade chrome/details a bit
  // on far exit so the next section feels distinct.
  const shellOpacity = useTransform(progress, [0, 0.95, 1], [1, 1, 0.65]);

  // Drift driven from the very first scroll pixel. Aggressive front-loaded
  // curve: ~55% of the separation lands inside the first 15% of scroll, so
  // the fracture feels sharp and immediate, then keeps slowly opening.
  const drift = useTransform(progress, [0, 0.04, 0.15, 0.5, 1], [0, 0.18, 0.55, 0.82, 1]);

  // Rows/cols centered on the middle index (3) so movement is symmetric
  // about the grid center.
  const center = (BLUEPRINT_GRID_SIZE - 1) / 2;
  const cols = Array.from({ length: BLUEPRINT_GRID_SIZE }, (_, i) => i);
  const rows = Array.from({ length: BLUEPRINT_GRID_SIZE }, (_, i) => i);
  // Labeled rows still show the binary value
  const labeledRows = [0, 2, 4, 6];

  return (
    <motion.div className="relative w-full" style={{ opacity: shellOpacity }}>
      <svg
        className="h-[360px] w-full overflow-visible sm:h-[520px] md:h-[780px]"
        viewBox="0 0 700 700"
        fill="none"
        aria-hidden="true"
      >
        <g transform={`translate(${GRID_CENTER_OFFSET_X} 0)`}>
          {/* Architectural chrome layer — stays still while inner grid fractures */}
          <BlueprintChrome rows={rows} cols={cols} />

          {/* Horizontal segments — one per (row, cell column). Each segment drifts
              with its row AND its cell-column, and rotates on its own midpoint. */}
          {rows.flatMap((row) =>
            Array.from({ length: GRID_LAST }, (_, segCol) => (
              <FractureSegment
                key={`hseg-${row}-${segCol}`}
                orientation="h"
                row={row}
                col={segCol}
                rowOffsetSteps={row - center}
                colOffsetSteps={segCol + 0.5 - center}
                drift={drift}
              />
            )),
          )}

          {/* Vertical segments — one per (col, cell row). */}
          {cols.flatMap((col) =>
            Array.from({ length: GRID_LAST }, (_, segRow) => (
              <FractureSegment
                key={`vseg-${col}-${segRow}`}
                orientation="v"
                row={segRow}
                col={col}
                rowOffsetSteps={segRow + 0.5 - center}
                colOffsetSteps={col - center}
                drift={drift}
              />
            )),
          )}

          {/* Intersection nodes — each node moves with its row AND its column */}
          {rows.flatMap((row) =>
            cols.map((col) => (
              <FloatingNode
                key={`n-${col}-${row}`}
                row={row}
                col={col}
                rowOffsetSteps={row - center}
                colOffsetSteps={col - center}
                drift={drift}
              />
            )),
          )}

          {/* Binary value labels per labeled row — drift with the row they sit on */}
          {labeledRows.map((row, index) => (
            <FloatingRowLabel
              key={`row-value-${row}`}
              row={row}
              offsetSteps={row - center}
              drift={drift}
              value={getBinaryValue(index + row, phase)}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}

// Static architectural chrome: corner registrations, outer dimension frame,
// tick marks, axis labels, grid module callout. This layer does NOT animate
// — it's the blueprint plate the fractured grid lives inside.
function BlueprintChrome({ rows, cols }: { rows: number[]; cols: number[] }) {
  const STROKE = 'rgba(17,17,17,0.62)';
  const STROKE_FAINT = 'rgba(17,17,17,0.32)';
  const FILL = 'rgba(17,17,17,0.68)';
  const FILL_FAINT = 'rgba(17,17,17,0.42)';
  const TICK_OUT = 6;
  const FRAME_PAD = 32;
  const DIM_OFFSET = 56;

  return (
    <g>
      {/* Outer dimension frame — dashed rectangle around the grid */}
      <rect
        x={GRID_ORIGIN_X - FRAME_PAD}
        y={GRID_ORIGIN_Y - FRAME_PAD}
        width={GRID_END_X - GRID_ORIGIN_X + FRAME_PAD * 2}
        height={GRID_END_Y - GRID_ORIGIN_Y + FRAME_PAD * 2}
        stroke={STROKE_FAINT}
        strokeWidth={0.6}
        strokeDasharray="2 4"
        vectorEffect="non-scaling-stroke"
      />

      {/* Corner registration marks */}
      <g stroke="rgba(17,17,17,0.78)" strokeWidth={0.9} vectorEffect="non-scaling-stroke">
        <BlueprintCorner x={GRID_ORIGIN_X - 28} y={GRID_ORIGIN_Y - 28} corner="tl" />
        <BlueprintCorner x={GRID_END_X + 28}   y={GRID_ORIGIN_Y - 28} corner="tr" />
        <BlueprintCorner x={GRID_ORIGIN_X - 28} y={GRID_END_Y + 28}   corner="bl" />
        <BlueprintCorner x={GRID_END_X + 28}   y={GRID_END_Y + 28}   corner="br" />
      </g>

      {/* Top dimension line: total width with end caps + tick marks */}
      <g stroke={STROKE} strokeWidth={0.6} vectorEffect="non-scaling-stroke">
        <line
          x1={GRID_ORIGIN_X}
          y1={GRID_ORIGIN_Y - DIM_OFFSET}
          x2={GRID_END_X}
          y2={GRID_ORIGIN_Y - DIM_OFFSET}
        />
        {/* End caps */}
        <line
          x1={GRID_ORIGIN_X}
          y1={GRID_ORIGIN_Y - DIM_OFFSET - 5}
          x2={GRID_ORIGIN_X}
          y2={GRID_ORIGIN_Y - DIM_OFFSET + 5}
        />
        <line
          x1={GRID_END_X}
          y1={GRID_ORIGIN_Y - DIM_OFFSET - 5}
          x2={GRID_END_X}
          y2={GRID_ORIGIN_Y - DIM_OFFSET + 5}
        />
        {/* Column tick marks */}
        {cols.map((col) => (
          <line
            key={`tick-top-${col}`}
            x1={GRID_ORIGIN_X + col * GRID_CELL}
            y1={GRID_ORIGIN_Y - DIM_OFFSET}
            x2={GRID_ORIGIN_X + col * GRID_CELL}
            y2={GRID_ORIGIN_Y - DIM_OFFSET + TICK_OUT}
          />
        ))}
      </g>
      <text
        x={(GRID_ORIGIN_X + GRID_END_X) / 2}
        y={GRID_ORIGIN_Y - DIM_OFFSET - 8}
        textAnchor="middle"
        className="type-micro"
        style={{ ...TECH_LABEL_STYLE, fill: FILL, fontSize: 10, letterSpacing: '0.06em' }}
      >
        {`${GRID_END_X - GRID_ORIGIN_X}`}
      </text>

      {/* Right dimension line: total height with end caps + tick marks */}
      <g stroke={STROKE} strokeWidth={0.6} vectorEffect="non-scaling-stroke">
        <line
          x1={GRID_END_X + DIM_OFFSET}
          y1={GRID_ORIGIN_Y}
          x2={GRID_END_X + DIM_OFFSET}
          y2={GRID_END_Y}
        />
        <line
          x1={GRID_END_X + DIM_OFFSET - 5}
          y1={GRID_ORIGIN_Y}
          x2={GRID_END_X + DIM_OFFSET + 5}
          y2={GRID_ORIGIN_Y}
        />
        <line
          x1={GRID_END_X + DIM_OFFSET - 5}
          y1={GRID_END_Y}
          x2={GRID_END_X + DIM_OFFSET + 5}
          y2={GRID_END_Y}
        />
        {rows.map((row) => (
          <line
            key={`tick-right-${row}`}
            x1={GRID_END_X + DIM_OFFSET - TICK_OUT}
            y1={GRID_ORIGIN_Y + row * GRID_CELL}
            x2={GRID_END_X + DIM_OFFSET}
            y2={GRID_ORIGIN_Y + row * GRID_CELL}
          />
        ))}
      </g>
      <text
        x={GRID_END_X + DIM_OFFSET + 10}
        y={(GRID_ORIGIN_Y + GRID_END_Y) / 2}
        textAnchor="start"
        dominantBaseline="middle"
        className="type-micro"
        style={{ ...TECH_LABEL_STYLE, fill: FILL, fontSize: 10, letterSpacing: '0.06em' }}
      >
        {`${GRID_END_Y - GRID_ORIGIN_Y}`}
      </text>

      {/* Origin marker — small crosshair at (0,0) of the grid */}
      <g stroke={STROKE} strokeWidth={0.7} vectorEffect="non-scaling-stroke">
        <line x1={GRID_ORIGIN_X - 6} y1={GRID_ORIGIN_Y} x2={GRID_ORIGIN_X + 6} y2={GRID_ORIGIN_Y} />
        <line x1={GRID_ORIGIN_X} y1={GRID_ORIGIN_Y - 6} x2={GRID_ORIGIN_X} y2={GRID_ORIGIN_Y + 6} />
        <circle cx={GRID_ORIGIN_X} cy={GRID_ORIGIN_Y} r={1.4} fill="rgba(17,17,17,0.88)" />
      </g>

      {/* Column index numbers along the top (00..06) */}
      {cols.map((col) => (
        <text
          key={`col-label-${col}`}
          x={GRID_ORIGIN_X + col * GRID_CELL}
          y={GRID_ORIGIN_Y - DIM_OFFSET + 18}
          textAnchor="middle"
          className="type-micro"
          style={{ ...TECH_LABEL_STYLE, fill: FILL_FAINT, fontSize: 8.5, letterSpacing: '0.08em' }}
        >
          {col.toString().padStart(2, '0')}
        </text>
      ))}

      {/* Diagonal reference lines (corner-to-corner, very faint) */}
      <g stroke={STROKE_FAINT} strokeWidth={0.4} strokeDasharray="1 3" vectorEffect="non-scaling-stroke">
        <line x1={GRID_ORIGIN_X} y1={GRID_ORIGIN_Y} x2={GRID_END_X} y2={GRID_END_Y} />
        <line x1={GRID_END_X} y1={GRID_ORIGIN_Y} x2={GRID_ORIGIN_X} y2={GRID_END_Y} />
      </g>
    </g>
  );
}

// A single per-cell segment of the grid. Each segment fractures independently:
// it drifts away from the grid center in BOTH axes (so the segments separate
// from each other where they used to share endpoints) and spins on its own
// midpoint. Adjacent segments counter-rotate so each cell looks like it's
// snapping apart at the joints.
function FractureSegment({
  orientation,
  row,
  col,
  rowOffsetSteps,
  colOffsetSteps,
  drift,
}: {
  orientation: 'h' | 'v';
  row: number;
  col: number;
  rowOffsetSteps: number;
  colOffsetSteps: number;
  drift: MotionValue<number>;
}) {
  // Each segment drifts away from the grid center along BOTH axes — that's
  // what visually breaks each cell apart at the corners.
  const dx = useTransform(drift, (v) => colOffsetSteps * DRIFT_PER_STEP * v);
  const dy = useTransform(drift, (v) => rowOffsetSteps * DRIFT_PER_STEP * v);

  // Spin around the segment's own midpoint. Sign alternates by (row+col) so
  // neighboring segments counter-rotate, which makes the fracture feel
  // mechanical rather than uniform.
  const parity = (row + col) % 2 === 0 ? 1 : -1;
  // Distance from grid center scales how dramatic the spin is.
  const dist = Math.max(
    1,
    Math.hypot(rowOffsetSteps, colOffsetSteps),
  );
  const rotate = useTransform(drift, (v) => parity * dist * ROT_PER_STEP * v);

  // Endpoints + midpoint for this segment.
  let x1: number, y1: number, x2: number, y2: number;
  if (orientation === 'h') {
    x1 = GRID_ORIGIN_X + col * GRID_CELL;
    y1 = GRID_ORIGIN_Y + row * GRID_CELL;
    x2 = GRID_ORIGIN_X + (col + 1) * GRID_CELL;
    y2 = y1;
  } else {
    x1 = GRID_ORIGIN_X + col * GRID_CELL;
    y1 = GRID_ORIGIN_Y + row * GRID_CELL;
    x2 = x1;
    y2 = GRID_ORIGIN_Y + (row + 1) * GRID_CELL;
  }
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Outer-edge segments (top, bottom, left, right of the whole grid) get the
  // slightly heavier stroke that the perimeter used to have.
  const isOuter =
    (orientation === 'h' && (row === 0 || row === GRID_LAST)) ||
    (orientation === 'v' && (col === 0 || col === GRID_LAST));

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(17,17,17,0.82)"
      strokeWidth={isOuter ? 1.1 : 0.7}
      vectorEffect="non-scaling-stroke"
      style={{
        x: dx,
        y: dy,
        rotate,
        transformOrigin: `${midX}px ${midY}px`,
        transformBox: 'fill-box',
      }}
    />
  );
}

function FloatingNode({
  row,
  col,
  rowOffsetSteps,
  colOffsetSteps,
  drift,
}: {
  row: number;
  col: number;
  rowOffsetSteps: number;
  colOffsetSteps: number;
  drift: MotionValue<number>;
}) {
  const dx = useTransform(drift, (v) => colOffsetSteps * DRIFT_PER_STEP * v);
  const dy = useTransform(drift, (v) => rowOffsetSteps * DRIFT_PER_STEP * v);
  const isEdge = col === 0 || col === GRID_LAST || row === 0 || row === GRID_LAST;
  const isCorner =
    (col === 0 || col === GRID_LAST) && (row === 0 || row === GRID_LAST);

  return (
    <motion.circle
      cx={GRID_ORIGIN_X + col * GRID_CELL}
      cy={GRID_ORIGIN_Y + row * GRID_CELL}
      r={isCorner ? 2.4 : isEdge ? 1.8 : 1.3}
      fill={isCorner ? 'rgba(17,17,17,0.92)' : 'rgba(17,17,17,0.78)'}
      stroke={isCorner ? 'rgba(17,17,17,0.92)' : undefined}
      strokeWidth={isCorner ? 0.8 : undefined}
      style={{ x: dx, y: dy }}
    />
  );
}

function FloatingRowLabel({
  row,
  offsetSteps,
  drift,
  value,
}: {
  row: number;
  offsetSteps: number;
  drift: MotionValue<number>;
  value: string;
}) {
  const dy = useTransform(drift, (v) => offsetSteps * DRIFT_PER_STEP * v);

  return (
    <motion.text
      x={GRID_ORIGIN_X - 16}
      y={GRID_ORIGIN_Y + row * GRID_CELL + 4}
      textAnchor="end"
      className="type-micro"
      style={{ ...TECH_LABEL_STYLE, fill: 'rgba(17,17,17,0.62)', y: dy, fontSize: 9, letterSpacing: '0.08em' }}
    >
      {value}
    </motion.text>
  );
}

// Isometric stack of blueprint plates. The center plate is the densest /
// most opaque ("the principal"); the four other plates fan out above and
// below with progressively less density and visibility, as if they were
// alternate variants peeled out of the master. Triggered by scroll: starts
// as a tight stack of identical plates and slowly fans apart vertically.
function BlueprintStackedPlates({ progress }: { progress: MotionValue<number> }) {
  // Project palette only:
  //   ink     #111111 — primary stroke / dark fill
  //   accent  #344040 — secondary dark
  //   dark    #767676
  //   pale    #959492
  //   mist    #f2f1ed
  //   cloud   #eff2f2
  //   base    #fcfbfa
  //   pure    #ffffff
  // Center plate = dark ink fill + ink/accent strokes. Peeled plates use
  // increasing transparency from ink toward pale/dark, sitting on a base
  // background so they read as variants of the same monochrome blueprint.
  const PLATES = [
    { idx: -2, tint: 'rgba(149,148,146,0.55)', opacity: 0.50, density: 'sparse', fill: 'rgba(252,251,250,0.55)' },
    { idx: -1, tint: 'rgba(118,118,118,0.78)', opacity: 0.70, density: 'medium', fill: 'rgba(242,241,237,0.78)' },
    { idx:  0, tint: 'rgba(252,251,250,0.92)', opacity: 1.00, density: 'full',   fill: 'rgba(17,17,17,0.94)'   },
    { idx:  1, tint: 'rgba(118,118,118,0.78)', opacity: 0.70, density: 'medium', fill: 'rgba(239,242,242,0.78)' },
    { idx:  2, tint: 'rgba(149,148,146,0.55)', opacity: 0.50, density: 'sparse', fill: 'rgba(252,251,250,0.55)' },
  ] as const;

  // Fan out: at progress=0 the plates are nearly stacked, at progress=1 they
  // are fully separated vertically. The center plate stays anchored; the
  // outer plates drift up/down.
  const fanOut = useTransform(progress, [0, 0.08, 1], [0, 0.35, 1]);
  // Master plate appears first; outer plates fade in as the fan opens.
  const outerFade = useTransform(progress, [0, 0.05, 0.3], [0, 0.3, 1]);
  const shellOpacity = useTransform(progress, [0, 0.05, 0.92, 1], [0, 1, 1, 0.78]);

  // Spacing per "step" away from the center plate when fully fanned. Larger
  // step gives a much more dramatic vertical separation as scroll progresses.
  const STEP_Y = 120;

  // viewBox is tall enough to hold the fully fanned stack (2 steps up + 2
  // down × STEP_Y + plate height + padding) — and centered around CY = 360.
  return (
    <motion.svg
      className="h-[300px] w-full overflow-visible sm:h-[420px] md:h-[540px]"
      viewBox="0 0 440 720"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      style={{ opacity: shellOpacity, display: 'block', margin: '0 auto' }}
    >
      {/* Connector posts — thin verticals at the 4 plate corners suggesting the
          stack is mechanically pinned together. Drawn behind plates. */}
      <ConnectorPosts fanOut={fanOut} plates={PLATES} stepY={STEP_Y} />

      {/* Render plates back-to-front so the topmost (idx = -2) sits behind the
          center, and the bottom (idx = 2) is drawn last on top. We want the
          center to feel "primary" and the others to be peeled, so the center
          ends up between layers visually. */}
      {[...PLATES].sort((a, b) => a.idx - b.idx).map((plate) => (
        <IsometricPlate
          key={`plate-${plate.idx}`}
          plate={plate}
          fanOut={fanOut}
          outerFade={outerFade}
          stepY={STEP_Y}
        />
      ))}
    </motion.svg>
  );
}

type PlateDef = {
  idx: number;
  tint: string;
  opacity: number;
  density: 'full' | 'medium' | 'sparse';
  fill: string;
};

function ConnectorPosts({
  fanOut,
  plates,
  stepY,
}: {
  fanOut: MotionValue<number>;
  plates: readonly PlateDef[];
  stepY: number;
}) {
  // Center of the SVG canvas (440x720, centered so plates sit in the middle)
  const CX = 220;
  const CY = 360;
  // Isometric plate corners (relative to plate center, before y offset).
  // Plate is a parallelogram: top edge skews right, side edge skews down.
  const HALF_W = 150; // horizontal half-extent of plate
  const HALF_H = 58; // vertical half-extent (isometric tilt)
  const corners = [
    { dx: -HALF_W, dy: -HALF_H }, // top-left
    { dx:  HALF_W, dy: -HALF_H }, // top-right
    { dx:  HALF_W, dy:  HALF_H }, // bottom-right
    { dx: -HALF_W, dy:  HALF_H }, // bottom-left
  ];

  const idxMin = Math.min(...plates.map((p) => p.idx));
  const idxMax = Math.max(...plates.map((p) => p.idx));

  return (
    <g>
      {corners.map((c, i) => {
        const x = CX + c.dx;
        const yTop = CY + c.dy + idxMin * stepY;
        const yBot = CY + c.dy + idxMax * stepY;
        return (
          <PostLine key={`post-${i}`} x={x} yTop={yTop} yBot={yBot} fanOut={fanOut} />
        );
      })}
    </g>
  );
}

function PostLine({
  x,
  yTop,
  yBot,
  fanOut,
}: {
  x: number;
  yTop: number;
  yBot: number;
  fanOut: MotionValue<number>;
}) {
  // Posts grow from the center as the stack fans out.
  const cy = (yTop + yBot) / 2;
  const y1 = useTransform(fanOut, (v) => cy + (yTop - cy) * v);
  const y2 = useTransform(fanOut, (v) => cy + (yBot - cy) * v);
  const opacity = useTransform(fanOut, [0, 0.2, 1], [0, 0.4, 0.75]);
  return (
    <motion.line
      x1={x}
      x2={x}
      y1={y1}
      y2={y2}
      stroke="rgba(17,17,17,0.55)"
      strokeWidth={0.6}
      strokeDasharray="2 3"
      vectorEffect="non-scaling-stroke"
      style={{ opacity }}
    />
  );
}

function IsometricPlate({
  plate,
  fanOut,
  outerFade,
  stepY,
}: {
  plate: PlateDef;
  fanOut: MotionValue<number>;
  outerFade: MotionValue<number>;
  stepY: number;
}) {
  // Vertical position offsets relative to canvas center, scaled by fanOut.
  const targetY = plate.idx * stepY;
  const y = useTransform(fanOut, (v) => targetY * v);

  // Center plate is always at full opacity; peeled plates fade in as the
  // stack opens.
  const opacityMV = useTransform(outerFade, (v) =>
    plate.idx === 0 ? plate.opacity : plate.opacity * v,
  );

  // Plate geometry — parallelogram (isometric quad)
  const CX = 220;
  const CY = 360;
  const HALF_W = 150;
  const HALF_H = 58;
  // Skew: top edge of the plate is offset slightly to the right vs the bottom
  // edge to fake isometric perspective. Pure parallelogram (no perspective
  // foreshortening).
  const SKEW = 32;
  const pts = [
    [CX - HALF_W + SKEW, CY - HALF_H], // top-left
    [CX + HALF_W + SKEW, CY - HALF_H], // top-right
    [CX + HALF_W - SKEW, CY + HALF_H], // bottom-right
    [CX - HALF_W - SKEW, CY + HALF_H], // bottom-left
  ];
  const polygon = pts.map(([px, py]) => `${px},${py}`).join(' ');

  return (
    <motion.g style={{ y, opacity: opacityMV }}>
      {/* Plate background */}
      <polygon
        points={polygon}
        fill={plate.fill}
        stroke={plate.idx === 0 ? 'rgba(17,17,17,0.95)' : 'rgba(17,17,17,0.55)'}
        strokeWidth={plate.idx === 0 ? 1.4 : 0.85}
        vectorEffect="non-scaling-stroke"
      />

      {/* Grid fill via clipPath — different grid for center vs others */}
      <PlateGrid
        cx={CX}
        cy={CY}
        halfW={HALF_W}
        halfH={HALF_H}
        skew={SKEW}
        plate={plate}
      />

      {/* UI mock content drawn inside the plate */}
      <PlateContent
        cx={CX}
        cy={CY}
        halfW={HALF_W}
        halfH={HALF_H}
        skew={SKEW}
        plate={plate}
      />

      {/* Corner registration ticks on the plate — light on center, dark on peeled */}
      <PlateCorners
        pts={pts}
        tint={plate.idx === 0 ? 'rgba(252,251,250,0.95)' : 'rgba(17,17,17,0.78)'}
      />
    </motion.g>
  );
}

function PlateGrid({
  cx,
  cy,
  halfW,
  halfH,
  skew,
  plate,
}: {
  cx: number;
  cy: number;
  halfW: number;
  halfH: number;
  skew: number;
  plate: PlateDef;
}) {
  // Draw a set of skewed grid lines that follow the parallelogram. The center
  // plate gets a denser grid; outer plates get progressively sparser grids.
  const step =
    plate.density === 'full' ? 12 : plate.density === 'medium' ? 22 : 38;
  const lineOpacity =
    plate.density === 'full' ? 0.38 : plate.density === 'medium' ? 0.28 : 0.18;
  // Center plate sits on dark ink fill → light grid (mist). Peeled plates
  // sit on light fills → ink grid using the project palette.
  const stroke = plate.idx === 0 ? 'rgba(242,241,237,0.65)' : 'rgba(17,17,17,0.72)';

  // Horizontal lines (parallel to top edge): y is constant, but x range
  // shifts with y for the skew.
  const hLines: ReactNode[] = [];
  for (let y = -halfH; y <= halfH; y += step) {
    const t = (y + halfH) / (2 * halfH); // 0..1 from top to bottom
    const offsetX = skew - 2 * skew * t;
    hLines.push(
      <line
        key={`h-${y}`}
        x1={cx - halfW + offsetX}
        y1={cy + y}
        x2={cx + halfW + offsetX}
        y2={cy + y}
        stroke={stroke}
        strokeWidth={0.4}
        opacity={lineOpacity}
        vectorEffect="non-scaling-stroke"
      />,
    );
  }
  // Vertical-ish lines (the slanted ones)
  const vLines: ReactNode[] = [];
  for (let x = -halfW; x <= halfW; x += step) {
    vLines.push(
      <line
        key={`v-${x}`}
        x1={cx + x + skew}
        y1={cy - halfH}
        x2={cx + x - skew}
        y2={cy + halfH}
        stroke={stroke}
        strokeWidth={0.4}
        opacity={lineOpacity}
        vectorEffect="non-scaling-stroke"
      />,
    );
  }

  return (
    <g>
      {hLines}
      {vLines}
    </g>
  );
}

function PlateContent({
  cx,
  cy,
  halfW,
  halfH,
  skew,
  plate,
}: {
  cx: number;
  cy: number;
  halfW: number;
  halfH: number;
  skew: number;
  plate: PlateDef;
}) {
  // UI mock content: dense blueprint UI mock laid out within the plate's
  // isometric quad. Center plate = high-contrast, full set, thicker strokes.
  // Peeled plates = lighter, fewer modules, thinner strokes — same family,
  // distinct variants.
  // Project palette only: ink (#111), mist (#f2f1ed), pale (#959492), accent (#344040).
  const stroke = plate.idx === 0 ? 'rgba(242,241,237,0.95)' : 'rgba(17,17,17,0.88)';
  const accentStroke = plate.idx === 0 ? 'rgba(252,251,250,0.90)' : 'rgba(52,64,64,0.92)';
  const sw = plate.idx === 0 ? 0.95 : 0.7;
  const lineOp = plate.idx === 0 ? 1 : 0.78;

  type Module = {
    x: number;
    y: number;
    w: number;
    h: number;
    type: 'rect' | 'cross' | 'circle' | 'hatched' | 'triangle' | 'hexagon' | 'lines';
    accent?: boolean;
  };
  // Plate-local coordinate space: x ∈ [-halfW, halfW] = [-200, 200],
  // y ∈ [-halfH, halfH] = [-80, 80].
  const FULL_MODULES: Module[] = [
    // === Top header row ===
    { x: -180, y: -64, w: 70, h: 18, type: 'hatched' },
    { x: -100, y: -64, w: 40, h: 18, type: 'rect' },
    { x:  -50, y: -64, w: 40, h: 18, type: 'rect' },
    { x:    0, y: -64, w: 40, h: 18, type: 'rect' },
    { x:   50, y: -64, w: 40, h: 18, type: 'rect' },
    { x:  100, y: -64, w: 70, h: 18, type: 'lines' },
    // === Hero block (large, center-left) with diagonal cross ===
    { x: -180, y: -38, w: 110, h: 56, type: 'cross', accent: true },
    // === Mid-right column: a row of varied small modules ===
    { x:  -60, y: -38, w: 40, h: 22, type: 'rect' },
    { x:  -15, y: -38, w: 40, h: 22, type: 'hexagon' },
    { x:   30, y: -38, w: 40, h: 22, type: 'rect' },
    { x:   75, y: -38, w: 40, h: 22, type: 'triangle' },
    { x:  120, y: -38, w: 50, h: 22, type: 'hatched' },
    // === Mid row continued ===
    { x:  -60, y: -12, w: 40, h: 22, type: 'lines' },
    { x:  -15, y: -12, w: 40, h: 22, type: 'rect' },
    { x:   30, y: -12, w: 40, h: 22, type: 'circle' },
    { x:   75, y: -12, w: 40, h: 22, type: 'rect' },
    { x:  120, y: -12, w: 50, h: 22, type: 'rect' },
    // === Card row (bottom-left card sequence) ===
    { x: -180, y:  20, w: 38, h: 30, type: 'rect' },
    { x: -138, y:  20, w: 38, h: 30, type: 'circle' },
    { x:  -96, y:  20, w: 38, h: 30, type: 'rect' },
    { x:  -54, y:  20, w: 38, h: 30, type: 'triangle' },
    { x:  -12, y:  20, w: 38, h: 30, type: 'rect' },
    { x:   30, y:  20, w: 38, h: 30, type: 'hexagon' },
    { x:   72, y:  20, w: 38, h: 30, type: 'circle' },
    { x:  114, y:  20, w: 38, h: 30, type: 'rect' },
    { x:  156, y:  20, w: 38, h: 30, type: 'circle' },
    // === Bottom bar / hatched footer ===
    { x: -180, y:  54, w: 230, h: 14, type: 'hatched' },
    { x:   55, y:  54, w: 60, h: 14, type: 'lines' },
    { x:  120, y:  54, w: 74, h: 14, type: 'hatched' },
  ];
  const MEDIUM_MODULES: Module[] = [
    { x: -180, y: -64, w: 70, h: 18, type: 'rect' },
    { x: -100, y: -64, w: 130, h: 18, type: 'lines' },
    { x:   35, y: -64, w: 135, h: 18, type: 'hatched' },
    { x: -180, y: -38, w: 110, h: 56, type: 'cross' },
    { x:  -60, y: -38, w: 85, h: 22, type: 'rect' },
    { x:   30, y: -38, w: 85, h: 22, type: 'rect' },
    { x:  120, y: -38, w: 50, h: 22, type: 'hexagon' },
    { x:  -60, y: -12, w: 85, h: 22, type: 'lines' },
    { x:   30, y: -12, w: 85, h: 22, type: 'circle' },
    { x:  120, y: -12, w: 50, h: 22, type: 'rect' },
    { x: -180, y:  20, w: 80, h: 30, type: 'rect' },
    { x:  -96, y:  20, w: 80, h: 30, type: 'triangle' },
    { x:  -12, y:  20, w: 80, h: 30, type: 'rect' },
    { x:   72, y:  20, w: 80, h: 30, type: 'circle' },
    { x:  156, y:  20, w: 38, h: 30, type: 'rect' },
    { x: -180, y:  54, w: 230, h: 14, type: 'lines' },
    { x:   55, y:  54, w: 139, h: 14, type: 'hatched' },
  ];
  const SPARSE_MODULES: Module[] = [
    { x: -180, y: -64, w: 70, h: 18, type: 'rect' },
    { x: -100, y: -64, w: 270, h: 18, type: 'lines' },
    { x: -180, y: -38, w: 110, h: 56, type: 'rect' },
    { x:  -60, y: -38, w: 110, h: 22, type: 'rect' },
    { x:   55, y: -38, w: 115, h: 22, type: 'rect' },
    { x:  -60, y: -12, w: 230, h: 22, type: 'lines' },
    { x: -180, y:  20, w: 165, h: 30, type: 'rect' },
    { x:  -12, y:  20, w: 80, h: 30, type: 'circle' },
    { x:   72, y:  20, w: 122, h: 30, type: 'rect' },
    { x: -180, y:  54, w: 374, h: 14, type: 'hatched' },
  ];

  const rawModules =
    plate.density === 'full' ? FULL_MODULES :
    plate.density === 'medium' ? MEDIUM_MODULES :
    SPARSE_MODULES;

  // Modules above are authored in a fixed reference plate space
  // (halfW=200, halfH=80). Scale them down/up so they fill the current
  // plate, no matter how large it is.
  const REF_HW = 200;
  const REF_HH = 80;
  const sx = halfW / REF_HW;
  const sy = halfH / REF_HH;
  const modules: Module[] = rawModules.map((m) => ({
    ...m,
    x: m.x * sx,
    y: m.y * sy,
    w: m.w * sx,
    h: m.h * sy,
  }));

  // Convert a plate-local point to canvas coords, applying the skew.
  const project = (lx: number, ly: number) => {
    const t = (ly + halfH) / (2 * halfH);
    const offsetX = skew - 2 * skew * t;
    return [cx + lx + offsetX, cy + ly];
  };

  return (
    <g opacity={lineOp}>
      {modules.map((m, i) => {
        const tl = project(m.x, m.y);
        const tr = project(m.x + m.w, m.y);
        const br = project(m.x + m.w, m.y + m.h);
        const bl = project(m.x, m.y + m.h);
        const poly = `${tl[0]},${tl[1]} ${tr[0]},${tr[1]} ${br[0]},${br[1]} ${bl[0]},${bl[1]}`;
        const center: [number, number] = [(tl[0] + br[0]) / 2, (tl[1] + br[1]) / 2];
        const moduleStroke = m.accent ? accentStroke : stroke;
        const localStrokeW = m.accent ? sw * 1.4 : sw;

        return (
          <g key={`mod-${i}`}>
            <polygon
              points={poly}
              fill="none"
              stroke={moduleStroke}
              strokeWidth={localStrokeW}
              vectorEffect="non-scaling-stroke"
            />
            {m.type === 'cross' && (
              <>
                <line x1={tl[0]} y1={tl[1]} x2={br[0]} y2={br[1]} stroke={moduleStroke} strokeWidth={localStrokeW} vectorEffect="non-scaling-stroke" />
                <line x1={tr[0]} y1={tr[1]} x2={bl[0]} y2={bl[1]} stroke={moduleStroke} strokeWidth={localStrokeW} vectorEffect="non-scaling-stroke" />
              </>
            )}
            {m.type === 'circle' && (
              <circle
                cx={center[0]}
                cy={center[1]}
                r={Math.min(m.w, m.h) * 0.35}
                fill="none"
                stroke={moduleStroke}
                strokeWidth={localStrokeW}
                vectorEffect="non-scaling-stroke"
              />
            )}
            {m.type === 'triangle' && (() => {
              const top = project(m.x + m.w / 2, m.y + 4);
              const lb = project(m.x + 4, m.y + m.h - 4);
              const rb = project(m.x + m.w - 4, m.y + m.h - 4);
              return (
                <polygon
                  points={`${top[0]},${top[1]} ${lb[0]},${lb[1]} ${rb[0]},${rb[1]}`}
                  fill="none"
                  stroke={moduleStroke}
                  strokeWidth={localStrokeW}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })()}
            {m.type === 'hexagon' && (() => {
              // Inscribe a hexagon inside the module's bounding rect.
              const pad = 3;
              const w = m.w - pad * 2;
              const h = m.h - pad * 2;
              const ox = m.x + pad;
              const oy = m.y + pad;
              const hexPts = [
                [ox + w * 0.25, oy],
                [ox + w * 0.75, oy],
                [ox + w,        oy + h * 0.5],
                [ox + w * 0.75, oy + h],
                [ox + w * 0.25, oy + h],
                [ox,            oy + h * 0.5],
              ].map(([px, py]) => project(px, py));
              return (
                <polygon
                  points={hexPts.map((p) => `${p[0]},${p[1]}`).join(' ')}
                  fill="none"
                  stroke={moduleStroke}
                  strokeWidth={localStrokeW}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })()}
            {m.type === 'lines' && (
              <g>
                {Array.from({ length: 4 }, (_, k) => {
                  const yPos = m.y + (m.h * (k + 1)) / 5;
                  const pA = project(m.x + 3, yPos);
                  const pB = project(m.x + m.w - 3, yPos);
                  return (
                    <line
                      key={`ln-${i}-${k}`}
                      x1={pA[0]}
                      y1={pA[1]}
                      x2={pB[0]}
                      y2={pB[1]}
                      stroke={moduleStroke}
                      strokeWidth={localStrokeW * 0.7}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </g>
            )}
            {m.type === 'hatched' && (
              <g>
                {Array.from({ length: 7 }, (_, k) => {
                  const tA = k / 7;
                  const tB = (k + 0.55) / 7;
                  const aX = m.x + m.w * tA;
                  const bX = m.x + m.w * tB;
                  const pA = project(aX, m.y);
                  const pB = project(bX, m.y + m.h);
                  return (
                    <line
                      key={`hatch-${i}-${k}`}
                      x1={pA[0]}
                      y1={pA[1]}
                      x2={pB[0]}
                      y2={pB[1]}
                      stroke={moduleStroke}
                      strokeWidth={localStrokeW * 0.65}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

function PlateCorners({ pts, tint }: { pts: number[][]; tint: string }) {
  // Small L-shaped tick marks at each plate corner — project palette only.
  const LEN = 10;
  return (
    <g stroke={tint} strokeWidth={1.1} vectorEffect="non-scaling-stroke">
      {pts.map(([x, y], i) => {
        // direction of L based on which corner
        const dx = i === 0 || i === 3 ? 1 : -1;
        const dy = i === 0 || i === 1 ? 1 : -1;
        return (
          <g key={`corner-${i}`}>
            <line x1={x} y1={y} x2={x + dx * LEN} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y + dy * LEN} />
          </g>
        );
      })}
    </g>
  );
}

// L-shaped corner registration mark.
function BlueprintCorner({ x, y, corner }: { x: number; y: number; corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const dx = corner === 'tl' || corner === 'bl' ? 1 : -1;
  const dy = corner === 'tl' || corner === 'tr' ? 1 : -1;
  const LEN = 10;
  return (
    <g stroke="rgba(17,17,17,0.78)" strokeWidth="0.9" vectorEffect="non-scaling-stroke">
      <line x1={x} y1={y} x2={x + dx * LEN} y2={y} />
      <line x1={x} y1={y} x2={x} y2={y + dy * LEN} />
    </g>
  );
}

function useBinaryPhase(progress: MotionValue<number>) {
  const [phase, setPhase] = useState(0);

  useMotionValueEvent(progress, 'change', (latest) => {
    const next = Math.max(0, Math.min(BINARY_STATES.length - 1, Math.floor(latest * 10)));
    setPhase((current) => (current === next ? current : next));
  });

  return phase;
}

function getBinaryValue(index: number, phase: number) {
  return BINARY_STATES[(index + phase) % BINARY_STATES.length];
}

type ScanLine = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  major?: boolean;
  dashed?: boolean;
  soft?: boolean;
  accent?: boolean;
};

type ScanLabel = {
  id: string;
  label: string;
  valueIndex: number;
  x: number;
  y: number;
  guideX: number;
  guideY: number;
  anchor?: 'start' | 'end';
};

type ScanNode = {
  id: string;
  x: number;
  y: number;
  accent?: boolean;
};

const MOBILE_SCAN_LINES: ScanLine[] = [
  { id: 'frame-top', x1: 218, y1: 62, x2: 356, y2: 62, major: true },
  { id: 'frame-right', x1: 356, y1: 62, x2: 356, y2: 332, major: true },
  { id: 'frame-bottom', x1: 356, y1: 332, x2: 218, y2: 332, major: true },
  { id: 'frame-left', x1: 218, y1: 332, x2: 218, y2: 62, major: true },
  { id: 'nav-rule', x1: 229, y1: 76, x2: 312, y2: 76, soft: true },
  { id: 'hero-top', x1: 228, y1: 88, x2: 346, y2: 88, major: true },
  { id: 'hero-right', x1: 346, y1: 88, x2: 346, y2: 176, major: true },
  { id: 'hero-bottom', x1: 346, y1: 176, x2: 228, y2: 176, major: true },
  { id: 'hero-left', x1: 228, y1: 176, x2: 228, y2: 88, major: true },
  { id: 'hero-cross-a', x1: 228, y1: 88, x2: 346, y2: 176, soft: true },
  { id: 'hero-cross-b', x1: 346, y1: 88, x2: 228, y2: 176, soft: true },
  { id: 'meta-a', x1: 232, y1: 194, x2: 278, y2: 194, soft: true },
  { id: 'meta-b', x1: 232, y1: 203, x2: 318, y2: 203, soft: true },
  { id: 'meta-c', x1: 232, y1: 212, x2: 296, y2: 212, soft: true },
  { id: 'card-a-top', x1: 229, y1: 228, x2: 262, y2: 228 },
  { id: 'card-a-right', x1: 262, y1: 228, x2: 262, y2: 290 },
  { id: 'card-a-bottom', x1: 262, y1: 290, x2: 229, y2: 290 },
  { id: 'card-a-left', x1: 229, y1: 290, x2: 229, y2: 228 },
  { id: 'card-b-top', x1: 272, y1: 228, x2: 305, y2: 228 },
  { id: 'card-b-right', x1: 305, y1: 228, x2: 305, y2: 290 },
  { id: 'card-b-bottom', x1: 305, y1: 290, x2: 272, y2: 290 },
  { id: 'card-b-left', x1: 272, y1: 290, x2: 272, y2: 228 },
  { id: 'card-c-top', x1: 315, y1: 228, x2: 348, y2: 228 },
  { id: 'card-c-right', x1: 348, y1: 228, x2: 348, y2: 290 },
  { id: 'card-c-bottom', x1: 348, y1: 290, x2: 315, y2: 290 },
  { id: 'card-c-left', x1: 315, y1: 290, x2: 315, y2: 228 },
  { id: 'card-a-icon-h', x1: 241, y1: 250, x2: 250, y2: 250, accent: true },
  { id: 'card-a-icon-v', x1: 245.5, y1: 245.5, x2: 245.5, y2: 254.5, accent: true },
  { id: 'card-b-icon-h', x1: 284, y1: 250, x2: 293, y2: 250, accent: true },
  { id: 'card-b-icon-v', x1: 288.5, y1: 245.5, x2: 288.5, y2: 254.5, accent: true },
  { id: 'card-c-icon-h', x1: 327, y1: 250, x2: 336, y2: 250, accent: true },
  { id: 'card-c-icon-v', x1: 331.5, y1: 245.5, x2: 331.5, y2: 254.5, accent: true },
  { id: 'card-a-copy-a', x1: 235, y1: 276, x2: 255, y2: 276, soft: true },
  { id: 'card-a-copy-b', x1: 235, y1: 282, x2: 260, y2: 282, soft: true },
  { id: 'card-b-copy-a', x1: 278, y1: 276, x2: 298, y2: 276, soft: true },
  { id: 'card-b-copy-b', x1: 278, y1: 282, x2: 303, y2: 282, soft: true },
  { id: 'card-c-copy-a', x1: 321, y1: 276, x2: 341, y2: 276, soft: true },
  { id: 'card-c-copy-b', x1: 321, y1: 282, x2: 346, y2: 282, soft: true },
  { id: 'cta-top', x1: 228, y1: 304, x2: 346, y2: 304, major: true },
  { id: 'cta-right', x1: 346, y1: 304, x2: 346, y2: 322, major: true },
  { id: 'cta-bottom', x1: 346, y1: 322, x2: 228, y2: 322, major: true },
  { id: 'cta-left', x1: 228, y1: 322, x2: 228, y2: 304, major: true },
  { id: 'cta-arrow-a', x1: 328, y1: 313, x2: 340, y2: 313, accent: true },
  { id: 'cta-arrow-b', x1: 335, y1: 308, x2: 340, y2: 313, accent: true },
  { id: 'cta-arrow-c', x1: 335, y1: 318, x2: 340, y2: 313, accent: true },
];

const MOBILE_SCAN_LABELS: ScanLabel[] = [
  { id: 'hdr-top', label: 'HDR_TOP', valueIndex: 1, x: 78, y: 75, guideX: 218, guideY: 62 },
  { id: 'hero-img', label: 'HERO_IMG', valueIndex: 2, x: 78, y: 130, guideX: 228, guideY: 88 },
  { id: 'meta-blk', label: 'META_BLK', valueIndex: 1, x: 78, y: 205, guideX: 232, guideY: 203 },
  { id: 'card-grp', label: 'CARD_GRP', valueIndex: 2, x: 78, y: 250, guideX: 229, guideY: 228 },
  { id: 'cta-bar', label: 'CTA_BAR', valueIndex: 1, x: 78, y: 315, guideX: 228, guideY: 313 },
  { id: 'info-col', label: 'INFO_COL', valueIndex: 1, x: 436, y: 92, guideX: 356, guideY: 78, anchor: 'end' },
  { id: 'txt-row', label: 'TXT_ROW', valueIndex: 2, x: 436, y: 206, guideX: 318, guideY: 203, anchor: 'end' },
  { id: 'cta-btn', label: 'CTA_BTN', valueIndex: 1, x: 436, y: 315, guideX: 346, guideY: 313, anchor: 'end' },
];

const MOBILE_SCAN_NODES: ScanNode[] = [
  { id: 'n-hero-a', x: 228, y: 88 },
  { id: 'n-hero-b', x: 346, y: 176 },
  { id: 'n-meta', x: 318, y: 203 },
  { id: 'n-card-a', x: 229, y: 228 },
  { id: 'n-card-b', x: 272, y: 228 },
  { id: 'n-card-c', x: 348, y: 228 },
  { id: 'n-cta-a', x: 228, y: 313 },
  { id: 'n-cta-b', x: 346, y: 313 },
];

function MobileScanArchitecture({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();
  const phase = useBinaryPhase(progress);
  const shellOpacity = useTransform(progress, [0, 0.08, 0.84, 1], [0, 1, 1, 0.74]);
  const labelOpacity = useTransform(progress, [0, 0.38, 0.55, 1], [0, 0, 0.9, 0.82]);
  const nodeOpacity = useTransform(progress, [0.24, 0.48, 1], [0, 1, 0.86]);

  return (
    <motion.svg
      className="h-[400px] w-full overflow-visible sm:h-[540px] md:h-[760px]"
      viewBox="0 0 520 420"
      preserveAspectRatio="xMinYMid meet"
      fill="none"
      aria-hidden="true"
      style={{ opacity: shellOpacity }}
    >
      <text x="18" y="30" className="type-micro" style={{ ...TECH_LABEL_STYLE, fill: 'var(--color-ink)' }}>
        2
      </text>
      <text x="18" y="48" className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, fill: 'rgba(17,17,17,0.72)' }}>
        SCAN / INFO ARCHITECTURE
      </text>

      <motion.g
        animate={shouldReduceMotion ? undefined : { y: [0, -3, 0, 2, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {MOBILE_SCAN_LINES.map((line, index) => (
          <ScanArchitectureLine
            key={line.id}
            line={line}
            index={index}
            progress={progress}
          />
        ))}
      </motion.g>

      <motion.g style={{ opacity: labelOpacity }}>
        {MOBILE_SCAN_LABELS.map((item) => (
          <ScanArchitectureLabel
            key={item.id}
            item={item}
            value={getBinaryValue(item.valueIndex, phase)}
          />
        ))}
      </motion.g>

      <motion.g style={{ opacity: nodeOpacity }}>
        {MOBILE_SCAN_NODES.map((node, index) => (
          <ScanArchitectureNode
            key={node.id}
            node={node}
            index={index}
            progress={progress}
            shouldReduceMotion={Boolean(shouldReduceMotion)}
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}

function ScanArchitectureLine({
  line,
  index,
  progress,
}: {
  line: ScanLine;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.04 + (index % 14) * 0.007;
  const pathLength = useTransform(progress, [start, start + 0.28], [0, 1]);
  const opacity = useTransform(
    progress,
    [0, start, start + 0.1, 0.88, 1],
    [0, 0, line.soft ? 0.46 : line.major ? 0.82 : 0.62, line.soft ? 0.38 : line.major ? 0.74 : 0.54, line.soft ? 0.32 : line.major ? 0.66 : 0.48],
  );

  return (
    <motion.line
      x1={line.x1}
      y1={line.y1}
      x2={line.x2}
      y2={line.y2}
      stroke="rgba(17,17,17,0.74)"
      strokeDasharray={line.dashed ? '5 8' : undefined}
      strokeWidth={line.accent ? 1.1 : line.major ? 1.05 : line.soft ? 0.62 : 0.8}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      style={{ opacity, pathLength }}
    />
  );
}

function ScanArchitectureLabel({ item, value }: { item: ScanLabel; value: string }) {
  const isEnd = item.anchor === 'end';
  const guideStartX = isEnd ? item.x - 82 : item.x + 62;

  return (
    <g>
      <line
        x1={guideStartX}
        y1={item.y - 4}
        x2={item.guideX}
        y2={item.guideY}
        stroke="rgba(17,17,17,0.28)"
        strokeDasharray="5 7"
        strokeWidth="0.85"
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={item.x}
        y={item.y}
        textAnchor={item.anchor ?? 'start'}
        className="type-micro uppercase"
        style={{ ...TECH_LABEL_STYLE, fill: 'rgba(17,17,17,0.66)' }}
      >
        {item.label}
      </text>
      <text
        x={item.x}
        y={item.y + 15}
        textAnchor={item.anchor ?? 'start'}
        className="type-micro"
        style={{ ...TECH_LABEL_STYLE, fill: 'rgba(17,17,17,0.74)' }}
      >
        {value}
      </text>
    </g>
  );
}

function ScanArchitectureNode({
  node,
  index,
  progress,
  shouldReduceMotion,
}: {
  node: ScanNode;
  index: number;
  progress: MotionValue<number>;
  shouldReduceMotion: boolean;
}) {
  const spring = useSpring(useTransform(progress, [0.34, 0.52, 0.68, 1], [0, 1.3, 0.86, 1]), {
    stiffness: shouldReduceMotion ? 1000 : 500,
    damping: shouldReduceMotion ? 100 : 13,
    mass: shouldReduceMotion ? 0.1 : 0.45,
  });
  const opacity = useTransform(progress, [0.28 + index * 0.008, 0.56, 1], [0, 1, 0.92]);

  return (
    <motion.circle
      cx={node.x}
      cy={node.y}
      r={node.accent ? 2.6 : 2.15}
      fill="rgba(17,17,17,0.82)"
      style={{ opacity, scale: spring, transformBox: 'fill-box', transformOrigin: 'center' }}
    />
  );
}

// ─── Animation 3: BEM Annotated Layout ────────────────────────────────────
// A clean mobile home screen wireframe. Every BEM label points to a real
// element on the screen. Labels stacked on the left, elbow connectors run
// right through a shared vertical bus, then diagonal to the exact element.

type BemPointer = {
  id: string;
  label: string;
  y: number;       // label row Y in the 480-tall viewBox
  targetX: number; // dot lands exactly ON the labelled element
  targetY: number;
};

// ─── Mobile home-screen geometry ───────────────────────────────────────────
// Phone frame: x 210–340, y 64–406 in the 380×480 viewBox.
// Clean, recognizable mobile home screen. Each labeled region has its own
// distinct visual treatment so pointers land on something readable.
type Rect = { x1: number; y1: number; x2: number; y2: number };

const BEM_FRAME = {
  // Outer phone frame
  frame: { x1: 210, y1: 64, x2: 340, y2: 406 } as Rect,
  // Status bar (notch + time)
  statusBarDivider: { x1: 218, y1: 80, x2: 332, y2: 80 } as Rect,
  // Nav bar with 3 items + active item underline
  navBar:   { x1: 218, y1: 88,  x2: 332, y2: 112 } as Rect,
  navItem1: { x1: 224, y1: 94,  x2: 256, y2: 106 } as Rect,
  navItem2: { x1: 261, y1: 94,  x2: 293, y2: 106 } as Rect,
  navItem3: { x1: 298, y1: 94,  x2: 330, y2: 106 } as Rect, // active item (filled darker)
  navActiveUnderline: { x1: 298, y1: 109, x2: 330, y2: 109 } as Rect,
  // Hero block (large image card with overlay title)
  hero:           { x1: 218, y1: 120, x2: 332, y2: 200 } as Rect,
  heroImageMark:  { x1: 218, y1: 120, x2: 332, y2: 200 } as Rect, // diagonal for "image" indicator
  heroTitleA:     { x1: 226, y1: 168, x2: 312, y2: 174 } as Rect, // primary title bar
  heroTitleB:     { x1: 226, y1: 180, x2: 282, y2: 184 } as Rect, // sub-line
  // Featured strip
  featured:     { x1: 218, y1: 210, x2: 332, y2: 244 } as Rect,
  featuredTag:  { x1: 224, y1: 216, x2: 256, y2: 226 } as Rect, // "FEATURED" pill (filled)
  featuredCopy: { x1: 224, y1: 232, x2: 326, y2: 236 } as Rect,
  featuredSub:  { x1: 224, y1: 238, x2: 290, y2: 241 } as Rect,
  // Cards row (3 cards)
  cardA: { x1: 218, y1: 254, x2: 256, y2: 336 } as Rect,
  cardB: { x1: 259, y1: 254, x2: 297, y2: 336 } as Rect,
  cardC: { x1: 300, y1: 254, x2: 338, y2: 336 } as Rect,
  // Card-A internals
  cardAImg:   { x1: 222, y1: 258, x2: 252, y2: 300 } as Rect, // image block
  cardATitle: { x1: 222, y1: 306, x2: 250, y2: 311 } as Rect,
  cardAMeta:  { x1: 222, y1: 318, x2: 244, y2: 322 } as Rect,
  // Card-B internals
  cardBImg:   { x1: 263, y1: 258, x2: 293, y2: 300 } as Rect,
  cardBTitle: { x1: 263, y1: 306, x2: 291, y2: 311 } as Rect,
  cardBMeta:  { x1: 263, y1: 318, x2: 285, y2: 322 } as Rect,
  // Card-C internals
  cardCImg:   { x1: 304, y1: 258, x2: 334, y2: 300 } as Rect,
  cardCTitle: { x1: 304, y1: 306, x2: 332, y2: 311 } as Rect,
  cardCMeta:  { x1: 304, y1: 318, x2: 326, y2: 322 } as Rect,
  // Footer CTA
  footerCta:     { x1: 218, y1: 348, x2: 332, y2: 384 } as Rect,
  footerCtaText: { x1: 246, y1: 363, x2: 304, y2: 369 } as Rect,
} as const;

// Rectangular regions and their visual treatment.
type BemRegion = {
  id: string;
  rect: Rect;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rx?: number; // rounded corners
};

// Outline-only wireframe — every region drawn as a stroked rect with no fill,
// matching the technical/blueprint style of the WCAG audit object.
const STROKE_INK = 'rgba(17,17,17,0.78)';
const STROKE_MUTED = 'rgba(17,17,17,0.36)';

const BEM_REGIONS: BemRegion[] = [
  // Phone frame
  { id: 'frame', rect: BEM_FRAME.frame, stroke: STROKE_INK, strokeWidth: 1.0 },
  // Nav bar container + items
  { id: 'nav',    rect: BEM_FRAME.navBar,   stroke: STROKE_INK,   strokeWidth: 0.9 },
  { id: 'nav-i1', rect: BEM_FRAME.navItem1, stroke: STROKE_MUTED, strokeWidth: 0.65 },
  { id: 'nav-i2', rect: BEM_FRAME.navItem2, stroke: STROKE_MUTED, strokeWidth: 0.65 },
  { id: 'nav-i3', rect: BEM_FRAME.navItem3, stroke: STROKE_INK,   strokeWidth: 0.9 }, // active — heavier stroke
  // Hero
  { id: 'hero',         rect: BEM_FRAME.hero,       stroke: STROKE_INK,   strokeWidth: 1.0 },
  { id: 'hero-title-a', rect: BEM_FRAME.heroTitleA, stroke: STROKE_INK,   strokeWidth: 0.8 },
  { id: 'hero-title-b', rect: BEM_FRAME.heroTitleB, stroke: STROKE_MUTED, strokeWidth: 0.6 },
  // Featured strip
  { id: 'feat',     rect: BEM_FRAME.featured,    stroke: STROKE_INK,   strokeWidth: 0.9 },
  { id: 'feat-tag', rect: BEM_FRAME.featuredTag, stroke: STROKE_INK,   strokeWidth: 1.0 }, // important: bold outline
  { id: 'feat-copy',rect: BEM_FRAME.featuredCopy,stroke: STROKE_MUTED, strokeWidth: 0.6 },
  { id: 'feat-sub', rect: BEM_FRAME.featuredSub, stroke: STROKE_MUTED, strokeWidth: 0.55 },
  // Cards
  { id: 'card-a', rect: BEM_FRAME.cardA, stroke: STROKE_INK,   strokeWidth: 0.95 },
  { id: 'card-b', rect: BEM_FRAME.cardB, stroke: STROKE_MUTED, strokeWidth: 0.7 },
  { id: 'card-c', rect: BEM_FRAME.cardC, stroke: STROKE_MUTED, strokeWidth: 0.7 },
  // Card image areas
  { id: 'card-a-img', rect: BEM_FRAME.cardAImg, stroke: STROKE_MUTED, strokeWidth: 0.55 },
  { id: 'card-b-img', rect: BEM_FRAME.cardBImg, stroke: STROKE_MUTED, strokeWidth: 0.55 },
  { id: 'card-c-img', rect: BEM_FRAME.cardCImg, stroke: STROKE_MUTED, strokeWidth: 0.55 },
  // Card title + meta
  { id: 'card-a-title', rect: BEM_FRAME.cardATitle, stroke: STROKE_INK,   strokeWidth: 0.75 },
  { id: 'card-a-meta',  rect: BEM_FRAME.cardAMeta,  stroke: STROKE_MUTED, strokeWidth: 0.55 },
  { id: 'card-b-title', rect: BEM_FRAME.cardBTitle, stroke: STROKE_MUTED, strokeWidth: 0.6 },
  { id: 'card-b-meta',  rect: BEM_FRAME.cardBMeta,  stroke: STROKE_MUTED, strokeWidth: 0.55 },
  { id: 'card-c-title', rect: BEM_FRAME.cardCTitle, stroke: STROKE_MUTED, strokeWidth: 0.6 },
  { id: 'card-c-meta',  rect: BEM_FRAME.cardCMeta,  stroke: STROKE_MUTED, strokeWidth: 0.55 },
  // Footer CTA + text
  { id: 'cta',      rect: BEM_FRAME.footerCta,     stroke: STROKE_INK, strokeWidth: 1.0 },
  { id: 'cta-text', rect: BEM_FRAME.footerCtaText, stroke: STROKE_INK, strokeWidth: 0.75 },
];

// Active nav underline — kept as a line accent.
const BEM_ACCENT_LINES: ScanLine[] = [
  { id: 'status', x1: BEM_FRAME.statusBarDivider.x1, y1: BEM_FRAME.statusBarDivider.y1, x2: BEM_FRAME.statusBarDivider.x2, y2: BEM_FRAME.statusBarDivider.y2, soft: true },
  { id: 'nav-active', x1: BEM_FRAME.navActiveUnderline.x1, y1: BEM_FRAME.navActiveUnderline.y1, x2: BEM_FRAME.navActiveUnderline.x2, y2: BEM_FRAME.navActiveUnderline.y2, major: true },
];

// Pointers — every targetX/targetY lands on the element the label describes.
// Label rows are paced from y=92 to y=462 across the 480-tall viewBox.
const cx = (r: Rect) => (r.x1 + r.x2) / 2;
const cy = (r: Rect) => (r.y1 + r.y2) / 2;

const BEM_POINTERS: BemPointer[] = [
  // BLOCKS (frame-level)
  { id: 'page',              label: 'page',                    y:  92, targetX: BEM_FRAME.frame.x1 + 4, targetY: BEM_FRAME.frame.y1 + 4 },
  { id: 'page-hero',         label: 'page__hero',              y: 122, targetX: cx(BEM_FRAME.hero),       targetY: cy(BEM_FRAME.hero) },
  { id: 'page-hero-title',   label: 'page__hero-title',        y: 152, targetX: cx(BEM_FRAME.heroTitleA), targetY: cy(BEM_FRAME.heroTitleA) },
  { id: 'page-feat',         label: 'page__section--featured', y: 182, targetX: cx(BEM_FRAME.featuredTag), targetY: cy(BEM_FRAME.featuredTag) },
  // CARDS GROUP & CARD
  { id: 'page-cards',        label: 'page__cards',             y: 222, targetX: (BEM_FRAME.cardA.x1 + BEM_FRAME.cardC.x2) / 2, targetY: BEM_FRAME.cardA.y1 + 2 },
  { id: 'card',              label: 'card',                    y: 252, targetX: cx(BEM_FRAME.cardA),       targetY: cy(BEM_FRAME.cardA) },
  { id: 'card-title',        label: 'card__title',             y: 282, targetX: cx(BEM_FRAME.cardATitle),  targetY: cy(BEM_FRAME.cardATitle) },
  { id: 'card-meta',         label: 'card__meta',              y: 312, targetX: cx(BEM_FRAME.cardAMeta),   targetY: cy(BEM_FRAME.cardAMeta) },
  // NAV
  { id: 'nav',               label: 'nav',                     y: 342, targetX: cx(BEM_FRAME.navBar),      targetY: cy(BEM_FRAME.navBar) },
  { id: 'nav-item',          label: 'nav__item',               y: 372, targetX: cx(BEM_FRAME.navItem2),    targetY: cy(BEM_FRAME.navItem2) },
  { id: 'nav-item-active',   label: 'nav__item--active',       y: 402, targetX: cx(BEM_FRAME.navItem3),    targetY: cy(BEM_FRAME.navItem3) },
  // FOOTER
  { id: 'footer-cta',        label: 'footer__cta',             y: 432, targetX: cx(BEM_FRAME.footerCta),   targetY: cy(BEM_FRAME.footerCta) },
  { id: 'footer-cta-text',   label: 'footer__cta-text',        y: 462, targetX: cx(BEM_FRAME.footerCtaText), targetY: cy(BEM_FRAME.footerCtaText) },
];

// Vertical bus x-coordinate: all horizontal label runs end here, then diagonal to target.
const ELBOW_X = 188;

function BemAnnotatedLayout({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();
  const shellOpacity = useTransform(progress, [0, 0.1, 0.86, 1], [0, 1, 1, 0.72]);
  const pointerOpacity = useTransform(progress, [0.18, 0.42, 0.86, 1], [0, 0.92, 0.92, 0.7]);
  const enterY = useTransform(progress, [0, 0.18], [-40, 0]);

  return (
    <motion.svg
      className="h-[380px] w-full overflow-hidden sm:h-[480px] md:h-[620px]"
      viewBox="0 0 380 480"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      style={{ opacity: shellOpacity, y: enterY }}
    >
      {/* Wireframe — mobile home screen as filled regions (not loose lines) */}
      <motion.g
        animate={shouldReduceMotion ? undefined : { y: [0, -2, 0, 1.4, 0] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {BEM_REGIONS.map((r, i) => (
          <BemRegionRect key={r.id} region={r} index={i} progress={progress} />
        ))}
        {BEM_ACCENT_LINES.map((line, index) => (
          <BemFrameLine key={line.id} line={line} index={index + BEM_REGIONS.length} progress={progress} />
        ))}
      </motion.g>

      {/* Left-only pointer rail with elbow connectors */}
      <motion.g style={{ opacity: pointerOpacity }}>
        {BEM_POINTERS.map((p, index) => (
          <BemPointerRow key={p.id} pointer={p} index={index} progress={progress} />
        ))}
      </motion.g>
    </motion.svg>
  );
}

function BemRegionRect({
  region,
  index,
  progress,
}: {
  region: BemRegion;
  index: number;
  progress: MotionValue<number>;
}) {
  // Regions fade in with a quick stagger over the first ~25% of scroll, then sit fully visible.
  const start = 0.04 + (index % 10) * 0.012;
  const end = start + 0.12;
  const opacity = useTransform(progress, [start, end, 0.92, 1], [0, 1, 1, 0.92]);
  const enterY = useTransform(progress, [start, end], [4, 0]);

  return (
    <motion.rect
      x={region.rect.x1}
      y={region.rect.y1}
      width={region.rect.x2 - region.rect.x1}
      height={region.rect.y2 - region.rect.y1}
      rx={region.rx ?? 0}
      ry={region.rx ?? 0}
      fill={region.fill ?? 'none'}
      stroke={region.stroke ?? 'none'}
      strokeWidth={region.strokeWidth ?? 0}
      vectorEffect="non-scaling-stroke"
      style={{ opacity, y: enterY }}
    />
  );
}

function BemFrameLine({
  line,
  index,
  progress,
}: {
  line: ScanLine;
  index: number;
  progress: MotionValue<number>;
}) {
  // Lines stagger in over the first ~25% of scroll, then sit fully drawn.
  const start = 0.04 + (index % 12) * 0.012;
  const end = start + 0.1;
  const pathLength = useTransform(progress, [start, end], [0, 1]);
  // Opacity fades in alongside the line drawing and STAYS at the strong value.
  const peak = line.soft ? 0.5 : line.major ? 0.86 : 0.7;
  const opacity = useTransform(progress, [start, end, 0.92, 1], [0, peak, peak, peak * 0.9]);
  return (
    <motion.line
      x1={line.x1}
      y1={line.y1}
      x2={line.x2}
      y2={line.y2}
      stroke="rgba(17,17,17,0.88)"
      strokeWidth={line.major ? 1.05 : line.soft ? 0.62 : 0.82}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      style={{ pathLength, opacity }}
    />
  );
}

function BemPointerRow({
  pointer,
  index,
  progress,
}: {
  pointer: BemPointer;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.20 + (index % 13) * 0.012;
  const end = start + 0.18;
  const opacity = useTransform(progress, [start, end, 0.92], [0, 1, 0.86]);
  const enterX = useTransform(progress, [start, end], [-18, 0]);

  const LABEL_X = 8;
  const labelY = pointer.y;

  // Connector starts at ELBOW_X (the vertical bus), goes diagonally to the frame target.
  // A tiny horizontal tick at the start shows the connection to the label row.
  const connStartX = ELBOW_X - 2;

  // Parse label into block / __element / --modifier parts
  const text = pointer.label;
  const modIdx = text.indexOf('--');
  const elemIdx = text.indexOf('__');
  const block = elemIdx >= 0 ? text.slice(0, elemIdx) : modIdx >= 0 ? text.slice(0, modIdx) : text;
  const elem = elemIdx >= 0 ? text.slice(elemIdx, modIdx >= 0 ? modIdx : undefined) : '';
  const mod = modIdx >= 0 ? text.slice(modIdx) : '';

  return (
    <motion.g style={{ opacity, x: enterX }}>
      {/* Horizontal run from label baseline to vertical bus */}
      <line
        x1={LABEL_X + 122}
        y1={labelY - 3}
        x2={connStartX}
        y2={labelY - 3}
        stroke="rgba(17,17,17,0.32)"
        strokeWidth="0.7"
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
      />
      {/* Diagonal from bus to the element it labels */}
      <path
        d={`M ${connStartX} ${labelY - 3} L ${pointer.targetX} ${pointer.targetY}`}
        stroke="rgba(17,17,17,0.36)"
        strokeWidth="0.8"
        strokeDasharray="3 5"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      {/* Tick dot at the element */}
      <circle cx={pointer.targetX} cy={pointer.targetY} r={1.8} fill="rgba(17,17,17,0.88)" />
      {/* BEM label — block bold, __element muted, --modifier strong */}
      <text x={LABEL_X} y={labelY} textAnchor="start" className="type-micro" style={{ ...TECH_LABEL_STYLE, fill: 'rgba(17,17,17,0.82)' }}>
        <tspan style={{ fontWeight: 600 }}>{block}</tspan>
        {elem && <tspan style={{ fill: 'rgba(17,17,17,0.56)' }}>{elem}</tspan>}
        {mod && <tspan style={{ fill: 'rgba(17,17,17,0.9)', fontWeight: 700 }}>{mod}</tspan>}
      </text>
    </motion.g>
  );
}

// ─── Animation 4: Layered Audit Object (3D stack, monochrome) ──────────────
// Upper: hex stack (rotate Y, slow). Mid: spiral rings (rotate Z). Base: hemisphere (rotate Y).
function LayeredAuditObject({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();
  const shellOpacity = useTransform(progress, [0, 0.12, 0.86, 1], [0, 1, 1, 0.7]);
  const layer1Reveal = useTransform(progress, [0.06, 0.32], [0, 1]);
  const layer2Reveal = useTransform(progress, [0.18, 0.5], [0, 1]);
  const layer3Reveal = useTransform(progress, [0.32, 0.68], [0, 1]);

  return (
    <motion.div
      className="relative w-full"
      aria-hidden="true"
      style={{
        opacity: shellOpacity,
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <Spin3D reveal={layer1Reveal} duration={20} reduceMotion={Boolean(shouldReduceMotion)}>
        <HexStack3D />
      </Spin3D>

      <Spin3D reveal={layer2Reveal} duration={14} reduceMotion={Boolean(shouldReduceMotion)}>
        <SpiralRings3D />
      </Spin3D>

      <Spin3D reveal={layer3Reveal} duration={28} reduceMotion={Boolean(shouldReduceMotion)}>
        <Hemisphere3D />
      </Spin3D>

    </motion.div>
  );
}

function Spin3D({
  reveal,
  duration,
  reduceMotion,
  children,
}: {
  reveal: MotionValue<number>;
  duration: number;
  reduceMotion: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{
        opacity: reveal,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1.5rem',
        perspective: '1000px',
      }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { rotateY: 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Real 3D hexagonal prism built from 6 side panels + a top + bottom hex cap.
// Side panels are flat planes positioned around the Y axis (every 60°).
// Hex caps are flat planes laid horizontally (rotateX: 90deg) at top and bottom.
function HexStack3D() {
  const RADIUS = 110; // distance from Y axis to each side panel
  const HEIGHT = 240; // total prism height
  const PANEL_WIDTH = 2 * RADIUS * Math.tan(Math.PI / 6); // hex side length × cos correction
  const sides = Array.from({ length: 6 }, (_, i) => i);
  // Internal horizontal ribs to create the "stacked layers" hex-stack feel
  const ribs = [-0.5, -0.3, -0.1, 0.1, 0.3, 0.5];

  return (
    <div
      style={{
        position: 'relative',
        width: PANEL_WIDTH * 2,
        height: HEIGHT,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 6 side panels — each a flat rectangle rotated and pushed out by RADIUS */}
      {sides.map((i) => {
        const angle = i * 60;
        return (
          <div
            key={`side-${i}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: PANEL_WIDTH,
              height: HEIGHT,
              marginLeft: -PANEL_WIDTH / 2,
              marginTop: -HEIGHT / 2,
              border: '1px solid rgba(17,17,17,0.78)',
              background: 'none',
              transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'visible',
            }}
          >
            {/* horizontal rib lines on each panel — gives "stack" look */}
            {ribs.map((t) => (
              <div
                key={t}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${50 + t * 100}%`,
                  height: 0,
                  borderTop: '1px solid rgba(17,17,17,0.36)',
                }}
              />
            ))}
          </div>
        );
      })}

      {/* Top hex cap */}
      <HexCap radius={RADIUS} y={-HEIGHT / 2} />
      {/* Bottom hex cap */}
      <HexCap radius={RADIUS} y={HEIGHT / 2} />
    </div>
  );
}

function HexCap({ radius, y }: { radius: number; y: number }) {
  // Hex cap = flat svg laid horizontal (rotateX 90deg) at given Y
  const size = radius * 2.4;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        transform: `translateY(${y}px) rotateX(90deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <polygon
          points={hexPoints(radius * 2, radius)}
          transform={`translate(${size / 2} ${size / 2})`}
          stroke="rgba(17,17,17,0.82)"
          strokeWidth="1"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function hexPoints(w: number, h: number) {
  const hw = w / 2;
  const hh = h;
  return [
    [-hw, 0],
    [-hw * 0.55, -hh],
    [hw * 0.55, -hh],
    [hw, 0],
    [hw * 0.55, hh],
    [-hw * 0.55, hh],
  ]
    .map((p) => p.join(','))
    .join(' ');
}

// Ring system — 5 independent thick flat rings stacked at different Y offsets and radii.
// Each ring = a torus-slice: inner cylinder + outer cylinder + top/bottom annulus caps.
// This reads as Saturn-style rings / gyroscope, clearly distinct from the hex prism.
function SpiralRings3D() {
  // [yOffset, radius, bandHeight, strokeOpacity]
  const rings: [number, number, number, number][] = [
    [-90, 155, 28, 0.9],
    [-42, 120, 22, 0.7],
    [  0, 140, 32, 1.0],
    [ 48, 105, 20, 0.65],
    [ 96, 130, 24, 0.8],
  ];

  const STAVE = 32; // staves per ring cylinder wall
  const SIZE = 340; // bounding box

  return (
    <div
      style={{
        position: 'relative',
        width: SIZE,
        height: SIZE,
        transformStyle: 'preserve-3d',
      }}
    >
      {rings.map(([yOff, R, H, alpha], ri) => {
        const INNER_R = R - 14;
        const staveW = (2 * Math.PI * R) / STAVE;
        const capSize = R * 2 + 20;

        return (
          <div
            key={`ring-${ri}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 0,
              height: 0,
              transformStyle: 'preserve-3d',
              transform: `translateY(${yOff}px)`,
            }}
          >
            {/* Outer cylinder wall — staves */}
            {Array.from({ length: STAVE }, (_, i) => {
              const angle = (i / STAVE) * 360;
              return (
                <div
                  key={`os-${i}`}
                  style={{
                    position: 'absolute',
                    width: staveW + 0.5,
                    height: H,
                    marginLeft: -(staveW + 0.5) / 2,
                    marginTop: -H / 2,
                    transform: `rotateY(${angle}deg) translateZ(${R}px)`,
                    transformStyle: 'preserve-3d',
                    borderLeft: `1px solid rgba(17,17,17,${alpha * 0.8})`,
                    background: 'none',
                  }}
                />
              );
            })}

            {/* Inner cylinder wall — staves (same count, smaller radius) */}
            {Array.from({ length: STAVE }, (_, i) => {
              const angle = (i / STAVE) * 360;
              return (
                <div
                  key={`is-${i}`}
                  style={{
                    position: 'absolute',
                    width: staveW * (INNER_R / R) + 0.5,
                    height: H,
                    marginLeft: -(staveW * (INNER_R / R) + 0.5) / 2,
                    marginTop: -H / 2,
                    transform: `rotateY(${angle}deg) translateZ(${INNER_R}px)`,
                    transformStyle: 'preserve-3d',
                    borderLeft: `1px solid rgba(17,17,17,${alpha * 0.45})`,
                    background: 'none',
                  }}
                />
              );
            })}

            {/* Top and bottom annulus caps */}
            {([-H / 2, H / 2] as number[]).map((y, ci) => (
              <div
                key={`cap-${ci}`}
                style={{
                  position: 'absolute',
                  width: capSize,
                  height: capSize,
                  marginLeft: -capSize / 2,
                  marginTop: -capSize / 2,
                  transform: `translateY(${y}px) rotateX(90deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <svg width={capSize} height={capSize} viewBox={`0 0 ${capSize} ${capSize}`} fill="none">
                  {/* Outer edge */}
                  <circle
                    cx={capSize / 2} cy={capSize / 2} r={R}
                    stroke={`rgba(17,17,17,${alpha})`} strokeWidth="1.5"
                    fill="none" vectorEffect="non-scaling-stroke"
                  />
                  {/* Inner edge */}
                  <circle
                    cx={capSize / 2} cy={capSize / 2} r={INNER_R}
                    stroke={`rgba(17,17,17,${alpha * 0.55})`} strokeWidth="1"
                    fill="none" vectorEffect="non-scaling-stroke"
                  />
                  {/* Radial tick marks across the band */}
                  {Array.from({ length: 24 }, (_, k) => {
                    const a = (k / 24) * Math.PI * 2;
                    const x1 = capSize / 2 + Math.cos(a) * INNER_R;
                    const y1 = capSize / 2 + Math.sin(a) * INNER_R;
                    const x2 = capSize / 2 + Math.cos(a) * R;
                    const y2 = capSize / 2 + Math.sin(a) * R;
                    return (
                      <line
                        key={k} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={`rgba(17,17,17,${k % 4 === 0 ? alpha * 0.9 : alpha * 0.35})`}
                        strokeWidth={k % 4 === 0 ? 1.2 : 0.6}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Real 3D wireframe hemisphere — latitudes are horizontal discs (rotateX 90deg) at
// decreasing radii stacked vertically. Meridians are vertical half-circle SVGs rotated
// around Y at intervals.
function Hemisphere3D() {
  const BASE_R = 150;
  const DOME_H = 150;
  // Latitudes — sample t∈[0,1] from base to apex; each is a horizontal disc.
  const latitudes = [0, 0.18, 0.36, 0.54, 0.72, 0.88];
  // Meridians — 6 around Y axis, every 30°.
  const meridians = Array.from({ length: 6 }, (_, i) => i * 30);

  return (
    <div
      style={{
        position: 'relative',
        width: BASE_R * 2 + 40,
        height: DOME_H + 40,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Latitudinal rings (including base equator) */}
      {latitudes.map((t, i) => {
        const r = BASE_R * Math.sqrt(Math.max(0, 1 - t * t));
        const yOffset = DOME_H / 2 - t * DOME_H;
        const size = r * 2 + 16;
        const isEquator = i === 0;
        const isLowerBand = i <= 1;
        return (
          <div
            key={`lat-${t}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              transform: `translateY(${-yOffset}px) rotateX(90deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
              {isLowerBand && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke={isEquator ? 'rgba(17,17,17,0.12)' : 'rgba(17,17,17,0.075)'}
                  strokeWidth={isEquator ? 12 : 6}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {isEquator && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r - 8}
                  stroke="rgba(17,17,17,0.08)"
                  strokeWidth="5"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={isEquator ? 'rgba(17,17,17,0.88)' : isLowerBand ? 'rgba(17,17,17,0.62)' : 'rgba(17,17,17,0.5)'}
                strokeWidth={isEquator ? 2.1 : isLowerBand ? 1.35 : 0.8}
                fill="none"
                strokeDasharray={isEquator ? undefined : '3 5'}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        );
      })}

      {/* Meridians — each a vertical half-circle plane rotated around Y axis */}
      {meridians.map((angle) => {
        const size = BASE_R * 2 + 16;
        const height = DOME_H + 16;
        return (
          <div
            key={`mer-${angle}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size,
              height,
              marginLeft: -size / 2,
              marginTop: -height / 2,
              transform: `rotateY(${angle}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`} fill="none">
              {/* half-circle arc from base equator (bottom center) up over the top */}
              <path
                d={`M ${size / 2 - BASE_R} ${height / 2 + 8} A ${BASE_R} ${DOME_H} 0 0 1 ${size / 2 + BASE_R} ${height / 2 + 8}`}
                stroke="rgba(17,17,17,0.115)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={`M ${size / 2 - BASE_R} ${height / 2 + 8} A ${BASE_R} ${DOME_H} 0 0 1 ${size / 2 + BASE_R} ${height / 2 + 8}`}
                stroke="rgba(17,17,17,0.16)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="12 18"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={`M ${size / 2 - BASE_R} ${height / 2 + 8} A ${BASE_R} ${DOME_H} 0 0 1 ${size / 2 + BASE_R} ${height / 2 + 8}`}
                stroke="rgba(17,17,17,0.64)"
                strokeWidth="1.12"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// ─── Animation 5: Knowledge Graph Mesh ─────────────────────────────────────
// Cluster of nodes with weighted edges, slow ambient pulse.
type KnowledgeNode = { id: string; x: number; y: number; r: number; weight: 'hi' | 'md' | 'lo' };
type KnowledgeEdge = { id: string; from: string; to: string; weight: 'hi' | 'md' | 'lo' };

const KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: 'a', x: 70, y: 70, r: 6, weight: 'lo' },
  { id: 'b', x: 130, y: 100, r: 10, weight: 'md' },
  { id: 'c', x: 200, y: 60, r: 14, weight: 'hi' },
  { id: 'd', x: 260, y: 110, r: 8, weight: 'md' },
  { id: 'e', x: 320, y: 70, r: 10, weight: 'md' },
  { id: 'f', x: 380, y: 110, r: 6, weight: 'lo' },
  { id: 'g', x: 60, y: 170, r: 8, weight: 'md' },
  { id: 'h', x: 140, y: 200, r: 18, weight: 'hi' },
  { id: 'i', x: 220, y: 170, r: 8, weight: 'md' },
  { id: 'j', x: 290, y: 210, r: 6, weight: 'lo' },
  { id: 'k', x: 360, y: 180, r: 14, weight: 'hi' },
  { id: 'l', x: 100, y: 280, r: 6, weight: 'lo' },
  { id: 'm', x: 180, y: 310, r: 10, weight: 'md' },
  { id: 'n', x: 260, y: 280, r: 8, weight: 'md' },
  { id: 'o', x: 330, y: 320, r: 12, weight: 'hi' },
  { id: 'p', x: 400, y: 270, r: 6, weight: 'lo' },
];

const KNOWLEDGE_EDGES: KnowledgeEdge[] = [
  { id: 'ab', from: 'a', to: 'b', weight: 'lo' },
  { id: 'bc', from: 'b', to: 'c', weight: 'md' },
  { id: 'cd', from: 'c', to: 'd', weight: 'hi' },
  { id: 'de', from: 'd', to: 'e', weight: 'md' },
  { id: 'ef', from: 'e', to: 'f', weight: 'lo' },
  { id: 'bg', from: 'b', to: 'g', weight: 'md' },
  { id: 'ch', from: 'c', to: 'h', weight: 'hi' },
  { id: 'di', from: 'd', to: 'i', weight: 'md' },
  { id: 'ek', from: 'e', to: 'k', weight: 'hi' },
  { id: 'gh', from: 'g', to: 'h', weight: 'md' },
  { id: 'hi', from: 'h', to: 'i', weight: 'md' },
  { id: 'ij', from: 'i', to: 'j', weight: 'lo' },
  { id: 'jk', from: 'j', to: 'k', weight: 'md' },
  { id: 'hm', from: 'h', to: 'm', weight: 'hi' },
  { id: 'in', from: 'i', to: 'n', weight: 'md' },
  { id: 'ko', from: 'k', to: 'o', weight: 'hi' },
  { id: 'lm', from: 'l', to: 'm', weight: 'lo' },
  { id: 'mn', from: 'm', to: 'n', weight: 'md' },
  { id: 'no', from: 'n', to: 'o', weight: 'md' },
  { id: 'op', from: 'o', to: 'p', weight: 'lo' },
  { id: 'cf', from: 'c', to: 'k', weight: 'hi' },
  { id: 'hk', from: 'h', to: 'k', weight: 'md' },
];

function KnowledgeGraphMesh({ progress, variant }: { progress: MotionValue<number>; variant: string }) {
  const shouldReduceMotion = useReducedMotion();
  const shellOpacity = useTransform(progress, [0, 0.12, 0.86, 1], [0, 1, 1, 0.7]);
  const edgeReveal = useTransform(progress, [0.1, 0.5], [0, 1]);
  const nodeReveal = useTransform(progress, [0.18, 0.62], [0, 1]);
  const labelReveal = useTransform(progress, [0.3, 0.7], [0, 1]);

  const nodeMap = useMemo(() => new Map(KNOWLEDGE_NODES.map((n) => [n.id, n])), []);
  const isTools = variant === 'tools';
  const layerKey = variant === 'knowledge-b' ? '01' : isTools ? '04' : '03';
  const title =
    variant === 'knowledge-b' ? 'CONTEXT × COST × PRIVACY'
    : isTools ? 'TOOL MESH / RELATION MAP'
    : 'KNOWLEDGE GRAPH / RELATION MAP';

  return (
    <motion.svg
      className={isTools ? 'h-[280px] w-full overflow-visible md:h-[340px]' : 'h-[480px] w-full overflow-visible md:h-[560px]'}
      viewBox={isTools ? '40 35 460 310' : '0 0 620 420'}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      style={{ opacity: isTools ? 1 : shellOpacity }}
    >
      {/* Edges */}
      <motion.g style={{ opacity: isTools ? 1 : edgeReveal, transform: isTools ? 'translate(40px, -30px)' : 'translate(40px, 30px)' }}>
        {KNOWLEDGE_EDGES.map((edge, index) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          return <KnowledgeEdgeLine key={edge.id} from={from} to={to} weight={edge.weight} index={index} progress={progress} />;
        })}
      </motion.g>

      {/* Nodes */}
      <motion.g style={{ opacity: isTools ? 1 : nodeReveal, transform: isTools ? 'translate(40px, -30px)' : 'translate(40px, 30px)' }}>
        {KNOWLEDGE_NODES.map((node, index) => (
          <KnowledgeNodeCircle key={node.id} node={node} index={index} progress={progress} reduceMotion={Boolean(shouldReduceMotion)} />
        ))}
      </motion.g>

    </motion.svg>
  );
}

function KnowledgeEdgeLine({
  from,
  to,
  weight,
  index,
  progress,
}: {
  from: KnowledgeNode;
  to: KnowledgeNode;
  weight: 'hi' | 'md' | 'lo';
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.14 + (index % 12) * 0.012;
  const end = start + 0.22;
  const pathLength = useTransform(progress, [start, end], [0, 1]);
  const baseOpacity = weight === 'hi' ? 0.72 : weight === 'md' ? 0.5 : 0.32;
  const opacity = useTransform(progress, [start, end, 0.92], [0, baseOpacity, baseOpacity * 0.85]);
  const sw = weight === 'hi' ? 0.95 : weight === 'md' ? 0.7 : 0.55;
  return (
    <motion.line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="rgba(17,17,17,0.78)"
      strokeWidth={sw}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      style={{ pathLength, opacity }}
    />
  );
}

function KnowledgeNodeCircle({
  node,
  index,
  progress,
  reduceMotion,
}: {
  node: KnowledgeNode;
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const opacity = useTransform(progress, [0.2 + (index % 10) * 0.012, 0.62, 0.92], [0, 1, 0.92]);
  return (
    <motion.g style={{ opacity }}>
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={node.r}
        stroke="rgba(17,17,17,0.86)"
        strokeWidth="1"
        fill="rgba(245,241,232,0.92)"
        vectorEffect="non-scaling-stroke"
        animate={reduceMotion ? undefined : { r: [node.r, node.r * 1.08, node.r] }}
        transition={{ duration: 5 + (index % 4), repeat: Infinity, ease: 'easeInOut', delay: (index % 9) * 0.4 }}
      />
      {node.weight === 'hi' && (
        <circle cx={node.x} cy={node.y} r={node.r * 0.4} fill="rgba(17,17,17,0.86)" />
      )}
    </motion.g>
  );
}

// ─── Animation 6: Path System Composite (refs 6+7+8 with finance pointers) ─
// Combines: data structure layers (curves crossing layers), abstract node form, path/flow.
// Pointers carry finance values (ARR, MRR, etc.) per user spec.
type PathLayerKey = 'TOP' | 'MID' | 'LOW' | 'BASE';
const PATH_LAYER_Y: Record<PathLayerKey, number> = { TOP: 80, MID: 140, LOW: 200, BASE: 260 };

const PATH_CURVES: Array<{ id: string; from: [number, number]; ctrl1: [number, number]; ctrl2: [number, number]; to: [number, number]; weight: 'hi' | 'md' | 'lo' }> = [
  { id: 'c1', from: [60, 80], ctrl1: [120, 60], ctrl2: [180, 280], to: [240, 260], weight: 'hi' },
  { id: 'c2', from: [100, 80], ctrl1: [220, 220], ctrl2: [280, 60], to: [340, 140], weight: 'md' },
  { id: 'c3', from: [160, 80], ctrl1: [200, 260], ctrl2: [300, 180], to: [380, 80], weight: 'md' },
  { id: 'c4', from: [80, 140], ctrl1: [160, 240], ctrl2: [260, 100], to: [320, 200], weight: 'lo' },
  { id: 'c5', from: [40, 200], ctrl1: [180, 160], ctrl2: [260, 280], to: [380, 200], weight: 'md' },
  { id: 'c6', from: [120, 260], ctrl1: [220, 180], ctrl2: [300, 240], to: [400, 260], weight: 'hi' },
];

const PATH_NODES_ABSTRACT: Array<{ id: string; x: number; y: number; label?: string }> = [
  { id: 'na', x: 70, y: 80, label: 'NODE_A' },
  { id: 'nb', x: 160, y: 140, label: 'NODE_B' },
  { id: 'nc', x: 240, y: 200, label: 'NODE_C' },
  { id: 'nd', x: 320, y: 260, label: 'NODE_D' },
];

const FINANCE_POINTERS: Array<{ id: string; label: string; value: string; side: 'left' | 'right'; y: number; guideX: number; guideY: number }> = [
  { id: 'arr', label: 'ARR', value: '$284K', side: 'left', y: 60, guideX: 60, guideY: 80 },
  { id: 'mrr', label: 'MRR', value: '$23.6K', side: 'left', y: 110, guideX: 120, guideY: 100 },
  { id: 'cac', label: 'CAC', value: '$184', side: 'left', y: 160, guideX: 80, guideY: 180 },
  { id: 'ltv', label: 'LTV', value: '$2.4K', side: 'left', y: 220, guideX: 40, guideY: 220 },
  { id: 'churn', label: 'CHURN', value: '2.1%', side: 'right', y: 60, guideX: 380, guideY: 80 },
  { id: 'gross', label: 'GROSS', value: '78%', side: 'right', y: 110, guideX: 360, guideY: 140 },
  { id: 'runway', label: 'RUNWAY', value: '14 mo', side: 'right', y: 160, guideX: 400, guideY: 200 },
  { id: 'burn', label: 'BURN', value: '$18K/mo', side: 'right', y: 220, guideX: 400, guideY: 260 },
];

function PathSystemComposite({ progress, scrollDriven = false }: { progress: MotionValue<number>; scrollDriven?: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const shellOpacity = useTransform(progress, [0, 0.12, 0.86, 1], [0, 1, 1, 0.7]);
  const layerReveal = useTransform(progress, [0.06, 0.28], [0, 1]);
  const curveReveal = useTransform(progress, [0.14, 0.5], [0, 1]);
  const nodeReveal = useTransform(progress, [0.24, 0.58], [0, 1]);
  const pointerReveal = useTransform(progress, [0.36, 0.74], [0, 1]);
  // When scrollDriven, the inner content translates downward as the user scrolls
  // through this section — creates a "the diagram moves with you" feeling.
  const scrollTranslateY = useTransform(progress, [0, 1], scrollDriven && !shouldReduceMotion ? [-60, 180] : [0, 0]);

  return (
    <motion.svg
      className={scrollDriven ? 'h-[640px] w-full overflow-hidden md:h-[820px]' : 'h-[520px] w-full overflow-visible md:h-[620px]'}
      viewBox="0 0 560 400"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      style={{ opacity: shellOpacity }}
    >
      {/* Outer wrapper — when scrollDriven, translates downward as the user scrolls */}
      <motion.g style={{ y: scrollTranslateY }}>
        {/* Layer guides (dashed lines only, no labels) */}
        <motion.g style={{ opacity: layerReveal, transform: 'translate(80px, 70px)' }}>
          {(['TOP', 'MID', 'LOW', 'BASE'] as PathLayerKey[]).map((key) => {
            const y = PATH_LAYER_Y[key];
            return (
              <g key={key}>
                <line x1={-20} y1={y} x2={420} y2={y} stroke="rgba(17,17,17,0.22)" strokeDasharray="4 8" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
        </motion.g>

        {/* Cross-layer curves (ref #6 data structure) */}
        <motion.g style={{ opacity: curveReveal, transform: 'translate(80px, 70px)' }}>
          {PATH_CURVES.map((c, i) => (
            <PathCurve key={c.id} curve={c} index={i} progress={progress} reduceMotion={Boolean(shouldReduceMotion)} />
          ))}
        </motion.g>

        {/* Abstract nodes (ref #7) — diamonds + small ticks */}
        <motion.g style={{ opacity: nodeReveal, transform: 'translate(80px, 70px)' }}>
          {PATH_NODES_ABSTRACT.map((n, i) => (
            <g key={n.id}>
              <motion.polygon
                points={`${n.x},${n.y - 5} ${n.x + 5},${n.y} ${n.x},${n.y + 5} ${n.x - 5},${n.y}`}
                fill="rgba(245,241,232,0.96)"
                stroke="rgba(17,17,17,0.86)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 26 + i * 2, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: 'fill-box' }}
              />
            </g>
          ))}
        </motion.g>

        {/* Finance value pointers — hidden in scrollDriven mode (no finance metaphor in knowledge section) */}
        {!scrollDriven && (
          <motion.g style={{ opacity: pointerReveal }}>
            {FINANCE_POINTERS.map((p, i) => (
              <FinancePointer key={p.id} pointer={p} index={i} />
            ))}
          </motion.g>
        )}
      </motion.g>
    </motion.svg>
  );
}

function PathCurve({
  curve,
  index,
  progress,
  reduceMotion,
}: {
  curve: { id: string; from: [number, number]; ctrl1: [number, number]; ctrl2: [number, number]; to: [number, number]; weight: 'hi' | 'md' | 'lo' };
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const start = 0.16 + (index % 8) * 0.018;
  const end = start + 0.26;
  const pathLength = useTransform(progress, [start, end], [0, 1]);
  const baseOpacity = curve.weight === 'hi' ? 0.78 : curve.weight === 'md' ? 0.54 : 0.34;
  const opacity = useTransform(progress, [start, end, 0.92], [0, baseOpacity, baseOpacity * 0.86]);
  const sw = curve.weight === 'hi' ? 1.05 : curve.weight === 'md' ? 0.78 : 0.6;

  return (
    <motion.path
      d={`M ${curve.from[0]} ${curve.from[1]} C ${curve.ctrl1[0]} ${curve.ctrl1[1]}, ${curve.ctrl2[0]} ${curve.ctrl2[1]}, ${curve.to[0]} ${curve.to[1]}`}
      stroke="rgba(17,17,17,0.78)"
      strokeWidth={sw}
      fill="none"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      style={{ pathLength, opacity }}
    />
  );
}

function FinancePointer({ pointer, index }: { pointer: typeof FINANCE_POINTERS[number]; index: number }) {
  const isLeft = pointer.side === 'left';
  const labelX = isLeft ? 32 : 528;
  const labelY = pointer.y + 70;
  const guideStartX = isLeft ? labelX + 60 : labelX - 60;
  const anchor = isLeft ? 'start' : 'end';
  // Apply same group translate(80,70) so guideY/X match curve coords
  const targetX = pointer.guideX + 80;
  const targetY = pointer.guideY + 70;

  return (
    <g>
      <line
        x1={guideStartX}
        y1={labelY - 4}
        x2={targetX}
        y2={targetY}
        stroke="rgba(17,17,17,0.3)"
        strokeDasharray="3 5"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={targetX} cy={targetY} r={2} fill="rgba(17,17,17,0.82)" />
      <text x={labelX} y={labelY - 4} textAnchor={anchor} className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, fill: 'rgba(17,17,17,0.62)' }}>
        {pointer.label}
      </text>
      <text x={labelX} y={labelY + 10} textAnchor={anchor} className="type-micro" style={{ ...TECH_LABEL_STYLE, fill: 'var(--color-ink)', fontWeight: 700 }}>
        {pointer.value}
      </text>
    </g>
  );
}

function LineStory({
  variant,
  progress,
}: {
  variant: string;
  progress: MotionValue<number>;
}) {
  const lines = useMemo(() => makeStoryLines(variant), [variant]);
  const opacity = useTransform(progress, [0, 0.14, 0.86, 1], [0, 0.74, 0.74, 0]);
  const x = useTransform(progress, [0, 0.28, 0.74, 1], [-18, 0, 0, 22]);
  const y = useTransform(progress, [0, 0.3, 0.74, 1], [14, 0, 0, -14]);

  return (
    <motion.svg
      className="h-[340px] w-full overflow-visible"
      viewBox="0 0 520 420"
      fill="none"
      aria-hidden="true"
      style={{ opacity, x, y }}
    >
      {lines.map((line, index) => (
        <StoryLineSegment
          key={`${variant}-${index}`}
          line={line}
          index={index}
          total={lines.length}
          progress={progress}
        />
      ))}
      {(variant === 'figma-auditor' || variant === 'figma-pipeline') &&
        PIPELINE.map((_, index) => (
          <motion.circle
            key={`node-${index}`}
            cx={84 + index * 58}
            cy={210}
            r={3.2}
            fill="var(--color-ink)"
            style={{ opacity }}
          />
        ))}
    </motion.svg>
  );
}

function StoryLineSegment({
  line,
  index,
  total,
  progress,
}: {
  line: StoryLine;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = line.persistent ? 0.04 : Math.min(0.08 + (index / Math.max(1, total)) * 0.26, 0.36);
  const end = line.persistent ? 0.2 : Math.min(start + 0.3, 0.7);
  const exitStart = line.persistent ? 0.9 : Math.min(0.78 + (index / Math.max(1, total)) * 0.08, 0.9);
  const pathLength = useTransform(progress, [0, start, end, exitStart, 1], [0, 0, 1, 1, line.persistent ? 1 : 0]);
  const opacity = useTransform(progress, [0, start, end, exitStart, 1], [0, 0, line.major ? 0.72 : 0.5, line.major ? 0.72 : 0.5, line.persistent ? 0.42 : 0]);
  const x = useTransform(progress, [0, start, end, 1], [line.enterX ?? 0, line.enterX ? 0 : 0, 0, line.exitX ?? 0]);
  const y = useTransform(progress, [0, start, end, 1], [line.enterY ?? 0, line.enterY ? 0 : 0, 0, line.exitY ?? 0]);

  return (
    <motion.line
      x1={line.x1}
      y1={line.y1}
      x2={line.x2}
      y2={line.y2}
      stroke="rgba(17,17,17,0.72)"
      strokeWidth={line.major ? 1.1 : 0.58}
      vectorEffect="non-scaling-stroke"
      style={{ pathLength, opacity, x, y }}
    />
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p
      className="type-micro uppercase mb-5"
      style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.66)' }}
    >
      {children}
    </p>
  );
}

function PluginGroupIntro() {
  return (
    <div className="text-center">
      <Kicker>Products I build with local AI</Kicker>
      <h2
        className="type-display-l mx-auto md:whitespace-nowrap"
        style={{
          color: 'var(--color-ink)',
          fontSize: 'clamp(34px, 3.8vw, 48px)',
          lineHeight: 1.08,
          maxWidth: 1180,
        }}
      >
        Custom plugins for a faster design flow.
      </h2>
      <p className="type-body mx-auto mt-6" style={{ maxWidth: 1160, color: 'rgba(17,17,17,0.68)' }}>
        This is where I turn local AI into practical product work. I use offline models,
        deterministic heuristics, and Figma APIs to build plugins that improve accessibility,
        naming, handoff, and the way I move from design intent to implementation.
      </p>
    </div>
  );
}

function TagRail({ tags }: { tags: readonly string[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3">
      {tags.map((tag, index) => (
        <motion.span
          key={tag}
          className="type-micro uppercase"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.75 }}
          transition={{ duration: 0.42, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...TECH_LABEL_STYLE,
            color: 'rgba(17,17,17,0.72)',
            borderTop: '1px solid rgba(17,17,17,0.28)',
            paddingTop: 8,
          }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}

function UnifiedAuditFlow() {
  const shouldReduceMotion = useReducedMotion();
  const steps = [
    {
      title: 'figma.currentPage',
      detail: 'Reads the active canvas context.',
    },
    {
      title: 'walk tree',
      detail: 'Traverses frames, groups, components, instances, and text nodes.',
    },
    {
      title: 'NodeShape adapter',
      detail: 'Normalizes Figma nodes into measurable geometry, text, and interaction metadata.',
    },
    {
      title: '6 checks parallel',
      detail: 'Runs contrast, component, target, type-size, focus-state, and focus-indicator checks together.',
      checks: FIGMA_CHECKS,
    },
    {
      title: 'Issue[ ] collect',
      detail: 'Collects findings into a structured issue model.',
    },
    {
      title: 'draw overlays',
      detail: 'Places visual annotations back on the canvas where the issue happens.',
    },
    {
      title: 'llama3.2-vision alt text',
      detail: 'Uses the local vision model through Ollama to generate alt text suggestions.',
    },
    {
      title: 'tab order review',
      detail: 'Reviews the order of elements in tab navigation so keyboard flow matches the design intent.',
    },
  ] as const;

  return (
    <div className="mt-10 border-t" style={{ borderColor: 'rgba(17,17,17,0.22)' }}>
      {steps.map((step, index) => (
        <motion.div
          key={step.title}
          className="grid gap-4 border-b py-4 sm:grid-cols-[40px_1fr]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.7 }}
          transition={{ duration: 0.48, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
          style={{ borderColor: 'rgba(17,17,17,0.22)' }}
        >
          <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.48)' }}>
            {(index + 1).toString().padStart(2, '0')}
          </p>
          <div>
            <div className="flex flex-col gap-1">
              <p className="type-meta uppercase" style={{ color: 'rgba(17,17,17,0.82)' }}>
                {step.title}
              </p>
              <p className="type-body" style={{ color: 'rgba(17,17,17,0.68)' }}>
                {step.detail}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BemPluginPhases() {
  const shouldReduceMotion = useReducedMotion();
  const layers = [
    {
      title: 'Heuristic engine — zero latency',
      detail: 'A DFS tree-walk builds a NodeSummary per layer — counting texts, buttons, images, nav items — then runs a priority cascade (screen → keyword → structure) to assign the BEM block. Runs in ~0ms, always.',
      tags: ['summarizeNode()', 'detectBlock()', 'detectModifiers()'],
    },
    {
      title: 'AI refinement via Ollama bridge',
      detail: 'Ambiguous nodes are sent to a local Express service (port 3333) with a deterministic fingerprint for LRU caching. gpt-oss:20b refines the heuristic name at temperature 0.1 — max 24 tokens. Falls back to heuristic on failure.',
      tags: ['gpt-oss:20b', 'LRU cache (TTL 30 min)', 'Express / Zod'],
    },
    {
      title: 'Plugin architecture',
      detail: 'Built with esbuild (IIFE format) for Figma sandbox compatibility. UI and plugin communicate via message-passing — hover on a result row selects the corresponding canvas node. Panel size persists across sessions via clientStorage.',
      tags: ['esbuild 0.24', 'figma.ui.postMessage', 'clientStorage'],
    },
    {
      title: 'Local-first, private by design',
      detail: 'No design data leaves the machine. Production build has allowedDomains: ["none"] — the Ollama bridge is dev-only. The heuristic layer ensures the plugin works offline with zero config, zero subscriptions.',
      tags: ['Local inference', 'Graceful degradation', 'Zero config baseline'],
    },
  ] as const;

  return (
    <div className="mt-10 border-t" style={{ borderColor: 'rgba(17,17,17,0.22)' }}>
      {layers.map((layer, index) => (
        <motion.div
          key={layer.title}
          className="grid gap-4 border-b py-5 sm:grid-cols-[40px_1fr]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.48, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{ borderColor: 'rgba(17,17,17,0.22)' }}
        >
          <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.48)' }}>
            {(index + 1).toString().padStart(2, '0')}
          </p>
          <div>
            <p className="type-meta uppercase" style={{ color: 'rgba(17,17,17,0.86)' }}>
              {layer.title}
            </p>
            <p className="type-body mt-2" style={{ color: 'rgba(17,17,17,0.68)' }}>
              {layer.detail}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {layer.tags.map((tag) => (
                <p
                  key={tag}
                  className="type-micro uppercase"
                  style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.56)' }}
                >
                  {tag}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function WcagPipelinePhases() {
  const shouldReduceMotion = useReducedMotion();
  const phases = [
    {
      title: 'Setup & MCP orchestration',
      detail: 'Playwright MCP server registered with Claude Code — Claude drives a real Chromium directly.',
      tools: ['Playwright', 'Chromium', 'axe-core'],
    },
    {
      title: 'Automated scanning',
      detail: 'axe-core injected per page; full site crawled from navbar + footer; dynamic states simulated.',
      tools: ['axe-core 90+ rules', 'navbar/footer crawl', 'dynamic-state simulation'],
    },
    {
      title: 'Manual verification',
      detail: 'DevTools a11y tree, keyboard nav, contrast inspector, and screen readers cover what automation misses.',
      tools: ['DevTools', 'NVDA / VoiceOver', 'WebAIM Contrast'],
    },
    {
      title: 'Remediation',
      detail: 'Findings grouped by WCAG criterion. Fixes implemented at the code level, regardless of platform: WordPress, HTML/CSS, frameworks, or custom builds.',
      tools: ['CODE-LEVEL REMEDIATION', 'PLATFORM-AGNOSTIC', 'ANY TECH STACK'],
    },
  ] as const;

  return (
    <div className="mt-10 border-t" style={{ borderColor: 'rgba(17,17,17,0.22)' }}>
      {phases.map((phase, index) => (
        <motion.div
          key={phase.title}
          className="grid gap-4 border-b py-5 sm:grid-cols-[40px_1fr]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.48, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{ borderColor: 'rgba(17,17,17,0.22)' }}
        >
          <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.48)' }}>
            {(index + 1).toString().padStart(2, '0')}
          </p>
          <div>
            <p className="type-meta uppercase" style={{ color: 'rgba(17,17,17,0.86)' }}>
              {phase.title}
            </p>
            <p className="type-body mt-2" style={{ color: 'rgba(17,17,17,0.68)' }}>
              {phase.detail}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {phase.tools.map((tool) => (
                <p
                  key={tool}
                  className="type-micro uppercase"
                  style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.56)' }}
                >
                  {tool}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ToolsVisualization() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 88%', 'end 12%'],
  });

  return (
    <div ref={ref} className="mt-5 mb-1 md:mt-7 md:mb-2" style={{ minHeight: '220px' }}>
      <motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]) }}>
        <KnowledgeGraphMesh progress={scrollYProgress} variant="tools" />
      </motion.div>
    </div>
  );
}

function ToolSequence() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="-mt-1 grid gap-8 text-left md:grid-cols-3">
      {TOOL_GROUPS.map((group, index) => (
        <motion.div
          key={group.title}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.55 }}
          transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="type-micro uppercase mb-4" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-ink)' }}>
            {group.title}
          </p>
          <div className="space-y-4">
            {group.items.map(([name, use]) => (
              <div key={name} className="border-t pt-4" style={{ borderColor: 'rgba(17,17,17,0.18)' }}>
                <p className="type-subhead" style={{ color: 'var(--color-ink)' }}>
                  {name}
                </p>
                <p className="type-meta mt-1" style={{ color: 'rgba(17,17,17,0.62)' }}>
                  {use}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function KnowledgeSequence({ start, end }: { start: number; end: number }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mt-10 space-y-7">
      {KNOWLEDGE.slice(start, end).map(([title, body], index) => (
        <motion.div
          key={title}
          className="grid gap-5 border-t pt-6 sm:grid-cols-[48px_1fr]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.58 }}
          transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{ borderColor: 'rgba(17,17,17,0.18)' }}
        >
          <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.5)' }}>
            {(start + index + 1).toString().padStart(2, '0')}
          </p>
          <div>
            <h3 className="type-subhead mb-3" style={{ color: 'var(--color-ink)' }}>
              {title}
            </h3>
            <p className="type-body" style={{ color: 'rgba(17,17,17,0.68)' }}>
              {body}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

type StoryLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  major?: boolean;
  enterX?: number;
  enterY?: number;
  exitX?: number;
  exitY?: number;
  persistent?: boolean;
};

function makeStoryLines(variant: string): StoryLine[] {
  const localLines =
    variant === 'ai-hero'
      ? makeStoryOpeningLines()
      : variant === 'figma-auditor'
        ? makeCanvasAuditLines()
        : variant === 'figma-pipeline'
          ? makePipelineLines()
          : variant === 'bem-namer'
            ? makeLayerNamingLines()
            : variant === 'wcag-pipeline'
              ? makeAuditChartLines()
              : variant === 'tools'
                ? makeToolColumnLines()
                : variant === 'knowledge-a' || variant === 'knowledge-b'
                  ? makeKnowledgeArchitectureLines()
                  : makeParallelLines(24);

  return [...STORY_THREAD_LINES, ...localLines];
}

function makeStoryOpeningLines(): StoryLine[] {
  const lines: StoryLine[] = [];
  for (let i = 0; i < 10; i += 1) {
    const y = 72 + i * 28;
    lines.push({ x1: 88, y1: y, x2: 426, y2: y + Math.sin(i * 0.9) * 18, enterX: i % 2 ? 34 : -34, exitX: i % 2 ? -24 : 24 });
  }
  lines.push(
    { x1: 96, y1: 84, x2: 424, y2: 318, major: true, enterX: -48, exitX: 42 },
    { x1: 424, y1: 84, x2: 96, y2: 318, major: true, enterX: 48, exitX: -42 },
    { x1: 260, y1: 52, x2: 260, y2: 354, major: true, enterY: -44, exitY: 38 },
  );
  return lines;
}

function makeCanvasAuditLines(): StoryLine[] {
  const lines: StoryLine[] = [];
  const frame = { x: 118, y: 64, w: 270, h: 292 };
  lines.push(
    { x1: frame.x, y1: frame.y, x2: frame.x + frame.w, y2: frame.y, major: true, enterX: -40, exitX: 32 },
    { x1: frame.x + frame.w, y1: frame.y, x2: frame.x + frame.w, y2: frame.y + frame.h, major: true, enterY: -36, exitY: 28 },
    { x1: frame.x + frame.w, y1: frame.y + frame.h, x2: frame.x, y2: frame.y + frame.h, major: true, enterX: 40, exitX: -32 },
    { x1: frame.x, y1: frame.y + frame.h, x2: frame.x, y2: frame.y, major: true, enterY: 36, exitY: -28 },
  );

  for (let i = 0; i < 11; i += 1) {
    const y = frame.y + 24 + i * 22;
    lines.push({ x1: frame.x - 72, y1: y, x2: frame.x + frame.w + 74, y2: y, enterX: i % 2 ? -54 : 54, exitX: i % 2 ? 38 : -38 });
  }
  for (let i = 0; i < 7; i += 1) {
    const x = frame.x + 30 + i * 34;
    lines.push({ x1: x, y1: frame.y - 28, x2: x, y2: frame.y + frame.h + 26, enterY: -48, exitY: 42 });
  }
  lines.push(
    { x1: 72, y1: 118, x2: 428, y2: 276, major: true, enterX: -64, exitX: 48 },
    { x1: 72, y1: 276, x2: 428, y2: 118, major: true, enterX: 64, exitX: -48 },
  );
  return lines;
}

function makePipelineLines(): StoryLine[] {
  const lines: StoryLine[] = [];
  const y = 210;
  lines.push({ x1: 58, y1: y, x2: 468, y2: y, major: true, enterX: -60, exitX: 50 });
  for (let i = 0; i < PIPELINE.length; i += 1) {
    const x = 84 + i * 58;
    lines.push({ x1: x, y1: y - 74, x2: x, y2: y + 74, major: i === 0 || i === PIPELINE.length - 1, enterY: -52, exitY: 40 });
    lines.push({ x1: x - 18, y1: y - 34, x2: x + 18, y2: y + 34, enterX: i % 2 ? -24 : 24, exitX: i % 2 ? 24 : -24 });
  }
  return lines;
}

function makeLayerNamingLines(): StoryLine[] {
  const lines: StoryLine[] = [];
  for (let i = 0; i < 12; i += 1) {
    const y = 68 + i * 24;
    const width = 220 + (i % 4) * 34;
    lines.push({ x1: 70, y1: y, x2: 70 + width, y2: y, major: i % 4 === 0, enterX: -44, exitX: 32 });
    lines.push({ x1: 102, y1: y + 10, x2: 420, y2: y + 10, enterX: 38, exitX: -28 });
  }
  lines.push(
    { x1: 78, y1: 82, x2: 430, y2: 322, major: true, enterX: -48, exitX: 48 },
    { x1: 430, y1: 82, x2: 78, y2: 322, major: true, enterX: 48, exitX: -48 },
  );
  return lines;
}

function makeAuditChartLines(): StoryLine[] {
  const lines: StoryLine[] = [];
  lines.push({ x1: 72, y1: 342, x2: 454, y2: 342, major: true, enterX: -42, exitX: 32 });
  lines.push({ x1: 72, y1: 78, x2: 72, y2: 342, major: true, enterY: 42, exitY: -32 });
  for (let i = 0; i < 14; i += 1) {
    const x = 94 + i * 24;
    const h = 42 + ((i * 43) % 210);
    lines.push({ x1: x, y1: 342, x2: x, y2: 342 - h, major: i % 5 === 0, enterY: 74, exitY: -34 });
  }
  for (let i = 0; i < 5; i += 1) {
    const y = 120 + i * 44;
    lines.push({ x1: 60, y1: y, x2: 470, y2: y, enterX: i % 2 ? 42 : -42, exitX: i % 2 ? -28 : 28 });
  }
  return lines;
}

function makeToolColumnLines(): StoryLine[] {
  const lines: StoryLine[] = [];
  [120, 260, 400].forEach((x, column) => {
    lines.push({ x1: x, y1: 52, x2: x, y2: 360, major: true, enterY: -54, exitY: 42 });
    for (let i = 0; i < 6; i += 1) {
      const y = 72 + i * 48;
      lines.push({ x1: x - 58, y1: y, x2: x + 58, y2: y + (column - 1) * 10, enterX: column === 1 ? 0 : column === 0 ? -34 : 34, exitX: column === 1 ? 0 : column === 0 ? 28 : -28 });
    }
  });
  lines.push({ x1: 62, y1: 208, x2: 458, y2: 208, major: true, enterX: -46, exitX: 40 });
  return lines;
}

function makeKnowledgeArchitectureLines(): StoryLine[] {
  const lines: StoryLine[] = [];
  const nodes = [
    [104, 92],
    [244, 72],
    [392, 132],
    [150, 238],
    [310, 222],
    [428, 318],
  ];
  nodes.forEach(([x, y], i) => {
    lines.push({ x1: x - 28, y1: y, x2: x + 28, y2: y, major: true, enterX: i % 2 ? 32 : -32, exitX: i % 2 ? -24 : 24 });
    lines.push({ x1: x, y1: y - 28, x2: x, y2: y + 28, major: true, enterY: i % 2 ? -32 : 32, exitY: i % 2 ? 24 : -24 });
    if (i > 0) {
      const [px, py] = nodes[i - 1];
      lines.push({ x1: px, y1: py, x2: x, y2: y, enterX: i % 2 ? -28 : 28, exitX: i % 2 ? 24 : -24 });
    }
  });
  lines.push({ x1: 80, y1: 360, x2: 470, y2: 48, enterX: -52, exitX: 42 });
  return lines;
}

function makeStoryBuildingLines(): StoryLine[] {
  const lines: StoryLine[] = [];
  const floors = [
    [72, 120, 368],
    [124, 88, 432],
    [176, 112, 402],
    [228, 76, 454],
    [280, 134, 356],
  ] as const;

  floors.forEach(([y, x1, x2], index) => {
    lines.push({ x1, y1: y, x2, y2: y, major: true, enterX: index % 2 ? 46 : -46, exitX: index % 2 ? -38 : 38 });
    lines.push({ x1: x1 + 22, y1: y + 18, x2: x2 - 22, y2: y + 18, enterX: index % 2 ? -32 : 32, exitX: index % 2 ? 28 : -28 });
    if (index < floors.length - 1) {
      const [nextY] = floors[index + 1];
      lines.push({ x1: x1 + 38, y1: y, x2: x1 + 72, y2: nextY, enterY: -36, exitY: 32 });
      lines.push({ x1: x2 - 38, y1: y, x2: x2 - 86, y2: nextY, enterY: 36, exitY: -32 });
    }
  });

  for (let i = 0; i < 13; i += 1) {
    const x = 130 + i * 20;
    lines.push({ x1: x, y1: 110, x2: x + 34, y2: 310, enterY: -42, exitY: 34 });
  }

  return lines;
}

function StraightLineField({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();
  const horizontalLines = useMemo(() => makeParallelLines(44), []);
  const verticalLines = useMemo(() => makeVerticalLines(38), []);
  const buildingLines = useMemo(() => makeBuildingLines(), []);
  const chartLines = useMemo(() => makeChartLines(34), []);

  const pathLengthAnimated = useTransform(progress, [0, 0.18, 0.34, 0.58, 0.78, 1], [0.12, 0.88, 0.38, 1, 0.52, 0.92]);
  const lineShiftXAnimated = useTransform(progress, [0, 0.22, 0.48, 0.7, 1], ['14vw', '-18vw', '10vw', '-12vw', '8vw']);
  const lineShiftYAnimated = useTransform(progress, [0, 0.28, 0.55, 0.82, 1], ['0vh', '8vh', '-6vh', '5vh', '-2vh']);
  const rotateAnimated = useTransform(progress, [0, 0.32, 0.62, 1], [-8, 0, 12, -4]);
  const scaleAnimated = useTransform(progress, [0, 0.26, 0.54, 0.8, 1], [0.82, 1.08, 0.92, 1.18, 0.96]);

  const hOpacityAnimated = useTransform(progress, [0, 0.12, 0.28, 0.42], [0.18, 0.86, 0.34, 0.08]);
  const vOpacityAnimated = useTransform(progress, [0.2, 0.36, 0.52, 0.66], [0, 0.76, 0.42, 0.05]);
  const chartOpacityAnimated = useTransform(progress, [0.46, 0.62, 0.77, 0.9], [0, 0.78, 0.36, 0]);
  const buildingOpacityAnimated = useTransform(progress, [0.68, 0.82, 1], [0, 0.86, 0.58]);
  const fieldOpacityAnimated = useTransform(progress, [0, 0.085, 0.12, 0.96, 1], [0, 0, 1, 1, 0.36]);

  const dotXAnimated = useTransform(progress, [0, 0.18, 0.34, 0.5, 0.68, 0.84, 1], ['72vw', '28vw', '68vw', '36vw', '58vw', '42vw', '50vw']);
  const dotYAnimated = useTransform(progress, [0, 0.18, 0.34, 0.5, 0.68, 0.84, 1], ['34vh', '48vh', '58vh', '38vh', '66vh', '44vh', '54vh']);
  const dotOpacityAnimated = useTransform(progress, [0, 0.05, 0.96, 1], [0, 1, 1, 0]);

  const pathLength = shouldReduceMotion ? 1 : pathLengthAnimated;
  const lineShiftX = shouldReduceMotion ? '0vw' : lineShiftXAnimated;
  const lineShiftY = shouldReduceMotion ? '0vh' : lineShiftYAnimated;
  const rotate = shouldReduceMotion ? 0 : rotateAnimated;
  const scale = shouldReduceMotion ? 1 : scaleAnimated;
  const hOpacity = shouldReduceMotion ? 0.24 : hOpacityAnimated;
  const vOpacity = shouldReduceMotion ? 0.18 : vOpacityAnimated;
  const chartOpacity = shouldReduceMotion ? 0.18 : chartOpacityAnimated;
  const buildingOpacity = shouldReduceMotion ? 0.2 : buildingOpacityAnimated;
  const fieldOpacity = shouldReduceMotion ? 0.16 : fieldOpacityAnimated;
  const dotX = shouldReduceMotion ? '50vw' : dotXAnimated;
  const dotY = shouldReduceMotion ? '50vh' : dotYAnimated;
  const dotOpacity = shouldReduceMotion ? 0.42 : dotOpacityAnimated;

  return (
    <motion.div className="absolute inset-0" aria-hidden="true" style={{ opacity: fieldOpacity }}>
      <motion.svg
        className="absolute inset-0"
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{
          x: lineShiftX,
          y: lineShiftY,
          rotate,
          scale,
          transformOrigin: '50% 50%',
        }}
      >
        <motion.g opacity={hOpacity}>
          {horizontalLines.map((line, index) => (
            <motion.line
              key={`h-${index}`}
              {...line}
              stroke="rgba(17,17,17,0.9)"
              strokeWidth={index % 8 === 0 ? 1 : 0.58}
              vectorEffect="non-scaling-stroke"
              style={{ pathLength }}
            />
          ))}
        </motion.g>

        <motion.g opacity={vOpacity} transform="translate(210 70) rotate(-6)">
          {verticalLines.map((line, index) => (
            <motion.line
              key={`v-${index}`}
              {...line}
              stroke="rgba(17,17,17,0.86)"
              strokeWidth={index % 7 === 0 ? 1 : 0.55}
              vectorEffect="non-scaling-stroke"
              style={{ pathLength }}
            />
          ))}
        </motion.g>

        <motion.g opacity={chartOpacity} transform="translate(130 500)">
          {chartLines.map((line, index) => (
            <motion.line
              key={`c-${index}`}
              {...line}
              stroke="rgba(17,17,17,0.82)"
              strokeWidth={index % 5 === 0 ? 1 : 0.54}
              vectorEffect="non-scaling-stroke"
              style={{ pathLength }}
            />
          ))}
        </motion.g>

        <motion.g opacity={buildingOpacity} transform="translate(650 150)">
          {buildingLines.map((line, index) => (
            <motion.line
              key={`b-${index}`}
              {...line}
              stroke="rgba(17,17,17,0.82)"
              strokeWidth={index % 6 === 0 ? 1 : 0.58}
              vectorEffect="non-scaling-stroke"
              style={{ pathLength }}
            />
          ))}
        </motion.g>
      </motion.svg>

      <motion.div
        className="absolute h-3 w-3 rounded-full"
        style={{
          left: dotX,
          top: dotY,
          x: '-50%',
          y: '-50%',
          opacity: dotOpacity,
          backgroundColor: 'var(--color-ink)',
          boxShadow: '0 0 24px rgba(17,17,17,0.65)',
        }}
      />
    </motion.div>
  );
}

function makeParallelLines(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const y = 90 + index * 13;
    const offset = Math.sin(index * 0.7) * 52;
    return {
      x1: 120 + offset,
      y1: y,
      x2: 970 + offset,
      y2: y + Math.sin(index * 0.24) * 18,
    };
  });
}

function makeVerticalLines(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const x = index * 12;
    const height = 280 + (index % 9) * 24;
    const lean = Math.sin(index * 0.45) * 70;
    return {
      x1: x,
      y1: 0,
      x2: x + lean,
      y2: height,
    };
  });
}

function makeChartLines(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const x = index * 26;
    const h = 42 + ((index * 37) % 240);
    return {
      x1: x,
      y1: 0,
      x2: x,
      y2: -h,
    };
  });
}

function makeBuildingLines() {
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const floors = [0, 80, 160, 240, 320];
  const widths = [430, 510, 460, 560, 390];
  floors.forEach((y, i) => {
    const w = widths[i];
    const x = -w / 2;
    lines.push({ x1: x, y1: y, x2: x + w, y2: y });
    lines.push({ x1: x + 20, y1: y + 18, x2: x + w - 20, y2: y + 18 });
    if (i < floors.length - 1) {
      lines.push({ x1: x + 40, y1: y, x2: x + 80, y2: floors[i + 1] });
      lines.push({ x1: x + w - 40, y1: y, x2: x + w - 90, y2: floors[i + 1] });
    }
  });
  for (let i = 0; i < 18; i += 1) {
    const x = -220 + i * 26;
    lines.push({ x1: x, y1: 30, x2: x + 34, y2: 310 });
  }
  return lines;
}
