import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface House3DProps {
  isCharging: boolean;
  energy: number;
  maxEnergy: number;
}

const CyberpunkDock: React.FC<{ isCharging: boolean; energy: number; maxEnergy: number }> = ({ 
  isCharging, 
  energy, 
  maxEnergy 
}) => {
  const mainPlatformRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);

  const energyPercentage = (energy / maxEnergy) * 100;
  
  // 根据能量等级确定颜色
  const getEnergyColor = () => {
    if (energyPercentage > 70) return '#00F5FF'; // 蓝色
    if (energyPercentage > 30) return '#FFA500'; // 橙色
    return '#FF073A'; // 红色
  };

  // 旋转动画
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * (isCharging ? 2 : 0.5);
    }
    if (coreRef.current && isCharging) {
      coreRef.current.rotation.x += delta * 1;
      coreRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group>
      {/* 主平台 */}
      <mesh ref={mainPlatformRef} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 8]} />
        <meshStandardMaterial 
          color="#1A1F3A"
          emissive="#00F5FF"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* 能量核心 */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial 
          color={getEnergyColor()}
          emissive={getEnergyColor()}
          emissiveIntensity={isCharging ? 0.8 : 0.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* 外圈环 */}
      <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 8, 32]} />
        <meshStandardMaterial 
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={isCharging ? 1 : 0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* 内圈环 */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 3]}>
        <torusGeometry args={[0.6, 0.03, 8, 32]} />
        <meshStandardMaterial 
          color="#FF073A"
          emissive="#FF073A"
          emissiveIntensity={isCharging ? 0.6 : 0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* 支撑柱 */}
      <mesh position={[0.7, -0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
        <meshStandardMaterial 
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[-0.7, -0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
        <meshStandardMaterial 
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, -0.2, 0.7]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
        <meshStandardMaterial 
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, -0.2, -0.7]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
        <meshStandardMaterial 
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* 充电效果粒子 */}
      {isCharging && (
        <>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial 
              color="#00FF41"
              emissive="#00FF41"
              emissiveIntensity={2}
              transparent
              opacity={0.7}
            />
          </mesh>
          <mesh position={[0, -1, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial 
              color="#FF073A"
              emissive="#FF073A"
              emissiveIntensity={2}
              transparent
              opacity={0.7}
            />
          </mesh>
        </>
      )}
      
      {/* 环境光和聚光灯 */}
      <ambientLight intensity={0.4} />
      <pointLight 
        position={[3, 3, 3]} 
        intensity={isCharging ? 2 : 1}
        color="#00F5FF"
        distance={10}
      />
      <pointLight 
        position={[-3, 3, 3]} 
        intensity={0.8}
        color="#FF073A"
        distance={8}
      />
      <spotLight
        position={[0, 5, 0]}
        target-position={[0, 0, 0]}
        intensity={isCharging ? 1.5 : 0.5}
        color="#00F5FF"
        angle={Math.PI / 4}
        penumbra={0.5}
      />
    </group>
  );
};

const House3D: React.FC<House3DProps> = ({ isCharging, energy, maxEnergy }) => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ 
          position: [3, 3, 3], 
          fov: 50 
        }}
        style={{ background: 'transparent' }}
      >
        <CyberpunkDock isCharging={isCharging} energy={energy} maxEnergy={maxEnergy} />
      </Canvas>
    </div>
  );
};

export default House3D;
