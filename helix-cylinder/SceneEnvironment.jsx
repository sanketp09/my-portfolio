import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ─── Animated background gradient sphere ─────────────────────────────────────
function GradientSphere() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        // Base deep blue gradient
        vec3 top    = vec3(0.05, 0.08, 0.20);
        vec3 bottom = vec3(0.02, 0.03, 0.06);
        vec3 col = mix(bottom, top, vUv.y);

        // Slow animated nebula clouds
        float t = uTime * 0.12;
        float n1 = sin(vUv.x * 3.1 + t) * cos(vUv.y * 2.7 - t * 0.8) * 0.5 + 0.5;
        float n2 = sin(vUv.x * 5.3 - t * 1.2) * sin(vUv.y * 4.1 + t) * 0.5 + 0.5;

        // Subtle blue nebula tint
        col += vec3(0.02, 0.04, 0.12) * n1 * 0.6;
        col += vec3(0.04, 0.02, 0.10) * n2 * 0.4;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const ref = useRef();
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh ref={ref} scale={80}>
      <sphereGeometry args={[1, 32, 32]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

// ─── Floor reflection plane ───────────────────────────────────────────────────
function FloorGlow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial color="#050d20" transparent opacity={0.9} depthWrite={false} />
    </mesh>
  );
}

// ─── Ambient grid lines ───────────────────────────────────────────────────────
function GridLines() {
  const mat = new THREE.LineBasicMaterial({ color: "#1a3a7a", transparent: true, opacity: 0.25 });
  const lines = [];
  const COUNT = 20;
  const SIZE = 24;

  for (let i = 0; i <= COUNT; i++) {
    const x = (i / COUNT) * SIZE - SIZE / 2;
    const pts = [new THREE.Vector3(x, -2.2, -SIZE / 2), new THREE.Vector3(x, -2.2, SIZE / 2)];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    lines.push(<line key={`v${i}`} geometry={geo} material={mat} />);
    const pts2 = [new THREE.Vector3(-SIZE / 2, -2.2, x), new THREE.Vector3(SIZE / 2, -2.2, x)];
    const geo2 = new THREE.BufferGeometry().setFromPoints(pts2);
    lines.push(<line key={`h${i}`} geometry={geo2} material={mat} />);
  }
  return <group>{lines}</group>;
}

export function SceneEnvironment() {
  return (
    <>
      <GradientSphere />
      <Stars radius={60} depth={40} count={2500} factor={2.5} saturation={0} fade speed={0.2} />
      <FloorGlow />
      <GridLines />

      {/* Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[-6, 4, 2]} color="#2563eb" intensity={4} distance={20} />
      <pointLight position={[6, 4, 2]} color="#4f46e5" intensity={3} distance={20} />
      <pointLight position={[0, -2, 4]} color="#0ea5e9" intensity={2} distance={12} />
    </>
  );
}
