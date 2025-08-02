import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [isGlowing, setIsGlowing] = useState(false);

  // Listen for pet collision and leave events
  useEffect(() => {
    const handlePetCollision = (event: CustomEvent) => {
      const { text } = event.detail;
      if (text.toLowerCase().includes('hey human')) {
        setIsGlowing(true);
        setTimeout(() => setIsGlowing(false), 2000);
      }
    };

    const handlePetLeave = () => {
      setIsGlowing(false);
    };

    window.addEventListener('petCollision', handlePetCollision as EventListener);
    window.addEventListener('petLeaveCollision', handlePetLeave as EventListener);
    
    return () => {
      window.removeEventListener('petCollision', handlePetCollision as EventListener);
      window.removeEventListener('petLeaveCollision', handlePetLeave as EventListener);
    };
  }, []);

  return (
    <section id="hero-section" className="absolute inset-0 h-screen w-screen flex flex-col items-center justify-center">
      {/* Central art elements - 调整透明度让光晕更淡 */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-radial from-[#0077B6]/10 to-transparent"></div>
      <div className="absolute w-[600px] h-[600px] rounded-full border border-[#48CAE4]/10 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full border border-[#90E0EF]/15 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Geometric tech elements */}
      <div className="absolute top-[20%] left-[10%] w-[100px] h-[100px] border border-[#48CAE4]/30 rotate-45"></div>
      <div className="absolute bottom-[15%] right-[12%] w-[150px] h-[1px] bg-[#48CAE4]/40"></div>
      
      <div id="hero-content" className="container mx-auto px-6 text-center z-10 relative">
        <div className="mb-10 inline-block">
          <div className="px-4 py-2 bg-[#030637]/80 border border-[#48CAE4]/40 mb-4 inline-block font-fira">
            <span className="text-[#48CAE4] font-mono">&lt;coder&gt;</span>
          </div>
        </div>
        
        <div className="relative mb-8">
          <h1 
            style={{ fontFamily: '"Jura", sans-serif' }}
            className={`text-6xl md:text-7xl font-thin text-gradient tracking-widest cyberpunk-title relative transition-all duration-300 ${
              isGlowing ? 'title-bright-glow' : ''
            }`}
          >
            Hey Human
          </h1>
          {/* Glitch effect overlay */}
          <h1 
            style={{ fontFamily: '"Jura", sans-serif' }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 text-6xl md:text-7xl font-thin tracking-widest text-[#ff0040] opacity-20 cyberpunk-glitch"
            aria-hidden="true"
          >
            Hey Human
          </h1>
          <h1 
            style={{ fontFamily: '"Jura", sans-serif' }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 text-6xl md:text-7xl font-thin tracking-widest text-[#00ff88] opacity-20 cyberpunk-glitch-2"
            aria-hidden="true"
          >
            Hey Human
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;