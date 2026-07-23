import { useLayoutEffect, useRef, type MutableRefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';

type Point = {
  x: number;
  y: number;
};

type HeroTileFloorProps = {
  durationSeconds: number;
  isMobile: boolean;
  sequenceStartRef: MutableRefObject<number>;
  targetRef: MutableRefObject<Point>;
};

type TileState = {
  delay: number;
  duration: number;
  height: number;
  startX: number;
  startY: number;
  tilt: number;
  width: number;
  wobble: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (value: number) => {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const seededNoise = (row: number, column: number) => {
  const value = Math.sin(row * 91.17 + column * 147.31) * 43758.5453;
  return value - Math.floor(value);
};

/**
 * A single-draw-call field of real 3D boxes. Each tile hinges around its far
 * edge, exposes its thickness, lifts off the hero plane, and only then flies
 * toward the projected base of the building.
 */
export function HeroTileFloor({
  durationSeconds,
  isMobile,
  sequenceStartRef,
  targetRef,
}: HeroTileFloorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || shouldReduceMotion) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    Object.assign(renderer.domElement.style, {
      display: 'block',
      height: '100%',
      pointerEvents: 'none',
      width: '100%',
    });
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2200);
    camera.position.z = 1000;

    const columns = isMobile ? 32 : 72;
    const rows = isMobile ? 16 : 18;
    const tileCount = columns * rows;
    const tileGeometry = new THREE.BoxGeometry(1, 1, 1);
    // Put the pivot on the far edge. The near edge can now be pried upward
    // exactly like a small ceramic tile being lifted by a scraper.
    tileGeometry.translate(0, -0.5, 0);

    const tileMaterial = new THREE.MeshStandardMaterial({
      color: 0x151715,
      flatShading: true,
      metalness: 0.04,
      roughness: 0.76,
    });
    const tiles = new THREE.InstancedMesh(tileGeometry, tileMaterial, tileCount);
    tiles.frustumCulled = false;
    tiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(tiles);

    const shadowGeometry = new THREE.PlaneGeometry(1, 1);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthWrite: false,
      opacity: 0.16,
      transparent: true,
    });
    const shadows = new THREE.InstancedMesh(
      shadowGeometry,
      shadowMaterial,
      tileCount,
    );
    shadows.frustumCulled = false;
    shadows.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(shadows);

    scene.add(new THREE.AmbientLight(0xf4f3ed, 1.45));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.9);
    keyLight.position.set(-320, 420, 820);
    scene.add(keyLight);
    const edgeLight = new THREE.DirectionalLight(0x9aa49d, 1.25);
    edgeLight.position.set(420, -120, 520);
    scene.add(edgeLight);

    const tileStates: TileState[] = [];
    const tileMatrix = new THREE.Object3D();
    const shadowMatrix = new THREE.Object3D();
    let width = 1;
    let height = 1;
    let animationComplete = false;

    const rebuildTileField = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      tileStates.length = 0;
      const horizon = height * (2 / 3);
      const floorHeight = height - horizon;
      const gap = isMobile ? 0.75 : 1.15;

      for (let row = 0; row < rows; row += 1) {
        const nearDepth = row / rows;
        const farDepth = (row + 1) / rows;
        const nearY = horizon + floorHeight * Math.pow(nearDepth, 1.34);
        const farY = horizon + floorHeight * Math.pow(farDepth, 1.34);
        const tileHeight = Math.max(2.4, farY - nearY - gap);
        const centerY = (nearY + farY) / 2;
        const depth = (row + 0.5) / rows;
        // The field widens toward the viewer, producing a ground-plane
        // perspective while still covering the full lower third at the horizon.
        const rowWidth = width * (1.04 + depth * 0.18);
        const rowLeft = (width - rowWidth) / 2;
        const cellWidth = rowWidth / columns;

        for (let column = 0; column < columns; column += 1) {
          const noise = seededNoise(row, column);
          const startX = rowLeft + (column + 0.5) * cellWidth;
          const bottomToTop = 1 - depth;
          const waveRipple =
            (Math.sin(column * 0.66 + row * 0.47) * 0.5 + 0.5) * 0.055;

          tileStates.push({
            delay: bottomToTop * 0.88 + waveRipple + noise * 0.045,
            duration: 1.52 + noise * 0.17,
            height: tileHeight,
            startX,
            startY: centerY,
            tilt: (noise - 0.5) * 0.24,
            width: Math.max(2.8, cellWidth - gap),
            wobble: Math.sin((column + 1) * 1.83 + row * 0.71),
          });
        }
      }
      animationComplete = false;
    };

    const renderTiles = (now: number) => {
      const sequenceStart = sequenceStartRef.current;
      const elapsed = sequenceStart === 0 ? 0 : (now - sequenceStart) / 1000;
      const fallbackTarget = {
        x: width * (isMobile ? 0.345 : 0.825),
        y: height * (isMobile ? 0.86 : 0.78) - 48,
      };
      const liveTarget =
        targetRef.current.x > 0 && targetRef.current.y > 0
          ? targetRef.current
          : fallbackTarget;
      const targetX = liveTarget.x - width / 2;
      const targetY = height / 2 - liveTarget.y;
      let unfinished = sequenceStart === 0;

      for (let index = 0; index < tileStates.length; index += 1) {
        const tile = tileStates[index];
        const progress =
          sequenceStart === 0
            ? 0
            : clamp01((elapsed - tile.delay) / tile.duration);
        if (progress < 1) unfinished = true;

        const breakProgress = smoothstep(progress / 0.13);
        const peelProgress = smoothstep((progress - 0.1) / 0.34);
        const flightProgress = easeInOutCubic((progress - 0.38) / 0.62);
        const vanishProgress = smoothstep((progress - 0.55) / 0.45);
        const scale = Math.max(0.001, 1 - vanishProgress);
        const startX = tile.startX - width / 2;
        const startY = height / 2 - tile.startY + tile.height / 2;
        const arc = Math.sin(flightProgress * Math.PI);
        const horizontalFlutter =
          tile.wobble * 6 * peelProgress * (1 - flightProgress);
        const lift =
          peelProgress * (13 + tile.height * 0.36) * (1 - flightProgress) +
          arc * (34 + Math.abs(tile.wobble) * 18);
        const depthLift =
          breakProgress * 3 + peelProgress * 52 + arc * 54 - flightProgress * 18;

        tileMatrix.position.set(
          THREE.MathUtils.lerp(startX, targetX, flightProgress) + horizontalFlutter,
          THREE.MathUtils.lerp(startY, targetY, flightProgress) + lift,
          depthLift,
        );
        tileMatrix.rotation.set(
          -breakProgress * 0.13 -
            peelProgress * 1.34 -
            flightProgress * 1.28,
          tile.wobble * 0.13 * peelProgress + tile.wobble * 0.2 * flightProgress,
          tile.tilt * peelProgress + tile.wobble * 0.34 * flightProgress,
        );
        tileMatrix.scale.set(
          tile.width * scale,
          tile.height * scale,
          Math.max(0.001, 3.2 * scale),
        );
        tileMatrix.updateMatrix();
        tiles.setMatrixAt(index, tileMatrix.matrix);

        // The contact shadow stays near the exposed floor during the peel,
        // then gets pulled into the same vanishing point with the fragment.
        const shadowTravel = flightProgress * 0.54;
        shadowMatrix.position.set(
          THREE.MathUtils.lerp(startX, targetX, shadowTravel),
          THREE.MathUtils.lerp(
            height / 2 - tile.startY,
            targetY,
            shadowTravel,
          ),
          -4,
        );
        shadowMatrix.rotation.set(0, 0, tile.tilt * peelProgress * 0.3);
        const shadowScale =
          scale *
          (0.01 + peelProgress * (0.82 + Math.min(0.4, depthLift / 190)));
        shadowMatrix.scale.set(
          tile.width * shadowScale,
          tile.height * shadowScale,
          1,
        );
        shadowMatrix.updateMatrix();
        shadows.setMatrixAt(index, shadowMatrix.matrix);
      }

      tiles.instanceMatrix.needsUpdate = true;
      shadows.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
      animationComplete =
        !unfinished && elapsed >= durationSeconds - 0.05;
    };

    rebuildTileField();
    const resizeObserver = new ResizeObserver(rebuildTileField);
    resizeObserver.observe(container);

    let frame = 0;
    const tick = (now: number) => {
      renderTiles(now);
      if (!animationComplete) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      tileGeometry.dispose();
      tileMaterial.dispose();
      shadowGeometry.dispose();
      shadowMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    durationSeconds,
    isMobile,
    sequenceStartRef,
    shouldReduceMotion,
    targetRef,
  ]);

  if (shouldReduceMotion) return null;

  return (
    <div
      ref={containerRef}
      className="hero-native-floor"
      aria-hidden="true"
    />
  );
}
