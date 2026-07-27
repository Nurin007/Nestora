import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, X, Eye, BedDouble, Bath } from 'lucide-react';

const TYPES = ['RESIDENTIAL', 'COMMERCIAL', 'RENTAL', 'LAND'];

const formatBDT = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value);

export default function MapView({ properties }) {
  const mapRef      = useRef(null);  // DOM container
  const leafletMap  = useRef(null);  // Leaflet map instance
  const markersRef  = useRef([]);    // Leaflet marker instances
  const navigate    = useNavigate();

  const [typeFilter, setTypeFilter]   = useState('');
  const [cityFilter, setCityFilter]   = useState('');
  const [selected,   setSelected]     = useState(null);   // property shown in side-panel
  const [mapReady,   setMapReady]     = useState(false);
  const [leafletErr, setLeafletErr]   = useState(false);

  const approved = properties.filter(p => p.verificationStatus === 'APPROVED');

  const filtered = approved.filter(p => {
    if (typeFilter && p.propertyType !== typeFilter) return false;
    if (cityFilter && p.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    return true;
  });

  const cities = [...new Set(approved.map(p => p.city))].sort();

  // ── Type badge colour ─────────────────────────────────────────
  const typeColor = (t) => ({
    RESIDENTIAL: '#cca353',
    COMMERCIAL:  '#6366f1',
    RENTAL:      '#10b981',
    LAND:        '#f59e0b',
  }[t] || '#cca353');

  // ── Load Leaflet from CDN once ────────────────────────────────
  useEffect(() => {
    if (window.L) { setMapReady(true); return; }

    const link = document.createElement('link');
    link.rel   = 'stylesheet';
    link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script    = document.createElement('script');
    script.src      = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async    = true;
    script.onload   = () => setMapReady(true);
    script.onerror  = () => setLeafletErr(true);
    document.head.appendChild(script);

    return () => { /* leave CDN assets intact across page visits */ };
  }, []);

  // ── Initialise map once Leaflet is ready ──────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current || leafletMap.current) return;

    const L = window.L;

    leafletMap.current = L.map(mapRef.current, {
      center: [23.8103, 90.4125],   // Dhaka, Bangladesh
      zoom: 10,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(leafletMap.current);
  }, [mapReady]);

  // ── Rebuild markers whenever filters or map change ────────────
  useEffect(() => {
    if (!mapReady || !leafletMap.current) return;

    const L   = window.L;
    const map = leafletMap.current;

    // Remove existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filtered.forEach(p => {
      if (!p.locationLat || !p.locationLong) return;

      const color = typeColor(p.propertyType);

      // Custom SVG pin
      const icon = L.divIcon({
        className: '',
        iconSize:  [34, 44],
        iconAnchor:[17, 44],
        html: `
          <div style="
            width:34px;height:44px;position:relative;
            filter:drop-shadow(0 3px 6px rgba(0,0,0,.55));
            cursor:pointer;
          ">
            <svg viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27S34 29.75 34 17C34 7.6 26.4 0 17 0z"
                    fill="${color}" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
              <circle cx="17" cy="17" r="7" fill="rgba(0,0,0,0.25)"/>
            </svg>
          </div>`,
      });

      const marker = L.marker([p.locationLat, p.locationLong], { icon })
        .addTo(map)
        .on('click', () => setSelected(p));

      markersRef.current.push(marker);
    });
  }, [mapReady, filtered.length, typeFilter, cityFilter]); // eslint-disable-line

  // ── Pan to selected property ──────────────────────────────────
  useEffect(() => {
    if (!selected || !leafletMap.current) return;
    if (selected.locationLat && selected.locationLong) {
      leafletMap.current.setView([selected.locationLat, selected.locationLong], 14, { animate: true });
    }
  }, [selected]);

  return (
    <div style={{ height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top control bar ─────────────────────────────────────── */}
      <div style={{
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-dark)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem' }}>
          <MapPin size={18} style={{ color: 'var(--primary)' }} />
          Property Map
          <span style={{
            background: 'rgba(204,163,83,0.15)',
            color: 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '20px',
          }}>
            {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />

          {/* City filter */}
          <select
            id="map-filter-city"
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: '10px',
              padding: '7px 12px',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Type filter */}
          <select
            id="map-filter-type"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: '10px',
              padding: '7px 12px',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <option value="">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
          </select>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: '12px' }}>
            {TYPES.map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: typeColor(t), display: 'inline-block' }} />
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Map + Side Panel ────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Map container */}
        {leafletErr ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', gap: '16px',
          }}>
            <MapPin size={48} style={{ opacity: 0.2 }} />
            <p>Map could not be loaded. Please check your internet connection.</p>
          </div>
        ) : (
          <div ref={mapRef} style={{ flex: 1, height: '100%', background: '#111827' }}>
            {!mapReady && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                zIndex: 1, color: 'var(--text-muted)', flexDirection: 'column', gap: '12px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '3px solid rgba(204,163,83,0.2)',
                  borderTopColor: 'var(--primary)',
                  animation: 'spin 1s linear infinite',
                }} />
                <span style={{ fontSize: '0.9rem' }}>Loading map…</span>
              </div>
            )}
          </div>
        )}

        {/* ── Side panel: selected property ─────────────────────── */}
        {selected && (
          <div className="glass animate-fade-in" style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '310px',
            borderRadius: '20px',
            overflow: 'hidden',
            zIndex: 1000,
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            {/* Property image */}
            <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
              <img
                src={selected.images[0]}
                alt={selected.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: 'absolute', top: '10px', right: '10px',
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'rgba(0,0,0,0.65)', border: 'none',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={14} />
              </button>
              <span style={{
                position: 'absolute', bottom: '10px', left: '10px',
                background: typeColor(selected.propertyType),
                padding: '3px 10px', borderRadius: '6px',
                fontSize: '0.7rem', fontWeight: 700, color: '#fff',
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{selected.propertyType}</span>
            </div>

            {/* Info */}
            <div style={{ padding: '18px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>
                {formatBDT(selected.pricing)}
                {selected.propertyType === 'RENTAL' && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span>
                )}
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', lineHeight: '1.3' }}>
                {selected.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '12px' }}>
                <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                {selected.address}, {selected.city}
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {selected.numberOfBedrooms > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BedDouble size={13} style={{ color: 'var(--primary)' }} />
                    {selected.numberOfBedrooms} Beds
                  </span>
                )}
                {selected.numberOfBathrooms > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Bath size={13} style={{ color: 'var(--primary)' }} />
                    {selected.numberOfBathrooms} Baths
                  </span>
                )}
                <span style={{ color: 'var(--text-muted)' }}>{selected.areaSize} sq ft</span>
              </div>

              {/* Amenity chips */}
              {selected.amenities?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {selected.amenities.slice(0, 4).map(a => (
                    <span key={a} style={{
                      padding: '3px 9px', borderRadius: '20px', fontSize: '0.7rem',
                      background: 'rgba(204,163,83,0.1)', color: 'var(--primary)',
                      border: '1px solid rgba(204,163,83,0.2)',
                    }}>{a}</span>
                  ))}
                  {selected.amenities.length > 4 && (
                    <span style={{ padding: '3px 9px', borderRadius: '20px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      +{selected.amenities.length - 4} more
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => navigate(`/property/${selected.id}`)}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px' }}
              >
                <Eye size={15} /> View Full Details
              </button>
            </div>
          </div>
        )}

        {/* No-data overlay */}
        {mapReady && filtered.length === 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(11,15,25,0.9)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '28px 36px',
            textAlign: 'center',
            zIndex: 500,
          }}>
            <MapPin size={32} style={{ opacity: 0.3, marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No properties match your current filters.
            </p>
          </div>
        )}
      </div>

      {/* Leaflet map override: ensure map tiles render above z-index issues */}
      <style>{`
        .leaflet-container { background: #111827; }
        .leaflet-control-attribution { font-size: 10px !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
