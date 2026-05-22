import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import * as THREE from 'three';

interface WireframeMeshProps {
  isMobile: boolean;
  opennessRef?: { current: number };
  desktopMode?: 'hero' | 'anchored';
  anchorId?: string;
  // When true on mobile: render inline as a static block (no fixed
  // positioning, no scroll-driven grow/fade). Tap still triggers the
  // separation animation of the 3 levels.
  mobileStatic?: boolean;
  mobileAutoExpanded?: boolean;
}

export const DESIGN_CYCLE_BUILDING_SLOT_ID = 'design-cycle-building-slot';

// ── Geisel Library palette ────────────────────────────────────────────────────
const COLORS = {
  baseFill: 0xf2f2f0,
  baseLine: 0x6a6a6a,
  pierFill: 0x1a1a1a,
  pierLine: 0x000000,
  slabFill: 0xfafaf7,
  slabLine: 0x1a1a1a,
  glass:    0xdedede,
  ink:      0x1a1a1a,
};

// ── Geometry helpers ──────────────────────────────────────────────────────────
function makeOctagonShape(radius: number) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  }
  shape.closePath();
  return shape;
}

function buildWireframedMesh(
  geometry: THREE.BufferGeometry,
  fillColor: number,
  lineColor: number,
  lineOpacity = 0.85,
): THREE.Group {
  const group = new THREE.Group();
  const fillMat = new THREE.MeshBasicMaterial({
    color: fillColor,
    polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
    side: THREE.FrontSide,
  });
  group.add(new THREE.Mesh(geometry, fillMat));
  const wireMat = new THREE.LineBasicMaterial({
    color: lineColor, transparent: true, opacity: lineOpacity,
  });
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireMat));
  return group;
}

export function WireframeMesh({
  isMobile,
  opennessRef,
  desktopMode = 'hero',
  anchorId = DESIGN_CYCLE_BUILDING_SLOT_ID,
  mobileStatic = false,
  mobileAutoExpanded = false,
}: WireframeMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const scrollRAFRef = useRef<number>(0);
  const mobileWrapRef = useRef<HTMLDivElement>(null);
  const mobileScaleRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const mobileAnchoredYRef = useRef(0);
  const mobileScrollRAFRef = useRef(0);
  const mobileAutoExpandedRef = useRef(mobileAutoExpanded);
  const shouldReduceMotion = useReducedMotion();

  // Set by the three.js effect; read by the hover/tap effect.
  const setSeparationTargetRef = useRef<(t: 0 | 1) => void>(() => {});
  const tapTriggerRef = useRef<() => void>(() => {});

  // ── Three.js setup ─────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.localClippingEnabled = true;
    Object.assign(renderer.domElement.style, {
      width: '100%', height: '100%', display: 'block',
      pointerEvents: 'auto',
    });
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      28, container.offsetWidth / container.offsetHeight, 0.1, 500,
    );
    camera.position.set(0, 12, 110);
    camera.lookAt(0, 12, 0);

    const pivot = new THREE.Group();
    scene.add(pivot);

    // Track every disposable so cleanup is reliable.
    const disposables: Array<{ dispose?: () => void }> = [];
    const trackGeo = (g: THREE.BufferGeometry) => { disposables.push(g); return g; };
    const trackMat = <T extends THREE.Material>(m: T) => { disposables.push(m); return m; };

    // ── L1 base ──────────────────────────────────────────────────────────────
    const BASE_RADIUS = 6.5;
    const BASE_HEIGHT = 5.0;
    const baseGroup = new THREE.Group();

    function buildBaseInteriorColumns() {
      const g = new THREE.Group();
      const colRadius = BASE_RADIUS - 1.4;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const x = Math.cos(a) * colRadius;
        const z = Math.sin(a) * colRadius;
        const geo = trackGeo(new THREE.BoxGeometry(1.9, BASE_HEIGHT, 1.9, 4, 12, 4));
        const m = buildWireframedMesh(geo, COLORS.baseFill, COLORS.baseLine, 0.55);
        m.position.set(x, BASE_HEIGHT / 2, z);
        g.add(m);
      }
      return g;
    }

    function buildBaseOuterShell() {
      const shape = makeOctagonShape(BASE_RADIUS);
      const group = new THREE.Group();
      const octTop = trackGeo(
        new THREE.ExtrudeGeometry(shape, { depth: 0.7, bevelEnabled: false, curveSegments: 1 }),
      );
      octTop.rotateX(-Math.PI / 2);
      octTop.translate(0, BASE_HEIGHT, 0);
      group.add(buildWireframedMesh(octTop, COLORS.baseFill, COLORS.baseLine, 0.65));

      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const x = Math.cos(a) * BASE_RADIUS;
        const z = Math.sin(a) * BASE_RADIUS;
        const ribGeo = trackGeo(new THREE.BoxGeometry(0.45, BASE_HEIGHT, 0.45, 2, 10, 2));
        const rib = buildWireframedMesh(ribGeo, COLORS.baseFill, COLORS.baseLine, 0.5);
        rib.position.set(x, BASE_HEIGHT / 2, z);
        group.add(rib);
      }
      return group;
    }

    baseGroup.add(buildBaseInteriorColumns());
    baseGroup.add(buildBaseOuterShell());

    // ── Floors / glass ───────────────────────────────────────────────────────
    const FLOOR_RADII = [10.5, 11.2, 11.4, 13.0, 13.8, 14.2];
    const FLOOR_BASE_Y = BASE_HEIGHT + 0.4;
    const SLAB_THICK = 0.55;
    const GLASS_HEIGHT = 1.7;
    const GLASS_INSET = 0.7;
    const widestFloorIndex = 2;

    function buildSlab(radius: number, y: number, thick: number) {
      const shape = makeOctagonShape(radius);
      const geo = trackGeo(new THREE.ExtrudeGeometry(shape, {
        depth: thick, bevelEnabled: false, curveSegments: 1, steps: 1,
      }));
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, thick, 0);

      const group = new THREE.Group();
      const fill = new THREE.Mesh(geo, trackMat(new THREE.MeshBasicMaterial({
        color: COLORS.slabFill,
        polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
      })));
      group.add(fill);

      const edges = trackGeo(new THREE.EdgesGeometry(geo, 1));
      group.add(new THREE.LineSegments(edges, trackMat(new THREE.LineBasicMaterial({
        color: COLORS.slabLine, transparent: true, opacity: 0.9,
      }))));

      const ringMat = trackMat(new THREE.LineBasicMaterial({
        color: COLORS.slabLine, transparent: true, opacity: 0.11,
      }));
      const concentricCount = 8;
      for (let c = 1; c <= concentricCount; c++) {
        const r = radius * (1 - c / (concentricCount + 1));
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 8; i++) {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
          pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
        }
        const lineGeo = trackGeo(new THREE.BufferGeometry().setFromPoints(pts));
        const top = new THREE.Line(lineGeo, ringMat);
        top.position.y = thick + 0.001;
        group.add(top);
        const bot = top.clone();
        bot.position.y = 0.001;
        group.add(bot);
      }

      const spokeMat = trackMat(new THREE.LineBasicMaterial({
        color: COLORS.slabLine, transparent: true, opacity: 0.08,
      }));
      const spokeCount = 32;
      for (let i = 0; i < spokeCount; i++) {
        const a = (i / spokeCount) * Math.PI * 2;
        const sGeo = trackGeo(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(Math.cos(a) * radius * 0.05, 0, Math.sin(a) * radius * 0.05),
          new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius),
        ]));
        const top = new THREE.Line(sGeo, spokeMat);
        top.position.y = thick + 0.001;
        group.add(top);
        const bot = top.clone();
        bot.position.y = 0.001;
        group.add(bot);
      }

      group.position.y = y;
      return group;
    }

    function buildGlassBand(radius: number, y: number, height: number) {
      const r = radius - GLASS_INSET;
      const group = new THREE.Group();
      const glassMat = trackMat(new THREE.MeshBasicMaterial({
        color: COLORS.glass, transparent: true, opacity: 0.55,
        side: THREE.DoubleSide, depthWrite: false,
      }));
      const edgeMat = trackMat(new THREE.LineBasicMaterial({
        color: COLORS.ink, transparent: true, opacity: 0.85,
      }));
      const mullionMat = trackMat(new THREE.LineBasicMaterial({
        color: COLORS.ink, transparent: true, opacity: 0.55,
      }));

      for (let i = 0; i < 8; i++) {
        const a0 = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const a1 = ((i + 1) / 8) * Math.PI * 2 + Math.PI / 8;
        const x0 = Math.cos(a0) * r, z0 = Math.sin(a0) * r;
        const x1 = Math.cos(a1) * r, z1 = Math.sin(a1) * r;

        const panelGeo = trackGeo(new THREE.BufferGeometry());
        panelGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
          x0, 0, z0,  x1, 0, z1,  x1, height, z1,
          x0, 0, z0,  x1, height, z1,  x0, height, z0,
        ]), 3));
        panelGeo.computeVertexNormals();
        group.add(new THREE.Mesh(panelGeo, glassMat));

        const edgeGeo = trackGeo(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x0, 0, z0), new THREE.Vector3(x1, 0, z1),
          new THREE.Vector3(x0, height, z0), new THREE.Vector3(x1, height, z1),
          new THREE.Vector3(x0, 0, z0), new THREE.Vector3(x0, height, z0),
          new THREE.Vector3(x1, 0, z1), new THREE.Vector3(x1, height, z1),
        ]));
        group.add(new THREE.LineSegments(edgeGeo, edgeMat));

        const sideLen = Math.hypot(x1 - x0, z1 - z0);
        const mullionCount = Math.max(2, Math.floor(sideLen / 1.0));
        const mullionPts: THREE.Vector3[] = [];
        for (let m = 1; m < mullionCount; m++) {
          const t = m / mullionCount;
          const mx = x0 + (x1 - x0) * t;
          const mz = z0 + (z1 - z0) * t;
          mullionPts.push(new THREE.Vector3(mx, 0, mz));
          mullionPts.push(new THREE.Vector3(mx, height, mz));
        }
        if (mullionPts.length) {
          const mGeo = trackGeo(new THREE.BufferGeometry().setFromPoints(mullionPts));
          group.add(new THREE.LineSegments(mGeo, mullionMat));
        }
      }

      group.position.y = y;
      return group;
    }

    const lowerFloorsGroup = new THREE.Group();
    const upperFloorsGroup = new THREE.Group();
    let cumulativeY = FLOOR_BASE_Y;
    const floorMidlineY: number[] = [];
    const floorSlabTopY: number[] = [];

    for (let i = 0; i < FLOOR_RADII.length; i++) {
      const r = FLOOR_RADII[i];
      const slabTarget = i < widestFloorIndex ? lowerFloorsGroup : upperFloorsGroup;
      const glassTarget = i - 1 < widestFloorIndex ? lowerFloorsGroup : upperFloorsGroup;
      if (i > 0) {
        glassTarget.add(buildGlassBand(r, cumulativeY, GLASS_HEIGHT));
        cumulativeY += GLASS_HEIGHT;
      }
      floorMidlineY.push(cumulativeY);
      slabTarget.add(buildSlab(r, cumulativeY, SLAB_THICK));
      cumulativeY += SLAB_THICK;
      floorSlabTopY.push(cumulativeY);
    }

    const TOP_FLOOR_RADIUS = FLOOR_RADII[FLOOR_RADII.length - 1];
    const ROOF_OVERHANG = TOP_FLOOR_RADIUS + 1.4;
    const ROOF_THICK = 0.5;
    const roofY = cumulativeY + GLASS_HEIGHT * 0.35;
    upperFloorsGroup.add(buildSlab(ROOF_OVERHANG, roofY, ROOF_THICK));
    upperFloorsGroup.add(buildGlassBand(TOP_FLOOR_RADIUS, cumulativeY, GLASS_HEIGHT * 0.35 + 0.05));

    // ── Central core ─────────────────────────────────────────────────────────
    const coreTopY = roofY - 0.1;
    const coreGeo = trackGeo(new THREE.BoxGeometry(
      3.8, coreTopY, 3.8, 6, Math.max(8, Math.round(coreTopY * 0.7)), 6,
    ));
    const centralCoreMesh = buildWireframedMesh(coreGeo, COLORS.baseFill, COLORS.baseLine, 0.5);
    centralCoreMesh.position.y = coreTopY / 2;

    // ── Inclined exterior piers (clipped) ────────────────────────────────────
    const pierClipTop = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const pierClipBot = new THREE.Plane(new THREE.Vector3(0,  1, 0), 0);
    const pierClipPlanes = [pierClipTop, pierClipBot];

    function buildPierSegment(p0: THREE.Vector3, p1: THREE.Vector3, thickness = 1.05) {
      const dir = new THREE.Vector3().subVectors(p1, p0);
      const len = dir.length();
      const overshoot = 1.5;
      const geo = trackGeo(new THREE.BoxGeometry(
        thickness, len + overshoot * 2, thickness, 3, 14, 3,
      ));

      const group = new THREE.Group();
      group.add(new THREE.Mesh(geo, trackMat(new THREE.MeshBasicMaterial({
        color: COLORS.pierFill,
        polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
        side: THREE.FrontSide,
        clippingPlanes: pierClipPlanes,
        clipShadows: true,
      }))));
      group.add(new THREE.LineSegments(
        trackGeo(new THREE.WireframeGeometry(geo)),
        trackMat(new THREE.LineBasicMaterial({
          color: COLORS.pierLine, transparent: true, opacity: 1.0,
          clippingPlanes: pierClipPlanes,
        })),
      ));

      group.position.copy(new THREE.Vector3().addVectors(p0, p1).multiplyScalar(0.5));
      group.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), dir.clone().normalize(),
      ));
      return group;
    }

    const PIER_INSET_PER_FACE = 1.6;
    const PIER_THICK = 1.1;
    const Y_LOWER_BOTTOM = BASE_HEIGHT + 0.7;
    const Y_LOWER_TOP = floorMidlineY[widestFloorIndex] + SLAB_THICK;
    const PIER_CUT_TOP_Y = Y_LOWER_TOP;
    const PIER_CUT_BOT_Y = Y_LOWER_BOTTOM;
    pierClipTop.constant = PIER_CUT_TOP_Y;
    pierClipBot.constant = -PIER_CUT_BOT_Y;

    const R_LOWER_BOTTOM = BASE_RADIUS + 0.25;
    const R_LOWER_TOP = FLOOR_RADII[widestFloorIndex] - 0.1;

    const piersGroup = new THREE.Group();
    // Elevator doors sit on the core's north/south faces (+Z/-Z). Keep those
    // two middle-level exterior pier pairs open as entries.
    const elevatorEntryFaceIndices = new Set([1, 5]);
    for (let i = 0; i < 8; i++) {
      if (elevatorEntryFaceIndices.has(i)) continue;

      const a0 = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const a1 = ((i + 1) / 8) * Math.PI * 2 + Math.PI / 8;
      const aMid = (a0 + a1) / 2;
      const tangent = new THREE.Vector3(-Math.sin(aMid), 0, Math.cos(aMid));
      const normal = new THREE.Vector3(Math.cos(aMid), 0, Math.sin(aMid));
      for (const off of [-PIER_INSET_PER_FACE, +PIER_INSET_PER_FACE]) {
        const pBot = normal.clone().multiplyScalar(R_LOWER_BOTTOM)
          .add(tangent.clone().multiplyScalar(off));
        pBot.y = Y_LOWER_BOTTOM;
        const pTop = normal.clone().multiplyScalar(R_LOWER_TOP)
          .add(tangent.clone().multiplyScalar(off));
        pTop.y = Y_LOWER_TOP;
        piersGroup.add(buildPierSegment(pBot, pTop, PIER_THICK));
      }
    }

    // ── Three level groups for separation ────────────────────────────────────
    const level1Group = new THREE.Group();
    const level2Group = new THREE.Group();
    const level3Group = new THREE.Group();
    level1Group.add(baseGroup);
    level2Group.add(centralCoreMesh);
    level2Group.add(piersGroup);
    level2Group.add(lowerFloorsGroup);
    level3Group.add(upperFloorsGroup);
    pivot.add(level1Group);
    pivot.add(level2Group);
    pivot.add(level3Group);
    level2Group.scale.set(0.941, 1.0, 0.941);

    type FadeMaterialState = {
      material: THREE.Material & { opacity: number };
      baseOpacity: number;
      baseTransparent: boolean;
    };

    function collectFadeMaterials(group: THREE.Group): FadeMaterialState[] {
      const seen = new Set<THREE.Material>();
      const states: FadeMaterialState[] = [];
      group.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        const rawMaterial = mesh.material;
        if (!rawMaterial) return;
        const materials = Array.isArray(rawMaterial) ? rawMaterial : [rawMaterial];
        for (const material of materials) {
          if (seen.has(material) || !('opacity' in material)) continue;
          seen.add(material);
          states.push({
            material: material as THREE.Material & { opacity: number },
            baseOpacity: (material as THREE.Material & { opacity: number }).opacity,
            baseTransparent: material.transparent,
          });
        }
      });
      return states;
    }

    function setGroupFade(states: FadeMaterialState[], multiplier: number) {
      for (const { material, baseOpacity, baseTransparent } of states) {
        const nextTransparent = baseTransparent || multiplier < 0.999;
        if (material.transparent !== nextTransparent) {
          material.transparent = nextTransparent;
          material.needsUpdate = true;
        }
        material.opacity = baseOpacity * multiplier;
      }
    }

    // ── Elevator doors (live in level2Group) ─────────────────────────────────
    (function buildElevatorDoors() {
      const CORE_D = 3.8;
      const DOOR_W = 0.72;
      const DOOR_H = GLASS_HEIGHT * 0.82;
      const DOOR_INSET = 0.015;
      const PAIR_SPREAD = 0.44;
      const MARGIN = 0.08;

      const fillMat = trackMat(new THREE.MeshBasicMaterial({
        color: 0xe0e0e0,
        polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
        side: THREE.DoubleSide,
      }));
      const lineMat = trackMat(new THREE.LineBasicMaterial({
        color: 0x2a2a2a, transparent: true, opacity: 0.85,
      }));
      const panelLineMat = trackMat(new THREE.LineBasicMaterial({
        color: 0x555555, transparent: true, opacity: 0.45,
      }));

      const levels = [MARGIN];
      for (const top of floorSlabTopY) levels.push(top + MARGIN);

      const elevGroup = new THREE.Group();
      for (const faceSign of [+1, -1]) {
        const faceZ = faceSign * (CORE_D / 2 + DOOR_INSET);
        const rotY = faceSign === 1 ? 0 : Math.PI;
        for (const baseY of levels) {
          for (const side of [-1, +1]) {
            const cx = side * PAIR_SPREAD;
            const cy = baseY + DOOR_H / 2;
            const geo = trackGeo(new THREE.PlaneGeometry(DOOR_W, DOOR_H, 2, 4));
            const mesh = new THREE.Mesh(geo, fillMat);
            mesh.position.set(cx, cy, faceZ);
            mesh.rotation.y = rotY;
            elevGroup.add(mesh);

            const edges = new THREE.LineSegments(
              trackGeo(new THREE.EdgesGeometry(geo)), lineMat,
            );
            edges.position.copy(mesh.position);
            edges.rotation.copy(mesh.rotation);
            elevGroup.add(edges);

            const vGeo = trackGeo(new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(0, -DOOR_H / 2, 0),
              new THREE.Vector3(0,  DOOR_H / 2, 0),
            ]));
            const vLine = new THREE.Line(vGeo, lineMat);
            vLine.position.copy(mesh.position);
            vLine.rotation.copy(mesh.rotation);
            elevGroup.add(vLine);

            for (const hy of [-DOOR_H * 0.18, DOOR_H * 0.18]) {
              const hGeo = trackGeo(new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-DOOR_W / 2, hy, 0),
                new THREE.Vector3( DOOR_W / 2, hy, 0),
              ]));
              const hLine = new THREE.Line(hGeo, panelLineMat);
              hLine.position.copy(mesh.position);
              hLine.rotation.copy(mesh.rotation);
              elevGroup.add(hLine);
            }
          }
        }
      }
      level2Group.add(elevGroup);
    })();

    const levelFadeMaterials = {
      l1: collectFadeMaterials(level1Group),
      l2: collectFadeMaterials(level2Group),
      l3: collectFadeMaterials(level3Group),
    };

    // ── Pivot offset & visual sizing per breakpoint ──────────────────────────
    // Keep the building visually anchored toward the right of the canvas
    // (so the existing scroll animation that translates it toward viewport
    // centre still feels correct).
    pivot.position.x = isMobile ? 0 : 29;
    pivot.position.y = isMobile ? 7 : 0;
    pivot.scale.setScalar(isMobile ? 0.95 : 1.2);

    // ── Animation state ──────────────────────────────────────────────────────
    let rotationY = Math.PI * 0.15;
    let targetRotY = rotationY;

    const springK = 90;
    const springD = 19;

    // Three independent critically-damped springs (one per building level group)
    let pos1 = 0, vel1 = 0;
    let pos2 = 0, vel2 = 0;
    let pos3 = 0, vel3 = 0;
    let fade1 = 1;
    let fade2 = 1;
    let fade3 = 1;

    // Building canvas hover (raycaster / tap)
    let buildingHover: 0 | 1 = 0;
    // Active glossary row driven by PracticeSection custom events
    let practiceLevel: null | 1 | 2 | 3 = null;

    // Y targets per group (l1=base/bottom, l2=mid, l3=top/roof) for each state.
    // The top edge of level3 is the scroll anchor (locked to row 01's top
    // edge), so level3 never moves — separations always happen below it,
    // mirroring how a glossary row's expansion panel pushes the rows below it
    // downward without disturbing the rows above.
    const LEVEL_Y = {
      building: { l1: -4.5, l2: -2.0, l3: 0 }, // generic hover: stair-step down
      1:        { l1: -4.0, l2: -4.0, l3: 0 }, // row 01: l2+l1 drop together (gap below l3)
      2:        { l1: -4.0, l2: -2.0, l3: 0 }, // row 02: l2 drops, l1 drops más (gap between l2+l1)
      3:        { l1: -3.5, l2:  0,   l3: 0 }, // row 03: l1 drops a touch more (mimics last panel)
    } as const;

    const TAP_HOLD_MS = 2200;
    let tapHoldEndAt = 0;

    setSeparationTargetRef.current = (t) => { buildingHover = t; };
    tapTriggerRef.current = () => {
      buildingHover = 1;
      tapHoldEndAt = performance.now() + TAP_HOLD_MS;
    };

    const handleLevelChange = (e: Event) => {
      practiceLevel = (e as CustomEvent<{ level: null | 1 | 2 | 3 }>).detail.level;
    };
    window.addEventListener('practice-level-change', handleLevelChange);

    let prevTime = performance.now();
    const tick = () => {
      animRef.current = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;

      if (isMobile && mobileAutoExpandedRef.current) {
        buildingHover = 1;
        tapHoldEndAt = 0;
      } else if (isMobile && tapHoldEndAt && now >= tapHoldEndAt) {
        buildingHover = 0;
        tapHoldEndAt = 0;
      }

      // Determine per-group Y targets
      let tgt1: number, tgt2: number, tgt3: number;
      if (practiceLevel !== null) {
        const sep = LEVEL_Y[practiceLevel];
        tgt1 = sep.l1; tgt2 = sep.l2; tgt3 = sep.l3;
      } else if (buildingHover === 1) {
        tgt1 = LEVEL_Y.building.l1; tgt2 = LEVEL_Y.building.l2; tgt3 = LEVEL_Y.building.l3;
      } else {
        tgt1 = 0; tgt2 = 0; tgt3 = 0;
      }

      // Spring each group independently
      vel1 += ((tgt1 - pos1) * springK - vel1 * springD) * dt; pos1 += vel1 * dt;
      vel2 += ((tgt2 - pos2) * springK - vel2 * springD) * dt; pos2 += vel2 * dt;
      vel3 += ((tgt3 - pos3) * springK - vel3 * springD) * dt; pos3 += vel3 * dt;

      const inactiveLevelOpacity = 0.2;
      const targetFade1 = practiceLevel === null || practiceLevel === 3 ? 1 : inactiveLevelOpacity;
      const targetFade2 = practiceLevel === null || practiceLevel === 2 ? 1 : inactiveLevelOpacity;
      const targetFade3 = practiceLevel === null || practiceLevel === 1 ? 1 : inactiveLevelOpacity;
      const fadeEase = shouldReduceMotion ? 1 : 1 - Math.pow(0.002, dt);
      fade1 += (targetFade1 - fade1) * fadeEase;
      fade2 += (targetFade2 - fade2) * fadeEase;
      fade3 += (targetFade3 - fade3) * fadeEase;

      level1Group.position.y = pos1;
      level2Group.position.y = pos2;
      level3Group.position.y = pos3;
      setGroupFade(levelFadeMaterials.l1, fade1);
      setGroupFade(levelFadeMaterials.l2, fade2);
      setGroupFade(levelFadeMaterials.l3, fade3);
      if (opennessRef) opennessRef.current = Math.max(Math.abs(pos1), Math.abs(pos2)) / 4.0;

      // Clipping planes live in world space; convert the pier-local cut Ys
      // through the pivot transform (and the level2 separation offset) so the
      // pier tops always slice flush with the slab they end at.
      const sy = pivot.scale.y;
      const py = pivot.position.y;
      pierClipTop.constant = (PIER_CUT_TOP_Y + pos2) * sy + py;
      pierClipBot.constant = -((PIER_CUT_BOT_Y + pos2) * sy + py);

      if (!shouldReduceMotion) targetRotY += 0.0025;
      rotationY += (targetRotY - rotationY) * 0.08;
      pivot.rotation.y = rotationY;

      renderer.render(scene, camera);
    };
    tick();

    // ── Desktop: raycasting hover — only fires over actual building geometry ──
    let desktopPointerCleanup: (() => void) | undefined;
    if (!isMobile) {
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      let wasHovering = false;

      const onPointerMove = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects([pivot], true);
        const nowHovering = hits.length > 0;
        if (nowHovering !== wasHovering) {
          wasHovering = nowHovering;
          buildingHover = nowHovering ? 1 : 0;
        }
      };

      const onPointerLeave = () => {
        if (wasHovering) {
          wasHovering = false;
          buildingHover = 0;
        }
      };

      renderer.domElement.addEventListener('pointermove', onPointerMove);
      renderer.domElement.addEventListener('pointerleave', onPointerLeave);
      desktopPointerCleanup = () => {
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      };
    }

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
      window.removeEventListener('practice-level-change', handleLevelChange);
      desktopPointerCleanup?.();
      ro.disconnect();
      for (const d of disposables) d.dispose?.();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isMobile, shouldReduceMotion]);

  useEffect(() => {
    mobileAutoExpandedRef.current = mobileAutoExpanded;
    if (isMobile) {
      setSeparationTargetRef.current(mobileAutoExpanded ? 1 : 0);
    }
  }, [isMobile, mobileAutoExpanded]);

  // ── Hover (desktop) / tap (mobile) — separation trigger ─────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = container.querySelector('canvas') as HTMLCanvasElement | null;
    const target = canvas ?? container;

    if (isMobile) {
      let startX = 0, startY = 0, startTime = 0, moved = false;
      const onStart = (e: TouchEvent) => {
        const t = e.touches[0];
        if (!t) return;
        startX = t.clientX; startY = t.clientY;
        startTime = performance.now();
        moved = false;
      };
      const onMove = (e: TouchEvent) => {
        const t = e.touches[0];
        if (!t) return;
        if (Math.hypot(t.clientX - startX, t.clientY - startY) > 6) moved = true;
      };
      const onEnd = () => {
        if (!moved && performance.now() - startTime < 400) {
          tapTriggerRef.current();
        }
      };
      target.addEventListener('touchstart', onStart, { passive: true });
      target.addEventListener('touchmove', onMove, { passive: true });
      target.addEventListener('touchend', onEnd);
      return () => {
        target.removeEventListener('touchstart', onStart);
        target.removeEventListener('touchmove', onMove);
        target.removeEventListener('touchend', onEnd);
      };
    } else {
      // Desktop hover is handled via raycasting inside the Three.js effect.
      return;
    }
  }, [isMobile]);

  // ── Mobile: measure anchor position after layout settles ───────────────────
  useEffect(() => {
    if (!isMobile || mobileStatic) return;
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
  }, [isMobile, mobileStatic]);

  // ── Mobile scroll animation: grow + fade in place ──────────────────────────
  useEffect(() => {
    if (!isMobile || shouldReduceMotion || mobileStatic) return;
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

        if (progress === 0) {
          wrapper.style.top = `${mobileAnchoredYRef.current}px`;
          wrapper.style.opacity = '1';
          wrapper.style.visibility = '';
          scaler.style.transform = 'scale(1)';
          return;
        }

        const eased = Math.pow(progress, 0.55);
        const scale = 1 + eased * 3;
        const lastFade = progress > 0.52 ? 1 - Math.pow((progress - 0.52) / 0.43, 1.5) : 1;
        const opacity = (1 - Math.pow(progress, 6.0)) * lastFade;

        wrapper.style.top = `${mobileAnchoredYRef.current}px`;
        wrapper.style.opacity = String(opacity);
        wrapper.style.zIndex = '1';
        wrapper.style.visibility = progress >= 0.95 ? 'hidden' : '';
        scaler.style.transform = `scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(mobileScrollRAFRef.current);
    };
  }, [isMobile, shouldReduceMotion, mobileStatic]);

  // ── Scroll-driven animation (desktop only) ─────────────────────────────────
  useEffect(() => {
    if (isMobile || shouldReduceMotion || desktopMode !== 'hero') return;

    const outer = outerRef.current;
    if (!outer) return;

    let isFixed = false;

    // BASELINE — the building's natural hero position, measured eagerly
    // while the element is NOT yet position:fixed. The pinned viewport
    // top is just `baselineTop` (a viewport coordinate captured at
    // scrollY=0 equivalent). The scroll handler derives ty/tx from this
    // baseline instead of re-reading getBoundingClientRect() each time.
    // Without this, a programmatic teleport (e.g. clicking "My Design
    // Cycle" in the nav) would land mid-page on the first scroll event,
    // the lazy capture would read a now-off-screen rect, and the building
    // would get pinned at a stale viewport y — which is the "stuck in
    // hero" bug.
    let baselineLeft = 0;
    let baselineTop = 0; // viewport y the building should pin to (= natural hero rect.top)
    let baselineWidth = 0;
    let baselineHeight = 0;
    let baselineReady = false;

    const resetOuter = () => {
      outer.style.position = '';
      outer.style.top = '';
      outer.style.left = '';
      outer.style.width = '90%';
      outer.style.height = '';
      outer.style.overflow = '';
      outer.style.pointerEvents = '';
      outer.style.zIndex = '';
      outer.style.transform = '';
      outer.style.opacity = '';
      outer.style.visibility = '';
    };

    // Measure the natural rect. If currently fixed, briefly revert so we
    // read the in-flow position; restore afterwards in the same frame so
    // no flicker is visible.
    const measureBaseline = () => {
      const wasFixed = isFixed;
      if (wasFixed) {
        outer.style.position = '';
        outer.style.top = '';
        outer.style.left = '';
        outer.style.width = '90%';
        outer.style.height = '';
        outer.style.transform = '';
      }
      const rect = outer.getBoundingClientRect();
      // Skip degenerate measurements (display:none, 0×0, etc.)
      if (rect.width < 10 || rect.height < 10) {
        if (wasFixed) {
          // Best-effort restore so we don't leave the element broken.
          outer.style.position = 'fixed';
        }
        return;
      }
      // The building is positioned absolute in the hero. Its rect.left
      // is the viewport x at the current scroll, but since it's
      // absolute-positioned relative to a non-scrolling ancestor the
      // viewport x doesn't change as the page scrolls — so rect.left is
      // already the value we want for the fixed pin. For top: at any
      // scrollY, rect.top + scrollY equals the building's would-be
      // viewport top when scrollY were 0 (which is what we'd pin it at).
      baselineLeft = rect.left;
      baselineTop = rect.top + window.scrollY;
      baselineWidth = rect.width;
      baselineHeight = rect.height;
      baselineReady = true;
      if (wasFixed) {
        // Restore fixed positioning at the new baseline (handleScroll
        // will recompute transform on the next frame).
        outer.style.position = 'fixed';
        outer.style.top = `${baselineTop}px`;
        outer.style.left = `${baselineLeft}px`;
        outer.style.width = `${baselineWidth}px`;
        outer.style.height = `${baselineHeight}px`;
      }
    };

    // Building's TOP edge as a fraction of the canvas height. Derived from the
    // camera framing: scaled scene-y of the roof top ≈ 21.95, lookAt y = 12,
    // vertical extent at distance 110 with FOV 28° ≈ 54.86, so the top sits
    // 9.95/54.86 ≈ 18.1% above canvas centre → 35% from canvas top (adjusted
    // lower for better visual alignment with glossary top edge).
    const BUILDING_TOP_FRACTION = 0.30;

    const handleScroll = () => {
      cancelAnimationFrame(scrollRAFRef.current);
      scrollRAFRef.current = requestAnimationFrame(() => {
        if (!baselineReady) return;
        const scrollY = window.scrollY;
        const anchorEl = document.getElementById(anchorId);
        const row01Btn = document.getElementById('bp-level-03-btn');
        if (!anchorEl || !row01Btn) return;

        if (scrollY <= 0) {
          if (isFixed) {
            isFixed = false;
            resetOuter();
          }
          return;
        }

        // The building's pinned viewport position (`startTop`/`startLeft`)
        // is a CONSTANT derived from the eager baseline — it doesn't
        // depend on scrollY. position:fixed already keeps the element at
        // a viewport-fixed coordinate; the phase-1/phase-2 transform
        // does all the motion on top of that pin.
        const startTop = baselineTop;
        const startLeft = baselineLeft;
        const outerHeight = baselineHeight;

        if (!isFixed) {
          isFixed = true;
          outer.style.position = 'fixed';
          outer.style.top = `${startTop}px`;
          outer.style.left = `${startLeft}px`;
          outer.style.width = `${baselineWidth}px`;
          outer.style.height = `${outerHeight}px`;
          outer.style.overflow = 'visible';
          outer.style.pointerEvents = 'none';
          outer.style.zIndex = '1';
        }

        // Where row 01's TOP edge lives in the document, and where the
        // building's TOP edge lives in the viewport while pinned at startTop.
        const row01Rect = row01Btn.getBoundingClientRect();
        const row01TopDocY = row01Rect.top + scrollY;
        const buildingTopViewportY = startTop + outerHeight * BUILDING_TOP_FRACTION;

        // scrollAlign = the exact moment row 01's top edge reaches the
        // building's pinned top edge. From then on, the building's top stays
        // locked to row 01's top and the level layout cascades down naturally.
        const scrollAlign = row01TopDocY - buildingTopViewportY;
        if (scrollAlign <= 0) return;

        const anchorRect = anchorEl.getBoundingClientRect();
        const txTarget = anchorRect.left - startLeft;
        const lockedBuildingTopDocY = row01TopDocY - outerHeight * BUILDING_TOP_FRACTION;

        let txEffective: number;
        let tyEffective: number;

        if (scrollY < scrollAlign) {
          // Phase 1 — vertically pinned at hero position; ease horizontally
          // toward the anchor as we approach the alignment moment so the
          // building never appears to "fall" while the section rises.
          const progress = scrollY / scrollAlign;
          const eased = 1 - Math.pow(1 - progress, 2.15);
          txEffective = txTarget * eased;
          tyEffective = 0;
        } else {
          // Phase 2 — middle locked on row 02; track it as the section
          // scrolls upward. Continuous with phase 1 because at scrollAlign
          // the formula evaluates to 0.
          txEffective = txTarget;
          tyEffective = lockedBuildingTopDocY - scrollY - startTop;
        }

        outer.style.transform = `translate(${txEffective}px, ${tyEffective}px)`;
        outer.style.opacity = '1';
        outer.style.visibility = '';
      });
    };

    // Initial baseline. Defer one frame so layout has settled (fonts,
    // images, etc.) before measuring.
    requestAnimationFrame(() => {
      measureBaseline();
      // Run the scroll handler once so the building is positioned
      // correctly even on initial page load with a non-zero scroll
      // (e.g. user reloaded mid-page or arrived via #design-cycle).
      handleScroll();
    });

    const onResize = () => {
      measureBaseline();
      handleScroll();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // ResizeObserver catches hero content reflow that doesn't fire a
    // window resize event (e.g. fonts loading, container queries).
    const ro = new ResizeObserver(onResize);
    ro.observe(outer);
    if (outer.parentElement) ro.observe(outer.parentElement);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      cancelAnimationFrame(scrollRAFRef.current);
      resetOuter();
    };
  }, [anchorId, desktopMode, isMobile, shouldReduceMotion]);

  // ── Mobile render ──────────────────────────────────────────────────────────
  if (isMobile) {
    if (mobileStatic) {
      // Static, in-flow block. No fixed positioning, no scroll grow/fade.
      // Tap to toggle the 3-level separation is wired via the touch listeners
      // on containerRef in the effect above.
      return (
        <div
          ref={mobileWrapRef}
          style={{
            position: 'relative',
            width: '100%',
            height: 320,
            pointerEvents: 'auto',
          }}
        >
          <div
            ref={mobileScaleRef}
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: '50% 50%',
              overflow: 'visible',
            }}
          >
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      );
    }

    return (
      <>
        <div ref={placeholderRef} style={{ height: 0, width: 0 }} />
        <div
          ref={mobileWrapRef}
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            height: 500,
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0,
          }}
        >
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
  if (desktopMode === 'anchored') {
    return (
      <div
        id={anchorId}
        ref={outerRef}
        className="absolute hidden md:block pointer-events-none overflow-hidden"
        style={{
          top: '58%',
          right: '-16vw',
          width: '90vw',
          height: 'calc(100svh - 48px)',
          transform: 'translateY(-50%)',
          zIndex: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 15%, black 68%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 15%, black 68%, transparent 100%)',
          }}
        >
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    );
  }

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
