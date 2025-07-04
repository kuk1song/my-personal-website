import { usePetLaser } from './usePetLaser';
import { usePetAnimations } from './usePetAnimations';
import { useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

// Add tracking when the laser is fired
const trackEvent = (eventName: string, parameters?: any) => {
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'pet_interaction',
      event_label: eventName,
      ...parameters
    });
  }
};

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

  const laser = useCallback(() => {
    if (energy < 10) return;
    
    // Track laser event
    trackEvent('pet_laser_shot', {
      pet_energy: energy,
      laser_position_x: position.x,
      laser_position_y: position.y
    });
    
  }, [energy, position]);

  return {
    actions,
    laserEffect,
    laserBeam,
    isLaserActive
  };
};