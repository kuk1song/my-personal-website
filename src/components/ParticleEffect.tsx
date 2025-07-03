import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface ParticleEffectProps {
  x: number;
  y: number;
  isActive: boolean;
  type?: 'trail' | 'explosion';
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ x, y, isActive, type = 'trail' }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const createParticle = () => {
      const particle: Particle = {
        id: Math.random(),
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: type === 'explosion' ? 60 : 30,
        maxLife: type === 'explosion' ? 60 : 30,
        size: Math.random() * 4 + 2,
        color: type === 'explosion' ? '#ff6b6b' : '#48CAE4'
      };
      return particle;
    };

    const interval = setInterval(() => {
      if (type === 'trail') {
        setParticles(prev => [...prev, createParticle()]);
      } else if (type === 'explosion') {
        // Create burst of particles for explosion
        const newParticles = Array.from({ length: 8 }, () => createParticle());
        setParticles(prev => [...prev, ...newParticles]);
      }
    }, type === 'explosion' ? 100 : 50);

    return () => clearInterval(interval);
  }, [x, y, isActive, type]);

  useEffect(() => {
    const animationFrame = setInterval(() => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vy: particle.vy + 0.1 // gravity
          }))
          .filter(particle => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;