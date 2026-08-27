import React from "react";

interface DomenLogoProps {
  className?: string;
  size?: number;
}

export function DomenLogo({ className = "", size = 32 }: DomenLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
    >
      <defs>
        {/* Main Brand Gradient */}
        <linearGradient id="domenGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Ambient Glow */}
        <linearGradient id="dotGrad" x1="24" y1="18" x2="34" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Shadow Filter */}
        <filter id="domenShadow" x="0" y="2" width="48" height="46" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2563EB" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Rounded squircle background */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill="url(#domenGrad)"
        filter="url(#domenShadow)"
      />

      {/* Stylized Modern "D" Monogram + Orbiting Dot */}
      {/* Outer D Arc */}
      <path
        d="M16 13C16 12.4477 16.4477 12 17 12H26C32.6274 12 38 17.3726 38 24C38 30.6274 32.6274 36 26 36H17C16.4477 36 16 35.5523 16 35V13Z"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Keyhole / Portal Spine */}
      <path
        d="M23 18V30"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* The Central Glowing "Dot" (Symbolizing .com / Domain) */}
      <circle
        cx="30"
        cy="24"
        r="3.5"
        fill="url(#dotGrad)"
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}
