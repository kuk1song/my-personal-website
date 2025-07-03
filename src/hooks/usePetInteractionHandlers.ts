import { useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UsePetInteractionHandlersProps {
  position: Position;
  setLastInteraction: (time: number) => void;
  setIsNearAboutMe: (isNear: boolean) => void;
  setHasInteracted: (hasInteracted: boolean) => void;
  checkCollisions: (x: number, y: number) => void;
  checkChargingStation: (x: number, y: number) => void;
  hasInteracted: boolean;
}

export const usePetInteractionHandlers = ({
  position,
  setLastInteraction,
  setIsNearAboutMe,
  setHasInteracted,
  checkCollisions,
  checkChargingStation,
  hasInteracted
}: UsePetInteractionHandlersProps) => {
  // Check if bot is near "Haokun Song" text specifically
  const checkAboutMeSection = useCallback((botX: number, botY: number) => {
    // Look for the "Haokun Song" text specifically
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const haokunsongElement = aboutSection.querySelector('h3');
      if (haokunsongElement && haokunsongElement.textContent?.includes('Haokun Song')) {
        const rect = haokunsongElement.getBoundingClientRect();
        const scrollY = window.scrollY;
        
        // Check if bot is within a smaller area around the "Haokun Song" text
        const isNear = botX > rect.left - 50 && 
                      botX < rect.right + 50 &&
                      botY > rect.top + scrollY - 50 && 
                      botY < rect.bottom + scrollY + 50;
        
        setIsNearAboutMe(isNear);
      }
    }
  }, [setIsNearAboutMe]);

  const onPositionChange = useCallback((position: Position) => {
    checkCollisions(position.x, position.y);
    checkChargingStation(position.x, position.y);
    checkAboutMeSection(position.x, position.y);
    setLastInteraction(Date.now());
    
    // Mark as interacted when position changes due to user input
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [checkCollisions, checkChargingStation, checkAboutMeSection, setLastInteraction, hasInteracted, setHasInteracted]);

  return { onPositionChange };
};