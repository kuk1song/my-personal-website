import React, { useEffect, useState } from 'react';

interface TextParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  char: string;
  size: number;
}

interface TextParticleEffectProps {
  text: string;
  x: number;
  y: number;
  isActive: boolean;
  onComplete?: () => void;
}

const TextParticleEffect: React.FC<TextParticleEffectProps> = ({ 
  text, 
  x, 
  y, 
  isActive, 
  onComplete 
}) => {
  const [particles, setParticles] = useState<TextParticle[]>([]);

  // 根据被撞击的文字元素计算字体大小和效果强度
  const getTextSizeAndIntensity = () => {
    // 查找当前被撞击的文字元素来获取实际字体大小
    const elements = document.querySelectorAll('h1, h2, h3, p, span, button');
    let fontSize = 16; // 默认字体大小
    
    elements.forEach(element => {
      if (element.textContent?.includes(text.substring(0, 10))) {
        const computedStyle = window.getComputedStyle(element);
        const elementFontSize = parseFloat(computedStyle.fontSize);
        if (elementFontSize > fontSize) {
          fontSize = elementFontSize;
        }
      }
    });

    // 根据字体大小计算效果强度
    const baseSize = 16;
    const sizeRatio = fontSize / baseSize;
    
    return {
      fontSize,
      sizeRatio,
      // 粒子大小：基础12px + 根据字体大小的比例调整
      particleSize: Math.max(12, 12 + (sizeRatio - 1) * 8),
      // 速度强度：字体越大，粒子飞得越远越快
      velocityMultiplier: Math.max(1, sizeRatio * 0.8),
      // 粒子数量：大字体产生更多粒子
      particleCount: Math.min(text.length, Math.max(8, Math.floor(text.length * sizeRatio * 0.5))),
      // 生命周期：大字体的粒子存在时间更长
      lifespan: Math.max(120, 120 + (sizeRatio - 1) * 60),
      // 字符间距：大字体的粒子间距更大
      charSpacing: Math.max(12, 12 * sizeRatio * 0.6)
    };
  };

  useEffect(() => {
    if (!isActive) return;

    const { 
      particleSize, 
      velocityMultiplier, 
      particleCount, 
      lifespan, 
      charSpacing 
    } = getTextSizeAndIntensity();

    // Create particles from text characters
    const newParticles: TextParticle[] = [];
    const chars = text.split('').slice(0, particleCount); // 限制粒子数量
    
    chars.forEach((char, index) => {
      if (char.trim()) { // Skip spaces
        const particle: TextParticle = {
          id: index,
          x: x + (index * charSpacing), // 使用动态字符间距
          y: y,
          vx: (Math.random() - 0.5) * 8 * velocityMultiplier, // 动态速度
          vy: -Math.random() * 6 * velocityMultiplier - 2, // 动态垂直速度
          life: lifespan, // 动态生命周期
          maxLife: lifespan,
          char,
          size: particleSize // 动态粒子大小
        };
        newParticles.push(particle);
      }
    });

    setParticles(newParticles);

    // Auto-complete after animation - 根据效果强度调整时间
    const timeout = setTimeout(() => {
      onComplete?.();
    }, Math.max(2000, lifespan * 20));

    return () => clearTimeout(timeout);
  }, [isActive, text, x, y, onComplete]);

  useEffect(() => {
    if (particles.length === 0) return;

    const animationFrame = setInterval(() => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vy: particle.vy + 0.15, // gravity
            vx: particle.vx * 0.99 // air resistance
          }))
          .filter(particle => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(animationFrame);
  }, [particles.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-45">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute font-mono font-bold text-[#48CAE4]"
          style={{
            left: particle.x,
            top: particle.y,
            fontSize: particle.size,
            opacity: particle.life / particle.maxLife,
            transform: 'translate(-50%, -50%)',
            textShadow: `0 0 ${particle.size * 0.5}px rgba(72, 202, 228, 0.7)`, // 动态阴影
            filter: `blur(${(1 - particle.life / particle.maxLife) * 2}px)`
          }}
        >
          {particle.char}
        </div>
      ))}
    </div>
  );
};

export default TextParticleEffect;