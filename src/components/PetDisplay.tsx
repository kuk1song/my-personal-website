import React from 'react';
import { Bot } from 'lucide-react';

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
  const getMoodText = () => {
    // 优先显示充电状态
    if (isCharging) {
      return 'Charging...';
    }
    
    // 发射激光时显示"Zap!"
    if (isLaserActive) {
      return 'Zap!';
    }
    
    // play期间不显示任何文字
    if (mood === 'playful' || mood === 'dizzy') {
      return '';
    }
    
    // 低能量时显示需要充电的消息
    if (energy <= 10) {
      return 'Need charging...';
    }
    
    // 如果有自定义消息，且不在play状态，显示它
    if (customMessage && mood !== 'playful' && mood !== 'dizzy') {
      return customMessage;
    }
    
    // 根据心情显示消息
    switch (mood) {
      case 'excited': return 'Zap!';
      case 'playful': return ''; // play的时候不显示任何文字
      case 'dizzy': return '';   // dizzy的时候也不显示文字
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
      className="fixed z-50 cursor-pointer touch-none"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
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