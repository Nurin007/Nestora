import React from 'react';

export default function NestoraLogo({ 
  size = 42, 
  showText = false, 
  subtitle = false, 
  stacked = false,
  full = false 
}) {
  // If full or stacked is requested (like on Login Screen), display the full logo image directly
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
            height: `${size >= 60 ? size * 2.2 : size * 1.8}px`,
            maxWidth: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.06))'
          }} 
        />
      </div>
    );
  }

  // Header / Navbar Compact Display
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '10px', 
      textDecoration: 'none',
      userSelect: 'none'
    }}>
      <img 
        src="/logo.png" 
        alt="Nestora Logo" 
        style={{ 
          height: `${size}px`,
          width: 'auto',
          objectFit: 'contain'
        }} 
      />
      {showText && (
        <span style={{
          fontSize: size >= 40 ? '1.45rem' : '1.2rem',
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
