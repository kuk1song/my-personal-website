import React from 'react';

interface LaserBeam {
  startY: number;
  endY: number;
  x: number;
}

interface LaserBeamProps {
  laserBeam: LaserBeam | null;
}

const LaserBeam: React.FC<LaserBeamProps> = ({ laserBeam }) => {
  if (!laserBeam) return null;

  return (
    <div
      className="fixed pointer-events-none z-45"
      style={{
        left: `${laserBeam.x}px`,
        top: `${laserBeam.startY}px`,
        width: '4px',
        height: `${laserBeam.endY - laserBeam.startY}px`,
        transform: 'translateX(-50%)',
        background: 'linear-gradient(to bottom, #ff0040, #ff4060, #ff6080)',
        boxShadow: `
          0 0 10px #ff0040,
          0 0 20px #ff0040,
          0 0 30px #ff0040,
          0 0 40px #ff0040
        `,
        animation: 'pulse 0.2s infinite'
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #ffffff, #ff0040)',
          width: '2px',
          left: '1px',
          boxShadow: `
            0 0 5px #ffffff,
            0 0 10px #ffffff
          `
        }}
      />
    </div>
  );
};

export default LaserBeam;