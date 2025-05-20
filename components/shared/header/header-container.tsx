'use client';

import { useEffect, useState } from 'react';

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer = ({ children }: HeaderContainerProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`w-full bg-[#FFFBF8]/80 backdrop-blur-md fixed top-0 z-50 transition-all duration-300 ${
      scrolled ? 'border-b border-[#1D1D1F]/10 shadow-sm' : ''
    }`}>
      {children}
    </div>
  );
};

export default HeaderContainer; 