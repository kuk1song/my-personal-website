import React from 'react';

interface PetInfoPanelProps {
  isVisible: boolean;
}

const PetInfoPanel: React.FC<PetInfoPanelProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-12 sm:top-20 right-1 sm:right-4 z-50 bg-[#030637]/80 border border-[#48CAE4]/40 px-2 sm:px-3 py-1 sm:py-2 text-xs font-mono text-[#48CAE4] rounded-none max-w-[200px] sm:max-w-none">
      <p className="hidden sm:block">Minibot Controls:</p>
      <p className="sm:hidden text-xs">Controls:</p>
      <p className="text-xs sm:text-xs">↑ ↓ ← → Arrow keys or drag with mouse</p>
    </div>
  );
};

export default PetInfoPanel;
