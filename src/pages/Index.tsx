/**
 * Personal Portfolio Website
 * Copyright (c) 2025 Haokun Song
 * Licensed under MIT License
 * 
 * Original design and implementation by Haokun Song
 * https://kuk1song.com
 * https://github.com/kuk1song/my-personal-website
 */

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProductsSection from '@/components/ProductsSection';
import DigitalPet from '@/components/DigitalPet';
import InterstellarJourney from '@/components/InterstellarJourney';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const mainRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress for the interstellar journey
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Check if we're on mobile for performance optimizations
      const isMobile = window.innerWidth <= 768;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          scrub: 1,
          start: 'top top',
          end: 'bottom bottom',
        }
      });

      // Animate Nav Bar background
      tl.to('#main-nav', { 
        backgroundColor: 'rgba(3, 6, 55, 0.8)',
        backdropFilter: 'blur(12px)',
        ease: 'power2.inOut' 
      }, 0); // Start at the very beginning of the timeline

      // 1. Animate Hero Section OUT (Zoom Through) - "Departing Home Planet" - MUCH EARLIER START
      tl.to('#hero-content', { 
        transform: isMobile ? 'scale3d(1.3, 1.3, 1) translateZ(0)' : 'scale3d(2, 2, 1) translateZ(0)', // GPU acceleration
        opacity: 0, 
        ease: 'power2.inOut',
        duration: 0.8 // Even shorter duration for quicker animation
      }, 0.05); // Start much earlier - almost immediately when scrolling begins

      // 2. Animate About Section IN (From a 'Planet') - "Approaching Data Planet"
      tl.fromTo('#about-section', 
        { scale: 0.1, opacity: 0, borderRadius: '50%' },
        { scale: 1, opacity: 1, borderRadius: '0%', ease: 'power2.out', duration: 1.5 },
         "+=0.45"
      );

      // 3. Animate About Section OUT (Zoom Through) - "Leaving Data Planet"
      tl.to('#about-section', { 
        transform: isMobile ? 'scale3d(1.2, 1.2, 1) translateZ(0)' : 'scale3d(1.5, 1.5, 1) translateZ(0)', // GPU acceleration
        opacity: 0, 
        ease: 'power2.inOut' 
      });

      // 4. Animate Products Section IN (From a 'Planet') - "Approaching Tech Planet" - WITH PAUSE
      tl.fromTo('#products-section', 
        { scale: 0.1, opacity: 0, borderRadius: '50%' },
        { 
          scale: 1, 
          opacity: 1, 
          borderRadius: '0%', 
          ease: 'power2.out', 
          duration: 1.5,
          // Add GPU acceleration for the Products section animation
          force3D: true
        },
        "+=1.15" // 🎯 KEY PARAMETER: Wait 1.15 seconds after About Me disappears
      );

      // 5. OPTIONAL: Products Section OUT - Clean exit to prevent lingering effects
      tl.to('#products-section', {
        // Keep it visible but ensure all animations are complete
        opacity: 1,
        duration: 0.1
      }, "+=0.5");

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <InterstellarJourney scrollProgress={scrollProgress}>
      <div className="relative">
        <Navigation />
        
        <div style={{ height: '600vh' }} ref={mainRef}>
          <div className="sticky top-0 h-screen overflow-hidden">
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
        
        <DigitalPet />
      </div>
    </InterstellarJourney>
  );
};

export default Index;
