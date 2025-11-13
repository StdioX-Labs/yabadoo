'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BuyMeCoffeeButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/coffee"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-40 group"
    >
      {/* Glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#708238] to-[#3F704D] rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
      
      {/* Main button */}
      <div className="relative flex items-center gap-3 bg-gradient-to-r from-[#708238] to-[#3F704D] hover:from-[#3F704D] hover:to-[#708238] text-[#F0FFF0] px-5 py-3.5 rounded-full shadow-2xl shadow-[#708238]/40 transition-all transform hover:scale-105 active:scale-95">
        {/* Coffee icon */}
        <div className="relative">
          <svg 
            className={`w-6 h-6 transition-transform ${isHovered ? 'rotate-12' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M2 21h18v-2H2v2zM20 8h-2V5h2c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2zm-2 10H4V5h14v13zm-9-9h6v6h-6V9z"/>
          </svg>
          {/* Steam effect */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="w-1 h-3 bg-[#F0FFF0] rounded-full opacity-60 animate-float"></div>
          </div>
        </div>

        {/* Text */}
        <div className="hidden sm:block">
          <div className="text-sm font-bold leading-tight">Buy Yaba</div>
          <div className="text-xs opacity-90 leading-tight">A Coffee</div>
        </div>

        {/* Mobile text */}
        <span className="sm:hidden text-sm font-bold">Coffee</span>
      </div>
    </Link>
  );
}
