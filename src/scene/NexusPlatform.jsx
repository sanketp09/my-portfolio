import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Compact Floating Platform — Supporting Foundation Base.
 * Sits cleanly beneath the 2x2 realm selectors without touching or obscuring the portrait.
 * Polished dark metal surface, thin cyan illuminated rim, subtle underglow.
 */
export function NexusPlatform({ progress = 1, reducedMotion = false }) {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const pulseRef = useRef(null);

  useFrame((state) => {
    if (!rootRef.current) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;

    // Gentle levitation breath beneath the 2x2 selector grid
    rootRef.current.position.y = -2.15 + Math.sin(t * 0.45) * 0.02;
    rootRef.current.rotation.z = Math.sin(t * 0.22) * 0.003;

    if (pulseRef.current) {
      const p = 1 + Math.sin(t * 1.8) * 0.06;
      pulseRef.current.scale.set(p, p, 1);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.06;
    }
  });

  const p = Math.min(1, Math.max(0, (progress - 0.25) / 0.75));
  if (p <= 0.001) return null;

  return (
    <group ref={rootRef} position={[0, -2.15, -0.2]} scale={[p, p, p]}>
      {/* Upper metallic foundation deck */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.68, 1.74, 0.07, 64]} />
        <meshStandardMaterial
          color="#101826"
          roughness={0.24}
          metalness={0.88}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Outer polished chamfered rim */}
      <mesh position={[0, 0.036, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.71, 0.016, 16, 64]} />
        <meshStandardMaterial
          color="#223554"
          roughness={0.18}
          metalness={0.92}
        />
      </mesh>

      {/* Thin cyan illuminated rim */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.64, 1.68, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Concentric inner tech ring */}
      <mesh position={[0, 0.038, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.92, 48]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Central energy core */}
      <group position={[0, 0.042, 0]}>
        <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.42, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.48, 32]} />
          <meshBasicMaterial
            color="#93c5fd"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Clean shallow reverse bevel underside */}
      <mesh position={[0, -0.09, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.72, 0.18, 48]} />
        <meshStandardMaterial
          color="#0b111e"
          roughness={0.45}
          metalness={0.65}
        />
      </mesh>

      {/* Subtle atmospheric blue underglow */}
      <pointLight
        position={[0, -0.28, 0]}
        color="#0284c7"
        intensity={1.8}
        distance={4.0}
        decay={2}
      />
    </group>
  );
}

export default NexusPlatform;
