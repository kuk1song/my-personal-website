import React from 'react';
import { Bot } from 'lucide-react';

// Event tracking function
const trackEvent = (eventName: string, parameters?: any) => {
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'pet_interaction',
      event_label: eventName,
      ...parameters
    });
  }
};

interface PetDisplayProps {
  position: { x: number; y: number };
  mood: string;
  isVisible: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  customMessage?: string;
  energy: number;
  isCharging: boolean;
  isLaserActive: boolean;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ 
  position, 
  mood, 
  isVisible, 
  onMouseDown,
  onTouchStart,
  customMessage,
  energy,
  isCharging,
  isLaserActive
}) => {
  // Track pet dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    trackEvent('pet_dragged', {
      pet_energy: energy,
      pet_mood: mood
    });
    onMouseDown(e);
  };

  // Track touch interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    trackEvent('pet_touched', {
      pet_energy: energy,
      pet_mood: mood
    });
    onTouchStart?.(e);
  };

  const getMoodText = () => {
    // Display charging status first
    if (isCharging) {
      return 'Charging...';
    }
    
    // Display "Zap!" when shooting laser
    if (isLaserActive) {
      return 'Zap!';
    }
    
    // Do not display any text during play
    if (mood === 'playful' || mood === 'dizzy') {
      return '';
    }
    
    // Display "Need charging..." when low energy
    if (energy <= 10) {
      return 'Need charging...';
    }
    
    // Display custom message if it exists and is not in play state
    if (customMessage && mood !== 'playful' && mood !== 'dizzy') {
      return customMessage;
    }
    
    // Display message based on mood
    switch (mood) {
      case 'excited': return 'Zap!';
      case 'playful': return ''; // Do not display any text during play
      case 'dizzy': return '';   // Do not display text during dizzy
      case 'tired': return 'Need charging...';
      case 'charging': return 'Charging...';
      case 'content': return 'Happy!';
      case 'happy': return 'Happy!';
      case 'neutral': return 'Ready';
      default: return 'Hi!';
    }
  };

  if (!isVisible) return null;

  const moodText = getMoodText();

  return (
    <div 
      className="fixed z-[60] cursor-pointer touch-none"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 60 // Higher than all other pet components
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative">
        <Bot 
          size={48} 
          className={`text-[#48CAE4] ${
            mood === 'happy' || mood === 'content' ? 'animate-bounce' : 
            mood === 'excited' || isLaserActive ? 'animate-pulse' : 
            mood === 'playful' ? 'animate-spin' : 
            mood === 'dizzy' ? 'animate-spin' : 
            mood === 'tired' || energy <= 10 ? 'opacity-40 animate-pulse' : 
            mood === 'charging' || isCharging ? 'animate-pulse' : ''
          }`}
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(72, 202, 228, 0.7))'
          }}
        />
        {moodText && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#030637]/80 border border-[#48CAE4]/40 px-2 py-1 text-xs font-mono text-[#48CAE4] whitespace-nowrap">
            {moodText}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDisplay;