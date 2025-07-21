import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

interface InterstellarJourneyProps {
  children: React.ReactNode;
  scrollProgress: number;
}

// Advanced Planet component with realistic rendering and textures
const Planet = ({ 
  position, 
  size, 
  color, 
  type,
  glowIntensity = 0.3,
  atmosphereColor 
}: {
  position: [number, number, number];
  size: number;
  color: string;
  type: 'about' | 'products' | 'distant';
  glowIntensity?: number;
  atmosphereColor?: string;
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.1;
    }
    
    // Atmosphere rotation (slower)
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.05;
    }
    
    // Cloud layer rotation (different speed)
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.15;
    }
    
    // Ring orbital rotation (correct physics - around Z axis like Saturn)
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2; // Correct orbital rotation
    }
  });

  // Get planet-specific materials with enhanced textures
  const getPlanetMaterial = () => {
    switch (type) {
      case 'about':
        // Data/Ocean planet with circuit-like patterns
        return (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={glowIntensity}
            roughness={0.4}
            metalness={0.6}
            // Enhanced surface details
            bumpScale={0.02}
          />
        );
      case 'products':
        // Cyberpunk tech planet with metallic surface
        return (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={glowIntensity}
            roughness={0.1}
            metalness={0.9}
            // Highly reflective metallic surface
            bumpScale={0.01}
          />
        );
      case 'distant':
        return (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={glowIntensity * 0.7}
            roughness={0.7}
            metalness={0.3}
          />
        );
    }
  };

  const hasRings = type === 'about' || type === 'products';
  const hasClouds = type === 'about';
  const hasHexGrid = type === 'products'; // Cyberpunk hex grid

  return (
    <group position={position}>
      {/* Main planet with enhanced material */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[size, 128, 128]} />
        {getPlanetMaterial()}
      </mesh>
      
      {/* Cyberpunk hex grid overlay for products planet */}
      {hasHexGrid && (
        <mesh>
          <sphereGeometry args={[size * 1.005, 32, 32]} />
          <meshBasicMaterial
            color="#FF073A"
            transparent
            opacity={0.6}
            wireframe={true}
          />
        </mesh>
      )}
      
      {/* Cloud layer for "about" planet */}
      {hasClouds && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[size * 1.03, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            alphaTest={0.1}
          />
        </mesh>
      )}
      
      {/* Enhanced atmosphere with multiple layers */}
      {atmosphereColor && (
        <>
          {/* Inner atmosphere */}
          <mesh ref={atmosphereRef}>
            <sphereGeometry args={[size * 1.12, 32, 32]} />
            <meshStandardMaterial
              color={atmosphereColor}
              emissive={atmosphereColor}
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
              side={THREE.BackSide}
            />
          </mesh>
          
          {/* Outer atmosphere glow */}
          <mesh>
            <sphereGeometry args={[size * 1.25, 32, 32]} />
            <meshStandardMaterial
              color={atmosphereColor}
              emissive={atmosphereColor}
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
              side={THREE.BackSide}
            />
          </mesh>
          
          {/* Outermost glow */}
          <mesh>
            <sphereGeometry args={[size * 1.4, 16, 16]} />
            <meshBasicMaterial
              color={atmosphereColor}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}
      
      {/* Planetary rings with correct orbital motion */}
      {hasRings && (
        <group ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
          {/* Main ring */}
          <mesh>
            <torusGeometry args={[size * 1.8, size * 0.12, 3, 100]} />
            <meshStandardMaterial
              color={type === 'about' ? "#00F5FF" : "#FF073A"}
              emissive={type === 'about' ? "#00F5FF" : "#FF073A"}
              emissiveIntensity={0.6}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Secondary ring */}
          <mesh>
            <torusGeometry args={[size * 2.2, size * 0.06, 3, 100]} />
            <meshStandardMaterial
              color={type === 'about' ? "#48CAE4" : "#FF6B6B"}
              emissive={type === 'about' ? "#48CAE4" : "#FF6B6B"}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Ring particles - more visible */}
          {Array.from({ length: 80 }).map((_, i) => {
            const angle = (i / 80) * Math.PI * 2;
            const radius = size * (1.6 + Math.random() * 0.8);
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  0,
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[size * 0.008, 4, 4]} />
                <meshBasicMaterial
                  color={type === 'about' ? "#00F5FF" : "#FF073A"}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Enhanced space stations for products planet */}
      {type === 'products' && (
        <group>
          {/* Large space station */}
          <mesh position={[size * 3.2, 0, 0]}>
            <boxGeometry args={[size * 0.2, size * 0.08, size * 0.2]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Mining station */}
          <mesh position={[-size * 2.8, size * 0.8, size * 0.6]}>
            <cylinderGeometry args={[size * 0.06, size * 0.08, size * 0.15, 8]} />
            <meshStandardMaterial
              color="#00FF41"
              emissive="#00FF41"
              emissiveIntensity={0.7}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Communication array */}
          <mesh position={[size * 2.5, size * 1.2, -size * 0.8]}>
            <coneGeometry args={[size * 0.04, size * 0.12, 6]} />
            <meshStandardMaterial
              color="#FF073A"
              emissive="#FF073A"
              emissiveIntensity={0.9}
            />
          </mesh>
        </group>
      )}
      
      {/* Enhanced surface cities for about planet */}
      {type === 'about' && (
        <group>
          {Array.from({ length: 30 }).map((_, i) => {
            const lat = (Math.random() - 0.5) * Math.PI;
            const lon = Math.random() * Math.PI * 2;
            const x = size * 1.02 * Math.cos(lat) * Math.cos(lon);
            const y = size * 1.02 * Math.sin(lat);
            const z = size * 1.02 * Math.cos(lat) * Math.sin(lon);
            
            return (
              <mesh key={i} position={[x, y, z]}>
                <boxGeometry args={[0.03, 0.08, 0.03]} />
                <meshStandardMaterial
                  color="#00F5FF"
                  emissive="#00F5FF"
                  emissiveIntensity={1.2}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
};

// Camera controller based on scroll
const ScrollCamera = ({ scrollProgress }: { scrollProgress: number }) => {
  useFrame((state) => {
    const targetZ = 10 - scrollProgress * 30;
    const targetX = scrollProgress * 5;
    
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, Math.sin(scrollProgress * Math.PI) * 3, 0.05);
    
    state.camera.lookAt(0, 0, state.camera.position.z - 15);
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
        console.log('🚀 Advanced Interstellar Journey Ready!');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      delete (window as any).__GLOBAL_3D_SCENE_TARGET__;
    };
  }, []);

  return (
    <>
      {/* Enhanced 3D Space Background */}
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
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ width: '100%', height: '100%' }}
          onCreated={(state) => {
            console.log('🌌 Advanced Journey Canvas created!');
            state.gl.setClearColor(0x000011, 1);
            // Enable shadows for more realistic rendering
            state.gl.shadowMap.enabled = true;
            state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <ScrollCamera scrollProgress={scrollProgress} />
          
          {/* Enhanced lighting system */}
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.2} 
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#00F5FF" />
          <pointLight position={[15, 5, 5]} intensity={0.4} color="#FF073A" />
          
          {/* Enhanced starfield */}
          <Stars 
            radius={100} 
            depth={50} 
            count={12000} 
            factor={6} 
            saturation={0} 
            fade 
            speed={1.5} 
          />
          
          {/* Advanced planets - brought much closer for visibility */}
          <Planet
            position={[-6, 3, -8]}
            size={2.5}
            color="#00B4D8"
            type="about"
            atmosphereColor="#48CAE4"
            glowIntensity={0.6}
          />
          
          <Planet
            position={[7, -3, -12]}
            size={3}
            color="#FF073A"
            type="products"
            atmosphereColor="#FF6B6B"
            glowIntensity={0.5}
          />
          
          <Planet
            position={[10, 6, -20]}
            size={2}
            color="#7C3AED"
            type="distant"
            atmosphereColor="#A78BFA"
            glowIntensity={0.4}
          />
          
          {/* Charging station portal */}
          <group ref={sceneTargetRef} position={[0, -2, 0]} scale={0.4} />
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