/**
 * Personal Portfolio Website
 * Copyright (c) 2025 Haokun Song
 * Licensed under MIT License
 * 
 * Original design and implementation by Haokun Song
 * https://kuk1song.com
 * https://github.com/kuk1song/my-personal-website
 */

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleBackground from '@/components/ParticleBackground';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProductsSection from '@/components/ProductsSection';
import DigitalPet from '@/components/DigitalPet';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          scrub: 1,
          start: 'top top',
          end: 'bottom bottom',
        }
      });

      // 1. Animate Hero Section OUT (Zoom Through)
      tl.to('#hero-content', { 
        scale: 2, 
        opacity: 0, 
        ease: 'power2.inOut' 
      });

      // 2. Animate About Section IN (From a 'Planet')
      tl.fromTo('#about-section', 
        { scale: 0.1, opacity: 0, borderRadius: '50%', filter: 'blur(20px)' }, // FROM: A small, blurry, circular shape
        { scale: 1, opacity: 1, borderRadius: '0%', filter: 'blur(0px)', ease: 'power2.out', duration: 1.5 } // TO: The final, clear section
      );

      // 3. Animate About Section OUT (Zoom Through)
      tl.to('#about-section', { 
        scale: 2, 
        opacity: 0, 
        ease: 'power2.inOut' 
      });

      // 4. Animate Products Section IN (From a 'Planet')
      tl.fromTo('#products-section', 
        { scale: 0.1, opacity: 0, borderRadius: '50%', filter: 'blur(20px)' }, // FROM: A small, blurry, circular shape
        { scale: 1, opacity: 1, borderRadius: '0%', filter: 'blur(0px)', ease: 'power2.out', duration: 1.5 } // TO: The final, clear section
      );

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="tech-gradient relative">
      <ParticleBackground />
      <Navigation />
      
      {/* 
        By increasing the height here, we give the timeline more scroll distance to play out.
        This makes each section's animation feel longer and more deliberate.
      */}
      <div style={{ height: '600vh' }} ref={mainRef}> {/* This creates the scrollable space */}
        <div className="sticky top-0 h-screen overflow-hidden"> {/* Added overflow-hidden here */}
          <HeroSection />
          <AboutSection />
          <ProductsSection />
        </div>
      </div>


      <footer className="relative z-10 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm font-mono tracking-widest">
            © 2025 Haokun Song
          </p>
        </div>
      </footer>
      
      {/* Add the digital pet component */}
      <DigitalPet />
    </div>
  );
};

export default Index;
