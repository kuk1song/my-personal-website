import React, { useState, useEffect, useCallback } from 'react';
import ChargingStation from '@/components/ChargingStation';
import PetControls from '@/components/PetControls';
import PetDisplay from '@/components/PetDisplay';
import PetInfoPanel from '@/components/PetInfoPanel';
import PetVisibilityToggle from '@/components/PetVisibilityToggle';
import PetEffectsRenderer from '@/components/PetEffectsRenderer';
import { usePetMovement } from '@/hooks/usePetMovement';
import { usePetActions } from '@/hooks/usePetActions';
import { usePetEnergy } from '@/hooks/usePetEnergy';
import { usePetCollisions } from '@/hooks/usePetCollisions';
import { usePetStateManager } from '@/hooks/usePetStateManager';
import { usePetInteractionHandlers } from '@/hooks/usePetInteractionHandlers';

const DigitalPet = () => {
  const chargingStationPosition = { x: 80, y: 80 };
  const initialPosition = { x: chargingStationPosition.x + 40, y: chargingStationPosition.y + 40 };
  
  const { collision, checkCollisions } = usePetCollisions();
  
  const {
    mood,
    setMood,
    lastInteraction,
    setLastInteraction,
    isVisible,
    setIsVisible,
    customMessage,
    isNearAboutMe,
    setIsNearAboutMe,
    hasInteracted,
    setHasInteracted
  } = usePetStateManager({
    onStateChange: () => {} // Empty callback since we're managing state locally
  });

  const { onPositionChange } = usePetInteractionHandlers({
    position: { x: 0, y: 0 }, // Will be updated by usePetMovement
    setLastInteraction,
    setIsNearAboutMe,
    setHasInteracted,
    checkCollisions,
    checkChargingStation: () => {}, // Will be updated by usePetEnergy
    hasInteracted
  });

  const {
    position,
    isMoving,
    handleMouseDown,
    handleTouchStart,
    setIsMoving,
    updatePosition,
    keysPressed
  } = usePetMovement(initialPosition, isVisible, lastInteraction, onPositionChange);

  // 充满电后自动播放的回调函数
  const handleAutoPlay = useCallback(() => {
    if (isVisible) {
      actions.play();
    }
  }, [isVisible]);

  const { energy, maxEnergy, isCharging, setEnergy, checkChargingStation } = usePetEnergy(
    position,
    chargingStationPosition,
    setMood,
    handleAutoPlay
  );

  const { actions, laserEffect, laserBeam, isLaserActive } = usePetActions(
    position,
    energy,
    setEnergy,
    setMood,
    setLastInteraction,
    setIsMoving,
    updatePosition
  );

  const handleLaser = useCallback(() => {
    console.log('handleLaser called, energy:', energy, 'isVisible:', isVisible);
    if (!isVisible) return;
    actions.laser();
    // Mark as interacted when using laser
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [actions.laser, energy, isVisible, hasInteracted]);

  // Keyboard laser action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key, 'isVisible:', isVisible, 'target:', e.target);
      
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      
      if (!isVisible) return;
      
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        console.log('Space key pressed, triggering laser');
        handleLaser();
      }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    console.log('Event listener added for keydown');
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      console.log('Event listener removed for keydown');
    };
  }, [isVisible, handleLaser]);

  // Enhanced mouse interaction tracking
  const handleEnhancedMouseDown = (e: React.MouseEvent) => {
    handleMouseDown(e);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  // Enhanced touch interaction tracking
  const handleEnhancedTouchStart = (e: React.TouchEvent) => {
    handleTouchStart(e);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <>
      <PetEffectsRenderer
        position={position}
        isMoving={isMoving}
        isVisible={isVisible}
        laserEffect={laserEffect}
        isCharging={isCharging}
        laserBeam={laserBeam}
        collision={collision}
      />

      <ChargingStation 
        isCharging={isCharging}
        energy={energy}
        maxEnergy={maxEnergy}
        onChargingComplete={() => {}}
      />

      <PetVisibilityToggle 
        isVisible={isVisible}
        onToggle={toggleVisibility}
      />
      
      <PetDisplay 
        position={position}
        mood={mood}
        isVisible={isVisible}
        onMouseDown={handleEnhancedMouseDown}
        onTouchStart={handleEnhancedTouchStart}
        customMessage={customMessage}
        energy={energy}
        isCharging={isCharging}
        isLaserActive={isLaserActive}
      />
      
      {isVisible && (
        <>
          <PetControls 
            energy={energy}
            onLaser={handleLaser}
            onPlay={actions.play}
            isLaserActive={isLaserActive}
          />
          
          <PetInfoPanel isVisible={isVisible} />
        </>
      )}
    </>
  );
};

export default DigitalPet;