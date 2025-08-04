import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

interface InterstellarJourneyProps {
  children: React.ReactNode;
  scrollProgress: number;
}

// 修复向右转问题的镜像相机系统
const PerfectMirrorCamera = ({ scrollProgress, pathPoints, calculateLookAtTarget }: { 
  scrollProgress: number; 
  pathPoints: THREE.Vector3[]; 
  calculateLookAtTarget: (point: THREE.Vector3, index: number) => THREE.Vector3;
}) => {
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 2));
  const lastProgressRef = useRef(0);
  
  useFrame((state, delta) => {
    const progress = Math.min(Math.max(scrollProgress, 0), 1);
    
    // 🎯 NEW: Anti-jitter system - only smooth micro-movements
    const progressDiff = Math.abs(progress - lastProgressRef.current);
    
    // Apply adaptive smoothing based on scroll speed
    let adaptiveSmoothing = 1.5;
    if (progressDiff > 0.01) {
      // Fast scrolling - reduce smoothing to keep up
      adaptiveSmoothing = 0.8;
    } else if (progressDiff < 0.001) {
      // Very slow/stopped - increase smoothing for stability
      adaptiveSmoothing = 3.0;
    }
    
    const lerpFactor = 1.0 - Math.exp(-adaptiveSmoothing * delta);
    lastProgressRef.current = progress;

    // 将进度映射到路径点
    const totalSegments = pathPoints.length - 1;
    const segmentIndex = Math.floor(progress * totalSegments);
    const segmentProgress = (progress * totalSegments) - segmentIndex;
    
    // 确保索引在有效范围内
    const currentIndex = Math.min(segmentIndex, totalSegments - 1);
    const nextIndex = Math.min(currentIndex + 1, totalSegments);
    
    // 在两个路径点之间插值
    const currentPoint = pathPoints[currentIndex];
    const nextPoint = pathPoints[nextIndex];
    const targetPos = new THREE.Vector3().lerpVectors(currentPoint, nextPoint, segmentProgress);
    
    // Use adaptive smoothing for position
    state.camera.position.lerp(targetPos, lerpFactor);
    
    // Adjust FOV effect for the new path timing
    // 🎯 TEMPORARILY DISABLED FOR PERFORMANCE TESTING
    /*
    const landingProgress = Math.max(0, (progress - 0.75) / 0.25);
    const baseFov = 75;
    const warpFov = 95;
    const camera = state.camera as THREE.PerspectiveCamera;
    camera.fov = baseFov + (warpFov - baseFov) * Math.sin(landingProgress * Math.PI);
    camera.updateProjectionMatrix();
    */

    // 🎯 NEW: Use interpolated look-at targets between path points
    const currentLookAt = calculateLookAtTarget(currentPoint, currentIndex);
    const nextLookAt = calculateLookAtTarget(nextPoint, nextIndex);
    const targetLookAt = new THREE.Vector3().lerpVectors(currentLookAt, nextLookAt, segmentProgress);
    
    // 平滑的视角过渡，避免突然转向 - 使用自适应平滑
    currentLookAtRef.current.lerp(targetLookAt, lerpFactor * 0.7);
    state.camera.lookAt(currentLookAtRef.current);
  });
  
  return null;
};

// 🎯 NEW: Path Visualization Component
const PathVisualizer = ({ pathPoints }: { pathPoints: THREE.Vector3[] }) => {
  const pathGeometry = React.useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    
    // Create a smooth curve through all path points
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const current = pathPoints[i];
      const next = pathPoints[i + 1];
      
      // Add intermediate points for smoother visualization
      for (let t = 0; t <= 1; t += 0.1) {
        const point = new THREE.Vector3().lerpVectors(current, next, t);
        positions.push(point.x, point.y, point.z);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [pathPoints]);
  
  return (
    <primitive object={new THREE.Line(pathGeometry, new THREE.LineBasicMaterial({ color: '#00FF00' }))} />
  );
};

// 🎯 NEW: Path Points Markers with Numbers
const PathMarkers = ({ pathPoints }: { pathPoints: THREE.Vector3[] }) => {
  return (
    <group>
      {pathPoints.map((point, index) => (
        <group key={index} position={[point.x, point.y, point.z]}>
          {/* Main marker sphere - smaller and more refined */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial 
              color={index === 0 ? "#00FF00" : index === pathPoints.length - 1 ? "#FF0000" : "#FFDD00"} 
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// 🎯 NEW: Screen position calculator (runs inside Canvas)
const ScreenPositionCalculator = ({ 
  pathPoints, 
  onPositionsUpdate 
}: { 
  pathPoints: THREE.Vector3[]; 
  onPositionsUpdate: (positions: {x: number, y: number, visible: boolean}[]) => void;
}) => {
  useFrame((state) => {
    const camera = state.camera;
    const newPositions = pathPoints.map(point => {
      const vector = point.clone();
      vector.project(camera);
      
      // Convert normalized device coordinates to screen coordinates
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
      
      // Check if point is visible (not behind camera)
      const visible = vector.z < 1;
      
      return { x, y, visible };
    });
    
    onPositionsUpdate(newPositions);
  });

  return null; // This component doesn't render anything
};

// 🎯 NEW: HTML overlay for path point labels (outside Canvas)
const PathPointLabelsOverlay = ({ 
  pathPoints, 
  screenPositions 
}: { 
  pathPoints: THREE.Vector3[];
  screenPositions: {x: number, y: number, visible: boolean}[];
}) => {
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      pointerEvents: 'none', 
      zIndex: 100 
    }}>
      {screenPositions.map((pos, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${pos.x}px`,
            top: `${pos.y - 25}px`, // Offset above the sphere
            transform: 'translate(-50%, -50%)',
            color: index === 0 ? "#00FF00" : index === pathPoints.length - 1 ? "#FF0000" : "#FFDD00",
            fontFamily: 'monospace',
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 4px currentColor',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '4px 8px',
            borderRadius: '6px',
            border: `1px solid ${index === 0 ? "#00FF00" : index === pathPoints.length - 1 ? "#FF0000" : "#FFDD00"}`,
            opacity: pos.visible ? 1 : 0,
            transition: 'opacity 0.2s ease',
            minWidth: '24px',
            textAlign: 'center',
          }}
        >
          {index}
        </div>
      ))}
    </div>
  );
};

// 保留您优化的星球系统
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
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const orbitalSpeed = Math.sqrt(planetRadius / radius) * 0.1;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 0.02;
      
      positions.push(x, y, z);
      
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

// 🎯 NEW: Camera Look Direction Visualizer
const LookAtVisualizer = ({ 
  pathPoints, 
  scrollProgress, 
  calculateLookAtTarget 
}: { 
  pathPoints: THREE.Vector3[]; 
  scrollProgress: number;
  calculateLookAtTarget: (point: THREE.Vector3, index: number) => THREE.Vector3;
}) => {
  const arrowRef = useRef<THREE.ArrowHelper>();
  
  useFrame(() => {
    // Calculate current camera position and look-at target (same logic as PerfectMirrorCamera)
    const progress = Math.min(Math.max(scrollProgress, 0), 1);
    const totalSegments = pathPoints.length - 1;
    const segmentIndex = Math.floor(progress * totalSegments);
    const segmentProgress = (progress * totalSegments) - segmentIndex;
    
    const currentIndex = Math.min(segmentIndex, totalSegments - 1);
    const nextIndex = Math.min(currentIndex + 1, totalSegments);
    
    const currentPoint = pathPoints[currentIndex];
    const nextPoint = pathPoints[nextIndex];
    const currentPos = new THREE.Vector3().lerpVectors(currentPoint, nextPoint, segmentProgress);
    
    // 🎯 NEW: Use the same interpolated look-at logic as the camera
    const currentLookAt = calculateLookAtTarget(currentPoint, currentIndex);
    const nextLookAt = calculateLookAtTarget(nextPoint, nextIndex);
    const targetLookAt = new THREE.Vector3().lerpVectors(currentLookAt, nextLookAt, segmentProgress);
    
    // Update current camera direction arrow
    if (arrowRef.current) {
      const direction = new THREE.Vector3().subVectors(targetLookAt, currentPos).normalize();
      arrowRef.current.position.copy(currentPos);
      arrowRef.current.setDirection(direction);
      arrowRef.current.setLength(10, 3, 1);
    }
  });
  
  // Create arrow helper outside of useFrame
  const arrowHelper = React.useMemo(() => {
    return new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1), // direction
      new THREE.Vector3(0, 0, 0),  // origin
      8, // length - slightly smaller
      0xFF3333, // brighter red color
      2, // headLength - more refined
      0.8  // headWidth - more refined
    );
  }, []);
  
  return (
    <primitive 
      ref={arrowRef}
      object={arrowHelper}
    />
  );
};

// 🎯 NEW: Static Look Direction Preview for All Path Points
const StaticLookPreview = ({ 
  pathPoints, 
  calculateLookAtTarget 
}: { 
  pathPoints: THREE.Vector3[];
  calculateLookAtTarget: (point: THREE.Vector3, index: number) => THREE.Vector3;
}) => {
  const previewArrows = React.useMemo(() => {
    return pathPoints.map((point, index) => {
      // 🎯 NEW: Use the custom look-at calculation
      const lookAt = calculateLookAtTarget(point, index);
      const direction = new THREE.Vector3().subVectors(lookAt, point).normalize();
      
      return new THREE.ArrowHelper(
        direction,
        point,
        5, // length - made smaller
        0x00DDFF, // brighter cyan color
        1.5, // headLength - more refined
        0.6 // headWidth - more refined
      );
    });
  }, [pathPoints, calculateLookAtTarget]);
  
  return (
    <group>
      {previewArrows.map((arrow, index) => (
        <primitive
          key={index}
          object={arrow}
        />
      ))}
    </group>
  );
};

const InterstellarJourney: React.FC<InterstellarJourneyProps> = ({ 
  children, 
  scrollProgress 
}) => {
  const sceneTargetRef = useRef<THREE.Group>(null);
  const [isReady, setIsReady] = useState(false);
  const [showPathTools, setShowPathTools] = useState(false); // 🎯 Toggle for development
  const [screenPositions, setScreenPositions] = useState<{x: number, y: number, visible: boolean}[]>([]);

  // Extract pathPoints to share between camera and visualizer
  const pathPoints = React.useMemo(() => [
    new THREE.Vector3(0, 2, 12),      // 0. Start
    new THREE.Vector3(-4, 2, 4),      // 1. Veer towards blue
    new THREE.Vector3(-8, 2, -8),     // 2. Approach blue
    new THREE.Vector3(-12, 2, -20),   // 3. Pass blue
    new THREE.Vector3(6, 0, -32),    // 4. Deeper transition space
    new THREE.Vector3(19, -8, -32),

    // Red Planet Fly-by: A wider, more graceful arc
    new THREE.Vector3(15, -5, -36),
    new THREE.Vector3(10, -2, -45),   // 5. Approach red from a distance
    new THREE.Vector3(1, 2, -30),
    new THREE.Vector3(6, 0, -32),
    new THREE.Vector3(5, 2, -25),
    new THREE.Vector3(11, 1, -30),
    new THREE.Vector3(17, 1, -35),
    
    new THREE.Vector3(18, -1, -45),   // 6. Sweep past the right side of the red planet
    new THREE.Vector3(22, 1, -50),    // 7. Exit the arc, looking ahead to purple

    // Purple Planet Landing: A high-angle dive for dramatic effect
    new THREE.Vector3(20, 9, -66),   // 8. High approach, viewing purple from above
    new THREE.Vector3(18.5, 8, -68),  // 9. Begin the "dive"
    new THREE.Vector3(18.2, 7.5, -70),// 10. Accelerate towards the surface
    new THREE.Vector3(18, 7.2, -71.5),// 11. Final landing position, very close
  ], []);

  // 🎯 NEW: Custom Look-At Targets for Each Path Point
  const customLookAtTargets = React.useMemo(() => [
    // Index 0-5: Default forward-looking (蓝色星球区域)
    null, // 0. Use default
    null, // 1. Use default  
    null, // 2. Use default
    null, // 3. Use default
    new THREE.Vector3(12, -3, -35), // 4. Use default
    new THREE.Vector3(12, -3, -35), // 5. Use default

    // Index 6-8: Custom directions for red planet fly-by
    new THREE.Vector3(12, -3, -35),
    new THREE.Vector3(12, -3, -35),
    new THREE.Vector3(12, -3, -35),
    new THREE.Vector3(12, -3, -35),   // 6. Look directly at red planet
    new THREE.Vector3(12, -3, -35),   // 7. Keep looking at red planet
    new THREE.Vector3(15, 2, -50), 
    new THREE.Vector3(15, 2, -50),
    new THREE.Vector3(15, 2, -50),
    new THREE.Vector3(18, 8, -65),    // 8. Start looking toward purple planet

    // Index 9-11: Simplified purple planet approach (removed extra directions)
    new THREE.Vector3(18, 8, -65),    // 9. Look at purple planet
    new THREE.Vector3(18, 8, -55),    // 10. Keep looking at purple planet
    new THREE.Vector3(15, 8, 0),    // 11. Final gaze at purple planet

    new THREE.Vector3(18, 8, 0), // 11. Use default (final approach)
  ], []);

  // 🎯 Helper function to calculate look-at target for any path point
  const calculateLookAtTarget = React.useCallback((pathPoint: THREE.Vector3, index: number) => {
    // If there's a custom target for this index, use it
    if (customLookAtTargets[index]) {
      return customLookAtTargets[index]!.clone();
    }
    
    // Otherwise, use the default formula
    return new THREE.Vector3(
      pathPoint.x * 0.05,
      pathPoint.y * 0.05,
      pathPoint.z - 15
    );
  }, [customLookAtTargets]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sceneTargetRef.current) {
        (window as any).__GLOBAL_3D_SCENE_TARGET__ = sceneTargetRef.current;
        setIsReady(true);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      delete (window as any).__GLOBAL_3D_SCENE_TARGET__;
    };
  }, []);

  return (
    <>
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
            console.log('🎯 Perfect Mirror Journey Canvas created!');
            state.gl.setClearColor(0x000008, 1);
            state.gl.shadowMap.enabled = true;
            state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <PerfectMirrorCamera scrollProgress={scrollProgress} pathPoints={pathPoints} calculateLookAtTarget={calculateLookAtTarget} />
          
          {/* 🎯 NEW: Development Tools - Remove these when satisfied */}
          {showPathTools && (
            <>
              <PathVisualizer pathPoints={pathPoints} />
              <PathMarkers pathPoints={pathPoints} />
              <LookAtVisualizer pathPoints={pathPoints} scrollProgress={scrollProgress} calculateLookAtTarget={calculateLookAtTarget} />
              <StaticLookPreview pathPoints={pathPoints} calculateLookAtTarget={calculateLookAtTarget} />
              <ScreenPositionCalculator pathPoints={pathPoints} onPositionsUpdate={setScreenPositions} />
            </>
          )}
          
          <ambientLight intensity={0.1} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.8} 
            color="#ffffff"
            castShadow
          />
          <pointLight position={[-20, 0, -10]} intensity={0.3} color="#4A90E2" />
          <pointLight position={[20, 10, -30]} intensity={0.2} color="#E24A4A" />
          
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
          
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
          
          <group ref={sceneTargetRef} position={[0, -1, 0]} scale={0.3} />
        </Canvas>
      </div>
      
      {/* 🎯 NEW: HTML Overlay for Path Point Numbers */}
      {showPathTools && (
        <div style={{ 
          position: 'fixed', 
          top: 20, 
          left: 20, 
          zIndex: 100,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#00DDFF',
          padding: '10px 15px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxWidth: '300px'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>🎯 Path Points Reference:</div>
          {pathPoints.map((point, index) => (
            <div key={index} style={{ marginBottom: '2px' }}>
              <span style={{ 
                color: index === 0 ? "#00FF00" : index === pathPoints.length - 1 ? "#FF0000" : "#FFDD00",
                fontWeight: 'bold',
                marginRight: '8px'
              }}>
                {index}:
              </span>
              <span style={{ fontSize: '11px' }}>
                ({point.x.toFixed(1)}, {point.y.toFixed(1)}, {point.z.toFixed(1)})
                {customLookAtTargets[index] ? ' [Custom Look]' : ' [Auto Look]'}
              </span>
            </div>
          ))}
          <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
            🔴 Red Arrow: Current Camera Direction<br/>
            🔵 Blue Arrows: Static Look Directions
          </div>
        </div>
      )}
      
      {/* 🎯 NEW: Real-time path point labels overlay */}
      {showPathTools && <PathPointLabelsOverlay pathPoints={pathPoints} screenPositions={screenPositions} />}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </>
  );
};

export default InterstellarJourney;
