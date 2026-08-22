import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, SlidersHorizontal, Grid3X3, List, Heart,
  GitCompare, Eye, ShieldCheck, BedDouble, Bath, Maximize2,
  ChevronDown, ChevronUp, X, SortAsc
} from 'lucide-react';

const CITIES = ['Dhaka', 'Gazipur', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
const TYPES = ['RESIDENTIAL', 'COMMERCIAL', 'RENTAL', 'LAND'];
const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'area_asc',   label: 'Area: Small → Large' },
  { value: 'area_desc',  label: 'Area: Large → Small' },
];
const ALL_AMENITIES = [
  'Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Lift', 'Lake View',
  'Smart Home', 'Backup Generator', 'Fibre Internet', 'Central Aircon',
  'Garden', 'Rooftop', 'Conference Room', 'Highway Access',
];

const formatBDT = (value) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value);

export default function Listings({ properties, wishlist, onToggleWishlist, compareList, onToggleCompare }) {
  const [searchParams] = useSearchParams();

  // Initialise from URL query params so Saved Searches can deep-link here
  const [query,    setQuery]    = useState(searchParams.get('q')        || '');
  const [city,     setCity]     = useState(searchParams.get('city')     || '');
  const [type,     setType]     = useState(searchParams.get('type')     || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('priceMin') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('priceMax') || '');
  const [minBeds,  setMinBeds]  = useState(searchParams.get('beds')     || '');
  const [minBaths, setMinBaths] = useState('');
  const [minArea,  setMinArea]  = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [sort,          setSort]          = useState('newest');
  const [viewMode,      setViewMode]      = useState('grid');
  const [showFilters,   setShowFilters]   = useState(true);
  const [showAmenities, setShowAmenities] = useState(false);

  const toggleAmenity = (a) =>
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const clearAll = () => {
    setQuery(''); setCity(''); setType('');
    setMinPrice(''); setMaxPrice('');
    setMinBeds(''); setMinBaths(''); setMinArea('');
    setSelectedAmenities([]);
    setSort('newest');
  };

  const activeFilterCount =
    [query, city, type, minPrice, maxPrice, minBeds, minBaths, minArea].filter(Boolean).length +
    selectedAmenities.length;

  const filtered = useMemo(() => {
    let result = properties.filter(p => {
      if (p.verificationStatus !== 'APPROVED') return false;
      if (query && !(
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )) return false;
      if (city     && p.city.toLowerCase()  !== city.toLowerCase())   return false;
      if (type     && p.propertyType        !== type)                 return false;
      if (minPrice && p.pricing             <  parseFloat(minPrice))  return false;
      if (maxPrice && p.pricing             >  parseFloat(maxPrice))  return false;
      if (minBeds  && p.numberOfBedrooms    <  parseInt(minBeds))     return false;
      if (minBaths && p.numberOfBathrooms   <  parseInt(minBaths))    return false;
      if (minArea  && p.areaSize            <  parseInt(minArea))     return false;
      if (selectedAmenities.length > 0 &&
          !selectedAmenities.every(a => p.amenities?.includes(a)))    return false;
      return true;
    });

    result.sort((a, b) => {
      if (sort === 'price_asc')  return a.pricing  - b.pricing;
      if (sort === 'price_desc') return b.pricing  - a.pricing;
      if (sort === 'area_asc')   return a.areaSize - b.areaSize;
      if (sort === 'area_desc')  return b.areaSize - a.areaSize;
      return b.id - a.id; // newest
    });

    return result;
  }, [properties, query, city, type, minPrice, maxPrice, minBeds, minBaths, minArea, selectedAmenities, sort]);

  /* ── shared inline styles ── */
  const inputSt = {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-main)',
    padding: '10px 14px',
    fontSize: '0.875rem',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
  };
  const labelSt = {
    fontSize: '0.72rem', fontWeight: 700,
    color: 'var(--text-muted)', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: '8px', display: 'block',
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── Page Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(204,163,83,0.07) 0%, transparent 60%)',
        borderBottom: '1px solid var(--border-color)',
        padding: '48px 0 32px',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Browse Properties
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            {filtered.length} verified {filtered.length === 1 ? 'property' : 'properties'} across Bangladesh
          </p>

          {/* Search bar row */}
          <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-dark)' }} />
              <input
                id="listings-search"
                type="text"
                placeholder="Search by title, address, description…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ ...inputSt, paddingLeft: '42px' }}
              />
            </div>

            <button
              onClick={() => setShowFilters(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: '10px',
                background: showFilters ? 'rgba(204,163,83,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${showFilters ? 'rgba(204,163,83,0.4)' : 'var(--border-color)'}`,
                color: showFilters ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              <SlidersHorizontal size={16} />
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 14px', borderRadius: '10px',
                  background: 'none', border: '1px solid rgba(239,68,68,0.35)',
                  color: 'var(--danger)', cursor: 'pointer', fontSize: '0.875rem',
                  fontFamily: 'inherit', fontWeight: 600,
                }}
              >
                <X size={14} /> Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body: Sidebar + Results ── */}
      <div className="container" style={{ marginTop: '24px' }}>
        <div className="listings-layout-wrapper">

          {/* ── Sidebar ── */}
          {showFilters && (
            <aside className="glass animate-fade-in" style={{
              width: '265px', flexShrink: 0, padding: '28px',
              borderRadius: '20px', position: 'sticky', top: '90px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={16} style={{ color: 'var(--primary)' }} /> Refine Results
              </h3>

              {/* City */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelSt}>City</label>
                <select id="filter-city" value={city} onChange={e => setCity(e.target.value)} style={inputSt}>
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Type radio */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelSt}>Property Type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {TYPES.map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input
                        type="radio" name="prop-type" value={t}
                        checked={type === t}
                        onChange={() => setType(prev => prev === t ? '' : t)}
                        style={{ accentColor: 'var(--primary)', width: '15px', height: '15px' }}
                      />
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </label>
                  ))}
                  {type && (
                    <button onClick={() => setType('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                      ✕ Clear type
                    </button>
                  )}
                </div>
              </div>

              {/* Price range */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelSt}>Price Range (BDT)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input id="filter-min-price" type="number" placeholder="Min" value={minPrice}
                    onChange={e => setMinPrice(e.target.value)} style={{ ...inputSt, width: '50%' }} />
                  <input id="filter-max-price" type="number" placeholder="Max" value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)} style={{ ...inputSt, width: '50%' }} />
                </div>
              </div>

              {/* Bedrooms */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelSt}>Bedrooms (min)</label>
                <select id="filter-beds" value={minBeds} onChange={e => setMinBeds(e.target.value)} style={inputSt}>
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>

              {/* Bathrooms */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelSt}>Bathrooms (min)</label>
                <select id="filter-baths" value={minBaths} onChange={e => setMinBaths(e.target.value)} style={inputSt}>
                  <option value="">Any</option>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>

              {/* Min area */}
              <div style={{ marginBottom: '24px' }}>
                <label style={labelSt}>Min Area (sq ft)</label>
                <input id="filter-area" type="number" placeholder="e.g. 1000" value={minArea}
                  onChange={e => setMinArea(e.target.value)} style={inputSt} />
              </div>

              {/* Amenities collapsible */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button
                  onClick={() => setShowAmenities(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', background: 'none', border: 'none',
                    color: 'var(--text-main)', cursor: 'pointer', fontFamily: 'inherit',
                    marginBottom: '12px',
                  }}
                >
                  <span style={labelSt}>
                    Amenities{selectedAmenities.length > 0 ? ` (${selectedAmenities.length})` : ''}
                  </span>
                  {showAmenities
                    ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
                    : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
                </button>
                {showAmenities && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    {ALL_AMENITIES.map(a => (
                      <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(a)}
                          onChange={() => toggleAmenity(a)}
                          style={{ accentColor: 'var(--primary)', width: '14px', height: '14px' }}
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* ── Results ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SortAsc size={15} style={{ color: 'var(--text-muted)' }} />
                <select id="listings-sort" value={sort} onChange={e => setSort(e.target.value)}
                  style={{ ...inputSt, width: 'auto', padding: '8px 12px' }}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { mode: 'grid', Icon: Grid3X3, id: 'view-grid' },
                  { mode: 'list', Icon: List,    id: 'view-list' },
                ].map(({ mode, Icon, id }) => (
                  <button key={mode} id={id} onClick={() => setViewMode(mode)} style={{
                    padding: '8px 12px', borderRadius: '10px', cursor: 'pointer',
                    background: viewMode === mode ? 'rgba(204,163,83,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${viewMode === mode ? 'rgba(204,163,83,0.4)' : 'var(--border-color)'}`,
                    color: viewMode === mode ? 'var(--primary)' : 'var(--text-muted)',
                  }}>
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="glass" style={{ textAlign: 'center', padding: '80px 40px', borderRadius: '20px' }}>
                <Search size={48} style={{ opacity: 0.2, marginBottom: '20px', display: 'block', margin: '0 auto 20px' }} />
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No properties found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Try adjusting your filters or broadening your search criteria.
                </p>
                <button onClick={clearAll} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Grid view */}
            {viewMode === 'grid' && filtered.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {filtered.map(p => (
                  <PropertyCard
                    key={p.id} p={p}
                    isWishlisted={wishlist.includes(p.id)}
                    isComparing={compareList.some(c => c.id === p.id)}
                    onToggleWishlist={onToggleWishlist}
                    onToggleCompare={onToggleCompare}
                  />
                ))}
              </div>
            )}

            {/* List view */}
            {viewMode === 'list' && filtered.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filtered.map(p => (
                  <PropertyRow
                    key={p.id} p={p}
                    isWishlisted={wishlist.includes(p.id)}
                    isComparing={compareList.some(c => c.id === p.id)}
                    onToggleWishlist={onToggleWishlist}
                    onToggleCompare={onToggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Grid Card ─────────────────────────── */
function PropertyCard({ p, isWishlisted, isComparing, onToggleWishlist, onToggleCompare }) {
  return (
    <div className="glass" style={{
      borderRadius: '20px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      border: '1px solid var(--border-color)',
    }}>
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
        <img src={p.images[0]} alt={p.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
          onMouseOut={e  => e.currentTarget.style.transform = 'scale(1)'}
        />
        <span style={{
          position: 'absolute', top: '14px', left: '14px',
          background: 'rgba(11,15,25,0.85)', backdropFilter: 'blur(4px)',
          padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem',
          fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>{p.propertyType}</span>
        <span style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'rgba(16,185,129,0.9)', padding: '4px 10px',
          borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#fff',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}><ShieldCheck size={12} /> Verified</span>

        <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '6px' }}>
          <ActionBtn active={isComparing} activeColor="rgba(99,102,241,0.85)" activeBorder="var(--accent)"
            onClick={() => onToggleCompare(p)} title="Compare">
            <GitCompare size={14} />
          </ActionBtn>
          <ActionBtn active={isWishlisted} activeColor="rgba(239,68,68,0.85)" activeBorder="var(--danger)"
            onClick={() => onToggleWishlist(p.id)} title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}>
            <Heart size={14} fill={isWishlisted ? '#fff' : 'none'} />
          </ActionBtn>
        </div>
      </div>

      <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
            {formatBDT(p.pricing)}
            {p.propertyType === 'RENTAL' && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/mo</span>}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.areaSize} sq ft</span>
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{p.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '14px' }}>
          <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          {p.address}, {p.city}
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          {p.numberOfBedrooms > 0 && <Stat icon={<BedDouble size={13} style={{ color: 'var(--primary)' }} />} label={`${p.numberOfBedrooms} Beds`} />}
          {p.numberOfBathrooms > 0 && <Stat icon={<Bath size={13} style={{ color: 'var(--primary)' }} />} label={`${p.numberOfBathrooms} Baths`} />}
          <Stat icon={<Maximize2 size={13} style={{ color: 'var(--primary)' }} />} label={`${p.areaSize} sq ft`} />
        </div>
        <Link to={`/property/${p.id}`} className="btn btn-secondary" style={{
          marginTop: 'auto', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '6px', padding: '9px 16px',
          fontSize: '0.85rem', textDecoration: 'none',
        }}>
          <Eye size={15} /> View Details
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────── List Row ──────────────────────────── */
function PropertyRow({ p, isWishlisted, isComparing, onToggleWishlist, onToggleCompare }) {
  return (
    <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', border: '1px solid var(--border-color)' }}>
      <div style={{ width: '220px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
        <img src={p.images[0]} alt={p.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '160px', transition: 'transform 0.4s' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e  => e.currentTarget.style.transform = 'scale(1)'}
        />
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(11,15,25,0.85)', padding: '3px 8px', borderRadius: '6px',
          fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase',
        }}>{p.propertyType}</span>
      </div>

      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>{p.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <MapPin size={13} style={{ color: 'var(--primary)' }} />
                {p.address}, {p.city}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatBDT(p.pricing)}
                {p.propertyType === 'RENTAL' && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/mo</span>}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.areaSize} sq ft</div>
            </div>
          </div>
          <p style={{
            fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.55',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', marginTop: '10px',
          }}>{p.description}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {p.numberOfBedrooms  > 0 && <Stat icon={<BedDouble size={13} style={{ color: 'var(--primary)' }} />} label={`${p.numberOfBedrooms} Beds`} />}
            {p.numberOfBathrooms > 0 && <Stat icon={<Bath size={13} style={{ color: 'var(--primary)' }} />}     label={`${p.numberOfBathrooms} Baths`} />}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--secondary)', fontWeight: 600 }}>
              <ShieldCheck size={13} /> Verified
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => onToggleCompare(p)} title="Compare" style={{
              padding: '7px 10px', borderRadius: '8px', cursor: 'pointer',
              background: isComparing ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isComparing ? 'var(--accent)' : 'var(--border-color)'}`,
              color: isComparing ? 'var(--accent)' : 'var(--text-muted)',
            }}><GitCompare size={14} /></button>
            <button onClick={() => onToggleWishlist(p.id)} title={isWishlisted ? 'Remove' : 'Add to Wishlist'} style={{
              padding: '7px 10px', borderRadius: '8px', cursor: 'pointer',
              background: isWishlisted ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isWishlisted ? 'var(--danger)' : 'var(--border-color)'}`,
              color: isWishlisted ? 'var(--danger)' : 'var(--text-muted)',
            }}><Heart size={14} fill={isWishlisted ? 'var(--danger)' : 'none'} /></button>
            <Link to={`/property/${p.id}`} className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
              <Eye size={14} /> View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Helpers ───────────────────────────── */
function Stat({ icon, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {icon}{label}
    </span>
  );
}

function ActionBtn({ active, activeColor, activeBorder, onClick, title, children }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: '32px', height: '32px', borderRadius: '8px',
      background: active ? activeColor : 'rgba(11,15,25,0.75)',
      border: `1px solid ${active ? activeBorder : 'rgba(255,255,255,0.15)'}`,
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', backdropFilter: 'blur(4px)',
    }}>
      {children}
    </button>
  );
}
