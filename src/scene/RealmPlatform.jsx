import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Creates a soft radial diffuse light pool texture.
 */
function createRadialGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.85)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.35)");
  gradient.addColorStop(0.65, "rgba(255, 255, 255, 0.08)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Subtle Grounding Light Pool & Holographic Ellipse.
 * 
 * Replaces heavy metallic disks and trapezoidal projector beams with an
 * ultra-minimal, soft grounding effect:
 *  - At rest: Barely noticeable, gentle accent-colored light pool.
 *  - On hover: Softly brightens to emphasize the floating model.
 */
export function RealmPlatform({
  color = "#38bdf8",
  tiltAngle = 0,
  isHovered = false,
  isSelected = false,
  isDimmed = false,
  reducedMotion = false,
  onHover,
  onHoverOut,
  onSelect,
}) {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const glowTexture = useMemo(() => createRadialGlowTexture(), []);

  const active = isHovered || isSelected;

  useFrame((state, dt) => {
    if (!rootRef.current) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;

    // Gentle micro-float that keeps the grounding softly tethered
    rootRef.current.position.y = -1.05 + Math.sin(t * 0.7) * 0.008;
    rootRef.current.rotation.x = tiltAngle;

    if (ringRef.current && !reducedMotion) {
      ringRef.current.rotation.z = t * 0.08;
    }
  });

  const poolOpacity = isDimmed ? 0.03 : active ? 0.28 : 0.09;
  const ringOpacity = isDimmed ? 0.05 : active ? 0.45 : 0.14;
  const microRingOpacity = isDimmed ? 0.02 : active ? 0.32 : 0.07;

  return (
    <group
      ref={rootRef}
      position={[0, -1.05, 0]}
      rotation={[tiltAngle, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (onHover) onHover();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (onHoverOut) onHoverOut();
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(e);
      }}
    >
      {/* 1. Subtle, soft diffuse light pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[1.95, 1.95]} />
        <meshBasicMaterial
          map={glowTexture}
          color={color}
          transparent
          opacity={poolOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Thin, delicate holographic outer ellipse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[0.74, 0.758, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={ringOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Faint concentric inner micro-ring with slow gentle rotation */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.42, 0.435, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={microRingOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Restrained accent upward illumination */}
      <pointLight
        color={color}
        intensity={active ? 1.5 : 0.32}
        distance={3.0}
        decay={2}
        position={[0, 0.2, 0]}
      />
    </group>
  );
}
