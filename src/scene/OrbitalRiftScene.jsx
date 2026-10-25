/**
 * OrbitalRiftScene.jsx
 *
 * One shared React Three Fiber <Canvas> containing:
 *   - a central avatar IMAGE (transparent PNG/WebP) with a restrained halo,
 *   - four orbital navigation objects (supplied by sibling files),
 *   - stars, lights and a scroll-driven camera.
 *
 * Progress (0..1) is a PROP. This file never attaches a scroll listener.
 * See README for the full contract. Browser-only APIs are used inside effects,
 * so the module is SSR-import-safe (in Next.js render it client-side only).
 */
import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import { HackathonObject } from "./HackathonObject";
import { ProjectObject } from "./ProjectObject";
import { ExperienceObject } from "./ExperienceObject";
import { ResearchObject } from "./ResearchObject";
import { RealmPlatform } from "./RealmPlatform";

import {
  AVATAR_BASE_Y,
  AVATAR_MAX_H,
  AVATAR_MAX_W,
  CAMERA_FOV,
  INTERACTIVE_FROM,
  OBJECT_IDS,
  OBJECT_LAYOUT,
  OBJECT_RADIUS,
  clamp01,
  easeInOutSine,
  getBaseScale,
  getCameraFit,
  getIntro,
  getObjectProgress,
  getObjectStages,
  getRadialFactor,
  getRestPosition,
  getScaleFactor,
  lerp,
  smoothstep,
} from "./orbitalRiftLayout";

const OBJECT_COMPONENTS = {
  hackathons: HackathonObject,
  projects: ProjectObject,
  experience: ExperienceObject,
  research: ResearchObject,
};

const DEFAULT_BG = "#161618";

/* ======================================================================== */
/* Small hooks                                                               */
/* ======================================================================== */

function usePrefersReducedMotion(override) {
  const [pref, setPref] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPref(mq.matches);
    const onChange = (e) => setPref(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return typeof override === "boolean" ? override : pref;
}

function useWebGLSupport() {
  const [ok, setOk] = useState(null); // null = still checking
  useEffect(() => {
    let supported = false;
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      supported = !!gl;
      if (gl && gl.getExtension) {
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      }
    } catch (e) {
      supported = false;
    }
    setOk(supported);
  }, []);
  return ok;
}

/** Pauses rendering while the scene is scrolled off-screen. */
function useInView(ref) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/* ======================================================================== */
/* Textures                                                                  */
/* ======================================================================== */

function setSRGB(tex) {
  if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
  else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
}

function makeHaloTexture() {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(s / 2, s / 2, 8, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(90,190,255,0.55)");
  grad.addColorStop(0.45, "rgba(60,110,255,0.2)");
  grad.addColorStop(1, "rgba(20,30,90,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  setSRGB(tex);
  return tex;
}

/** Clean placeholder: dark disc with either initials or a neutral silhouette. */
function makeFallbackTexture(label) {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d");
  const fill = g.createRadialGradient(256, 220, 40, 256, 256, 250);
  fill.addColorStop(0, "#16284d");
  fill.addColorStop(1, "#0a1226");
  g.beginPath();
  g.arc(256, 256, 240, 0, Math.PI * 2);
  g.fillStyle = fill;
  g.fill();
  g.lineWidth = 6;
  g.strokeStyle = "rgba(120,190,255,0.7)";
  g.stroke();

  g.save();
  g.beginPath();
  g.arc(256, 256, 234, 0, Math.PI * 2);
  g.clip();
  if (label) {
    g.fillStyle = "rgba(200,225,255,0.92)";
    g.font = "600 200px system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(String(label).slice(0, 2), 256, 276);
  } else {
    g.fillStyle = "rgba(120,160,220,0.55)";
    g.beginPath();
    g.arc(256, 210, 76, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(256, 440, 150, 120, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();

  const tex = new THREE.CanvasTexture(c);
  setSRGB(tex);
  return tex;
}

function useAvatarTexture(src, gl) {
  const [state, setState] = useState({
    status: src ? "loading" : "fallback",
    texture: null,
    aspect: 1,
  });

  useEffect(() => {
    if (!src) {
      setState({ status: "fallback", texture: null, aspect: 1 });
      return undefined;
    }
    let cancelled = false;
    let loaded = null;
    setState({ status: "loading", texture: null, aspect: 1 });

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      src,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        setSRGB(tex);
        tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        tex.needsUpdate = true;
        loaded = tex;
        const img = tex.image || {};
        const w = img.naturalWidth || img.width || 1;
        const h = img.naturalHeight || img.height || 1;
        setState({ status: "ready", texture: tex, aspect: w / h });
      },
      undefined,
      () => {
        if (!cancelled) setState({ status: "error", texture: null, aspect: 1 });
      }
    );
    return () => {
      cancelled = true;
      if (loaded) loaded.dispose();
    };
  }, [src, gl]);

  return state;
}

/* ======================================================================== */
/* Scene parts (all rendered inside the single Canvas)                       */
/* ======================================================================== */

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Stars({ count, smoothRef, reducedMotion }) {
  const ref = useRef(null);
  const { positions, colors } = useMemo(() => {
    const rnd = mulberry32(1337);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.85, 0.92, 1.0],
      [0.6, 0.78, 1.0],
      [0.75, 0.7, 1.0],
      [1.0, 0.93, 0.8],
    ];
    for (let i = 0; i < count; i++) {
      const r = 32 + rnd() * 38;
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = palette[Math.floor(rnd() * palette.length)];
      const b = 0.35 + rnd() * 0.65;
      col[i * 3] = c[0] * b;
      col[i * 3 + 1] = c[1] * b;
      col[i * 3 + 2] = c[2] * b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    if (!reducedMotion) g.rotation.y += dt * 0.005;
    g.rotation.x = -0.04 + smoothRef.current * 0.08; // scroll-linked parallax
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.65}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </points>
  );
}

function Avatar({ src, fallbackText, smoothRef, reducedMotion }) {
  const gl = useThree((s) => s.gl);
  const { status, texture, aspect } = useAvatarTexture(src, gl);

  const fallbackTex = useMemo(
    () =>
      status === "fallback" || status === "error"
        ? makeFallbackTexture(fallbackText)
        : null,
    [status, fallbackText]
  );
  useEffect(() => () => fallbackTex && fallbackTex.dispose(), [fallbackTex]);

  const haloTex = useMemo(() => makeHaloTexture(), []);
  useEffect(() => () => haloTex.dispose(), [haloTex]);

  const activeTex = status === "ready" ? texture : fallbackTex;

  // Preserve aspect ratio inside the AVATAR_MAX_W x AVATAR_MAX_H box.
  const [w, h] = useMemo(() => {
    const k = Math.min(AVATAR_MAX_W / aspect, AVATAR_MAX_H);
    return [aspect * k, k];
  }, [aspect]);
  const ringR = Math.hypot(w, h) * 0.46;
  const haloSize = ringR * 3.2;

  const groupRef = useRef(null);
  const imgMat = useRef(null);
  const haloMat = useRef(null);
  const ringMat = useRef(null);
  const arcMat = useRef(null);
  const arcRef = useRef(null);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const intro = getIntro(smoothRef.current);

    g.position.y = AVATAR_BASE_Y + Math.sin(t * 0.8) * 0.07;
    g.rotation.z = Math.sin(t * 0.5) * 0.012;
    g.scale.setScalar(lerp(0.9, 1, intro));

    if (imgMat.current) imgMat.current.opacity = intro;
    if (haloMat.current) haloMat.current.opacity = intro * 0.85;
    if (ringMat.current) ringMat.current.opacity = intro * 0.28;

  });

  return (
    <group ref={groupRef} position={[0, AVATAR_BASE_Y, -0.05]}>
      {/* Soft restrained atmospheric blue halo behind the portrait */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[haloSize, haloSize]} />
        <meshBasicMaterial
          ref={haloMat}
          map={haloTex}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* The clean, unobstructed portrait image */}
      {activeTex && (
        <mesh key={status}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            ref={imgMat}
            map={activeTex}
            transparent
            alphaTest={0.02}
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

function CameraRig({ smoothRef, fit, reducedMotion, posRef, approachId }) {
  const amt = useRef(0);
  const lastId = useRef(null);
  const idRef = useRef(approachId);
  idRef.current = approachId;

  useFrame((state, dt) => {
    const p = smoothRef.current;
    const k = easeInOutSine(clamp01((p - 0.06) / 0.94));
    const d = lerp(fit.startDistance, fit.finalDistance, k);
    const tx = lerp(0, fit.target[0], k);
    const ty = lerp(AVATAR_BASE_Y, fit.target[1], k);
    let cx = tx;
    let cy = ty;
    let cz = d;
    let lx = tx;
    let ly = ty;
    let lz = 0;

    // Restrained approach toward the object being opened (damped, no React state).
    if (idRef.current) lastId.current = idRef.current;
    const O = lastId.current ? posRef.current[lastId.current] : null;
    const want = idRef.current && !reducedMotion && O ? 1 : 0;
    amt.current += (want - amt.current) * (1 - Math.exp(-Math.min(dt, 0.1) * 3.5));
    if (want === 0 && amt.current < 0.001) amt.current = 0;
    const a = amt.current;
    if (O && a > 0) {
      lx = tx + (O.x - tx) * 0.55 * a;
      ly = ty + (O.y - ty) * 0.55 * a;
      lz = O.z * 0.55 * a;
      cx += (O.x - cx) * 0.28 * a;
      cy += (O.y - cy) * 0.28 * a;
      cz += (O.z - cz) * 0.28 * a;
    }
    state.camera.position.set(cx, cy, cz);
    state.camera.lookAt(lx, ly, lz);
  });
  return null;
}

/** One point light that follows the emphasised object: brightness without touching its materials. */
function EmphasisLight({ posRef, emphasisId }) {
  const ref = useRef(null);
  const last = useRef(null);
  const idRef = useRef(emphasisId);
  idRef.current = emphasisId;
  useFrame((_, dt) => {
    const l = ref.current;
    if (!l) return;
    if (idRef.current) last.current = idRef.current;
    const O = last.current ? posRef.current[last.current] : null;
    const want = idRef.current && O ? 6 : 0;
    l.intensity += (want - l.intensity) * (1 - Math.exp(-Math.min(dt, 0.1) * 8));
    if (O) {
      l.position.set(O.x, O.y + 0.6, O.z + 1.8);
      l.color.set(OBJECT_LAYOUT[last.current].color);
    }
  });
  return <pointLight ref={ref} intensity={0} distance={7} decay={2} />;
}

function OrbitObject({
  id,
  aspect,
  smoothRef,
  renderP,
  interactive,
  isHovered,
  isSelected,
  reducedMotion,
  objectScale,
  emphasisId,
  posRef,
  onHover,
  onPick,
}) {
  const L = OBJECT_LAYOUT[id];
  const Obj = OBJECT_COMPONENTS[id];
  const rest = useMemo(() => getRestPosition(id, aspect), [id, aspect]);
  const baseScale = getBaseScale(id, aspect) * objectScale;

  const [localHover, setLocalHover] = useState(false);
  const activeHover = localHover || isHovered;

  const outer = useRef(null);
  const spin = useRef(null);
  const boost = useRef(0);
  const recede = useRef(0); // 1 when another object is emphasised
  const slow = useRef(0); // 1 when this object is emphasised
  const clock = useRef(0); // own clock so emphasis can slow it
  const emphRef = useRef(emphasisId);
  emphRef.current = emphasisId;
  const live = useRef({ interactive, isHovered: activeHover, isSelected });
  live.current = { interactive, isHovered: activeHover, isSelected };

  useFrame((state, dt) => {
    const g = outer.current;
    if (!g) return;
    const p = smoothRef.current;
    const { emerge, settle } = getObjectStages(id, p);
    const radial = getRadialFactor(emerge, settle);
    const sf = getScaleFactor(emerge, settle);

    const e = emphRef.current;
    const kk = 1 - Math.exp(-Math.min(dt, 0.1) * 6);
    recede.current += ((e && e !== id ? 1 : 0) - recede.current) * kk;
    slow.current += ((e === id ? 1 : 0) - slow.current) * kk;
    const speed = 1 - 0.8 * slow.current;
    if (!reducedMotion) clock.current += dt * speed;
    const t = clock.current;

    // gentle orbital sway = small rotation about the avatar's vertical axis
    const sway = L.sway.amp * Math.sin(t * L.sway.speed + L.sway.phase) * emerge;
    const cs = Math.cos(sway);
    const sn = Math.sin(sway);
    const x0 = rest[0] * radial;
    const zHover = isHovered ? 0.38 : isSelected ? 0.65 : 0;
    const yHover = isHovered ? 0.08 : isSelected ? 0.16 : 0;
    const z0 = rest[2] * radial - (1 - emerge) * 2.4 - 0.3 * recede.current + zHover;
    const x = x0 * cs + z0 * sn;
    const z = -x0 * sn + z0 * cs;
    const y =
      rest[1] * radial +
      Math.sin(t * L.float.speed + L.float.phase) * L.float.amp * emerge + yHover;
    g.position.set(x, y, z);

    const pos = posRef.current[id] || (posRef.current[id] = { x: 0, y: 0, z: 0 });
    pos.x = x;
    pos.y = y;
    pos.z = z;

    const l = live.current;
    // Balanced 12% scale boost on hover
    const want = l.interactive ? (l.isHovered ? 0.12 : 0) + (l.isSelected ? 0.18 : 0) : 0;
    boost.current += (want - boost.current) * (1 - Math.exp(-dt * 8));
    // Modest dimming so other models stay recognizable
    const dimFactor = 1 - 0.22 * recede.current;
    g.scale.setScalar(
      Math.max(1e-4, baseScale * sf * (1 + boost.current) * dimFactor)
    );
    g.visible = sf > 0.003;

    if (spin.current && !reducedMotion && id !== "hackathons" && L.spin) {
      spin.current.rotation.y += dt * L.spin * speed;
    }
  });

  const handleObjectSelect = useCallback(() => {
    if (live.current.interactive) {
      onHover(id);
      onPick(id, "canvas");
    }
  }, [id, onHover, onPick]);

  return (
    <group ref={outer}>
      {/* Individual Subtle Light Pool & Holographic Ellipse - zero chunky geometry */}
      <RealmPlatform
        color={L.color}
        tiltAngle={L.anchor[1] > 0 ? 0.22 : -0.12}
        isHovered={activeHover}
        isSelected={isSelected}
        isDimmed={recede.current > 0.08}
        reducedMotion={reducedMotion}
        onHover={() => {
          setLocalHover(true);
          onHover(id);
        }}
        onHoverOut={() => {
          setLocalHover(false);
          onHover(null, id);
        }}
        onSelect={handleObjectSelect}
      />

      <group rotation={L.tilt}>
        <group ref={spin}>
          <Obj
            progress={getObjectProgress(id, renderP)}
            isHovered={activeHover}
            isSelected={isSelected}
            onSelect={handleObjectSelect}
            onHover={() => {
              setLocalHover(true);
              onHover(id);
            }}
            onHoverOut={() => {
              setLocalHover(false);
              onHover(null, id);
            }}
            reducedMotion={reducedMotion}
          />
        </group>
      </group>

      {/* Primary generous hit mesh: fully interactive, wraps floating model */}
      <mesh
        position={[0, -0.4, 0]}
        onPointerOver={(e) => {
          if (!live.current.interactive) return;
          e.stopPropagation();
          setLocalHover(true);
          onHover(id);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setLocalHover(false);
          onHover(null, id);
        }}
        onClick={(e) => {
          if (!live.current.interactive) return;
          e.stopPropagation();
          onHover(id);
          onPick(id, "canvas", e.nativeEvent && e.nativeEvent.pointerType);
        }}
      >
        <cylinderGeometry args={[1.5, 1.5, 2.8, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      {/* Destination label tag: fully readable in idle state; reveals description & explore on hover/focus */}
      <Html center position={[0, -1.2, 0]} style={{ pointerEvents: "auto" }}>
        <div
          role="region"
          aria-label={`${L.label} realm`}
          onMouseEnter={() => {
            if (!live.current.interactive) return;
            setLocalHover(true);
            onHover(id);
          }}
          onMouseLeave={() => {
            setLocalHover(false);
            onHover(null, id);
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: activeHover || isSelected ? "10px 18px 12px 18px" : "6px 14px",
            borderRadius: activeHover || isSelected ? "14px" : "999px",
            background: activeHover || isSelected 
              ? "rgba(6, 12, 26, 0.88)" 
              : "rgba(4, 9, 20, 0.72)",
            border: activeHover || isSelected 
              ? `1px solid ${L.color}77` 
              : "1px solid rgba(255, 255, 255, 0.14)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: activeHover || isSelected
              ? `0 10px 30px rgba(0, 0, 0, 0.75), 0 0 20px ${L.color}25`
              : "0 4px 18px rgba(0, 0, 0, 0.6)",
            transform: `translateY(${activeHover || isSelected ? -2 : 0}px) scale(${activeHover || isSelected ? 1.04 : 1})`,
            opacity: recede.current > 0.08 && !activeHover ? 0.6 : 0.98,
            transition: "all 0.24s cubic-bezier(0.16, 1, 0.3, 1)",
            userSelect: "none",
            minWidth: activeHover || isSelected ? "190px" : "120px",
            cursor: "pointer",
          }}
          onClick={handleObjectSelect}
        >
          {/* Top row: index dot/number + primary label */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: L.color,
                boxShadow: `0 0 8px ${L.color}`,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-display), monospace, sans-serif",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.22em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              {L.label}
            </span>
          </div>

          {/* Underline accent indicator */}
          <div
            style={{
              width: activeHover || isSelected ? "42px" : "18px",
              height: "2px",
              background: L.color,
              marginTop: "4px",
              borderRadius: "1px",
              opacity: activeHover || isSelected ? 0.95 : 0.5,
              transition: "all 0.24s ease",
            }}
          />

          {/* Expanded details revealed on hover or keyboard focus */}
          {activeHover || isSelected ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: L.color,
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {L.caption}
              </span>
              <p
                style={{
                  margin: "5px 0 8px 0",
                  fontSize: "11px",
                  lineHeight: 1.35,
                  color: "rgba(225, 235, 250, 0.85)",
                  maxWidth: "185px",
                  fontWeight: 400,
                }}
              >
                {L.description}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleObjectSelect();
                }}
                onFocus={() => {
                  setLocalHover(true);
                  onHover(id);
                }}
                onBlur={() => {
                  setLocalHover(false);
                  onHover(null, id);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 14px",
                  borderRadius: "999px",
                  background: `${L.color}22`,
                  border: `1px solid ${L.color}88`,
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transition: "all 0.18s ease",
                }}
              >
                <span>EXPLORE</span>
                <span style={{ color: L.color, fontSize: "12px" }}>→</span>
              </button>
            </div>
          ) : null}
        </div>
      </Html>
    </group>
  );
}

function SceneContent({
  progress,
  avatarSrc,
  avatarFallbackText,
  hoveredId,
  selectedId,
  emphasisId,
  approachId,
  onHover,
  onPick,
  reducedMotion,
  interactiveFrom,
  objectScale,
  background,
}) {
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const aspect = size.height > 0 ? size.width / size.height : 1.6;
  const fit = useMemo(() => getCameraFit(aspect), [aspect]);
  const posRef = useRef({}); // live object positions (written per frame, read by camera/light)

  // Damped progress. Transforms/camera read the ref (no re-render);
  // `renderP` is a quantised copy for the object components' `progress` prop.
  const targetRef = useRef(progress);
  targetRef.current = progress;
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const smoothRef = useRef(progress);
  const lastRendered = useRef(progress);
  const [renderP, setRenderP] = useState(progress);

  useFrame((_, dt) => {
    const target = targetRef.current;
    let s = smoothRef.current;
    if (reducedRef.current) {
      s = target;
    } else {
      s += (target - s) * (1 - Math.exp(-Math.min(dt, 0.1) * 7));
      if (Math.abs(target - s) < 0.0004) s = target;
    }
    smoothRef.current = s;
    if (
      Math.abs(s - lastRendered.current) >= 0.004 ||
      (s === target && lastRendered.current !== target)
    ) {
      lastRendered.current = s;
      setRenderP(s);
    }
  });

  const interactive = renderP >= interactiveFrom;
  const emph = interactive ? emphasisId || null : null;
  const appr = interactive ? approachId || null : null;

  useEffect(() => {
    gl.domElement.style.cursor = interactive && hoveredId ? "pointer" : "auto";
    return () => {
      gl.domElement.style.cursor = "auto";
    };
  }, [gl, interactive, hoveredId]);

  const starCount = size.width < 640 ? 120 : 250;

  return (
    <>
      {background ? <color attach="background" args={[background]} /> : null}

      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[4, 8, 5]} intensity={0.95} color="#ffffff" />
      <directionalLight position={[-5, 3, -4]} intensity={0.65} color="#cbd5e1" />
      <pointLight position={[0, -1.2, 0.8]} intensity={1.2} color="#00e5ff" distance={6} decay={2} />

      <CameraRig
        smoothRef={smoothRef}
        fit={fit}
        reducedMotion={reducedMotion}
        posRef={posRef}
        approachId={appr}
      />
      <EmphasisLight posRef={posRef} emphasisId={emph} />

      {OBJECT_IDS.map((id) => (
        <OrbitObject
          key={id}
          id={id}
          aspect={aspect}
          smoothRef={smoothRef}
          renderP={renderP}
          interactive={interactive}
          isHovered={interactive && (hoveredId === id || emph === id)}
          isSelected={selectedId === id}
          reducedMotion={reducedMotion}
          objectScale={objectScale}
          emphasisId={emph}
          posRef={posRef}
          onHover={onHover}
          onPick={onPick}
        />
      ))}
    </>
  );
}

/* ======================================================================== */
/* DOM-side pieces (outside the Canvas)                                      */
/* ======================================================================== */

class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error, info) {
    if (this.props.onError) this.props.onError(error, info);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function StaticFallback({ avatarSrc }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="orf-fb">
      <div className="orf-fb-halo">
        {avatarSrc && imgOk ? (
          <img src={avatarSrc} alt="" onError={() => setImgOk(false)} />
        ) : null}
      </div>
      <p className="orf-fb-msg" role="status">
        The 3D view isn’t available on this device. Use the section links below.
      </p>
    </div>
  );
}

const STYLES = `
.orf-root{isolation:isolate;color:#dbe7ff;font-family:inherit}
.orf-stage,.orf-canvas{position:absolute;inset:0}
.orf-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.orf-nav{position:absolute;left:0;right:0;bottom:max(14px,env(safe-area-inset-bottom));display:flex;flex-wrap:wrap;justify-content:center;gap:8px;padding:0 12px;transition:opacity .25s ease}
.orf-nav:focus-within{opacity:1!important;pointer-events:auto!important}
.orf-btn{display:flex;align-items:center;gap:10px;min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(150,185,255,.28);background:rgba(8,14,30,.72);color:inherit;font:inherit;text-align:left;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.orf-btn:hover,.orf-btn[data-hot="true"]{border-color:var(--orf-c);background:rgba(14,24,50,.88)}
.orf-btn[aria-current="true"]{border-color:var(--orf-c);box-shadow:inset 0 0 0 1px var(--orf-c)}
.orf-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}
.orf-dot{flex:none;width:10px;height:10px;border-radius:50%;background:var(--orf-c)}
.orf-label{display:block;font-weight:600;font-size:.95rem;line-height:1.2}
.orf-cap{display:block;font-size:.75rem;line-height:1.2;opacity:.72}
.orf-fb{position:absolute;inset:0;display:grid;place-items:center}
.orf-fb-halo{width:min(60vmin,340px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,rgba(90,190,255,.35),rgba(30,50,120,0) 70%)}
.orf-fb-halo img{max-width:80%;max-height:80%;object-fit:contain}
.orf-fb-msg{position:absolute;top:16px;left:0;right:0;margin:0;padding:0 16px;text-align:center;font-size:.85rem;opacity:.8}
@media (max-width:640px){.orf-nav{display:grid;grid-template-columns:1fr 1fr}.orf-btn{padding:8px 10px}}
@media (prefers-reduced-motion:reduce){.orf-nav{transition:none}}
`;

/* ======================================================================== */
/* Public component                                                          */
/* ======================================================================== */

/**
 * @param {object}   props
 * @param {number}   [props.progress=0]          External scroll progress, 0..1 (clamped).
 * @param {string}   [props.avatarSrc]           URL of a transparent PNG/WebP. Missing/failed => clean fallback.
 * @param {(id: "hackathons"|"projects"|"experience"|"research", meta: {source: "canvas"|"html", pointerType?: string}) => void} [props.onSelect]
 * @param {string|null} [props.selectedId]       Controlled selection. Omit for uncontrolled.
 * @param {string|null} [props.emphasisId]       Object to emphasise (others recede, its orbit slows, a light follows it).
 * @param {string|null} [props.approachId]       Object the camera should ease toward (portal transition).
 * @param {boolean}  [props.reducedMotion]       Override; if omitted, prefers-reduced-motion is detected.
 * @param {(id: string|null) => void} [props.onHoverChange]
 * @param {number}   [props.interactiveFrom=0.65] Progress at which canvas objects become interactive.
 * @param {number}   [props.objectScale=1]       Multiplier applied to every object's scale.
 * @param {string|null} [props.background="#050914"] Canvas background; pass null for transparent.
 * @param {string}   [props.avatarFallbackText]  Initials drawn in the fallback avatar (e.g. "S").
 * @param {boolean}  [props.showControls=true]   Render the accessible HTML buttons.
 * @param {object}   [props.labels]              Override visible labels, e.g. { projects: "Work" }.
 * @param {boolean}  [props.paused=false]        Force-pause rendering.
 * @param {(error: Error) => void} [props.onError]
 * @param {string}   [props.ariaLabel]
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
export function OrbitalRiftScene({
  progress = 0,
  avatarSrc,
  onSelect,
  selectedId,
  emphasisId,
  approachId,
  reducedMotion,
  onHoverChange,
  interactiveFrom = INTERACTIVE_FROM,
  objectScale = 1,
  background = DEFAULT_BG,
  avatarFallbackText = "",
  showControls = true,
  labels,
  paused = false,
  onError,
  ariaLabel = "Portfolio sections",
  className,
  style,
}) {
  const p = clamp01(Number.isFinite(progress) ? progress : 0);

  const rootRef = useRef(null);
  const inView = useInView(rootRef);
  const reduced = usePrefersReducedMotion(reducedMotion);
  const webgl = useWebGLSupport();

  const [hoveredId, setHoveredId] = useState(null);
  const [internalSelected, setInternalSelected] = useState(null);
  const selected = selectedId !== undefined ? selectedId : internalSelected;

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onHoverRef = useRef(onHoverChange);
  onHoverRef.current = onHoverChange;
  const controlled = selectedId !== undefined;

  const hoverRef = useRef(null);
  const handleHover = useCallback((id, onlyIfId) => {
    // onPointerOut passes (null, id): only clear if that object is still hovered
    if (id === null && onlyIfId && hoverRef.current !== onlyIfId) return;
    if (hoverRef.current === id) return;
    hoverRef.current = id;
    setHoveredId(id);
    if (onHoverRef.current) onHoverRef.current(id);
  }, []);

  const lastPick = useRef({ id: null, t: 0 });
  const handlePick = useCallback(
    (id, source, pointerType) => {
      if (!OBJECT_IDS.includes(id)) return;
      if (source === "canvas") {
        // hit-area click and the object's own onSelect may both fire: de-dupe
        const now = typeof performance !== "undefined" ? performance.now() : Date.now();
        if (lastPick.current.id === id && now - lastPick.current.t < 200) return;
        lastPick.current = { id, t: now };
      }
      if (!controlled) setInternalSelected(id);
      if (onSelectRef.current) onSelectRef.current(id, { source, pointerType });
    },
    [controlled]
  );

  const useFallback = webgl === false;
  const navOpacity = useFallback ? 1 : smoothstep(0.3, 0.65, p);
  const labelOf = (id) => (labels && labels[id]) || OBJECT_LAYOUT[id].label;

  return (
    <section
      ref={rootRef}
      aria-label={ariaLabel}
      className={`orf-root${className ? ` ${className}` : ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 320,
        overflow: "hidden",
        background: background || "transparent",
        touchAction: "pan-y",
        ...style,
      }}
    >
      <style>{STYLES}</style>

      <div className="orf-stage">
        {useFallback ? (
          <StaticFallback avatarSrc={avatarSrc} />
        ) : webgl ? (
          <SceneBoundary
            fallback={<StaticFallback avatarSrc={avatarSrc} />}
            onError={onError}
          >
            <div className="orf-canvas" aria-hidden="true">
              <Canvas
                frameloop={paused || !inView ? "never" : "always"}
                dpr={[1, 1.25]}
                camera={{ fov: CAMERA_FOV, near: 0.1, far: 140, position: [0, 0.3, 8] }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                style={{ touchAction: "pan-y" }}
                onCreated={({ gl }) => {
                  gl.domElement.style.touchAction = "pan-y"; // never block page scroll
                  gl.domElement.addEventListener("webglcontextlost", (e) =>
                    e.preventDefault()
                  );
                }}
              >
                <SceneContent
                  progress={p}
                  avatarSrc={avatarSrc}
                  avatarFallbackText={avatarFallbackText}
                  hoveredId={hoveredId}
                  selectedId={selected}
                  emphasisId={emphasisId}
                  approachId={approachId}
                  onHover={handleHover}
                  onPick={handlePick}
                  reducedMotion={reduced}
                  interactiveFrom={interactiveFrom}
                  objectScale={objectScale}
                  background={background}
                />
              </Canvas>
            </div>
          </SceneBoundary>
        ) : null}
      </div>

      {showControls && (
        <nav
          className="orf-nav"
          aria-label={ariaLabel}
          style={{
            opacity: navOpacity,
            pointerEvents: navOpacity > 0.05 ? "auto" : "none",
          }}
        >
          {OBJECT_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className="orf-btn"
              style={{ "--orf-c": OBJECT_LAYOUT[id].color }}
              data-hot={hoveredId === id ? "true" : undefined}
              aria-current={selected === id ? "true" : undefined}
              onClick={() => handlePick(id, "html")}
              onMouseEnter={() => handleHover(id)}
              onMouseLeave={() => handleHover(null, id)}
              onFocus={() => handleHover(id)}
              onBlur={() => handleHover(null, id)}
            >
              <span className="orf-dot" aria-hidden="true" />
              <span>
                <span className="orf-label">{labelOf(id)}</span>
                <span className="orf-cap">{OBJECT_LAYOUT[id].caption}</span>
              </span>
            </button>
          ))}
        </nav>
      )}

      <p className="orf-sr" aria-live="polite">
        {selected && OBJECT_LAYOUT[selected] ? `${labelOf(selected)} selected` : ""}
      </p>
    </section>
  );
}

export default OrbitalRiftScene;
