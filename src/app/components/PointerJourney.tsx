import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────
// PointerJourney — the crosshair "character" that travels the AI screen.
//
// A persistent vertical + horizontal line (very faint) whose intersection is a
// visible square. It reads global scroll, finds the active section, and drives
// the square to a target with useSpring (organic inertia/overshoot). Each
// section has its own movement STYLE so the pointer mimics what that section
// is about (label / scan / orbit / explore / draw-network / breathe).
//
// It is a pointer-events:none overlay — it never blocks the existing content
// or animations, it only travels over them.
// ─────────────────────────────────────────────────────────────────────────

type Style = 'arc' | 'staccato' | 'scanV' | 'orbit' | 'hop' | 'network' | 'breathe';

type Station = {
  id: string;
  style: Style;
  // Anchor points / zones expressed as viewport fractions (x,y in 0..1).
  points?: [number, number][];
  zone?: { x: number; y: number };
  center?: [number, number];
  radius?: [number, number];
  scanX?: number;
  scanY?: [number, number];
  passes?: number;
};

const STATIONS: Station[] = [
  // 00 hero — pointer wanders/builds at center, gentle arc
  { id: 'ai-hero', style: 'arc', zone: { x: 0.46, y: 0.5 } },
  // 01 bem — labels: staccato hops between discrete points (left visual zone)
  { id: 'bem-namer', style: 'staccato', points: [[0.2, 0.32], [0.27, 0.46], [0.17, 0.6], [0.29, 0.72]] },
  // 02 auditor — scan: methodical vertical sweep, several passes
  { id: 'figma-auditor', style: 'scanV', scanX: 0.22, scanY: [0.26, 0.8], passes: 3 },
  // 03 pipeline — orbit: circles the rotating object
  { id: 'wcag-pipeline', style: 'orbit', center: [0.25, 0.52], radius: [0.09, 0.15] },
  // 04 leverage — explore: quick curious hops between 3 frames
  { id: 'ai-leverage', style: 'hop', points: [[0.18, 0.34], [0.16, 0.62], [0.3, 0.74]] },
  // 05 tools — draw the network node by node
  { id: 'tools', style: 'network', points: [[0.36, 0.42], [0.5, 0.32], [0.63, 0.46], [0.46, 0.58], [0.4, 0.5], [0.6, 0.62]] },
  // 06 knowledge — breathe and descend slowly through the learnings
  { id: 'knowledge', style: 'breathe', scanX: 0.3, scanY: [0.32, 0.74] },
];

const SPRING = { stiffness: 90, damping: 18, mass: 1.1 } as const;

function triangle(t: number) {
  // 0→1→0 triangle wave
  const x = t % 1;
  return x < 0.5 ? x * 2 : 2 - x * 2;
}

export function PointerJourney() {
  const shouldReduceMotion = useReducedMotion();

  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const x = useSpring(tx, SPRING);
  const y = useSpring(ty, SPRING);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const opacity = useMotionValue(0);

  const idleSince = useRef(0);
  const lastActive = useRef(0);

  useAnimationFrame((t) => {
    if (shouldReduceMotion) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mid = vh / 2;

    // Find the active station: the one whose box contains the viewport center.
    let activeIndex = -1;
    let localP = 0;
    for (let i = 0; i < STATIONS.length; i += 1) {
      const el = document.getElementById(STATIONS[i].id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) {
        activeIndex = i;
        localP = Math.min(1, Math.max(0, (mid - r.top) / Math.max(1, r.height)));
        break;
      }
    }

    if (activeIndex === -1) {
      // Between/outside sections — fade the pointer out, keep last position.
      opacity.set(Math.max(0, opacity.get() - 0.04));
      return;
    }
    opacity.set(Math.min(1, opacity.get() + 0.05));
    lastActive.current = activeIndex;

    const st = STATIONS[activeIndex];
    let fx = 0.5;
    let fy = 0.5;

    switch (st.style) {
      case 'arc': {
        const z = st.zone!;
        fx = z.x + Math.sin(localP * Math.PI * 2) * 0.1;
        fy = z.y + Math.sin(localP * Math.PI * 4) * 0.05;
        break;
      }
      case 'staccato':
      case 'hop':
      case 'network': {
        const pts = st.points!;
        const idx = Math.min(pts.length - 1, Math.floor(localP * pts.length));
        fx = pts[idx][0];
        fy = pts[idx][1];
        break;
      }
      case 'scanV': {
        fx = st.scanX!;
        const [y0, y1] = st.scanY!;
        fy = y0 + (y1 - y0) * triangle(localP * (st.passes ?? 2));
        break;
      }
      case 'orbit': {
        const [cx, cy] = st.center!;
        const [rx, ry] = st.radius!;
        const ang = localP * Math.PI * 2 * 2; // two loops across the section
        fx = cx + Math.cos(ang) * rx;
        fy = cy + Math.sin(ang) * ry;
        break;
      }
      case 'breathe': {
        fx = st.scanX!;
        const [y0, y1] = st.scanY!;
        fy = y0 + (y1 - y0) * localP;
        break;
      }
    }

    tx.set(fx * vw);
    ty.set(fy * vh);

    // Squash & stretch from spring velocity. Horizontal motion widens, vertical
    // motion stretches taller; volume roughly preserved.
    const vx = Math.abs(x.getVelocity());
    const vy = Math.abs(y.getVelocity());
    const speed = Math.hypot(vx, vy);
    const K = 2600;
    let sX = 1 + (vx - vy) / K;
    let sY = 1 + (vy - vx) / K;

    // Breathing when nearly idle (notably in the closing 'breathe' section).
    if (speed < 60) {
      if (!idleSince.current) idleSince.current = t;
      const idleMs = t - idleSince.current;
      if (idleMs > 220) {
        const b = 1 + Math.sin(t / 520) * 0.14;
        sX *= b;
        sY *= b;
      }
    } else {
      idleSince.current = 0;
    }

    scaleX.set(Math.min(1.5, Math.max(0.66, sX)));
    scaleY.set(Math.min(1.5, Math.max(0.66, sY)));
  });

  if (shouldReduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40 }}
    >
      <motion.div style={{ opacity, position: 'absolute', inset: 0 }}>
        {/* Vertical line — faint, moves left/right with x */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 1,
            background: 'rgba(17,17,17,0.13)',
            x,
          }}
        />
        {/* Horizontal line — faint, moves up/down with y */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 1,
            background: 'rgba(17,17,17,0.13)',
            y,
          }}
        />
        {/* The square — the visible pointer at the intersection */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 14,
            height: 14,
            margin: '-7px 0 0 -7px',
            background: 'var(--color-ink)',
            border: '1.5px solid var(--color-accent)',
            x,
            y,
            scaleX,
            scaleY,
          }}
        />
      </motion.div>
    </div>
  );
}
