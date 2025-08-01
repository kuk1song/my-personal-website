import React from 'react';
import { Code } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About Me', href: '#about' },
    { label: 'Products', href: '#products' }
  ];

  return (
    <nav 
      id="main-nav" 
      className="fixed top-0 w-full z-50 transition-all duration-500 bg-transparent"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Code className="w-5 h-5 text-[#48CAE4] mr-2" />
            <div className="text-2xl font-bold text-gradient font-fira">
              Song
            </div>
          </div>
          
          <div className="hidden md:flex space-x-10">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white opacity-80 hover:opacity-100 hover:text-[#48CAE4] transition-all duration-300 relative group font-mono"
              >
                <span className="text-[#48CAE4] opacity-70 mr-1">{`0${index+1}.`}</span>
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#48CAE4] group-hover:w-full transition-all duration-500"></span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
