import React from 'react';

export default function NestoraLogo({ size = 42, showText = true, subtitle = false, light = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      {/* Crisp High-Fidelity Vector Emblem */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 500 500" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(204,163,83,0.25))' }}
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cca353" />
            <stop offset="50%" stopColor="#e5c378" />
            <stop offset="100%" stopColor="#b38938" />
          </linearGradient>
          <linearGradient id="darkNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0b0f19" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>

        {/* Outer Golden Arc / Circle */}
        <path
          d="M 120 280 A 170 170 0 1 1 340 160"
          stroke="url(#goldGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />

        {/* High-Rise Skyscrapers on the right */}
        {/* Building 1 */}
        <path
          d="M 270 270 L 270 160 L 305 120 L 305 270 Z"
          fill="#0b0f19"
          stroke="url(#goldGrad)"
          strokeWidth="8"
        />
        {/* Building 2 */}
        <path
          d="M 310 270 L 310 145 L 340 170 L 340 270 Z"
          fill="#0b0f19"
          stroke="url(#goldGrad)"
          strokeWidth="8"
        />
        {/* Building Windows (Golden lines) */}
        <line x1="285" y1="180" x2="285" y2="250" stroke="url(#goldGrad)" strokeWidth="4" />
        <line x1="325" y1="190" x2="325" y2="250" stroke="url(#goldGrad)" strokeWidth="4" />

        {/* Stylized Giant "N" overlay */}
        <path
          d="M 190 140 L 190 280 L 225 280 L 225 210 L 275 280 L 300 280 L 245 190 L 300 140 L 270 140 L 225 210 L 225 140 Z"
          fill="#0f172a"
          stroke="url(#goldGrad)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Residential House with Roof & Window */}
        <path
          d="M 160 300 L 235 210 L 310 300 L 290 300 L 235 235 L 180 300 Z"
          fill="url(#goldGrad)"
        />
        {/* House base */}
        <path
          d="M 185 295 L 235 235 L 285 295 Z"
          fill="#0b0f19"
          stroke="url(#goldGrad)"
          strokeWidth="4"
        />
        {/* 4-Pane Window */}
        <rect x="220" y="260" width="12" height="12" fill="url(#goldGrad)" rx="2" />
        <rect x="238" y="260" width="12" height="12" fill="url(#goldGrad)" rx="2" />
        <rect x="220" y="278" width="12" height="12" fill="url(#goldGrad)" rx="2" />
        <rect x="238" y="278" width="12" height="12" fill="url(#goldGrad)" rx="2" />

        {/* Green Tree on Landscape */}
        <line x1="365" y1="280" x2="365" y2="245" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M 365 205 C 345 230 350 255 365 255 C 380 255 385 230 365 205 Z"
          fill="url(#greenGrad)"
        />
        <line x1="365" y1="215" x2="365" y2="250" stroke="#ffffff" strokeWidth="2" opacity="0.6" />

        {/* Curved Green Hill & Dark River Waves */}
        <path
          d="M 110 320 C 180 280 280 290 395 300 C 370 320 280 310 110 320 Z"
          fill="url(#greenGrad)"
        />
        <path
          d="M 90 330 C 190 290 300 300 410 315 C 360 345 240 330 90 330 Z"
          fill="#0f172a"
          stroke="url(#goldGrad)"
          strokeWidth="3"
        />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: size >= 40 ? '1.45rem' : '1.2rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            fontFamily: 'var(--font-accent)',
            color: '#ffffff',
            lineHeight: 1.1
          }}>
            Nestora
          </span>
          {subtitle && (
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}>
              Smart Real Estate Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}
