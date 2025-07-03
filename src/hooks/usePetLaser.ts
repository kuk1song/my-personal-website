import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface LaserBeam {
  startY: number;
  endY: number;
  x: number;
}

export const usePetLaser = (
  position: Position,
  energy: number,
  setEnergy: (updater: (prev: number) => number) => void,
  setMood: (mood: string) => void,
  setLastInteraction: (time: number) => void,
  updatePosition: (position: Position) => void
) => {
  const [laserEffect, setLaserEffect] = useState(false);
  const [laserBeam, setLaserBeam] = useState<LaserBeam | null>(null);
  const [isLaserActive, setIsLaserActive] = useState(false);

  // Update laser beam position when bot moves
  useEffect(() => {
    if (laserBeam) {
      setLaserBeam(prev => prev ? {
        ...prev,
        x: position.x,
        startY: position.y
      } : null);
    }
  }, [position.x, position.y]);

  // Gradual energy consumption during laser
  useEffect(() => {
    if (isLaserActive && energy > 0) {
      const energyInterval = setInterval(() => {
        setEnergy(prev => {
          const newEnergy = Math.max(0, prev - 1);
          if (newEnergy <= 0) {
            setIsLaserActive(false);
            setLaserBeam(null);
            setLaserEffect(false);
            setMood('tired');
          }
          return newEnergy;
        });
      }, 80); // Consume 1 energy every 80ms

      return () => clearInterval(energyInterval);
    }
  }, [isLaserActive, energy]);

  const fireLaser = () => {
    console.log('Laser action triggered, energy:', energy);
    
    if (energy < 6) {
      setMood('tired');
      console.log('Not enough energy for laser');
      return;
    }
    
    // 发射激光时立即消耗6点能量
    setEnergy(prev => Math.max(0, prev - 6));
    
    setMood('excited');
    setLastInteraction(Date.now());
    setLaserEffect(true);
    setIsLaserActive(true);
    
    const startY = position.y;
    const endY = window.innerHeight;
    const currentX = position.x;
    setLaserBeam({ startY, endY, x: currentX });
    
    updatePosition({ x: position.x, y: position.y - 15 });
    console.log('Laser fired');
    
    // 激光持续1秒后自动停止，但不强制移动bot回到原位置
    setTimeout(() => {
      setIsLaserActive(false);
      setLaserBeam(null);
      setLaserEffect(false);
      setMood('happy');
      // 移除强制回到startY的代码，让bot保持当前位置
      console.log('Laser stopped');
    }, 1000);
  };

  return {
    fireLaser,
    laserEffect,
    laserBeam,
    isLaserActive
  };
};