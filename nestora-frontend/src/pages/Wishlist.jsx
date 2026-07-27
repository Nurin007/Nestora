import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart, MapPin, BedDouble, Bath, Maximize2, GitCompare,
  Trash2, ArrowLeft, ShieldCheck, Home, Search
} from 'lucide-react';

export default function Wishlist({ user, properties, wishlist, onToggleWishlist, compareList, onToggleCompare }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  // Get saved properties from wishlist
  const savedProperties = properties.filter(p => wishlist.includes(p.id));

  const filteredSaved = filter === 'ALL'
    ? savedProperties
    : savedProperties.filter(p => p.propertyType === filter);

  const formatBDT = (value) =>
    new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value);

  const typeColors = {
    RESIDENTIAL: '#4ade80',
    COMMERCIAL: '#60a5fa',
    RENTAL: '#f59e0b',
    LAND: '#a78bfa'
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0 100px 0' }}>

      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', lineHeight: '1.1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              borderRadius: '12px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={28} fill="white" color="white" />
            </span>
            My Wishlist
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            {savedProperties.length === 0 ? 'No saved properties yet.' : `${savedProperties.length} saved propert${savedProperties.length !== 1 ? 'ies' : 'y'}`}
          </p>
        </div>

        {savedProperties.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'RENTAL', 'LAND'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${filter === type ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: filter === type ? 'rgba(204, 163, 83, 0.15)' : 'transparent',
                  color: filter === type ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: filter === type ? 700 : 400,
                  transition: 'all 0.2s'
                }}
              >
                {type === 'ALL' ? 'All Types' : type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedProperties.length === 0 && (
        <div className="glass" style={{ textAlign: 'center', padding: '80px 40px', borderRadius: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <Heart size={36} style={{ color: '#ef4444' }} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No Saved Properties</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px auto' }}>
            Browse available properties and click the heart icon to save your favorites here for easy comparison.
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} /> Explore Properties
          </Link>
        </div>
      )}

      {/* No match after filter */}
      {savedProperties.length > 0 && filteredSaved.length === 0 && (
        <div className="glass" style={{ textAlign: 'center', padding: '60px 40px', borderRadius: '24px' }}>
          <Home size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>No saved properties match the selected filter.</p>
          <button onClick={() => setFilter('ALL')} className="btn btn-secondary" style={{ marginTop: '16px' }}>Clear Filter</button>
        </div>
      )}

      {/* Properties Grid */}
      {filteredSaved.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
          {filteredSaved.map(property => {
            const isInCompare = compareList?.some(p => p.id === property.id);
            return (
              <div
                key={property.id}
                className="card"
                style={{ overflow: 'hidden', borderRadius: '20px', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
              >
                {/* Property Image */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
                    alt={property.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* Property Type Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: typeColors[property.propertyType] || 'var(--primary)',
                    color: '#0b0f19',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {property.propertyType}
                  </span>

                  {/* Verification Badge */}
                  {property.verificationStatus === 'APPROVED' && (
                    <span style={{
                      position: 'absolute',
                      top: '14px',
                      right: '54px',
                      background: 'rgba(22, 163, 74, 0.9)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <ShieldCheck size={10} /> Verified
                    </span>
                  )}

                  {/* Remove from Wishlist */}
                  <button
                    onClick={() => onToggleWishlist(property.id)}
                    title="Remove from Wishlist"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(239, 68, 68, 0.85)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Heart size={16} fill="white" color="white" />
                  </button>
                </div>

                {/* Property Info */}
                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', lineHeight: '1.3' }}>{property.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <MapPin size={13} />
                      {property.address}, {property.city}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {property.numberOfBedrooms > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BedDouble size={14} /> {property.numberOfBedrooms} BD
                      </span>
                    )}
                    {property.numberOfBathrooms > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bath size={14} /> {property.numberOfBathrooms} BA
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Maximize2 size={14} /> {property.areaSize.toLocaleString()} sq ft
                    </span>
                  </div>

                  {/* Price */}
                  <div style={{
                    padding: '10px 16px',
                    background: 'rgba(204, 163, 83, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(204, 163, 83, 0.15)'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      {property.propertyType === 'RENTAL' ? 'Monthly Rent' : 'Asking Price'}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {formatBDT(property.pricing)}
                      {property.propertyType === 'RENTAL' && <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}> /mo</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <Link
                      to={`/property/${property.id}`}
                      className="btn btn-primary"
                      style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', padding: '10px' }}
                    >
                      View Details
                    </Link>
                    {onToggleCompare && (
                      <button
                        onClick={() => onToggleCompare(property)}
                        title={isInCompare ? 'Remove from Compare' : 'Add to Compare'}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: `1px solid ${isInCompare ? 'var(--primary)' : 'var(--border-color)'}`,
                          background: isInCompare ? 'rgba(204, 163, 83, 0.15)' : 'transparent',
                          color: isInCompare ? 'var(--primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.8rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <GitCompare size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Remove this property from your wishlist?')) {
                          onToggleWishlist(property.id);
                        }
                      }}
                      title="Remove from Wishlist"
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        background: 'rgba(239, 68, 68, 0.05)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compare Prompt */}
      {compareList?.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          zIndex: 500
        }}>
          <Link to="/compare" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-lg)' }}>
            <GitCompare size={16} /> Compare ({compareList.length})
          </Link>
        </div>
      )}
    </div>
  );
}
