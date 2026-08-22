import React from 'react';

export default function NestoraLogo({ size = 44, showText = true, subtitle = false, light = false, stacked = false }) {
  const iconSize = size;
  
  return (
    <div style={{ 
      display: 'inline-flex', 
      flexDirection: stacked ? 'column' : 'row',
      alignItems: 'center', 
      gap: stacked ? '14px' : (size > 40 ? '12px' : '9px'), 
      textDecoration: 'none',
      userSelect: 'none'
    }}>
      {/* 🏛️ Exact Brand Logo Emblem */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 500 450" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 4px 12px rgba(197, 155, 39, 0.25))' }}
      >
        <defs>
          {/* Architectural Warm Gold Gradient */}
          <linearGradient id="brandGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dfb75c" />
            <stop offset="50%" stopColor="#c59b27" />
            <stop offset="100%" stopColor="#9a7415" />
          </linearGradient>

          {/* Deep Regal Brand Navy */}
          <linearGradient id="brandNavy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#162c4e" />
            <stop offset="100%" stopColor="#0a192f" />
          </linearGradient>

          {/* Nature Forest Green */}
          <linearGradient id="brandGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#558d5d" />
            <stop offset="50%" stopColor="#43734a" />
            <stop offset="100%" stopColor="#2c5332" />
          </linearGradient>
        </defs>

        {/* 🌟 1. Sweeping Golden Arc (Top Left to Center) */}
        <path
          d="M 160 260 C 110 200 120 90 235 55 C 330 25 390 100 395 150 C 375 110 325 50 235 70 C 145 90 135 190 175 250 Z"
          fill="url(#brandGold)"
        />

        {/* 🌟 2. Gold Skyscraper Outlines (Right side) */}
        {/* Tall Tower Back */}
        <path
          d="M 280 260 L 280 105 L 315 75 L 315 260 Z"
          fill="#070d18"
          stroke="url(#brandGold)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <line x1="298" y1="105" x2="298" y2="250" stroke="url(#brandGold)" strokeWidth="3" strokeLinecap="round" />

        {/* Medium Tower Front */}
        <path
          d="M 320 260 L 320 125 L 350 150 L 350 260 Z"
          fill="#070d18"
          stroke="url(#brandGold)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <line x1="335" y1="150" x2="335" y2="250" stroke="url(#brandGold)" strokeWidth="3" strokeLinecap="round" />

        {/* Small Tower Right */}
        <path
          d="M 353 260 L 353 170 L 368 185 L 368 260 Z"
          fill="#070d18"
          stroke="url(#brandGold)"
          strokeWidth="5"
        />

        {/* 🌟 3. The Iconic Swooping Dark Navy 'N' */}
        <path
          d="M 155 115 C 190 120 205 160 205 260 L 195 260 C 195 160 180 135 155 115 Z"
          fill="#0a192f"
        />
        <path
          d="M 155 115 C 180 125 195 160 195 260 L 225 260 L 225 210 L 280 260 L 315 260 L 315 100 L 285 100 L 285 195 L 230 145 C 210 125 185 115 155 115 Z"
          fill="url(#brandNavy)"
          stroke="#070d18"
          strokeWidth="3"
        />

        {/* 🌟 4. Residential House with Gable Roof & 4-Pane Window */}
        {/* House Golden Roof Trim */}
        <path
          d="M 160 270 L 225 198 L 290 270 L 275 270 L 225 215 L 175 270 Z"
          fill="url(#brandGold)"
        />
        {/* House Wall & Gables */}
        <path
          d="M 178 268 L 225 216 L 272 268 Z"
          fill="#ffffff"
        />
        {/* 4 Square Window Panes in Dark Navy */}
        <rect x="212" y="240" width="10" height="10" fill="#0a192f" rx="1.5" />
        <rect x="226" y="240" width="10" height="10" fill="#0a192f" rx="1.5" />
        <rect x="212" y="253" width="10" height="10" fill="#0a192f" rx="1.5" />
        <rect x="226" y="253" width="10" height="10" fill="#0a192f" rx="1.5" />

        {/* 🌟 5. Nature Tree (Right of House) */}
        <path
          d="M 370 248 L 370 220"
          stroke="#2c5332"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Tree Leaf Crown */}
        <path
          d="M 370 190 C 350 215 352 238 370 238 C 388 238 390 215 370 190 Z"
          fill="url(#brandGreen)"
        />
        <line x1="370" y1="198" x2="370" y2="234" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* 🌟 6. Rolling Green Hills & Navy Waves */}
        {/* Top Green Rolling Hill with White Contour Streaks */}
        <path
          d="M 240 280 C 300 245 350 255 405 265 C 380 285 300 285 240 280 Z"
          fill="url(#brandGreen)"
        />
        <path
          d="M 270 273 C 310 260 340 262 380 270"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Bottom Swirling Navy Wave Base */}
        <path
          d="M 105 285 C 160 260 250 275 395 280 C 405 292 370 305 290 305 C 190 305 130 300 105 285 Z"
          fill="url(#brandNavy)"
        />
        {/* Golden Wave Accent Line */}
        <path
          d="M 125 288 C 175 272 260 282 370 288"
          stroke="url(#brandGold)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* 🌟 Official Typography */}
      {showText && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: stacked ? 'center' : 'flex-start',
          textAlign: stacked ? 'center' : 'left'
        }}>
          <span style={{
            fontSize: size >= 60 ? '2.4rem' : (size >= 40 ? '1.5rem' : '1.2rem'),
            fontWeight: 900,
            letterSpacing: '-0.5px',
            fontFamily: 'var(--font-accent)',
            color: '#ffffff',
            lineHeight: 1.1,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}>
            Nestora
          </span>
          
          {subtitle && (
            <span style={{
              fontSize: size >= 60 ? '0.95rem' : '0.72rem',
              fontWeight: 700,
              color: 'var(--primary-light)',
              letterSpacing: '0.04em',
              marginTop: '4px'
            }}>
              Smart Real Estate Management Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}
