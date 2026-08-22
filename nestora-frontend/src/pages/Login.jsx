import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ShieldCheck, ArrowRight, RefreshCw, Sparkles, Check } from 'lucide-react';
import NestoraLogo from '../components/NestoraLogo';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BUYER'); // BUYER, PROPERTY_OWNER, ADMIN, AGENT

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your Email and Password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Determine user credentials & role
      let userRole = role;
      let finalName = fullName.trim() || email.split('@')[0];
      let id = Math.floor(Math.random() * 9000) + 100;
      let isVerified = true;

      // Recognized preset test roles
      if (email.toLowerCase() === 'admin@nestora.com') {
        userRole = 'ADMIN';
        finalName = fullName.trim() || 'Nestora General Admin';
        id = 1;
      } else if (email.toLowerCase() === 'owner@nestora.com') {
        userRole = 'PROPERTY_OWNER';
        finalName = fullName.trim() || 'Alhaz Properties Ltd.';
        id = 2;
      } else if (email.toLowerCase() === 'agent@nestora.com') {
        userRole = 'AGENT';
        finalName = fullName.trim() || 'Agent Rafiq';
        id = 3;
      }

      const userData = {
        id,
        fullName: finalName,
        email,
        role: userRole,
        isVerified
      };

      onLogin(userData);
      setLoading(false);
      navigate('/');
    }, 700);
  };

  const handleQuickLogin = (presetEmail, presetRole, presetName, presetId) => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        id: presetId,
        fullName: presetName,
        email: presetEmail,
        role: presetRole,
        isVerified: true
      });
      setLoading(false);
      navigate('/');
    }, 500);
  };

  return (
    <div className="container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '24px 0'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '36px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Official Brand Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px', textAlign: 'center' }}>
          <NestoraLogo size={70} showText={true} subtitle={true} />
          <h2 style={{ fontSize: '1.5rem', marginTop: '16px', marginBottom: '4px' }}>
            Account Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Enter your credentials to unlock full marketplace access
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#fca5a5',
            padding: '12px 14px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="input-group">
            <label className="input-label">Full Name (আপনার নাম)</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="e.g. Nurin Chowdhury"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="input-group">
            <label className="input-label">Email Address (ইমেইল এড্রেস)</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
              <input
                type="email"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label className="input-label">Password (পাসওয়ার্ড)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
              <input
                type="password"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Role Selection Chips */}
          <div style={{ marginBottom: '24px' }}>
            <label className="input-label" style={{ fontSize: '0.75rem' }}>Select Role / Account Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'BUYER', label: 'Buyer / Client' },
                { id: 'PROPERTY_OWNER', label: 'Property Owner' },
                { id: 'ADMIN', label: 'Admin Desk' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: role === r.id ? 'rgba(204, 163, 83, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: role === r.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    color: role === r.id ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%', height: '50px', fontSize: '1rem', fontWeight: 800 }}
          >
            {loading ? (
              <RefreshCw className="spinner" size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <span>Enter Nestora Platform</span> <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Demo Accounts Bar */}
        <div style={{
          marginTop: '28px',
          padding: '16px',
          borderRadius: '14px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(204, 163, 83, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>
              1-Click Demo Logins for Review
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@nestora.com', 'ADMIN', 'Nestora Admin Desk', 1)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('owner@nestora.com', 'PROPERTY_OWNER', 'Alhaz Properties Ltd.', 2)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🏢 Owner
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('buyer@nestora.com', 'BUYER', 'Premium Buyer', 4)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(204, 163, 83, 0.1)',
                border: '1px solid rgba(204, 163, 83, 0.3)',
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🛍️ Buyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
