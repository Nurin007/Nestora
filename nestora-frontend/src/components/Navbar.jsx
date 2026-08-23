import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, LayoutGrid, Map, BrainCircuit, User, LogOut, CheckCircle, 
  BarChart3, GitCompare, Bell, Heart, Calculator, MessageSquare, Menu, X, ShieldCheck, Globe
} from 'lucide-react';
import MobileDrawer from './MobileDrawer';
import NestoraLogo from './NestoraLogo';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ user, onLogout, notifications = [], setNotifications, wishlist = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
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
        {/* Official Brand Logo */}
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <NestoraLogo size={40} showText={true} />
        </Link>

        {/* 📱 MOBILE HAMBURGER MENU */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* 🖥️ DESKTOP MENU LINKS */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* 🌐 Language Switcher Toggle */}
          <button 
            type="button"
            onClick={toggleLanguage}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              padding: '6px 10px',
              borderRadius: '8px',
              background: language === 'bn' ? 'rgba(204, 163, 83, 0.15)' : '#ffffff',
              borderColor: language === 'bn' ? 'var(--primary)' : '#cbd5e1',
              color: '#0c2340',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title={language === 'en' ? 'Switch to Bangla' : 'Switch to English'}
          >
            <Globe size={14} style={{ color: 'var(--primary)' }} />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {user && (
            <>
              <Link to="/" className={`btn-secondary ${isActive('/') ? 'active' : ''}`} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.82rem',
                padding: '6px 10px',
                borderRadius: '8px',
                background: isActive('/') ? 'rgba(197, 155, 39, 0.15)' : '#ffffff',
                borderColor: isActive('/') ? 'var(--primary)' : '#cbd5e1',
                color: isActive('/') ? '#0c2340' : '#475569',
                fontWeight: isActive('/') ? 700 : 500
              }}>
                <Compass size={14} /> {t('explore')}
              </Link>
              <Link to="/listings" className="btn-secondary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.82rem',
                padding: '6px 10px',
                borderRadius: '8px',
                background: isActive('/listings') ? 'rgba(197, 155, 39, 0.15)' : '#ffffff',
                borderColor: isActive('/listings') ? 'var(--primary)' : '#cbd5e1',
                color: isActive('/listings') ? '#0c2340' : '#475569',
                fontWeight: isActive('/listings') ? 700 : 500
              }}>
                <LayoutGrid size={14} /> {t('listings')}
              </Link>
              <Link to="/map" className="btn-secondary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.82rem',
                padding: '6px 10px',
                borderRadius: '8px',
                background: isActive('/map') ? 'rgba(197, 155, 39, 0.15)' : '#ffffff',
                borderColor: isActive('/map') ? 'var(--primary)' : '#cbd5e1',
                color: isActive('/map') ? '#0c2340' : '#475569',
                fontWeight: isActive('/map') ? 700 : 500
              }}>
                <Map size={14} /> {t('mapView')}
              </Link>
              <Link to="/compare" className="btn-secondary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.82rem',
                padding: '6px 10px',
                borderRadius: '8px',
                color: '#475569'
              }}>
                <GitCompare size={14} /> {t('compare')}
              </Link>
              <Link to="/calculator" className="btn-secondary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.82rem',
                padding: '6px 10px',
                borderRadius: '8px',
                color: '#475569'
              }}>
                <Calculator size={14} /> {t('calculator')}
              </Link>
              <Link to="/predict" className="btn-secondary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.82rem',
                padding: '6px 10px',
                borderRadius: '8px',
                color: '#475569'
              }}>
                <BrainCircuit size={14} /> {t('valuation')}
              </Link>
            </>
          )}

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
                  <div className="animate-fade-in" style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    left: '0',
                    width: '320px',
                    maxWidth: '85vw',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    borderRadius: '16px',
                    zIndex: 999999,
                    padding: '16px',
                    boxShadow: '0 20px 40px rgba(12, 35, 64, 0.25), 0 0 0 1.5px rgba(197, 155, 39, 0.4)',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0c2340' }}>Notifications</h4>
                      {unreadCount > 0 && (
                        <button 
                          onClick={() => {
                            handleMarkAllRead();
                            setShowNotifs(false);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {myNotifications.length === 0 ? (
                      <p style={{ color: '#64748b', fontSize: '0.82rem', textAlign: 'center', padding: '20px 0' }}>No notifications found</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {myNotifications.map(n => {
                          const timeDiff = Math.floor((Date.now() - new Date(n.createdAt).getTime()) / 60000);
                          const timeAgo = timeDiff < 1 ? 'just now' : timeDiff < 60 ? `${timeDiff}m ago` : timeDiff < 1440 ? `${Math.floor(timeDiff / 60)}h ago` : `${Math.floor(timeDiff / 1440)}d ago`;
                          const hasMeta = n.meta && (n.meta.userName || n.meta.userEmail);
                          const roleBadgeColor = n.meta?.userRole === 'ADMIN' ? '#dc2626' : n.meta?.userRole === 'PROPERTY_OWNER' ? '#7c3aed' : '#2563eb';
                          return (
                            <div 
                              key={n.id} 
                              style={{
                                padding: '12px',
                                borderRadius: '10px',
                                background: n.isRead ? '#f8fafc' : '#fffbeb',
                                border: n.isRead ? '1px solid #e2e8f0' : '1px solid #fde68a',
                                textAlign: 'left',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h5 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', fontWeight: 700, color: n.isRead ? '#475569' : '#92400e' }}>
                                  {n.title}
                                </h5>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '8px', marginTop: '2px' }}>{timeAgo}</span>
                              </div>
                              {hasMeta && (
                                <div style={{ 
                                  background: 'linear-gradient(135deg, #f0f9ff, #f8fafc)', 
                                  border: '1px solid #e2e8f0', 
                                  borderRadius: '8px', 
                                  padding: '8px 10px', 
                                  margin: '6px 0',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '0.8rem' }}>👤</span>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{n.meta.userName}</span>
                                    {n.meta.userRole && (
                                      <span style={{ 
                                        fontSize: '0.6rem', 
                                        fontWeight: 700, 
                                        color: '#fff', 
                                        background: roleBadgeColor, 
                                        padding: '1px 6px', 
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                      }}>
                                        {n.meta.userRole === 'PROPERTY_OWNER' ? 'OWNER' : n.meta.userRole}
                                      </span>
                                    )}
                                  </div>
                                  {n.meta.userEmail && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ fontSize: '0.8rem' }}>📧</span>
                                      <span style={{ fontSize: '0.72rem', color: '#475569', fontFamily: 'monospace' }}>{n.meta.userEmail}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: '1.45' }}>
                                {n.content}
                              </p>
                            </div>
                          );
                        })}
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
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} user={user} />

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
