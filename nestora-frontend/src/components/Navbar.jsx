import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, LayoutGrid, Map, BrainCircuit, User, LogOut, CheckCircle, 
  BarChart3, GitCompare, Bell, Heart, Calculator, MessageSquare, Menu, X, ShieldCheck
} from 'lucide-react';

export default function Navbar({ user, onLogout, notifications = [], setNotifications, wishlist = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const myNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => n.userId === user?.id ? { ...n, isRead: true } : n));
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'PROPERTY_OWNER' || user.role === 'AGENT') return '/owner';
    return '/buyer';
  };

  return (
    <>
      {/* ========================================================
          🖥️ TOP NAVBAR (Desktop & Mobile Header)
          ======================================================== */}
      <nav className="glass" style={{
        position: 'sticky',
        top: '12px',
        margin: '12px auto',
        width: 'calc(100% - 24px)',
        maxWidth: '1200px',
        zIndex: 1000,
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid var(--border-color)',
        borderRadius: '16px'
      }}>
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#0b0f19',
            fontSize: '1.25rem',
            fontFamily: 'var(--font-accent)'
          }}>N</div>
          <span style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            fontFamily: 'var(--font-accent)',
            background: 'linear-gradient(to right, #ffffff, var(--primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Nestora</span>
        </Link>

        {/* 🖥️ DESKTOP MENU LINKS */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '14px' }}>
          <Link to="/" className={`btn-secondary ${isActive('/') ? 'active' : ''}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            padding: '7px 12px',
            borderRadius: '10px',
            background: isActive('/') ? 'rgba(204, 163, 83, 0.15)' : undefined,
            borderColor: isActive('/') ? 'var(--primary)' : undefined,
            color: isActive('/') ? 'var(--primary)' : undefined
          }}>
            <Compass size={15} /> Explore
          </Link>
          <Link to="/listings" className="btn-secondary" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            padding: '7px 12px',
            borderRadius: '10px',
            background: isActive('/listings') ? 'rgba(204, 163, 83, 0.15)' : undefined,
            borderColor: isActive('/listings') ? 'var(--primary)' : undefined,
            color: isActive('/listings') ? 'var(--primary)' : undefined
          }}>
            <LayoutGrid size={15} /> Listings
          </Link>
          <Link to="/map" className="btn-secondary" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            padding: '7px 12px',
            borderRadius: '10px',
            background: isActive('/map') ? 'rgba(204, 163, 83, 0.15)' : undefined,
            borderColor: isActive('/map') ? 'var(--primary)' : undefined,
            color: isActive('/map') ? 'var(--primary)' : undefined
          }}>
            <Map size={15} /> Map
          </Link>
          <Link to="/compare" className="btn-secondary" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            padding: '7px 12px',
            borderRadius: '10px'
          }}>
            <GitCompare size={15} /> Compare
          </Link>
          <Link to="/calculator" className="btn-secondary" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            padding: '7px 12px',
            borderRadius: '10px'
          }}>
            <Calculator size={15} /> EMI Calc
          </Link>
          <Link to="/predict" className="btn-secondary" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            padding: '7px 12px',
            borderRadius: '10px'
          }}>
            <BrainCircuit size={15} /> Predict
          </Link>

          {user && (
            <Link to="/chat" className="btn-secondary" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              padding: '7px 12px',
              borderRadius: '10px'
            }}>
              <MessageSquare size={15} /> Chat
            </Link>
          )}

          {user && (
            <Link to="/wishlist" className="btn-secondary" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              padding: '7px 12px',
              borderRadius: '10px',
              position: 'relative'
            }}>
              <Heart size={15} style={{ color: wishlist.length > 0 ? '#ef4444' : 'currentColor' }} fill={wishlist.length > 0 ? '#ef4444' : 'none'} />
              Wishlist
              {wishlist.length > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '8px',
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
                  fontSize: '0.85rem',
                  padding: '7px 12px',
                  borderRadius: '10px'
                }}>
                  <User size={15} /> Buyer
                </Link>
              )}
              {(user.role === 'PROPERTY_OWNER' || user.role === 'AGENT') && (
                <Link to="/owner" className="btn-secondary" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  padding: '7px 12px',
                  borderRadius: '10px'
                }}>
                  <BarChart3 size={15} /> Owner
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="btn-secondary" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)'
                }}>
                  <CheckCircle size={15} /> Admin
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
                    background: showNotifs ? 'rgba(255,255,255,0.08)' : 'none',
                    color: 'var(--text-main)'
                  }}
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'var(--danger)',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      width: '16px',
                      height: '16px',
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
                    top: '44px',
                    right: '0',
                    width: '320px',
                    maxHeight: '360px',
                    overflowY: 'auto',
                    borderRadius: '16px',
                    zIndex: 2000,
                    padding: '16px',
                    boxShadow: 'var(--shadow-lg)',
                    background: '#0e1526'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.85rem' }}>Notifications</h4>
                      {unreadCount > 0 && (
                        <button 
                          onClick={() => {
                            handleMarkAllRead();
                            setShowNotifs(false);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {myNotifications.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '12px 0' }}>No notifications</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {myNotifications.map(n => (
                          <div 
                            key={n.id} 
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              background: n.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(204, 163, 83, 0.08)',
                              border: '1px solid var(--border-color)',
                              textAlign: 'left'
                            }}
                          >
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '0.8rem', fontWeight: 700, color: n.isRead ? 'var(--text-muted)' : '#ffffff' }}>{n.title}</h5>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#0b0f19'
                }}>
                  {(user.fullName || 'U')[0].toUpperCase()}
                </div>
                <button onClick={() => { onLogout(); navigate('/'); }} className="btn-danger" style={{
                  padding: '7px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem'
                }}>
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{
              padding: '7px 16px',
              fontSize: '0.85rem'
            }}>
              Sign In
            </Link>
          )}
        </div>

        {/* 📱 MOBILE TOP HEADER ACTIONS (Notification, Avatar & Drawer Toggle) */}
        <div className="mobile-only" style={{ alignItems: 'center', gap: '10px' }}>
          {/* Notification icon on mobile */}
          {user && (
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                padding: '6px',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: 'var(--danger)',
                  color: '#ffffff',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Avatar on Mobile */}
          {user ? (
            <Link to={getDashboardPath()} style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#0b0f19'
            }}>
              {(user.fullName || 'U')[0].toUpperCase()}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Sign In
            </Link>
          )}

          {/* Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '7px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ========================================================
          📱 MOBILE FULLSCREEN SLIDE-OUT DRAWER MENU
          ======================================================== */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: '12px',
          right: '12px',
          bottom: '84px',
          background: 'rgba(11, 15, 25, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '20px',
          zIndex: 9995,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
        }} className="animate-fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              Menu & Tools
            </span>
            
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary" 
              style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}
            >
              <Compass size={18} style={{ color: 'var(--primary)' }} /> Explore Marketplace
            </Link>

            <Link 
              to="/listings" 
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary" 
              style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}
            >
              <LayoutGrid size={18} style={{ color: 'var(--primary)' }} /> All Property Listings
            </Link>

            <Link 
              to="/map" 
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary" 
              style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}
            >
              <Map size={18} style={{ color: 'var(--primary)' }} /> Interactive Map Search
            </Link>

            <Link 
              to="/compare" 
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary" 
              style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}
            >
              <GitCompare size={18} style={{ color: 'var(--accent)' }} /> Property Comparison
            </Link>

            <Link 
              to="/calculator" 
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary" 
              style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}
            >
              <Calculator size={18} style={{ color: 'var(--secondary)' }} /> Mortgage EMI Calculator
            </Link>

            <Link 
              to="/predict" 
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary" 
              style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}
            >
              <BrainCircuit size={18} style={{ color: '#818cf8' }} /> AI Price Prediction
            </Link>

            {user && (
              <>
                <Link 
                  to="/chat" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary" 
                  style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}
                >
                  <MessageSquare size={18} style={{ color: 'var(--primary)' }} /> Direct Chat
                </Link>

                <Link 
                  to="/wishlist" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary" 
                  style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}
                >
                  <Heart size={18} style={{ color: '#ef4444' }} /> Saved Wishlist ({wishlist.length})
                </Link>
              </>
            )}
          </div>

          {/* User Info & Logout at bottom of drawer */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
            {user ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>{user.fullName}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="btn-danger"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '12px' }}
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          📱 NATIVE MOBILE BOTTOM APP DOCK (Navigation Bar)
          ======================================================== */}
      <div className="mobile-app-dock">
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          className={`mobile-dock-item ${isActive('/') ? 'active' : ''}`}
        >
          <Compass size={22} />
          <span>Explore</span>
        </Link>

        <Link 
          to="/listings" 
          onClick={() => setMobileMenuOpen(false)}
          className={`mobile-dock-item ${isActive('/listings') ? 'active' : ''}`}
        >
          <LayoutGrid size={22} />
          <span>Listings</span>
        </Link>

        <Link 
          to="/map" 
          onClick={() => setMobileMenuOpen(false)}
          className={`mobile-dock-item ${isActive('/map') ? 'active' : ''}`}
        >
          <Map size={22} />
          <span>Map</span>
        </Link>

        <Link 
          to="/calculator" 
          onClick={() => setMobileMenuOpen(false)}
          className={`mobile-dock-item ${isActive('/calculator') ? 'active' : ''}`}
        >
          <Calculator size={22} />
          <span>EMI Calc</span>
        </Link>

        <Link 
          to={getDashboardPath()} 
          onClick={() => setMobileMenuOpen(false)}
          className={`mobile-dock-item ${isActive('/buyer') || isActive('/owner') || isActive('/admin') || isActive('/login') ? 'active' : ''}`}
        >
          <User size={22} />
          <span>{user ? 'Profile' : 'Sign In'}</span>
        </Link>
      </div>
    </>
  );
}
