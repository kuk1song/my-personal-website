/**
 * Personal Portfolio Website
 * Copyright (c) 2025 Haokun Song
 * Licensed under MIT License
 * 
 * Original design and implementation by Haokun Song
 * https://kuk1song.com
 * https://github.com/kuk1song/my-personal-website
 */

import React from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProductsSection from '@/components/ProductsSection';
import DigitalPet from '@/components/DigitalPet';

const Index = () => {
  return (
    <div className="min-h-screen tech-gradient relative overflow-x-hidden">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
      </main>

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
