"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Abstract low-poly city cluster. Wireframe boxes at varying heights arranged
 * on a grid — reads as a construction site plan / architectural massing model.
 * Camera drifts subtly with the cursor for depth without stealing attention
 * from the headline that sits on top of it.
 *
 * Mobile fallback: the Canvas itself is fluid and Three.js falls back to a
 * lower-DPR render (pixelRatio capped at 2). If WebGL is unavailable, react-
 * three-fiber shows an empty canvas — the section still reads because the
 * headline is a sibling element, not inside the Canvas.
 */
export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        camera={{ position: [0, 4.5, 9], fov: 42 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </Canvas>
    </div>
  );
}

function SceneContents() {
  return (
    <>
      {/* Soft key light from the front-left; warm bone hue matches the palette. */}
      <ambientLight intensity={0.35} color="#F4EFE8" />
      <directionalLight position={[-4, 6, 5]} intensity={0.9} color="#F4EFE8" />
      {/* Rim light from behind adds a soft edge to each building. */}
      <directionalLight position={[6, 3, -4]} intensity={0.4} color="#EA580C" />
      <MouseParallaxRig />
      <CityCluster />
      <GroundLines />
    </>
  );
}

/**
 * Slides the camera 0.5 units toward the cursor position — enough to feel
 * alive without disorienting. Uses viewport-normalized mouse coords from R3F.
 */
function MouseParallaxRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 4.5, 9));

  useFrame((state, delta) => {
    const { x, y } = state.mouse; // -1..1
    target.current.x = x * 0.9;
    target.current.y = 4.5 - y * 0.5;
    // Lerp for smoothness — never snap to the cursor.
    camera.position.x += (target.current.x - camera.position.x) * Math.min(1, delta * 3);
    camera.position.y += (target.current.y - camera.position.y) * Math.min(1, delta * 3);
    camera.lookAt(0, 1, 0);
  });

  return null;
}

/**
 * Grid of low-poly boxes at varying heights. Deterministic layout so SSR /
 * every user sees the same "skyline" — feels intentional, not random noise.
 */
function CityCluster() {
  const groupRef = useRef<THREE.Group>(null);

  const buildings = useMemo(() => {
    const cells: Array<{
      x: number;
      z: number;
      w: number;
      d: number;
      h: number;
    }> = [];
    // 5x5 grid, spacing 1.4, some cells intentionally empty
    const skip = new Set(["1,3", "3,1", "4,4", "0,4"]);
    const heights = [2.4, 1.6, 3.2, 1.2, 2.8, 4.1, 1.9, 2.2, 3.6, 1.5, 2.9, 3.8, 1.7, 2.1, 3.4];
    let i = 0;
    for (let gx = 0; gx < 5; gx++) {
      for (let gz = 0; gz < 5; gz++) {
        if (skip.has(`${gx},${gz}`)) continue;
        cells.push({
          x: (gx - 2) * 1.4,
          z: (gz - 2) * 1.4,
          w: 0.9 + ((gx * 7 + gz * 3) % 3) * 0.1,
          d: 0.9 + ((gx * 5 + gz * 11) % 3) * 0.1,
          h: heights[i++ % heights.length],
        });
      }
    }
    return cells;
  }, []);

  // Slow ambient rotation of the whole cluster.
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          {/* Solid ink fill */}
          <mesh castShadow={false} receiveShadow={false}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color="#1C1917"
              roughness={0.85}
              metalness={0.05}
            />
          </mesh>
          {/* Wireframe overlay in bronze so each building reads as a drawing */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(b.w, b.h, b.d)]} />
            <lineBasicMaterial color="#A16207" transparent opacity={0.55} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

/**
 * Subtle grid lines on the ground plane so the cluster feels sited on a plot,
 * not floating in space. Uses THREE.GridHelper directly.
 */
function GroundLines() {
  return (
    <gridHelper
      args={[24, 24, "#D6CFC2", "#D6CFC2"]}
      position={[0, 0, 0]}
    />
  );
}
