'use client'

import React, { useState, useEffect } from 'react';
import Button from './Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-stone-900 tracking-tight">Let me find it</span>
            <span className="text-xs text-stone-500">by Franchizor</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-stone-600 hover:text-indigo-600 text-sm font-medium transition-colors">Features</a>
          <a href="#how-it-works" className="text-stone-600 hover:text-indigo-600 text-sm font-medium transition-colors">How It Works</a>
          <a href="#pricing" className="text-stone-600 hover:text-indigo-600 text-sm font-medium transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="#" className="hidden sm:block text-stone-600 hover:text-indigo-600 text-sm font-medium transition-colors">
            Log in
          </a>
          <Button variant="primary" className="!px-5 !py-2 text-sm">
            Start Free
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;