import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const SEGMENTS = 28; // ring segments
const SEGMENT_STEP = (Math.PI * 2) / SEGMENTS;
const SEGMENT_ARC = SEGMENT_STEP * 0.74; // ~26% of each step is a visible gap
const R_INNER = 0.8;
const R_OUTER = 0.98;
const RING_MID = (R_INNER + R_OUTER) / 2;

const HEADS = 10; // particle comets
const TRAIL = 6; // points per comet
const PARTICLE_COUNT = HEADS * TRAIL;

const TICKS = 36;
const MARKER_RADIUS = 0.7;

// Warm palette
const TONES = [
  { name: "gold", color: "#ffc857", emissive: "#ffb21f" },
  { name: "orange", color: "#ff7a1a", emissive: "#ff5e0a" },
  { name: "amber", color: "#ffa31a", emissive: "#ff8c00" },
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};

// Deterministic pseudo‑random so the layout is identical every mount.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Reused temporaries (avoid per‑frame allocations).
const dummy = new THREE.Object3D();

/* ------------------------------------------------------------------ */
/* Procedural assets                                                   */
/* ------------------------------------------------------------------ */

function createSegmentGeometry() {
  // Annular sector centred on +X, extruded with a small bevel.
  const half = SEGMENT_ARC / 2;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, R_OUTER, -half, half, false);
  shape.absarc(0, 0, R_INNER, half, -half, true);
  shape.closePath();

  const depth = 0.1;
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.018,
    bevelSegments: 2,
    curveSegments: 10,
    steps: 1,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

function createGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.65)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function HackathonObject({
  progress = 1,
  isHovered = false,
  isSelected = false,
  onSelect,
  reducedMotion = false,
}) {
  const rootRef = useRef(); // emergence scale + visibility
  const tiltRef = useRef(); // slow organic tilt
  const spinRef = useRef(); // main ring rotation
  const markerRef = useRef(); // counter‑rotating inner group
  const pointsRef = useRef();
  const toneMeshRefs = useRef([]);
  const tickRef = useRef();

  // Animation state lives in a ref — never in React state.
  const state = useRef({
    prog: reducedMotion ? clamp01(progress) : 0,
    hov: 0,
    sel: 0,
    angle: 0,
    localHover: false,
    seeded: false,
  });

  /* ---------- geometry / materials ---------- */

  const assets = useMemo(() => {
    const segmentGeometry = createSegmentGeometry();

    // Which segment index belongs to which tone (gold accents, alternating orange/amber).
    const toneIndices = TONES.map(() => []);
    for (let i = 0; i < SEGMENTS; i++) {
      const tone = i % 6 === 0 ? 0 : i % 2 === 1 ? 1 : 2;
      toneIndices[tone].push(i);
    }

    const segmentMaterials = TONES.map(
      (t) =>
        new THREE.MeshStandardMaterial({
          color: t.color,
          emissive: t.emissive,
          emissiveIntensity: 0.62,
          metalness: 0.65,
          roughness: 0.32,
          transparent: true,
          opacity: 0,
        })
    );

    const innerRingGeo = new THREE.TorusGeometry(MARKER_RADIUS, 0.006, 8, 128);
    const outerRingGeo = new THREE.TorusGeometry(1.14, 0.004, 8, 160);
    const glowGeo = new THREE.TorusGeometry(RING_MID, 0.15, 12, 96);
    const tickGeo = new THREE.BoxGeometry(0.012, 0.045, 0.012);
    const beadGeo = new THREE.SphereGeometry(0.032, 12, 12);
    const hitGeo = new THREE.RingGeometry(0.55, 1.2, 64);

    const innerRingMat = new THREE.MeshBasicMaterial({ color: "#ffb347", transparent: true, opacity: 0 });
    const outerRingMat = new THREE.MeshBasicMaterial({ color: "#ff8c1a", transparent: true, opacity: 0 });
    const glowMat = new THREE.MeshBasicMaterial({
      color: "#ff7a1a",
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tickMat = new THREE.MeshBasicMaterial({ color: "#ffd27a", transparent: true, opacity: 0 });
    const beadMat = new THREE.MeshBasicMaterial({ color: "#ffe29a", transparent: true, opacity: 0 });
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

    // Particle comets: heads move around the ring, trailing points fade behind.
    const rand = mulberry32(0x0b17a1);
    const heads = Array.from({ length: HEADS }, (_, h) => ({
      angle: rand() * Math.PI * 2,
      speed: 0.35 + rand() * 0.55,
      radius: 0.78 + rand() * 0.34,
      z: (rand() - 0.5) * 0.26,
      wob: rand() * Math.PI * 2,
      dir: h % 5 === 0 ? -1 : 1,
    }));

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const head = new THREE.Color("#ffd27a");
    const tail = new THREE.Color("#ff5e0a");
    const c = new THREE.Color();
    for (let h = 0; h < HEADS; h++) {
      for (let k = 0; k < TRAIL; k++) {
        const f = Math.pow(1 - k / TRAIL, 1.6);
        c.copy(tail).lerp(head, 1 - k / TRAIL).multiplyScalar(f);
        const o = (h * TRAIL + k) * 3;
        colors[o] = c.r;
        colors[o + 1] = c.g;
        colors[o + 2] = c.b;
      }
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const glowTexture = createGlowTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return {
      segmentGeometry,
      toneIndices,
      segmentMaterials,
      innerRingGeo,
      outerRingGeo,
      glowGeo,
      tickGeo,
      beadGeo,
      hitGeo,
      innerRingMat,
      outerRingMat,
      glowMat,
      tickMat,
      beadMat,
      hitMat,
      heads,
      particleGeo,
      particleMat,
      glowTexture,
      positions,
    };
  }, []);

  // Dispose GPU resources on unmount; reset cursor if we were hovered.
  useEffect(() => {
    return () => {
      Object.values(assets).forEach((v) => {
        if (v && typeof v.dispose === "function") v.dispose();
      });
      assets.segmentMaterials.forEach((m) => m.dispose());
      if (state.current.localHover && typeof document !== "undefined") {
        document.body.style.cursor = "auto";
      }
    };
  }, [assets]);

  // Static tick marks on the inner ring.
  useLayoutEffect(() => {
    const mesh = tickRef.current;
    if (!mesh) return;
    for (let i = 0; i < TICKS; i++) {
      const a = (i / TICKS) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * (MARKER_RADIUS - 0.05), Math.sin(a) * (MARKER_RADIUS - 0.05), 0);
      dummy.rotation.set(0, 0, a - Math.PI / 2);
      const long = i % 3 === 0 ? 1.7 : 1;
      dummy.scale.set(1, long, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  /* ---------- per‑frame animation ---------- */

  useFrame((fr, rawDelta) => {
    const s = state.current;
    const dt = Math.min(rawDelta, 0.05);
    const t = reducedMotion ? 0 : fr.clock.elapsedTime;
    const damp = (cur, target, lambda) =>
      reducedMotion ? target : THREE.MathUtils.damp(cur, target, lambda, dt);

    const hovered = isHovered || s.localHover;
    s.prog = damp(s.prog, clamp01(progress), 4);
    s.hov = damp(s.hov, hovered ? 1 : 0, 8);
    s.sel = damp(s.sel, isSelected ? 1 : 0, 6);

    const ease = smooth(s.prog);
    const { hov, sel } = s;

    const root = rootRef.current;
    if (!root) return;
    root.visible = s.prog > 0.002;
    if (!root.visible) return;

    const sc = (0.55 + 0.45 * ease) * (1 + 0.05 * hov + 0.04 * sel);
    root.scale.setScalar(sc);

    // Rotation and organic tilt
    if (!reducedMotion) {
      s.angle += dt * (0.16 + 0.24 * hov + 0.1 * sel);
    }
    if (spinRef.current) spinRef.current.rotation.z = s.angle;
    if (markerRef.current) markerRef.current.rotation.z = -s.angle * 1.7;
    if (tiltRef.current) {
      tiltRef.current.rotation.x = 0.05 + (reducedMotion ? 0 : Math.sin(t * 0.45) * 0.04);
      tiltRef.current.rotation.y = reducedMotion ? 0 : Math.sin(t * 0.33) * 0.06;
      tiltRef.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.6) * 0.02;
    }

    // Segments: staggered assembly + gentle travelling pulse
    const emphasis = 0.85 + 0.5 * hov + 0.7 * sel + (reducedMotion ? 0 : 0.08 * Math.sin(t * 1.6));
    const fade = clamp01(ease * 1.5);
    for (let m = 0; m < TONES.length; m++) {
      const mesh = toneMeshRefs.current[m];
      if (!mesh) continue;
      const idx = assets.toneIndices[m];
      for (let j = 0; j < idx.length; j++) {
        const i = idx[j];
        const le = smooth(ease * 1.7 - (i / SEGMENTS) * 0.7);
        const pulse = reducedMotion ? 0 : 0.16 * Math.sin(t * 1.3 - i * 0.45) + 0.18 * sel;
        const xy = 1 + (1 - le) * 0.35;
        dummy.position.set(0, 0, 0);
        dummy.rotation.set(0, 0, i * SEGMENT_STEP);
        dummy.scale.set(xy, xy, Math.max(0.001, le * (1 + pulse)));
        dummy.updateMatrix();
        mesh.setMatrixAt(j, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      const mat = assets.segmentMaterials[m];
      mat.opacity = fade;
      mat.emissiveIntensity = emphasis;
    }

    // Secondary elements
    assets.innerRingMat.opacity = (0.35 + 0.3 * hov + 0.3 * sel) * ease;
    assets.outerRingMat.opacity = (0.16 + 0.2 * hov + 0.25 * sel) * ease;
    assets.tickMat.opacity = (0.5 + 0.3 * hov) * ease;
    assets.beadMat.opacity = ease;
    assets.glowMat.opacity = (0.02 + 0.04 * hov + 0.06 * sel) * ease;
    assets.particleMat.opacity = ease * (0.75 + 0.25 * hov);
    assets.particleMat.size = 0.042 + 0.015 * hov + 0.01 * sel;

    // Particle comets (skip updates in reduced motion after the first static layout)
    if (!reducedMotion || !s.seeded) {
      const pos = assets.positions;
      const speedBoost = 1 + 0.9 * hov + 0.4 * sel;
      for (let h = 0; h < HEADS; h++) {
        const hd = assets.heads[h];
        const base = reducedMotion ? hd.angle : hd.angle + hd.dir * t * hd.speed * speedBoost * 0.6;
        const r = hd.radius + (reducedMotion ? 0 : Math.sin(t * 0.8 + hd.wob) * 0.025);
        const z = hd.z + (reducedMotion ? 0 : Math.sin(t * 0.9 + hd.wob) * 0.03);
        for (let k = 0; k < TRAIL; k++) {
          const a = base - hd.dir * k * 0.065;
          const o = (h * TRAIL + k) * 3;
          pos[o] = Math.cos(a) * r;
          pos[o + 1] = Math.sin(a) * r;
          pos[o + 2] = z;
        }
      }
      assets.particleGeo.attributes.position.needsUpdate = true;
      s.seeded = true;
    }
  });

  /* ---------- pointer handling ---------- */

  const interactive = () => state.current.prog > 0.6;

  const handleOver = (e) => {
    if (!interactive()) return;
    e.stopPropagation();
    state.current.localHover = true;
    document.body.style.cursor = "pointer";
  };
  const handleOut = (e) => {
    e.stopPropagation();
    state.current.localHover = false;
    document.body.style.cursor = "auto";
  };
  const handleClick = (e) => {
    if (!interactive()) return;
    e.stopPropagation();
    if (typeof onSelect === "function") onSelect();
  };

  /* ---------- render ---------- */

  return (
    <group ref={rootRef} visible={false}>
      <group ref={tiltRef}>
        <mesh
          geometry={assets.hitGeo}
          material={assets.hitMat}
          onPointerOver={handleOver}
          onPointerOut={handleOut}
          onClick={handleClick}
        />
        <group ref={spinRef}>
          {TONES.map((tone, m) => (
            <instancedMesh
              key={tone.name}
              ref={(el) => (toneMeshRefs.current[m] = el)}
              args={[assets.segmentGeometry, assets.segmentMaterials[m], assets.toneIndices[m].length]}
              frustumCulled={false}
              raycast={() => null}
            />
          ))}
        </group>
        <mesh geometry={assets.glowGeo} material={assets.glowMat} raycast={() => null} />
        <mesh geometry={assets.outerRingGeo} material={assets.outerRingMat} raycast={() => null} />
        <mesh geometry={assets.innerRingGeo} material={assets.innerRingMat} raycast={() => null} />
        <group ref={markerRef}>
          <instancedMesh
            ref={tickRef}
            args={[assets.tickGeo, assets.tickMat, TICKS]}
            frustumCulled={false}
            raycast={() => null}
          />
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2 + 0.6;
            return (
              <mesh
                key={i}
                geometry={assets.beadGeo}
                material={assets.beadMat}
                position={[Math.cos(a) * MARKER_RADIUS, Math.sin(a) * MARKER_RADIUS, 0]}
                raycast={() => null}
              />
            );
          })}
        </group>
        <points
          ref={pointsRef}
          geometry={assets.particleGeo}
          material={assets.particleMat}
          frustumCulled={false}
          raycast={() => null}
        />
      </group>
    </group>
  );
}

export default HackathonObject;
