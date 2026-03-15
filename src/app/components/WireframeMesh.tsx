import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface WireframeMeshProps {
  isMobile: boolean;
}

export function WireframeMesh({ isMobile }: WireframeMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const COLS = 34;
    const ROWS = 22;
    const STROKE_COLOR = '#1e1e1e';

    let t = 0;

    // Mouse state — plain object so the draw closure always reads current values
    const mouse = { u: 0.5, v: 0.5, inside: false };
    let hoverStrength = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.u = (e.clientX - rect.left) / rect.width;
      mouse.v = (e.clientY - rect.top) / rect.height;
      mouse.inside =
        mouse.u >= 0 && mouse.u <= 1 && mouse.v >= 0 && mouse.v <= 1;
    };
    const onMouseLeave = () => { mouse.inside = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const RX = -0.28;
    const RY = 0.14;

    const project = (x: number, y: number, z: number, cw: number, ch: number) => {
      const cosY = Math.cos(RY), sinY = Math.sin(RY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      const cosX = Math.cos(RX), sinX = Math.sin(RX);
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const fov = 700;
      const d = fov / (fov + z2 + 300);
      return { sx: cw * 0.62 + x1 * d, sy: ch * 0.5 + y1 * d };
    };

    const surfaceZ = (u: number, v: number, time: number, hover: number) => {
      // More waves near the left edge
      const turbulence = 1.0 + 2.2 * (1 - u);
      const w1 = Math.sin(u * Math.PI * 2.5 + time * 0.7) * 55 * turbulence;
      const w2 = Math.cos(v * Math.PI * 2 + time * 0.5) * 35 * turbulence;
      const w3 = Math.sin((u * 2 + v) * Math.PI * 1.5 + time * 0.4) * 22 * turbulence;
      const twist = Math.sin(v * Math.PI * 0.8 + time * 0.3) * (u - 0.5) * 80;

      // Hover distortion: Gaussian bump + chaotic ripple at cursor position
      const du = u - mouse.u;
      const dv = v - mouse.v;
      const dist2 = du * du + dv * dv;
      const bump = Math.exp(-dist2 * 22) * 200 * hover;
      const ripple = Math.exp(-dist2 * 40) *
        Math.sin(Math.sqrt(dist2) * 28 - time * 6) * 90 * hover;

      return w1 + w2 + w3 + twist + bump + ripple;
    };

    const draw = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      // Smoothly ease hover strength in/out
      const target = mouse.inside ? 1 : 0;
      hoverStrength += (target - hoverStrength) * 0.06;

      const spanX = cw * 1.1;
      const spanYBase = ch * 1.05;

      const pts: { sx: number; sy: number }[][] = [];
      for (let j = 0; j <= ROWS; j++) {
        pts[j] = [];
        for (let i = 0; i <= COLS; i++) {
          const u = i / COLS;
          const v = j / ROWS;
          const x = (u - 0.5) * spanX;
          const heightScale = 0.18 + 0.82 * u;
          const y = (v - 0.5) * spanYBase * heightScale;
          const z = surfaceZ(u, v, t, hoverStrength);
          pts[j][i] = project(x, y, z, cw, ch);
        }
      }

      ctx.strokeStyle = STROKE_COLOR;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.42;

      for (let j = 0; j <= ROWS; j++) {
        ctx.beginPath();
        for (let i = 0; i <= COLS; i++) {
          const { sx, sy } = pts[j][i];
          i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        for (let j = 0; j <= ROWS; j++) {
          const { sx, sy } = pts[j][i];
          j === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      if (!shouldReduceMotion) t += 0.007;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [shouldReduceMotion]);

  if (isMobile) {
    return (
      <motion.div
        className="w-full overflow-hidden"
        style={{
          height: 200,
          maskImage: 'linear-gradient(to right, transparent 0%, black 100%), linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 100%), linear-gradient(to bottom, black 55%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute right-0 top-0 bottom-0 pointer-events-none overflow-hidden"
      style={{
        width: '90%',
        maskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
      }}
      initial={shouldReduceMotion ? { opacity: 1 } : { x: '100%' }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </motion.div>
  );
}
