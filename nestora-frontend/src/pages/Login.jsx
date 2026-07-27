import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Phone, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [isOtpMode, setIsOtpMode] = useState(false);
  
  // Credentials mode state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP mode state
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [mockOtp, setMockOtp] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (isOtpMode) {
        if (!phone) {
          setError('Please enter your phone number.');
          setLoading(false);
          return;
        }
        if (!otpSent) {
          // Simulate OTP Send
          const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          setMockOtp(generatedOtp);
          setOtpSent(true);
          setLoading(false);
          alert(`[SMS API Simulation] Your OTP Code is: ${generatedOtp}`);
        } else {
          // Verify OTP
          if (otpCode === mockOtp) {
            onLogin({
              id: 4,
              email: `${phone}@nestora.com`,
              fullName: `User ${phone}`,
              role: 'BUYER',
              isVerified: true
            });
            navigate('/');
          } else {
            setError('Invalid verification code.');
            setLoading(false);
          }
        }
      } else {
        // Standard credentials simulation
        if (!email || !password) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }

        // Test accounts matching each role
        let role = 'BUYER';
        let fullName = 'Premium Buyer';
        let isVerified = true;
        let id = 4;

        if (email === 'admin@nestora.com') {
          role = 'ADMIN';
          fullName = 'Nestora General Admin';
          id = 1;
        } else if (email === 'owner@nestora.com') {
          role = 'PROPERTY_OWNER';
          fullName = 'Alhaz Properties Ltd.';
          id = 2;
        } else if (email === 'agent@nestora.com') {
          role = 'AGENT';
          fullName = 'Bproperty Agent Rafiq';
          id = 3;
        }

        onLogin({ id, email, fullName, role, isVerified });
        navigate('/');
      }
    }, 800);
  };

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
        maxWidth: '450px',
        padding: '40px',
        borderRadius: '24px'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px', textAlign: 'center' }}>
          Access your premium Nestora properties dashboard
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
          {!isOtpMode ? (
            <>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
                  <input
                    type="email"
                    className="input-field"
                    style={{ paddingLeft: '48px' }}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '12px' }}>
                <label className="input-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: '48px' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
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
                    disabled={otpSent}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {otpSent && (
                <div className="input-group animate-fade-in">
                  <label className="input-label">Verification Code (OTP)</label>
                  <div style={{ position: 'relative' }}>
                    <ShieldCheck size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: '48px', letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center' }}
                      placeholder="000000"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
                    Check your console log or simulated SMS pop-up.
                  </span>
                </div>
              )}
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => {
                setIsOtpMode(!isOtpMode);
                setOtpSent(false);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {isOtpMode ? 'Use Email/Password' : 'Sign in with Phone (OTP)'}
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '48px' }}>
            {loading ? (
              <RefreshCw className="spinner" size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                {isOtpMode ? (otpSent ? 'Verify & Sign In' : 'Request OTP') : 'Sign In'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create Account
          </Link>
        </p>

        {/* Demo Accounts Panel */}
        <div style={{
          marginTop: '32px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px dashed var(--border-color)'
        }}>
          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '8px', letterSpacing: '0.05em' }}>
            Demo Accounts for Reviewers
          </h4>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li><strong>Admin:</strong> admin@nestora.com / password</li>
            <li><strong>Owner:</strong> owner@nestora.com / password</li>
            <li><strong>Agent:</strong> agent@nestora.com / password</li>
            <li><strong>Buyer:</strong> buyer@nestora.com / password</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
