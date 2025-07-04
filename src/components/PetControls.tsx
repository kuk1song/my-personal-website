import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PetControlsProps {
  energy: number;
  onLaser: () => void;
  onPlay: () => void;
  isLaserActive?: boolean;
}

const PetControls: React.FC<PetControlsProps> = ({ energy, onLaser, onPlay, isLaserActive = false }) => {
  const handleLaserClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'pet_laser_button', {
        event_category: 'pet_interaction',
        event_label: 'laser_button_click',
        pet_energy: energy
      });
    }
    onLaser();
  };

  const handlePlayClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'pet_play_button', {
        event_category: 'pet_interaction',
        event_label: 'play_button_click',
        pet_energy: energy
      });
    }
    onPlay();
  };

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 z-50 flex space-x-1 sm:space-x-2">
      <Button 
        size="sm"
        variant="outline"
        className={`border border-[#48CAE4] bg-[#030637]/80 hover:bg-[#0077B6]/20 text-[#48CAE4] font-mono rounded-none px-2 sm:px-4 py-1 sm:py-2 ${
          energy < 6 ? 'opacity-50 cursor-not-allowed' : ''
        } ${isLaserActive ? 'bg-red-600/20 border-red-400' : ''}`}
        onClick={handleLaserClick}
        disabled={energy < 6}
      >
        <div className="flex items-center text-xs">
          <Zap size={10} className="mr-1 sm:w-3 sm:h-3" />
          <span className="hidden sm:inline">Laser</span>
          <span className="sm:hidden">L</span>
          <span className="ml-1 border border-[#48CAE4]/40 px-1 rounded-sm text-xs">⎵</span>
        </div>
      </Button>
      <Button 
        size="sm"
        variant="outline"
        className="border border-[#48CAE4] bg-[#030637]/80 hover:bg-[#0077B6]/20 text-[#48CAE4] font-mono rounded-none px-2 sm:px-4 py-1 sm:py-2"
        onClick={handlePlayClick}
      >
        <span className="text-xs">Play</span>
      </Button>
    </div>
  );
};

export default PetControls;