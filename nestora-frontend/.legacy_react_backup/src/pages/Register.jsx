import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, RefreshCw, Key, Check } from 'lucide-react';

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BUYER'); // BUYER, PROPERTY_OWNER, AGENT

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      onLogin({
        id: Math.floor(Math.random() * 1000) + 10,
        email,
        fullName,
        role,
        isVerified: false
      });
      navigate('/');
    }, 1000);
  };

  const roles = [
    { value: 'BUYER', title: 'Buyer / Tenant', desc: 'Browse, wishlist & schedule visits' },
    { value: 'PROPERTY_OWNER', title: 'Property Owner', desc: 'List your property & receive bookings' },
    { value: 'AGENT', title: 'Real Estate Agent', desc: 'Manage portfolio & verify clients' }
  ];

  return (
    <div className="container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '40px 0'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%',
        maxWidth: '550px',
        padding: '40px',
        borderRadius: '24px'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px', textAlign: 'center' }}>
          Join Bangladesh's premier smart real estate platform
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            padding: '12px',
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
          {/* Role Grid Selector */}
          <label className="input-label" style={{ marginBottom: '12px' }}>Choose Your Role</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {roles.map((r) => (
              <div 
                key={r.value}
                onClick={() => setRole(r.value)}
                style={{
                  background: role === r.value ? 'rgba(204, 163, 83, 0.08)' : 'rgba(255,255,255,0.01)',
                  border: role === r.value ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: role === r.value ? 'var(--primary)' : '#ffffff' }}>
                    {r.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{r.desc}</p>
                </div>
                {role === r.value && (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0b0f19'
                  }}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="e.g. Nurin Chowdury"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
              <input
                type="email"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="nurin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
              <input
                type="tel"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="+8801XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '32px' }}>
            <label className="input-label">Secure Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
              <input
                type="password"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '48px' }}>
            {loading ? (
              <RefreshCw className="spinner" size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
