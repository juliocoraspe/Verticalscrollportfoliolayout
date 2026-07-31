import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────
// AI PRACTICE — one pinned stage, eight scenes, one traveler.
//
// Choreography rule: nothing on screen exists unless the die causes it or
// interacts with it. The base stage is a black void; each light scene is a
// "room" that shutters open from the point where the die enters and closes
// toward where it leaves — so every transition passes through the void and
// the travel between spaces is staged, not implied.
//
// The die is part of the content: it draws the hero's ground line as it
// rolls, shoves the title into place when it lands, rides down the text's
// margin while it prints, then stamps each list row as it hops down the
// index column. In the manifesto it stands ON the giant sliding line and
// spins from the belt movement under its feet.
// ─────────────────────────────────────────────────────────────────────────

const TECH_LABEL_STYLE: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum"',
};

const DARK = '#111111';
const LIGHT = '#fcfbfa';
const DIE_SIZE = 26;

// Tracks viewport width so the stairs staircase (below) can scale its reach
// down on narrower windows — without this, the fixed-pixel geometry runs the
// descending giant die's landing point, and its 45° rotation reach, off the
// right edge, where the stage's overflow-hidden clips it. That clipping is
// what reads as the leading corner flickering/vanishing mid-tumble.
function useViewportWidth() {
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return vw;
}

// Scales the whole stairs staircase (die size + its horizontal run) down
// together below the reference width, so the last tread's die — plus the
// extra diagonal reach it sweeps through while tipping over — always stays
// inboard of the viewport with margin. 1 at/above REF_VW; floors at MIN_K so
// the die never shrinks into illegibility on very narrow windows.
const STAIRS_REF_VW = 1440;
const STAIRS_MIN_K = 0.62;
function stairsK(vw: number) {
  return Math.max(STAIRS_MIN_K, Math.min(1, vw / STAIRS_REF_VW));
}

function auditorDiePoint(headRect: DOMRectReadOnly, viewportH: number) {
  const rideH = Math.min(headRect.height, viewportH * 0.5) - 20;
  return {
    x: headRect.left - 18,
    y: headRect.top + 10 + rideH,
  };
}

function stairsAnchorOffset(itemsRect: DOMRectReadOnly, auditorHeadRect: DOMRectReadOnly | null, k: number, half: number) {
  if (!auditorHeadRect) return { x: 0, y: 0 };
  const die = auditorDiePoint(auditorHeadRect, window.innerHeight);
  const defaultFirstX = itemsRect.left + itemsRect.width + STAIRS.landGap * k + half;
  const defaultFirstY = itemsRect.top - half - 4;
  return {
    x: die.x - defaultFirstX,
    y: die.y + Math.max(18, half * 0.22) + STAIRS.rowShiftY - defaultFirstY,
  };
}

// ─── Content ──────────────────────────────────────────────────────────────

type SceneItem = { title: string; detail: string; tags?: readonly string[] };
type ToolGroup = { title: string; items: readonly (readonly [string, string])[] };

// Per-scene die persona:
//  roll     — tumbles along margins and stamps the rows (the classic)
//  fall     — playful gravity: drops level to level with NO rotation at all,
//             heavier squash on landing
//  shoot    — parks at a post and fires small dice that BECOME the row bullets
//  stairs   — strains and breathes wildly until it BREAKS its bindings and
//             grows huge, lands on top of the title, then tips down the
//             diagonal content staircase one quarter-turn per step — each
//             landing reveals the next step's content
//  breathe  — lands, then sits still breathing while the text animates itself
//  multiply — clones itself until the screen is covered, then the clones
//             withdraw and the content stands where they were
//  rest     — travels to its final resting point and breathes there
type DieMode = 'roll' | 'fall' | 'shoot' | 'stairs' | 'breathe' | 'multiply' | 'rest';

type Scene = {
  id: string;
  theme: 'dark' | 'light';
  /** where the die enters this scene — shutter origin + landing point (viewport %) */
  door: { cx: number; cy: number };
  /** how the die behaves in this scene */
  die: DieMode;
  /** how many stamp-hops the die makes on the items block */
  hops?: number;
  /** content rockets straight up out of the viewport instead of the gentle
   *  default exit — sells the illusion that the fall keeps going */
  flyExit?: boolean;
  kicker?: string;
  title?: string;
  body?: string;
  body2?: string;
  tags?: readonly string[];
  items?: readonly SceneItem[];
  groups?: readonly ToolGroup[];
  knowledge?: readonly (readonly [string, string])[];
  headPos?: CSSProperties;
  itemsPos?: CSSProperties;
};

const HERO_TAGS = [
  'WCAG audits automated',
  'Custom Figma plugins',
  'Local AI — no API costs',
  'Full design-to-code cycle',
  'Agentic MCP pipelines',
  'Multimodal vision models',
] as const;

const MANIFESTO_A = "I DON'T TREAT AI AS A TREND LAYER";
const MANIFESTO_B = 'I BUILD WITH IT — LOCAL MODELS, CUSTOM WORKFLOWS, AUTOMATION THAT CUTS COST AND PROTECTS CONTEXT';

const SCENES: readonly Scene[] = [
  {
    id: 'hero',
    theme: 'dark',
    door: { cx: 10, cy: 38.5 },
    die: 'roll',
    kicker: 'AI Practice · 00',
    title: 'I build the systems that make AI useful.',
    body:
      'What follows is the toolkit I have built — two Figma plugins I wrote myself, a pipeline I assembled to audit live websites, the stack I deliberately chose, and what I have learned running it day to day.',
    tags: HERO_TAGS,
    // raised so the whole hero cluster (line at 40% + this block) sits in
    // the same vertical band where act 2's giant line enters (top 32%)
    headPos: { left: '8%', top: '44%', maxWidth: 680 },
  },
  {
    id: 'manifesto',
    theme: 'dark',
    door: { cx: 20, cy: 29 },
    // the die is offstage here — it leapt away in reverse at the end of the
    // hero and re-enters, squared up, at the next scene's door
    die: 'breathe',
  },
  {
    id: 'bem',
    theme: 'light',
    door: { cx: 10, cy: 16 },
    // gravity-play: falls level to level without spinning, then the whole
    // column rockets up out of frame so the fall reads as bottomless
    die: 'fall',
    flyExit: true,
    hops: 3,
    kicker: 'Plugin I built · 01 of 02',
    title: 'Figma BEM Layer Name',
    body:
      'It renames Figma layers with pure BEM so component structure stays legible and handoff predictable. A deterministic heuristics engine runs first at zero latency; a local LLM bridge refines ambiguous names with semantic context.',
    body2:
      'TypeScript, Figma Plugin API, esbuild, and a local Express service that proxies to Ollama — fully offline, no cloud, no subscriptions.',
    tags: ['Figma Plugin API', 'Ollama (local)', 'gpt-oss:20b', 'BEM Methodology', 'TypeScript', 'Localhost Bridge'],
    items: [
      {
        title: 'Heuristic engine — zero latency',
        detail:
          'A DFS tree-walk builds a NodeSummary per layer, then a priority cascade (screen → keyword → structure) assigns the BEM block. Runs in ~0ms.',
        tags: ['summarizeNode()', 'detectBlock()', 'detectModifiers()'],
      },
      {
        title: 'AI refinement via Ollama bridge',
        detail:
          'Ambiguous nodes go to a local Express service (port 3333) with a fingerprint for LRU caching. gpt-oss:20b refines at temperature 0.1; falls back to heuristic on failure.',
        tags: ['gpt-oss:20b', 'LRU cache (TTL 30 min)', 'Express / Zod'],
      },
      {
        title: 'Local-first, private by design',
        detail:
          'No design data leaves the machine — production build sets allowedDomains: ["none"]. The heuristic layer keeps it working offline, zero config.',
        tags: ['Local inference', 'Graceful degradation', 'Zero config baseline'],
      },
    ],
    // head + items share the SAME side (left) so the fall reads as one
    // continuous vertical column of levels, not a left/right room
    headPos: { left: '7%', top: '10%', maxWidth: 560 },
    itemsPos: { left: '7%', top: '52%', maxWidth: 480 },
  },
  {
    id: 'auditor',
    theme: 'light',
    // exactly where this act's first beat wants the die (the head's left
    // margin, top) — BEM's fly-out pushes it straight there, so the scene
    // cut doesn't teleport it across the stage
    door: { cx: 50, cy: 12 },
    die: 'shoot',
    hops: 3,
    kicker: 'Plugin I built · 02 of 02',
    title: 'Figma Accessibility Auditor',
    body:
      'It checks six WCAG 2.2 AA criteria right on the Figma canvas — contrast, tap targets, focus visibility — with overlay annotations. A local llama3.2-vision model via Ollama suggests alt text and reviews tab order. No API keys, no per-token costs.',
    tags: ['TypeScript 5.x', 'React 18', 'Ollama', 'llama3.2-vision', 'Figma Plugin API', 'Vitest (28 tests)'],
    items: [
      {
        title: 'Detect',
        detail:
          'Walks the canvas tree and runs the six WCAG checks in parallel — contrast, component, tap target, type size, focus state, and focus indicator.',
      },
      {
        title: 'Annotate',
        detail:
          'Collects findings into a structured issue model and draws overlay annotations back on the canvas where each issue happens.',
      },
      {
        title: 'Suggest (AI)',
        detail:
          'A local llama3.2-vision model generates alt text and reviews tab order so keyboard flow matches the design.',
      },
    ],
    headPos: { right: '7%', top: '11%', maxWidth: 600 },
    itemsPos: { left: '7%', bottom: '9%', maxWidth: 480 },
  },
  {
    id: 'pipeline',
    theme: 'dark',
    // door = above the title, where the freed giant die takes its perch
    door: { cx: 44, cy: 10 },
    die: 'stairs',
    hops: 4,
    kicker: 'Pipeline I built · 03',
    title: 'My Automated WCAG Audit Pipeline',
    body:
      'The plugins live where designs are drawn; this lives where they already shipped. Claude Code drives a real Chromium via the Playwright MCP, injects axe-core, and runs WCAG 2.1 / 2.2 AA across every page — replacing paid auditing tools end-to-end.',
    tags: ['Claude Code', 'Playwright MCP', 'axe-core', 'NVDA / VoiceOver', 'Any framework'],
    items: [
      {
        title: 'Setup & MCP orchestration',
        detail: 'Playwright MCP server registered with Claude Code — Claude drives a real Chromium directly.',
        tags: ['Playwright', 'Chromium', 'axe-core'],
      },
      {
        title: 'Automated scanning',
        detail: 'axe-core injected per page; full site crawled from navbar + footer; dynamic states simulated.',
        tags: ['axe-core 90+ rules', 'navbar/footer crawl', 'dynamic states'],
      },
      {
        title: 'Manual verification',
        detail: 'DevTools a11y tree, keyboard nav, contrast inspector, and screen readers cover what automation misses.',
        tags: ['DevTools', 'NVDA / VoiceOver', 'WebAIM Contrast'],
      },
      {
        title: 'Remediation',
        detail:
          'Findings grouped by WCAG criterion; fixes at the code level on any stack — HTML/CSS, JS frameworks, templating, or custom builds.',
        tags: ['Code-level remediation', 'Platform-agnostic'],
      },
    ],
    // head up top; the rows below form a staircase descending to the right
    // (each row shifted +STAIRS.stepX), and the giant die walks its outer
    // edge — always beside the text, never on top of it. Head sits low
    // enough that the 5× die fits above the title, clear of the nav bar;
    // the stairs start far enough right that the die's first perch over
    // row 0 clears the head block's text entirely.
    // head kept wide/short so it stays clear ABOVE the rows; the die lands
    // far to their right (landGap) so its tall body sits beside the head,
    // never over it. Rows narrow + left so the long rules read as treads
    headPos: { left: '8%', top: '13%', maxWidth: 560 },
    itemsPos: { left: '20%', top: '48.5%', maxWidth: 400 },
  },
  {
    id: 'leverage',
    theme: 'light',
    door: { cx: 50, cy: 1.8 },
    die: 'breathe',
    hops: 3,
    kicker: 'Working with AI · 04',
    title: 'From idea to working artifact, faster.',
    body:
      "I am a UX/UI designer and a frontend developer, and AI is the layer that lets me move between those two roles without waiting on either of them. Not \"write the code for me because I don't know how,\" but execute the idea I already have in mind: prototype it, test it, explore around it, and verify whether it stands up technically before it ships.",
    body2:
      'The model lives in my terminal and my editor. It is how I shorten the gap between "what if it looked like this" and a real thing on the screen.',
    tags: ['Claude Code', 'Codex', 'VS Code', 'MCPs', 'Skills'],
    items: [
      {
        title: 'Code & Prototyping',
        detail:
          'I work the model through the terminal, CLIs, and editors like VS Code with Claude Code and Codex, not as a substitute for knowing the code. I read the architecture, I make the calls, and AI executes faster. This portfolio is built that way.',
        tags: ['Terminal · CLI', 'Claude Code', 'Codex', 'React + Vite (this site)'],
      },
      {
        title: 'Visual Exploration',
        detail:
          'When I need to test a visual idea before committing, I generate it. Small generative-art-style probes like shape systems, motion sketches, and color studies let me feel a direction out in minutes instead of hours.',
        tags: ['Generative probes', 'Motion sketches', 'Shape & color studies'],
      },
      {
        title: 'Context Engineering',
        detail:
          'Good output is less about clever prompts and more about how the context is structured: system instructions, MCP servers, skills, and choosing the right model for the job. I treat that layer as part of the design, not an afterthought.',
        tags: ['MCP servers', 'Skills & system prompts', 'Model selection', 'Anthropic MCP certified'],
      },
    ],
    headPos: { right: '8%', top: '13%', maxWidth: 620 },
    itemsPos: { right: '8%', top: '55%', maxWidth: 620 },
  },
  {
    id: 'tools',
    theme: 'dark',
    // a short step left of where the Tarzan swing drops it (low
    // center-left) — it breeds the black wave from THERE instead of
    // trekking across the whole stage first
    door: { cx: 10, cy: 80 },
    die: 'multiply',
    hops: 3,
    kicker: 'My stack · 05',
    title: 'The tools I chose to work with.',
    body:
      "The plugins and pipeline aren't the goal — they're products of a stack I keep curating, grouped by the job each tool does.",
    groups: [
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
    ],
    headPos: { left: '8%', top: '10%', maxWidth: 640 },
    itemsPos: { left: '8%', right: '8%', bottom: '8%' },
  },
  {
    id: 'knowledge',
    theme: 'light',
    // right side, on the die's path — it arrives from the previous act's
    // lower-right corner and climbs this same side to its resting point,
    // never crossing back over the stage
    door: { cx: 82, cy: 50 },
    die: 'rest',
    hops: 3,
    kicker: 'What I know · 06',
    title: 'What I have learned running it.',
    body:
      'Tools alone do not make a system. Context windows, cost, privacy, and runtime behavior shape the output — six things I have come to understand from running this stack myself.',
    knowledge: [
      [
        'Context Windows & Model Limits',
        "I work within each model's context window — when to be concise, and how to structure long sessions so they don't degrade.",
      ],
      [
        'System Prompts & Custom Modes',
        'I configure Claude with persistent instructions (CLAUDE.md) and custom slash commands — specialized modes, not just chat.',
      ],
      [
        'Local-First AI Architecture',
        'Running models locally via Ollama is a design constraint I build around: streaming, vision inference, sandbox-to-localhost bridges.',
      ],
      [
        'Agentic Pipelines with MCP',
        'With MCP I build pipelines where Claude Code drives live sites, runs a11y checks across pages, and reports back.',
      ],
      [
        'Rate Limits, Tiers & Token Economics',
        'I think in token budgets — when to run local, when to batch, when a smaller model is enough.',
      ],
      [
        'AI as a Design Systems Tool',
        'I use AI to systematize design decisions — BEM naming, canvas-level a11y, generative exploration — not to replace judgment.',
      ],
    ],
    headPos: { left: '8%', top: '9%', maxWidth: 640 },
    itemsPos: { left: '8%', right: '8%', bottom: '7%' },
  },
] as const;

const N = SCENES.length;
const W = 1 / N;
const REST_POINT = { cx: 78, cy: 20 }; // where the die settles at the end
const FINAL_DROP_X = 94; // shared x-position for the tools collapse and finale drop
const HERO_GROUND_Y = 40; // viewport %, shared by the opening line and die baseline
const HERO_DIE_PATH_Y = 38.55; // reference path %, corrected to the exact pixel baseline at runtime
const SCROLL_PROMPT_DELAY_MS = 1800;
const SCROLL_PROMPT_DISMISS_AT = 0.00001;

// ─── Mobile (≤639px) restaging ────────────────────────────────────────────
// The desktop scenes place head and items at hand-tuned viewport
// coordinates; at phone widths the head wraps taller, so each scene is
// recomposed as ONE stacked column — head on top, items directly below,
// the WHOLE scene visible inside a single viewport at once. Mobile also
// drops the decorative separators and tightens type and spacing so the
// full composition fits without any within-scene scrolling.
//
// The die keeps its FULL persona in every scene. The text column gives up
// a right-edge LANE (the die's runway), so the character never crosses a
// single word: BEM's gravity drops, the auditor's firing post and
// projectiles, the pipeline's giant tumbling down its staircase, the
// Tarzan cord slamming the leverage parts in, the multiply swarm and the
// finale's rise-and-drop all play inside that lane or across the void —
// beside the text, never over it.
const NARROW_MQ = '(max-width: 639px)';

function useNarrow() {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW_MQ).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(NARROW_MQ);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}

// The lane: die centers, measured from the RIGHT edge of the viewport.
const LANE_CENTER = 27; // normal die — spans vw-40 … vw-14
const LANE_GIANT = 34; // grown pipeline die — spans vw-66 … vw-2 at 2.4×

// The pipeline giant, phone-sized: big enough to read as a character that
// broke free, small enough that its tumble stays inside the lane. The
// descent starts once the head has printed (head and rows share the
// screen now — no slot swap), one tread per row reveal.
const MOBILE_STAIRS = { scale: 2.4, descentStart: 0.34, stepDur: 0.1, rowLead: 0.05 } as const;

// Mobile Tarzan beats (leverage): the scan strikes the die off its perch
// almost immediately, the head is slammed in early so it gets a real
// reading window, and the three rows take the remaining swings. The whole
// rig hangs on the LEFT: the cord anchors at the top-left corner, the
// content column shifts right, and the pendulum works the left rail —
// wind-ups swing out of frame and slam back in, the cord never crossing
// a single line of text.
const MOBILE_TARZAN = {
  // the die parks at the lane, right where the scan begins its sweep —
  // the edge reaches its face almost immediately
  hitLp: 0.02,
  knockDur: 0.045,
  swingStart: 0.13,
  hitTimes: [0.2, 0.42, 0.56, 0.7] as readonly number[], // head, row 1..3
  pivotX: 0.055, // cord anchor, fraction of vw — the left rail
  contactInset: 7, // die center this far right of the block's rect edge
} as const;
// Left rail reserved by the leverage content (slot offset; content keeps
// its own px-6 gutter on top of this, so glyphs start ~54px in).
const MOBILE_LEV_RAIL = 30;

// Single-column slots — ONE composition per scene: the head sits at the
// top and the items block directly below it, both visible together in a
// single viewport (the per-scene `top` clears the measured head height).
// Content keeps its own px-6 gutter; `right` reserves the die's lane so
// the type never runs under it (leverage mirrors this: its rail is on
// the LEFT for the swinging cord).
function mobileHeadPos(scene: Scene): CSSProperties {
  if (scene.die === 'rest') return { left: 0, right: 0, top: '9%' };
  if (scene.die === 'multiply') return { left: 0, right: 0, top: '8.5%' };
  if (scene.die === 'stairs') return { left: 0, right: 44, top: '8.5%' };
  if (scene.id === 'leverage') return { left: MOBILE_LEV_RAIL, right: 0, top: '8.5%' };
  return { left: 0, right: 28, top: '8.5%' };
}

function mobileItemsPos(scene: Scene): CSSProperties {
  if (scene.die === 'rest') return { left: 0, right: 0, top: '45%' };
  if (scene.die === 'multiply') return { left: 0, right: 0, top: '30%' };
  if (scene.die === 'stairs') return { left: 0, right: 46, top: '39%' };
  if (scene.id === 'leverage') return { left: MOBILE_LEV_RAIL, right: 0, top: '50%' };
  if (scene.id === 'auditor') return { left: 0, right: 28, top: '38%' };
  // bem — its head carries two body paragraphs
  return { left: 0, right: 28, top: '45%' };
}

// Mobile leverage rows print exactly on the cord's row impacts.
const MOBILE_LEV_ROW0 = MOBILE_TARZAN.hitTimes[1];
const MOBILE_LEV_ROW_GAP = MOBILE_TARZAN.hitTimes[2] - MOBILE_TARZAN.hitTimes[1];
// How far the finale conveyor keeps travelling (in vh) after the mass has
// seated, so the tail cards scroll into view on a phone screen.
const MOBILE_FINALE_CONVEYOR_VH = 45;

// ─── Shared beat timings (local scene progress 0..1) ─────────────────────
// door opens 0→0.14 · die lands 0.16 (head is shoved in) · rides the head
// margin 0.16→0.42 · leaps 0.42→0.5 · stamps rows 0.5→0.78 · walks to the
// exit door 0.78→0.86 · content exits 0.82→0.9 · door closes 0.88→1.
const BEAT = {
  doorOpen: 0.14,
  land: 0.16,
  rideEnd: 0.42,
  stampStart: 0.5,
  stampEnd: 0.78,
  exitWalk: 0.86,
  contentExitS: 0.82,
  contentExitE: 0.9,
  doorCloseS: 0.88,
} as const;

// The stairs act (pipeline): the die strains against its bindings until
// `breakAt`, when it snaps free and grows to `scale`× its size. It perches
// on the title, then tips down the content staircase — one quarter-turn
// per step, landing k revealing row k. `stepX` is each stair's horizontal
// run: it must exceed the grown die's width so every tread the die lands
// on sticks out PAST the row above — the die descends along the outer
// diagonal, beside the text, never over it.
const STAIRS = {
  breakAt: 0.12,
  descentStart: 0.28,
  stepDur: 0.115,
  scale: 6,
  // each stair's horizontal run = the die's own width (DIE_SIZE × scale), so
  // one 90° tip-over carries it exactly one tread to the right — a clean
  // box-tumbling-downstairs step where tread depth equals the cube's size
  stepX: 156,
  // the tumble fills only this fraction of a step; the rest is a dead stop
  // on the tread — a box pauses between tips, it doesn't glide continuously
  moveFrac: 0.6,
  // the die walks the staircase's FAR-right edge: it lands this far to the
  // right of each row's text, so its tall body clears the head block above
  // (horizontal separation) and each row's long rule bridges text → die
  landGap: 48,
  // visual adjustment for the four pipeline treads: the rows sit lower and
  // a touch left, while the die's initial x stays locked to its grown position.
  rowShiftX: -128,
  rowShiftY: 128,
  // Pipeline content should already be readable before the giant die hits
  // each tread; otherwise the die appears to collide with content that is
  // still materializing.
  headStart: 0.035,
  headStagger: 0.018,
  headSettleDur: 0.04,
  rowLead: 0.095,
  rowSettleDur: 0.045,
  // how far each row's rule runs past its text. Keep it short enough that
  // the giant die hits the tread edge instead of traveling through a long
  // line that keeps reaching back toward the old, farther-right layout.
  treadExt: 188,
} as const;

// The BEM → auditor transition: the content rockets off, but the die stays
// planted at its last stamp. It tilts up like a CANNON taking aim at the
// next act's landing point, holds the pose — then BOOM: two muzzle sparks
// race along the viewport's left and bottom edges while the die itself is
// launched on a ballistic arc, landing exactly where act 4 begins.
const CANNON = {
  aimS: 0.83, // starts tilting, right after the content has left
  aimE: 0.9, // fully aimed
  fireAt: 0.92, // BOOM
  tilt: 34, // barrel lean, degrees toward the target
  flashDur: 0.06, // the edge sparks' run, in scene fraction
} as const;

const AUDITOR_WAVE = {
  start: 0.84,
  end: 0.995,
} as const;

// The leverage transition: the die STAYS parked on the pipeline's last
// tread, still giant, while the light scan wipes the dark stage right→left.
// The scan physically strikes it: it shrinks on impact, is shoved leftward,
// hurls a cord up to the top-middle of the viewport, and swings on it —
// winding up far left, then SLAMMING into each content part's left edge.
// A part only exists after its hit. Beats are in local scene progress; the
// strike beat itself is computed at runtime from where the die actually sits.
// NOTE: rightHit0/rightHitGap must satisfy
//   rightHit0 = swingStart + (swingEnd - swingStart) / (hops + 1)
//   rightHitGap = (swingEnd - swingStart) / (hops + 1)
// so the content beats land exactly on the die's impact frames.
const TARZAN = {
  scanEnd: 0.24, // scan line reaches the left edge
  knockDur: 0.05, // strike → shoved-left slide
  swingStart: 0.18, // cord is up, first wind-up begins
  swingEnd: 0.74, // last impact
  rightHit0: 0.32, // first impact (the head block)
  rightHitGap: 0.14, // one full wind-up + slam per part
  // cord anchor, as a fraction of the viewport width — left of the content
  // column so the die swings UP into each part at a real angle instead of
  // tapping it at the bottom of its arc
  pivotX: 0.35,
} as const;

// The tools act (multiply): the act opens still WHITE — carried over from
// the previous room — with the die at the top-left. It reproduces BLACK
// squares: born small inside it, they fly to their grid slots and grow,
// grow, grow until they overlap and the whole stage has turned black. The
// content then prints directly ON that black (it never appears on white)
// and holds for a readable beat. Keep scrolling and the black RETRACTS:
// tile by tile toward the lower-right corner — farthest first, so the
// white is revealed from the top-left down — until the last tile shrinks
// into the corner and the die is REBORN out of it, standing there on white.
const MULT = {
  birth0: 0.08, // first black square leaves the die
  birthSpan: 0.16, // wave reaches the farthest cell
  birthDur: 0.09, // one square's flight + growth to full tile
  blackDone: 0.36, // stage fully black — the white base swaps out unseen
  dieVanish: 0.38, // the die dissolves into the black it just created
  head0: 0.4, // head prints, already on black
  rows0: 0.44, // columns print, already on black
  rowGap: 0.045,
  exitS: 0.74, // content leaves BEFORE the black starts retracting
  exitE: 0.8,
  re0: 0.82, // white base returns under the (still solid) black — unseen
  reSpan: 0.09, // retraction sweep, farthest-from-corner tiles first
  retractDur: 0.07, // one tile's shrink + slide into the corner
  rebirth: 0.96, // the die pops back out of the last tile
  corner: { cx: FINAL_DROP_X, cy: 84 }, // lower-right, aligned with the finale drop lane
} as const;

// The finale (knowledge): the whole content rises as ONE mass from below
// the frame. The die — still sitting at the bottom from the last act —
// is shoved UP ahead of it, rides to the very top of the viewport, and
// waits there until everything has seated. Then it simply lets go: an
// accelerating drop past the bottom edge, and it is never seen again.
const FINALE = {
  riseS: 0.06, // the mass starts rising from below the viewport
  riseE: 0.46, // everything seated — and the die reaches the top
  contact: 0.25, // fraction of the rise-ease at which the mass reaches it
  holdEnd: 0.58, // mobile-only: conveyor continuation starts after this scroll beat
  autoDropDelayMs: 120, // brief contact at the top before gravity takes over
  autoDropDurationMs: 760, // time-driven drop; no additional scroll required
  // falls in the empty strip RIGHT of the grid (which ends at 92vw) so the
  // drop never crosses a single line of text
  x: FINAL_DROP_X / 100,
} as const;

// ─────────────────────────────────────────────────────────────────────────

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
    <main id="main-content" className="relative" style={{ backgroundColor: LIGHT, color: DARK }}>
      <JourneyStage />
    </main>
  );
}

function JourneyStage() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  if (shouldReduceMotion) return <StaticFallback />;

  return (
    <section ref={ref} style={{ height: `${N * 160}vh`, position: 'relative' }}>
      {/* The stage itself is the black void the die travels through. */}
      <div className="sticky top-0 h-screen overflow-hidden" style={{ backgroundColor: DARK }}>
        {SCENES.map((scene, i) =>
          scene.id === 'manifesto' ? (
            <ManifestoLayer key={scene.id} p={p} i={i} />
          ) : (
            <SceneRoom key={scene.id} p={p} i={i} scene={scene} />
          ),
        )}
        <CannonFlash p={p} />
        <ScrollPrompt p={p} />
        <RollingDie p={p} />
      </div>
    </section>
  );
}

function ScrollPrompt({ p }: { p: MotionValue<number> }) {
  const [visible, setVisible] = useState(false);
  const dismissed = useRef(p.get() > SCROLL_PROMPT_DISMISS_AT);

  useEffect(() => {
    if (dismissed.current) return;

    const timer = window.setTimeout(() => {
      if (!dismissed.current && p.get() <= SCROLL_PROMPT_DISMISS_AT) setVisible(true);
    }, SCROLL_PROMPT_DELAY_MS);

    const unsubscribe = p.on('change', (value) => {
      if (value <= SCROLL_PROMPT_DISMISS_AT || dismissed.current) return;
      dismissed.current = true;
      window.clearTimeout(timer);
      setVisible(false);
    });

    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [p]);

  if (!visible) return null;

  return (
    <motion.p
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 type-micro uppercase"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.28, 0.62, 0.28] }}
      transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
      style={{
        ...TECH_LABEL_STYLE,
        x: '-50%',
        y: '-50%',
        color: 'var(--color-pale)',
        whiteSpace: 'nowrap',
      }}
    >
      Scroll down
    </motion.p>
  );
}

// ─── Scene room — light scenes shutter open/closed around the die's path ──

function SceneRoom({ p, i, scene }: { p: MotionValue<number>; i: number; scene: Scene }) {
  const s = i * W;
  const narrow = useNarrow();
  const isRoom = scene.theme === 'light';
  const entry = scene.door;
  const exit = i + 1 < N ? SCENES[i + 1].door : REST_POINT;
  const isLast = i === N - 1;
  const isBemToAuditorSource = scene.id === 'bem';
  const isAuditorEntry = scene.id === 'auditor';
  const shutterInput = isBemToAuditorSource
    ? [s, s + W * BEAT.doorOpen]
    : isAuditorEntry
      ? [s, s + W]
      : isLast
        ? [s, s + W * BEAT.doorOpen]
        : [s, s + W * BEAT.doorOpen, s + W * BEAT.doorCloseS, s + W];
  const shutterOutput = isBemToAuditorSource
    ? [0, 170]
    : isAuditorEntry
      ? [170, 170]
      : isLast
        ? [0, 170]
        : [0, 170, 170, 0];

  // Shutter: opens from the entry door, closes toward the exit door. While
  // fully open the origin swap at mid-scene is invisible (insets clamp to 0).
  const r = useTransform(p, shutterInput, shutterOutput);
  const cx = useTransform(p, [s, s + W * 0.5, s + W * 0.5 + 0.0001, s + W], [entry.cx, entry.cx, exit.cx, exit.cx]);
  const cy = useTransform(p, [s, s + W * 0.5, s + W * 0.5 + 0.0001, s + W], [entry.cy, entry.cy, exit.cy, exit.cy]);
  const insTop = useTransform([r, cy], (v: number[]) => Math.max(0, v[1] - v[0]));
  const insRight = useTransform([r, cx], (v: number[]) => Math.max(0, 100 - v[1] - v[0]));
  const insBottom = useTransform([r, cy], (v: number[]) => Math.max(0, 100 - v[1] - v[0]));
  const insLeft = useTransform([r, cx], (v: number[]) => Math.max(0, v[1] - v[0]));
  const clipPath = useMotionTemplate`inset(${insTop}% ${insRight}% ${insBottom}% ${insLeft}%)`;
  // Hero stays mounted a bit past its own window — the ground line + die
  // are held there until the manifesto's incoming line touches and shoves
  // them off, which happens slightly into the NEXT scene's timeline.
  // Tools also overstays: its white base must keep the stage white until
  // the knowledge room's shutter has fully opened over it.
  const visibleEnd =
    scene.id === 'hero'
      ? manifestoRig(narrow).leap3 + 0.01
      : scene.id === 'tools'
        ? s + W * 1.17
        : s + W + 0.005;
  const visible = useTransform(p, (v) => (v > s - 0.015 && v < visibleEnd ? 1 : 0));

  // The finale's content doesn't fade in — it RISES as one mass from below
  // the frame (decelerating into place), shoving the waiting die up ahead
  // of it. RollingDie mirrors this exact ease to ride the mass's top edge.
  // On mobile the mass is taller than the screen, so after seating it keeps
  // conveying upward slowly, walking the tail cards into view.
  const riseY = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - (s + W * FINALE.riseS)) / (W * (FINALE.riseE - FINALE.riseS))));
    const base = (1 - t) ** 3 * 100;
    if (!narrow) return `${base}vh`;
    const c = Math.min(1, Math.max(0, (v - (s + W * FINALE.holdEnd)) / (W * (0.985 - FINALE.holdEnd))));
    const eased = c * c * (3 - 2 * c);
    return `${base - eased * MOBILE_FINALE_CONVEYOR_VH}vh`;
  });

  const inner = (
    <>
      {scene.id === 'hero' && <HeroGround p={p} />}
      {scene.title && <HeadBlock p={p} i={i} scene={scene} />}
      {(scene.items || scene.groups || scene.knowledge) && <ItemsBlock p={p} i={i} scene={scene} />}
    </>
  );
  const content =
    scene.die === 'rest' ? (
      <motion.div className="absolute inset-0" style={{ y: riseY }}>
        {inner}
      </motion.div>
    ) : (
      inner
    );

  if (scene.id === 'tools') {
    return <ToolsRoom p={p} i={i} visible={visible} content={content} />;
  }

  if (!isRoom) {
    // Dark scenes live directly in the void — the content is staged by the
    // die itself, with no extra arrival marker.
    return (
      <motion.div className="absolute inset-0" style={{ opacity: visible }}>
        {content}
      </motion.div>
    );
  }

  if (scene.id === 'leverage') {
    return <LeverageRoom p={p} i={i} scene={scene} visible={visible} content={content} />;
  }

  return (
    <motion.div className="absolute inset-0" style={{ clipPath, backgroundColor: LIGHT, opacity: visible }}>
      {content}
      {scene.id === 'auditor' && <AuditorToPipelineWave p={p} i={i} />}
    </motion.div>
  );
}

function LeverageRoom({
  p,
  i,
  scene,
  visible,
  content,
}: {
  p: MotionValue<number>;
  i: number;
  scene: Scene;
  visible: MotionValue<number>;
  content: ReactNode;
}) {
  const s = i * W;
  const scanLeft = useTransform(p, [s, s + W * TARZAN.scanEnd], [100, 0], { clamp: true });
  const clipPath = useMotionTemplate`inset(0% 0% 0% ${scanLeft}%)`;
  const scanX = useTransform(scanLeft, (v) => `${v}%`);
  const scanOpacity = useTransform(p, [s, s + W * 0.03, s + W * TARZAN.scanEnd, s + W * (TARZAN.scanEnd + 0.05)], [0, 1, 1, 0]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity: visible }}>
      <motion.div className="absolute inset-0" style={{ clipPath, backgroundColor: LIGHT }}>
        {content}
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="absolute top-0 bottom-0"
        style={{
          left: scanX,
          width: 1,
          opacity: scanOpacity,
          background: 'rgba(252,251,250,0.72)',
          boxShadow: '0 0 0 1px rgba(17,17,17,0.28), 0 0 34px rgba(252,251,250,0.45)',
          transform: 'translateX(-50%)',
        }}
      />
      {/* no arrival marker — the scan strikes the die off the previous
          scene's tread and it swings in on the cord instead */}
    </motion.div>
  );
}

function AuditorToPipelineWave({ p, i }: { p: MotionValue<number>; i: number }) {
  const [origin, setOrigin] = useState({ x: 50, y: 60 });

  useEffect(() => {
    const measure = () => {
      const head = document.querySelector(`[data-sc="${i}"][data-role="head"]`);
      if (!head) return;
      const rect = head.getBoundingClientRect();
      if (rect.width < 10) return;
      // The wave is born from the straining die itself. Desktop: parked at
      // the head's left margin. Mobile: parked at its lane firing post,
      // just above the rows it was shooting.
      let x: number;
      let y: number;
      if (window.innerWidth < 640) {
        const itemsEl = document.querySelector(`[data-sc="${i}"][data-role="items"]`);
        const ir = itemsEl?.getBoundingClientRect();
        x = window.innerWidth - LANE_CENTER;
        y = (ir && ir.width > 10 ? ir.top : rect.bottom + 40) - 24;
      } else {
        const rideH = Math.min(rect.height, window.innerHeight * 0.5) - 20;
        x = rect.left - 18;
        y = rect.top + 10 + rideH;
      }
      setOrigin({
        x: (x / window.innerWidth) * 100,
        y: (y / window.innerHeight) * 100,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    const head = document.querySelector(`[data-sc="${i}"][data-role="head"]`);
    if (head) ro.observe(head);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [i]);

  const s = i * W;
  const t = useTransform(p, [s + W * AUDITOR_WAVE.start, s + W * AUDITOR_WAVE.end], [0, 1], { clamp: true });
  const size = useTransform(t, (v) => `${Math.max(0, v * 220)}vmax`);
  const opacity = useTransform(p, [s + W * (AUDITOR_WAVE.start - 0.015), s + W * AUDITOR_WAVE.start], [0, 1], { clamp: true });
  const borderOpacity = useTransform(t, (v) => Math.max(0, 1 - v * 0.7));

  return (
    <motion.div
      aria-hidden="true"
      className="absolute"
      style={{
        left: `${origin.x}%`,
        top: `${origin.y}%`,
        width: size,
        height: size,
        x: '-50%',
        y: '-50%',
        opacity,
        background: DARK,
        border: '1px solid rgba(252,251,250,0.7)',
        boxShadow: '0 0 0 1px rgba(17,17,17,0.18)',
        scale: 1,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: borderOpacity,
          border: '1px solid rgba(252,251,250,0.6)',
        }}
      />
    </motion.div>
  );
}

// The tools act's stage. It opens still WHITE (carried straight over from
// the leverage room), the die's black offspring grow over that white until
// the stage is solid black, and the white base is swapped out unseen. For
// the retraction the base returns — again unseen, under the still-solid
// black — so the tiles can pull away toward the corner and REVEAL white,
// handing the stage to the knowledge room already light.
function ToolsRoom({
  p,
  i,
  visible,
  content,
}: {
  p: MotionValue<number>;
  i: number;
  visible: MotionValue<number>;
  content: ReactNode;
}) {
  const s = i * W;
  const backdrop = useTransform(
    p,
    [
      s + W * MULT.blackDone,
      s + W * (MULT.blackDone + 0.006),
      s + W * (MULT.re0 - 0.006),
      s + W * MULT.re0,
      s + W * 1.12,
      s + W * 1.16,
    ],
    [1, 0, 0, 1, 1, 0],
  );
  return (
    <motion.div className="absolute inset-0" style={{ opacity: visible }}>
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: LIGHT, opacity: backdrop }} />
      {/* tiles sit UNDER the content: while they hold the stage black the
          text stays readable on top of them, exactly as on the plain void */}
      <CloneField p={p} i={i} />
      {content}
    </motion.div>
  );
}

// The cannon's muzzle flash — no glow, no particles: two thin sparks that
// RACE along the frame at the instant of the shot, one up the left edge,
// one across the bottom edge, both escaping from the corner nearest the
// barrel. Blend-inverted so they read over the closing room and the void.
function CannonFlash({ p }: { p: MotionValue<number> }) {
  const s = 2 * W; // the BEM act — the only one that fires
  const f0 = s + W * CANNON.fireAt;
  const f1 = f0 + W * CANNON.flashDur;
  const t = useTransform(p, [f0, f1], [0, 1], { clamp: true });
  const e = useTransform(t, (v) => 1 - (1 - v) * (1 - v));
  const opacity = useTransform(p, [f0, f0 + W * 0.006, f1 - W * 0.015, f1], [0, 1, 1, 0]);
  const sparkTop = useTransform(e, (v) => `${(1 - v) * 84}vh`); // races bottom → top
  const sparkLeft = useTransform(e, (v) => `${v * 84}vw`); // races left → right
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.div
        style={{
          position: 'absolute',
          left: 6,
          width: 2,
          height: '16vh',
          top: sparkTop,
          opacity,
          background: '#ffffff',
          mixBlendMode: 'difference',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: 6,
          height: 2,
          width: '16vw',
          left: sparkLeft,
          opacity,
          background: '#ffffff',
          mixBlendMode: 'difference',
        }}
      />
    </div>
  );
}

// The hero's only line — it draws itself just AHEAD of the rolling die (the
// tip always leads; the die chases it, never overtakes it) and becomes the
// typographic rule the title hangs from. It holds there, fully drawn and
// static, until the incoming manifesto line touches it — then both the line
// and the die get shoved up-left together, hard, and vanish mid-shove.
function HeroGround({ p }: { p: MotionValue<number> }) {
  const rig = manifestoRig(useNarrow());
  // The tip leads the die through the roll and HOLDS at 74% — it only moves
  // again when the incoming text's leading edge physically reaches it. From
  // there the tip stays glued to the edge (linear keyframes matching the
  // edge's own linear sweep): pushed to the die's face, then consumed along
  // with the whole line as die+line ride out ahead of the text.
  const x2 = useTransform(
    p,
    [0, W * 0.48, rig.edgeAt(74), rig.touch, rig.leap1, rig.leap2, rig.leap3],
    [
      '16%',
      '74%',
      '74%',
      `${HERO_DIE_REST_X + 1}%`,
      `${rig.edgeX(rig.leap1) - 1}%`,
      `${rig.edgeX(rig.leap2) - 1}%`,
      `${rig.edgeX(rig.leap3) - 1}%`,
    ],
    { clamp: true },
  );
  const opacity = useTransform(p, [0, 0.01, rig.leap2, rig.leap3], [0, 1, 1, 0]);
  // Rises with the die while being consumed — the remaining span is always
  // left of the sweeping edge, so the glyphs can never sit on top of it.
  const pushY = useTransform(p, [rig.touch, rig.leap3], ['0vh', '-20.6vh']);
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <motion.line
        x1="10%"
        y1={`${HERO_GROUND_Y}%`}
        x2={x2}
        y2={`${HERO_GROUND_Y}%`}
        stroke="rgba(252,251,250,0.5)"
        strokeWidth="1"
        style={{ opacity, y: pushY }}
      />
    </svg>
  );
}

// ─── Text blocks — spawned and shoved by the die's landings ───────────────

// Exit timing/distance for a scene's text blocks. Scenes with `flyExit`
// (BEM's falling levels) don't fade gently — the whole column rockets
// straight up out of the viewport right as the die lands its last level,
// selling the illusion that the fall keeps going past the screen edge.
function exitBeat(scene: Scene): { s: number; e: number; y: number } {
  if (scene.flyExit) {
    return { s: BEAT.stampEnd, e: BEAT.stampEnd + 0.05, y: -1600 };
  }
  // multiply: the content must be fully gone BEFORE the black starts
  // retracting — its white text would vanish against the revealed white
  if (scene.die === 'multiply') {
    return { s: MULT.exitS, e: MULT.exitE, y: -24 };
  }
  // the finale never exits: it is the last thing standing after the die
  // has dropped away (beats sit far past p=1 so the fade can't trigger)
  if (scene.id === 'knowledge') {
    return { s: 2, e: 2.1, y: 0 };
  }
  return { s: BEAT.contentExitS, e: BEAT.contentExitE, y: -24 };
}

// One staged part of the head block; enters AFTER the die lands, from the
// die's direction, with a landing shove that settles.
function HeadPart({
  p,
  i,
  scene,
  order,
  children,
  className,
  style,
}: {
  p: MotionValue<number>;
  i: number;
  scene: Scene;
  order: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const s = i * W;
  const narrow = useNarrow();
  const isHero = i === 0;
  const isLeverage = scene.id === 'leverage';
  const isStairs = scene.die === 'stairs';
  // multiply: the head waits for the stage to finish turning black — it
  // prints directly ON its final background, never on the white
  const isMultiply = scene.die === 'multiply';
  // finale: the parts are visible almost immediately — the RISE of the
  // whole content mass (see SceneRoom) is their entrance, not a fade
  const isFinale = scene.die === 'rest';
  const landAt = isHero ? 0.2 : BEAT.land;
  // leverage: the head enters when the swinging die SLAMS its left edge —
  // on mobile that first impact comes earlier so the head gets a real
  // reading window before it hands the slot to the rows.
  const levHit0 = narrow ? MOBILE_TARZAN.hitTimes[0] : TARZAN.rightHit0;
  const start = isLeverage
    ? s + W * (levHit0 + order * 0.014)
    : isMultiply
      ? s + W * (MULT.head0 + order * 0.03)
      : isFinale
        ? s + W * (0.04 + order * 0.02)
        : isStairs
          ? s + W * (STAIRS.headStart + order * STAIRS.headStagger)
          : s + W * (landAt + order * 0.045);
  const mid = start + W * (isLeverage ? 0.02 : isFinale ? 0.03 : isStairs ? STAIRS.headSettleDur : 0.08);
  // The head STAYS while the rows print below it — the whole scene reads
  // as one composition on every stage; it only leaves with the scene.
  const exit = exitBeat(scene);
  const opacity = useTransform(p, [start, mid, s + W * exit.s, s + W * exit.e], [0, 1, 1, 0]);
  const y = useTransform(p, [start, mid, s + W * exit.s, s + W * exit.e], [isLeverage || isFinale ? 0 : isStairs ? 14 : 26, 0, 0, exit.y]);
  // leverage: the head is SLAMMED in by the swinging die hitting its left
  // edge — it jolts away from the impact and settles back, one part after
  // the other down the block (the order stagger rides the same jolt)
  const entryX = useTransform(
    p,
    isLeverage ? [start, start + W * 0.03, start + W * 0.1, s + W * exit.s] : [start, mid, s + W * exit.s, s + W * exit.e],
    isLeverage ? [0, 26, 0, 0] : [0, 0, 0, 0],
  );
  // impact shove: the die lands on the block's margin and knocks it sideways
  const shove = useTransform(
    p,
    [s + W * landAt, s + W * (landAt + 0.03), s + W * (landAt + 0.1)],
    isStairs ? [0, 0, 0] : [0, 10, 0],
  );
  const x = useTransform([entryX, shove], (v: number[]) => v[0] + v[1]);
  return (
    <motion.div className={className} style={{ opacity, y, x, ...style }}>
      {children}
    </motion.div>
  );
}

function HeadBlock({ p, i, scene }: { p: MotionValue<number>; i: number; scene: Scene }) {
  const narrow = useNarrow();
  const dark = scene.theme === 'dark';
  const inkStrong = dark ? 'rgba(252,251,250,0.94)' : 'var(--color-ink)';
  const inkSoft = dark ? 'rgba(252,251,250,0.62)' : 'rgba(17,17,17,0.7)';
  const inkFaint = dark ? 'rgba(252,251,250,0.5)' : 'rgba(17,17,17,0.52)';
  const isHero = scene.id === 'hero';
  // Mobile: every non-hero head prints into the same column slot, whose
  // right margin reserves the die's lane (the hero hangs from its rolling
  // ground line, which already fits).
  const headPos = narrow && !isHero ? mobileHeadPos(scene) : scene.headPos;

  return (
    <div data-sc={i} data-role="head" className="absolute px-6 md:px-0" style={headPos}>
      <HeadPart p={p} i={i} scene={scene} order={0}>
        <p className="type-micro uppercase mb-2 md:mb-4" style={{ ...TECH_LABEL_STYLE, color: inkFaint }}>
          {scene.kicker}
        </p>
      </HeadPart>
      <HeadPart p={p} i={i} scene={scene} order={1}>
        <h2
          className="type-display-l"
          style={{
            color: inkStrong,
            fontSize: isHero ? 'clamp(32px, 5vw, 72px)' : 'clamp(24px, 3.6vw, 52px)',
            lineHeight: 1.08,
          }}
        >
          {scene.title}
        </h2>
      </HeadPart>
      {scene.body && (
        <HeadPart p={p} i={i} scene={scene} order={2}>
          <p
            className="type-body mt-3 md:mt-5"
            style={{
              color: inkSoft,
              maxWidth: 620,
              // phone: denser body so head + rows share one viewport
              ...(narrow && !isHero ? { fontSize: 14, lineHeight: 1.5 } : null),
            }}
          >
            {scene.body}
          </p>
        </HeadPart>
      )}
      {scene.body2 && (
        <HeadPart p={p} i={i} scene={scene} order={3}>
          <p
            className="type-body mt-2 md:mt-3"
            style={{
              color: inkFaint,
              maxWidth: 620,
              ...(narrow && !isHero ? { fontSize: 14, lineHeight: 1.5 } : null),
            }}
          >
            {scene.body2}
          </p>
        </HeadPart>
      )}
      {/* The tech-tag strip is desktop furniture: on a phone it wraps into
          3–4 ruled lines that push the scene's rows below the fold and
          crowd the die's stage. The hero keeps its tags — they ARE its
          content — everywhere else mobile drops them. */}
      {scene.tags && (!narrow || isHero) && (
        <HeadPart p={p} i={i} scene={scene} order={4} className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
          {scene.tags.map((tag) => (
            <span
              key={tag}
              className="type-micro uppercase"
              style={{
                ...TECH_LABEL_STYLE,
                color: inkFaint,
                borderTop: `1px solid ${dark ? 'rgba(252,251,250,0.3)' : 'rgba(17,17,17,0.28)'}`,
                paddingTop: 8,
              }}
            >
              {tag}
            </span>
          ))}
        </HeadPart>
      )}
    </div>
  );
}

// One row of the items block. It prints exactly when the die's stamp-hop
// lands on its index — the die and the list are the same beat.
function StampedRow({
  p,
  i,
  scene,
  hopIndex,
  hopCount,
  stairsOffsetX = 0,
  stairsOffsetY = 0,
  children,
  style,
  className,
}: {
  p: MotionValue<number>;
  i: number;
  scene: Scene;
  hopIndex: number;
  hopCount: number;
  stairsOffsetX?: number;
  stairsOffsetY?: number;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const s = i * W;
  const narrow = useNarrow();
  const span = BEAT.stampEnd - BEAT.stampStart;
  const at = s + W * (BEAT.stampStart + (hopIndex / hopCount) * span);
  const settle = at + W * 0.05;
  const exit = exitBeat(scene);
  // stairs scenes: row k is stair step k — it appears exactly when the
  // giant die's k-th landing hits. On desktop each row also shifts +stepX
  // so the block reads as a staircase descending to the right; on mobile
  // the staircase is VERTICAL (the die tumbles down the right-edge lane),
  // so rows keep their column position and only the timing staircases.
  const isStairs = scene.die === 'stairs';
  const isLeverage = scene.id === 'leverage';
  // multiply scenes: the content prints WHILE the swarm still tiles the
  // stage (the copies are what reveal it) — so when they fold away, the
  // text is already standing there, ready for the long readable gap
  const isMultiply = scene.die === 'multiply';
  // finale: rows are visible almost immediately — the whole-mass RISE (see
  // SceneRoom) is their entrance, not a per-row fade
  const isFinale = scene.die === 'rest';
  const stDescentStart = narrow ? MOBILE_STAIRS.descentStart : STAIRS.descentStart;
  const stStepDur = narrow ? MOBILE_STAIRS.stepDur : STAIRS.stepDur;
  const stRowLead = narrow ? MOBILE_STAIRS.rowLead : STAIRS.rowLead;
  const stairTouchdown = s + W * (stDescentStart + (hopIndex + STAIRS.moveFrac) * stStepDur);
  const rowStart = isStairs
    ? // the tread must already exist before impact; otherwise the giant die
      // reads as colliding with text that is still fading in.
      stairTouchdown - W * stRowLead
    : isLeverage
      ? narrow
        ? s + W * (MOBILE_LEV_ROW0 + hopIndex * MOBILE_LEV_ROW_GAP)
        : s + W * (TARZAN.rightHit0 + (hopIndex + 1) * TARZAN.rightHitGap)
      : isMultiply
        ? s + W * (MULT.rows0 + hopIndex * MULT.rowGap)
        : isFinale
          ? s + W * (0.06 + hopIndex * 0.03)
          : at;
  const rowSettle =
    isStairs
      ? rowStart + W * STAIRS.rowSettleDur
      : isLeverage
        ? rowStart + W * 0.02
        : isMultiply || isFinale
          ? rowStart + W * 0.05
          : settle;
  // scaled down with the same factor RollingDie uses for the die's own
  // landing spots, so the rows' offsets and the die's touchdowns stay locked
  const vw = useViewportWidth();
  const finalX = isStairs && !narrow ? stairsOffsetX + hopIndex * STAIRS.stepX * stairsK(vw) : 0;
  const finalY = isStairs && !narrow ? stairsOffsetY : 0;
  const opacity = useTransform(p, [rowStart, rowSettle, s + W * exit.s, s + W * exit.e], [0, 1, 1, 0]);
  const y = useTransform(
    p,
    [rowStart, rowSettle, s + W * exit.s, s + W * exit.e],
    [isStairs ? finalY - 16 : isLeverage || isFinale ? 0 : 18, finalY, finalY, finalY + exit.y],
  );
  // leverage rows are SLAMMED in on their left edge: they jolt away from
  // the die's impact and settle back — they never pre-exist the hit
  const x = useTransform(
    p,
    isLeverage
      ? [rowStart, rowStart + W * 0.03, rowStart + W * 0.1, s + W * exit.s]
      : [rowStart, rowSettle, s + W * exit.s, s + W * exit.e],
    isLeverage ? [0, 26, 0, 0] : [finalX, finalX, finalX, finalX],
  );
  return (
    <motion.div className={className} style={{ opacity, y, x, ...style }}>
      {children}
    </motion.div>
  );
}

// Shot timing shared by the marker and its row's text: the big die RECOILS
// and FIRES at `fire` (the exact instant its recoil kick spikes in
// RollingDie), the mini die flies for a short beat, and LANDS at `land`.
const SHOT_FLIGHT = 0.03; // in window fractions
function shotBeats(i: number, hopIndex: number, hopCount: number) {
  const s = i * W;
  const span = BEAT.stampEnd - BEAT.stampStart;
  const fire = s + W * (BEAT.stampStart + (hopIndex / hopCount) * span);
  const land = fire + W * SHOT_FLIGHT;
  return { fire, land };
}

// The fired die — a mini copy shot OUT OF the big die. Its start position
// is not a guessed offset: it MEASURES the big die's firing post (the same
// head-rect formula RollingDie uses) and its own landing cell, so the
// flight begins exactly at the die's center. It does not exist until the
// die's recoil fires it, and it spins one full turn on the way down.
function ShotMarker({ p, i, hopIndex, hopCount }: { p: MotionValue<number>; i: number; hopIndex: number; hopCount: number }) {
  const { fire, land } = shotBeats(i, hopIndex, hopCount);
  const cellRef = useRef<HTMLDivElement>(null);
  const dx = useMotionValue(300);
  const dy = useMotionValue(-240);

  useEffect(() => {
    const measure = () => {
      const cell = cellRef.current;
      const head = document.querySelector(`[data-sc="${i}"][data-role="head"]`);
      if (!cell || !head) return;
      const hr = head.getBoundingClientRect();
      const cr = cell.getBoundingClientRect();
      if (hr.width < 10 || cr.width < 1) return;
      // The big die's firing post — identical formula to RollingDie's
      // shoot case, so the projectile's origin IS the die's center.
      // Desktop: parked at the head's left margin. Mobile: parked at the
      // top of the right-edge lane, above the rows it fires into.
      let dieCX: number;
      let dieCY: number;
      if (window.innerWidth < 640) {
        const itemsEl = cell.closest('[data-role="items"]');
        const ir = itemsEl?.getBoundingClientRect();
        dieCX = window.innerWidth - LANE_CENTER;
        dieCY = (ir ? ir.top : hr.bottom + 40) - 24;
      } else {
        const rideH = Math.min(hr.height, window.innerHeight * 0.5) - 20;
        dieCX = hr.left - 18;
        dieCY = hr.top + 10 + rideH;
      }
      dx.set(dieCX - (cr.left + 5.5));
      dy.set(dieCY - (cr.top + 5.5));
    };
    measure();
    // re-measure once fonts/layout settle, and on resize
    const t = window.setTimeout(measure, 700);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [i, dx, dy]);

  const t = useTransform(p, [fire, land], [0, 1], { clamp: true });
  const opacity = useTransform(p, [fire - 0.0001, fire], [0, 1], { clamp: true });
  const x = useTransform([t, dx], (v: number[]) => v[1] * (1 - v[0]));
  const y = useTransform([t, dy], (v: number[]) => v[1] * (1 - v[0]));
  const rotate = useTransform(t, (v) => (1 - v) * 360);
  return (
    <div aria-hidden="true" ref={cellRef}>
      <motion.div style={{ width: 11, height: 11, background: 'currentColor', x, y, rotate, opacity }} />
    </div>
  );
}

// Row used only for `shoot` scenes. The marker above is a solid projectile
// in flight and must never inherit a fade — so unlike StampedRow, the
// row's FRAME (border + marker cell) snaps in once per scene at the start
// of the stamping phase, not staggered per row, and stays fully opaque
// through every shot. Only the accompanying text fades in, timed to each
// shot's IMPACT rather than smeared across its flight.
function ShotRow({
  p,
  i,
  scene,
  hopIndex,
  hopCount,
  rule,
  children,
}: {
  p: MotionValue<number>;
  i: number;
  scene: Scene;
  hopIndex: number;
  hopCount: number;
  rule: string;
  children: ReactNode;
}) {
  const s = i * W;
  const narrow = useNarrow();
  const { land } = shotBeats(i, hopIndex, hopCount);
  const exit = exitBeat(scene);
  // The frame (empty target board) goes up when the die finishes parking at
  // its post — a beat of "board's up, nothing hit yet" before any shot.
  const frameOpacity = useTransform(
    p,
    [s + W * BEAT.rideEnd, s + W * (BEAT.rideEnd + 0.02), s + W * exit.s, s + W * exit.e],
    [0, 1, 1, 0],
  );
  // Text prints when its projectile LANDS — impact writes the row.
  const textOpacity = useTransform(p, [land, land + W * 0.04, s + W * exit.s, s + W * exit.e], [0, 1, 1, 0]);
  const textY = useTransform(p, [land, land + W * 0.04, s + W * exit.s, s + W * exit.e], [10, 0, 0, exit.y]);
  return (
    <motion.div
      className="grid gap-2 py-2 grid-cols-[22px_1fr] sm:gap-3 sm:py-3 sm:grid-cols-[32px_1fr]"
      style={{ borderTop: narrow ? 'none' : `1px solid ${rule}`, opacity: frameOpacity }}
    >
      <div style={{ paddingTop: 3 }}>
        <ShotMarker p={p} i={i} hopIndex={hopIndex} hopCount={hopCount} />
      </div>
      <motion.div style={{ opacity: textOpacity, y: textY }}>{children}</motion.div>
    </motion.div>
  );
}

function ItemsBlock({ p, i, scene }: { p: MotionValue<number>; i: number; scene: Scene }) {
  const narrow = useNarrow();
  const dark = scene.theme === 'dark';
  const inkStrong = dark ? 'rgba(252,251,250,0.88)' : 'rgba(17,17,17,0.86)';
  const inkSoft = dark ? 'rgba(252,251,250,0.58)' : 'rgba(17,17,17,0.66)';
  const inkFaint = dark ? 'rgba(252,251,250,0.44)' : 'rgba(17,17,17,0.5)';
  const rule = dark ? 'rgba(252,251,250,0.24)' : 'rgba(17,17,17,0.2)';
  const hopCount = scene.hops ?? 3;
  const vw = useViewportWidth();
  const stairsLineX = scene.die === 'stairs' && !narrow ? STAIRS.rowShiftX : 0;
  // Mobile treads extend just far enough to run under the lane, so the
  // tumbling giant lands ON each row's rule at the screen's right edge.
  const treadExtScaled = narrow ? 56 : STAIRS.treadExt * stairsK(vw);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [stairsOffset, setStairsOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // The desktop staircase anchors itself to the previous scene's rects;
    // the mobile staircase is vertical and needs no offset at all.
    if (scene.die !== 'stairs' || narrow) {
      setStairsOffset({ x: 0, y: 0 });
      return;
    }

    const measure = () => {
      const items = itemsRef.current;
      const prevHead = document.querySelector(`[data-sc="${i - 1}"][data-role="head"]`);
      if (!items) return;
      const itemsRect = items.getBoundingClientRect();
      const prevHeadRect = prevHead?.getBoundingClientRect() ?? null;
      const k = stairsK(window.innerWidth);
      const half = (DIE_SIZE * STAIRS.scale * k) / 2;
      const next = stairsAnchorOffset(itemsRect, prevHeadRect && prevHeadRect.width > 10 ? prevHeadRect : null, k, half);
      setStairsOffset((current) =>
        Math.abs(current.x - next.x) < 0.5 && Math.abs(current.y - next.y) < 0.5 ? current : next,
      );
    };

    measure();
    const t = window.setTimeout(measure, 700);
    window.addEventListener('resize', measure);
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(measure);
      if (itemsRef.current) ro.observe(itemsRef.current);
      const prevHead = document.querySelector(`[data-sc="${i - 1}"][data-role="head"]`);
      if (prevHead) ro.observe(prevHead);
    }

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [i, scene.die, narrow]);

  return (
    <div
      ref={itemsRef}
      data-sc={i}
      data-role="items"
      className="absolute px-6 md:px-0"
      style={narrow ? mobileItemsPos(scene) : scene.itemsPos}
    >
      {scene.items &&
        (scene.die === 'shoot'
          ? scene.items.map((item, k) => (
              <ShotRow key={item.title} p={p} i={i} scene={scene} hopIndex={k} hopCount={hopCount} rule={rule}>
                <p className="type-meta uppercase" style={{ color: inkStrong }}>
                  {item.title}
                </p>
                <p className="type-body mt-1" style={{ color: inkSoft, fontSize: narrow ? 13 : 14, lineHeight: narrow ? 1.4 : 1.5 }}>
                  {item.detail}
                </p>
                {/* per-row tech tags are desktop-only — on a phone they add
                    a metadata line to every bullet and push the set past
                    one viewport */}
                {item.tags && !narrow && (
                  <p className="type-micro uppercase mt-2" style={{ ...TECH_LABEL_STYLE, color: inkFaint }}>
                    {item.tags.join(' · ')}
                  </p>
                )}
              </ShotRow>
            ))
          : scene.items.map((item, k) => (
              <StampedRow
                key={item.title}
                p={p}
                i={i}
                scene={scene}
                hopIndex={k}
                hopCount={hopCount}
                stairsOffsetX={stairsOffset.x + stairsLineX}
                stairsOffsetY={stairsOffset.y}
              >
                {scene.die === 'stairs' && (
                  // the tread: a rule that underlines the row's text AND runs
                  // on past it to the right, so the tumbling die lands squarely
                  // ON the line, out to the side and clear of every word
                  <div aria-hidden="true" style={{ height: 1, background: rule, width: `calc(100% + ${treadExtScaled}px)` }} />
                )}
                <div
                  className="grid gap-2 grid-cols-[22px_1fr] sm:gap-3 sm:grid-cols-[32px_1fr]"
                  // stairs scenes stack 4 staggered rows below a tall head —
                  // tighter treads keep the whole staircase inside the viewport;
                  // leverage also runs tight so all 3 rows clear the head above
                  // and the viewport bottom. Mobile drops the separator rules
                  // (the numbered indices carry the structure) and tightens
                  // the padding so the whole set shares the head's viewport.
                  style={{
                    borderTop: scene.die === 'stairs' || narrow ? 'none' : `1px solid ${rule}`,
                    padding: narrow ? '6px 0' : scene.die === 'stairs' ? '5px 0' : scene.id === 'leverage' ? '7px 0' : '12px 0',
                  }}
                >
                  <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: inkFaint }}>
                    {String(k + 1).padStart(2, '0')}
                  </p>
                  <div>
                    <p className="type-meta uppercase" style={{ color: inkStrong }}>
                      {item.title}
                    </p>
                    <p className="type-body mt-1" style={{ color: inkSoft, fontSize: narrow ? 13 : 14, lineHeight: narrow ? 1.4 : 1.5 }}>
                      {item.detail}
                    </p>
                    {item.tags && !narrow && (
                      <p className="type-micro uppercase mt-2" style={{ ...TECH_LABEL_STYLE, color: inkFaint }}>
                        {item.tags.join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              </StampedRow>
            )))}
      {scene.groups && (
        <div className="grid gap-3 md:gap-8 md:grid-cols-3">
          {scene.groups.map((group, k) => (
            <StampedRow
              key={group.title}
              p={p}
              i={i}
              scene={scene}
              hopIndex={k}
              hopCount={hopCount}
              stairsOffsetX={stairsOffset.x + stairsLineX}
              stairsOffsetY={stairsOffset.y}
            >
              <p className="type-micro uppercase mb-2 md:mb-3" style={{ ...TECH_LABEL_STYLE, color: inkStrong }}>
                {group.title}
              </p>
              {/* mobile: no per-tool separator rules — nine ruled lines eat
                  a third of the viewport; the name/use rhythm is enough */}
              <div className="space-y-1.5 md:space-y-3">
                {group.items.map(([name, use]) => (
                  <div key={name} style={narrow ? undefined : { borderTop: `1px solid ${rule}`, paddingTop: 10 }}>
                    <p className="type-subhead" style={{ color: inkStrong, fontSize: narrow ? 15 : 16 }}>
                      {name}
                    </p>
                    <p className="type-meta mt-0.5 md:mt-1" style={{ color: inkSoft, ...(narrow ? { fontSize: 12 } : null) }}>
                      {use}
                    </p>
                  </div>
                ))}
              </div>
            </StampedRow>
          ))}
        </div>
      )}
      {scene.knowledge && (
        <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
          {scene.knowledge.map(([title, body], k) => (
            <StampedRow
              key={title}
              p={p}
              i={i}
              scene={scene}
              hopIndex={Math.floor(k / 2)}
              hopCount={hopCount}
              stairsOffsetX={stairsOffset.x + stairsLineX}
              stairsOffsetY={stairsOffset.y}
              className="grid gap-2 grid-cols-[22px_1fr] sm:gap-3 sm:grid-cols-[32px_1fr]"
              style={{ borderTop: `1px solid ${rule}`, paddingTop: narrow ? 8 : 10 }}
            >
              <p className="type-micro uppercase" style={{ ...TECH_LABEL_STYLE, color: inkFaint }}>
                {String(k + 1).padStart(2, '0')}
              </p>
              <div>
                <p className="type-meta uppercase" style={{ color: inkStrong }}>
                  {title}
                </p>
                <p className="type-body mt-1" style={{ color: inkSoft, fontSize: narrow ? 13 : 13.5, lineHeight: narrow ? 1.4 : 1.5 }}>
                  {body}
                </p>
              </div>
            </StampedRow>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Manifesto — the die stands ON the giant line and the text is the belt ─

// Local (0..1 of the manifesto window) beats. The top line uses most of the
// act so scroll does not fling it across the viewport; the lower line exits
// through a longer, softer drop after the headline has nearly cleared.
const MANIFESTO_BEAT = {
  bEnterS: 0.1,
  bEnterE: 0.24,
  aExitS: 0,
  aExitE: 0.985,
  dropS: 0.9,
  dropE: 0.995,
  hideS: 0.995,
  hideE: 1,
} as const;

// The push-off between the incoming top line and the hero's held die+line
// is driven by the TEXT EDGE ITSELF, not by parallel timers: everything
// below converts between scroll progress and the leading (left) edge's x,
// so the tip retracts exactly when pushed and the die rides just ahead of
// the edge on its way out — contact without ever being run over.
//
// The sweep's END is viewport-dependent: the nowrap headline is ~290vw
// long on a phone (vs ~180vw on desktop), so mobile needs a much deeper
// end for the line's TAIL to clear the screen before the next scene's
// room shutters open over it — otherwise the giant text visibly cuts off
// mid-crossing. Everything derived from the sweep (touch beat, leaps, the
// die's formula path) is bundled per variant in a rig.
const MANIFESTO_XA_START = 92; // vw — enters from the right with less travel per scroll
const MANIFESTO_XA_END = -135; // vw — desktop sweep end
const MANIFESTO_XA_END_NARROW = -340; // vw — deep enough for the tail to clear a phone
const HERO_DIE_REST_X = 66; // vw — where the hero die+line hold, waiting
// The shove is near-instant, and split into thirds so the die's eased path
// stays glued AHEAD of the linear sweeping edge the whole way out.
const HERO_LEAP_DUR = 0.006;

type ManifestoRig = {
  endX: number;
  touch: number;
  leap1: number;
  leap2: number;
  leap3: number;
  edgeAt: (xVw: number) => number;
  edgeX: (pAbs: number) => number;
  path: readonly (readonly [number, number, number])[];
};

function buildManifestoRig(endX: number): ManifestoRig {
  // p at which the leading edge reaches a given x (vw)
  const edgeAt = (xVw: number) =>
    W + W * MANIFESTO_BEAT.aExitE * ((xVw - MANIFESTO_XA_START) / (endX - MANIFESTO_XA_START));
  // x (vw) of the leading edge at a given p — inverse of edgeAt
  const edgeX = (pAbs: number) =>
    MANIFESTO_XA_START + ((pAbs - W) / (W * MANIFESTO_BEAT.aExitE)) * (endX - MANIFESTO_XA_START);
  // First contact: the edge meets the die's RIGHT face — it reacts on
  // touch, not after the glyphs are already on top of it.
  const touch = edgeAt(HERO_DIE_REST_X + 1);
  const leap1 = touch + HERO_LEAP_DUR / 3;
  const leap2 = touch + (2 * HERO_LEAP_DUR) / 3;
  const leap3 = touch + HERO_LEAP_DUR;
  const path: readonly (readonly [number, number, number])[] = [
    // hero: rolls left→right chasing the ground line, then HOLDS while the
    // rest of the hero content fades around it
    [0.0, 10, HERO_DIE_PATH_Y],
    [0.07, HERO_DIE_REST_X, HERO_DIE_PATH_Y],
    [touch, HERO_DIE_REST_X, HERO_DIE_PATH_Y],
    // touched — shoved up and out of the text's band, fast and mostly
    // vertical so the sweeping glyphs never run over it
    [leap3, 58, 18],
    // hidden through the manifesto: drifts to the next scene's door and
    // settles there, face squared, ready to re-enter balanced
    [leap3 + 0.045, 10, 16],
    [2 * W, 10, 16],
  ];
  return { endX, touch, leap1, leap2, leap3, edgeAt, edgeX, path };
}

const MANIFESTO_RIG = buildManifestoRig(MANIFESTO_XA_END);
const MANIFESTO_RIG_NARROW = buildManifestoRig(MANIFESTO_XA_END_NARROW);
const manifestoRig = (narrow: boolean) => (narrow ? MANIFESTO_RIG_NARROW : MANIFESTO_RIG);

function ManifestoLayer({ p, i }: { p: MotionValue<number>; i: number }) {
  const rig = manifestoRig(useNarrow());
  const s = i * W;
  const at = (local: number) => s + W * local;
  const opacity = useTransform(p, [s, s + W * 0.08, at(MANIFESTO_BEAT.hideS), at(MANIFESTO_BEAT.hideE)], [0, 1, 1, 0]);
  // Top line: rides its full course clean off the left edge, but over a much
  // wider progress window so scroll input feels calmer. The rig's deeper
  // mobile end guarantees the TAIL has cleared the screen before the next
  // scene's room shutters open — the line never cuts off mid-crossing.
  const xA = useTransform(
    p,
    [at(MANIFESTO_BEAT.aExitS), at(MANIFESTO_BEAT.aExitE)],
    [`${MANIFESTO_XA_START}vw`, `${rig.endX}vw`],
    { clamp: true },
  );
  // Bottom line: enters in place and sits still, then falls out over a longer
  // distance in scroll-progress so the drop reads as controlled instead of abrupt.
  const yB = useTransform(
    p,
    [at(MANIFESTO_BEAT.bEnterS), at(MANIFESTO_BEAT.bEnterE), at(MANIFESTO_BEAT.dropS), at(MANIFESTO_BEAT.dropE)],
    ['24px', '0px', '0px', '78vh'],
  );
  const oB = useTransform(p, [at(MANIFESTO_BEAT.bEnterS), at(MANIFESTO_BEAT.bEnterE)], [0, 1], { clamp: true });

  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity }}>
      <motion.h2
        className="type-display-l absolute uppercase"
        style={{
          top: '32%',
          left: 0,
          x: xA,
          whiteSpace: 'nowrap',
          color: 'rgba(252,251,250,0.94)',
          fontSize: 'clamp(56px, 9vw, 130px)',
          lineHeight: 1,
        }}
      >
        {MANIFESTO_A}
      </motion.h2>
      {/* Bottom line: sized to the screen and centered — it enters in place
          and stays put while the giant line travels above it. */}
      <motion.p
        className="type-display-l absolute uppercase"
        style={{
          top: '58%',
          left: '50%',
          x: '-50%',
          y: yB,
          opacity: oB,
          width: 'min(88vw, 1180px)',
          textAlign: 'center',
          color: 'rgba(252,251,250,0.4)',
          fontSize: 'clamp(15px, 2vw, 30px)',
          lineHeight: 1.3,
        }}
      >
        {MANIFESTO_B}
      </motion.p>
    </motion.div>
  );
}

// ─── The die — narrator and stagehand ──────────────────────────────────────
// Scenes 0–1 run on a formula (rolling the hero ground, riding the belt);
// scenes 2+ anchor to the REAL rects of the text blocks: land on the head's
// margin, ride down while it prints, then stamp each row of the items list.

function formulaTarget(v: number, path: ManifestoRig['path']): [number, number] {
  if (v <= path[0][0]) return [path[0][1], path[0][2]];
  for (let k = 1; k < path.length; k += 1) {
    if (v <= path[k][0]) {
      const [p0, x0, y0] = path[k - 1];
      const [p1, x1, y1] = path[k];
      const t = (v - p0) / (p1 - p0);
      const e = t * t * (3 - 2 * t);
      return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e];
    }
  }
  const last = path[path.length - 1];
  return [last[1], last[2]];
}

function RollingDie({ p }: { p: MotionValue<number> }) {
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const x = useSpring(tx, { stiffness: 150, damping: 21, mass: 0.9 });
  const y = useSpring(ty, { stiffness: 150, damping: 21, mass: 0.9 });
  const rot = useMotionValue(0);
  const hop = useMotionValue(0);
  const stretch = useMotionValue(1);
  const dieScale = useMotionValue(1);
  // Springy so the moment it breaks free the growth OVERSHOOTS — the pop of
  // something bursting out of its bindings, not a smooth resize. The wild
  // strain breaths (slow sine pulses) still track through it.
  const dieScaleSpring = useSpring(dieScale, { stiffness: 160, damping: 12 });
  const shakeX = useMotionValue(0);
  const shakeY = useMotionValue(0);
  const vineOpacity = useMotionValue(0);
  // the cord's anchor end — it starts AT the die and is thrown to the
  // top-middle of the viewport (the die's end is always the die itself)
  const vineX1 = useMotionValue(0);
  const vineY1 = useMotionValue(0);
  const prev = useRef<{ x: number; y: number } | null>(null);
  const dist = useRef(0);
  const stairRotBase = useRef<number | null>(null);
  const finaleDropStartedAt = useRef<number | null>(null);
  const inited = useRef(false);
  const rectCache = useRef<Map<string, Element | null>>(new Map());
  // Offstage during the manifesto: vanishes mid reverse-leap at the end of
  // the hero, re-materializes at the next door right after the bottom line
  // has dropped through its trapdoor and the stage sits briefly empty.
  const narrowRender = useNarrow();
  const rig = manifestoRig(narrowRender);
  const dieOpacity = useTransform(
    p,
    [0, rig.touch, rig.leap3, W * (1 + MANIFESTO_BEAT.dropE), 2 * W],
    [1, 1, 0, 0, 1],
  );
  // The tools act is the one act where the die is NOT a blend inversion.
  // It has read as BLACK since the white leverage room, and it must STAY
  // black while it breeds black squares, dissolve into the black it made,
  // and pop back black on the revealed white. With `difference` it would
  // flip to white the instant its own offspring covered it — a character
  // break — and show a split face whenever it straddled a tile's edge.
  const inTools = (v: number) =>
    SCENES[Math.min(N - 1, Math.max(0, Math.floor(Math.min(1, Math.max(0, v)) / W)))].id === 'tools';
  const dieBlend = useTransform(p, (v) => (inTools(v) ? 'normal' : 'difference'));
  const dieFill = useTransform(p, (v) => (inTools(v) ? DARK : '#ffffff'));

  const getRect = (i: number, role: 'head' | 'items') => {
    const key = `${i}-${role}`;
    let el = rectCache.current.get(key);
    if (el === undefined) {
      el = document.querySelector(`[data-sc="${i}"][data-role="${role}"]`);
      rectCache.current.set(key, el);
    }
    if (!el) return null;
    const rc = el.getBoundingClientRect();
    return rc.width > 10 ? rc : null;
  };

  useAnimationFrame((tms) => {
    const v = Math.min(1, Math.max(0, p.get()));
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // scales the whole stairs staircase (die size + horizontal run) down on
    // narrower windows, so the last tread's die never sweeps its rotation
    // past the right edge — see stairsK's comment for why that clips
    const stK = stairsK(vw);
    const i = Math.min(N - 1, Math.floor(v / W));
    const lp = (v - i * W) / W;
    const scene = SCENES[i];
    // Mobile restaging: every persona stays in character, but the die
    // performs inside the right-edge LANE the text column reserves for it
    // (see mobileHeadPos/mobileItemsPos) — beside the words, never on them.
    const narrow = vw < 640;
    const laneX = vw - LANE_CENTER;
    const laneGiantX = vw - LANE_GIANT;

    // ── target from the choreography (per die persona) ──
    const mode = scene.die;
    let txx: number;
    let tyy: number;
    // Set each frame by the leverage (Tarzan) branch below; the body-language
    // section reads it — angle drives the tilt, phases drive scale and cord.
    let lev: { angle: number; preHit: boolean; throwT: number } | null = null;
    if (i < 2) {
      const [wx, wy] = formulaTarget(v, manifestoRig(narrow).path);
      txx = (wx / 100) * vw;
      const pathY = (wy / 100) * vh;
      const exactGroundY = (HERO_GROUND_Y / 100) * vh - DIE_SIZE / 2;
      const baselineCorrection = exactGroundY - (HERO_DIE_PATH_Y / 100) * vh;
      const release = Math.min(1, Math.max(0, (v - rig.touch) / (rig.leap3 - rig.touch)));
      tyy = pathY + baselineCorrection * (1 - release);
    } else {
      const head = getRect(i, 'head');
      const items = getRect(i, 'items');
      const exitDoor = i + 1 < N ? SCENES[i + 1].door : REST_POINT;
      const marginX = head ? head.left - 18 : (scene.door.cx / 100) * vw;
      // where the die rides while the head prints: the head's left margin
      // on desktop, the lane on mobile (there is no left margin to spare)
      const rideX = narrow ? laneX : marginX;
      const rideTopY = head ? head.top + 10 : vh * 0.2;
      const rideH = head ? Math.min(head.height, vh * 0.5) - 20 : vh * 0.3;
      if (!narrow && scene.id === 'leverage' && lp < BEAT.stampEnd) {
        const pivotX = vw * TARZAN.pivotX;
        // Still parked, still giant, on the pipeline's last tread — the cut
        // to this scene moves nothing. The scan line sweeping right→left is
        // the thing that finally strikes it off its perch.
        const prevItems = getRect(i - 1, 'items');
        const prevHead = getRect(i - 2, 'head');
        const prevHops = SCENES[i - 1].hops ?? 4;
        const bigHalf = (DIE_SIZE * STAIRS.scale * stK) / 2;
        const prevOffset = prevItems ? stairsAnchorOffset(prevItems, prevHead, stK, bigHalf) : { x: 0, y: 0 };
        const parkX = prevItems
          ? prevItems.left + (prevHops - 1) * STAIRS.stepX * stK + prevItems.width + STAIRS.landGap * stK + bigHalf + prevOffset.x
          : vw * 0.88;
        const parkY = prevItems
          ? prevItems.top + (prevHops - 1) * (prevItems.height / prevHops) - bigHalf - 4 + prevOffset.y
          : vh * 0.86;
        // the exact beat the scan's edge reaches the die's right FACE
        const hitLp = TARZAN.scanEnd * Math.min(0.96, Math.max(0.02, 1 - (parkX + bigHalf) / vw));
        const knockX = parkX - vw * 0.15;
        const knockY = parkY + 20;
        if (lp < hitLp) {
          txx = parkX;
          tyy = parkY;
          lev = { angle: 0, preHit: true, throwT: 0 };
        } else if (lp < hitLp + TARZAN.knockDur) {
          // struck: it shrinks on impact and is shoved leftward with the wall
          const q = (lp - hitLp) / TARZAN.knockDur;
          const e = 1 - (1 - q) * (1 - q);
          txx = parkX + (knockX - parkX) * e;
          tyy = parkY + (knockY - parkY) * e;
          lev = { angle: 0, preHit: false, throwT: 0 };
        } else if (lp < TARZAN.swingStart) {
          // plants itself and hurls the cord up to the top middle
          const throwT = Math.min(
            1,
            (lp - hitLp - TARZAN.knockDur) / Math.max(0.02, TARZAN.swingStart - hitLp - TARZAN.knockDur),
          );
          txx = knockX;
          tyy = knockY;
          lev = { angle: 0, preHit: false, throwT };
        } else {
          // Tarzan: winds up far left, then SLAMS into each part's left
          // edge — the head first, then every row, the cord playing out
          // lower each time. Contacts are measured from the real content
          // rects, so the impact point IS the part's edge and the die
          // never crosses onto the text.
          const head5 = getRect(i, 'head');
          const items5 = getRect(i, 'items');
          const hits: [number, number][] = [
            head5 ? [head5.left - DIE_SIZE / 2 - 6, head5.top + head5.height * 0.35] : [pivotX - 40, vh * 0.3],
          ];
          const rowsN = scene.hops ?? 3;
          if (items5) {
            const rH = items5.height / rowsN;
            for (let r = 0; r < rowsN; r += 1) {
              hits.push([items5.left - DIE_SIZE / 2 - 8, items5.top + (r + 0.5) * rH]);
            }
          }
          const span = (TARZAN.swingEnd - TARZAN.swingStart) / hits.length;
          const u = Math.min(hits.length - 0.0001, Math.max(0, (lp - TARZAN.swingStart) / span));
          const k = Math.floor(u);
          const tau = u - k;
          const thAt = (pt: [number, number]) => Math.atan2(pt[0] - pivotX, pt[1]);
          const lenAt = (pt: [number, number]) => Math.hypot(pt[0] - pivotX, pt[1]);
          const from: [number, number] = k === 0 ? [knockX, knockY] : hits[k - 1];
          const alpha = -(0.68 - k * 0.07); // wind-up extreme, decaying per pass
          let th: number;
          if (tau < 0.5) {
            // off the wall fast, slowing into the wind-up extreme
            const q = tau / 0.5;
            th = thAt(from) + (alpha - thAt(from)) * Math.sin((Math.PI / 2) * q);
          } else {
            // accelerates all the way INTO the impact — it slams, it
            // doesn't arrive
            const q = (tau - 0.5) / 0.5;
            th = alpha + (thAt(hits[k]) - alpha) * (1 - Math.cos((Math.PI / 2) * q));
          }
          const sm = tau * tau * (3 - 2 * tau);
          const L = lenAt(from) + (lenAt(hits[k]) - lenAt(from)) * sm;
          txx = pivotX + Math.sin(th) * L;
          tyy = Math.cos(th) * L;
          lev = { angle: th, preHit: false, throwT: 1 };
        }
      } else if (narrow && scene.id === 'leverage' && lp < BEAT.stampEnd) {
        // MOBILE Tarzan — the same story, restaged for the narrow theater.
        // The die is still parked giant on the pipeline's last tread (in
        // the right lane); the scan strikes it, it shrinks, is knocked
        // across the stage toward the LEFT rail, hurls the cord up to the
        // top-left corner and swings there — slamming the head in early
        // (so it gets a real reading window) and then each row exactly
        // when it prints. The content column has shifted right, so cord
        // and die work the left rail without ever crossing the text.
        const pivotX = vw * MOBILE_TARZAN.pivotX;
        const prevItems = getRect(i - 1, 'items');
        const prevHops = SCENES[i - 1].hops ?? 4;
        const bigHalf = (DIE_SIZE * MOBILE_STAIRS.scale) / 2;
        const parkX = laneGiantX;
        const parkY = prevItems
          ? prevItems.top + (prevHops - 1) * (prevItems.height / prevHops) - bigHalf - 4
          : vh * 0.8;
        const knockX = parkX - vw * 0.5;
        const knockY = parkY + 16;
        if (lp < MOBILE_TARZAN.hitLp) {
          txx = parkX;
          tyy = parkY;
          lev = { angle: 0, preHit: true, throwT: 0 };
        } else if (lp < MOBILE_TARZAN.hitLp + MOBILE_TARZAN.knockDur) {
          const q = (lp - MOBILE_TARZAN.hitLp) / MOBILE_TARZAN.knockDur;
          const e = 1 - (1 - q) * (1 - q);
          txx = parkX + (knockX - parkX) * e;
          tyy = parkY + (knockY - parkY) * e;
          lev = { angle: 0, preHit: false, throwT: 0 };
        } else if (lp < MOBILE_TARZAN.swingStart) {
          const throwT = Math.min(
            1,
            (lp - MOBILE_TARZAN.hitLp - MOBILE_TARZAN.knockDur) /
              Math.max(0.02, MOBILE_TARZAN.swingStart - MOBILE_TARZAN.hitLp - MOBILE_TARZAN.knockDur),
          );
          txx = knockX;
          tyy = knockY;
          lev = { angle: 0, preHit: false, throwT };
        } else {
          // contacts: the blocks' LEFT rect edge (the content column sits
          // right of the rail, so the die strikes just inside the rail and
          // the glyphs — 24px further in — are never touched)
          const head5 = getRect(i, 'head');
          const items5 = getRect(i, 'items');
          const hits: [number, number][] = [
            head5
              ? [head5.left + MOBILE_TARZAN.contactInset, head5.top + head5.height * 0.35]
              : [pivotX + 20, vh * 0.3],
          ];
          const rowsN = scene.hops ?? 3;
          if (items5) {
            const rH = items5.height / rowsN;
            for (let r = 0; r < rowsN; r += 1) {
              hits.push([items5.left + MOBILE_TARZAN.contactInset, items5.top + (r + 0.5) * rH]);
            }
          }
          // impact times are hand-placed (head early, rows on their beats)
          const times = MOBILE_TARZAN.hitTimes;
          let k = 0;
          while (k < times.length - 1 && lp >= times[k]) k += 1;
          k = Math.min(k, hits.length - 1);
          const segS = k === 0 ? MOBILE_TARZAN.swingStart : times[k - 1];
          const tau = Math.min(1, Math.max(0, (lp - segS) / Math.max(0.02, times[k] - segS)));
          const thAt = (pt: [number, number]) => Math.atan2(pt[0] - pivotX, pt[1]);
          const lenAt = (pt: [number, number]) => Math.hypot(pt[0] - pivotX, pt[1]);
          const from: [number, number] = k === 0 ? [knockX, knockY] : hits[k - 1];
          const alpha = -(0.62 - k * 0.06); // wind-up extreme, decaying per pass
          let th: number;
          if (tau < 0.5) {
            const q = tau / 0.5;
            th = thAt(from) + (alpha - thAt(from)) * Math.sin((Math.PI / 2) * q);
          } else {
            const q = (tau - 0.5) / 0.5;
            th = alpha + (thAt(hits[k]) - alpha) * (1 - Math.cos((Math.PI / 2) * q));
          }
          const sm = tau * tau * (3 - 2 * tau);
          const L = lenAt(from) + (lenAt(hits[k]) - lenAt(from)) * sm;
          txx = pivotX + Math.sin(th) * L;
          tyy = Math.cos(th) * L;
          lev = { angle: th, preHit: false, throwT: 1 };
        }
      } else if (mode === 'stairs') {
        // The freed giant: perches ON TOP of the title, then tips down the
        // staircase of rows — one quarter-turn per step, landing k lighting
        // row k up. Every anchor comes from the REAL content rects, so it
        // always descends along the stairs' outer edge, beside the text,
        // never over it (stepX > die width guarantees each tread's exposed
        // corner clears the row above).
        // MOBILE: the staircase turns VERTICAL — the giant (2.4×) perches
        // at the top of the lane and tumbles straight down it, one
        // quarter-turn per row rule, pausing on every tread. The descent
        // waits for the head to hand over the slot (two-beat).
        const half = narrow ? (DIE_SIZE * MOBILE_STAIRS.scale) / 2 : (DIE_SIZE * STAIRS.scale * stK) / 2;
        const stepXs = STAIRS.stepX * stK;
        const hopCount = scene.hops ?? 4;
        const dStart = narrow ? MOBILE_STAIRS.descentStart : STAIRS.descentStart;
        const dStep = narrow ? MOBILE_STAIRS.stepDur : STAIRS.stepDur;
        const P: [number, number][] = [];
        if (items && narrow) {
          const rowH = items.height / hopCount;
          // perch above the rows' slot, inside the lane, clear of the nav
          P.push([laneGiantX, Math.max(items.top - half - 46, 64 + half)]);
          for (let r = 0; r < hopCount; r += 1) {
            P.push([laneGiantX, items.top + r * rowH - half - 4]);
          }
        } else if (items) {
          const prevHead = getRect(i - 1, 'head');
          const rowH = items.height / hopCount;
          // die center sits landGap to the RIGHT of a row's text, so its
          // left edge clears the words and it stands on the rule's exposed
          // end. dx from the row's left = text width + gap + its own half
          const landDX = items.width + STAIRS.landGap * stK + half;
          const offset = stairsAnchorOffset(items, prevHead, stK, half);
          const firstTreadX = items.left + landDX + offset.x;
          const firstTreadY = items.top - half - 4 + offset.y;
          // The wave has already grown the die before this act starts. It
          // stays on that same vertical; the rows have been lowered, so only
          // the first impact moves down. Rotation starts after this collision.
          const firstDrop = Math.max(18, half * 0.22) + (prevHead ? STAIRS.rowShiftY : 0);
          P.push([firstTreadX, firstTreadY - firstDrop]);
          for (let r = 0; r < hopCount; r += 1) {
            // rests a hair ABOVE each row's rule — standing on the line,
            // never crossing it (the corner pivot keeps every corner at or
            // above this level through the whole tumble)
            P.push([items.left + r * stepXs + landDX + offset.x, items.top + r * rowH - half - 4 + offset.y]);
          }
        } else {
          P.push([(scene.door.cx / 100) * vw, (scene.door.cy / 100) * vh]);
        }
        const descentEnd = dStart + (P.length - 1) * dStep;
        if (lp < dStart || P.length < 2) {
          [txx, tyy] = P[0];
        } else if (lp < descentEnd) {
          const t = (lp - dStart) / dStep;
          const seg = Math.min(P.length - 2, Math.floor(t));
          const f = Math.min(1, t - seg);
          // the move fills only the first part of each step; the rest is a
          // dead stop on the tread — boxes pause between tips
          const m = Math.min(1, f / STAIRS.moveFrac);
          if (seg === 0 || narrow) {
            // off the perch (and every mobile tread): a straight gravity
            // drop onto the next rule — the quarter-turn itself lives in
            // the rotation block, so the tumble still reads as a box
            // tipping, just down a vertical shaft instead of sideways
            txx = P[seg][0] + (P[seg + 1][0] - P[seg][0]) * m;
            tyy = P[seg][1] + (P[seg + 1][1] - P[seg][1]) * (m * m);
          } else {
            // ONE continuous tumble — NO mid-air phase change, so the center
            // never stalls (the old two-phase split slammed the horizontal
            // speed from ~544 to ~18 px mid-fall, which read as a robotic
            // jump). A single accelerating angle drives BOTH the pivot arc
            // about the leading bottom corner AND the drop to the next tread,
            // so velocity is smooth: it hangs at the balance point, then
            // topples and accelerates down onto the line, landing with a thud.
            const e = m * m; // gravity ease-in — slow to overbalance, fast to fall
            const th = e * (Math.PI / 2);
            const cornerX = P[seg][0] + half; // leading bottom corner = step edge
            const cornerY = P[seg][1] + half;
            // the center swings on its half-diagonal about that corner
            // (radius half·√2): rises +0.41·half at 45°, back to rest at 90°.
            // Because stepX = 2·half, this arc alone carries x exactly one
            // tread right — no separate horizontal term to desync.
            const arcX = cornerX - half * Math.cos(th) + half * Math.sin(th);
            const arcY = cornerY - half * Math.sin(th) - half * Math.cos(th);
            txx = arcX;
            // fold in the extra vertical drop to the lower tread, phased by
            // the same accelerating e so the whole descent is one gravity fall
            tyy = arcY + (P[seg + 1][1] - P[seg][1]) * e;
          }
        } else {
          // stays put on the last tread through the end of the scene — the
          // NEXT scene's scan line is what knocks it off, not an exit walk
          [txx, tyy] = P[P.length - 1];
        }
      } else if (mode === 'multiply') {
        // parks at its door — exactly where the previous act dropped it —
        // for the whole act and reproduces from there. Once every copy has
        // folded back in it vanishes too (scale → 0 in the body-language
        // block below), drifts unseen to the far corner during the readable
        // gap, and is REBORN there as the re-run swarm collapses into it.
        if (lp < MULT.dieVanish + 0.02) {
          txx = (scene.door.cx / 100) * vw;
          tyy = (scene.door.cy / 100) * vh;
        } else {
          txx = (MULT.corner.cx / 100) * vw;
          tyy = (MULT.corner.cy / 100) * vh;
        }
      } else if (mode === 'rest') {
        // FINALE: it is still sitting at the bottom from the last act. The
        // content rises as one mass from below the frame and SHOVES it up
        // ahead of itself. As soon as that mass reaches its seated position,
        // gravity takes over on elapsed time — the user does not have to
        // spend any more scroll progress to make the die fall.
        const topY = 64 + DIE_SIZE / 2; // just clear of the fixed nav
        const startY = (MULT.corner.cy / 100) * vh;
        const riseT = Math.min(1, Math.max(0, (lp - FINALE.riseS) / (FINALE.riseE - FINALE.riseS)));
        const e = 1 - (1 - riseT) ** 3; // same ease as the content mass
        txx = vw * FINALE.x;
        if (lp < FINALE.riseE) {
          finaleDropStartedAt.current = null;
          const carry = Math.min(1, Math.max(0, (e - FINALE.contact) / (1 - FINALE.contact)));
          tyy = startY + (topY - startY) * carry;
        } else {
          if (finaleDropStartedAt.current === null) finaleDropStartedAt.current = tms;
          const elapsed = Math.max(0, tms - finaleDropStartedAt.current - FINALE.autoDropDelayMs);
          const d = Math.min(1, elapsed / FINALE.autoDropDurationMs);
          tyy = topY + (vh + 80 - topY) * d * d;
        }
      } else if (lp < BEAT.land) {
        txx = rideX;
        tyy = head ? head.top + 10 : (scene.door.cy / 100) * vh;
      } else if (lp < BEAT.rideEnd || (!items && mode !== 'rest')) {
        // ride down the head's margin while the text prints — the lane on
        // mobile, where the head leaves room for exactly this
        const t = Math.min(1, (lp - BEAT.land) / (BEAT.rideEnd - BEAT.land));
        txx = rideX;
        tyy = rideTopY + t * rideH;
      } else if (lp < BEAT.stampEnd) {
        const hopCount = scene.hops ?? 3;
        const t = (lp - BEAT.stampStart) / (BEAT.stampEnd - BEAT.stampStart);
        const k = Math.max(0, Math.min(hopCount - 1, Math.floor(t * hopCount)));
        switch (mode) {
          case 'shoot': {
            // firing post — desktop: parked where it finished riding the
            // head's margin. Mobile: parked at the TOP of the lane, above
            // the rows, firing its projectiles down-left into each bullet.
            txx = narrow ? laneX : marginX;
            tyy = narrow && items ? items.top - 24 : rideTopY + rideH;
            break;
          }
          case 'breathe': {
            // sits still at the foot of the text it just guided in
            txx = rideX;
            tyy = rideTopY + rideH;
            break;
          }
          default: {
            // roll / jump: land BESIDE each row's index, outside the block
            // on desktop; down the lane on mobile — level with each row,
            // clear of every word (this is BEM's no-spin gravity drop)
            txx = items ? (narrow ? laneX : items.left - 22) : rideX;
            tyy = items ? items.top + ((k + 0.5) / hopCount) * items.height : rideTopY + rideH;
          }
        }
      } else if (scene.id === 'auditor') {
        // After the final shot the protagonist stays AT the post, held in
        // place — barely trembling while its breathing turns violent. The
        // real fight is in the scale (see the strain block below), not in
        // sliding around.
        txx = narrow ? laneX : marginX;
        tyy = narrow && items ? items.top - 24 : rideTopY + rideH;
      } else if (scene.flyExit) {
        // CANNON: the content rockets off on its own — the die STAYS PUT
        // at its last stamp, tilts up like a barrel (see the aim block in
        // the rotation section), holds… then BOOM: launched on a ballistic
        // arc across the void, landing exactly where the next act begins.
        const hopCount = scene.hops ?? 3;
        const lastX = items ? (narrow ? laneX : items.left - 22) : rideX;
        const lastY = items ? items.top + ((hopCount - 0.5) / hopCount) * items.height : rideTopY + rideH;
        if (lp < CANNON.fireAt) {
          txx = lastX;
          tyy = lastY;
        } else {
          const t = Math.min(1, (lp - CANNON.fireAt) / (1 - CANNON.fireAt));
          // muzzle velocity: leaves fast, decelerates toward the landing
          const e = 1 - (1 - t) * (1 - t);
          const doorX = (exitDoor.cx / 100) * vw;
          const doorY = (exitDoor.cy / 100) * vh;
          txx = lastX + (doorX - lastX) * e;
          // arcs ABOVE the straight line — a shot, not a slide
          tyy = lastY + (doorY - lastY) * e - Math.sin(e * Math.PI) * vh * 0.1;
        }
      } else {
        // walk to the exit door and cross into the void
        txx = (exitDoor.cx / 100) * vw;
        tyy = (exitDoor.cy / 100) * vh;
      }
    }

    // a single NaN (mid-HMR state, first-frame rect race) would poison the
    // springs FOREVER — never let one through
    if (!Number.isFinite(txx) || !Number.isFinite(tyy)) return;
    if (!inited.current) {
      x.jump?.(txx);
      y.jump?.(tyy);
      prev.current = { x: txx, y: tyy };
      inited.current = true;
    }
    tx.set(txx);
    ty.set(tyy);

    // ── body language, per persona ──
    const cx = x.get();
    const cyv = y.get();
    const pr = prev.current!;
    const dx = cx - pr.x;
    const dy = cyv - pr.y;
    prev.current = { x: cx, y: cyv };
    const speed = Math.hypot(dx, dy);
    const dir = dx !== 0 ? Math.sign(dx) : dy >= 0 ? 1 : -1;
    // ── strain → BREAK → giant (the bundle that holds it finally snaps) ──
    // During the auditor → pipeline transition, the die strains, grows, and
    // throws the black square wave that becomes the next room.
    const strainT = scene.id === 'auditor' ? Math.max(0, (lp - BEAT.stampEnd) / (1 - BEAT.stampEnd)) : 0;
    if (lev) {
      // the cord: nonexistent until thrown, then drawn from the die's own
      // position up to the top-middle anchor it was hurled at
      const te = 1 - (1 - lev.throwT) * (1 - lev.throwT);
      const pivotFrac = narrow ? MOBILE_TARZAN.pivotX : TARZAN.pivotX;
      vineX1.set(cx + (vw * pivotFrac - cx) * te);
      vineY1.set(cyv * (1 - te));
      vineOpacity.set(lev.throwT > 0.02 ? 1 : 0);
      // still giant on the pipeline's last tread until the scan line
      // physically strikes it — the impact is what shrinks it
      dieScale.set(lev.preHit ? (narrow ? MOBILE_STAIRS.scale : STAIRS.scale * stK) : 1);
      shakeX.set(0);
      shakeY.set(0);
    } else if (strainT > 0) {
      vineOpacity.set(0);
      const growT = Math.min(1, Math.max(0, (lp - AUDITOR_WAVE.start) / (AUDITOR_WAVE.end - AUDITOR_WAVE.start)));
      const growE = growT * growT * (3 - 2 * growT);
      // The strain has a real payoff on both stages: it breaks free and
      // grows into the size its staircase needs (phone staircase = 2.4×).
      // Softer tremble on mobile — at hand size a violent shake reads as
      // jitter, not effort.
      const growTarget = narrow ? MOBILE_STAIRS.scale : STAIRS.scale * stK;
      const shakeAmp = narrow ? 0.55 : 1;
      dieScale.set(1 + growE * (growTarget - 1) + Math.abs(Math.sin(tms / 95)) * 0.24 * strainT);
      const settle = 1 - growT * 0.65;
      shakeX.set(Math.sin(tms / 30) * (2.5 + growT * 2) * strainT * settle * shakeAmp);
      shakeY.set(Math.cos(tms / 37) * (2 + growT * 1.5) * strainT * settle * shakeAmp);
    } else if (mode === 'stairs') {
      vineOpacity.set(0);
      dieScale.set(narrow ? MOBILE_STAIRS.scale : STAIRS.scale * stK);
      shakeX.set(0);
      shakeY.set(0);
    } else if (mode === 'multiply') {
      vineOpacity.set(0);
      // gone with its copies: once the last one folds back in, the die
      // swallows itself too and the text stands alone for the readable
      // gap. It pops back (spring overshoot = rebirth) at the far corner
      // just as the re-run swarm is absorbed into that point.
      const hidden = lp >= MULT.dieVanish && lp < MULT.rebirth;
      dieScale.set(hidden ? 0 : 1);
      shakeX.set(0);
      shakeY.set(0);
    } else {
      vineOpacity.set(0);
      dieScale.set(1);
      shakeX.set(0);
      shakeY.set(0);
    }

    if (mode === 'roll') {
      // tumble: rotation follows the distance actually traveled
      dist.current += speed * dir;
      if (speed < 0.4) {
        // dice don't rest on their edges — settle flat on the nearest face
        const cur = rot.get();
        const snap = Math.round(cur / 90) * 90;
        const next = cur + (snap - cur) * 0.16;
        rot.set(next);
        dist.current = (next / 90) * DIE_SIZE;
        hop.set(0);
        // The opening die must remain perfectly anchored before the line
        // arrives; even the idle breath used to read as a small lift.
        stretch.set(scene.id === 'hero' ? 1 : 1 + Math.sin(tms / 480) * 0.05);
      } else {
        const steps = dist.current / DIE_SIZE;
        const f = ((steps % 1) + 1) % 1;
        const eased = f * f * (3 - 2 * f);
        rot.set((Math.floor(steps) + eased) * 90);
        const energy = Math.min(1, speed / 3);
        // In the first scene the center follows a level rail: rotation gives
        // the rolling read, but no vertical hop or squash can make it appear
        // to rise before the ground line enters.
        hop.set(scene.id === 'hero' ? 0 : -Math.sin(f * Math.PI) * DIE_SIZE * 0.32 * energy);
        stretch.set(scene.id === 'hero' ? 1 : 1 + Math.sin(f * Math.PI) * 0.1 * energy);
      }
    } else {
      // non-rolling personas: the face settles square; motion is in the body
      const cur = rot.get();
      const snap = Math.round(cur / 90) * 90;
      // 'fall' is frozen absolutely flat — zero rotation, not even the
      // small settle-nudge the other personas get, so the drop reads as
      // pure gravity with no spin whatsoever.
      let nextRot = mode === 'fall' ? snap : cur + (snap - cur) * 0.14;
      let nextStretch = 1;
      const energy = Math.min(1, speed / 2.5);
      if (mode === 'fall') {
        // heavy drop arc, big squash on impact
        hop.set(-energy * DIE_SIZE * 1.15);
        nextStretch = 1 + energy * 0.4;
      } else {
        // The finale already has its own gravity path. Adding the generic
        // reaction hop here would briefly pull against that downward motion.
        hop.set(mode === 'rest' ? 0 : -energy * DIE_SIZE * 0.2);
      }
      // cannon aim: after its act's content rockets off, the fly-exit die
      // tilts toward the next act's landing point like a barrel — and keeps
      // that lean through the whole shot, righting itself only after landing
      if (scene.flyExit && lp >= CANNON.aimS) {
        const aimT = Math.min(1, Math.max(0, (lp - CANNON.aimS) / (CANNON.aimE - CANNON.aimS)));
        nextRot = snap + CANNON.tilt * (aimT * aimT * (3 - 2 * aimT));
        hop.set(0);
      }
      if (mode === 'shoot' && lp >= BEAT.stampStart && lp < BEAT.stampEnd) {
        // Firing reaction: a gun-like KICKBACK away from the shot (the rows
        // are down-left of the post, so the kick is up-right) plus a squash
        // pump. No rotation — a shooter braces, it doesn't spin. The spike
        // lands exactly on each shot's `fire` beat (see shotBeats), so the
        // mini die visibly leaves the big one on the reaction itself.
        const hopCount = scene.hops ?? 3;
        const phase = ((lp - BEAT.stampStart) / (BEAT.stampEnd - BEAT.stampStart)) * hopCount;
        const frac = ((phase % 1) + 1) % 1;
        const recoil = Math.max(0, 1 - frac * 5);
        // mostly vertical so the kick lifts it clear of the tags row beside
        // the post instead of shoving it onto them
        tx.set(txx + recoil * 6);
        ty.set(tyy - recoil * 16);
        nextStretch = Math.max(nextStretch, 1 + recoil * 0.22);
      }
      if (speed < 0.4) {
        // still — just breathing
        nextStretch = 1 + Math.sin(tms / 480) * 0.05;
        hop.set(0);
      }
      if (lev) {
        // rigid pendulum: the die tilts with the cord it hangs from
        nextRot = (lev.angle * 180) / Math.PI;
        hop.set(0);
        // impact pump — a sharp pulse the instant each slam connects,
        // recovering while it rebounds away from the part it just hit
        // (mobile impacts are hand-placed; desktop's are evenly spaced)
        let pulse = 0;
        if (narrow) {
          for (const ht of MOBILE_TARZAN.hitTimes) {
            const d = (lp - ht) / 0.016;
            if (d >= 0 && d < 1) pulse = Math.max(pulse, 1 - d);
          }
        } else {
          const hitSpan = (TARZAN.swingEnd - TARZAN.swingStart) / ((scene.hops ?? 3) + 1);
          for (let h = 1; h <= (scene.hops ?? 3) + 1; h += 1) {
            const d = (lp - (TARZAN.swingStart + h * hitSpan)) / 0.016;
            if (d >= 0 && d < 1) pulse = Math.max(pulse, 1 - d);
          }
        }
        nextStretch = Math.max(nextStretch, 1 + pulse * 0.3);
      }
      // Staircase descent: exactly one quarter-turn per step, like a box
      // tipping over its leading edge down real stairs. Face stays square
      // between steps; the strain phases never rotate it (a fighter braces).
      const hopCount = scene.hops ?? 4;
      const rotDStart = narrow ? MOBILE_STAIRS.descentStart : STAIRS.descentStart;
      const rotDStep = narrow ? MOBILE_STAIRS.stepDur : STAIRS.stepDur;
      const descentEnd = rotDStart + hopCount * rotDStep;
      if (lev) {
        stairRotBase.current = null;
      } else if (mode === 'stairs' && lp >= rotDStart && lp < descentEnd) {
        const t = (lp - rotDStart) / rotDStep;
        const seg = Math.floor(t);
        const f = Math.min(1, t - seg);
        const m = Math.min(1, f / STAIRS.moveFrac);
        if (stairRotBase.current === null) stairRotBase.current = snap;
        // mirrors the single-phase tumble EXACTLY: seg 0 is the perch drop
        // (no spin); every stair after is one quarter-turn driven by the
        // same accelerating e = m², so rotation and position stay locked
        const e = seg === 0 ? 0 : m * m;
        nextRot = stairRotBase.current + (Math.max(0, seg - 1) + e) * 90;
        hop.set(0);
        // stretches as the fall accelerates, then a sharp landing squash
        // that recovers over the dead rest — the impact is what sells weight
        const impact = f > STAIRS.moveFrac ? Math.max(0, 1 - (f - STAIRS.moveFrac) / 0.14) : 0;
        nextStretch = m < 1 ? 1 + m * 0.06 : 1 - impact * 0.1;
      } else {
        stairRotBase.current = null;
      }
      rot.set(nextRot);
      stretch.set(nextStretch);
      // keep the tumble odometer in sync with the settled face, so when the
      // die starts rolling again it continues from THIS angle instead of
      // popping back to the old mid-tumble one (it re-enters balanced)
      dist.current = (nextRot / 90) * DIE_SIZE;
    }

  });

  return (
    // NOTE: no zIndex — a z-indexed/transformed ancestor isolates the
    // stacking context and kills mix-blend-mode. DOM order stacks this last.
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.svg className="absolute inset-0 h-full w-full" style={{ opacity: vineOpacity, mixBlendMode: 'difference' }}>
        <motion.line x1={vineX1} y1={vineY1} x2={x} y2={y} stroke="#ffffff" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </motion.svg>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          x,
          y,
          opacity: dieOpacity,
          mixBlendMode: dieBlend,
          // pins this to a single stable GPU layer instead of letting the
          // browser promote/demote it every frame — without this hint,
          // Chromium periodically drops a frame's paint on rotated
          // mix-blend-mode layers, which reads as the leading corner
          // flickering/vanishing mid-tumble
          willChange: 'transform',
        }}
      >
        <motion.div
          style={{
            width: DIE_SIZE,
            height: DIE_SIZE,
            margin: `${-DIE_SIZE / 2}px 0 0 ${-DIE_SIZE / 2}px`,
            x: shakeX,
            y: shakeY,
            scale: dieScaleSpring,
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              background: dieFill,
              rotate: rot,
              y: hop,
              scaleY: stretch,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Multiply — the die's BLACK offspring (rendered inside ToolsRoom, over
// its white base). Born small inside the die, each flies to its grid slot
// while growing until the tiles overlap and the stage is solid black. They
// HOLD that coverage through the readable beat (black on the black void —
// invisible, but that's the point: they ARE the background). Then, farthest
// from the corner first, each shrinks and slides INTO the lower-right
// corner, peeling the black away to reveal the white underneath.
const CLONE_COLS = 8;
const CLONE_ROWS = 5;

function CloneField({ p, i }: { p: MotionValue<number>; i: number }) {
  const scene = SCENES[i];
  const cells: { cx: number; cy: number; d1: number; d2: number }[] = [];
  let maxD1 = 0;
  let maxD2 = 0;
  for (let r = 0; r < CLONE_ROWS; r += 1) {
    for (let c = 0; c < CLONE_COLS; c += 1) {
      const cx = ((c + 0.5) / CLONE_COLS) * 100;
      const cy = ((r + 0.5) / CLONE_ROWS) * 100;
      const d1 = Math.hypot(cx - scene.door.cx, cy - scene.door.cy);
      const d2 = Math.hypot(cx - MULT.corner.cx, cy - MULT.corner.cy);
      maxD1 = Math.max(maxD1, d1);
      maxD2 = Math.max(maxD2, d2);
      cells.push({ cx, cy, d1, d2 });
    }
  }
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {cells.map((cell, idx) => (
        <CloneCell
          key={idx}
          p={p}
          s={i * W}
          cx={cell.cx}
          cy={cell.cy}
          d1={cell.d1 / maxD1}
          d2={cell.d2 / maxD2}
          doorX={scene.door.cx}
          doorY={scene.door.cy}
        />
      ))}
    </div>
  );
}

function CloneCell({
  p,
  s,
  cx,
  cy,
  d1,
  d2,
  doorX,
  doorY,
}: {
  p: MotionValue<number>;
  s: number;
  cx: number;
  cy: number;
  d1: number;
  d2: number;
  doorX: number;
  doorY: number;
}) {
  // birth: leaves the INSIDE of the die small, nearest cells first, and
  // grows on the way to its slot until the tiles overlap into solid black
  const g0 = s + W * (MULT.birth0 + d1 * MULT.birthSpan);
  const g1 = g0 + W * MULT.birthDur;
  // retraction: farthest-from-corner first — the white is revealed from
  // the top-left down as each tile shrinks and slides INTO the corner
  const r0 = s + W * (MULT.re0 + (1 - d2) * MULT.reSpan);
  const r1 = r0 + W * MULT.retractDur;
  // scale 0 (nonexistent) until the exact birth beat — the clamp would
  // otherwise leave every tile sitting visible at its small birth size
  // through the whole previous scene
  const scale = useTransform(p, [g0 - 0.0001, g0, g1, r0, r1], [0, 0.08, 1.12, 1.12, 0], { clamp: true });
  // where the tile is relative to its slot: +1 = inside the die at the
  // door, −1 = at the far corner, 0 = seated in its own grid cell
  const drift = useTransform(p, (v) => {
    if (v <= g1) {
      const t = Math.min(1, Math.max(0, (v - g0) / (W * MULT.birthDur)));
      return 1 - t * (2 - t); // ease-out flight OUT of the die
    }
    if (v >= r0) {
      const t = Math.min(1, Math.max(0, (v - r0) / (W * MULT.retractDur)));
      return -(t * t); // accelerates INTO the corner
    }
    return 0;
  });
  const x = useTransform(drift, (f) => `calc(-50% + ${((f >= 0 ? doorX - cx : cx - MULT.corner.cx) * f).toFixed(2)}vw)`);
  const y = useTransform(drift, (f) => `calc(-50% + ${((f >= 0 ? doorY - cy : cy - MULT.corner.cy) * f).toFixed(2)}vh)`);
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${cx}%`,
        top: `${cy}%`,
        width: `${100 / CLONE_COLS + 0.4}vw`,
        height: `${100 / CLONE_ROWS + 0.4}vh`,
        x,
        y,
        scale,
        background: DARK,
      }}
    />
  );
}

// ─── Reduced-motion fallback — same content, static stack ─────────────────

function StaticFallback() {
  return (
    <div className="mx-auto max-w-4xl space-y-24 px-6 py-20">
      <div>
        <p className="type-micro uppercase mb-4" style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.5)' }}>
          AI Practice
        </p>
        <p className="type-pull-quote" style={{ color: 'rgba(17,17,17,0.75)' }}>
          {MANIFESTO_A} — {MANIFESTO_B.toLowerCase()}
        </p>
      </div>
      {SCENES.filter((sc) => sc.title).map((sc) => (
        <div key={sc.id}>
          <p className="type-micro uppercase mb-4" style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.5)' }}>
            {sc.kicker}
          </p>
          <h2 className="type-display-l" style={{ color: 'var(--color-ink)', fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 1.08 }}>
            {sc.title}
          </h2>
          {sc.body && (
            <p className="type-body mt-5" style={{ maxWidth: 640, color: 'rgba(17,17,17,0.7)' }}>
              {sc.body}
            </p>
          )}
          {sc.body2 && (
            <p className="type-body mt-3" style={{ maxWidth: 640, color: 'rgba(17,17,17,0.6)' }}>
              {sc.body2}
            </p>
          )}
          {sc.items?.map((item) => (
            <div key={item.title} className="mt-5">
              <p className="type-meta uppercase" style={{ color: 'rgba(17,17,17,0.86)' }}>
                {item.title}
              </p>
              <p className="type-body mt-1" style={{ maxWidth: 640, color: 'rgba(17,17,17,0.66)' }}>
                {item.detail}
              </p>
            </div>
          ))}
          {sc.groups?.map((group) => (
            <div key={group.title} className="mt-6">
              <p className="type-micro uppercase mb-2" style={{ ...TECH_LABEL_STYLE, color: 'var(--color-ink)' }}>
                {group.title}
              </p>
              {group.items.map(([name, use]) => (
                <p key={name} className="type-body" style={{ color: 'rgba(17,17,17,0.7)' }}>
                  {name} — {use}
                </p>
              ))}
            </div>
          ))}
          {sc.knowledge?.map(([title, body]) => (
            <div key={title} className="mt-5">
              <p className="type-meta uppercase" style={{ color: 'rgba(17,17,17,0.86)' }}>
                {title}
              </p>
              <p className="type-body mt-1" style={{ maxWidth: 640, color: 'rgba(17,17,17,0.66)' }}>
                {body}
              </p>
            </div>
          ))}
          {sc.tags && (
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              {sc.tags.map((tag) => (
                <span
                  key={tag}
                  className="type-micro uppercase"
                  style={{ ...TECH_LABEL_STYLE, color: 'rgba(17,17,17,0.6)', borderTop: '1px solid rgba(17,17,17,0.28)', paddingTop: 8 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
