import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

export const usePetEnergy = (
  position: Position,
  chargingStationPosition: Position,
  setMood: (mood: string) => void,
  onAutoPlay?: () => void
) => {
  const [energy, setEnergy] = useState(100);
  const [maxEnergy] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  // Check charging station proximity
  const checkChargingStation = (botX: number, botY: number) => {
    const stationCenterX = chargingStationPosition.x;
    const stationCenterY = chargingStationPosition.y;
    
    const distance = Math.sqrt(
      Math.pow(botX - stationCenterX, 2) + 
      Math.pow(botY - stationCenterY, 2)
    );
    
    if (distance < 120 && energy < maxEnergy) {
      if (!isCharging) {
        setIsCharging(true);
        setMood('charging');
        setHasAutoPlayed(false); // 重置自动播放标志
      }
    } else {
      if (isCharging) {
        setIsCharging(false);
        setMood('happy');
      }
    }
  };

  // Charging effect
  useEffect(() => {
    if (isCharging && energy < maxEnergy) {
      const chargingInterval = setInterval(() => {
        setEnergy(prev => {
          const newEnergy = Math.min(maxEnergy, prev + 2);
          if (newEnergy >= maxEnergy) {
            setIsCharging(false);
            // 充满电后直接播放动画，不显示hi
            if (!hasAutoPlayed && onAutoPlay) {
              setTimeout(() => {
                onAutoPlay();
                setHasAutoPlayed(true);
              }, 500);
            }
          }
          return newEnergy;
        });
      }, 100);

      return () => clearInterval(chargingInterval);
    }
  }, [isCharging, energy, maxEnergy, hasAutoPlayed, onAutoPlay]);

  // Check charging when position changes
  useEffect(() => {
    checkChargingStation(position.x, position.y);
  }, [position.x, position.y]);

  return {
    energy,
    maxEnergy,
    isCharging,
    setEnergy,
    checkChargingStation
  };
};
