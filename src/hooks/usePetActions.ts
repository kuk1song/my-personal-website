import { usePetLaser } from './usePetLaser';
import { usePetAnimations } from './usePetAnimations';

interface Position {
  x: number;
  y: number;
}

export const usePetActions = (
  position: Position,
  energy: number,
  setEnergy: (updater: (prev: number) => number) => void,
  setMood: (mood: string) => void,
  setLastInteraction: (time: number) => void,
  setIsMoving: (moving: boolean) => void,
  updatePosition: (position: Position) => void
) => {
  const { fireLaser, laserEffect, laserBeam, isLaserActive } = usePetLaser(
    position,
    energy,
    setEnergy,
    setMood,
    setLastInteraction,
    updatePosition
  );

  const { play } = usePetAnimations(
    position,
    setMood,
    setLastInteraction,
    setIsMoving,
    updatePosition
  );

  const actions = {
    laser: fireLaser,
    play
  };

  return {
    actions,
    laserEffect,
    laserBeam,
    isLaserActive
  };
};