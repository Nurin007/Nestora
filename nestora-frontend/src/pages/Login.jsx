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
      const userData = {
        id: presetId,
        fullName: presetName,
        email: presetEmail,
        role: presetRole,
        isVerified: true
      };
      onLogin(userData);
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
      padding: '30px 16px'
    }}>
      {/* 🏛️ Clean Luxury White Card */}
      <div className="glass animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '40px 36px',
        borderRadius: '24px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 50px rgba(12, 35, 64, 0.08)'
      }}>
        {/* Official Brand Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textAlign: 'center' }}>
          <NestoraLogo size={105} showText={true} subtitle={true} stacked={true} />
          <div style={{
            height: '1px',
            width: '85%',
            background: 'linear-gradient(90deg, transparent, #cbd5e1, transparent)',
            margin: '20px auto 16px'
          }} />
          <h2 style={{ fontSize: '1.45rem', marginBottom: '4px', color: '#0c2340', fontWeight: 800 }}>
            Account Sign In
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500 }}>
            Enter your credentials to unlock full marketplace access
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            color: '#b91c1c',
            padding: '12px 14px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="input-group">
            <label className="input-label">Full Name (আপনার নাম)</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: '#64748b' }} />
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
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: '#64748b' }} />
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
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: '#64748b' }} />
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
            <label className="input-label" style={{ fontSize: '0.78rem' }}>Select Role / Account Type</label>
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
                    padding: '9px 4px',
                    borderRadius: '10px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: role === r.id ? 'rgba(197, 155, 39, 0.15)' : '#ffffff',
                    border: role === r.id ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                    color: role === r.id ? '#0c2340' : '#64748b',
                    transition: 'all 0.2s',
                    boxShadow: role === r.id ? '0 2px 8px rgba(197,155,39,0.2)' : 'none'
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
            style={{ width: '100%', height: '50px', fontSize: '1rem', fontWeight: 800, borderRadius: '12px' }}
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
          background: '#f8fafc',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0c2340', letterSpacing: '0.04em' }}>
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
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#1e3a8a',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#166534',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#b45309',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
