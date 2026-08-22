import React from 'react';

export default function NestoraLogo({ size = 44, showText = true, subtitle = false, light = false }) {
  const iconSize = size;
  
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: size > 40 ? '12px' : '9px', 
      textDecoration: 'none',
      userSelect: 'none'
    }}>
      {/* 🌟 Ultra-Vibrant Masterpiece Emblem */}
      <div style={{
        position: 'relative',
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        borderRadius: `${iconSize * 0.28}px`,
        background: 'radial-gradient(circle at 30% 20%, rgba(30, 41, 59, 0.9), rgba(11, 15, 25, 0.95))',
        border: '1.5px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 4px 20px -2px rgba(245, 158, 11, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Royal Gold Gradient */}
            <linearGradient id="nestoraGold" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Glowing Emerald Green Gradient */}
            <linearGradient id="nestoraEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="45%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Deep Slate / Midnight Blue Gradient */}
            <linearGradient id="nestoraSlate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Luxury Cyan Accent Gradient */}
            <linearGradient id="nestoraCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Drop shadow filter */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Ambient Glow */}
          <circle cx="100" cy="100" r="70" fill="url(#nestoraGold)" opacity="0.08" />

          {/* 🌟 1. Outer Golden Arc (Halo of Trust & Luxury) */}
          <path
            d="M 45 130 A 65 65 0 1 1 155 70"
            stroke="url(#nestoraGold)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            filter="url(#goldGlow)"
          />

          {/* 🌟 2. Modern Architectural Towers (Skyscrapers) */}
          {/* Back Tower */}
          <path
            d="M 115 130 L 115 65 L 138 45 L 138 130 Z"
            fill="url(#nestoraSlate)"
            stroke="url(#nestoraGold)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Back Tower Window Bars */}
          <line x1="126" y1="72" x2="126" y2="120" stroke="url(#nestoraGold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

          {/* Middle Tower */}
          <path
            d="M 136 130 L 136 78 L 154 62 L 154 130 Z"
            fill="url(#nestoraSlate)"
            stroke="url(#nestoraGold)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Middle Tower Window Bars */}
          <line x1="145" y1="84" x2="145" y2="120" stroke="url(#nestoraGold)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

          {/* 🌟 3. Iconic Stylized 'N' Structure (The Nestora Pillar) */}
          <path
            d="M 68 62 L 68 130 L 86 130 L 86 94 L 112 130 L 126 130 L 98 88 L 126 62 L 108 62 L 86 94 L 86 62 Z"
            fill="url(#nestoraSlate)"
            stroke="url(#nestoraGold)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* 🌟 4. Cozy Home Roof & Centerpiece with Lighted Window */}
          {/* Roof Ridge */}
          <path
            d="M 60 134 L 100 86 L 140 134 L 126 134 L 100 102 L 74 134 Z"
            fill="url(#nestoraGold)"
            filter="url(#goldGlow)"
          />
          {/* House Gable */}
          <path
            d="M 76 132 L 100 102 L 124 132 Z"
            fill="#0b0f19"
            stroke="url(#nestoraGold)"
            strokeWidth="2.5"
          />
          {/* Glowing Golden Windows */}
          <rect x="92" y="112" width="6.5" height="6.5" fill="#fef08a" rx="1.5" />
          <rect x="101.5" y="112" width="6.5" height="6.5" fill="#fef08a" rx="1.5" />
          <rect x="92" y="120.5" width="6.5" height="6.5" fill="#fef08a" rx="1.5" />
          <rect x="101.5" y="120.5" width="6.5" height="6.5" fill="#fef08a" rx="1.5" />

          {/* 🌟 5. Eco-Friendly Nature & Greenery (Sustainability & Smart Living) */}
          {/* Tree Trunk */}
          <line x1="165" y1="135" x2="165" y2="114" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          {/* Lush Green Foliage */}
          <path
            d="M 165 92 C 152 108 155 124 165 124 C 175 124 178 108 165 92 Z"
            fill="url(#nestoraEmerald)"
          />
          <path
            d="M 165 96 L 165 120"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* 🌟 6. Rolling Emerald Hills & Golden Foundation Horizon */}
          {/* Green Landscape Hill */}
          <path
            d="M 38 144 C 75 128 125 132 172 138 C 160 148 110 144 38 144 Z"
            fill="url(#nestoraEmerald)"
          />
          {/* Golden River Base Wave */}
          <path
            d="M 28 150 C 80 134 135 138 180 146 C 150 160 90 154 28 150 Z"
            fill="url(#nestoraSlate)"
            stroke="url(#nestoraGold)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* 🌟 Rich Typography & Branding */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: size >= 42 ? '1.5rem' : '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              fontFamily: 'var(--font-accent)',
              background: 'linear-gradient(135deg, #ffffff 30%, #fbbf24 85%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
            }}>
              Nestora
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontSize: '0.58rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '6px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.35)'
            }}>
              PRO
            </span>
          </div>
          
          {subtitle && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--primary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginTop: '3px',
              opacity: 0.95
            }}>
              Smart Real Estate Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}
