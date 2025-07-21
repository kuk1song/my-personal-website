import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

interface InterstellarJourneyProps {
  children: React.ReactNode;
  scrollProgress: number;
}

// Physics-accurate planetary ring system
const PlanetaryRings = ({ 
  planetRadius, 
  innerRadius, 
  outerRadius, 
  particleCount = 2000,
  color 
}: {
  planetRadius: number;
  innerRadius: number;
  outerRadius: number;
  particleCount?: number;
  color: string;
}) => {
  const ringsRef = useRef<THREE.Points>(null);
  
  const ringData = React.useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Orbital mechanics - particles closer to planet move faster
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      
      // Keplerian orbital velocity (simplified)
      const orbitalSpeed = Math.sqrt(planetRadius / radius) * 0.1;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 0.02; // Very thin ring
      
      positions.push(x, y, z);
      
      // Color variation for realism
      const colorVariation = 0.8 + Math.random() * 0.4;
      const ringColor = new THREE.Color(color);
      colors.push(
        ringColor.r * colorVariation,
        ringColor.g * colorVariation,
        ringColor.b * colorVariation
      );
      
      sizes.push(0.02 + Math.random() * 0.03);
      velocities.push(orbitalSpeed);
    }
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      velocities: new Float32Array(velocities)
    };
  }, [innerRadius, outerRadius, particleCount, planetRadius, color]);
  
  useFrame((state, delta) => {
    if (ringsRef.current) {
      const positions = ringsRef.current.geometry.attributes.position.array as Float32Array;
      
      // Animate orbital motion
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        const radius = Math.sqrt(x * x + z * z);
        const currentAngle = Math.atan2(z, x);
        const velocity = ringData.velocities[i];
        
        const newAngle = currentAngle + velocity * delta;
        positions[i3] = Math.cos(newAngle) * radius;
        positions[i3 + 2] = Math.sin(newAngle) * radius;
      }
      
      ringsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={ringsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={ringData.positions.length / 3}
          array={ringData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={ringData.colors.length / 3}
          array={ringData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={ringData.sizes.length}
          array={ringData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.8}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
};

// Enhanced planet with realistic features
const EnhancedPlanet = ({
  position,
  size,
  color,
  type,
  atmosphereColor,
  hasRings = false
}: {
  position: [number, number, number];
  size: number;
  color: string;
  type: 'data' | 'tech' | 'distant';
  atmosphereColor?: string;
  hasRings?: boolean;
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.1;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.05;
    }
  });
  
  return (
    <group position={position}>
      {/* Main planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={type === 'tech' ? 0.1 : 0.7}
          metalness={type === 'tech' ? 0.9 : 0.1}
        />
      </mesh>
      
      {/* Atmosphere */}
      {atmosphereColor && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[size * 1.05, 32, 32]} />
          <meshStandardMaterial
            color={atmosphereColor}
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Surface details */}
      {type === 'data' && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => {
            const lat = (Math.random() - 0.5) * Math.PI;
            const lon = Math.random() * Math.PI * 2;
            const x = size * 1.01 * Math.cos(lat) * Math.cos(lon);
            const y = size * 1.01 * Math.sin(lat);
            const z = size * 1.01 * Math.cos(lat) * Math.sin(lon);
            
            return (
              <mesh key={i} position={[x, y, z]}>
                <boxGeometry args={[0.02, 0.05, 0.02]} />
                <meshStandardMaterial
                  color="#00F5FF"
                  emissive="#00F5FF"
                  emissiveIntensity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Wireframe overlay for tech planet */}
      {type === 'tech' && (
        <mesh>
          <sphereGeometry args={[size * 1.001, 32, 32]} />
          <meshBasicMaterial
            color="#FF073A"
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      )}
      
      {/* Planetary rings */}
      {hasRings && (
        <group rotation={[Math.PI / 6, 0, 0]}>
          <PlanetaryRings
            planetRadius={size}
            innerRadius={size * 1.2}
            outerRadius={size * 2.0}
            particleCount={1500}
            color={color}
          />
          <PlanetaryRings
            planetRadius={size}
            innerRadius={size * 2.2}
            outerRadius={size * 2.8}
            particleCount={800}
            color={color}
          />
        </group>
      )}
    </group>
  );
};

// Simple smooth camera system
const SmoothCamera = ({ scrollProgress }: { scrollProgress: number }) => {
  useFrame((state) => {
    const progress = Math.min(Math.max(scrollProgress, 0), 1);
    
    // Simple linear interpolation for camera position
    const startPos = new THREE.Vector3(0, 2, 12);
    const endPos = new THREE.Vector3(0, 0, -30);
    const currentPos = startPos.lerp(endPos, progress);
    
    // Smooth camera movement
    state.camera.position.lerp(currentPos, 0.05);
    
    // Simple look-at that follows the journey
    const lookAtTarget = new THREE.Vector3(0, 0, -progress * 20);
    state.camera.lookAt(lookAtTarget);
  });
  
  return null;
};

const InterstellarJourney: React.FC<InterstellarJourneyProps> = ({ 
  children, 
  scrollProgress 
}) => {
  const sceneTargetRef = useRef<THREE.Group>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sceneTargetRef.current) {
        (window as any).__GLOBAL_3D_SCENE_TARGET__ = sceneTargetRef.current;
        setIsReady(true);
        console.log('🌌 Classic Interstellar Journey Ready!');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      delete (window as any).__GLOBAL_3D_SCENE_TARGET__;
    };
  }, []);

  return (
    <>
      {/* 3D Space Background */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: -1,
          pointerEvents: 'none'
        }}
      >
        <Canvas 
          camera={{ position: [0, 2, 12], fov: 75 }}
          style={{ width: '100%', height: '100%' }}
          onCreated={(state) => {
            console.log('🌌 Classic Journey Canvas created!');
            state.gl.setClearColor(0x000008, 1);
            state.gl.shadowMap.enabled = true;
            state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <SmoothCamera scrollProgress={scrollProgress} />
          
          {/* Classic lighting */}
          <ambientLight intensity={0.1} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.8} 
            color="#ffffff"
            castShadow
          />
          <pointLight position={[-20, 0, -10]} intensity={0.3} color="#4A90E2" />
          <pointLight position={[20, 10, -30]} intensity={0.2} color="#E24A4A" />
          
          {/* Classic drei Stars */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
          
          {/* Enhanced planets with proper scale and positioning */}
          <EnhancedPlanet
            position={[-8, 2, -15]}
            size={1.8}
            color="#0077BE"
            type="data"
            atmosphereColor="#48CAE4"
            hasRings={true}
          />
          
          <EnhancedPlanet
            position={[12, -3, -35]}
            size={2.2}
            color="#DC2626"
            type="tech"
            atmosphereColor="#FF6B6B"
            hasRings={true}
          />
          
          <EnhancedPlanet
            position={[18, 8, -65]}
            size={1.5}
            color="#7C3AED"
            type="distant"
            atmosphereColor="#A78BFA"
          />
          
          {/* Charging station portal */}
          <group ref={sceneTargetRef} position={[0, -1, 0]} scale={0.3} />
        </Canvas>
      </div>
      
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </>
  );
};

export default InterstellarJourney; 