import { useState } from 'react';

interface Position {
  x: number;
  y: number;
}

export const usePetAnimations = (
  position: Position,
  setMood: (mood: string) => void,
  setLastInteraction: (time: number) => void,
  setIsMoving: (moving: boolean) => void,
  updatePosition: (position: Position) => void
) => {
  const playAnimations = [
    {
      name: 'circle',
      action: () => {
        setMood('playful');
        setLastInteraction(Date.now());
        const centerX = position.x;
        const centerY = position.y;
        const radius = 30;
        let angle = 0;
        
        setIsMoving(true);
        const circle = setInterval(() => {
          angle += 0.2;
          const newX = centerX + radius * Math.cos(angle);
          const newY = centerY + radius * Math.sin(angle);
          updatePosition({ x: newX, y: newY });
          
          if (angle > Math.PI * 2) {
            clearInterval(circle);
            setIsMoving(false);
            setMood('happy'); // play完后显示happy
          }
        }, 30);
      }
    },
    {
      name: 'zigzag',
      action: () => {
        setMood('playful');
        setLastInteraction(Date.now());
        const startX = position.x;
        const startY = position.y;
        let step = 0;
        
        setIsMoving(true);
        const zigzag = setInterval(() => {
          step++;
          const newX = startX + (step % 2 === 0 ? 20 : -20);
          const newY = startY + step * 5;
          updatePosition({ x: newX, y: newY });
          
          if (step > 8) {
            clearInterval(zigzag);
            updatePosition({ x: startX, y: startY });
            setIsMoving(false);
            setMood('happy'); // play完后显示happy
          }
        }, 200);
      }
    },
    {
      name: 'bounce',
      action: () => {
        setMood('excited');
        setLastInteraction(Date.now());
        const startY = position.y;
        let bounceCount = 0;
        
        setIsMoving(true);
        const bounce = setInterval(() => {
          bounceCount++;
          const newY = startY - Math.abs(Math.sin(bounceCount * 0.5)) * 30;
          updatePosition({ x: position.x, y: newY });
          
          if (bounceCount > 12) {
            clearInterval(bounce);
            updatePosition({ x: position.x, y: startY });
            setIsMoving(false);
            setMood('happy'); // play完后显示happy
          }
        }, 100);
      }
    },
    {
      name: 'spiral',
      action: () => {
        setMood('dizzy');
        setLastInteraction(Date.now());
        const centerX = position.x;
        const centerY = position.y;
        let angle = 0;
        let radius = 5;
        
        setIsMoving(true);
        const spiral = setInterval(() => {
          angle += 0.3;
          radius += 1;
          const newX = centerX + radius * Math.cos(angle);
          const newY = centerY + radius * Math.sin(angle);
          updatePosition({ x: newX, y: newY });
          
          if (radius > 40) {
            clearInterval(spiral);
            updatePosition({ x: centerX, y: centerY });
            setIsMoving(false);
            setMood('happy'); // play完后显示happy
          }
        }, 50);
      }
    }
  ];

  const play = () => {
    const randomPlay = playAnimations[Math.floor(Math.random() * playAnimations.length)];
    randomPlay.action();
  };

  return {
    play
  };
};