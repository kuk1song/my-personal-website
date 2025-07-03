import React, { useEffect, useState } from 'react';

interface EnergyParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  progress: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  trail: { x: number; y: number }[];
}

interface EnergyAbsorptionEffectProps {
  x: number;
  y: number;
  isActive: boolean;
}

const EnergyAbsorptionEffect: React.FC<EnergyAbsorptionEffectProps> = ({ x, y, isActive }) => {
  const [particles, setParticles] = useState<EnergyParticle[]>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const createParticle = () => {
      // Create particles around the bot in a larger circle for more dramatic effect
      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 80; // Start from distance 120-200px
      const startX = x + Math.cos(angle) * distance;
      const startY = y + Math.sin(angle) * distance;
      
      const particle: EnergyParticle = {
        id: Math.random(),
        x: startX,
        y: startY,
        targetX: x,
        targetY: y,
        size: Math.random() * 5 + 3, // Larger particles
        color: ['#48CAE4', '#0077B6', '#00B4D8', '#90E0EF', '#61DAFB', '#00CED1'][Math.floor(Math.random() * 6)],
        progress: 0,
        speed: 0.015 + Math.random() * 0.025, // Slightly slower for more dramatic effect
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        trail: []
      };
      return particle;
    };

    // Create particles more frequently for denser effect
    const interval = setInterval(() => {
      setParticles(prev => [...prev, createParticle()]);
    }, 100);

    return () => clearInterval(interval);
  }, [x, y, isActive]);

  useEffect(() => {
    const animationFrame = setInterval(() => {
      setParticles(prev => 
        prev
          .map(particle => {
            const newProgress = particle.progress + particle.speed;
            
            // Enhanced easing with spiral effect
            const easeProgress = 1 - Math.pow(1 - newProgress, 2);
            const spiralAngle = newProgress * Math.PI * 4; // Multiple rotations
            const spiralRadius = (1 - easeProgress) * 20; // Spiral inward
            
            const baseX = particle.x + (particle.targetX - particle.x) * easeProgress;
            const baseY = particle.y + (particle.targetY - particle.y) * easeProgress;
            
            const currentX = baseX + Math.cos(spiralAngle) * spiralRadius;
            const currentY = baseY + Math.sin(spiralAngle) * spiralRadius;
            
            // Update trail
            const newTrail = [{ x: currentX, y: currentY }, ...particle.trail.slice(0, 4)];
            
            return {
              ...particle,
              x: currentX,
              y: currentY,
              progress: newProgress,
              rotation: particle.rotation + particle.rotationSpeed,
              trail: newTrail
            };
          })
          .filter(particle => particle.progress < 1)
      );
    }, 16);

    return () => clearInterval(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Central energy core effect */}
      {isActive && (
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            left: x,
            top: y,
            width: '60px',
            height: '60px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(72, 202, 228, 0.3) 0%, rgba(0, 119, 182, 0.1) 50%, transparent 100%)',
            boxShadow: `
              0 0 40px rgba(72, 202, 228, 0.6),
              0 0 80px rgba(72, 202, 228, 0.4),
              0 0 120px rgba(72, 202, 228, 0.2)
            `,
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      )}
      
      {particles.map(particle => (
        <React.Fragment key={particle.id}>
          {/* Particle trails */}
          {particle.trail.map((trailPoint, index) => (
            <div
              key={`${particle.id}-trail-${index}`}
              className="absolute rounded-full"
              style={{
                left: trailPoint.x,
                top: trailPoint.y,
                width: particle.size * (1 - index * 0.2),
                height: particle.size * (1 - index * 0.2),
                backgroundColor: particle.color,
                opacity: (1 - particle.progress) * (1 - index * 0.3),
                transform: 'translate(-50%, -50%)',
                filter: `blur(${index}px)`
              }}
            />
          ))}
          
          {/* Main particle */}
          <div
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: 1 - particle.progress * 0.3, // Less fade for more visibility
              transform: `translate(-50%, -50%) rotate(${particle.rotation}rad)`,
              boxShadow: `
                0 0 ${particle.size * 4}px ${particle.color},
                0 0 ${particle.size * 8}px ${particle.color}40,
                inset 0 0 ${particle.size}px rgba(255, 255, 255, 0.3)
              `,
              filter: `blur(${particle.progress * 0.5}px)`,
              animation: particle.progress > 0.8 ? 'pulse 0.3s infinite' : 'none'
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, ${particle.color} 30%, transparent 70%)`,
                animation: 'pulse 1s ease-in-out infinite'
              }}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default EnergyAbsorptionEffect;