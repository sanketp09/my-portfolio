/**
 * ExperienceObject.jsx — "Chronosphere"
 * ORBITAL RIFT navigation object for professional experience and growth.
 *
 * A gyroscopic, armillary-style instrument built from procedural Three.js
 * geometry: five concentric rings at different radii and inclinations, a
 * machined band, a chronometer tick ring that lights up with `progress`,
 * marker spheres, a central axis with floating elements, and a growing core.
 *
 * Usage (inside a parent <Canvas>):
 *   import { ExperienceObject } from "./ExperienceObject";
 *   <ExperienceObject progress={0.4} isHovered={false} isSelected={false}
 *                     onSelect={() => {}} reducedMotion={false} />
 *
 * Geometry is built around the local origin (0,0,0), outer radius ≈ 1.0
 * (halo ≈ 1.2, axis half-length ≈ 1.15). The parent owns position and scale.
 * No Canvas, no scroll handling, no routing, no React state per frame.
 */

import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

/* ------------------------------------------------------------------ */
/* Palette: silver, graphite, steel-blue, restrained cool highlights   */
/* ------------------------------------------------------------------ */
const PALETTE = {
  silver: "#cfd6de",
  silverGlow: "#1c2733",
  graphite: "#3a4149",
  graphiteGlow: "#10171e",
  steel: "#5f86ad",
  steelGlow: "#2d5078",
  band: "#46566b",
  bandGlow: "#16222f",
  axis: "#232930",
  tick: "#8d99a7",
  marker: "#e2ebf3",
  markerGlow: "#8fcfff",
  accent: "#ffffff",
  accentGlow: "#9fe0ff",
  core: "#a9cdee",
  coreGlow: "#4f9fe0",
  wire: "#7fa8cf",
  halo: "#9fd8ff",
};

const COLOR_LIT = new THREE.Color("#a9dcff");
const COLOR_DIM = new THREE.Color("#4b5561");

/* ------------------------------------------------------------------ */
/* Ring definitions                                                    */
/* tilt: static inclination [x, y, z] (radians)                        */
/* speed: rad/s of in-plane spin, sign = direction                     */
/* sweepTurns: extra turns the ring makes as progress goes 0 -> 1      */
/* pAmp / pSpeed / pPhase: tiny deterministic precession of X tilt     */
/* ------------------------------------------------------------------ */
const RINGS = [
  {
    id: "outer",
    shape: "torus",
    radius: 1.0,
    tube: 0.012,
    mat: "silver",
    tilt: [0.42, 0.0, 0.12],
    phase: 0.0,
    speed: 0.1,
    sweepTurns: 0.5,
    pAmp: 0.035,
    pSpeed: 0.21,
    pPhase: 0.0,
    ticks: { count: 60, outerEnd: 0.982, length: 0.045, major: 5, majorScale: 1.8, lit: true },
    markers: [
      { a: 0.0, r: 0.042, accent: true },
      { a: 2.094, r: 0.028 },
      { a: 4.189, r: 0.028 },
    ],
    pins: [],
  },
  {
    id: "band",
    shape: "band",
    radius: 0.76,
    halfWidth: 0.035,
    mat: "band",
    tilt: [1.18, 0.52, 0.0],
    phase: 0.8,
    speed: -0.16,
    sweepTurns: -0.75,
    pAmp: 0.03,
    pSpeed: 0.17,
    pPhase: 1.3,
    ticks: { count: 48, outerEnd: 0.805, length: 0.035, major: 4, majorScale: 1.6, lit: false },
    markers: [{ a: 3.3, r: 0.03 }],
    pins: [],
  },
  {
    id: "fine",
    shape: "torus",
    radius: 0.88,
    tube: 0.006,
    mat: "steel",
    tilt: [1.9, -0.62, 0.2],
    phase: 1.9,
    speed: -0.08,
    sweepTurns: 0.25,
    pAmp: 0.03,
    pSpeed: 0.13,
    pPhase: 2.4,
    ticks: null,
    markers: [
      { a: 0.6, r: 0.03 },
      { a: 3.74, r: 0.03 },
    ],
    pins: [HALF_PI, HALF_PI * 3],
  },
  {
    id: "mid",
    shape: "torus",
    radius: 0.58,
    tube: 0.016,
    mat: "graphite",
    tilt: [1.62, 0.0, 0.9],
    phase: 2.6,
    speed: 0.2,
    sweepTurns: 1.0,
    pAmp: 0.04,
    pSpeed: 0.24,
    pPhase: 0.7,
    ticks: null,
    markers: [
      { a: 1.0, r: 0.032 },
      { a: 4.1, r: 0.032 },
    ],
    pins: [0, Math.PI],
  },
  {
    id: "inner",
    shape: "torus",
    radius: 0.42,
    tube: 0.011,
    mat: "steel",
    tilt: [0.3, 1.1, 0.4],
    phase: 0.4,
    speed: 0.28,
    sweepTurns: -1.25,
    pAmp: 0.045,
    pSpeed: 0.3,
    pPhase: 3.1,
    ticks: null,
    markers: [{ a: 2.4, r: 0.026 }],
    pins: [],
  },
];

/* ------------------------------------------------------------------ */
/* Shared geometry + materials (created once per instance, disposed)   */
/* ------------------------------------------------------------------ */
function createAssets() {
  const disposables = [];
  const track = (o) => {
    disposables.push(o);
    return o;
  };

  const standard = (color, glow, metalness, roughness, glowIntensity, extra = {}) =>
    track(
      new THREE.MeshStandardMaterial({
        color,
        metalness,
        roughness,
        emissive: new THREE.Color(glow),
        emissiveIntensity: glowIntensity,
        ...extra,
      })
    );

  const mats = {
    silver: standard(PALETTE.silver, PALETTE.silverGlow, 0.78, 0.28, 0.18),
    graphite: standard(PALETTE.graphite, PALETTE.graphiteGlow, 0.7, 0.45, 0.2),
    steel: standard(PALETTE.steel, PALETTE.steelGlow, 0.72, 0.34, 0.25),
    band: standard(PALETTE.band, PALETTE.bandGlow, 0.8, 0.38, 0.2, { side: THREE.DoubleSide }),
    axis: standard(PALETTE.axis, PALETTE.graphiteGlow, 0.7, 0.4, 0.2),
    marker: standard(PALETTE.marker, PALETTE.markerGlow, 0.25, 0.3, 0.6),
    accent: standard(PALETTE.accent, PALETTE.accentGlow, 0.15, 0.25, 1.1),
    core: standard(PALETTE.core, PALETTE.coreGlow, 0.2, 0.3, 1.0),
    wire: track(
      new THREE.MeshBasicMaterial({
        color: PALETTE.wire,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      })
    ),
    halo: track(
      new THREE.MeshBasicMaterial({
        color: PALETTE.halo,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    ),
    tickLit: track(new THREE.MeshBasicMaterial({ color: "#ffffff" })),
    tickPlain: track(new THREE.MeshBasicMaterial({ color: PALETTE.tick })),
  };

  const ringGeos = RINGS.map((cfg) =>
    track(
      cfg.shape === "band"
        ? new THREE.CylinderGeometry(cfg.radius, cfg.radius, cfg.halfWidth * 2, 96, 1, true)
        : new THREE.TorusGeometry(cfg.radius, cfg.tube, 10, 160)
    )
  );

  const band = RINGS.find((r) => r.shape === "band");

  return {
    mats,
    ringGeos,
    rimGeo: track(new THREE.TorusGeometry(band.radius, 0.006, 8, 96)),
    tickGeo: track(new THREE.BoxGeometry(0.008, 1, 0.008)),
    sphereGeo: track(new THREE.SphereGeometry(1, 16, 12)),
    pinGeo: track(new THREE.CylinderGeometry(0.014, 0.014, 0.1, 10)),
    coreWireGeo: track(new THREE.IcosahedronGeometry(0.2, 1)),
    floatGeo: track(new THREE.OctahedronGeometry(0.05, 0)),
    axisGeo: track(new THREE.CylinderGeometry(0.006, 0.006, 2.3, 8)),
    discGeo: track(new THREE.TorusGeometry(0.05, 0.004, 6, 32)),
    haloGeo: track(new THREE.TorusGeometry(1.2, 0.004, 6, 128)),
    disposables,
  };
}

/* ------------------------------------------------------------------ */
/* Instanced radial tick marks. Lit variant lights ticks in order      */
/* ------------------------------------------------------------------ */
function TickBand({ spec, geometry, material, animRef }) {
  const meshRef = useRef(null);
  const litCountRef = useRef(-1);
  const { count, outerEnd, length, major, majorScale, lit } = spec;

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU;
      const len = i % major === 0 ? length * majorScale : length;
      const r = outerEnd - len / 2;
      dummy.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      dummy.rotation.set(0, 0, a - HALF_PI);
      dummy.scale.set(1, len, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (lit) mesh.setColorAt(i, COLOR_DIM);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (lit && mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    litCountRef.current = -1;
  }, [count, outerEnd, length, major, majorScale, lit]);

  useFrame(() => {
    if (!lit) return;
    const mesh = meshRef.current;
    if (!mesh) return;
    const n = Math.round(animRef.current.p * count);
    if (n === litCountRef.current) return;
    litCountRef.current = n;
    for (let i = 0; i < count; i++) {
      mesh.setColorAt(i, i < n ? COLOR_LIT : COLOR_DIM);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ */
/* One gimbal ring: fixed tilt group -> spinning group (in-plane Z)    */
/* ------------------------------------------------------------------ */
function Ring({ cfg, geometry, assets, tiltRef, spinRef, animRef }) {
  const { mats } = assets;
  const material = mats[cfg.mat];

  return (
    <group ref={tiltRef} rotation={cfg.tilt}>
      <group ref={spinRef} rotation={[0, 0, cfg.phase]}>
        {cfg.shape === "band" ? (
          <>
            <mesh geometry={geometry} material={material} rotation={[HALF_PI, 0, 0]} />
            <mesh geometry={assets.rimGeo} material={mats.silver} position={[0, 0, cfg.halfWidth]} />
            <mesh geometry={assets.rimGeo} material={mats.silver} position={[0, 0, -cfg.halfWidth]} />
          </>
        ) : (
          <mesh geometry={geometry} material={material} />
        )}
        {cfg.ticks && (
          <TickBand
            spec={cfg.ticks}
            geometry={assets.tickGeo}
            material={cfg.ticks.lit ? mats.tickLit : mats.tickPlain}
            animRef={animRef}
          />
        )}
        {cfg.pins.map((a) => (
          <mesh
            key={`pin-${a}`}
            geometry={assets.pinGeo}
            material={mats.silver}
            position={[Math.cos(a) * cfg.radius, Math.sin(a) * cfg.radius, 0]}
            rotation={[0, 0, a - HALF_PI]}
          />
        ))}
        {cfg.markers.map((m) => (
          <mesh
            key={`marker-${m.a}`}
            geometry={assets.sphereGeo}
            material={m.accent ? mats.accent : mats.marker}
            position={[Math.cos(m.a) * cfg.radius, Math.sin(m.a) * cfg.radius, 0]}
            scale={m.r}
          />
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* ExperienceObject component                                            */
/* ------------------------------------------------------------------ */
export function ExperienceObject({
  progress = 0,
  isHovered = false,
  isSelected = false,
  onSelect,
  onHover,
  onHoverOut,
  reducedMotion,
}) {
  const assets = useMemo(() => createAssets(), []);
  useEffect(() => () => assets.disposables.forEach((d) => d.dispose()), [assets]);

  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const reduced = typeof reducedMotion === "boolean" ? reducedMotion : prefersReduced;

  const clampedProgress = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;

  const live = useRef({});
  live.current = {
    progress: clampedProgress,
    isHovered: !!isHovered,
    isSelected: !!isSelected,
    reduced,
    onSelect,
    onHover,
    onHoverOut,
  };

  const pointer = useRef({ over: false });
  const anim = useRef({ hover: 0, sel: 0, p: clampedProgress, t: 0 });

  const rootRef = useRef(null);
  const tiltRefs = useRef([]);
  const spinRefs = useRef([]);
  const coreRef = useRef(null);
  const coreWireRef = useRef(null);
  const floatARef = useRef(null);
  const floatBRef = useRef(null);
  const haloRef = useRef(null);

  useEffect(
    () => () => {
      if (pointer.current.over && typeof document !== "undefined") {
        document.body.style.cursor = "auto";
      }
    },
    []
  );

  const handleOver = () => {
    pointer.current.over = true;
    if (typeof document !== "undefined") document.body.style.cursor = "pointer";
    if (typeof live.current.onHover === "function") live.current.onHover();
  };
  const handleOut = () => {
    pointer.current.over = false;
    if (typeof document !== "undefined") document.body.style.cursor = "auto";
    if (typeof live.current.onHoverOut === "function") live.current.onHoverOut();
  };
  const handleClick = (e) => {
    const cb = live.current.onSelect;
    if (typeof cb === "function") cb(e);
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const { progress: pTarget, isHovered: h, isSelected: s, reduced: rm } = live.current;
    const a = anim.current;
    const damp = THREE.MathUtils.damp;

    a.hover = damp(a.hover, h || pointer.current.over ? 1 : 0, rm ? 60 : 7, dt);
    a.sel = damp(a.sel, s ? 1 : 0, rm ? 60 : 5, dt);
    a.p = damp(a.p, pTarget, rm ? 60 : 4, dt);

    const motion = rm ? 0 : 1;
    a.t += dt * motion * (1 + 0.7 * a.hover + 0.3 * a.sel);
    const t = a.t;

    // Update rings
    for (let i = 0; i < RINGS.length; i++) {
      const cfg = RINGS[i];
      const spin = spinRefs.current[i];
      const tilt = tiltRefs.current[i];
      if (spin) {
        spin.rotation.z = cfg.phase + cfg.speed * t + cfg.sweepTurns * TAU * a.p;
      }
      if (tilt) {
        tilt.rotation.x = cfg.tilt[0] + Math.sin(t * cfg.pSpeed + cfg.pPhase) * cfg.pAmp;
      }
    }

    if (rootRef.current) {
      rootRef.current.scale.setScalar(1 + 0.07 * a.hover + 0.04 * a.sel);
    }

    const coreScale = 0.065 + 0.04 * a.p;
    if (coreRef.current) coreRef.current.scale.setScalar(coreScale);
    if (coreWireRef.current) {
      coreWireRef.current.rotation.set(t * 0.2, t * 0.35, 0);
      coreWireRef.current.scale.setScalar(0.9 + 0.2 * a.p);
    }

    const bob = Math.sin(t * 0.9) * 0.025;
    if (floatARef.current) {
      floatARef.current.position.y = 0.4 + bob;
      floatARef.current.rotation.y = t * 0.6;
    }
    if (floatBRef.current) {
      floatBRef.current.position.y = -0.4 - bob;
      floatBRef.current.rotation.y = -t * 0.6;
    }

    const m = assets.mats;
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.4);
    m.marker.emissiveIntensity = 0.55 + 0.9 * a.hover + 0.7 * a.sel + 0.12 * pulse;
    m.accent.emissiveIntensity = 1.0 + 1.0 * a.hover + 0.9 * a.sel + 0.2 * pulse;
    m.core.emissiveIntensity = 0.9 + 0.8 * a.hover + 0.7 * a.sel + 0.25 * pulse;
    m.steel.emissiveIntensity = 0.25 + 0.25 * a.hover + 0.35 * a.sel;
    m.silver.emissiveIntensity = 0.18 + 0.12 * a.hover + 0.18 * a.sel;
    m.wire.opacity = 0.45 + 0.25 * a.hover + 0.2 * a.sel;

    const haloOpacity = 0.5 * a.sel + 0.14 * a.hover;
    m.halo.opacity = haloOpacity;
    if (haloRef.current) {
      haloRef.current.visible = haloOpacity > 0.01;
      haloRef.current.scale.setScalar(1 + 0.02 * a.sel * Math.sin(t * 1.2));
    }
  });

  return (
    <group ref={rootRef} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
      {/* Invisible hit volume */}
      <mesh>
        <sphereGeometry args={[1.12, 16, 12]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>

      {/* Gimbal rings */}
      {RINGS.map((cfg, i) => (
        <Ring
          key={cfg.id}
          cfg={cfg}
          geometry={assets.ringGeos[i]}
          assets={assets}
          animRef={anim}
          tiltRef={(el) => {
            tiltRefs.current[i] = el;
          }}
          spinRef={(el) => {
            spinRefs.current[i] = el;
          }}
        />
      ))}

      {/* Central axis */}
      <mesh geometry={assets.axisGeo} material={assets.mats.axis} />
      <mesh geometry={assets.sphereGeo} material={assets.mats.silver} position={[0, 1.15, 0]} scale={0.024} />
      <mesh geometry={assets.sphereGeo} material={assets.mats.silver} position={[0, -1.15, 0]} scale={0.024} />
      <mesh geometry={assets.discGeo} material={assets.mats.silver} position={[0, 0.95, 0]} rotation={[HALF_PI, 0, 0]} />
      <mesh geometry={assets.discGeo} material={assets.mats.silver} position={[0, -0.95, 0]} rotation={[HALF_PI, 0, 0]} />

      {/* Floating beads */}
      <mesh ref={floatARef} geometry={assets.floatGeo} material={assets.mats.steel} position={[0, 0.4, 0]} />
      <mesh ref={floatBRef} geometry={assets.floatGeo} material={assets.mats.steel} position={[0, -0.4, 0]} />

      {/* Core */}
      <mesh ref={coreRef} geometry={assets.sphereGeo} material={assets.mats.core} scale={0.065} />
      <mesh ref={coreWireRef} geometry={assets.coreWireGeo} material={assets.mats.wire} />

      {/* Selection halo */}
      <mesh
        ref={haloRef}
        geometry={assets.haloGeo}
        material={assets.mats.halo}
        rotation={[HALF_PI, 0, 0]}
        visible={false}
      />
    </group>
  );
}

export default ExperienceObject;
