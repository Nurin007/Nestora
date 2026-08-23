import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MapPin, Grid, DollarSign, Eye, GitCompare, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BD_DISTRICTS } from '../constants/districts';

export default function Home({ properties, wishlist, onToggleWishlist, compareList, onToggleCompare }) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Format currency in BDT
  const formatBDT = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(value);
  };

  const filteredProperties = properties.filter((p) => {
    // Only display approved properties in the public explore page
    if (p.verificationStatus !== 'APPROVED') return false;

    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter ? p.city.toLowerCase() === cityFilter.toLowerCase() : true;
    const matchesType = typeFilter ? p.propertyType === typeFilter : true;
    const matchesPrice = priceMax ? p.pricing <= parseFloat(priceMax) : true;

    return matchesSearch && matchesCity && matchesType && matchesPrice;
  });

  // Mock AI Recommendation System: Highlight top curated flagship properties (Sylhet Villa, Gulshan Penthouse, Motijheel Commercial)
  const recommendedProperties = properties
    .filter(p => p.verificationStatus === 'APPROVED')
    .slice(0, 6);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '50px 0 40px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
          lineHeight: '1.2',
          letterSpacing: '-1px',
          marginBottom: '16px',
          maxWidth: '850px',
          color: '#0c2340',
          fontWeight: 900
        }}>
          {t('heroTitlePrefix')} <span style={{ color: 'var(--primary)' }}>{t('heroTitleSuffix')}</span>
        </h1>
        <p style={{
          color: '#475569',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          maxWidth: '620px',
          marginBottom: '36px',
          lineHeight: '1.6',
          fontWeight: 500
        }}>
          {t('heroSub')}
        </p>

        {/* Floating Glass Search Panel */}
        <div className="glass hero-search-grid" style={{
          width: '100%',
          maxWidth: '900px',
          padding: '20px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1.5px solid rgba(197, 155, 39, 0.3)',
          boxShadow: '0 15px 35px rgba(12, 35, 64, 0.08)'
        }}>
          {/* Main search bar */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: '#64748b' }} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="input-field"
              style={{ paddingLeft: '48px', background: '#f8fafc', color: '#0f172a', border: '1.5px solid #cbd5e1' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* City selector with all Bangladesh districts */}
          <select 
            className="input-field"
            style={{ background: '#f8fafc', color: '#0f172a', border: '1.5px solid #cbd5e1' }}
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">{t('allCities')}</option>
            {BD_DISTRICTS.map((d) => (
              <option key={d.id} value={d.en}>
                {language === 'bn' ? `${d.bn} (${d.en})` : `${d.en} (${d.bn})`}
              </option>
            ))}
          </select>

          {/* Type selector */}
          <select 
            className="input-field"
            style={{ background: '#f8fafc', color: '#0f172a', border: '1.5px solid #cbd5e1' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">{t('allTypes')}</option>
            <option value="RESIDENTIAL">{t('residential')}</option>
            <option value="COMMERCIAL">{t('commercial')}</option>
            <option value="RENTAL">{t('rental')}</option>
            <option value="LAND">{t('land')}</option>
          </select>

          {/* Price selector */}
          <input
            type="number"
            placeholder={t('maxPrice')}
            className="input-field"
            style={{ background: '#f8fafc', color: '#0f172a', border: '1.5px solid #cbd5e1' }}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />

          <button className="btn btn-primary" style={{ padding: '12px 24px', height: '48px' }}>
            {t('searchBtn')}
          </button>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '14px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ color: 'var(--primary)' }} size={24} /> AI Recommended for You
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Properties personalized to your search trends and market behavior
            </p>
          </div>
        </div>

        <div className="property-card-grid">
          {recommendedProperties.map((p) => {
            const isWishlisted = wishlist.includes(p.id);
            const isComparing = compareList.some(comp => comp.id === p.id);

            return (
              <div key={`rec-${p.id}`} className="glass" style={{
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                border: '1px solid rgba(204, 163, 83, 0.3)',
                boxShadow: '0 0 15px rgba(204, 163, 83, 0.1)'
              }}>
                {/* Image & Badges */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={p.images[0]} 
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  
                  {/* Property Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(11, 15, 25, 0.8)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {p.propertyType}
                  </div>

                  {/* AI Match Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(204, 163, 83, 0.95)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#0b0f19',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Sparkles size={14} /> 98% Match
                  </div>
                </div>

                {/* Info Content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatBDT(p.pricing)}
                      {p.propertyType === 'RENTAL' && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/mo</span>}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{p.areaSize} sq ft</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{p.title}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    <MapPin size={14} style={{ color: 'var(--primary)' }} /> {p.address}, {p.city}
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flexGrow: 1
                  }}>
                    {p.description}
                  </p>

                  {/* Action Bars */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '18px',
                    marginTop: 'auto'
                  }}>
                    <Link to={`/property/${p.id}`} className="btn btn-secondary" style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Eye size={16} /> Details
                    </Link>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => onToggleCompare(p)} 
                        title="Add to Compare List"
                        style={{
                          background: isComparing ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isComparing ? 'var(--accent)' : 'var(--border-color)'}`,
                          color: isComparing ? 'var(--accent)' : 'var(--text-main)',
                          padding: '8px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        <GitCompare size={16} />
                      </button>

                      <button 
                        onClick={() => onToggleWishlist(p.id)} 
                        title="Add to Wishlist"
                        style={{
                          background: isWishlisted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isWishlisted ? 'var(--danger)' : 'var(--border-color)'}`,
                          color: isWishlisted ? 'var(--danger)' : 'var(--text-main)',
                          padding: '8px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        <Heart size={16} fill={isWishlisted ? 'var(--danger)' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '14px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)' }}>All Verified Listings</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Hand-picked properties approved by Nestora Admin
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
            {filteredProperties.length} Properties found
          </span>
        </div>

        <div className="property-card-grid">
          {filteredProperties.map((p) => {
            const isWishlisted = wishlist.includes(p.id);
            const isComparing = compareList.some(comp => comp.id === p.id);

            return (
              <div key={p.id} className="glass" style={{
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                {/* Image & Badges */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={p.images[0]} 
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  
                  {/* Property Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(11, 15, 25, 0.8)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {p.propertyType}
                  </div>

                  {/* Verification Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(16, 185, 129, 0.9)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShieldCheck size={14} /> Verified
                  </div>
                </div>

                {/* Info Content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatBDT(p.pricing)}
                      {p.propertyType === 'RENTAL' && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/mo</span>}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{p.areaSize} sq ft</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{p.title}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    <MapPin size={14} style={{ color: 'var(--primary)' }} /> {p.address}, {p.city}
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flexGrow: 1
                  }}>
                    {p.description}
                  </p>

                  {/* Action Bars */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '18px',
                    marginTop: 'auto'
                  }}>
                    <Link to={`/property/${p.id}`} className="btn btn-secondary" style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Eye size={16} /> Details
                    </Link>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => onToggleCompare(p)} 
                        title="Add to Compare List"
                        style={{
                          background: isComparing ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isComparing ? 'var(--accent)' : 'var(--border-color)'}`,
                          color: isComparing ? 'var(--accent)' : 'var(--text-main)',
                          padding: '8px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        <GitCompare size={16} />
                      </button>

                      <button 
                        onClick={() => onToggleWishlist(p.id)} 
                        title="Add to Wishlist"
                        style={{
                          background: isWishlisted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isWishlisted ? 'var(--danger)' : 'var(--border-color)'}`,
                          color: isWishlisted ? 'var(--danger)' : 'var(--text-main)',
                          padding: '8px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        <Heart size={16} fill={isWishlisted ? 'var(--danger)' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
