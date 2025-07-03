import React from 'react';
import { Button } from '@/components/ui/button';

interface PetVisibilityToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

const PetVisibilityToggle: React.FC<PetVisibilityToggleProps> = ({ 
  isVisible, 
  onToggle 
}) => {
  return (
    <Button
      variant="outline"
      className="fixed bottom-4 right-4 z-50 border border-[#48CAE4] bg-[#030637]/80 hover:bg-[#0077B6]/20 text-[#48CAE4] font-mono rounded-none"
      onClick={onToggle}
    >
      {isVisible ? "Hide Pet" : "Show Pet"}
    </Button>
  );
};

export default PetVisibilityToggle;
