import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { SECTIONS } from "./sections";
import { CardMesh } from "./CardMesh";
import { SceneEnvironment } from "./SceneEnvironment";
import { HeroTitle } from "./HeroTitle";

const N = SECTIONS.length;
const RADIUS = 4.2;

// ─── Inner 3D cylinder group ──────────────────────────────────────────────────
function CylinderGroup({ onSelect, onFocusChange, scrollElRef, focused }) {
  const groupRef   = useRef();
  const targetRot  = useRef(0);
  const currentRot = useRef(0);
  const lastClosest = useRef(0);
  const { camera } = useThree();

  const STEP = (Math.PI * 2) / N;
  const cardAngles = SECTIONS.map((_, i) => i * STEP);

  // Lerp each frame
  useFrame(() => {
    if (!groupRef.current) return;
    currentRot.current = THREE.MathUtils.lerp(currentRot.current, targetRot.current, 0.075);
    groupRef.current.rotation.y = currentRot.current;

    // Which card is closest to "front" (angle ≈ 0 after rotation applied)
    let closest = 0, minDiff = Infinity;
    SECTIONS.forEach((_, i) => {
      const worldAngle = (cardAngles[i] + currentRot.current % (Math.PI * 2) + Math.PI * 4) % (Math.PI * 2);
      const fromFront = worldAngle > Math.PI ? Math.PI * 2 - worldAngle : worldAngle;
      if (fromFront < minDiff) { minDiff = fromFront; closest = i; }
    });
    if (lastClosest.current !== closest) {
      lastClosest.current = closest;
      onFocusChange(closest);
    }
  });

  // Drive rotation from scroll element
  useEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;
    const onScroll = () => {
      const progress = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
      // Synchronize exact angle from card 0 to card N-1
      targetRot.current = -progress * ((N - 1) * STEP);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollElRef, STEP]);

  // Snap to card by index
  const snapTo = useCallback((idx) => {
    const angle = -cardAngles[idx];
    let diff = angle - targetRot.current;
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    targetRot.current += diff;
  }, [cardAngles]);

  const handleCardClick = useCallback((section, idx) => {
    snapTo(idx);
    // Brief camera punch-in → then open detail
    gsap.to(camera.position, {
      z: 5.6, duration: 0.5, ease: "power2.inOut",
      onComplete: () => {
        gsap.to(camera.position, { z: 7.8, duration: 0.45, ease: "power2.out" });
        onSelect(section);
      },
    });
  }, [camera, snapTo, onSelect]);

  return (
    <group ref={groupRef}>
      {SECTIONS.map((section, i) => {
        const angle = cardAngles[i];
        const x = Math.sin(angle) * RADIUS;
        const z = Math.cos(angle) * RADIUS;
        return (
          <CardMesh
            key={section.id}
            section={section}
            position={[x, 0, z]}
            rotationY={angle}
            isFocused={i === focused}
            index={i}
            total={N}
            onClick={() => handleCardClick(section, i)}
          />
        );
      })}
    </group>
  );
}

// ─── Dot indicator ────────────────────────────────────────────────────────────
function ScrollDots({ scrollRef, active }) {
  const goTo = (i) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    gsap.to(el, { scrollTop: (i / (N - 1)) * max, duration: 0.8, ease: "power3.inOut" });
  };

  return (
    <div style={{
      position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
      display: "flex", gap: 10, zIndex: 20, pointerEvents: "auto",
    }}>
      {SECTIONS.map((s, i) => (
        <button key={s.id} onClick={() => goTo(i)} title={s.label} style={{
          width: i === active ? 28 : 8, height: 8,
          borderRadius: 4, border: "none",
          background: i === active ? "#fff" : "rgba(255,255,255,0.28)",
          transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
          cursor: "pointer", padding: 0,
        }} />
      ))}
    </div>
  );
}

// ─── Arrow nav ────────────────────────────────────────────────────────────────
function NavArrows({ scrollRef }) {
  const step = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const max  = el.scrollHeight - el.clientHeight;
    const step = max / (N - 1);
    gsap.to(el, { scrollTop: Math.max(0, Math.min(max, el.scrollTop + dir * step)), duration: 0.75, ease: "power3.inOut" });
  };
  const btn = (side) => ({
    position: "absolute", [side]: 28, bottom: 24,
    zIndex: 20, width: 48, height: 48,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 8, color: "#fff", fontSize: 18, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(12px)",
  });
  return (
    <>
      <button style={btn("left")}  onClick={() => step(-1)}>←</button>
      <button style={btn("right")} onClick={() => step( 1)}>→</button>
    </>
  );
}

// ─── Main exported CylinderScene ──────────────────────────────────────────────
export function CylinderScene({ onSelect, onBack }) {
  const scrollRef   = useRef();
  const [focused, setFocused] = useState(0);
  const [active, setActive]   = useState(0);

  // Sync dots with scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const p = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
      setActive(Math.round(p * (N - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const SCROLL_TOTAL = N * 600; // total scrollable px

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", paddingTop: 64, background: "#050810", overflow: "hidden" }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            position: "absolute",
            top: 24,
            left: 28,
            padding: "10px 22px",
            background: "rgba(10, 16, 28, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            color: "rgba(255, 255, 255, 0.85)",
            borderRadius: 30,
            cursor: "pointer",
            fontFamily: "var(--font-display), sans-serif",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            backdropFilter: "blur(12px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#38bdf8";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(56,189,248,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>←</span> BACK TO THE NEXUS
        </button>
      )}

      {/* ── Invisible scroll driver ─────────────────────────────────────── */}
      <div
        id="cylinder-scroll-driver"
        ref={scrollRef}
        style={{
          position: "absolute",
          inset: 0,
          top: 64,
          overflowY: "scroll",
          zIndex: 15,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div style={{ height: SCROLL_TOTAL + "px", pointerEvents: "none" }} />
      </div>

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, top: 64, zIndex: 1 }}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <PerspectiveCamera makeDefault position={[0, 0.2, 7.8]} fov={55} near={0.1} far={100} />
          <SceneEnvironment />
          <CylinderGroup
            onSelect={onSelect}
            onFocusChange={setFocused}
            scrollElRef={scrollRef}
            focused={focused}
          />
        </Canvas>
      </div>

      {/* ── Hero title (sits between bg and cards) ───────────────────────── */}
      <div style={{ position: "absolute", inset: 0, top: 64, zIndex: 8, pointerEvents: "none" }}>
        <HeroTitle focusedSection={SECTIONS[focused]} />
      </div>

      {/* ── UI chrome ───────────────────────────────────────────────────── */}
      <ScrollDots scrollRef={scrollRef} active={active} />
      <NavArrows  scrollRef={scrollRef} />

      {/* ── Section label strip ─────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: 64 + 18,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        pointerEvents: "none",
        display: "flex",
        gap: 6,
        alignItems: "center",
      }}>
        {SECTIONS.map((s, i) => (
          <span key={s.id} style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: i === focused ? s.accentColor : "rgba(255,255,255,0.2)",
            transition: "color 0.4s",
          }}>
            {i === focused ? `[ ${s.label} ]` : s.label}
            {i < SECTIONS.length - 1 && <span style={{ marginLeft: 6, color: "rgba(255,255,255,0.12)" }}>·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
