import React from 'react';

export default function NestoraLogo({ 
  size = 40, 
  showText = true, 
  subtitle = false, 
  stacked = false,
  full = false 
}) {
  // If full or stacked is requested (like on Login Screen), display the full original logo image directly
  if (full || stacked) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        userSelect: 'none'
      }}>
        <img 
          src="/logo.png" 
          alt="Nestora - Smart Real Estate Management Platform" 
          style={{ 
            height: `${size >= 60 ? size * 2.1 : size * 1.8}px`,
            maxWidth: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 12px rgba(12, 35, 64, 0.08))'
          }} 
        />
      </div>
    );
  }

  // Header / Navbar Compact Horizontal Display: Perfect Emblem Icon + Crisp Brand Typography
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '10px', 
      textDecoration: 'none',
      userSelect: 'none'
    }}>
      {/* Precision Emblem Container */}
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: '#ffffff',
        border: '1px solid rgba(197, 155, 39, 0.25)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        flexShrink: 0
      }}>
        <img 
          src="/logo.png" 
          alt="Nestora Emblem" 
          style={{ 
            width: `${size * 1.28}px`,
            marginTop: `${size * -0.06}px`,
            objectFit: 'contain'
          }} 
        />
      </div>

      {showText && (
        <span style={{
          fontSize: size >= 40 ? '1.4rem' : '1.2rem',
          fontWeight: 900,
          fontFamily: 'var(--font-accent)',
          color: '#0c2340',
          letterSpacing: '-0.5px'
        }}>
          Nestora
        </span>
      )}
    </div>
  );
}
