import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, LayoutGrid, Map, BrainCircuit, User, LogOut, CheckCircle, BarChart3, GitCompare, Bell, Heart, Calculator, MessageSquare } from 'lucide-react';

export default function Navbar({ user, onLogout, notifications = [], setNotifications, wishlist = [] }) {
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);

  const myNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => n.userId === user?.id ? { ...n, isRead: true } : n));
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: '20px',
      margin: '20px auto',
      width: 'calc(100% - 40px)',
      maxWidth: '1200px',
      zIndex: 1000,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid var(--border-color)',
      borderRadius: '20px'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          color: '#0b0f19',
          fontSize: '1.4rem',
          fontFamily: 'var(--font-accent)'
        }}>N</div>
        <span style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          fontFamily: 'var(--font-accent)',
          background: 'linear-gradient(to right, #ffffff, var(--primary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Nestora</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" className="btn-secondary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.9rem',
          padding: '8px 14px',
          borderRadius: '10px'
        }}>
          <Compass size={16} /> Explore
        </Link>
        <Link to="/listings" className="btn-secondary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.9rem',
          padding: '8px 14px',
          borderRadius: '10px'
        }}>
          <LayoutGrid size={16} /> Listings
        </Link>
        <Link to="/map" className="btn-secondary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.9rem',
          padding: '8px 14px',
          borderRadius: '10px'
        }}>
          <Map size={16} /> Map
        </Link>
        <Link to="/compare" className="btn-secondary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.9rem',
          padding: '8px 14px',
          borderRadius: '10px'
        }}>
          <GitCompare size={16} /> Compare
        </Link>
        <Link to="/calculator" className="btn-secondary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.9rem',
          padding: '8px 14px',
          borderRadius: '10px'
        }}>
          <Calculator size={16} /> EMI Calc
        </Link>
        <Link to="/predict" className="btn-secondary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.9rem',
          padding: '8px 14px',
          borderRadius: '10px'
        }}>
          <BrainCircuit size={16} /> Predict
        </Link>

        {user && (
          <Link to="/chat" className="btn-secondary" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
            padding: '8px 14px',
            borderRadius: '10px'
          }}>
            <MessageSquare size={16} /> Chat
          </Link>
        )}

        {user && (
          <Link to="/wishlist" className="btn-secondary" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
            padding: '8px 14px',
            borderRadius: '10px',
            position: 'relative'
          }}>
            <Heart size={16} style={{ color: wishlist.length > 0 ? '#ef4444' : 'currentColor' }} fill={wishlist.length > 0 ? '#ef4444' : 'none'} />
            Wishlist
            {wishlist.length > 0 && (
              <span style={{
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                minWidth: '18px',
                height: '18px',
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px'
              }}>{wishlist.length}</span>
            )}
          </Link>
        )}

        {user ? (
          <>
            {user.role === 'BUYER' && (
              <Link to="/buyer" className="btn-secondary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                padding: '8px 14px',
                borderRadius: '10px'
              }}>
                <User size={16} /> Buyer Dashboard
              </Link>
            )}
            {(user.role === 'PROPERTY_OWNER' || user.role === 'AGENT') && (
              <Link to="/owner" className="btn-secondary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                padding: '8px 14px',
                borderRadius: '10px'
              }}>
                <BarChart3 size={16} /> Listings & Visits
              </Link>
            )}
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="btn-secondary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                padding: '8px 14px',
                borderRadius: '10px'
              }}>
                <CheckCircle size={16} /> Admin Console
              </Link>
            )}

            {/* Notifications Dropdown */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="btn-secondary" 
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: showNotifs ? 'rgba(255,255,255,0.05)' : 'none',
                  border: '1px solid var(--border-color)',
                  marginRight: '12px',
                  color: 'var(--text-main)'
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'var(--danger)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="glass animate-fade-in" style={{
                  position: 'absolute',
                  top: '48px',
                  right: '0',
                  width: '320px',
                  maxHeight: '360px',
                  overflowY: 'auto',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  zIndex: 2000,
                  padding: '16px',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Notifications</h4>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => {
                          handleMarkAllRead();
                          setShowNotifs(false);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {myNotifications.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '12px 0' }}>No notifications</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {myNotifications.map(n => (
                        <div 
                          key={n.id} 
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            background: n.isRead ? 'rgba(255,255,255,0.01)' : 'rgba(99, 102, 241, 0.05)',
                            border: '1px solid var(--border-color)',
                            position: 'relative',
                            textAlign: 'left'
                          }}
                        >
                          <h5 style={{ margin: '0 0 4px 0', fontSize: '0.8rem', fontWeight: 700, color: n.isRead ? 'var(--text-muted)' : '#ffffff' }}>{n.title}</h5>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.content}</p>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-dark)', marginTop: '4px', display: 'block' }}>
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
              {/* User Avatar */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: user.profilePictureUrl ? 'transparent' : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#0b0f19'
              }}>
                {user.profilePictureUrl
                  ? <img src={user.profilePictureUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (user.fullName || 'U')[0].toUpperCase()
                }
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.fullName}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>{user.role}</span>
              </div>
              <button onClick={() => {
                onLogout();
                navigate('/');
              }} className="btn-danger" style={{
                padding: '8px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}>
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{
            padding: '8px 18px',
            fontSize: '0.9rem'
          }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
