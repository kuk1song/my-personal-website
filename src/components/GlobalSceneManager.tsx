import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

interface GlobalSceneManagerProps {
  children: React.ReactNode;
  enableGlobalScene?: boolean;
}

// Simple test cube to verify 3D rendering works
const TestCube = () => {
  const cubeRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={cubeRef} position={[2, 0, -3]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#00F5FF" 
        emissive="#00F5FF" 
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const GlobalSceneManager: React.FC<GlobalSceneManagerProps> = ({ 
  children, 
  enableGlobalScene = false 
}) => {
  const sceneTargetRef = useRef<THREE.Group>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  useEffect(() => {
    if (enableGlobalScene && sceneTargetRef.current) {
      try {
        const timer = setTimeout(() => {
          if (sceneTargetRef.current) {
            (window as any).__GLOBAL_3D_SCENE_TARGET__ = sceneTargetRef.current;
            setIsSceneReady(true);
            console.log('🌌 Global 3D scene target established');
          }
        }, 100);

        return () => {
          clearTimeout(timer);
          delete (window as any).__GLOBAL_3D_SCENE_TARGET__;
          setIsSceneReady(false);
        };
      } catch (error) {
        console.error('Error setting up global 3D scene:', error);
      }
    } else {
      delete (window as any).__GLOBAL_3D_SCENE_TARGET__;
      setIsSceneReady(false);
    }

    return () => {
      delete (window as any).__GLOBAL_3D_SCENE_TARGET__;
      setIsSceneReady(false);
    };
  }, [enableGlobalScene]);

  return (
    <>
      {enableGlobalScene && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: 0, // Back to 0 to be behind content
            pointerEvents: 'none'
          }}
        >
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 75 }}
            onCreated={(state) => {
              state.gl.setClearColor(0x000000, 0);
            }}
          >
            {/* Basic lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            {/* Starfield */}
            <Stars 
              radius={100} 
              depth={50} 
              count={5000} 
              factor={4} 
              saturation={0} 
              fade 
              speed={1} 
            />
            
            {/* Test cube to verify 3D is working */}
            <TestCube />
            
            {/* Portal target for charging station */}
            <group ref={sceneTargetRef} position={[0, 0, 0]} scale={0.5} />
          </Canvas>
        </div>
      )}
      
      {/* Main content with proper z-index hierarchy */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      
      {/* Debug indicator */}
      {enableGlobalScene && isSceneReady && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 245, 255, 0.2)',
          border: '1px solid #00F5FF',
          padding: '6px 10px',
          fontSize: '11px',
          color: '#00F5FF',
          zIndex: 9999,
          fontFamily: 'monospace',
          borderRadius: '4px'
        }}>
          🌌 3D Active | Test Cube Visible?
        </div>
      )}
    </>
  );
};

export default GlobalSceneManager; 