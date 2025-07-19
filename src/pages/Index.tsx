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

      // Animate Hero Section
      tl.to('#hero-content', { scale: 2, opacity: 0, ease: 'power2.inOut' });

      // Animate About Section in
      tl.to('#about-section', { opacity: 1, scale: 1, ease: 'power2.inOut' }, '-=0.5');
      // Animate About Section out
      tl.to('#about-section', { scale: 2, opacity: 0, ease: 'power2.inOut' });

      // Animate Products Section in
      tl.to('#products-section', { opacity: 1, scale: 1, ease: 'power2.inOut' }, '-=0.5');

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="tech-gradient relative">
      <ParticleBackground />
      <Navigation />
      
      {/* 
        This new structure is key. 
        The outer div creates the scrollable area.
        The inner div holds all sections, stacked on top of each other.
      */}
      <div style={{ height: '300vh' }} ref={mainRef}> {/* This creates the scrollable space */}
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
