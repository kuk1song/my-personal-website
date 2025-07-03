import React from 'react';
import ParticleEffect from '@/components/ParticleEffect';
import TextParticleEffect from '@/components/TextParticleEffect';
import EnergyAbsorptionEffect from '@/components/EnergyAbsorptionEffect';
import LaserBeam from '@/components/LaserBeam';

interface Position {
  x: number;
  y: number;
}

interface LaserBeamData {
  startY: number;
  endY: number;
  x: number;
}

interface Collision {
  text: string;
  x: number;
  y: number;
}

interface PetEffectsRendererProps {
  position: Position;
  isMoving: boolean;
  isVisible: boolean;
  laserEffect: boolean;
  isCharging: boolean;
  laserBeam: LaserBeamData | null;
  collision: Collision | null;
}

const PetEffectsRenderer: React.FC<PetEffectsRendererProps> = ({
  position,
  isMoving,
  isVisible,
  laserEffect,
  isCharging,
  laserBeam,
  collision
}) => {
  return (
    <>
      <LaserBeam laserBeam={laserBeam} />
      
      <ParticleEffect x={position.x} y={position.y} isActive={isMoving && isVisible} type="trail" />
      <ParticleEffect x={position.x} y={position.y} isActive={laserEffect} type="explosion" />
      <EnergyAbsorptionEffect x={position.x} y={position.y} isActive={isCharging && isVisible} />
      
      {collision && (
        <TextParticleEffect
          text={collision.text}
          x={collision.x}
          y={collision.y}
          isActive={true}
          onComplete={() => {}}
        />
      )}
    </>
  );
};

export default PetEffectsRenderer;