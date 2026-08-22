import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Compass, LayoutGrid, Map, GitCompare, Calculator, BrainCircuit, 
  Heart, MessageSquare, X, ShieldCheck 
} from 'lucide-react';
import NestoraLogo from './NestoraLogo';

export default function MobileDrawer({ open, onClose }) {
  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 9998,
            transition: 'opacity 0.3s'
          }}
        />
      )}

      {/* Slide-out Drawer */}
      <div 
        className={`mobile-drawer ${open ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: open ? 0 : '-300px',
          width: '280px',
          height: '100vh',
          background: '#0b0f19',
          borderRight: '1px solid rgba(245, 158, 11, 0.25)',
          boxShadow: '10px 0 40px rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto'
        }}
      >
        <div>
          {/* Top Header with Logo & Close Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <NestoraLogo size={36} showText={true} />
            <button 
              onClick={onClose} 
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>
              Explore Marketplace
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <NavLink 
                to="/" 
                onClick={onClose} 
                className="btn-secondary" 
                style={{ padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', justifyContent: 'flex-start' }}
              >
                <Compass size={18} style={{ color: 'var(--primary)' }} /> Explore
              </NavLink>

              <NavLink 
                to="/listings" 
                onClick={onClose} 
                className="btn-secondary" 
                style={{ padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', justifyContent: 'flex-start' }}
              >
                <LayoutGrid size={18} style={{ color: 'var(--primary)' }} /> All Listings
              </NavLink>

              <NavLink 
                to="/map" 
                onClick={onClose} 
                className="btn-secondary" 
                style={{ padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', justifyContent: 'flex-start' }}
              >
                <Map size={18} style={{ color: 'var(--secondary)' }} /> Interactive Map
              </NavLink>

              <NavLink 
                to="/compare" 
                onClick={onClose} 
                className="btn-secondary" 
                style={{ padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', justifyContent: 'flex-start' }}
              >
                <GitCompare size={18} style={{ color: 'var(--accent)' }} /> Compare Flats
              </NavLink>

              <NavLink 
                to="/calculator" 
                onClick={onClose} 
                className="btn-secondary" 
                style={{ padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', justifyContent: 'flex-start' }}
              >
                <Calculator size={18} style={{ color: '#f59e0b' }} /> EMI Calculator
              </NavLink>

              <NavLink 
                to="/predict" 
                onClick={onClose} 
                className="btn-secondary" 
                style={{ padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', justifyContent: 'flex-start' }}
              >
                <BrainCircuit size={18} style={{ color: '#818cf8' }} /> AI Price Predict
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Footer Badge */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '16px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '0.75rem'
        }}>
          <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
          <span>Verified Smart Platform © 2026</span>
        </div>
      </div>
    </>
  );
}
