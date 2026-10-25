/**
 * ResearchObject — "Knowledge Gate"
 *
 * A crystalline icosahedron lattice: an outer wireframe shell, a smaller inner
 * shell joined to it by twelve spokes, a glowing core, vertex markers, and a
 * handful of light pulses travelling along selected edges.
 *
 * Props:
 *   progress       0..1   emergence (0 = hidden, 1 = fully formed)
 *   isHovered      bool   brightens + slight scale-up
 *   isSelected     bool   brighter, faster pulses, slightly larger
 *   onSelect       fn?    called with the R3F click event
 *   reducedMotion  bool?  no drift, no pulse travel, no scale-in (fades only)
 *
 * Geometry is centered at (0,0,0) with an outer radius of 1 local unit.
 * The parent owns world position / scale / orbit.
 */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const OUTER_R = 1;
const INNER_R = 0.52;
const HIT_R = 1.15;

const COLOR_VIOLET = new THREE.Color("#8b5cf6");
const COLOR_PURPLE = new THREE.Color("#a855f7");
const COLOR_BLUE = new THREE.Color("#60a5fa");
const COLOR_CYAN = new THREE.Color("#22d3ee");
const COLOR_LILAC = new THREE.Color("#c4b5fd");
const COLOR_CORE = new THREE.Color("#a5f3fc");

const PULSE_COUNT = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);

function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** violet -> blue -> cyan gradient, t in 0..1 */
function gradient(t, out) {
  const c = clamp01(t);
  if (c < 0.5) return out.copy(COLOR_VIOLET).lerp(COLOR_BLUE, c * 2);
  return out.copy(COLOR_BLUE).lerp(COLOR_CYAN, (c - 0.5) * 2);
}

/** Build a LineSegments geometry (positions + vertex colours) from point pairs. */
function buildLineGeometry(segments, radius, tLo, tHi) {
  const positions = new Float32Array(segments.length * 6);
  const colors = new Float32Array(segments.length * 6);
  const p = new THREE.Vector3();
  const c = new THREE.Color();
  segments.forEach(([a, b], i) => {
    [a, b].forEach((v, k) => {
      p.copy(v).multiplyScalar(radius);
      const o = i * 6 + k * 3;
      positions[o] = p.x;
      positions[o + 1] = p.y;
      positions[o + 2] = p.z;
      const t = clamp01(0.5 + 0.5 * (0.75 * v.y + 0.25 * v.x));
      gradient(tLo + (tHi - tLo) * t, c);
      colors[o] = c.r;
      colors[o + 1] = c.g;
      colors[o + 2] = c.b;
    });
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

/** All procedural data, built once. */
function buildStructure() {
  const ico = new THREE.IcosahedronGeometry(1, 0);

  // Unique vertices (12)
  const pos = ico.attributes.position;
  const seen = new Set();
  const verts = [];
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i).normalize();
    const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      verts.push(v);
    }
  }

  // Unique edges (30)
  const edgesGeo = new THREE.EdgesGeometry(ico);
  const ep = edgesGeo.attributes.position;
  const edges = [];
  for (let i = 0; i < ep.count; i += 2) {
    edges.push([
      new THREE.Vector3().fromBufferAttribute(ep, i).normalize(),
      new THREE.Vector3().fromBufferAttribute(ep, i + 1).normalize(),
    ]);
  }
  edgesGeo.dispose();
  ico.dispose();

  const outerGeo = buildLineGeometry(edges, OUTER_R, 0.0, 1.0);
  const innerGeo = buildLineGeometry(edges, INNER_R, 0.05, 0.55);

  // Spokes: outer vertex -> inner vertex
  const spokeGeo = (() => {
    const positions = new Float32Array(verts.length * 6);
    const colors = new Float32Array(verts.length * 6);
    const c = new THREE.Color();
    verts.forEach((v, i) => {
      const o = i * 6;
      positions.set([v.x * OUTER_R, v.y * OUTER_R, v.z * OUTER_R], o);
      positions.set([v.x * INNER_R, v.y * INNER_R, v.z * INNER_R], o + 3);
      gradient(clamp01(0.5 + 0.5 * v.y), c);
      colors.set([c.r, c.g, c.b], o);
      colors.set([COLOR_PURPLE.r, COLOR_PURPLE.g, COLOR_PURPLE.b], o + 3);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  })();

  // Vertex markers: 12 outer + 12 inner
  const markers = [
    ...verts.map((v) => ({
      pos: v.clone().multiplyScalar(OUTER_R),
      base: 0.04,
      t: clamp01(0.5 + 0.5 * v.y),
    })),
    ...verts.map((v) => ({
      pos: v.clone().multiplyScalar(INNER_R),
      base: 0.024,
      t: 0.15 + 0.3 * clamp01(0.5 + 0.5 * v.y),
    })),
  ];

  // Pulse paths: six outer edges, four inward spokes
  const pulses = [];
  [1, 6, 11, 16, 21, 26].forEach((ei, k) => {
    const [a, b] = edges[ei % edges.length];
    pulses.push({
      a: a.clone().multiplyScalar(OUTER_R),
      b: b.clone().multiplyScalar(OUTER_R),
      speed: 0.14 + 0.035 * (k % 3),
      phase: k / 6,
      size: 0.03,
      color: k % 2 === 0 ? COLOR_CYAN : COLOR_LILAC,
    });
  });
  [0, 3, 6, 9].forEach((vi, k) => {
    const v = verts[vi % verts.length];
    pulses.push({
      a: v.clone().multiplyScalar(OUTER_R),
      b: v.clone().multiplyScalar(INNER_R),
      speed: 0.2,
      phase: (k * 0.27 + 0.1) % 1,
      size: 0.024,
      color: k % 2 === 0 ? COLOR_CORE : COLOR_PURPLE,
    });
  });

  return { outerGeo, innerGeo, spokeGeo, markers, pulses };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ResearchObject({
  progress = 1,
  isHovered = false,
  isSelected = false,
  onSelect,
  onHover,
  onHoverOut,
  reducedMotion = false,
}) {
  const structure = useMemo(buildStructure, []);
  const { outerGeo, innerGeo, spokeGeo, markers, pulses } = structure;

  // Imperative refs
  const rootRef = useRef();
  const spinRef = useRef();
  const outerMat = useRef();
  const innerMat = useRef();
  const spokeMat = useRef();
  const faceMat = useRef();
  const coreRef = useRef();
  const coreMat = useRef();
  const haloRef = useRef();
  const haloMat = useRef();
  const markerMesh = useRef();
  const markerMat = useRef();
  const pulseMesh = useRef();
  const pulseMat = useRef();

  const S = useRef({ p: 0, h: 0, s: 0, t: 0, cursor: false });
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  // Set static colours once
  useEffect(() => {
    const c = new THREE.Color();
    const mm = markerMesh.current;
    if (mm) {
      markers.forEach((m, i) => {
        gradient(m.t, c);
        mm.setColorAt(i, c);
      });
      if (mm.instanceColor) mm.instanceColor.needsUpdate = true;
    }
    const pm = pulseMesh.current;
    if (pm) {
      pulses.forEach((p, i) => pm.setColorAt(i, p.color));
      if (pm.instanceColor) pm.instanceColor.needsUpdate = true;
    }
  }, [markers, pulses]);

  // Cleanup
  useEffect(() => {
    const state = S.current;
    return () => {
      outerGeo.dispose();
      innerGeo.dispose();
      spokeGeo.dispose();
      if (state.cursor && typeof document !== "undefined") {
        document.body.style.cursor = "";
        state.cursor = false;
      }
    };
  }, [outerGeo, innerGeo, spokeGeo]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const st = S.current;
    st.p = THREE.MathUtils.damp(st.p, clamp01(progress), 8, dt);
    st.h = THREE.MathUtils.damp(st.h, isHovered ? 1 : 0, 7, dt);
    st.s = THREE.MathUtils.damp(st.s, isSelected ? 1 : 0, 5, dt);

    const root = rootRef.current;
    if (!root) return;
    const p = st.p;
    const visible = p > 0.002;
    root.visible = visible;
    if (!visible) return;

    if (!reducedMotion) st.t += dt * (1 + 0.6 * st.s);
    const t = st.t;
    const h = st.h;
    const s = st.s;

    // Staged emergence
    const outerP = smoothstep(0.0, 0.7, p);
    const innerP = smoothstep(0.25, 0.9, p);
    const detailP = smoothstep(0.6, 1.0, p);
    const emerge = smoothstep(0, 1, p);

    // Scale and drift
    const emergeScale = reducedMotion ? 1 : 0.3 + 0.7 * emerge;
    root.scale.setScalar(emergeScale * (1 + 0.05 * h + 0.06 * s));

    const spin = spinRef.current;
    if (spin) {
      spin.rotation.set(
        0.35 + Math.sin(t * 0.3) * 0.12,
        0.4 + t * 0.22,
        Math.sin(t * 0.21) * 0.06
      );
    }

    const b = 0.85 + 0.35 * h + 0.5 * s;
    if (outerMat.current) outerMat.current.opacity = Math.min(1, 0.9 * outerP * b);
    if (innerMat.current) innerMat.current.opacity = Math.min(1, 0.55 * innerP * b);
    if (spokeMat.current) spokeMat.current.opacity = Math.min(1, 0.35 * innerP * b);
    if (faceMat.current) faceMat.current.opacity = 0.07 * outerP * b;
    if (markerMat.current) markerMat.current.opacity = Math.min(1, detailP * (0.8 + 0.2 * b));
    if (pulseMat.current) pulseMat.current.opacity = Math.min(1, detailP);

    // Core & halo
    const breathe = reducedMotion ? 1 : 1 + 0.15 * Math.sin(t * 1.8);
    if (coreRef.current) {
      coreRef.current.scale.setScalar(0.11 * innerP * breathe * (1 + 0.15 * h + 0.25 * s));
    }
    if (coreMat.current) coreMat.current.opacity = Math.min(1, innerP * (0.8 + 0.2 * b));
    if (haloRef.current) {
      haloRef.current.scale.setScalar(0.24 * innerP * breathe * (1 + 0.2 * s));
    }
    if (haloMat.current) haloMat.current.opacity = 0.12 * innerP * b;

    // Markers
    const mm = markerMesh.current;
    if (mm) {
      for (let i = 0; i < markers.length; i++) {
        const m = markers[i];
        const tw = reducedMotion ? 1 : 1 + 0.25 * Math.sin(t * 1.6 + i * 1.7);
        dummy.position.copy(m.pos);
        dummy.scale.setScalar(m.base * tw * detailP * (1 + 0.2 * h + 0.3 * s));
        dummy.updateMatrix();
        mm.setMatrixAt(i, dummy.matrix);
      }
      mm.instanceMatrix.needsUpdate = true;
    }

    // Pulses
    const pm = pulseMesh.current;
    if (pm) {
      for (let i = 0; i < PULSE_COUNT && i < pulses.length; i++) {
        const pu = pulses[i];
        const u = reducedMotion
          ? pu.phase
          : (t * pu.speed * (1 + 0.5 * s) + pu.phase) % 1;
        tmp.lerpVectors(pu.a, pu.b, u);
        const fade = Math.pow(Math.sin(Math.PI * u), 0.7);
        dummy.position.copy(tmp);
        dummy.scale.setScalar(pu.size * fade * detailP * (0.9 + 0.5 * h + 0.8 * s));
        dummy.updateMatrix();
        pm.setMatrixAt(i, dummy.matrix);
      }
      pm.instanceMatrix.needsUpdate = true;
    }
  });

  // Interaction handlers
  const handleOver = () => {
    if (typeof document !== "undefined") {
      document.body.style.cursor = "pointer";
      S.current.cursor = true;
    }
    if (typeof onHover === "function") onHover();
  };
  const handleOut = () => {
    if (S.current.cursor && typeof document !== "undefined") {
      document.body.style.cursor = "";
      S.current.cursor = false;
    }
    if (typeof onHoverOut === "function") onHoverOut();
  };
  const handleClick = (e) => {
    if (onSelect) onSelect(e);
  };

  return (
    <group ref={rootRef} visible={false}>
      <group ref={spinRef}>
        {/* Outer shell */}
        <lineSegments geometry={outerGeo} frustumCulled={false}>
          <lineBasicMaterial
            ref={outerMat}
            vertexColors
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </lineSegments>

        {/* Inner shell */}
        <lineSegments geometry={innerGeo} frustumCulled={false}>
          <lineBasicMaterial
            ref={innerMat}
            vertexColors
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </lineSegments>

        {/* Spokes */}
        <lineSegments geometry={spokeGeo} frustumCulled={false}>
          <lineBasicMaterial
            ref={spokeMat}
            vertexColors
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </lineSegments>

        {/* Crystal faces */}
        <mesh frustumCulled={false}>
          <icosahedronGeometry args={[OUTER_R * 0.995, 0]} />
          <meshBasicMaterial
            ref={faceMat}
            color="#7c3aed"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        {/* Core + halo */}
        <mesh ref={coreRef} scale={0}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={coreMat}
            color={COLOR_CORE}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={haloRef} scale={0}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            ref={haloMat}
            color={COLOR_PURPLE}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        {/* Vertex markers */}
        <instancedMesh
          ref={markerMesh}
          args={[undefined, undefined, markers.length]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            ref={markerMat}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </instancedMesh>

        {/* Edge pulses */}
        <instancedMesh
          ref={pulseMesh}
          args={[undefined, undefined, PULSE_COUNT]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            ref={pulseMat}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMasked={false}
          />
        </instancedMesh>
      </group>

      {/* Invisible hit volume */}
      <mesh onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <sphereGeometry args={[HIT_R, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default ResearchObject;
