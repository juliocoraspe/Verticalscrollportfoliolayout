import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import * as THREE from 'three';

interface WireframeMeshProps {
  isMobile: boolean;
}

// ── Height function — ported directly from reference ─────────────────────────

function sinNoise(x: number, z: number, freq: number, amp: number): number {
  return (
    Math.sin(x * freq) * Math.cos(z * freq * 0.8) * amp +
    Math.sin(x * freq * 2.1 + 1) * Math.cos(z * freq * 1.7 + 2) * amp * 0.5 +
    Math.sin(x * freq * 3.7 + 3) * Math.cos(z * freq * 2.3 + 1) * amp * 0.25
  );
}

function ridge(x: number, z: number): number {
  const r = Math.sqrt(x * x + z * z);
  const baseHeight = Math.max(0, 45 - r * 0.6);
  const n =
    sinNoise(x, z, 0.06, 8) +
    sinNoise(x, z, 0.12, 4) +
    sinNoise(x * 0.7 + 5, z * 0.8 + 3, 0.18, 2);
  const spiky =
    Math.pow(Math.max(0, 1 - r / 38), 2.2) * 2 * Math.abs(sinNoise(x, z, 0.15, 1));
  const d1 = Math.sqrt((x + 4) * (x + 4) + z * z);
  const d2 = Math.sqrt((x - 6) * (x - 6) + (z - 3) * (z - 3));
  const d3 = Math.sqrt((x + 14) * (x + 14) + (z + 5) * (z + 5));
  const d4 = Math.sqrt((x - 18) * (x - 18) + (z - 8) * (z - 8));
  const peak1 = Math.max(0, 38 - Math.pow(d1, 0.78) * 4.2);
  const peak2 = Math.max(0, 30 - Math.pow(d2, 0.78) * 5.0);
  const peak3 = Math.max(0, 22 - d3 * 2.4);
  const peak4 = Math.max(0, 18 - d4 * 2.6);

  const da = Math.sqrt((x + 9)  * (x + 9)  + (z - 3) * (z - 3));
  const db = Math.sqrt((x - 1)  * (x - 1)  + (z + 6) * (z + 6));
  const dc = Math.sqrt((x + 5)  * (x + 5)  + (z + 8) * (z + 8));
  const dd = Math.sqrt((x - 3)  * (x - 3)  + (z - 7) * (z - 7));
  const de = Math.sqrt((x + 13) * (x + 13) + (z + 1) * (z + 1));
  const peaka = Math.max(0, 10 - Math.pow(da, 0.78) * 3.8);
  const peakb = Math.max(0,  9 - Math.pow(db, 0.78) * 4.0);
  const peakc = Math.max(0,  8 - Math.pow(dc, 0.78) * 4.2);
  const peakd = Math.max(0,  8 - Math.pow(dd, 0.78) * 4.5);
  const peake = Math.max(0,  7 - Math.pow(de, 0.76) * 3.5);

  return baseHeight + n + spiky + peak1 + peak2 + peak3 + peak4
       + peaka + peakb + peakc + peakd + peake;
}

// ── Shaders ───────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  varying float vY;
  void main() {
    vY = position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vY;
  uniform float uMaxY;
  uniform float uMinY;
  void main() {
    float t = clamp((vY - uMinY) / (uMaxY - uMinY), 0.0, 1.0);
    float alpha = pow(t, 1.6);
    float brightness = mix(0.75, 0.04, t);
    gl_FragColor = vec4(vec3(brightness), alpha);
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────

// Approximate fraction of canvas width where the mountain visually appears.
// The Three.js mesh is offset right (x=71) so the mountain is not at canvas center.
const MOUNTAIN_CANVAS_FRACTION = 0.80;

export function WireframeMesh({ isMobile }: WireframeMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // outerRef: outer wrapper, imperatively controlled for scroll animation
  const outerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const scrollRAFRef = useRef<number>(0);
  const mobileWrapRef = useRef<HTMLDivElement>(null);
  const mobileScaleRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const mobileAnchoredYRef = useRef(0);
  const mobileScrollRAFRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  // ── Three.js setup ─────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      width: '100%', height: '100%', display: 'block',
    });
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000,
    );

    const W = 160, D = 160, segs = 100;
    const geo = new THREE.PlaneGeometry(W, D, segs, segs);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const count = pos.count;

    let maxY = 0;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const y = Math.max(0, ridge(x, z));
      pos.setY(i, y);
      if (y > maxY) maxY = y;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMaxY: { value: maxY },
        uMinY: { value: 0.0 },
      },
      wireframe: true,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.setScalar(isMobile ? 0.5 : 0.75);
    mesh.position.set(isMobile ? 0 : 71, -8, 5);
    scene.add(mesh);

    const fg = new THREE.Group();
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i);
      if (y > 0.5 && y < 4) {
        const x = pos.getX(i), z = pos.getZ(i);
        const r = Math.sqrt(x * x + z * z);
        if (r > 30 && Math.random() < 0.038) {
          const len = (Math.random() * 18 + 5) * (1 - y / 4);
          const topAlpha = (y / 4) * 0.35;
          const pts = [
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(
              x + (Math.random() - 0.5) * 6,
              y - len,
              z + (Math.random() - 0.5) * 6,
            ),
          ];
          const lg = new THREE.BufferGeometry().setFromPoints(pts);
          const lm = new THREE.LineBasicMaterial({
            color: 0x111111,
            transparent: true,
            opacity: topAlpha,
          });
          fg.add(new THREE.Line(lg, lm));
        }
      }
    }
    fg.scale.setScalar(isMobile ? 0.5 : 0.75);
    fg.position.copy(mesh.position);
    scene.add(fg);

    const worldTop  = mesh.position.y + mesh.scale.y * maxY;
    const worldBase = mesh.position.y;
    const midY = (worldTop + worldBase) * 0.5;
    const cameraY = isMobile ? worldBase - 30 : midY;
    camera.position.set(0, cameraY, 185);
    camera.lookAt(0, cameraY, 0);

    const tick = () => {
      animRef.current = requestAnimationFrame(tick);
      if (!shouldReduceMotion) mesh.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    tick();

    const ro = new ResizeObserver(() => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      fg.children.forEach(child => {
        const line = child as THREE.Line;
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [shouldReduceMotion]);

  // ── Mobile: measure anchor position after layout settles ───────────────────
  useEffect(() => {
    if (!isMobile) return;
    const placeholder = placeholderRef.current;
    const wrapper = mobileWrapRef.current;
    if (!placeholder || !wrapper) return;

    const id = requestAnimationFrame(() => {
      const y = placeholder.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.1 - 48;
      mobileAnchoredYRef.current = y;
      wrapper.style.top = `${y}px`;
      wrapper.style.opacity = '1';
    });
    return () => cancelAnimationFrame(id);
  }, [isMobile]);

  // ── Mobile scroll animation: grow + fade in place ──────────────────────────
  useEffect(() => {
    if (!isMobile || shouldReduceMotion) return;
    const wrapper = mobileWrapRef.current;
    const scaler = mobileScaleRef.current;
    if (!wrapper || !scaler) return;

    const handleScroll = () => {
      cancelAnimationFrame(mobileScrollRAFRef.current);
      mobileScrollRAFRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const dcEl = document.getElementById('design-cycle');
        if (!dcEl) return;

        const scrollEnd = dcEl.offsetTop + dcEl.offsetHeight * 0.30 - window.innerHeight * 1 + window.innerHeight * 0.7;
        if (scrollEnd <= 0) return;

        const progress = Math.max(0, Math.min(1, scrollY / scrollEnd));

        // Reset on scroll back to top
        if (progress === 0) {
          wrapper.style.top = `${mobileAnchoredYRef.current}px`;
          wrapper.style.opacity = '1';
          wrapper.style.visibility = '';
          scaler.style.transform = 'scale(1)';
          return;
        }

        // Ease-out scale: grows fast then slows — max 3×
        const eased = Math.pow(progress, 0.55);
        const scale = 1 + eased * 3;
        const lastFade = progress > 0.58 ? 1 - Math.pow((progress - 0.58) / 0.42, 1.5) : 1;
        const opacity = (1 - Math.pow(progress, 6.0)) * lastFade;

        wrapper.style.top = `${mobileAnchoredYRef.current}px`;
        wrapper.style.opacity = String(opacity);
        wrapper.style.zIndex = '1';
        wrapper.style.visibility = progress >= 1 ? 'hidden' : '';
        scaler.style.transform = `scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(mobileScrollRAFRef.current);
    };
  }, [isMobile, shouldReduceMotion]);

  // ── Scroll-driven animation (desktop only) ─────────────────────────────────
  //
  // The mountain is position:fixed in the viewport — it does NOT scroll with
  // the page. As progress goes 0→1 the mountain moves horizontally toward
  // viewport center while growing and fading.
  //
  // Key insight: the mountain appears at ~MOUNTAIN_CANVAS_FRACTION of canvas
  // width (not at canvas center). The tx formula accounts for scale drift so
  // the mountain's visual position interpolates linearly from start to center:
  //
  //   tx_target = vw/2 − mountainStartX − 2 × (MOUNTAIN_CANVAS_FRACTION − 0.5) × W
  //
  // At any progress p with scale = 1 + 2p:
  //   mountainViewportX(p) = (1−p)·mountainStartX + p·(vw/2)  ← perfect linear path
  useEffect(() => {
    if (isMobile || shouldReduceMotion) return;

    const outer = outerRef.current;
    if (!outer) return;

    let isFixed = false;
    let txTarget = 0;

    const handleScroll = () => {
      cancelAnimationFrame(scrollRAFRef.current);
      scrollRAFRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const dcEl = document.getElementById('design-cycle');
        if (!dcEl) return;

        // scrollEnd: scroll position when #design-cycle bottom hits viewport center
        const scrollEnd =
          dcEl.getBoundingClientRect().top + scrollY + dcEl.offsetHeight * 0.7 - window.innerHeight / 2;
        if (scrollEnd <= 0) return;

        const progress = Math.max(0, Math.min(1, scrollY / scrollEnd));

        // ── Restore on scroll-back to top ──────────────────────────────────
        if (progress === 0) {
          if (isFixed) {
            isFixed = false;
            outer.style.cssText = '';
          }
          return;
        }

        // ── Switch to fixed on first scroll, record geometry ────────────────
        if (!isFixed) {
          const rect = outer.getBoundingClientRect();
          isFixed = true;

          const L  = rect.left;
          const W  = rect.width;
          const vw = window.innerWidth;

          // Where the mountain visually appears in viewport x at scroll=0
          const mountainStartX = L + MOUNTAIN_CANVAS_FRACTION * W;
          // Translation that moves the mountain from mountainStartX to vw/2,
          // compensating for the lateral drift caused by CSS scale growing.
          // Derived so that: mountainViewportX(p) = lerp(mountainStartX, vw/2, p)
          const MOC = MOUNTAIN_CANVAS_FRACTION - 0.5; // 0.30
          txTarget = vw / 2 - mountainStartX - 2 * MOC * W;

          outer.style.position = 'fixed';
          outer.style.top     = `${rect.top}px`;
          outer.style.left    = `${rect.left}px`;
          outer.style.width   = `${rect.width}px`;
          outer.style.height  = `${rect.height}px`;
          outer.style.overflow       = 'visible';
          outer.style.pointerEvents  = 'none';
          outer.style.zIndex         = '1';
        }

        // ── Animate ────────────────────────────────────────────────────────
        const tx      = txTarget * progress;
        const ty      = window.innerHeight * 0.18 * progress;
        const scale   = 1 + 2 * progress;
        const opacity = 1 - Math.pow(progress, 0.25);

        outer.style.transform  = `translate(${tx}px, ${ty}px) scale(${scale})`;
        outer.style.opacity    = String(opacity);
        outer.style.visibility = progress >= 1 ? 'hidden' : '';
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(scrollRAFRef.current);
    };
  }, [isMobile, shouldReduceMotion]);

  // ── Mobile render — position:fixed, scroll-animated ────────────────────────
  // A zero-height placeholder marks the natural anchor position; the actual
  // canvas wrapper is fixed (removed from flow) and positioned imperatively.
  if (isMobile) {
    return (
      <>
        <div ref={placeholderRef} style={{ height: 0, width: 0 }} />
        {/* Outer: handles position + opacity. transform is translateX(-50%) only, set in JSX. */}
        <div
          ref={mobileWrapRef}
          style={{
            position: 'fixed',
            top: 0,           // overwritten by anchor useEffect
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            height: 500,
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0,       // revealed after anchor is measured
          }}
        >
          {/* Inner: handles scale only, origin at mountain peak (~35% from top) */}
          <div
            ref={mobileScaleRef}
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: '50% 35%',
              overflow: 'hidden',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 100%), linear-gradient(to bottom, black 55%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 100%), linear-gradient(to bottom, black 55%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          >
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </>
    );
  }

  // ── Desktop render ─────────────────────────────────────────────────────────
  // Outer div: imperatively controlled for scroll (position, transform, opacity)
  // Inner motion.div: entry slide-in animation + gradient mask
  return (
    <div
      ref={outerRef}
      className="absolute right-[10%] top-0 bottom-0 pointer-events-none overflow-hidden"
      style={{ width: '90%' }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 15%, black 68%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 15%, black 68%, transparent 100%)',
        }}
        initial={shouldReduceMotion ? { opacity: 1 } : { x: '100%' }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </motion.div>
    </div>
  );
}
