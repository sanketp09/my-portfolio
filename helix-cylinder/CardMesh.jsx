import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ─── Per-card 3D mesh + HTML overlay ─────────────────────────────────────────
export function CardMesh({ section, position, rotationY, isFocused, onClick, index, total }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const currentScale = useRef(1);

  // Angle from front — determines how "side-on" this card is
  const angleFromFront = useRef(0);

  useFrame(() => {
    if (!groupRef.current || !meshRef.current) return;

    // Compute world rotation of this card relative to cylinder's current rotation
    const worldQuat = new THREE.Quaternion();
    groupRef.current.parent?.getWorldQuaternion(worldQuat);
    const euler = new THREE.Euler().setFromQuaternion(worldQuat, "YXZ");
    const cylRot = euler.y;

    // This card's absolute angle in world space
    const absAngle = (rotationY + cylRot + Math.PI * 4) % (Math.PI * 2);
    const fromFront = absAngle > Math.PI ? Math.PI * 2 - absAngle : absAngle;
    angleFromFront.current = fromFront;

    // Scale — front card big, sides shrink
    const scaleFactor = isFocused ? 1.18 : Math.max(0.72, 1 - fromFront * 0.28);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, scaleFactor, 0.08);
    groupRef.current.scale.setScalar(currentScale.current);

    // Opacity / brightness via mesh material
    const opacityTarget = isFocused ? 1 : Math.max(0.35, 1 - fromFront * 0.55);
    if (meshRef.current.material) {
      meshRef.current.material.opacity = THREE.MathUtils.lerp(
        meshRef.current.material.opacity ?? 1,
        opacityTarget,
        0.07
      );
    }
  });

  const [hovered, setHovered] = useState(false);

  // Card width/height in 3-units
  const W = 2.0;
  const H = 2.8;

  // Background gradient string from section data
  const grad = `linear-gradient(160deg, ${section.gradient[0]} 0%, ${section.gradient[1]} 100%)`;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotationY, 0]}
    >
      {/* ── 3D backing plane — subtle depth glow ── */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <planeGeometry args={[W, H, 1, 1]} />
        <meshBasicMaterial
          color={new THREE.Color(section.gradient[1])}
          transparent
          opacity={0.15}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* ── HTML card overlay ── */}
      <Html
        transform
        center
        distanceFactor={3.2}
        occlude={false}
        style={{ pointerEvents: "auto" }}
        position={[0, 0, 0.05]}
      >
        <div
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: 280,
            height: 390,
            background: grad,
            borderRadius: 18,
            border: `1px solid ${isFocused ? section.accentColor + "aa" : "rgba(255,255,255,0.12)"}`,
            boxShadow: isFocused
              ? `0 0 50px ${section.accentColor}44, 0 25px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)`
              : "0 15px 35px rgba(0,0,0,0.5)",
            backdropFilter: "blur(14px)",
            overflow: "hidden",
            position: "relative",
            cursor: "pointer",
            transition: "border-color 0.3s, box-shadow 0.3s",
            userSelect: "none",
          }}
        >
          <CardContent section={section} isFocused={isFocused} hovered={hovered} />
        </div>
      </Html>
    </group>
  );
}

// ─── Card interior content ────────────────────────────────────────────────────
function CardContent({ section, isFocused, hovered }) {
  return (
    <>
      {/* Noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Top accent glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${section.accentColor}, transparent)`,
        opacity: isFocused ? 1 : 0.4,
        transition: "opacity 0.4s",
        zIndex: 2,
      }} />

      {/* Index number — background watermark */}
      <div style={{
        position: "absolute",
        top: -20, right: -10,
        fontSize: 160,
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900,
        color: "rgba(255,255,255,0.04)",
        lineHeight: 1,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}>
        {section.index}
      </div>

      {/* Content */}
      <div style={{ padding: "32px 28px", height: "100%", display: "flex", flexDirection: "column", position: "relative", zIndex: 3 }}>

        {/* Top row: index + year */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.3em",
            color: section.accentColor,
            opacity: 0.9,
          }}>
            {section.index}
          </span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.4)",
          }}>
            {section.year}
          </span>
        </div>

        {/* Icon */}
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `${section.accentColor}18`,
          border: `1px solid ${section.accentColor}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          color: section.accentColor,
          transition: "background 0.3s",
        }}>
          <div
            style={{ width: 28, height: 28 }}
            dangerouslySetInnerHTML={{ __html: section.icon }}
          />
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 26,
          lineHeight: 1.1,
          color: "#fff",
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}>
          {section.label}
        </h2>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 12,
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "auto",
        }}>
          {section.subtitle}
        </p>

        {/* Preview items */}
        <div style={{ marginTop: 24 }}>
          {section.items.slice(0, 2).map((item, i) => (
            <div key={i} style={{
              padding: "10px 0",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: "rgba(255,255,255,0.65)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {item.name}
              </span>
              <span style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: section.accentColor,
                opacity: 0.7,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>
                {item.tech}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: section.accentColor,
            letterSpacing: "0.08em",
          }}>
            View all
          </span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M10 5l5 4-5 4" stroke={section.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </>
  );
}
