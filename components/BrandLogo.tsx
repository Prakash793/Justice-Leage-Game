
import React from 'react';

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Shield Frame */}
      <path 
        d="M256 48L80 128V240C80 346 155 444 256 472C357 444 432 346 432 240V128L256 48Z" 
        fill="url(#shieldGrad)" 
        stroke="#3b82f6" 
        strokeWidth="8"
      />
      
      {/* Scales of Justice */}
      <g filter="url(#glow)">
        <path d="M256 120V260" stroke="url(#goldGrad)" strokeWidth="12" strokeLinecap="round"/>
        <path d="M180 180H332" stroke="url(#goldGrad)" strokeWidth="8" strokeLinecap="round"/>
        <path d="M180 180L160 240H200L180 180Z" fill="url(#goldGrad)" />
        <path d="M332 180L312 240H352L332 180Z" fill="url(#goldGrad)" />
        <circle cx="256" cy="120" r="10" fill="url(#goldGrad)" />
      </g>

      {/* Game Controller Base */}
      <rect x="190" y="280" width="132" height="70" rx="35" fill="url(#goldGrad)" />
      <circle cx="215" cy="315" r="25" fill="url(#goldGrad)" />
      <circle cx="297" cy="315" r="25" fill="url(#goldGrad)" />
      
      {/* Buttons */}
      <path d="M215 305V325M205 315H225" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="290" cy="305" r="4" fill="#0f172a" />
      <circle cx="305" cy="305" r="4" fill="#0f172a" />
      <circle cx="297" cy="320" r="4" fill="#0f172a" />
      
      {/* Banner */}
      <path d="M100 380H412L440 440H72L100 380Z" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="2" />
      <text 
        x="256" 
        y="415" 
        textAnchor="middle" 
        fill="white" 
        style={{ font: 'bold 36px Playfair Display, serif', letterSpacing: '2px' }}
      >
        JUSTICE
      </text>
      <text 
        x="256" 
        y="450" 
        textAnchor="middle" 
        fill="white" 
        style={{ font: 'bold 36px Playfair Display, serif', letterSpacing: '2px' }}
      >
        LEAGUE
      </text>
      <text 
        x="256" 
        y="475" 
        textAnchor="middle" 
        fill="#fbbf24" 
        style={{ font: '900 10px Inter, sans-serif', letterSpacing: '4px' }}
      >
        STUDENT EDITION
      </text>
    </svg>
  );
};
