import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const POINTS = 29;          // spheres per strand (odd so ROD_STEP=2 hits both ends)
const ROD_STEP = 2;         // a rod every 2nd point pair
const ROD_COUNT = Math.floor((POINTS - 1) / ROD_STEP) + 1; // 15
const TURNS = 2.5;
const HEIGHT = 2.05;
const RADIUS = 0.38;

const TUBE_SEGMENTS = 180;
const TUBE_RADIAL = 8;
const TUBE_RADIUS = 0.024;
const TUBE_INDICES_PER_SEGMENT = TUBE_RADIAL * 6;

const SPHERE_RADIUS = 0.075;
const ROD_RADIUS = 0.011;

const COLOR_CYAN = "#19e3ff";
const COLOR_BLUE = "#2f6bff";
const COLOR_ICE = "#d4f1ff";

const UP = new THREE.Vector3(0, 1, 0);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Point on strand (0 or 1) at normalized height t in [0,1]. Strand 1 is offset by PI. */
function helixPoint(strand, t, out) {
  const envelope = 0.72 + 0.28 * Math.sin(Math.PI * t); // gentle taper at both ends
  const angle = t * TURNS * Math.PI * 2 + strand * Math.PI;
  return out.set(
    Math.cos(angle) * RADIUS * envelope,
    (t - 0.5) * HEIGHT,
    Math.sin(angle) * RADIUS * envelope
  );
}

function buildTube(strand) {
  const pts = [];
  const samples = 120;
  for (let k = 0; k <= samples; k++) {
    pts.push(helixPoint(strand, k / samples, new THREE.Vector3()));
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
  return new THREE.TubeGeometry(curve, TUBE_SEGMENTS, TUBE_RADIUS, TUBE_RADIAL, false);
}

/** Geometry, materials and per-point positions. Built once. */
function buildAssets() {
  const posA = [];
  const posB = [];
  for (let i = 0; i < POINTS; i++) {
    const t = i / (POINTS - 1);
    posA.push(helixPoint(0, t, new THREE.Vector3()));
    posB.push(helixPoint(1, t, new THREE.Vector3()));
  }

  const geometries = {
    tubeA: buildTube(0),
    tubeB: buildTube(1),
    sphere: new THREE.SphereGeometry(SPHERE_RADIUS, 16, 12),
    halo: new THREE.SphereGeometry(SPHERE_RADIUS, 10, 8),
    rod: new THREE.CylinderGeometry(ROD_RADIUS, ROD_RADIUS, 1, 6, 1, false),
    ring: new THREE.TorusGeometry(RADIUS * 1.75, 0.006, 6, 72),
  };

  const std = (color, emissive, extra = {}) =>
    new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: 1,
      metalness: 0.2,
      roughness: 0.28,
      transparent: true,
      ...extra,
    });

  const materials = {
    tubeA: std("#0b5f73", COLOR_CYAN),
    tubeB: std("#10286e", COLOR_BLUE),
    sphereA: std("#aef7ff", COLOR_CYAN),
    sphereB: std("#9db8ff", COLOR_BLUE),
    rod: std(COLOR_ICE, "#7fb8ff"),
    halo: new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
    ring: new THREE.MeshBasicMaterial({
      color: COLOR_CYAN,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    }),
  };

  return { posA, posB, geometries, materials };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export function ProjectObject({
  progress = 1,
  isHovered = false,
  isSelected = false,
  onSelect,
  reducedMotion = false,
}) {
  const assets = useMemo(buildAssets, []);

  const rootRef = useRef();
  const spinRef = useRef();
  const ringRef = useRef();
  const sphereARef = useRef();
  const sphereBRef = useRef();
  const haloRef = useRef();
  const rodRef = useRef();
  const tubeARef = useRef();
  const tubeBRef = useRef();

  // Latest props, read inside useFrame / handlers (no re-render needed).
  const propsRef = useRef({});
  propsRef.current = { progress, isHovered, isSelected, onSelect, reducedMotion };

  // Mutable animation state (never triggers React renders).
  const anim = useRef({
    p: 0,
    emph: 0,
    sel: 0,
    internalHover: false,
    lastSegs: -1,
    cursorSet: false,
  });

  /* ---- Static instance matrices ---------------------------------- */
  useLayoutEffect(() => {
    const { posA, posB } = assets;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const mid = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const color = new THREE.Color();

    for (let i = 0; i < POINTS; i++) {
      const t = i / (POINTS - 1);
      const k = 0.85 + 0.3 * Math.sin(Math.PI * t); // bigger in the middle

      m.compose(posA[i], q.identity(), s.setScalar(k));
      sphereARef.current.setMatrixAt(i, m);
      m.compose(posB[i], q.identity(), s.setScalar(k));
      sphereBRef.current.setMatrixAt(i, m);

      // Halos interleaved A,B so a single count reveals both strands evenly.
      m.compose(posA[i], q.identity(), s.setScalar(k * 1.35));
      haloRef.current.setMatrixAt(i * 2, m);
      haloRef.current.setColorAt(i * 2, color.set(COLOR_CYAN));
      m.compose(posB[i], q.identity(), s.setScalar(k * 1.35));
      haloRef.current.setMatrixAt(i * 2 + 1, m);
      haloRef.current.setColorAt(i * 2 + 1, color.set(COLOR_BLUE));
    }

    // Rods connect posA[i] <-> posB[i] for the same i (matching sphere pairs).
    for (let j = 0; j < ROD_COUNT; j++) {
      const i = j * ROD_STEP;
      const a = posA[i];
      const b = posB[i];
      dir.subVectors(b, a);
      const len = dir.length();
      mid.addVectors(a, b).multiplyScalar(0.5);
      q.setFromUnitVectors(UP, dir.normalize());
      m.compose(mid, q, s.set(1, len, 1));
      rodRef.current.setMatrixAt(j, m);
    }

    for (const ref of [sphereARef, sphereBRef, haloRef, rodRef]) {
      ref.current.instanceMatrix.needsUpdate = true;
    }
    haloRef.current.instanceColor.needsUpdate = true;
  }, [assets]);

  /* ---- Cleanup ---------------------------------------------------- */
  useEffect(() => {
    return () => {
      Object.values(assets.geometries).forEach((g) => g.dispose());
      Object.values(assets.materials).forEach((mat) => mat.dispose());
      if (anim.current.cursorSet) document.body.style.cursor = "auto";
    };
  }, [assets]);

  /* ---- Per-frame animation (refs only, no setState) --------------- */
  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const d = Math.min(delta, 0.05);
    const a = anim.current;
    const { progress: pr, isHovered: hov, isSelected: sel, reducedMotion: rm } =
      propsRef.current;

    const target = clamp01(Number.isFinite(pr) ? pr : 0);
    a.p = THREE.MathUtils.damp(a.p, target, rm ? 14 : 6, d);
    if (Math.abs(a.p - target) < 0.0005) a.p = target;

    const visible = a.p > 0.002;
    root.visible = visible;
    if (!visible) return;

    const hovered = hov || a.internalHover;
    a.emph = THREE.MathUtils.damp(a.emph, sel ? 1 : hovered ? 0.6 : 0, 7, d);
    a.sel = THREE.MathUtils.damp(a.sel, sel ? 1 : 0, 7, d);

    // Emergence: scale + opacity + bottom-to-top build-up.
    const ease = easeOutCubic(a.p);
    const opacity = smoothstep(0, 0.4, a.p);
    const reveal = easeOutCubic(clamp01((a.p - 0.08) / 0.8));

    root.scale.setScalar((0.25 + 0.75 * ease) * (1 + 0.1 * a.emph));
    root.position.y = rm ? 0 : Math.sin(state.clock.elapsedTime * 0.9) * 0.05;

    if (!rm) {
      spinRef.current.rotation.y += d * 0.22 * (1 + 1.2 * a.emph);
    }

    // Reveal counts (only touched when the quantized value changes).
    const segs = Math.floor(reveal * TUBE_SEGMENTS);
    if (segs !== a.lastSegs) {
      a.lastSegs = segs;
      const n = Math.ceil(reveal * POINTS);
      sphereARef.current.count = n;
      sphereBRef.current.count = n;
      haloRef.current.count = n * 2;
      rodRef.current.count = Math.ceil(reveal * ROD_COUNT);
      const drawCount = segs * TUBE_INDICES_PER_SEGMENT;
      tubeARef.current.geometry.setDrawRange(0, drawCount);
      tubeBRef.current.geometry.setDrawRange(0, drawCount);
    }

    // Material emphasis.
    const { materials: mt } = assets;
    const e = a.emph;
    mt.tubeA.opacity = mt.tubeB.opacity = 0.88 * opacity;
    mt.sphereA.opacity = mt.sphereB.opacity = opacity;
    mt.rod.opacity = 0.75 * opacity;
    mt.tubeA.emissiveIntensity = mt.tubeB.emissiveIntensity = 0.45 + 0.35 * e;
    mt.sphereA.emissiveIntensity = mt.sphereB.emissiveIntensity = 0.95 + 0.5 * e;
    mt.rod.emissiveIntensity = 0.5 + 0.5 * e;
    mt.halo.opacity = (0.05 + 0.07 * e) * opacity;

    // Selection ring.
    const ring = ringRef.current;
    ring.visible = a.sel > 0.01;
    mt.ring.opacity = 0.55 * a.sel * opacity;
  });

  /* ---- Pointer handling ------------------------------------------ */
  const interactive = () => propsRef.current.progress > 0.6;

  const handleOver = (e) => {
    if (!interactive()) return;
    e.stopPropagation();
    anim.current.internalHover = true;
    document.body.style.cursor = "pointer";
    anim.current.cursorSet = true;
  };

  const handleOut = (e) => {
    e.stopPropagation();
    anim.current.internalHover = false;
    if (anim.current.cursorSet) {
      document.body.style.cursor = "auto";
      anim.current.cursorSet = false;
    }
  };

  const handleClick = (e) => {
    if (!interactive()) return;
    e.stopPropagation();
    propsRef.current.onSelect?.("projects", e);
  };

  const { geometries: g, materials: m } = assets;

  return (
    <group ref={rootRef} name="ProjectObject" visible={false}>
      <group rotation={[0.18, 0, 0.1]}>
        <group ref={spinRef}>
          <mesh ref={tubeARef} geometry={g.tubeA} material={m.tubeA} frustumCulled={false} />
          <mesh ref={tubeBRef} geometry={g.tubeB} material={m.tubeB} frustumCulled={false} />
          <instancedMesh ref={sphereARef} args={[g.sphere, m.sphereA, POINTS]} frustumCulled={false} />
          <instancedMesh ref={sphereBRef} args={[g.sphere, m.sphereB, POINTS]} frustumCulled={false} />
          <instancedMesh ref={rodRef} args={[g.rod, m.rod, ROD_COUNT]} frustumCulled={false} />
          <instancedMesh ref={haloRef} args={[g.halo, m.halo, POINTS * 2]} frustumCulled={false} />
        </group>

        {/* Selection ring (visible only when selected) */}
        <mesh
          ref={ringRef}
          geometry={g.ring}
          material={m.ring}
          position={[0, -HEIGHT / 2 - 0.15, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          visible={false}
        />

        {/* Invisible hit volume: stable hover/click target */}
        <mesh onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
          <cylinderGeometry args={[0.8, 0.8, 2.8, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

export default ProjectObject;
