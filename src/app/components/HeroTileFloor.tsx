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
  clockAngle: number;
  delay: number;
  duration: number;
  height: number;
  radialDistance: number;
  separatedHeight: number;
  separatedWidth: number;
  tilt: number;
  width: number;
  wobble: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (value: number) => {
  const t = clamp01(value);
  return 1 - Math.pow(1 - t, 3);
};
const seededNoise = (row: number, column: number) => {
  const value = Math.sin(row * 91.17 + column * 147.31) * 43758.5453;
  return value - Math.floor(value);
};

/**
 * A projected circle of real 3D boxes. The building base is the center of
 * gravity: tiles keep their radius, orbit around it like positions on a clock,
 * hinge in their own radial direction, and fade without being pulled inward.
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

    // Fewer, slightly larger pieces keep the floor readable as a single
    // surface before the radial break begins.
    const columns = isMobile ? 30 : 64;
    const rows = isMobile ? 16 : 19;
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
      transparent: true,
    });
    const opacityAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(tileCount).fill(1),
      1,
    );
    opacityAttribute.setUsage(THREE.DynamicDrawUsage);
    tileGeometry.setAttribute('instanceOpacity', opacityAttribute);
    tileMaterial.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nattribute float instanceOpacity;\nvarying float vInstanceOpacity;',
        )
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvInstanceOpacity = instanceOpacity;',
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nvarying float vInstanceOpacity;',
        )
        .replace(
          '#include <dithering_fragment>',
          'gl_FragColor.a *= vInstanceOpacity;\nif (gl_FragColor.a < 0.01) discard;\n#include <dithering_fragment>',
        );
    };
    tileMaterial.customProgramCacheKey = () => 'hero-radial-tile-opacity-v1';
    const tiles = new THREE.InstancedMesh(tileGeometry, tileMaterial, tileCount);
    tiles.frustumCulled = false;
    tiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(tiles);

    scene.add(new THREE.AmbientLight(0xf4f3ed, 1.45));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.9);
    keyLight.position.set(-320, 420, 820);
    scene.add(keyLight);
    const edgeLight = new THREE.DirectionalLight(0x9aa49d, 1.25);
    edgeLight.position.set(420, -120, 520);
    scene.add(edgeLight);

    const tileStates: TileState[] = [];
    const tileMatrix = new THREE.Object3D();
    const flatCenterOffset = new THREE.Vector3();
    const rotatedCenterOffset = new THREE.Vector3();
    const flatRotation = new THREE.Euler();
    let width = 1;
    let height = 1;
    let ellipseRadiusX = 1;
    let ellipseRadiusY = 1;
    let animationComplete = false;

    const getGravityCenter = (target: Point) => ({
      x: target.x,
      // Keep the gravity center close to the building while allowing the
      // projected oval to sit higher in the hero.
      y: Math.max(
        height * (isMobile ? 0.755 : 0.775),
        Math.min(
          height * 0.815,
          target.y + height * (isMobile ? 0.04 : 0.045),
        ),
      ),
    });

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
      const horizon = height * (isMobile ? 0.65 : 0.66);
      const floorHeight = height - horizon;
      const fallbackCenter = {
        x: width * (isMobile ? 0.345 : 0.825),
        y: height * (isMobile ? 0.86 : 0.78) - 48,
      };
      const rawCenter =
        targetRef.current.x > 0 && targetRef.current.y > 0
          ? targetRef.current
          : fallbackCenter;
      const center = getGravityCenter(rawCenter);
      // This is a circle in the imagined ground plane. Its strong vertical
      // compression is what makes the circle read as an oval in projection.
      // Both radii deliberately exceed the viewport so the visible bottom
      // third has no uncovered corners.
      ellipseRadiusX = width * (isMobile ? 1.08 : 1.25);
      ellipseRadiusY = height * (isMobile ? 0.48 : 0.5);
      const gap = isMobile ? 0.75 : 1.15;
      const joinedOverlap = isMobile ? 0.45 : 0.7;
      const cellWidth = width / columns;

      for (let row = 0; row < rows; row += 1) {
        const nearDepth = row / rows;
        const farDepth = (row + 1) / rows;
        const nearY = horizon + floorHeight * Math.pow(nearDepth, 1.22);
        const farY = horizon + floorHeight * Math.pow(farDepth, 1.22);
        const cellHeight = farY - nearY;
        const tileHeight = cellHeight + joinedOverlap;
        const separatedHeight = Math.max(2.4, cellHeight - gap);
        const centerY = (nearY + farY) / 2;

        for (let column = 0; column < columns; column += 1) {
          const noise = seededNoise(row, column);
          const centerX = (column + 0.5) * cellWidth;
          const normalizedX = (centerX - center.x) / ellipseRadiusX;
          const normalizedY = (centerY - center.y) / ellipseRadiusY;
          const radialDistance = Math.hypot(normalizedX, normalizedY);
          if (radialDistance > 1) continue;

          // atan2(x, -y) makes zero point to 12 o'clock and increases
          // clockwise: 3, 6, 9, then back to 12.
          const clockAngle =
            (Math.atan2(normalizedX, -normalizedY) + Math.PI * 2) %
            (Math.PI * 2);
          const clockProgress = clockAngle / (Math.PI * 2);
          // Radial ordering dominates the timing: the visible perimeter must
          // always release before the next ring, with the gravity-center tiles
          // held until the end. Clock/noise only soften each ring's edge.
          const perimeterToCenter = Math.pow(1 - radialDistance, 1.22);

          tileStates.push({
            clockAngle,
            delay:
              perimeterToCenter * 0.72 +
              clockProgress * 0.045 +
              noise * 0.012,
            duration: 1.05 + noise * 0.1,
            height: tileHeight,
            radialDistance,
            separatedHeight,
            separatedWidth: Math.max(2.8, cellWidth - gap),
            tilt: (noise - 0.5) * 0.24,
            width: cellWidth + joinedOverlap,
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
      const gravityCenter = getGravityCenter(liveTarget);
      let unfinished = sequenceStart === 0;

      for (let index = 0; index < tileCount; index += 1) {
        const tile = tileStates[index];
        if (!tile) {
          tileMatrix.position.set(0, 0, -10);
          tileMatrix.rotation.set(0, 0, 0);
          tileMatrix.scale.set(0.001, 0.001, 0.001);
          tileMatrix.updateMatrix();
          tiles.setMatrixAt(index, tileMatrix.matrix);
          opacityAttribute.setX(index, 0);
          continue;
        }
        const progress =
          sequenceStart === 0
            ? 0
            : clamp01((elapsed - tile.delay) / tile.duration);
        if (progress < 1) unfinished = true;

        // Reference motion: bonded to the floor, abrupt edge release, full
        // airborne back-flip around the tile's own center, then fade in flight.
        const breakProgress = smoothstep(progress / 0.075);
        const separationProgress = smoothstep((progress - 0.018) / 0.09);
        const peelProgress = smoothstep((progress - 0.045) / 0.19);
        const releaseProgress = smoothstep((progress - 0.17) / 0.17);
        const tumbleProgress = smoothstep((progress - 0.2) / 0.76);
        const airborneProgress = easeOutCubic((progress - 0.12) / 0.78);
        // Fade as soon as the tile clears its hinge so the motion reads as a
        // brief breakaway instead of a suspended tumble.
        const fadeProgress = smoothstep((progress - 0.34) / 0.14);
        const finalScaleOut = smoothstep((progress - 0.44) / 0.08);
        const scale = Math.max(
          0.001,
          (1 - fadeProgress * 0.08) * (1 - finalScaleOut),
        );
        const tileWidth =
          THREE.MathUtils.lerp(
            tile.width,
            tile.separatedWidth,
            separationProgress,
          ) * scale;
        const tileHeight =
          THREE.MathUtils.lerp(
            tile.height,
            tile.separatedHeight,
            separationProgress,
          ) * scale;
        // A small clockwise orbit makes every "hour" react tangentially in a
        // different direction while preserving its distance from the center.
        const orbitAngle =
          tile.clockAngle +
          tumbleProgress * (0.02 + tile.wobble * 0.004);
        const ellipseOffsetX =
          ellipseRadiusX * tile.radialDistance * Math.sin(orbitAngle);
        const ellipseOffsetY =
          -ellipseRadiusY * tile.radialDistance * Math.cos(orbitAngle);
        const radialKick =
          (4 + tile.radialDistance * 9) *
          peelProgress *
          (1 - fadeProgress * 0.78);
        const normalizedRadialX = Math.sin(orbitAngle);
        const normalizedRadialY = -Math.cos(orbitAngle);
        const screenCenterX =
          gravityCenter.x + ellipseOffsetX + normalizedRadialX * radialKick;
        const screenCenterY =
          gravityCenter.y + ellipseOffsetY + normalizedRadialY * radialKick;
        const worldCenterX = screenCenterX - width / 2;
        const groundWorldCenterY = height / 2 - screenCenterY;
        const hingeRotationZ = Math.atan2(
          Math.sin(Math.PI - orbitAngle),
          Math.cos(Math.PI - orbitAngle),
        );
        const selfSpin =
          tile.tilt * breakProgress + tile.wobble * tumbleProgress * 0.04;
        // The joined floor begins with every rectangle on the same grid axes.
        // Radial hinge alignment only appears as the seams open.
        const rotationZ =
          hingeRotationZ * separationProgress + selfSpin;
        // Keep the backward turn compact: the tile shows its thickness and
        // begins to flip, then fades before completing a long rotation.
        const rotationX =
          -breakProgress * 0.05 -
          peelProgress * 0.35 -
          tumbleProgress * 0.9;
        const rotationY =
          tile.wobble * 0.04 * peelProgress +
          tile.wobble * 0.05 * tumbleProgress;
        const airborneRise =
          airborneProgress * (58 + tile.radialDistance * 24);
        const airborneDepth =
          airborneProgress * (84 + Math.abs(tile.wobble) * 22);

        tileMatrix.rotation.set(
          rotationX,
          rotationY,
          rotationZ,
        );
        // The translated box uses a far-edge pivot while attached. Once it
        // releases, compensate the rotated center so the remaining turn occurs
        // around the tile itself instead of continuing to cartwheel on one edge.
        flatCenterOffset
          .set(0, -tileHeight * 0.5, 0)
          .applyEuler(flatRotation.set(0, 0, rotationZ));
        rotatedCenterOffset
          .set(0, -tileHeight * 0.5, 0)
          .applyEuler(tileMatrix.rotation);
        const hingePivotX = worldCenterX - flatCenterOffset.x;
        const hingePivotY = groundWorldCenterY - flatCenterOffset.y;
        const hingePivotZ = breakProgress * 2;
        const airbornePivotX = worldCenterX - rotatedCenterOffset.x;
        const airbornePivotY =
          groundWorldCenterY + airborneRise - rotatedCenterOffset.y;
        const airbornePivotZ = airborneDepth - rotatedCenterOffset.z;

        tileMatrix.position.set(
          THREE.MathUtils.lerp(hingePivotX, airbornePivotX, releaseProgress),
          THREE.MathUtils.lerp(hingePivotY, airbornePivotY, releaseProgress),
          THREE.MathUtils.lerp(hingePivotZ, airbornePivotZ, releaseProgress),
        );
        tileMatrix.scale.set(
          tileWidth,
          tileHeight,
          Math.max(0.001, 3.2 * scale),
        );
        tileMatrix.updateMatrix();
        tiles.setMatrixAt(index, tileMatrix.matrix);
        opacityAttribute.setX(index, 1 - fadeProgress);

      }

      tiles.instanceMatrix.needsUpdate = true;
      opacityAttribute.needsUpdate = true;
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
