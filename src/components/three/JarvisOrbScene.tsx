'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbMeshProps {
  pointerRef: React.RefObject<{ x: number; y: number }>;
  scrollProgressRef: React.RefObject<number>;
  particleCount: number;
}

function OrbCore({ pointerRef, scrollProgressRef, particleCount }: OrbMeshProps) {
  const rootRef = useRef<THREE.Group | null>(null);
  const innerRef = useRef<THREE.Mesh | null>(null);
  const outerRingRef = useRef<THREE.Mesh | null>(null);
  const secondRingRef = useRef<THREE.Mesh | null>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 1.72 + (i % 4) * 0.09;
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, [particleCount]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    const px = pointerRef.current.x;
    const py = pointerRef.current.y;
    const scroll = scrollProgressRef.current;

    if (rootRef.current) {
      rootRef.current.rotation.y += clampedDelta * 0.28;
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        py * 0.4 + scroll * 0.8,
        0.06,
      );
      rootRef.current.rotation.z = THREE.MathUtils.lerp(
        rootRef.current.rotation.z,
        -px * 0.3,
        0.06,
      );
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= clampedDelta * 0.42;
      innerRef.current.rotation.x += clampedDelta * 0.22;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += clampedDelta * 0.24;
    }

    if (secondRingRef.current) {
      secondRingRef.current.rotation.y -= clampedDelta * 0.2;
    }
  });

  return (
    <group ref={rootRef}>
      <ambientLight intensity={1.25} />
      <pointLight position={[3, 3, 4]} intensity={3.2} color="#38bdf8" />
      <pointLight position={[-3, -2, -3]} intensity={1.4} color="#0ea5e9" />

      <mesh>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={1.1}
          transparent
          opacity={0.75}
        />
      </mesh>

      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.96, 2]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#0284c7"
          emissiveIntensity={0.9}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0.3, 0]}>
        <torusGeometry args={[1.38, 0.024, 14, 72]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.82} />
      </mesh>

      <mesh ref={secondRingRef} rotation={[-Math.PI / 4, -0.4, 0]}>
        <torusGeometry args={[1.56, 0.016, 12, 72]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.48} />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#7dd3fc"
          size={0.055}
          sizeAttenuation
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

interface JarvisOrbSceneProps {
  pointerRef: React.RefObject<{ x: number; y: number }>;
  scrollProgressRef: React.RefObject<number>;
  isVisible: boolean;
  isMobile: boolean;
}

export default function JarvisOrbScene({
  pointerRef,
  scrollProgressRef,
  isVisible,
  isMobile,
}: JarvisOrbSceneProps) {
  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 4.4], fov: 44 }}
      frameloop={isVisible ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="h-full w-full"
    >
      <OrbCore
        pointerRef={pointerRef}
        scrollProgressRef={scrollProgressRef}
        particleCount={isMobile ? 140 : 280}
      />
    </Canvas>
  );
}
